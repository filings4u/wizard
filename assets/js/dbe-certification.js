// ============================================================================ //
// ðŸ› ï¸ DBE CERTIFICATION SERVICE: REGULATORY ENGINE MATRIX (PART 1 OF 3)       //
// ============================================================================ //
function initDisadvantagedBusinessService() {
  window.formRegistry = window.formRegistry || {};

  window.formRegistry['dbe-certificate-validation'] = {
    requiredFields: [
      { id: 'dbe_legal_name', msg: 'Official business entity legal name is required.' },
      { id: 'dbe_federal_ein', msg: 'A standard 9-digit EIN is required (e.g., 12-3456789).' },
      { id: 'dbe_base_state', msg: 'Please select your base state of operational registration.' },
      { id: 'dbe_net_worth_check', msg: 'Personal Net Worth (PNW) threshold statement selection is mandatory.' }
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

      const pnwSelect = document.getElementById('dbe_net_worth_check');
      if (existsInActiveDom(pnwSelect) && pnwSelect.value === "exceeds") {
        setError(pnwSelect, "U.S. DOT statutory limits restrict DBE eligibility to individuals below the $2.04 million personal net worth ceiling.");
      }

      return { isValid, errors };
    }
  };

  window.formRegistry["dbe-certificate"] = {
    isValid: function() {
      return window.formRegistry['dbe-certificate-validation'].validate().isValid;
    },
    serialize: function() {
      const formData = {};
      const container = document.querySelector('.dbe-certification-master-container');
      if (!container) return formData;
      container.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.id) formData[field.id] = field.value ? field.value.trim() : "";
      });
      return formData;
    }
  };
}
window.initDisadvantagedBusinessService = initDisadvantagedBusinessService;

// ============================================================================ //
// ðŸ“Š FAMILY 26A: DBE CERTIFICATION FORM LAYOUT (PART 1 OF 3)                   //
// ============================================================================ //
window.buildDbeCertificateFormPart1 = function(stateDropdownOptionsHtml = "") {
  return `
    <div class="dbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- MAIN UNDERSTANDING OVERLAY TOOLTIP -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px; width: 100%;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Disadvantaged Business Enterprise (DBE) Certification Program</strong>
        The DBE program is a federal regulation governed by the U.S. Department of Transportation (U.S. DOT). It assists socially and economically disadvantaged individuals in securing transit-related contracting opportunities across federal highways, aviation, and intermodal public infrastructure projects.
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Carrier Enterprise Baseline Profile</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="dbe_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Official Business Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="dbe_legal_name" required placeholder="Enter exact legal company name matching state organization documents" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_dbe_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="dbe_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Federal Employer ID (EIN) <span style="color: #ef4444;">*</span></label>
        <input type="text" id="dbe_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_dbe_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="dbe_base_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Home State of Operations <span style="color: #ef4444;">*</span></label>
        <select id="dbe_base_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
          <option value="" disabled selected>Select Base State...</option>
          ${stateDropdownOptionsHtml}
        </select>
        <div class="wizard-error-message" id="err_dbe_base_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};
window.buildDbeCertificateFormPart1 = buildDbeCertificateFormPart1;
// ============================================================================ //
// ðŸ“Š FAMILY 26A: DBE CERTIFICATION FORM LAYOUT (PART 2 OF 3)                   //
// ============================================================================ //
window.buildDbeCertificateFormPart2 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="dbe-certification-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 2: PERSONAL NET WORTH DISCLOSURE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Personal Net Worth Statutory Compliance</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">U.S. DOT rules under 49 CFR Part 26 cap qualifying personal net worth at a specific ceiling to ensure benefits reach targeted economic thresholds.</p>
      </div>

      <!-- FIELD 1: PERSONAL NET WORTH CEILING STATUS -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="dbe_net_worth_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Personal Net Worth Cap Status <span style="color: #ef4444;">*</span></label>
        <select id="dbe_net_worth_check" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
          <option value="" disabled selected>Select Net Worth Range Status...</option>
          <option value="under_threshold">Yes, I certify that my personal net worth falls below the current U.S. DOT statutory threshold</option>
          <option value="exceeds">No, my personal net worth exceeds the current economic program maximum allowances</option>
        </select>
        <div class="wizard-error-message" id="err_dbe_net_worth_check" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SECTION 3: REQUISITE FINANCIAL & CITIZENSHIP UPLOADS -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Mandatory Economic &amp; Disadvantaged Document Vault</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Provide official administrative records to substantiate program eligibility requirements:</p>
      </div>

      <!-- DESKTOP DUAL COLUMN CARD DISPLAY FLOW -->
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; box-sizing: border-box; width: 100%;">
        
        <!-- UPLOAD 1: SBA/DOT PERSONAL NET WORTH STATEMENT -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="dbe_file_pnw_statement" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Official Personal Net Worth Statement (PNW Form) <span style="color: #ef4444;">*</span></label>
          <input type="file" id="dbe_file_pnw_statement" required class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_dbe_file_pnw_statement" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- UPLOAD 2: PERSONAL & BUSINESS TAX RECORDS -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="dbe_file_tax_records" style="font-size: 0.8rem; font-weight: 700; color: var(--navy, #0a1f44); display: block;">Past 3 Years of Personal &amp; Corporate Tax Returns <span style="color: #ef4444;">*</span></label>
          <input type="file" id="dbe_file_tax_records" required class="wizard-input-field" accept=".pdf" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background: #ffffff;">
          <div class="wizard-error-message" id="err_dbe_file_tax_records" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

      </div>

    </div>
  `;
};
window.buildDbeCertificateFormPart2 = buildDbeCertificateFormPart2;


// ============================================================================ //
// ðŸ› ï¸ DBE CERTIFICATION SERVICE: MASTER VALIDATION MATRIX ENGINE               //
// ============================================================================ //
window.validateEntireDbeCertificationWizard = function() {
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

  // 1. Process Base Profile & Dropdown Data Validation Checklist
  const standardFields = [
    { id: 'dbe_legal_name', msg: 'Official business entity legal name is required.' },
    { id: 'dbe_federal_ein', msg: 'A standard 9-digit EIN parameter is required.' },
    { id: 'dbe_base_state', msg: 'Please select your base state of operational registration.' },
    { id: 'dbe_net_worth_check', msg: 'Personal Net Worth (PNW) threshold statement selection is mandatory.' }
  ];

  standardFields.forEach(f => {
    const fieldEl = document.getElementById(f.id);
    const errorEl = document.getElementById("err_" + f.id);
    if (existsInActiveDom(fieldEl) && errorEl) {
      const rawVal = fieldEl.value ? String(fieldEl.value).trim() : "";
      if (rawVal === "" || rawVal.startsWith("--")) {
        markInvalid(fieldEl, errorEl, f.msg);
      } else {
        markValid(fieldEl, errorEl);
      }
    }
  });

  // 2. Process Personal Net Worth Ineligibility Block
  const pnwSelect = document.getElementById('dbe_net_worth_check');
  const pnwErr = document.getElementById('err_dbe_net_worth_check');
  if (existsInActiveDom(pnwSelect) && pnwSelect.value === "exceeds" && pnwErr) {
    markInvalid(pnwSelect, pnwErr, "U.S. DOT statutory limits restrict DBE eligibility to individuals below the $2.04 million personal net worth ceiling.");
  }

  // 3. Process Mandatory File Upload Matrix Checking Lines
  const uploadFields = [
    { id: 'dbe_file_pnw_statement', errId: 'err_dbe_file_pnw_statement', msg: "Please attach your official signed Personal Net Worth Statement document." },
    { id: 'dbe_file_tax_records', errId: 'err_dbe_file_tax_records', msg: "Past 3 years of personal and corporate tax return ledgers are required." }
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

  return { isValid, errors };
};

// ============================================================================ //
// ðŸ“¦ MASTER DBE CERTIFICATION APPLICATION ASSEMBLY HOOK                         //
// ============================================================================ //
window.buildDbeCertificateFormMaster = function(stateDropdownOptionsHtml = "") {
  const p1 = typeof window.buildDbeCertificateFormPart1 === "function" ? window.buildDbeCertificateFormPart1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildDbeCertificateFormPart2 === "function" ? window.buildDbeCertificateFormPart2(stateDropdownOptionsHtml) : "";

  // Forces full-width vertical layout blocks matching previous system streams natively
  return `
    <div class="dbe-certification-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="dbe_panel_part1" class="dbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="dbe_panel_part2" class="dbe-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
    </div>
  `;
};

// Bind configuration object states cleanly to window.formRegistry
window.formRegistry = window.formRegistry || {};

window.formRegistry['dbe-certificate'] = {
  isValid: function() {
    return window.validateEntireDbeCertificationWizard().isValid;
  },
  serialize: function() {
    const formData = {};
    const container = document.querySelector('.dbe-certification-master-container');
    if (!container) return formData;

    container.querySelectorAll('input, select').forEach(field => {
      if (field.id) formData[field.id] = field.value ? field.value.trim() : "";
    });
    return formData;
  }
};

// Aligned registry key and internal callback function pointers exactly
window.formRegistry['dbe-certificate-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildDbeCertificateFormMaster(stateDropdownOptionsHtml);
};

window.buildDbeCertificateFormMaster = window.buildDbeCertificateFormMaster;

