// ============================================================================
// âš¡ STEP 2 DYNAMIC RECOVERY LIFELINE: ASSET PROTECTION TIERS LAYOUT REGISTER
// ============================================================================

/**
 * Dynamically hooks into the asynchronous form injection system.
 * Resolves the late-binding asset lookup instantly to clear the loading skeleton block.
 * @param {string} stateOptions - Pre-rendered HTML string option elements from your global state dropdown.
 * @return {string} Pure structural HTML content blocks to mount straight to the wizard workspace.
 */
window.buildAssetProtectionTiersForm = function(stateOptions) {
  console.log("[Form Engine] Intercepted asset protection path. Rendering dynamic framework view...");
  
  const activeServiceKey = window.routeActiveServiceKey || "";
  const masterDbSource = window.CENTRAL_SERVICE_PLAN_DB || {};
  const activeRecord = masterDbSource[activeServiceKey] || {};
  
  // Isolate prices matrix block to discover valid structural speed levels programmatically
  const priceMatrixNode = activeRecord.prices || activeRecord;
  let dynamicTiersMarkup = "";
  
  if (priceMatrixNode && typeof priceMatrixNode === "object") {
    const availablePriceKeys = Object.keys(priceMatrixNode).filter(k => 
      k !== "name" && k !== "bullets" && k !== "addons" && k !== "plans" && !isNaN(parseFloat(priceMatrixNode[k]))
    );
    
    availablePriceKeys.forEach((tierKey, index) => {
      // Programmatically clean keys into legible options labels (e.g., advanced-holding -> Advanced Holding)
      const cleanLabel = tierKey.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const isFirstElementSelected = index === 0 ? "selected" : "";
      dynamicTiersMarkup += `<option value="${tierKey}" ${isFirstElementSelected}>${cleanLabel} Shield Layer Plan</option>`;
    });
  }
  
  // Pure dynamic safety fallback layout if the central pricing objects are uninitialized
  if (!dynamicTiersMarkup) {
    const activeTierKey = window.routeActivePlanKey || "standard";
    const cleanFallbackLabel = String(activeTierKey).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    dynamicTiersMarkup = `<option value="${activeTierKey}" selected>${cleanFallbackLabel} Structural Separation Protection</option>`;
  }

  // Keeps your standard field configurations intact while injecting native form layers cleanly
  return `
  <!-- FIELD 1: ELIGIBLE PROTECTION TIER LAYER -->
  <div class="wizard-input-group" style="grid-column: span 2;">
    <label for="apt_tier_level" style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); margin-bottom: 4px;">
      Select Eligible Asset Protection Shield Level <span style="color: #ef4444;">*</span>
    </label>
    <select id="apt_tier_level" name="apt_tier_level" required class="wizard-input-field" style="width:100%; box-sizing:border-box; height:38px; font-weight:600;">
      ${dynamicTiersMarkup}
    </select>
    <div class="wizard-error-message" id="err_apt_tier_level" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
  </div>

  <!-- FIELD 2: TARGET STATE REGISTRY FORM -->
  <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
    <label for="apt_state_jurisdiction" style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); margin-bottom: 4px;">
      Target Formation Jurisdiction State <span style="color: #ef4444;">*</span>
    </label>
    <select id="apt_state_jurisdiction" name="apt_state_jurisdiction" required class="wizard-input-field" style="width:100%; box-sizing:border-box; height:38px; font-weight:600;">
      ${stateOptions || '<option value="DE">Delaware</option><option value="WY">Wyoming</option><option value="NV">Nevada</option>'}
    </select>
    <div class="wizard-error-message" id="err_apt_state_jurisdiction" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
  </div>
  `;
};


/**
 * Scans and validates your dynamic Asset Protection dropdown parameters.
 * @returns {boolean} Status signifying structural form validity.
 */
function validateAssetProtectionTiersForm() {
  let isValid = true;

  const markInvalid = (inputEl, errorEl, msg) => {
    errorEl.textContent = msg;
    errorEl.style.display = "block";
    inputEl.style.border = "1px solid #ef4444";
    isValid = false;
  };

  const markValid = (inputEl, errorEl) => {
    errorEl.style.display = "none";
    inputEl.style.border = "";
  };

  // 1. Validate Shield Layer Level Selection
  const tierField = document.getElementById('apt_tier_level');
  const tierErr = document.getElementById('err_apt_tier_level');
  if (!tierField || !tierField.value) {
    markInvalid(tierField, tierErr, "Please select an eligible asset protection shield level tier plan.");
  } else {
    markValid(tierField, tierErr);
  }

  // 2. Validate Formation State Selection
  const stateField = document.getElementById('apt_state_jurisdiction');
  const stateErr = document.getElementById('err_apt_state_jurisdiction');
  if (!stateField || !stateField.value) {
    markInvalid(stateField, stateErr, "Please select your target formation jurisdiction state.");
  } else {
    markValid(stateField, stateErr);
  }

  return isValid;
}

// Bind directly to window scope to allow easy cross-step pipeline access
window.validateAssetProtectionTiersForm = validateAssetProtectionTiersForm;

