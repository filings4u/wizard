// ============================================================================ //
// ðŸ› ï¸ MINORITY CERTIFICATE SERVICE: REGISTRY INITIALIZATION (PART 1 OF 5)      //
// ============================================================================ //
function initMinorityCertificateService() {
  window.formRegistry = window.formRegistry || {};
  
  window.formRegistry["minority-certificate"] = {
    isValid: function() {
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

      // 1. Validate Legal Name
      const nameField = document.getElementById('mbe_legal_name');
      const nameErr = document.getElementById('err_mbe_legal_name');
      if (existsInActiveDom(nameField) && nameErr) {
        if (!nameField.value.trim()) {
          markInvalid(nameField, nameErr, "Official business entity name is required.");
        } else {
          markValid(nameField, nameErr);
        }
      }

      // 2. Validate Federal EIN (Enforce standard 9 numeric digits)
      const einField = document.getElementById('mbe_federal_ein');
      const einErr = document.getElementById('err_mbe_federal_ein');
      if (existsInActiveDom(einField) && einErr) {
        const rawEin = einField.value.replace(/\D/g, "");
        if (rawEin.length !== 9) {
          markInvalid(einField, einErr, "A standard 9-digit EIN is required (e.g., 12-3456789).");
        } else {
          markValid(einField, einErr);
        }
      }

      // 3. Validate State of Formation Dropdown
      const stateField = document.getElementById('mbe_state_of_formation');
      const stateErr = document.getElementById('err_mbe_state_of_formation');
      if (existsInActiveDom(stateField) && stateErr) {
        if (!stateField.value || stateField.value.startsWith("--")) {
          markInvalid(stateField, stateErr, "Please pick your entity state of formation.");
        } else {
          markValid(stateField, stateErr);
        }
      }

      // 4. Validate Target Framework Track Dropdown
      const trackField = document.getElementById('mbe_certification_track');
      const trackErr = document.getElementById('err_mbe_certification_track');
      if (existsInActiveDom(trackField) && trackErr) {
        if (!trackField.value || trackField.value.startsWith("--")) {
          markInvalid(trackField, trackErr, "Please choose a targeted certification framework track.");
        } else {
          markValid(trackField, trackErr);
        }
      }

      // 5. Conditional Agency Validation
      const agencyWrapper = document.getElementById('mbe_state_agency_wrapper');
      const agencyField = document.getElementById('mbe_target_agency_name');
      const agencyErr = document.getElementById('err_mbe_target_agency_name');
      if (existsInActiveDom(agencyWrapper) && existsInActiveDom(agencyField) && agencyErr) {
        const isTrackStateLocal = trackField && trackField.value === "state-local";
        const isWrapperVisible = agencyWrapper.style.display === "block" || agencyWrapper.style.display === "grid";
        
        if (isWrapperVisible || isTrackStateLocal) {
          if (!agencyField.value.trim()) {
            markInvalid(agencyField, agencyErr, "Target state agency or municipality name is required for localized tracks.");
          } else {
            markValid(agencyField, agencyErr);
          }
        } else {
          markValid(agencyField, agencyErr);
        }
      }
      
      return isValid;
    },
    serialize: function() {
      const formData = {};
      const container = document.querySelector('.mbe-certification-master-container');
      if (!container) return formData;
      
      container.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.id) formData[field.id] = field.value ? field.value.trim() : "";
      });
      return formData;
    }
  };
}
window.initMinorityCertificateService = initMinorityCertificateService;
// ============================================================================ //
// ðŸ“Š FAMILY 24A: MBE CERTIFICATION LAYOUT MATRIX (PART 2 OF 5)                 //
// ============================================================================ //
window.buildMinorityCertificateFormPart1 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="mbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- MAIN UNDERSTANDING OVERLAY TOOLTIP -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px; width: 100%;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Minority Business Enterprise (MBE) Certification Network</strong>
        Minority Business Enterprise (MBE) status unlocks exclusive corporate supplier diversity programs, targeted municipal set-aside contracts, and specialized institutional capital lanes. To achieve successful placement, the enterprise must prove it is at least 51% owned, managed, and controlled daily by one or more socioeconomically qualifying individuals.
      </div>

      <!-- SECTION 1: ENTERPRISE BASELINE IDENTIFICATION -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Company Profile Parameters</h3>
      </div>

      <!-- FIELD 1: OFFICIAL BUSINESS ENTITY NAME -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Business Entity Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="mbe_legal_name" required placeholder="Enter exact legal name matching state organization documents" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mbe_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 2: EMPLOYER IDENTIFICATION NUMBER (EIN) -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Employer ID (EIN) <span style="color: #ef4444;">*</span></label>
        <input type="text" id="mbe_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mbe_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 3: STATE OF FORMATION -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State of Formation <span style="color: #ef4444;">*</span></label>
        <select id="mbe_state_of_formation" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
          <option value="" disabled selected>Select State...</option>
          ${stateDropdownOptionsHtml}
        </select>
        <div class="wizard-error-message" id="err_mbe_state_of_formation" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};


// ============================================================================ //
// ðŸ› ï¸ MINORITY CERTIFICATE SERVICE: SECONDARY VALIDATION ENGINE (PART 3 OF 5)  //
// ============================================================================ //
window.validateMinorityCertificateFormParts2And3 = function() {
  let isValid = true;
  let errors = [];

  const markInvalid = (inputEl, errorEl, msg) => {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.setProperty("display", "block", "important");
    if (inputEl) inputEl.style.setProperty("border-color", "#ef4444", "important");
    isValid = false;
    if (!errors.includes(msg)) errors.push(msg);
  };

  const markValid = (inputEl, errorEl) => {
    if (!errorEl) return;
    errorEl.style.setProperty("display", "none", "important");
    errorEl.textContent = "";
    if (inputEl) inputEl.style.setProperty("border-color", "#cbd5e1", "important");
  };

  const existsInActiveDom = (el) => el && document.body.contains(el);

  // 1. Validate Ownership Share Percentage (Minimum 51%)
  const pctField = document.getElementById('mbe_qualifying_percentage');
  const pctErr = document.getElementById('err_mbe_qualifying_percentage');
  if (existsInActiveDom(pctField) && pctErr) {
    const val = parseFloat(pctField.value);
    if (isNaN(val) || val < 51 || val > 100) {
      markInvalid(pctField, pctErr, "Regulatory rules mandate a minimum minority equity control allocation of 51% up to 100%.");
    } else {
      markValid(pctField, pctErr);
    }
  }

  // 2. Validate Socioeconomic Dropdown Selection
  const groupField = document.getElementById('mbe_ethnic_group');
  const groupErr = document.getElementById('err_mbe_ethnic_group');
  if (existsInActiveDom(groupField) && groupErr) {
    const groupVal = groupField.value ? groupField.value.trim() : "";
    if (!groupVal || groupVal.startsWith("--")) {
      markInvalid(groupField, groupErr, "Please clarify your qualifying socioeconomic classification category.");
    } else {
      markValid(groupField, groupErr);
    }
  }

  // 3. Validate Mandatory File Uploads (Equity, Citizenship, Financials, Bylaws)
  const uploadFields = [
    { id: 'mbe_file_equity', errId: 'err_mbe_file_equity', msg: "Please attach proof of equity ownership (e.g., Stock Ledgers / Agreement)." },
    { id: 'mbe_file_citizenship', errId: 'err_mbe_file_citizenship', msg: "Please attach your ethnicity or citizenship verification document." },
    { id: 'mbe_file_financials', errId: 'err_mbe_file_financials', msg: "Recent company tax returns or corporate P&L profiles are required." },
    { id: 'mbe_file_bylaws', errId: 'err_mbe_file_bylaws', msg: "Articles of Organization or company operating bylaws are required." }
  ];

  uploadFields.forEach(f => {
    const fileEl = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    if (existsInActiveDom(fileEl) && errEl) {
      if (!fileEl.files || fileEl.files.length === 0) {
        markInvalid(fileEl, errEl, f.msg);
      } else {
        markValid(fileEl, errEl);
      }
    }
  });

  // 4. Validate Principal Officer Full Name
  const officerNameField = document.getElementById('mbe_officer_name');
  const officerNameErr = document.getElementById('err_mbe_officer_name');
  if (existsInActiveDom(officerNameField) && officerNameErr) {
    if (!officerNameField.value.trim()) {
      markInvalid(officerNameField, officerNameErr, "Principal minority officer full legal name is required.");
    } else {
      markValid(officerNameField, officerNameErr);
    }
  }

  // 5. Validate Officer Direct Phone Number
  const officerPhoneField = document.getElementById('mbe_officer_phone');
  const officerPhoneErr = document.getElementById('err_mbe_officer_phone');
  if (existsInActiveDom(officerPhoneField) && officerPhoneErr) {
    if (!officerPhoneField.value.trim()) {
      markInvalid(officerPhoneField, officerPhoneErr, "Officer direct contact phone number is required.");
    } else {
      markValid(officerPhoneField, officerPhoneErr);
    }
  }

  // 6. Validate Officer Contact Email Address
  const officerEmailField = document.getElementById('mbe_officer_email');
  const officerEmailErr = document.getElementById('err_mbe_officer_email');
  if (existsInActiveDom(officerEmailField) && officerEmailErr) {
    const emailVal = officerEmailField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      markInvalid(officerEmailField, officerEmailErr, "Officer contact email address is required.");
    } else if (!emailRegex.test(emailVal)) {
      markInvalid(officerEmailField, officerEmailErr, "Please supply a valid executive officer communication email format.");
    } else {
      markValid(officerEmailField, officerEmailErr);
    }
  }

  return isValid;
};


// ============================================================================ //
// ðŸ“Š FAMILY 24A: MBE CERTIFICATION LAYOUT MATRIX (PART 4 OF 5)                 //
// ============================================================================ //
window.buildMinorityCertificateFormPart2 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="mbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 3: OWNERSHIP EQUITY MATRIX -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Minority Ownership Control Matrix</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Certifying boards audit equity percentages to confirm the business meets the minimum 51% minority-controlled threshold rule.</p>
      </div>

      <!-- FIELD 1: MINORITY OWNERSHIP PERCENTAGE -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_qualifying_percentage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Minority Ownership Share Percentage (%) <span style="color: #ef4444;">*</span></label>
        <input type="number" id="mbe_qualifying_percentage" required placeholder="e.g. 51, 75, 100" min="51" max="100" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mbe_qualifying_percentage" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 2: SOCIOECONOMIC CLASSIFICATION -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_ethnic_group" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Socioeconomic Classification Category <span style="color: #ef4444;">*</span></label>
        <select id="mbe_ethnic_group" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
          <option value="" disabled selected>Select Category...</option>
          <option value="african-american">African American</option>
          <option value="hispanic-american">Hispanic American</option>
          <option value="native-american">Native American / Indigenous Community</option>
          <option value="asian-pacific">Asian Pacific American</option>
          <option value="asian-subcontinent">Asian Subcontinent American</option>
        </select>
        <div class="wizard-error-message" id="err_mbe_ethnic_group" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SECTION 4: SECURE DOCUMENT VALIDATION CHECKLIST GRID -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Secure Ownership Validation Checklist Grid</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Upload direct administrative verifications showing exact capitalization balances and layout structural control assignments.</p>
      </div>

      <!-- REPAIRED CONTAINER: NESTS BOTH COLUMN BLOCKS FOR DESKTOP LANDSCAPE SHIFT CLEAR OF OUTER WRAPPERS -->
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; box-sizing: border-box; width: 100%;">
        
        <!-- UPLOAD 1: EQUITY PROOF -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mbe_file_equity" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Equity Ownership Proof (Stock Ledgers or Operating Agreement) <span style="color: #ef4444;">*</span></label>
          <input type="file" id="mbe_file_equity" required class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_mbe_file_equity" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- UPLOAD 2: CITIZENSHIP VERIFICATION -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mbe_file_citizenship" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Ethnicity / Citizenship Verification (Birth Cert or Passport) <span style="color: #ef4444;">*</span></label>
          <input type="file" id="mbe_file_citizenship" required class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_mbe_file_citizenship" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- UPLOAD 3: TAX RETURNS / FINANCIALS -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mbe_file_financials" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Recent Company Tax Returns or P&amp;L Statement <span style="color: #ef4444;">*</span></label>
          <input type="file" id="mbe_file_financials" required class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_mbe_file_financials" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- UPLOAD 4: ARTICLES / BYLAWS -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mbe_file_bylaws" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Articles of Organization / Corporate Bylaws <span style="color: #ef4444;">*</span></label>
          <input type="file" id="mbe_file_bylaws" required class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_mbe_file_bylaws" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

      </div>

    </div>
  `;
};


// ============================================================================ //
// ðŸ“Š FAMILY 24A: MBE CERTIFICATION LAYOUT MATRIX (PART 5 OF 5)                 //
// ============================================================================ //
window.buildMinorityCertificateFormPart3 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="mbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 5: AUTHORIZED MANAGING EXECUTIVE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Authorized Minority Principal Officer</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Provide the profile metrics for the principal minority shareholder or managing executive with primary daily operational signature control.</p>
      </div>

      <!-- FIELD 3: OFFICER FULL NAME -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_officer_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Officer Full Legal Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="mbe_officer_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mbe_officer_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 4: OFFICER PHONE -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_officer_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Officer Direct Phone <span style="color: #ef4444;">*</span></label>
        <input type="tel" id="mbe_officer_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mbe_officer_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 5: OFFICER EMAIL -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_officer_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Officer Contact Email <span style="color: #ef4444;">*</span></label>
        <input type="email" id="mbe_officer_email" required placeholder="officer@company.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mbe_officer_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SECTION 6: ADDITIONAL PROVISIONS -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Special Filing Clauses &amp; Structural Disclosures</h3>
      </div>

      <!-- FIELD 6: OPTIONAL MEMO TEXTAREA -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="mbe_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Filing Instructions or Procurement Project Notes</label>
        <textarea id="mbe_provisions" placeholder="Detail any immediate corporate supplier diversity deadlines, target municipality bidding codes, or custom setup parameters required for your MBE diversity dossier..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; outline: none;"></textarea>
      </div>

    </div>
  `;
};

// ============================================================================ //
// âš™ï¸ INTERACTIVE LAYOUT INTERLOCK CONTROLLERS                                   //
// ============================================================================ //
window.toggleMorphicMbeAgencySubInputs = function(selectedValue) {
  const agencyWrapper = document.getElementById("mbe_state_agency_wrapper");
  const agencyInput = document.getElementById("mbe_target_agency_name");
  
  if (!agencyWrapper) return;
  
  if (selectedValue === "state-local") {
    agencyWrapper.style.setProperty("display", "block", "important");
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
    const errorEl = document.getElementById("err_mbe_target_agency_name");
    if (errorEl) {
      errorEl.style.setProperty("display", "none", "important");
      errorEl.textContent = "";
    }
  }
};

// ============================================================================ //
// ðŸ“¦ MASTER MBE CERTIFICATION APPLICATION ASSEMBLY HOOK                         //
// ============================================================================ //
window.buildMinorityCertificateForm = function(stateDropdownOptionsHtml = "") {
  const p1 = typeof window.buildMinorityCertificateFormPart1 === "function" ? window.buildMinorityCertificateFormPart1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildMinorityCertificateFormPart2 === "function" ? window.buildMinorityCertificateFormPart2(stateDropdownOptionsHtml) : "";
  const p3 = typeof window.buildMinorityCertificateFormPart3 === "function" ? window.buildMinorityCertificateFormPart3(stateDropdownOptionsHtml) : "";

  // ðŸŸ¢ FIXED: Wrapped in clear vertical block stacking cards matching previous models precisely
  return `
    <div class="mbe-certification-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="mbe_panel_part1" class="mbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="mbe_panel_part2" class="mbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
      <div id="mbe_panel_part3" class="mbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p3}</div>
    </div>
  `;
};

/**
 * Scans all field parameters inside the Minority Certification Wizard.
 * Updates UI layout parameters with error cues and reports structural status.
 * @returns {boolean} Outcome indicating global form validation success.
 */
window.validateEntireMinorityCertificationWizard = function() {
  // Execute individual validation loops via registered framework scopes securely
  const isPart1Valid = typeof window.formRegistry?.["minority-certificate"]?.isValid === 'function' ? window.formRegistry["minority-certificate"].isValid() : true;
  const isPart23Valid = typeof window.validateMinorityCertificateFormParts2And3 === 'function' ? window.validateMinorityCertificateFormParts2And3() : true;
  
  return (isPart1Valid && isPart23Valid);
};

// Map direct pointer properties safely across global framework contexts
window.formRegistry = window.formRegistry || {};
window.formRegistry['minority-certificate-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildMinorityCertificateForm(stateDropdownOptionsHtml);
};

window.buildMinorityCertificateFormPart3 = window.buildMinorityCertificateFormPart3;
window.validateEntireMinorityCertificationWizard = window.validateEntireMinorityCertificationWizard;

