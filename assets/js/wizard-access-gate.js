/**
 * filings4u wizard access gate
 * Lives ONLY in the wizard repo and should load before wizard-master-core.js.
 *
 * No valid handoff/session => return to:
 * https://filings4u.com/get-started.html
 */
(function () {
  "use strict";

  const CONFIG = Object.freeze({
    marketingOrigin: "https://filings4u.com",
    fallback: "https://filings4u.com/get-started.html",
    storageKey: "f4u_verified_wizard_handoff"
  });

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  function safeReturnUrl(value) {
    try {
      const u = new URL(value);
      if (u.protocol !== "https:") return CONFIG.fallback;
      if (u.hostname !== "filings4u.com" && !u.hostname.endsWith(".filings4u.com"))
        return CONFIG.fallback;
      if (u.hostname === "wizard.filings4u.com") return CONFIG.fallback;
      return u.toString();
    } catch (_) {
      return CONFIG.fallback;
    }
  }

  function storedSession() {
    try {
      const value = JSON.parse(sessionStorage.getItem(CONFIG.storageKey) || "null");
      if (!value?.expires_at) return null;
      if (Date.parse(value.expires_at) <= Date.now()) return null;
      if (!value.service || !value.plan) return null;
      return value;
    } catch (_) {
      return null;
    }
  }

  async function consume(token) {
    if (!window.f4uSupabase) throw new Error("Wizard Supabase client unavailable.");

    const { data, error } = await window.f4uSupabase.functions.invoke("wizard-handoff", {
      body: { action: "consume", token }
    });

    if (error) throw error;
    if (!data?.ok || !data?.session) throw new Error("Invalid wizard handoff.");
    return data.session;
  }

  function expose(session) {
    const verified = Object.freeze({
      service: session.service,
      plan: session.plan,
      state: session.state || "",
      return_url: safeReturnUrl(session.return_url),
      expires_at: session.expires_at,
      handoff_id: session.handoff_id
    });

    window.F4U_VERIFIED_HANDOFF = verified;

    // Compatibility with the existing wizard, which currently reads its route
    // from service/plan/state query parameters.
    const url = new URL(location.href);
    url.searchParams.delete("handoff");
    url.searchParams.set("service", verified.service);
    url.searchParams.set("plan", verified.plan);
    if (verified.state) url.searchParams.set("state", verified.state);
    else url.searchParams.delete("state");
    history.replaceState({}, "", url.pathname + "?" + url.searchParams.toString());

    const back = document.querySelector(".wizard-shell-topbar__back");
    if (back) {
      back.href = verified.return_url;
      back.textContent = "← Back to service";
    }

    sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(verified));
    document.documentElement.dataset.wizardAccess = "verified";
    document.dispatchEvent(new CustomEvent("f4u:wizard-access-ready", {
      detail: verified
    }));

    return verified;
  }

  function deny() {
    sessionStorage.removeItem(CONFIG.storageKey);
    location.replace(CONFIG.fallback);
  }

  async function initialize() {
    const url = new URL(location.href);
    const token = url.searchParams.get("handoff");

    try {
      if (token) {
        const session = await consume(token);
        expose(session);
        return;
      }

      const existing = storedSession();
      if (existing) {
        expose(existing);
        return;
      }

      deny();
    } catch (error) {
      console.warn("[filings4u] Wizard access denied:", error);
      deny();
    }
  }

  // The wizard core can await this promise before booting.
  window.F4UWizardAccessReady = initialize();
})();
