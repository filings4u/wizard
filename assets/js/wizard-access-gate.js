/**
 * filings4u Wizard Access Gate
 * WIZARD REPO ONLY.
 *
 * IMPORTANT:
 * This gate does NOT depend on the wizard Supabase client being initialized.
 * It verifies the handoff directly against the wizard-handoff Edge Function
 * before any wizard application JavaScript is allowed to boot.
 */
(function () {
  "use strict";

  const CONFIG = Object.freeze({
    fallback: "https://filings4u.com/get-started.html",
    endpoint: "https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-handoff",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmltcmxic2tqd2V5bnhsZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjQ0NTYsImV4cCI6MjA5NDEwMDQ1Nn0.I8fQ6ZjA9oaTqJCF-7Z7vUboXC8zv2cogBv4PC_1ihU",
    sessionKey: "f4u_wizard_session_token",
    contextKey: "f4u_verified_wizard_handoff"
  });

  function safeReturn(value) {
    try {
      const url = new URL(String(value || ""));

      if (url.protocol !== "https:") {
        return CONFIG.fallback;
      }

      if (!["filings4u.com", "www.filings4u.com"].includes(url.hostname)) {
        return CONFIG.fallback;
      }

      return url.toString();
    } catch (_) {
      return CONFIG.fallback;
    }
  }

  async function request(body) {
    const response = await fetch(CONFIG.endpoint, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "apikey": CONFIG.anonKey,
        "Authorization": "Bearer " + CONFIG.anonKey
      },
      body: JSON.stringify(body)
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch (_) {}

    if (!response.ok) {
      throw new Error(
        payload?.error ||
        "Wizard access verification returned HTTP " + response.status + "."
      );
    }

    if (!payload?.ok || !payload?.session) {
      throw new Error("Wizard access was not verified.");
    }

    return payload;
  }

  function installContext(data) {
    const session = data.session || {};

    const verified = Object.freeze({
      handoff_id: session.handoff_id || null,
      service: String(session.service || "").trim().toLowerCase(),
      plan: String(session.plan || "").trim().toLowerCase(),
      state: String(session.state || "").trim().toUpperCase(),
      return_url: safeReturn(session.return_url),
      expires_at: session.expires_at || null
    });

    if (!verified.service || !verified.plan) {
      throw new Error("The verified handoff is missing service or package information.");
    }

    if (data.session_token) {
      sessionStorage.setItem(CONFIG.sessionKey, data.session_token);
    }

    sessionStorage.setItem(
      CONFIG.contextKey,
      JSON.stringify(verified)
    );

    window.F4U_VERIFIED_HANDOFF = verified;

    /*
     * Compatibility bridge:
     * The restored original wizard reads service/plan/state from the URL.
     * These values are inserted ONLY after the backend verifies the handoff.
     */
    const current = new URL(window.location.href);

    current.searchParams.delete("handoff");
    current.searchParams.set("service", verified.service);
    current.searchParams.set("plan", verified.plan);

    if (verified.state) {
      current.searchParams.set("state", verified.state);
    } else {
      current.searchParams.delete("state");
    }

    history.replaceState(
      {},
      "",
      current.pathname + "?" + current.searchParams.toString()
    );

    function wireBackButton() {
      const back =
        document.querySelector(".wizard-shell-topbar__back") ||
        document.querySelector("[data-wizard-back]") ||
        Array.from(document.querySelectorAll("a")).find(function (anchor) {
          return /back to services?/i.test(anchor.textContent || "");
        });

      if (back) {
        back.href = verified.return_url;
        back.textContent = "← Back to service";
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        wireBackButton,
        { once: true }
      );
    } else {
      wireBackButton();
    }

    document.documentElement.dataset.wizardAccess = "verified";

    document.dispatchEvent(
      new CustomEvent("f4u:wizard-access-ready", {
        detail: verified
      })
    );

    console.log(
      "[filings4u] Secure wizard handoff verified:",
      verified.service,
      verified.plan
    );

    return verified;
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(CONFIG.sessionKey);
      sessionStorage.removeItem(CONFIG.contextKey);
    } catch (_) {}
  }

  function deny(reason) {
    clearSession();

    if (reason) {
      console.warn("[filings4u] Wizard access denied:", reason);
    }

    window.location.replace(CONFIG.fallback);

    /*
     * Keep the boot promise pending while navigation leaves this page,
     * so no wizard application script can start after denial.
     */
    return new Promise(function () {});
  }

  async function verify() {
    const url = new URL(window.location.href);
    const handoffToken = url.searchParams.get("handoff");

    try {
      /*
       * First visit from a marketing service page:
       * consume the single-use transport token.
       */
      if (handoffToken) {
        const result = await request({
          action: "consume",
          token: handoffToken
        });

        return installContext(result);
      }

      /*
       * Page refresh/navigation inside the wizard:
       * resume against the backend-issued continuation token.
       */
      const sessionToken =
        sessionStorage.getItem(CONFIG.sessionKey);

      if (sessionToken) {
        const result = await request({
          action: "resume",
          session_token: sessionToken
        });

        return installContext(result);
      }

      return deny("No verified handoff token or wizard session was found.");

    } catch (error) {
      return deny(error?.message || error);
    }
  }

  /*
   * This promise is the boot barrier used by wizard.html.
   * All original wizard application scripts wait for it.
   */
  window.F4UWizardAccessReady = verify();
})();
