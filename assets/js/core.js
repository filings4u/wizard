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
  const US_STATES = Object.freeze({
    AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"
  });
  const STATE_CODES = Object.freeze(Object.fromEntries(Object.entries(US_STATES).map(([code,name])=>[name.toLowerCase(),code])));
  function stateName(value){ const raw=String(value||'').trim(); if(!raw)return ''; return US_STATES[raw.toUpperCase()]||raw.replace(/\b\w/g,c=>c.toUpperCase()); }
  function stateCode(value){ const raw=String(value||'').trim(); if(!raw)return ''; const upper=raw.toUpperCase(); return US_STATES[upper]?upper:(STATE_CODES[raw.toLowerCase()]||''); }
  const GOVERNMENT_ONLY_SERVICES = new Set([
    "clia-certificate",
    "payroll-tax-940-941",
    "duns-number"
  ]);


  const state = {
    jurisdiction: "",
    addons: [],
    authorization: {},
    answers: {},
    verifiedPayment: null,
    currentStep: 1,
    routeKey: ""
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
      (GOVERNMENT_ONLY_SERVICES.has(serviceKey) ||
       service.requiresJurisdiction === false ||
       service.serviceType === "government");

    const jurisdiction = government
      ? ""
      : stateName(p.get("state") || state.jurisdiction || "");

    const normalizedCode = government ? "FEDERAL" : stateCode(jurisdiction);
    const routeKey = [serviceKey, planKey, normalizedCode].join("|");

    // A new product/package/jurisdiction is a new application. Do not leak
    // answers or add-ons from a previous order into it. Refreshes of the same
    // route preserve everything.
    if (state.routeKey && routeKey && state.routeKey !== routeKey) {
      state.addons = [];
      state.authorization = {};
      state.answers = {};
      state.verifiedPayment = null;
      state.currentStep = 1;
    }
    if (routeKey) state.routeKey = routeKey;

    const normalizedUrl = new URL(location.href);
    if (government) {
      if (normalizedUrl.searchParams.has("state")) {
        normalizedUrl.searchParams.delete("state");
        history.replaceState(history.state || {}, "", normalizedUrl.pathname + "?" + normalizedUrl.searchParams.toString());
      }
    } else if (jurisdiction && p.get("state") !== jurisdiction) {
      normalizedUrl.searchParams.set("state", jurisdiction);
      history.replaceState(history.state || {}, "", normalizedUrl.pathname + "?" + normalizedUrl.searchParams.toString());
    }

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
    const selectedName = stateName(selectedValue);
    const fees = window.STATE_FILING_FEES || {};
    return Object.keys(US_STATES)
      .sort((a,b)=>US_STATES[a].localeCompare(US_STATES[b]))
      .map(code=>{ const name=fees[code]?.name||US_STATES[code]; return `<option value="${esc(name)}"${name===selectedName?' selected':''}>${esc(name)}</option>`; })
      .join("");
  }

  function setJurisdiction(value) {
    const name = stateName(value);
    const code = stateCode(value);
    if (!name || !code) return false;
    state.jurisdiction = name;
    persist();
    const url = new URL(location.href);
    url.searchParams.set("state", name);
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

    const exactStepText = document.getElementById("wizard-progress-step-text");
    const exactTitle = document.getElementById("wizard-progress-title");
    const exactPercent = document.getElementById("wizard-progress-percent");
    const exactMeter = document.getElementById("wizard-progress-meter");
    const exactFloating = document.getElementById("wizard-floating-step-label");
    if (exactStepText) exactStepText.textContent = `Step ${safeStep} of 8`;
    if (exactTitle && labels[safeStep]) exactTitle.textContent = labels[safeStep];
    if (exactPercent) exactPercent.textContent = `${pct}%`;
    if (exactMeter) exactMeter.style.width = `${pct}%`;
    if (exactFloating) exactFloating.textContent = `Step ${safeStep} of 8`;
  }

  async function renderStep(step) {
    const fn = window[`renderWizardStep${step}`];
    if (typeof fn === "function") {
      await Promise.resolve(fn());
    }
  }

  async function go(step) {
    const target = Math.min(8, Math.max(1, Number(step) || 1));
    state.currentStep = target;
    window.currentWizardActiveStep = target;
    persist();

    document.querySelectorAll(".wizard-panel").forEach(panel => {
      const isTarget = panel.id === `step-panel-${target}`;
      panel.classList.toggle("active", isTarget);
      panel.hidden = !isTarget;
      panel.style.display = isTarget ? "block" : "none";
    });

    updateProgress(target);
    await renderStep(target);

    try {
      window.scrollTo({ top: 0, behavior: "auto" });
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
      if (el.disabled) {
        delete state.answers[key];
        return;
      }

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

  function modal(options = {}) {
    const old = document.getElementById("f4u-brand-modal-root");
    if (old) old.remove();
    const root = document.createElement("div");
    root.id = "f4u-brand-modal-root";
    root.className = "f4u-brand-modal";
    root.innerHTML = `
      <div class="f4u-brand-modal__backdrop" data-f4u-modal-close></div>
      <section class="f4u-brand-modal__card" role="dialog" aria-modal="true" aria-labelledby="f4u-modal-title">
        <button class="f4u-brand-modal__close" type="button" data-f4u-modal-close aria-label="Close">×</button>
        <span class="f4u-brand-modal__kicker">filings4u Secure Wizard</span>
        <h2 id="f4u-modal-title">${esc(options.title || "Action required")}</h2>
        <div class="f4u-brand-modal__body">${options.html || `<p>${esc(options.message || "Please review the information below.")}</p>`}</div>
        <div class="f4u-brand-modal__actions">
          ${options.cancel === false ? "" : `<button type="button" class="btn-wizard-secondary" data-f4u-modal-close>${esc(options.cancelText || "Close")}</button>`}
          ${options.confirmText ? `<button type="button" class="btn-wizard-main" id="f4u-brand-modal-confirm">${esc(options.confirmText)}</button>` : ""}
        </div>
      </section>`;
    document.body.appendChild(root);
    const close = () => root.remove();
    root.querySelectorAll("[data-f4u-modal-close]").forEach(x => x.addEventListener("click", close));
    root.querySelector("#f4u-brand-modal-confirm")?.addEventListener("click", () => {
      if (typeof options.onConfirm === "function") options.onConfirm(close, root);
      else close();
    });
    return root;
  }

  function notify(titleText, message, type = "info") {
    return modal({
      title: titleText,
      html: `<div class="f4u-modal-status f4u-modal-status--${esc(type)}">${esc(message)}</div>`,
      cancelText: "Got it"
    });
  }

  let serviceModulePromise = null;
  let serviceModuleSrc = "";
  let discoveredRenderer = null;
  let discoveredValidator = null;

  function serviceModuleUrl() {
    const r = refreshRoute();
    return r.serviceKey ? `${SERVICE_BASE}${encodeURIComponent(r.serviceKey)}.js` : "";
  }

  function safeWindowValue(key) {
    try {
      return window[key];
    } catch (_) {
      // Named cross-origin frames can appear as Window properties. Reading them
      // may throw a SecurityError, so service discovery must ignore them.
      return undefined;
    }
  }

  function findRenderer(beforeFns) {
    const route = refreshRoute();
    const registry = window.formRegistry || {};
    const master = registry[`${route.serviceKey}-form-master`];
    if (typeof master === "function") return master;

    const aliases = {
      "dbe-certification": "dbe-certificate-form-master",
      "wbe-certification": "woman-owned-certificate-form-master"
    };
    if (aliases[route.serviceKey] && typeof registry[aliases[route.serviceKey]] === "function") {
      return registry[aliases[route.serviceKey]];
    }

    const candidates = Object.keys(window).filter(key => {
      if (beforeFns.has(key)) return false;
      const value = safeWindowValue(key);
      if (typeof value !== "function") return false;
      return /^build/i.test(key) && /(field|form|layout|html|application)/i.test(key);
    });

    const preferred = candidates.find(key => /FormMaster$/i.test(key)) ||
                      candidates.find(key => /Fields.*LayoutHtml$/i.test(key)) ||
                      candidates.find(key => /Form$/i.test(key)) ||
                      candidates.find(key => /LayoutHtml$/i.test(key)) ||
                      candidates[0];

    return preferred ? safeWindowValue(preferred) : null;
  }

  function findValidator(beforeObjs) {
    const route = refreshRoute();
    const registry = window.formRegistry || {};
    const exact = registry[`${route.serviceKey}-validation-engine`] || registry[`${route.serviceKey}-validation`];
    if (exact && typeof exact.validate === "function") return exact;
    const candidates = Object.keys(window).filter(key => {
      if (beforeObjs.has(key)) return false;
      const value = safeWindowValue(key);
      return value && typeof value === "object" && typeof value.validate === "function";
    });

    const preferred = candidates.find(key => /validation$/i.test(key)) || candidates[0];
    return preferred ? safeWindowValue(preferred) : null;
  }

  function ensureServiceModule() {
    const src = serviceModuleUrl();
    if (serviceModulePromise && serviceModuleSrc === src) return serviceModulePromise;
    if (serviceModuleSrc !== src) {
      serviceModulePromise = null;
      serviceModuleSrc = src;
      discoveredRenderer = null;
      discoveredValidator = null;
    }

    if (!src) {
      serviceModulePromise = Promise.resolve(false);
      return serviceModulePromise;
    }

    const beforeFns = new Set(
      Object.keys(window).filter(key => typeof safeWindowValue(key) === "function")
    );
    const beforeObjs = new Set(
      Object.keys(window).filter(key => {
        const v = safeWindowValue(key);
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

      // The modern service modules register into window.formRegistry through
      // service-form-engine.js. Re-check the exact registry key after the
      // dynamic service script has executed so renderer resolution is
      // deterministic and does not depend on global function discovery.
      const route = refreshRoute();
      const registry = window.formRegistry || {};
      const exactRenderer = registry[`${route.serviceKey}-form-master`];
      if (typeof exactRenderer === "function") {
        discoveredRenderer = exactRenderer;
      }
      const exactValidator =
        registry[`${route.serviceKey}-validation-engine`] ||
        registry[`${route.serviceKey}-validation`];
      if (exactValidator && typeof exactValidator.validate === "function") {
        discoveredValidator = exactValidator;
      }

      if (!discoveredRenderer) {
        // Fallback scan for older modules that were already loaded.
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
          const candidate = safeWindowValue(name);
          if (typeof candidate === "function") {
            discoveredRenderer = candidate;
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

  let booted = false;
  function installNavigationGuard() {
    if (window.__F4U_NAV_GUARD_INSTALLED) return;
    window.__F4U_NAV_GUARD_INSTALLED = true;
    try {
      history.replaceState({ ...(history.state || {}), f4uWizard: true }, "", location.href);
      history.pushState({ f4uWizard: true }, "", location.href);
      window.addEventListener("popstate", function () {
        try { history.pushState({ f4uWizard: true }, "", location.href); } catch (_) {}
      });
    } catch (_) {}
  }

  async function initialPaint() {
    if (booted) return;
    booted = true;
    installNavigationGuard();
    const route = refreshRoute();
    await ensureServiceModule();
    let target = Math.min(8, Math.max(1, Number(state.currentStep) || 1));
    if (!route.government && !route.jurisdiction && target > 1) target = 1;
    await go(target);
  }

  window.F4UWizard = Object.freeze({
    state,
    esc,
    title,
    money,
    refreshRoute,
    stateOptions,
    stateName,
    stateCode,
    setJurisdiction,
    go,
    captureAnswers,
    restoreAnswers,
    validateRequired,
    currentServiceRenderer,
    currentServiceValidator,
    modal,
    notify,
    persist,
    boot: initialPaint
  });

  window.currentOrderCorePayload = window.currentOrderCorePayload || {};

})();
