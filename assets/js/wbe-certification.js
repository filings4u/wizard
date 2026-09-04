// ============================================================================ //
// ðŸ› ï¸ WBE CERTIFICATION SERVICE: CORE SYSTEMS INITIALIZATION (PART 1 OF 3)     //
// ============================================================================ //
function initWomanOwnedCertificateService() {
  window.formRegistry = window.formRegistry || {};

  window.formRegistry['wbe-certificate-validation'] = {
    requiredFields: [
      { id: 'wbe_legal_name', msg: 'Official business entity legal name is required.' },
      { id: 'wbe_federal_ein', msg: 'A standard 9-digit EIN parameter is required (e.g., 12-3456789).' },
      { id: 'wbe_state_of_formation', msg: 'Please select your business entity state of formation.' },
      { id: 'wbe_certification_track', msg: 'Please select a targeted WBE certification framework track.' }
    ],
    validate: function() {
      let isValid = true;
      let errors = [];

      const setError = (el, msg) => {
        if (!el) return;
        isValid = false;
        el.style.setProperty("border-color", "#ef4444", "important");
        if (!errors.includes(msg)) errors.push(msg);
        const errNode = document.getElementById("err_" + el.id);
        if (errNode) {
          errNode.textContent = msg;
          errNode.style.setProperty("display", "block", "important");
        }
      };

      const clearError = (el) => {
        if (!el) return;
        el.style.removeProperty("border-color");
        const errNode = document.getElementById("err_" + el.id);
        if (errNode) {
          errNode.style.setProperty("display", "none", "important");
          errNode.textContent = "";
        }
      };

      const existsInActiveDom = (el) => el && document.body.contains(el);

      this.requiredFields.forEach(f => {
        const el = document.getElementById(f.id);
        if (existsInActiveDom(el)) {
          const val = el.value ? String(el.value).trim() : "";
          if (val === "" || val.startsWith("--")) setError(el, f.msg);
          else clearError(el);
        }
      });

      const einField = document.getElementById('wbe_federal_ein');
      if (existsInActiveDom(einField)) {
        const rawEin = einField.value.replace(/\D/g, "");
        if (rawEin.length !== 9) setError(einField, "A standard 9-digit EIN is required (e.g., 12-3456789).");
      }

      const trackField = document.getElementById('wbe_certification_track');
      const agencyField = document.getElementById('wbe_target_agency_name');
      if (existsInActiveDom(trackField) && trackField.value === "state-local") {
        if (existsInActiveDom(agencyField) && !agencyField.value.trim()) {
          setError(agencyField, "Target state agency name is required for localized tracks.");
        }
      }

      return { isValid, errors };
    }
  };

  window.formRegistry["woman-owned-certificate"] = {
    isValid: function() {
      return window.formRegistry['wbe-certificate-validation'].validate().isValid;
    },
    serialize: function() {
      const formData = {};
      const container = document.querySelector('.wbe-certification-master-container');
      if (!container) return formData;
      container.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.id) formData[field.id] = field.value ? field.value.trim() : "";
      });
      return formData;
    }
  };
}
window.initWomanOwnedCertificateService = initWomanOwnedCertificateService;

// ============================================================================ //
// ðŸ“Š FAMILY 25A: WBE CERTIFICATION FORM LAYOUT (PART 1 OF 3)                  //
// ============================================================================ //
window.buildWomanOwnedCertificateFormPart1 = function(stateDropdownOptionsHtml = "") {
  return `
    <div class="wbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px; width: 100%;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Woman-Owned Business Enterprise (WBE) Certification Network</strong>
        WBE credentials expand commercial market footprints by certifying diversity status for private enterprise supply structures, municipal programs, and corporate vendor pools. Board rules dictate the entity must sustain at least 51% direct equity ownership, day-to-day management control, and operational command by one or more qualifying women.
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Enterprise Profile &amp; Formation Identity</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Official Business Entity Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="wbe_legal_name" required placeholder="Enter exact legal business name as recorded on corporate filing documents" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_wbe_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Federal Employer ID (EIN) <span style="color: #ef4444;">*</span></label>
        <input type="text" id="wbe_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_wbe_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">State of Formation <span style="color: #ef4444;">*</span></label>
        <select id="wbe_state_of_formation" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
          <option value="" disabled selected>Select State...</option>
          ${stateDropdownOptionsHtml}
        </select>
        <div class="wizard-error-message" id="err_wbe_state_of_formation" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};
window.buildWomanOwnedCertificateFormPart1 = buildWomanOwnedCertificateFormPart1;


// ============================================================================ //
// ðŸ› ï¸ WBE CERTIFICATION SERVICE: SECONDARY SYSTEM CHECK ENGINE (PART 2 OF 3)    //
// ============================================================================ //
window.validateWbeFormPart2Metrics = function() {
  let isValid = true;
  
  const markInvalid = (inputEl, errorEl, msg) => {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.setProperty("display", "block", "important");
    if (inputEl) inputEl.style.setProperty("border-color", "#ef4444", "important");
    isValid = false;
  };

  const markValid = (inputEl, errorEl) => {
    if (!errorEl) return;
    errorEl.style.setProperty("display", "none", "important");
    errorEl.textContent = "";
    if (inputEl) inputEl.style.setProperty("border-color", "#cbd5e1", "important");
  };

  const existsInActiveDom = (el) => el && document.body.contains(el);

  // 1. Validate Ownership Share Percentage (Minimum 51% per federal and corporate board rules)
  const pctField = document.getElementById('wbe_qualifying_percentage');
  const pctErr = document.getElementById('err_wbe_qualifying_percentage');
  if (existsInActiveDom(pctField) && pctErr) {
    const val = parseFloat(pctField.value);
    if (isNaN(val) || val < 51 || val > 100) {
      markInvalid(pctField, pctErr, "Statutory provisions require a minimum woman-owned equity stake of 51% up to 100%.");
    } else {
      markValid(pctField, pctErr);
    }
  }

  return isValid;
};

// ============================================================================ //
// ðŸ“Š FAMILY 25A: WBE CERTIFICATION FORM LAYOUT (PART 2 OF 3)                  //
// ============================================================================ //
window.buildWomanOwnedCertificateFormPart2 = function(stateDropdownOptionsHtml = "") {
  return `
    <div class="wbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 2: PROGRAM TRACK SELECTION -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Program Oversight &amp; Agency Track</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_certification_track" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Target Certification Framework Track <span style="color: #ef4444;">*</span></label>
        <select id="wbe_certification_track" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;" onchange="if(typeof window.toggleMorphicWbeAgencySubInputs === 'function') { window.toggleMorphicWbeAgencySubInputs(this.value); }">
          <option value="" disabled selected>Select Certification Oversight Network...</option>
          <option value="state-local">State / Local Government WBE Program (For municipal, county, and state public sector contracts)</option>
          <option value="wbenc">Women's Business Enterprise National Council - WBENC (Private corporate vendor access profiles)</option>
          <option value="federal-wosb">Federal Woman-Owned Small Business Program (SBA WOSB / EDWOSB regulatory channels)</option>
        </select>
        <div class="wizard-error-message" id="err_wbe_certification_track" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- Hidden Conditional Container: Specific Municipality/State Target Identifier -->
      <div id="wbe_state_agency_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; flex-direction: column; gap: 6px;">
        <label for="wbe_target_agency_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Target State Agency or Municipality Division Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="wbe_target_agency_name" placeholder="e.g., California DGS WBE Registry, NYS Certified HUB / WBE Portal..." class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_wbe_target_agency_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SECTION 3: OWNERSHIP EQUITY MATRIX -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Woman Ownership Control Matrix</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Filing audit systems parse allocation numbers to confirm direct capital control thresholds are met continuously.</p>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_qualifying_percentage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Woman Ownership Share Percentage (%) <span style="color: #ef4444;">*</span></label>
        <input type="number" id="wbe_qualifying_percentage" required placeholder="e.g. 51, 80, 100" min="51" max="100" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 700;">
        <div class="wizard-error-message" id="err_wbe_qualifying_percentage" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};
window.buildWomanOwnedCertificateFormPart2 = buildWomanOwnedCertificateFormPart2;

// ============================================================================ //
// ðŸ“Š FAMILY 25A: WBE CERTIFICATION FORM LAYOUT (PART 3 OF 4)                  //
// ============================================================================ //
window.buildWomanOwnedCertificateFormPart3 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="wbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 4: SECURE DOCUMENT UPLOADS -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Secure Ownership Validation Checklist Grid</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Upload direct administrative verifications showing exact capitalization balances and layout structural control assignments.</p>
      </div>

      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; box-sizing: border-box; width: 100%;">
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="wbe_file_equity" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Equity Ownership Proof (Stock Ledgers or Operating Agreement) <span style="color: #ef4444;">*</span></label>
          <input type="file" id="wbe_file_equity" required class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_wbe_file_equity" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="wbe_file_citizenship" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Gender / Citizenship Verification (Birth Cert or Passport) <span style="color: #ef4444;">*</span></label>
          <input type="file" id="wbe_file_citizenship" required class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_wbe_file_citizenship" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- SECTION 5: AUTHORIZED MANAGING EXECUTIVE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Authorized Woman Principal Officer</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Provide the profile metrics for the principal woman shareholder or managing executive with primary daily operational signature control.</p>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_officer_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Officer Full Legal Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="wbe_officer_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_wbe_officer_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_officer_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Officer Direct Phone <span style="color: #ef4444;">*</span></label>
        <input type="tel" id="wbe_officer_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_wbe_officer_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="wbe_officer_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Officer Contact Email <span style="color: #ef4444;">*</span></label>
        <input type="email" id="wbe_officer_email" required placeholder="officer@company.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_wbe_officer_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};
window.buildWomanOwnedCertificateFormPart3 = buildWomanOwnedCertificateFormPart3;
// ============================================================================ //
// âš™ï¸ INTERACTIVE LAYOUT INTERLOCK CONTROLLERS                                   //
// ============================================================================ //
window.toggleMorphicWbeAgencySubInputs = function(selectedValue) {
  const agencyWrapper = document.getElementById("wbe_state_agency_wrapper");
  const agencyInput = document.getElementById("wbe_target_agency_name");
  
  if (!agencyWrapper) return;
  
  if (selectedValue === "state-local") {
    agencyWrapper.style.setProperty("display", "flex", "important");
    if (agencyInput) {
      agencyInput.setAttribute("required", "required");
    }
  } else {
    agencyWrapper.style.setProperty("display", "none", "important");
    if (agencyInput) {
      agencyInput.removeAttribute("required");
      agencyInput.value = "";
      agencyInput.style.borderColor = "#cbd5e1";
    }
    const errorEl = document.getElementById("err_wbe_target_agency_name");
    if (errorEl) {
      errorEl.style.setProperty("display", "none", "important");
      errorEl.textContent = "";
    }
  }
};

// ============================================================================ //
// ðŸ“¦ MASTER WBE CERTIFICATION APPLICATION ASSEMBLY HOOK                         //
// ============================================================================ //
window.buildWomanOwnedCertificateForm = function(stateDropdownOptionsHtml = "") {
  const p1 = typeof window.buildWomanOwnedCertificateFormPart1 === "function" ? window.buildWomanOwnedCertificateFormPart1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildWomanOwnedCertificateFormPart2 === "function" ? window.buildWomanOwnedCertificateFormPart2(stateDropdownOptionsHtml) : "";
  const p3 = typeof window.buildWomanOwnedCertificateFormPart3 === "function" ? window.buildWomanOwnedCertificateFormPart3(stateDropdownOptionsHtml) : "";

  // Wrapped in clear vertical block stacking card panels for a seamless full-screen view
  return `
    <div class="wbe-certification-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="wbe_panel_part1" class="wbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="wbe_panel_part2" class="wbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
      <div id="wbe_panel_part3" class="wbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p3}</div>
    </div>
  `;
};

/**
 * Scans all field parameters inside the Woman-Owned Certification Wizard.
 * Updates UI layout parameters with error cues and reports structural status.
 * @returns {boolean} Outcome indicating global form validation success.
 */
window.validateEntireWomanOwnedCertificationWizard = function() {
  const isPart1Valid = typeof window.formRegistry?.["woman-owned-certificate"]?.isValid === 'function' ? window.formRegistry["woman-owned-certificate"].isValid() : true;
  const isPart2MetricsValid = typeof window.validateWbeFormPart2Metrics === 'function' ? window.validateWbeFormPart2Metrics() : true;
  
  return (isPart1Valid && isPart2MetricsValid);
};

// Map structural framework pointers across global ecosystem registries safely
window.formRegistry = window.formRegistry || {};
window.formRegistry['woman-owned-certificate-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildWomanOwnedCertificateForm(stateDropdownOptionsHtml);
};

window.buildWomanOwnedCertificateForm = window.buildWomanOwnedCertificateForm;
window.validateEntireWomanOwnedCertificationWizard = window.validateEntireWomanOwnedCertificationWizard;


