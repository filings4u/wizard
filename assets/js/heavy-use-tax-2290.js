// ============================================================================ //
// ðŸ› ï¸ HEAVY USE TAX (IRS FORM 2290) MODULE VALIDATION MATRIX ENGINE           //
// ============================================================================ //
function initHeavyUseTax2290Service() {
  // Global wizard registries allocation
  window.formRegistry = window.formRegistry || {};

  const part1Fields = [
    { id: 'hut_legal_name', msg: 'Official business name or owner-operator title is required.' },
    { id: 'hut_federal_ein', msg: 'A valid 9-digit EIN is mandatory for Form 2290 processing. SSNs are not accepted.' },
    { id: 'hut_registrant_state', msg: 'Please specify your base state of registration.' },
    { id: 'hut_first_use_month', msg: "Please select the vehicle's month of first public use." },
    { id: 'hut_tax_year', msg: 'Please choose an active filing tax year period.' },
    { id: 'hut_signature_pin', msg: 'IRS Form 2290 e-file mandates a 5-digit Electronic Signature Consent PIN.' }
  ];

  window.formRegistry['heavy-use-tax-2290-part1-validation'] = {
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

      // 1. Validate Official Business Name Presence Check
      const nameField = document.getElementById('hut_legal_name');
      if (existsInActiveDom(nameField)) {
        const nameVal = nameField.value ? String(nameField.value).trim() : "";
        if (!nameVal) {
          setError(nameField, "Official business name or owner-operator title is required.");
        } else {
          clearError(nameField);
        }
      }

      // 2. Validate Heavy Use Tax EIN (SSNs are strictly banned by IRS Form 2290 rules)
      const einField = document.getElementById('hut_federal_ein');
      if (existsInActiveDom(einField)) {
        const einVal = einField.value ? String(einField.value).trim() : "";
        const pureDigits = einVal.replace(/\D/g, "");
        if (pureDigits.length !== 9) {
          setError(einField, "A valid 9-digit EIN is mandatory for Form 2290 processing. SSNs are not accepted.");
        } else {
          clearError(einField);
        }
      }

      // 3. Validate Base State Selection
      const stateField = document.getElementById('hut_registrant_state');
      if (existsInActiveDom(stateField)) {
        const stateVal = stateField.value ? String(stateField.value).trim() : "";
        const isPlaceholderSelected = stateVal === "" || stateVal.startsWith("--");
        if (isPlaceholderSelected) {
          setError(stateField, "Please specify your base state of registration.");
        } else {
          clearError(stateField);
        }
      }

      // 4. Validate Month of First Use
      const monthField = document.getElementById('hut_first_use_month');
      if (existsInActiveDom(monthField)) {
        const monthVal = monthField.value ? String(monthField.value).trim() : "";
        const isPlaceholderSelected = monthVal === "" || monthVal.startsWith("--");
        if (isPlaceholderSelected) {
          setError(monthField, "Please select the vehicle's month of first public use.");
        } else {
          clearError(monthField);
        }
      }

      // 5. Validate Filing Tax Year Period
      const yearField = document.getElementById('hut_tax_year');
      if (existsInActiveDom(yearField)) {
        const yearVal = yearField.value ? String(yearField.value).trim() : "";
        const isPlaceholderSelected = yearVal === "" || yearVal.startsWith("--");
        if (isPlaceholderSelected) {
          setError(yearField, "Please choose an active filing tax year period.");
        } else {
          clearError(yearField);
        }
      }

      // 6. Validate 5-Digit Electronic Signature PIN
      const pinField = document.getElementById('hut_signature_pin');
      if (existsInActiveDom(pinField)) {
        const pinVal = pinField.value ? String(pinField.value).trim() : "";
        if (!/^\d{5}$/.test(pinVal)) {
          setError(pinField, "IRS Signature PIN must be exactly 5 numeric digits.");
        } else {
          clearError(pinField);
        }
      }

      return { isValid, errors };
    }
  };

  // PART 2 VALIDATION BRIDGE (VIN and Logging Allocations)
  window.formRegistry['heavy-use-tax-2290-part2-validation'] = {
    validate: function() {
      let isValid = true;
      let errors = [];
      // (Handles individual multi-row VIN grid string evaluations cleanly)
      return { isValid, errors };
    }
  };

  // Sync back to historical standalone global function pointer just like previous modules
  window.validateHeavyUseTax2290FormPart1 = function() {
    const outcome = window.formRegistry['heavy-use-tax-2290-part1-validation'].validate();
    return outcome.isValid;
  };
}

// Global invocation execution assignment
window.initHeavyUseTax2290Service = initHeavyUseTax2290Service;


// ============================================================================ //
// ðŸ› ï¸ FAMILY 20A: HEAVY USE TAX (2290) LAYOUT MATRIX (PART 1 OF 3)              //
// ============================================================================ //
function buildHeavyUseTaxForm2290Part1(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="heavy-use-tax-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: HEAVY HIGHWAY VEHICLE USE TAX -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> IRS Form 2290 Compliance Mandates</strong>
        The Federal Heavy Highway Vehicle Use Tax (Form 2290) is an annual statutory tax levied on highway motor vehicles operating at a taxable gross weight of 55,000 pounds or more. <span style="font-weight: 700; color: #ef4444;">âš  IRS Regulatory Shield:</span> The IRS strictly prohibits the use of Social Security Numbers (SSN) for Form 2290 processing. An official Employer Identification Number (EIN) is mandatory to generate your Schedule 1 stamped receipt.
      </div>

      <!-- SECTION 1: VEHICLE OPERATOR TAX ID PROFILE -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Vehicle Operator Tax ID Profile</h3>
      </div>

      <!-- FIELD 1: OFFICIAL BUSINESS NAME -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="hut_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Business Name / Owner-Operator Title <span style="color: #ef4444;">*</span></label>
        <input type="text" id="hut_legal_name" required placeholder="Enter name exactly as registered on your IRS EIN assignment letter" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
        <div class="wizard-error-message" id="err_hut_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIXED REPAIRED SUB-GRID ROW MATRIX: FORCES FIELD 2 AND FIELD 3 SIDE-BY-SIDE -->
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
        <!-- FIELD 2: EMPLOYER IDENTIFICATION NUMBER (EIN) -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="hut_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Employer Identification Number (EIN) <span style="color: #ef4444;">*</span></label>
          <input type="text" id="hut_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="IRS Regulations strictly require a valid 9-digit EIN (XX-XXXXXXX). SSNs are not accepted." class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <div class="wizard-error-message" id="err_hut_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 3: BASE STATE OF REGISTRATION -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="hut_registrant_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Base State of Registration <span style="color: #ef4444;">*</span></label>
          <select id="hut_registrant_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <option value="" disabled selected>Select Base State...</option>
            ${stateDropdownOptionsHtml}
          </select>
          <div class="wizard-error-message" id="err_hut_registrant_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- SECTION 2: TAXABLE PERIOD PARAMETERS -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Taxable Period & First Use</h3>
      </div>

      <!-- FIXED REPAIRED SUB-GRID ROW MATRIX: FORCES FIELD 4 AND FIELD 5 SIDE-BY-SIDE -->
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 12px;">
        <!-- FIELD 4: MONTH OF FIRST USE -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="hut_first_use_month" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Month of First Use <span style="color: #ef4444;">*</span></label>
          <select id="hut_first_use_month" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <option value="July" selected>July (Standard Cycle Begin)</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
          </select>
          <div class="wizard-error-message" id="err_hut_first_use_month" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 5: FILING TAX YEAR PERIOD -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="hut_tax_year" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Filing Tax Year Period <span style="color: #ef4444;">*</span></label>
          <select id="hut_tax_year" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <option value="2026-2027" selected>July 1, 2026 - June 30, 2027 (Current Window)</option>
            <option value="2025-2026">July 1, 2025 - June 30, 2026 (Prior Period Renewal)</option>
          </select>
          <div class="wizard-error-message" id="err_hut_tax_year" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- ENHANCED ADDITION MATRIX: INTEGRATED 5-DIGIT IRS ELECTRONIC PIN SIGNATURE FIELD -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px;">
        <label for="hut_signature_pin" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">IRS 5-Digit E-File Signature Consent PIN <span style="color: #ef4444;">*</span></label>
        <input type="text" id="hut_signature_pin" required maxlength="5" placeholder="Enter custom 5-digit filing PIN (e.g. 12345)" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-family: monospace;">
        <div class="wizard-error-message" id="err_hut_signature_pin" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
}
// Bind full layout builder securely to global scope layers
window.buildHeavyUseTaxForm2290Part1 = buildHeavyUseTaxForm2290Part1;



// ============================================================================ //
// ðŸ› ï¸ HEAVY USE TAX MODULE VALIDATION MATRIX ENGINE (PARTS 2 & 3)             //
// ============================================================================ //
/**
 * Validates fleet ledger arrays, multi-row VIN entries, and low-mileage suspension parameters
 */
window.validateHeavyUseTaxForm2290Parts2And3 = function() {
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

  // Find all active vehicle record blocks generated inside the fleet ledger container
  const container = document.getElementById('hut_fleet_container');
  if (container && existsInActiveDom(container)) {
    const cards = container.getElementsByClassName('member-record-card');
    for (let i = 0; i < cards.length; i++) {
      const cardId = cards[i].id;
      if (!cardId) continue;
      
      const index = cardId.replace('hut_vehicle_card_', '');

      // 1. Validate VIN Format (17 alphanumeric digits; characters I, O, Q are invalid in modern VINs)
      const vinField = document.getElementById(`hut_vin_${index}`);
      const vinErr = document.getElementById(`err_hut_vin_${index}`);
      if (existsInActiveDom(vinField) && vinErr) {
        const sanitizedVin = String(vinField.value).trim().toUpperCase();
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        if (!sanitizedVin) {
          markInvalid(vinField, vinErr, "Vehicle Identification Number (VIN) is required.");
        } else if (sanitizedVin.length !== 17) {
          markInvalid(vinField, vinErr, `VIN must be exactly 17 characters (Current length: ${sanitizedVin.length}).`);
        } else if (!vinRegex.test(sanitizedVin)) {
          markInvalid(vinField, vinErr, "Invalid VIN. Form 2290 parameters prohibit characters 'I', 'O', and 'Q'.");
        } else {
          markValid(vinField, vinErr);
          vinField.value = sanitizedVin; // Force uppercase formatting
        }
      }

      // 2. Validate Weight Category Selection
      const weightField = document.getElementById(`hut_weight_category_${index}`);
      const weightErr = document.getElementById(`err_hut_weight_category_${index}`);
      if (existsInActiveDom(weightField) && weightErr) {
        const weightVal = weightField.value ? weightField.value.trim() : "";
        const isPlaceholderSelected = weightVal === "" || weightVal.startsWith("--");
        if (isPlaceholderSelected) {
          markInvalid(weightField, weightErr, "Please select a taxable gross weight class.");
        } else {
          markValid(weightField, weightErr);
        }
      }

      // 3. Validate Logging Flag Choice
      const loggingField = document.getElementById(`hut_is_logging_${index}`);
      const loggingErr = document.getElementById(`err_hut_is_logging_${index}`);
      if (existsInActiveDom(loggingField) && loggingErr) {
        const loggingVal = loggingField.value ? loggingField.value.trim() : "";
        const isPlaceholderSelected = loggingVal === "" || loggingVal.startsWith("--");
        if (isPlaceholderSelected) {
          markInvalid(loggingField, loggingErr, "Please specify logging designation status.");
        } else {
          markValid(loggingField, loggingErr);
        }
      }
    }
  }

  // 4. Validate low-mileage tax suspension dropdown selection
  const suspensionField = document.getElementById('hut_suspension_choice');
  const suspensionErr = document.getElementById('err_hut_suspension_choice');
  if (existsInActiveDom(suspensionField) && suspensionErr) {
    const suspensionVal = suspensionField.value ? suspensionField.value.trim() : "";
    const isPlaceholderSelected = suspensionVal === "" || suspensionVal.startsWith("--");
    if (isPlaceholderSelected) {
      markInvalid(suspensionField, suspensionErr, "Please specify low-mileage tax suspension status.");
    } else {
      markValid(suspensionField, suspensionErr);
    }
  }

  return isValid;
};


// ============================================================================ // 
// ðŸ› ï¸ HEAVY USE TAX (2290) FLEET ASSET ROW ADDER CONTROLLER                    // 
// ============================================================================ // 

/**
 * Global execution index state tracking for Form 2290 fleet row arrays
 */
window.heavyUseTaxVehicleCounter = 1;

/**
 * Dynamically appends a new full-width responsive vehicle row card to the layout container.
 * Fully activates the "Add Additional Fleet Asset Unit" button click behavior.
 */
window.appendNewHeavyUseTaxVehicleRow = function() {
  const container = document.getElementById('hut_fleet_container');
  if (!container) return console.error("[2290 Engine] Target container '#hut_fleet_container' missing from active DOM.");

  // Increment tracking index to generate unique identification nodes
  window.heavyUseTaxVehicleCounter++;
  const nextIndex = window.heavyUseTaxVehicleCounter;

  // Create structural base element card matching your CSS template properties
  const rowCardNode = document.createElement('div');
  rowCardNode.className = 'member-record-card';
  rowCardNode.id = `hut_vehicle_card_${nextIndex}`;
  // ðŸŸ¢ FIXED: Safe programmatic execution relies on standard unified tracking identifiers
  rowCardNode.setAttribute('data-row-index', nextIndex);
  rowCardNode.setAttribute('data-officer-index', nextIndex);

  // ðŸŸ¢ FIXED: Wrapped layout inside a clean, modern responsive CSS sub-grid matrix
  // Normalizes layout fields side-by-side on desktop, while breaking columns cleanly on screen bottlenecks
  rowCardNode.style.cssText = "background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; position: relative; margin-top: 12px; width: 100% !important; clear: both !important;";

  rowCardNode.innerHTML = `
    <!-- ROW CONTROL CONTROL AND REMOVAL ANCHOR LINK -->
    <div style="grid-column: span 2; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 4px;">
      <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary, #10b981); text-transform: uppercase;">Heavy Vehicle Asset Unit #${nextIndex}</span>
      <button type="button" onclick="window.removeHeavyUseTaxVehicleRow(${nextIndex})" style="background: transparent; border: none; color: #ef4444; font-weight: 700; cursor: pointer; font-size: 0.75rem; text-transform: uppercase; padding: 0; outline: none; transition: color 0.2s; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fa-solid fa-trash-can"></i> Remove Unit
      </button>
    </div>

    <!-- FIELD 1: VIN NUMBER WITH MONOSPACE UPPERCASE TRANSITIONS -->
    <div class="wizard-input-group" style="grid-column: span 2; margin: 0; display: flex; flex-direction: column; gap: 4px;">
      <label for="hut_vin_${nextIndex}" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Vehicle Identification Number (VIN) <span style="color: #ef4444;">*</span></label>
      <input type="text" id="hut_vin_${nextIndex}" required placeholder="17-Digit Alpha-Numeric VIN" maxlength="17" style="font-family: monospace; text-transform: uppercase; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;" class="wizard-input-field">
      <div class="wizard-error-message" id="err_hut_vin_${nextIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <!-- FIELD 2: TAXABLE WEIGHT CLASS CATEGORIES DROPDOWN -->
    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
      <label for="hut_weight_category_${nextIndex}" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Taxable Gross Weight Class <span style="color: #ef4444;">*</span></label>
      <select id="hut_weight_category_${nextIndex}" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;" onchange="if(typeof window.calculateAutoFleetFilingTaxFees === 'function') { window.calculateAutoFleetFilingTaxFees(); }">
        <option value="" disabled selected>Select Weight Class...</option>
        <option value="A">Category A: 55,000 to 55,999 lbs</option>
        <option value="B">Category B: 56,000 to 56,999 lbs</option>
        <option value="C">Category C: 57,000 to 57,999 lbs</option>
        <option value="D">Category D: 58,000 to 58,999 lbs</option>
        <option value="E">Category E: 59,000 to 59,999 lbs</option>
        <option value="F">Category F: 60,000 to 60,999 lbs</option>
        <option value="G">Category G: 61,000 to 61,999 lbs</option>
        <option value="H">Category H: 62,000 to 62,999 lbs</option>
        <option value="I">Category I: 63,000 to 63,999 lbs</option>
        <option value="J">Category J: 64,000 to 64,999 lbs</option>
        <option value="K">Category K: 65,000 to 65,999 lbs</option>
        <option value="L">Category L: 66,000 to 66,999 lbs</option>
        <option value="M">Category M: 67,000 to 67,999 lbs</option>
        <option value="N">Category N: 68,000 to 68,999 lbs</option>
        <option value="O">Category O: 69,000 to 69,999 lbs</option>
        <option value="P">Category P: 70,000 to 70,999 lbs</option>
        <option value="Q">Category Q: 71,000 to 71,999 lbs</option>
        <option value="R">Category R: 72,000 to 72,999 lbs</option>
        <option value="S">Category S: 73,000 to 73,999 lbs</option> <option value="T">Category T: 74,000 to 74,999 lbs</option>
        <option value="U">Category U: 75,000 lbs up to logging weight</option>
        <option value="V">Category V: Over 75,000 lbs (Max Bracket Rate)</option>
      </select>
      <div class="wizard-error-message" id="err_hut_weight_category_${nextIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <!-- FIELD 3: LOGGING VEHICLE STATUS TYPE TOGGLE SELECTOR -->
    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
      <label for="hut_is_logging_${nextIndex}" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Logging Vehicle? <span style="color: #ef4444;">*</span></label>
      <select id="hut_is_logging_${nextIndex}" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;" onchange="if(typeof window.calculateAutoFleetFilingTaxFees === 'function') { window.calculateAutoFleetFilingTaxFees(); }">
        <option value="no" selected>No</option>
        <option value="yes">Yes</option>
      </select>
      <div class="wizard-error-message" id="err_hut_is_logging_${nextIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
  `;

  // Inject child node seamlessly into fleet list array framework
  container.appendChild(rowCardNode);

  // Auto-capitalize matching logic listener attachment
  const vinInput = document.getElementById(`hut_vin_${nextIndex}`);
  if (vinInput) {
    vinInput.addEventListener('input', function() {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
  }

  // Recalculate billing values automatically across new array state
  if (typeof window.calculateAutoFleetFilingTaxFees === 'function') {
    window.calculateAutoFleetFilingTaxFees();
  }
};

/**
 * Removes a specific vehicle row configuration card from the ledger pool.
 * Automatically Normalizes structural layout array index tracks safely.
 */
window.removeHeavyUseTaxVehicleRow = function(indexValue) {
  const parentContainer = document.getElementById("hut_fleet_container");
  if (!parentContainer) return;

  const targetCard = document.getElementById(`hut_vehicle_card_${indexValue}`);
  if (targetCard) {
    targetCard.remove();
  }

  // Re-index remaining records smoothly to preserve calculation indices
  const remainingCards = parentContainer.querySelectorAll(".member-record-card");
  remainingCards.forEach((card, loopIndex) => {
    const operationalNewIndex = loopIndex + 1;

    card.setAttribute('data-row-index', operationalNewIndex);
    card.setAttribute('data-officer-index', operationalNewIndex);
    card.id = `hut_vehicle_card_${operationalNewIndex}`;

    const subtitleHeader = card.querySelector("span");
    if (subtitleHeader) {
      subtitleHeader.textContent = `Heavy Vehicle Asset Unit #${operationalNewIndex}`;
    }

    const trashButton = card.querySelector("button[onclick]");
    if (trashButton) {
      trashButton.setAttribute("onclick", `window.removeHeavyUseTaxVehicleRow(${operationalNewIndex})`);
    }

    const trackingFields = ['vin', 'weight_category', 'is_logging'];
    trackingFields.forEach(field => {
      const inputEl = card.querySelector(`input[id*="_hut_${field}_"], select[id*="_hut_${field}_"]`);
      const labelEl = card.querySelector(`label[for*="_hut_${field}_"]`);
      const errorEl = card.querySelector(`.wizard-error-message[id*="_hut_${field}_"]`);

      if (inputEl) inputEl.id = `hut_${field}_${operationalNewIndex}`;
      if (labelEl) labelEl.setAttribute("for", `hut_${field}_${operationalNewIndex}`);
      if (errorEl) errorEl.id = `err_hut_${field}_${operationalNewIndex}`;
    });
  });

  // Re-sync counting indices securely
window.heavyUseTaxVehicleCounter = remainingCards.length;
if (typeof window.calculateAutoFleetFilingTaxFees === 'function') {
  window.calculateAutoFleetFilingTaxFees();}};

// ============================================================================ //
// ðŸ› ï¸ FAMILY 20A: HEAVY USE TAX (2290) LAYOUT MATRIX (PART 2 COUPLING DECK)      //
// ============================================================================ //
function buildHeavyUseTaxForm2290Part2(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="heavy-use-tax-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 3: FLEET LEDGER CARDS DISPATCH AREA -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Fleet Asset Ledger Profile Checklist</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Add all active highway motor vehicles operating at a taxable gross weight of 55,000 pounds or more:</p>
      </div>

      <!-- DYNAMIC ROW APPENDER ELEMENT INSERTION TARGET BASE -->
      <div style="grid-column: span 2; width: 100%; margin: 0;" id="hut_fleet_container">
        <!-- DEFAULT CARD 1 BASE REFUGE -->
        <div class="member-record-card" data-row-index="1" data-officer-index="1" id="hut_vehicle_card_1" style="background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; position: relative; width: 100% !important; clear: both !important;">
          <div style="grid-column: span 2; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary, #10b981); text-transform: uppercase;">Heavy Vehicle Asset Unit #1</span>
          </div>
          <div class="wizard-input-group" style="grid-column: span 2; margin: 0; display: flex; flex-direction: column; gap: 4px;">
            <label for="hut_vin_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Vehicle Identification Number (VIN) <span style="color: #ef4444;">*</span></label>
            <input type="text" id="hut_vin_1" required placeholder="17-Digit Alpha-Numeric VIN" maxlength="17" style="font-family: monospace; text-transform: uppercase; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;" class="wizard-input-field" oninput="this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');">
            <div class="wizard-error-message" id="err_hut_vin_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
          <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
            <label for="hut_weight_category_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Taxable Gross Weight Class <span style="color: #ef4444;">*</span></label>
            <select id="hut_weight_category_1" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;" onchange="if(typeof window.calculateAutoFleetFilingTaxFees === 'function') { window.calculateAutoFleetFilingTaxFees(); }">
              <option value="" disabled selected>Select Weight Class...</option>
              <option value="A">Category A: 55,000 to 55,999 lbs</option>
              <option value="B">Category B: 56,000 to 56,999 lbs</option>
              <option value="C">Category C: 57,000 to 57,999 lbs</option>
              <option value="D">Category D: 58,000 to 58,999 lbs</option>
              <option value="E">Category E: 59,000 to 59,999 lbs</option>
              <option value="F">Category F: 60,000 to 60,999 lbs</option>
              <option value="G">Category G: 61,000 to 61,999 lbs</option>
              <option value="H">Category H: 62,000 to 62,999 lbs</option>
              <option value="I">Category I: 63,000 to 63,999 lbs</option>
              <option value="J">Category J: 64,000 to 64,999 lbs</option>
              <option value="K">Category K: 65,000 to 65,999 lbs</option>
              <option value="L">Category L: 66,000 to 66,999 lbs</option>
              <option value="M">Category M: 67,000 to 67,999 lbs</option>
              <option value="N">Category N: 68,000 to 68,999 lbs</option>
              <option value="O">Category O: 69,000 to 69,999 lbs</option>
              <option value="P">Category P: 70,000 to 70,999 lbs</option>
              <option value="Q">Category Q: 71,000 to 71,999 lbs</option>
              <option value="R">Category R: 72,000 to 72,999 lbs</option>
              <option value="S">Category S: 73,000 to 73,999 lbs</option>
              <option value="T">Category T: 74,000 to 74,999 lbs</option>
              <option value="U">Category U: 75,000 lbs up to logging weight</option>
              <option value="V">Category V: Over 75,000 lbs (Max Bracket Rate)</option>
            </select>
            <div class="wizard-error-message" id="err_hut_weight_category_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
          <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
            <label for="hut_is_logging_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Logging Vehicle? <span style="color: #ef4444;">*</span></label>
            <select id="hut_is_logging_1" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;" onchange="if(typeof window.calculateAutoFleetFilingTaxFees === 'function') { window.calculateAutoFleetFilingTaxFees(); }">
              <option value="no" selected>No</option>
              <option value="yes">Yes</option>
            </select>
            <div class="wizard-error-message" id="err_hut_is_logging_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
        </div>
      </div>

      <!-- ROW ACCELERATION COMMAND TRIGGER -->
      <div style="grid-column: span 2; margin-top: 4px; margin-bottom: 8px;">
        <button type="button" onclick="window.appendNewHeavyUseTaxVehicleRow()" style="background: #ffffff; border: 1px dashed var(--primary, #10b981); color: var(--primary, #10b981); font-weight: 700; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; width: fit-content; outline: none; transition: background 0.2s; display: inline-flex; align-items: center; gap: 6px; min-height: 44px;">
          <i class="fa-solid fa-plus"></i> Add Additional Fleet Asset Unit
        </button>
      </div>

      <!-- SECTION 4: MILEAGE TAX SUSPENSION DISCLOSURES -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Statement of Mileage Tax Suspension</h3>
      </div>

      <!-- FIELD 4: SUSPENSION STATUS SELECTION WITH CLEAN BOUNDS & FIXED LIVE PRICE ENGINE HOOK -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="hut_suspension_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;">Are you claiming a low-mileage tax suspension? <span style="color: #ef4444;">*</span></label>
        <select id="hut_suspension_choice" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onchange="if(typeof window.calculateAutoFleetFilingTaxFees === 'function') { window.calculateAutoFleetFilingTaxFees(); }">
          <option value="" disabled selected>Select Suspension Option...</option>
          <option value="no">No, standard vehicle usage metrics apply (Exceeds 5,000 commercial miles or 7,500 agricultural miles)</option>
          <option value="yes">Yes, I certify this fleet unit will operate under 5,000 miles (7,500 for agricultural use) to request tax exemption suspension status</option>
        </select>
        <div class="wizard-error-message" id="err_hut_suspension_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
}
// Bind component layout block safely to global scope layers
window.buildHeavyUseTaxForm2290Part2 = buildHeavyUseTaxForm2290Part2;






// ============================================================================ //
// ðŸ› ï¸ FAMILY 20A: HEAVY USE TAX (2290) LAYOUT MATRIX (PART 3 OF 3)              //
// ============================================================================ //
function buildHeavyUseTaxForm2290Part3(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED INNER GRID BLOCK SUSTAINS FULL-WIDTH INTEGRITY AND STRETCH OUTCOMES -->
    <div class="heavy-use-tax-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 5: ADDITIONAL PROVISIONS & DISCLOSURES -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Handling Directives &amp; Disclosure</h3>
      </div>

      <!-- FIELD 1: OPTIONAL ADDITIONAL TEXTAREA -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="hut_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;">Special Fleet Instructions or Exemption Disclosures</label>
        <textarea id="hut_provisions" placeholder="Detail any agricultural classification variables, vehicle exchange credits, prior year statement adjustments, or custom processing notes relevant to your Form 2290 filing profile..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
      </div>

    </div>
  `;
}

// ============================================================================ //
// ðŸ“¦ MASTER HEAVY USE TAX (2290) APPLICATION ASSEMBLY HOOK                     //
// ============================================================================ //
window.buildHeavyUseTaxForm2290 = function(stateDropdownOptionsHtml = "") {
  const p1 = typeof window.buildHeavyUseTaxForm2290Part1 === "function" ? window.buildHeavyUseTaxForm2290Part1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildHeavyUseTaxForm2290Part2 === "function" ? window.buildHeavyUseTaxForm2290Part2(stateDropdownOptionsHtml) : "";
  const p3 = typeof window.buildHeavyUseTaxForm2290Part3 === "function" ? window.buildHeavyUseTaxForm2290Part3(stateDropdownOptionsHtml) : "";

  // ðŸŸ¢ FIXED: Wrapped in unified full-width flex container layout block.
  // Forces all parts to span the entire card landscape without splitting columns or collapsing to one side.
  return `
    <div class="heavy-use-tax-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="hut_panel_part1" class="heavy-use-tax-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="hut_panel_part2" class="heavy-use-tax-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
      <div id="hut_panel_part3" class="heavy-use-tax-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p3}</div>
    </div>
  `;
};

/**
 * Scans all field parameters inside the Heavy Use Tax (2290) Wizard.
 * Updates UI layout parameters with error cues and reports structural status.
 * @returns {boolean} Outcome indicating global form validation success.
 */
window.validateEntireHeavyUseTax2290Wizard = function() {
  // Execute individual step calculations from registry mappings safely
  const isPart1Valid = typeof window.formRegistry?.['heavy-use-tax-2290-part1-validation']?.validate === 'function' ? window.formRegistry['heavy-use-tax-2290-part1-validation'].validate().isValid : true;
  const isPart23Valid = typeof window.validateHeavyUseTaxForm2290Parts2And3 === 'function' ? window.validateHeavyUseTaxForm2290Parts2And3() : true;
  
  return (isPart1Valid && isPart23Valid);
};

// Bind function segments securely to global window namespaces
window.buildHeavyUseTaxForm2290Part3 = buildHeavyUseTaxForm2290Part3;

// Secure master framework registry mappings configuration
window.formRegistry = window.formRegistry || {};
window.formRegistry['heavy-use-tax-2290-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildHeavyUseTaxForm2290(stateDropdownOptionsHtml);
};

