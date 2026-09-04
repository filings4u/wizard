// ============================================================================ //
// ðŸ› ï¸ IFTA REGISTRATION SERVICE: VALIDATION MATRIX ENGINE                      //
// ============================================================================ //
function initIftaRegistrationService() {
  // Global wizard registries allocation
  window.formRegistry = window.formRegistry || {};

  const part1Fields = [
    { id: 'ifta_legal_name', msg: 'Official business name is required.' },
    { id: 'ifta_usdot_number', msg: 'USDOT number is required.' },
    { id: 'ifta_federal_ein', msg: 'A standard 9-digit EIN is required (e.g., 12-3456789).' },
    { id: 'ifta_order_intent', msg: 'Please pick a filing selection scope option.' }
  ];

  window.formRegistry['ifta-registration-part1-validation'] = {
    requiredFields: part1Fields,
    validate: function() {
      let isValid = true;
      let errors = [];

      const setError = (el, msg) => {
        if (!el) return;
        isValid = false;
        el.style.setProperty("border-color", "#ef4444", "important");
        if (!errors.includes(msg)) errors.push(msg);
        
        const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.textContent = msg;
          errorMsgNode.style.setProperty("display", "block", "important");
        }
      };

      const clearError = (el) => {
        if (!el) return;
        el.style.removeProperty("border-color");
        
        const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.style.setProperty("display", "none", "important");
          errorMsgNode.textContent = "";
        }
      };

      // ðŸŸ¢ FIXED: Use safe DOM presence filters instead of fragile offset geometric checks
      const existsInActiveDom = (el) => el && document.body.contains(el);

      // 1. Process Business Name Presence Check
      const nameField = document.getElementById('ifta_legal_name');
      if (existsInActiveDom(nameField)) {
        const nameVal = nameField.value ? String(nameField.value).trim() : "";
        if (!nameVal) setError(nameField, "Official business name is required.");
        else clearError(nameField);
      }

      // 2. Process USDOT Number Matrix Checks (Pure Numerical Validation)
      const dotField = document.getElementById('ifta_usdot_number');
      if (existsInActiveDom(dotField)) {
        const dotVal = dotField.value ? String(dotField.value).trim() : "";
        if (!dotVal) {
          setError(dotField, "USDOT number is required.");
        } else if (!/^\d+$/.test(dotVal)) {
          setError(dotField, "USDOT parameters must contain numbers only.");
        } else {
          clearError(dotField);
        }
      }

      // 3. Process Federal EIN Pattern Matrix Checks (Standard 9-Digit Numeric Validation)
      const einField = document.getElementById('ifta_federal_ein');
      if (existsInActiveDom(einField)) {
        const einVal = einField.value ? String(einField.value).trim() : "";
        const pureDigits = einVal.replace(/\D/g, "");
        if (pureDigits.length !== 9) {
          setError(einField, "A standard 9-digit EIN is required (e.g., 12-3456789).");
        } else {
          clearError(einField);
        }
      }

      // 4. Process Filing Selection Scope Dropdown Selection Check
      const intentField = document.getElementById('ifta_order_intent');
      if (existsInActiveDom(intentField)) {
        const intentVal = intentField.value ? String(intentField.value).trim() : "";
        const isPlaceholderSelected = intentVal === "" || intentVal.startsWith("--");
        if (isPlaceholderSelected) {
          setError(intentField, "Please pick a filing selection scope option.");
        } else {
          clearError(intentField);
        }
      }

      return { isValid, errors };
    }
  };

  // Sync back to historical standalone global function pointer just like previous modules
  window.validateIftaRegistrationFormPart1 = function() {
    const outcome = window.formRegistry['ifta-registration-part1-validation'].validate();
    return outcome.isValid;
  };
}

// Global execution assignment
window.initIftaRegistrationService = initIftaRegistrationService;



// ============================================================================ //
// ðŸ› ï¸ FAMILY 30A: IFTA REGISTRATION LAYOUT MATRIX (PART 1 OF 3)              //
// ============================================================================ //
function buildIftaRegistrationFormPart1(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="ifta-registration-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS IFTA REGISTRATION? -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> International Fuel Tax Agreement (IFTA) Mandates</strong>
        IFTA is a cooperative agreement among US states and Canadian provinces to simplify the reporting of fuel use taxes by commercial motor carriers operating across multiple jurisdictions. An IFTA license and decals are required for any qualified motor vehicle that has two axles and a gross vehicle weight rating exceeding 26,000 lbs, has three or more axles regardless of weight, or is used in combination exceeding 26,000 lbs.
      </div>

      <!-- SECTION 1: CARRIER BASELINE PROFILE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Carrier Identity Profile</h3>
      </div>

      <!-- FIELD 1: OFFICIAL BUSINESS NAME -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="ifta_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Business Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="ifta_legal_name" required placeholder="Enter exact legal name matching state registration and USDOT profile" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
        <div class="wizard-error-message" id="err_ifta_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIXED REPAIRED SUB-GRID ROW MATRIX: FORCES FIELD 2 AND FIELD 3 SIDE-BY-SIDE -->
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
        <!-- FIELD 2: USDOT NUMBER -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_usdot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">USDOT Number <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ifta_usdot_number" required placeholder="Enter USDOT Number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
          <div class="wizard-error-message" id="err_ifta_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 3: EMPLOYER IDENTIFICATION NUMBER -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Federal Employer ID (EIN) <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ifta_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
          <div class="wizard-error-message" id="err_ifta_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- SECTION 2: FILING INTENT CLASSIFICATION -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Application Type & Order Intent</h3>
      </div>

      <!-- FIELD 4: FILING SELECTION SCOPE DROPDOWN WITH CONDITIONAL WORKFLOW INTERCEPT -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="ifta_order_intent" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Filing Selection Scope <span style="color: #ef4444;">*</span></label>
        <select id="ifta_order_intent" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;" onchange="if(typeof window.toggleIftaFulfillmentSubFields === 'function') { window.toggleIftaFulfillmentSubFields(this.value); }">
          <option value="" disabled selected>-- Select Intent Scope --</option>
          <option value="initial">Initial Account Registration (Establish brand new state IFTA account and receive first decal set)</option>
          <option value="additional">Ordering Additional Decal Sets (Add extra fuel decal sets for newly acquired fleet units)</option>
        </select>
        <div class="wizard-error-message" id="err_ifta_order_intent" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
}
// Bind full layout builder securely to global scope layers
window.buildIftaRegistrationFormPart1 = buildIftaRegistrationFormPart1;


// ============================================================================ //
// ðŸ› ï¸ IFTA REGISTRATION MODULE: VALIDATION MATRIX ENGINE (PARTS 2 & 3)          //
// ============================================================================ //
/**
 * Validates IRP account parameters, base state alignments, and decal volumetric constraints
 */
window.validateIftaRegistrationFormParts2And3 = function() {
  let isValid = true;
  let errors = [];

  const markInvalid = (inputEl, errorEl, msg) => {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.setProperty("display", "block", "important");
    if (inputEl) {
      inputEl.style.setProperty("border-color", "#ef4444", "important");
    }
    isValid = false;
    if (!errors.includes(msg)) errors.push(msg);
  };

  const markValid = (inputEl, errorEl) => {
    if (!errorEl) return;
    errorEl.style.setProperty("display", "none", "important");
    errorEl.textContent = "";
    if (inputEl) {
      inputEl.style.setProperty("border-color", "#cbd5e1", "important");
    }
  };

  // ðŸŸ¢ FIXED: Use safe DOM presence filters instead of fragile offset geometric checks
  const existsInActiveDom = (el) => el && document.body.contains(el);

  // 1. Validate Apportioned IRP Account Number
  const irpAccountField = document.getElementById('ifta_irp_account_num');
  const irpAccountErr = document.getElementById('err_ifta_irp_account_num');
  if (existsInActiveDom(irpAccountField) && irpAccountErr) {
    const irpVal = irpAccountField.value ? String(irpAccountField.value).trim() : "";
    if (!irpVal) {
      markInvalid(irpAccountField, irpAccountErr, "Apportioned IRP account reference ID number is required.");
    } else {
      markValid(irpAccountField, irpAccountErr);
    }
  }

  // 2. Validate IRP Base State Dropdown Selection
  const baseJurisdictionField = document.getElementById('ifta_base_jurisdiction');
  const baseJurisdictionErr = document.getElementById('err_ifta_base_jurisdiction');
  if (existsInActiveDom(baseJurisdictionField) && baseJurisdictionErr) {
    const baseVal = baseJurisdictionField.value ? String(baseJurisdictionField.value).trim() : "";
    const isPlaceholderSelected = baseVal === "" || baseVal.startsWith("--");
    if (isPlaceholderSelected) {
      markInvalid(baseJurisdictionField, baseJurisdictionErr, "Please specify your IRP apportioned base state.");
    } else {
      markValid(baseJurisdictionField, baseJurisdictionErr);
    }
  }

  // 3. Validate Number of Decal Sets Requested (Min 1, Max 250)
  const decalSetsField = document.getElementById('ifta_decal_sets_count');
  const decalSetsErr = document.getElementById('err_ifta_decal_sets_count');
  if (existsInActiveDom(decalSetsField) && decalSetsErr) {
    const value = parseInt(decalSetsField.value, 10);
    if (isNaN(value) || value < 1) {
      markInvalid(decalSetsField, decalSetsErr, "IFTA compliance requires requesting at least 1 decal fleet set.");
    } else if (value > 250) {
      markInvalid(decalSetsField, decalSetsErr, "Single transaction batch orders cannot exceed 250 total decal sets.");
    } else {
      markValid(decalSetsField, decalSetsErr);
    }
  }

  return isValid;
};


// ============================================================================ //
// ðŸ› ï¸ FAMILY 30A: IFTA REGISTRATION LAYOUT MATRIX (PART 2 OF 3)              //
// ============================================================================ //
function buildIftaRegistrationFormPart2(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="ifta-registration-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 3: INTERNATIONAL REGISTRATION PLAN LINK INTERFACE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. International Registration Plan (IRP) Account Mapping</h3>
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">State tax jurisdictions mandate cross-referencing your base state apportioned commercial vehicle license plates (IRP credentials) before issuing fuel license permits.</p>
      </div>

      <!-- CONDITIONAL WRAPPER ACCESSIBLE BY WORKFLOW INTERACTIVE CONTROLLERS -->
      <div id="ifta_irp_mapping_wrapper" style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 16px; border-radius: 8px; box-sizing: border-box; margin-top: 12px;">
        
        <!-- FIELD 1: IRP ACCOUNT ID -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_irp_account_num" style="font-size: 0.75rem; font-weight: 700; color: var(--navy); text-transform: uppercase; display: block; margin-bottom: 4px;">Apportioned IRP Account Number <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ifta_irp_account_num" required placeholder="Enter Apportioned IRP Plate Account ID" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
          <div class="wizard-error-message" id="err_ifta_irp_account_num" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 2: IRP BASE STATE -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_base_jurisdiction" style="font-size: 0.75rem; font-weight: 700; color: var(--navy); text-transform: uppercase; display: block; margin-bottom: 4px;">IRP Base State <span style="color: #ef4444;">*</span></label>
          <select id="ifta_base_jurisdiction" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
            <option value="" disabled selected>Select Base State...</option>
            ${stateDropdownOptionsHtml}
          </select>
          <div class="wizard-error-message" id="err_ifta_base_jurisdiction" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

      </div>

      <!-- SECTION 4: FULFILLMENT DECAL COUNT VOLUME -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Decal Fleet Volumes</h3>
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">One set consists of two matching decals (one for each side of the vehicle cab).</p>
      </div>

      <!-- FIELD 3: DECAL SETS COUNT WITH ROUNDED PROFILES -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="ifta_decal_sets_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Number of Decal Sets Requested <span style="color: #ef4444;">*</span></label>
        <input type="number" id="ifta_decal_sets_count" required value="1" min="1" max="250" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }">
        <div class="wizard-error-message" id="err_ifta_decal_sets_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
}
// Bind component layout block safely to global scope layers
window.buildIftaRegistrationFormPart2 = buildIftaRegistrationFormPart2;


// ============================================================================ //
// ðŸ› ï¸ FAMILY 30A: IFTA REGISTRATION LAYOUT MATRIX (PART 3 OF 3)              //
// ============================================================================ //
function buildIftaRegistrationFormPart3(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="ifta-registration-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 5: ADDITIONAL PROVISIONS & DISCLOSURES -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Handling Directives &amp; Attestation</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="ifta_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Special IFTA Instructions or Fleet Notes</label>
        <textarea id="ifta_provisions" placeholder="Detail any immediate temporary trip permit deadlines, newly added tractor VIN profiles, out-of-state leasing arrangements, or custom proxy handling directives relative to your state IFTA registration dossier..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
      </div>

    </div>
  `;
}

// ============================================================================ //
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (IFTA CONDITIONAL LOGIC ENGINE)        //
// ============================================================================ //
/**
 * Handles workflow switching logic based on order scope selection.
 * Keeps fields reactive and structurally responsive.
 */
window.toggleIftaFulfillmentSubFields = function(selectedValue) {
  const mappingWrapper = document.getElementById("ifta_irp_mapping_wrapper");
  const irpAccountInput = document.getElementById("ifta_irp_account_num");
  const irpBaseSelect = document.getElementById("ifta_base_jurisdiction");
  
  if (!mappingWrapper) return;
  
  if (selectedValue === "additional") {
    console.log("[IFTA Engine] Modification track engaged. Preserving existing accounts.");
    if (irpAccountInput) irpAccountInput.setAttribute("placeholder", "Optional - Enter active IRP Plate Account ID");
  } else {
    console.log("[IFTA Engine] Initial registration track verified. Strict validation parameters active.");
    if (irpAccountInput) irpAccountInput.setAttribute("placeholder", "Enter Apportioned IRP Plate Account ID");
  }
  
  if (typeof window.updateWizardFinalTotalAmountMatrix === "function") {
    window.updateWizardFinalTotalAmountMatrix();
  }
};

// ============================================================================ //
// ðŸ“¦ MASTER IFTA REGISTRATION APPLICATION ASSEMBLY HOOK                         //
// ============================================================================ //
window.buildIftaRegistrationForm = function(stateDropdownOptionsHtml = "") {
  const p1 = typeof window.buildIftaRegistrationFormPart1 === "function" ? window.buildIftaRegistrationFormPart1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildIftaRegistrationFormPart2 === "function" ? window.buildIftaRegistrationFormPart2(stateDropdownOptionsHtml) : "";
  const p3 = typeof window.buildIftaRegistrationFormPart3 === "function" ? window.buildIftaRegistrationFormPart3(stateDropdownOptionsHtml) : "";

  // ðŸŸ¢ FIXED: Converted outer frame into full-width stacked blocks.
  // Forces all parts to span the entire card panel without collapsing sideways into a double column grid container.
  return `
    <div class="ifta-registration-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="ifta_reg_panel_part1" class="ifta-registration-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="ifta_reg_panel_part2" class="ifta-registration-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
      <div id="ifta_reg_panel_part3" class="ifta-registration-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p3}</div>
    </div>
  `;
};

/**
 * Scans all field parameters inside the IFTA Registration Wizard.
 * Updates UI layout parameters with error cues and reports structural status.
 * @returns {boolean} Outcome indicating global form validation success.
 */
window.validateEntireIftaRegistrationWizard = function() {
  const isPart1Valid = typeof window.formRegistry?.['ifta-registration-part1-validation']?.validate === 'function' ? window.formRegistry['ifta-registration-part1-validation'].validate().isValid : true;
  const isPart2Valid = typeof window.validateIftaRegistrationFormParts2And3 === 'function' ? window.validateIftaRegistrationFormParts2And3() : true;
  
  return (isPart1Valid && isPart2Valid);
};

// Bind function segments securely to global window namespaces
window.buildIftaRegistrationFormPart3 = buildIftaRegistrationFormPart3;

// Secure master framework registry mapping matching the engine naming convention exactly
window.formRegistry = window.formRegistry || {};
window.formRegistry['ifta-registration-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildIftaRegistrationForm(stateDropdownOptionsHtml);
};

