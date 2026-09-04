
// ============================================================================ //
// filings4u SMART ENTRY GATE
// State services => jurisdiction selection.
// Government services => selected federal/government service confirmation.
// Both flows merge into Package Review.
// ============================================================================ //
(function renderSmartEntryGate() {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const serviceKey = String(params.get("service") || "").toLowerCase().trim();
  const planKey = String(params.get("plan") || "").toLowerCase().trim();
  const registry = window.CENTRAL_SERVICE_PLAN_DB || {};
  const service = registry[serviceKey];

  const wizardFormWrapper =
    document.querySelector(".wizard-container-wrapper") ||
    document.getElementById("master-onboarding-form") ||
    document.querySelector(".wizard-container") ||
    document.body;

  if (!wizardFormWrapper) {
    setTimeout(renderSmartEntryGate, 50);
    return;
  }

  if (!serviceKey || !planKey) {
    console.error("[Wizard Entry] Missing service or plan query parameter.");
    return;
  }

  if (!service) {
    setTimeout(renderSmartEntryGate, 80);
    return;
  }

  if (document.getElementById("step-panel-0")) return;

  const isGovernment = service.requiresJurisdiction === false || service.serviceType === "government";
  document.documentElement.dataset.wizardFlow = isGovernment ? "government" : "state";
  document.documentElement.dataset.wizardService = serviceKey;
  document.documentElement.dataset.wizardPlan = planKey;

  const panel = document.createElement("div");
  panel.id = "step-panel-0";
  panel.className = "wizard-panel active";
  panel.style.cssText = "display:none;width:100%;box-sizing:border-box;";

  const selectedPrice = Number(service[planKey] || 0);
  const planTitle = planKey.charAt(0).toUpperCase() + planKey.slice(1);

  if (isGovernment) {
    panel.innerHTML = `
      <div class="f4u-entry-layout">
        <div class="f4u-entry-copy">
          <span class="f4u-entry-kicker">Step 1 · Government Service</span>
          <h2>${service.name}</h2>
          <p>This is a federal or government service, so no state jurisdiction selection is required. Your selected package is ready to continue.</p>
        </div>

        <div class="f4u-selection-summary">
          <span>Selected package</span>
          <div>
            <strong>${planTitle}</strong>
            <b>$${selectedPrice.toFixed(2)}</b>
          </div>
        </div>

        <div class="f4u-entry-actions">
          <a class="f4u-change-plan" href="${serviceKey}.html#pricing">← Change package</a>
          <button type="button" class="btn-wizard-main" onclick="window.processSmartGovernmentEntry()">
            Continue to Package Review →
          </button>
        </div>
      </div>
    `;
  } else {
    panel.innerHTML = `
      <div class="f4u-entry-layout">
        <div class="f4u-entry-copy">
          <span class="f4u-entry-kicker">Step 1 · Jurisdiction</span>
          <h2>Select your filing state</h2>
          <p>Choose the state where this filing will be submitted. We’ll use it to calculate the applicable government filing fee and processing time.</p>
        </div>

        <div class="f4u-selection-summary">
          <span>Selected service</span>
          <div>
            <strong>${service.name} · ${planTitle}</strong>
            <b>$${selectedPrice.toFixed(2)}</b>
          </div>
        </div>

        <div class="f4u-state-field">
          <label for="wizard_gate_state_select">Filing jurisdiction</label>
          <select id="wizard_gate_state_select" class="state-dropdown-select"></select>
          <small>Government fees are separate from the filings4u service fee.</small>
        </div>

        <div class="f4u-entry-actions">
          <a class="f4u-change-plan" href="${serviceKey}.html#pricing">← Change package</a>
          <button type="button" class="btn-wizard-main" onclick="window.processJurisdictionGateAdvancement()">
            Continue to Package Review →
          </button>
        </div>
      </div>
    `;
  }

  wizardFormWrapper.insertBefore(panel, wizardFormWrapper.firstChild);

  if (!isGovernment && typeof window.autoDiscoverAndHydrateStateDropdowns === "function") {
    window.autoDiscoverAndHydrateStateDropdowns();
  }
})();

function f4uPrepareCoreEntryPayload(serviceKey, planKey, serviceTitle, jurisdictionValue) {
  window.currentOrderCorePayload = window.currentOrderCorePayload || {};
  window.currentOrderCorePayload.plan_tier = planKey;
  window.currentOrderCorePayload.service_key = serviceKey;
  window.currentOrderCorePayload.service_title = serviceTitle;

  window.currentOrderCorePayload.collected_payload_metadata =
    window.currentOrderCorePayload.collected_payload_metadata || {};

  window.currentOrderCorePayload.collected_payload_metadata.jurisdiction_required =
    jurisdictionValue ? true : false;

  if (jurisdictionValue) {
    window.currentOrderCorePayload.collected_payload_metadata.selected_state_jurisdiction = jurisdictionValue;
  } else {
    delete window.currentOrderCorePayload.collected_payload_metadata.selected_state_jurisdiction;
  }
}

function f4uAdvanceFromEntryGate(serviceKey, planKey) {
  if (typeof window.processDynamicMarketingLayoutDecorations === "function") {
    window.processDynamicMarketingLayoutDecorations({}, planKey, 0);
  }

  if (typeof window.renderStep1CustomFeatureBullets === "function") {
    window.renderStep1CustomFeatureBullets(serviceKey);
  }

  const gatePanel = document.getElementById("step-panel-0");
  if (gatePanel) {
    gatePanel.classList.remove("active");
    gatePanel.style.setProperty("display", "none", "important");
  }

  if (typeof window.switchWizardActiveViewLayout === "function") {
    window.switchWizardActiveViewLayout(1);
  } else {
    const step1Panel = document.getElementById("step-panel-1") || document.getElementById("step-1");
    if (step1Panel) {
      step1Panel.classList.add("active");
      step1Panel.style.setProperty("display", "block", "important");
    }
  }
}

window.processSmartGovernmentEntry = function() {
  const params = new URLSearchParams(window.location.search);
  const serviceKey = String(params.get("service") || "").toLowerCase().trim();
  const planKey = String(params.get("plan") || "").toLowerCase().trim();
  const registry = window.CENTRAL_SERVICE_PLAN_DB || {};
  const service = registry[serviceKey];
  if (!service) return;

  // Clear stale state from a prior state-service session.
  params.delete("state");
  const cleanUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({path:cleanUrl},"",cleanUrl);
  window.selectedJurisdiction = "";
  localStorage.removeItem("wizard_selected_state");

  f4uPrepareCoreEntryPayload(serviceKey, planKey, service.name, "");
  f4uAdvanceFromEntryGate(serviceKey, planKey);
};

window.processJurisdictionGateAdvancement = function() {
  const stateSelectorNode = document.getElementById("wizard_gate_state_select");
  if (!stateSelectorNode || !stateSelectorNode.value) {
    if (stateSelectorNode) {
      stateSelectorNode.style.setProperty("border-color","#ef4444","important");
      stateSelectorNode.style.setProperty("box-shadow","0 0 0 4px rgba(239,68,68,.12)","important");
      stateSelectorNode.focus();
    }
    return;
  }

  const chosenStateCode = stateSelectorNode.value.toUpperCase();
  const params = new URLSearchParams(window.location.search);
  const serviceKey = String(params.get("service") || "").toLowerCase().trim();
  const planKey = String(params.get("plan") || "").toLowerCase().trim();
  const registry = window.CENTRAL_SERVICE_PLAN_DB || {};
  const service = registry[serviceKey];
  if (!service) return;

  params.set("state", chosenStateCode);
  const upgradedAddressPath = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({path:upgradedAddressPath},"",upgradedAddressPath);

  window.selectedJurisdiction = chosenStateCode;
  localStorage.setItem("wizard_selected_state", chosenStateCode);

  f4uPrepareCoreEntryPayload(serviceKey, planKey, service.name, chosenStateCode);
  f4uAdvanceFromEntryGate(serviceKey, planKey);
};
