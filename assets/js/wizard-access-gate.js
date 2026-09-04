/**
 * filings4u Wizard Access Gate
 * WIZARD REPO ONLY.
 *
 * Must load after supabase-client.js and before every wizard core/step script.
 * Direct entry without a verified handoff is returned to Get Started.
 */
(function () {
  "use strict";

  const FALLBACK = "https://filings4u.com/get-started.html";
  const SESSION_KEY = "f4u_wizard_session_token";
  const CONTEXT_KEY = "f4u_verified_wizard_handoff";

  function safeReturn(value) {
    try {
      const u = new URL(String(value || ""));
      if (u.protocol !== "https:") return FALLBACK;
      if (!["filings4u.com", "www.filings4u.com"].includes(u.hostname)) return FALLBACK;
      return u.toString();
    } catch (_) { return FALLBACK; }
  }

  function supabaseClient() {
    return window.f4uSupabase || window.supabaseClientInstance || null;
  }

  async function invoke(body) {
    const client = supabaseClient();
    if (!client) throw new Error("Supabase client unavailable.");
    const { data, error } = await client.functions.invoke("wizard-handoff", { body });
    if (error) throw error;
    if (!data?.ok || !data?.session) throw new Error("Wizard access was not verified.");
    return data;
  }

  function installContext(data) {
    const s = data.session;
    const verified = Object.freeze({
      handoff_id: s.handoff_id,
      service: String(s.service || "").trim().toLowerCase(),
      plan: String(s.plan || "").trim().toLowerCase(),
      state: String(s.state || "").trim().toUpperCase(),
      return_url: safeReturn(s.return_url),
      expires_at: s.expires_at
    });

    if (!verified.service || !verified.plan) throw new Error("Incomplete handoff.");

    if (data.session_token) {
      sessionStorage.setItem(SESSION_KEY, data.session_token);
    }
    sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(verified));
    window.F4U_VERIFIED_HANDOFF = verified;

    // Compatibility: existing original wizard continues to read service/plan/state
    // from the URL, but these values now come from the server-verified handoff.
    const url = new URL(location.href);
    url.searchParams.delete("handoff");
    url.searchParams.set("service", verified.service);
    url.searchParams.set("plan", verified.plan);
    if (verified.state) url.searchParams.set("state", verified.state);
    else url.searchParams.delete("state");
    history.replaceState({}, "", url.pathname + "?" + url.searchParams.toString());

    // Backward handoff to the exact service page.
    document.addEventListener("DOMContentLoaded", function () {
      const back =
        document.querySelector(".wizard-shell-topbar__back") ||
        document.querySelector('[data-wizard-back]') ||
        Array.from(document.querySelectorAll("a")).find(a =>
          /back to services?/i.test(a.textContent || "")
        );

      if (back) {
        back.href = verified.return_url;
        back.textContent = "← Back to service";
      }
    }, { once: true });

    return verified;
  }

  function deny() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(CONTEXT_KEY);
    } catch (_) {}
    location.replace(FALLBACK);
    return new Promise(function () {});
  }

  async function verify() {
    const url = new URL(location.href);
    const handoff = url.searchParams.get("handoff");

    try {
      if (handoff) {
        return installContext(await invoke({ action: "consume", token: handoff }));
      }

      const sessionToken = sessionStorage.getItem(SESSION_KEY);
      if (sessionToken) {
        return installContext(await invoke({ action: "resume", session_token: sessionToken }));
      }

      return deny();
    } catch (error) {
      console.warn("[filings4u] Wizard access denied:", error);
      return deny();
    }
  }

  // A single promise is the boot barrier for the original wizard.
  window.F4UWizardAccessReady = verify();
})();
