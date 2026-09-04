/**
 * filings4u wizard runtime core
 * Required by the current wizard.html before step-1.js ... step-8.js.
 *
 * This restores the runtime object expected by the existing step modules:
 * window.F4UWizard
 */
(function () {
  "use strict";

  const STORAGE_KEY = "f4u_wizard_runtime_state_v1";
  const SERVICE_BASE = "assets/js/";

  const state = {
    jurisdiction: "",
    addons: [],
    authorization: {},
    answers: {},
    verifiedPayment: null
  };

  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") Object.assign(state, saved);
  } catch (_) {}

  function persist() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function title(value) {
    return String(value ?? "")
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function money(value) {
    const n = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(Number.isFinite(n) ? n : 0);
  }

  function params() {
    return new URLSearchParams(location.search);
  }

  function refreshRoute() {
    const p = params();
    const serviceKey = String(p.get("service") || "").toLowerCase().trim();
    const planKey = String(p.get("plan") || "").toLowerCase().trim();
    const service = (window.CENTRAL_SERVICE_PLAN_DB || {})[serviceKey] || null;

    const government =
      !!service &&
      (service.requiresJurisdiction === false || service.serviceType === "government");

    const jurisdiction = government
      ? ""
      : String(p.get("state") || state.jurisdiction || "").toUpperCase().trim();

    state.jurisdiction = jurisdiction;
    persist();

    return {
      serviceKey,
      planKey,
      service,
      government,
      jurisdiction
    };
  }

  function stateOptions(selectedValue) {
    const selected = String(selectedValue || "").toUpperCase();
    const fees = window.STATE_FILING_FEES || {};

    return Object.keys(fees)
      .sort((a, b) => {
        const an = String(fees[a]?.name || a);
        const bn = String(fees[b]?.name || b);
        return an.localeCompare(bn);
      })
      .map(code => {
        const name = fees[code]?.name || code;
        return `<option value="${esc(code)}"${code === selected ? " selected" : ""}>${esc(name)}</option>`;
      })
      .join("");
  }

  function setJurisdiction(value) {
    const code = String(value || "").toUpperCase().trim();
    if (!/^[A-Z]{2}$/.test(code)) return false;

    state.jurisdiction = code;
    persist();

    const url = new URL(location.href);
    url.searchParams.set("state", code);
    history.replaceState({}, "", url.pathname + "?" + url.searchParams.toString());
    return true;
  }

  function updateProgress(step) {
    const safeStep = Math.min(8, Math.max(1, Number(step) || 1));
    const pct = Math.round((safeStep / 8) * 100);

    const stepLabel =
      document.querySelector(".wizard-progress-step-label") ||
      document.querySelector("[data-progress-step]");

    const percent =
      document.querySelector(".wizard-progress-percentage") ||
      document.querySelector("[data-progress-percent]");

    const bar =
      document.querySelector(".wizard-progress-fill") ||
      document.querySelector(".progress-bar-fill") ||
      document.querySelector("[data-progress-fill]");

    if (stepLabel) stepLabel.textContent = `STEP ${safeStep} OF 8`;
    if (percent) percent.textContent = `${pct}%`;
    if (bar) bar.style.width = `${pct}%`;

    const labels = [
      "",
      "Getting started",
      "Package review",
      "Business information",
      "Add-ons",
      "Authorization",
      "Review",
      "Secure checkout",
      "Success"
    ];

    const titleNode =
      document.querySelector(".wizard-progress-title") ||
      document.querySelector("[data-progress-title]");

    if (titleNode && labels[safeStep]) titleNode.textContent = labels[safeStep];
  }

  async function renderStep(step) {
    const fn = window[`renderWizardStep${step}`];
    if (typeof fn === "function") {
      await Promise.resolve(fn());
    }
  }

  async function go(step) {
    const target = Math.min(8, Math.max(1, Number(step) || 1));

    document.querySelectorAll(".wizard-panel").forEach(panel => {
      const isTarget = panel.id === `step-panel-${target}`;
      panel.classList.toggle("active", isTarget);
      panel.hidden = !isTarget;
      panel.style.display = isTarget ? "block" : "none";
    });

    updateProgress(target);
    await renderStep(target);

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {
      window.scrollTo(0, 0);
    }

    document.dispatchEvent(
      new CustomEvent("f4u:wizard-step-change", { detail: { step: target } })
    );

    return target;
  }

  function fieldKey(el) {
    return el.id || el.name || "";
  }

  function captureAnswers(root) {
    if (!root) return state.answers;

    root.querySelectorAll("input,select,textarea").forEach(el => {
      const key = fieldKey(el);
      if (!key) return;

      if (el.type === "checkbox") {
        state.answers[key] = !!el.checked;
      } else if (el.type === "radio") {
        if (el.checked) state.answers[key] = el.value;
      } else {
        state.answers[key] = el.value;
      }
    });

    persist();

    window.currentOrderCorePayload = window.currentOrderCorePayload || {};
    window.currentOrderCorePayload.form_payload = Object.assign(
      {},
      window.currentOrderCorePayload.form_payload || {},
      { service_answers: { ...state.answers } }
    );

    return state.answers;
  }

  function restoreAnswers(root) {
    if (!root) return;

    root.querySelectorAll("input,select,textarea").forEach(el => {
      const key = fieldKey(el);
      if (!key || !(key in state.answers)) return;

      const value = state.answers[key];

      if (el.type === "checkbox") {
        el.checked = !!value;
      } else if (el.type === "radio") {
        el.checked = String(el.value) === String(value);
      } else {
        el.value = value ?? "";
      }
    });
  }

  function validateRequired(root) {
    if (!root) return true;

    const required = Array.from(root.querySelectorAll("[required]"));
    for (const el of required) {
      let valid = true;

      if (el.type === "checkbox") valid = el.checked;
      else valid = String(el.value || "").trim() !== "";

      if (!valid) {
        el.style.setProperty("border-color", "#ef4444", "important");
        el.style.setProperty("box-shadow", "0 0 0 4px rgba(239,68,68,.10)", "important");
        el.focus();
        return false;
      }

      el.style.removeProperty("border-color");
      el.style.removeProperty("box-shadow");
    }

    return true;
  }

  let serviceModulePromise = null;
  let discoveredRenderer = null;
  let discoveredValidator = null;

  function serviceModuleUrl() {
    const r = refreshRoute();
    return r.serviceKey ? `${SERVICE_BASE}${encodeURIComponent(r.serviceKey)}.js` : "";
  }

  function findRenderer(beforeFns) {
    const candidates = Object.keys(window).filter(key => {
      if (beforeFns.has(key)) return false;
      if (typeof window[key] !== "function") return false;
      return /^build/i.test(key) && /(field|form|layout|html|application)/i.test(key);
    });

    const preferred = candidates.find(key => /LayoutHtml$/i.test(key)) ||
                      candidates.find(key => /Fields.*Html/i.test(key)) ||
                      candidates[0];

    return preferred ? window[preferred] : null;
  }

  function findValidator(beforeObjs) {
    const candidates = Object.keys(window).filter(key => {
      if (beforeObjs.has(key)) return false;
      const value = window[key];
      return value && typeof value === "object" && typeof value.validate === "function";
    });

    const preferred = candidates.find(key => /validation$/i.test(key)) || candidates[0];
    return preferred ? window[preferred] : null;
  }

  function ensureServiceModule() {
    if (serviceModulePromise) return serviceModulePromise;

    const src = serviceModuleUrl();
    if (!src) {
      serviceModulePromise = Promise.resolve(false);
      return serviceModulePromise;
    }

    const beforeFns = new Set(
      Object.keys(window).filter(key => typeof window[key] === "function")
    );
    const beforeObjs = new Set(
      Object.keys(window).filter(key => {
        const v = window[key];
        return v && typeof v === "object" && typeof v.validate === "function";
      })
    );

    serviceModulePromise = new Promise(resolve => {
      const existing = document.querySelector(`script[data-f4u-service-module="${CSS.escape(src)}"]`);
      if (existing) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.f4uServiceModule = src;

      script.onload = () => {
        discoveredRenderer = findRenderer(beforeFns);
        discoveredValidator = findValidator(beforeObjs);
        resolve(true);
      };

      script.onerror = () => {
        console.error("[filings4u] Could not load service module:", src);
        resolve(false);
      };

      document.head.appendChild(script);
    });

    return serviceModulePromise;
  }

  function currentServiceRenderer() {
    return async function () {
      await ensureServiceModule();

      if (!discoveredRenderer) {
        // Fallback scan for older modules that were already loaded.
        const route = refreshRoute();
        const slugWords = route.serviceKey
          .split("-")
          .map(x => x.charAt(0).toUpperCase() + x.slice(1))
          .join("");

        const likelyNames = [
          `build${slugWords}FieldsLayoutHtml`,
          `build${slugWords}OrganizationFieldsLayoutHtml`,
          `build${slugWords}ApplicationHtml`,
          `build${slugWords}LayoutHtml`
        ];

        for (const name of likelyNames) {
          if (typeof window[name] === "function") {
            discoveredRenderer = window[name];
            break;
          }
        }
      }

      if (typeof discoveredRenderer !== "function") {
        throw new Error("The service-specific application renderer could not be found.");
      }

      return discoveredRenderer.apply(window, arguments);
    };
  }

  function currentServiceValidator() {
    return discoveredValidator;
  }

  async function initialPaint() {
    // The access gate can delay boot past DOMContentLoaded, so poll briefly until
    // the step module has actually been injected by wizard.html.
    const started = Date.now();

    while (typeof window.renderWizardStep1 !== "function") {
      if (Date.now() - started > 3000) {
        console.error("[filings4u] Step 1 renderer did not load.");
        return;
      }
      await new Promise(r => setTimeout(r, 20));
    }

    ensureServiceModule();
    go(1);
  }

  window.F4UWizard = Object.freeze({
    state,
    esc,
    title,
    money,
    refreshRoute,
    stateOptions,
    setJurisdiction,
    go,
    captureAnswers,
    restoreAnswers,
    validateRequired,
    currentServiceRenderer,
    currentServiceValidator
  });

  window.currentOrderCorePayload = window.currentOrderCorePayload || {};

  // Do not wait for DOMContentLoaded; the secure access check may already have
  // delayed the page beyond that event.
  setTimeout(initialPaint, 0);
})();
