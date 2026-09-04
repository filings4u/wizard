// ============================================================================ //
// ðŸ› ï¸ MCS-150 BIENNIAL UPDATE SERVICE: SYSTEM ENGINE MATRIX (PART 1 OF 3)       //
// ============================================================================ //
function initMcs150UpdateService() {
  window.formRegistry = window.formRegistry || {};

  window.formRegistry['mcs-150-update-validation'] = {
    requiredFields: [
      { id: 'mcs_legal_name', msg: 'Official Carrier Legal Name matching FMCSA records is required.' },
      { id: 'mcs_usdot_number', msg: 'A valid active USDOT Registration Number is required.' },
      { id: 'mcs_federal_ein', msg: 'A standard 9-digit Business EIN is required.' },
      { id: 'mcs_contact_name', msg: "Primary Operations Contact Person's Full Name is required." },
      { id: 'mcs_phone_number', msg: "Contact Person's Phone Number is required." },
      { id: 'mcs_email_address', msg: "Contact Person's Email Address is required." },
      { id: 'mcs_filing_reason', msg: 'Filing Update Vector Parameter selection is required.' },
      { id: 'mcs_vmt_mileage', msg: 'Total calculated vehicle miles traveled (VMT) ledger data is required.' },
      { id: 'mcs_vmt_year', msg: 'Please specify the exact calendar year associated with your mileage tracking indicators.' },
      { id: 'mcs_operation_type', msg: 'Primary business operation regulatory classification is required.' },
      { id: 'mcs_legal_attestation', msg: 'Authorized signature declaration check parameter is mandatory.' }
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

      return { isValid, errors };
    }
  };
}
window.initMcs150UpdateService = initMcs150UpdateService;

// ============================================================================ //
// ðŸ“Š MCS-150 BIENNIAL UPDATE SERVICE: INITIAL FORM INTERFACE (PART 1 OF 3)     //
// ============================================================================ //
window.buildMcs150UpdateFormPart1 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="mcs150-update-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- MAIN UNDERSTANDING OVERLAY TOOLTIP -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px; width: 100%;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> FMCSA MCS-150 Biennial Update Compliance</strong>
        Motor carriers must file an updated Motor Carrier Identification Report (Form MCS-150) every 24 months to sustain active USDOT tracking registration parameters. This safety matrix synchronizes commercial fleet counts, operational classifications, and vehicle miles traveled (VMT) to calculate carrier safety metrics within federal monitoring cycles.
      </div>

      <!-- SECTION 1: CARRIER ACCOUNT IDENTITY PROFILE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Corporate Carrier Registration Identity</h3>
      </div>

      <!-- FIELD 1: OFFICIAL COMPANY LEGAL NAME -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="mcs_legal_name" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Official Carrier Legal Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="mcs_legal_name" required placeholder="Enter exact legal corporate name registered with state records and FMCSA panels" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mcs_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SIDE-BY-SIDE GRID ROW MATRIX CONTAINER -->
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 4px;">
        
        <!-- FIELD 2: USDOT NUMBER -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mcs_usdot_number" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">USDOT Registration Number <span style="color: #ef4444;">*</span></label>
          <input type="text" id="mcs_usdot_number" required placeholder="Enter 7-Digit USDOT Number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
          <div class="wizard-error-message" id="err_mcs_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 3: EMPLOYER IDENTIFICATION NUMBER -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mcs_federal_ein" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Employer Identification Number (EIN) <span style="color: #ef4444;">*</span></label>
          <input type="text" id="mcs_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
          <div class="wizard-error-message" id="err_mcs_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

      </div>

    </div>
  `;
};
window.buildMcs150UpdateFormPart1 = window.buildMcs150UpdateFormPart1;

// ============================================================================ //
// ðŸ“Š MCS-150 BIENNIAL UPDATE SERVICE: LAYOUT MATRIX (PART 2 OF 3)              //
// ============================================================================ //
window.buildMcs150UpdateFormPart2 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="mcs150-update-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 2: CONTACT INFORMATION -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Primary Operations Contact</h3>
      </div>

      <!-- FIELD 4: CONTACT FULL NAME -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px; text-align: left;">
        <label for="mcs_contact_name" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Contact Person's Full Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="mcs_contact_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
        <div class="wizard-error-message" id="err_mcs_contact_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SUB-GRID FIELD SPLIT: PHONE & EMAIL SIDE-BY-SIDE -->
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 4px;">
        <!-- FIELD 5: PHONE NUMBER -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mcs_phone_number" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Contact Person's Phone Number <span style="color: #ef4444;">*</span></label>
          <input type="tel" id="mcs_phone_number" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
          <div class="wizard-error-message" id="err_mcs_phone_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 6: EMAIL ADDRESS -->
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="mcs_email_address" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Contact Person's Email Address <span style="color: #ef4444;">*</span></label>
          <input type="email" id="mcs_email_address" required placeholder="email@example.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;">
          <div class="wizard-error-message" id="err_mcs_email_address" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- SECTION 3: REASON FOR FILING UPDATE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Reason for Update Submission</h3>
      </div>

      <!-- FIELD 7: FILING UPDATE VECTOR PARAMETER DROPDOWN -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px; text-align: left;">
        <label for="mcs_filing_reason" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Filing Update Vector Parameter <span style="color: #ef4444;">*</span></label>
        <select id="mcs_filing_reason" name="mcs_filing_reason" required class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; box-sizing: border-box; color: var(--navy, #0a1f44); font-weight: 600; background: #ffffff; min-height: 44px; cursor: pointer;">
          <option value="" disabled selected>Select Option...</option>
          <option value="biennial_update">Biennial Update (Mandatory 24-Month Data Renewal Cycle)</option>
          <option value="out_of_service">Out of Service Notification Filing Request</option>
          <option value="data_correction">Voluntary Registered Carrier Profile Core Revision</option>
        </select>
        <div class="wizard-error-message" id="err_mcs_filing_reason" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};
window.buildMcs150UpdateFormPart2 = window.buildMcs150UpdateFormPart2;

// ============================================================================ //
// ðŸ“Š MCS-150 BIENNIAL UPDATE SERVICE: LAYOUT MASTER (PART 3 OF 3)              //
// ============================================================================ //
window.buildMcs150UpdateFormPart3 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="mcs150-update-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 5: OPERATIONAL DATA MATRICES -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Fleet &amp; Operational Metrics</h3>
      </div>

      <!-- FIELD 8: MILEAGE STATUS SELECTION -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px; text-align: left;">
        <label for="mcs_mileage_status" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Have your total mileage tracking indicators been calculated? <span style="color: #ef4444;">*</span></label>
        <select id="mcs_mileage_status" name="mcs_mileage_status" required class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; box-sizing: border-box; color: var(--navy, #0a1f44); font-weight: 600; background: #ffffff; min-height: 44px; cursor: pointer;">
          <option value="" disabled selected>Select Option...</option>
          <option value="yes">Yes, mileage tracking registers have been fully recorded</option>
          <option value="no">No, using administrative baseline operation frameworks</option>
        </select>
        <div class="wizard-error-message" id="err_mcs_mileage_status" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SECTION 6: COMPLIANCE DECLARATIONS -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Compliance Verification Affirmation</h3>
      </div>

      <!-- FIELD 9: COMPLIANCE CHECK SELECTION -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px; text-align: left;">
        <label for="mcs_compliance_check" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Have you verified safety governance regulations? <span style="color: #ef4444;">*</span></label>
        <select id="mcs_compliance_check" name="mcs_compliance_check" required class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; box-sizing: border-box; color: var(--navy, #0a1f44); font-weight: 600; background: #ffffff; min-height: 44px; cursor: pointer;">
          <option value="" disabled selected>Select Option...</option>
          <option value="yes">Yes, all carrier tracking matrices align with FMCSA compliance parameters</option>
          <option value="no">No, regulatory parameters require validation adjustments</option>
        </select>
        <div class="wizard-error-message" id="err_mcs_compliance_check" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};

// ============================================================================ //
// ðŸ“Š MCS-150 BIENNIAL UPDATE SERVICE: FLEET EQUIPMENT EXTRA FIELDS            //
// ============================================================================ //
window.buildMcs150UpdateFormEquipmentInventory = function() {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="mcs150-update-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 6: FLEET VOLUMETRICS & EQUIPMENT INVENTORY -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Fleet Volumetrics &amp; Equipment Inventory</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Declare the total active power units, operators, and commercial trailing equipment assets in your fleet profile:</p>
      </div>

      <!-- FIELD 1: POWER UNITS / TRUCKS COUNT -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mcs_trucks_count" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Total Power Units / Trucks <span style="color: #ef4444;">*</span></label>
        <input type="number" id="mcs_trucks_count" required min="1" step="1" placeholder="e.g. 5" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;" oninput="this.value = this.value.replace(/\\D/g, '');">
        <div class="wizard-error-message" id="err_mcs_trucks_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 2: COMMERCIAL DRIVERS COUNT -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="mcs_drivers_count" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Total Commercial Drivers <span style="color: #ef4444;">*</span></label>
        <input type="number" id="mcs_drivers_count" required min="1" step="1" placeholder="e.g. 4" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;" oninput="this.value = this.value.replace(/\\D/g, '');">
        <div class="wizard-error-message" id="err_mcs_drivers_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 3: COMMERCIAL TRAILERS COUNT -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="mcs_trailers_count" style="font-size: 0.85rem; font-weight: 800; color: var(--navy, #0a1f44);">Total Trailing Equipment / Trailers <span style="color: #ef4444;">*</span></label>
        <input type="number" id="mcs_trailers_count" required min="0" step="1" placeholder="e.g. 6 (Enter 0 if none)" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; font-weight: 600;" oninput="this.value = this.value.replace(/\\D/g, '');">
        <div class="wizard-error-message" id="err_mcs_trailers_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};

// ============================================================================ //
// ðŸ› ï¸ IFTA REGISTRATION MODULE: COMPONENT VALIDATION ASSIGNMENTS              //
// ============================================================================ //

// Inject these three configurations inside your standardFields validation tracking map:
/*
  { id: 'mcs_trucks_count', msg: 'Please enter the total number of active trucks/power units in your fleet.' },
  { id: 'mcs_drivers_count', msg: 'Please specify your active commercial driver workforce total count.' },
  { id: 'mcs_trailers_count', msg: 'Please provide your total trailing asset inventory count (Use 0 if none).' }
*/

// Explicit inner-block check logic applied to numeric fleet field allocations:
const validateEquipmentInventoryMetrics = function() {
  let isSectionValid = true;
  const metrics = ['mcs_trucks_count', 'mcs_drivers_count', 'mcs_trailers_count'];
  
  metrics.forEach(id => {
    const el = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (el && document.body.contains(el)) {
      const parsedVal = parseInt(el.value, 10);
      if (isNaN(parsedVal) || parsedVal < 0) {
        isSectionValid = false;
        el.style.setProperty("border-color", "#ef4444", "important");
        if (err) {
          err.textContent = "Please provide a valid, non-negative whole integer count metric.";
          err.style.setProperty("display", "block", "important");
        }
      }
    }
  });
  return isSectionValid;
};

// ============================================================================ //
// ðŸ“¦ MASTER MCS-150 UPDATE APPLICATION ASSEMBLY HOOK                           //
// ============================================================================ //
window.buildMcs150UpdateFormMaster = function(stateDropdownOptionsHtml = "") {
  // 1. Compile individual modular layout matrix strings safely
  const p1 = typeof window.buildMcs150UpdateFormPart1 === "function" ? window.buildMcs150UpdateFormPart1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildMcs150UpdateFormPart2 === "function" ? window.buildMcs150UpdateFormPart2(stateDropdownOptionsHtml) : "";
  const pInventory = typeof window.buildMcs150UpdateFormEquipmentInventory === "function" ? window.buildMcs150UpdateFormEquipmentInventory() : "";
  const p3 = typeof window.buildMcs150UpdateFormPart3 === "function" ? window.buildMcs150UpdateFormPart3(stateDropdownOptionsHtml) : "";

  // 2. Wrap all compiled components inside a full-screen block card stream
  return `
    <div class="mcs150-update-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="mcs_panel_part1" class="mcs-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="mcs_panel_part2" class="mcs-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
      <div id="mcs_panel_equipment" class="mcs-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${pInventory}</div>
      <div id="mcs_panel_part3" class="mcs-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p3}</div>
    </div>
  `;
};

// ============================================================================ //
// ðŸ› ï¸ REGISTER MASTER SCAN VALIDATION INTERFACE & MAP TRACKING HOOKS             //
// ============================================================================ //
window.validateEntireMcs150UpdateWizard = function() {
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

  // Consolidated tracking checklist containing core identifiers and your new volumetric fields
  const standardFields = [
    { id: 'mcs_legal_name', msg: 'Official Carrier Legal Name matching FMCSA records is required.' },
    { id: 'mcs_usdot_number', msg: 'A valid active USDOT Registration Number is required.' },
    { id: 'mcs_ein_number', msg: 'Employer Identification Number (EIN) parameter is required.' },
    { id: 'mcs_contact_name', msg: "Primary operations contact full name is required." },
    { id: 'mcs_phone_number', msg: 'Direct telephone contact parameter is required.' },
    { id: 'mcs_email_address', msg: 'Compliance communications email address is required.' },
    { id: 'mcs_filing_reason', msg: 'Please select an explicit filing update submission reason.' },
    { id: 'mcs_trucks_count', msg: 'Please enter the total number of active trucks/power units in your fleet.' },
    { id: 'mcs_drivers_count', msg: 'Please specify your active commercial driver workforce total count.' },
    { id: 'mcs_trailers_count', msg: 'Please provide your total trailing asset inventory count (Use 0 if none).' },
    { id: 'mcs_mileage_status', msg: 'Please log your commercial vehicle mileage tracking indicators.' },
    { id: 'mcs_compliance_check', msg: 'You must select a safety governance verification statement.' }
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

  return { isValid, errors };
};

// Bind master configuration tracks straight to window.formRegistry definitions
window.formRegistry = window.formRegistry || {};

window.formRegistry['mcs-150-update'] = {
  isValid: function() {
    return window.validateEntireMcs150UpdateWizard().isValid;
  },
  serialize: function() {
    const formData = {};
    const container = document.querySelector('.mcs150-update-master-container');
    if (!container) return formData;

    container.querySelectorAll('input, select').forEach(field => {
      if (field.id) formData[field.id] = field.value ? field.value.trim() : "";
    });
    return formData;
  }
};

window.formRegistry['mcs-150-update-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildMcs150UpdateFormMaster(stateDropdownOptionsHtml);
};

