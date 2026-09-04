// ============================================================================ //
// ðŸ› ï¸ IFTA QUARTERLY RETURNS SERVICE: VALIDATION MATRIX ENGINE                  //
// ============================================================================ //
function initIftaQuarterlyReturnsService() {
  window.formRegistry = window.formRegistry || {};
  
  const iftaBaseFields = [
    { id: 'ifta_legal_name', msg: 'Official Carrier Legal Name is required.' },
    { id: 'ifta_account_num', msg: 'IFTA License/Account Number is required.' },
    { id: 'ifta_filing_quarter', msg: 'Please select a specific tax filing quarter period.' },
    { id: 'ifta_base_jurisdiction', msg: 'Please specify your base state or jurisdiction of license.' }
  ];

  window.formRegistry['ifta-quarterly-returns-validation'] = {
    requiredFields: iftaBaseFields,
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

      // 1. Process Baseline Profile Fields Validation
      iftaBaseFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (existsInActiveDom(el)) {
          const val = el.value ? String(el.value).trim() : "";
          const isPlaceholderSelected = val === "" || val.startsWith("--");
          if (isPlaceholderSelected) {
            setError(el, field.msg);
          } else {
            clearError(el);
          }
        }
      }); // ðŸŸ¢ FIXED: Closed loop syntax bracket safely

      // 2. Scan Dynamic Jurisdiction Miles/Gallons Cards
      const container = document.getElementById('ifta_juris_container');
      if (container && existsInActiveDom(container)) {
        const cards = container.getElementsByClassName('member-record-card');
        if (cards.length === 0) {
          isValid = false;
          errors.push("At least one operational jurisdiction data log is required to calculate fuel tax distributions.");
          const matrixErr = document.getElementById('err_ifta_juris_matrix');
          if (matrixErr) {
            matrixErr.textContent = "You must log mileage and fuel parameters for at least 1 traveled jurisdiction.";
            matrixErr.style.setProperty("display", "block", "important");
          }
        } else {
          const matrixErr = document.getElementById('err_ifta_juris_matrix');
          if (matrixErr) matrixErr.style.setProperty("display", "none", "important");

          // Evaluate nested inputs inside each jurisdiction tracking block
          for (let i = 0; i < cards.length; i++) {
            const cardId = cards[i].id;
            const index = cardId.replace('ifta_juris_card_', '');
            
            const stateField = document.getElementById(`ifta_state_${index}`);
            const milesField = document.getElementById(`ifta_miles_${index}`);
            const fuelField = document.getElementById(`ifta_fuel_${index}`);

            if (existsInActiveDom(stateField)) {
              const stateVal = stateField.value ? stateField.value.trim() : "";
              if (!stateVal || stateVal.startsWith("--")) {
                setError(stateField, "Traveled jurisdiction selection required.");
              } else {
                clearError(stateField);
              }
            }

            if (existsInActiveDom(milesField)) {
              const milesVal = parseFloat(milesField.value);
              if (isNaN(milesVal) || milesVal < 0) {
                setError(milesField, "Total jurisdiction miles must be 0 or higher.");
              } else {
                clearError(milesField);
              }
            }

            if (existsInActiveDom(fuelField)) {
              const fuelVal = parseFloat(fuelField.value);
              if (isNaN(fuelVal) || fuelVal < 0) {
                setError(fuelField, "Tax-paid fuel gallons must be 0 or higher.");
              } else {
                clearError(fuelField);
              }
            }
          }
        }
      }
      return { isValid, errors };
    }
  };

  // Legacy single function pointer mapping bypass trace
  window.validateIftaQuarterlyReturnsFormMaster = function() {
    return window.formRegistry['ifta-quarterly-returns-validation'].validate().isValid;
  };
}

window.initIftaQuarterlyReturnsService = initIftaQuarterlyReturnsService;




// ============================================================================ //
// ðŸ› ï¸ IFTA QUARTERLY RETURNS SERVICE: FORM LAYOUT TEMPLATE (PART 1 OF 2)         //
// ============================================================================ //
function buildIftaQuarterlyReturnsForm(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED MASTER CONTAINER WRAPPER PREVENTS ONE-SIDE COLLAPSE AND ENFORCES FULL WIDTH -->
    <div class="ifta-returns-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">

      <!-- MAIN UNDERSTANDING OVERLAY TOOLTIP -->
      <div style="background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px; width: 100%;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> International Fuel Tax Agreement (IFTA) Compliance</strong>
        Commercial motor vehicles operating in multiple IFTA jurisdictions must file consolidated quarterly fuel tax returns. This profile calculates net tax due or credit overpayments by balancing aggregate fleet distance traveled against localized tax-paid fuel gallons purchased across each independent regional jurisdiction footprint.
      </div>

      <!-- SECTION 1: CARRIER ACCOUNT PROFILE -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; width: 100%;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Carrier IFTA License Identity</h3>
      </div>

      <!-- FIELD 1: OFFICIAL CARRIER LEGAL NAME -->
      <div class="wizard-input-group" style="margin-top: 12px; width: 100%;">
        <label for="ifta_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Carrier Legal Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="ifta_legal_name" required placeholder="Enter exact commercial carrier or company name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
        <div class="wizard-error-message" id="err_ifta_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SIDE-BY-SIDE GRID ROW MATRIX CONTAINER -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
        <!-- FIELD 2: IFTA ACCOUNT NUMBER -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_account_num" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">IFTA Account / License Number <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ifta_account_num" required placeholder="Enter IFTA License ID" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-family: monospace; min-height: 44px;">
          <div class="wizard-error-message" id="err_ifta_account_num" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 3: BASE JURISDICTION STATE -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_base_jurisdiction" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Base Jurisdiction / Home State <span style="color: #ef4444;">*</span></label>
          <select id="ifta_base_jurisdiction" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
            <option value="" disabled selected>Select Base State...</option>
            ${stateDropdownOptionsHtml}
          </select>
          <div class="wizard-error-message" id="err_ifta_base_jurisdiction" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- FIELD 4: FILING QUARTER DROPDOWN FULL WIDTH -->
      <div class="wizard-input-group" style="margin-top: 16px; width: 100%;">
        <label for="ifta_filing_quarter" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Filing Tax Quarter Period <span style="color: #ef4444;">*</span></label>
        <select id="ifta_filing_quarter" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
          <option value="Q1" selected>1st Quarter (January - March Returns)</option>
          <option value="Q2">2nd Quarter (April - June Returns)</option>
          <option value="Q3">3rd Quarter (July - September Returns)</option>
          <option value="Q4">4th Quarter (October - December Returns)</option>
        </select>
        <div class="wizard-error-message" id="err_ifta_filing_quarter" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
  `;
}
window.buildIftaQuarterlyReturnsFormPart1 = buildIftaQuarterlyReturnsForm;

// ============================================================================ //
// ðŸ› ï¸ IFTA QUARTERLY RETURNS SERVICE: FORM LAYOUT TEMPLATE (PART 2 OF 2)         //
// ============================================================================ //
function buildIftaQuarterlyReturnsFormPart2(stateDropdownOptionsHtml = "") {
  return `
      <!-- SECTION 2: REGIONAL TRAVEL LEDGER MATRIX -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Jurisdiction Mileage &amp; Fuel Distribution Ledger</h3>
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Log parameters below for each state or province transitioned during this specific operating quarter timeline balance.</p>
      </div>

      <!-- IFTA REPEATING CONTAINER LAYOUT -->
      <div id="ifta_juris_container" style="display: flex; flex-direction: column; gap: 16px; width: 100%; margin-top: 12px;">
        <!-- Initial Jurisdiction Entry Card Structure #1 -->
        <div class="member-record-card" id="ifta_juris_card_1" data-row-index="1" style="background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; width: 100%;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary, #10b981); text-transform: uppercase; grid-column: span 2; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 4px;">Jurisdiction Log Entry #1</span>
          
          <!-- TRAVELED STATE DROPDOWN -->
          <div class="wizard-input-group" style="grid-column: span 2; margin: 0; display: flex; flex-direction: column; gap: 4px;">
            <label for="ifta_state_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Traveled State <span style="color: #ef4444;">*</span></label>
            <select id="ifta_state_1" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
              <option value="" disabled selected>Select State...</option>
              ${stateDropdownOptionsHtml}
            </select>
            <div class="wizard-error-message" id="err_ifta_state_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
          
          <!-- TOTAL JURISDICTION MILES -->
          <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
            <label for="ifta_miles_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Total Miles <span style="color: #ef4444;">*</span></label>
            <input type="number" id="ifta_miles_1" required min="0" placeholder="0" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
            <div class="wizard-error-message" id="err_ifta_miles_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
          
          <!-- TAX-PAID GALLONS PURCHASED -->
          <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
            <label for="ifta_fuel_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Paid Gallons <span style="color: #ef4444;">*</span></label>
            <input type="number" id="ifta_fuel_1" required min="0" placeholder="0" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
            <div class="wizard-error-message" id="err_ifta_fuel_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
        </div>
      </div>

      <!-- GLOBAL MATRIX REPEATER ERROR TEXT FIELD -->
      <div class="wizard-error-message" id="err_ifta_juris_matrix" style="color: #ef4444; font-size: 0.75rem; margin-top: 8px; display: none; width: 100%;"></div>

      <!-- APPEND ROW BUTTON CONTROL NODE -->
      <div style="margin-top: 12px; width: 100%;">
        <button type="button" onclick="window.appendNewIftaJurisdictionRow()" style="background: #ffffff; border: 1px dashed var(--primary, #10b981); color: var(--primary, #10b981); font-weight: 700; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; width: fit-content; outline: none; display: inline-flex; align-items: center; gap: 6px; min-height: 44px;">
          <i class="fa-solid fa-plus"></i> Add Additional Traveled Jurisdiction
        </button>
      </div>

      <!-- SECTION 3: EXTRA REMARKS TEXTAREA -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Operational Remarks</h3>
      </div>

      <div class="wizard-input-group" style="margin-top: 12px; width: 100%;">
        <label for="ifta_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Filing Clarifications or Non-Standard Fleet Remarks</label>
        <textarea id="ifta_provisions" placeholder="Detail any specialized alternative fuel setups, fuel credit carryovers, or custom route data comments..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
      </div>

    </div> <!-- END OF UNIFIED MASTER CONTAINER WRAPPER -->
  `;
}

// Secure master framework registry mappings configuration
window.formRegistry = window.formRegistry || {};
window.formRegistry['ifta-quarterly-returns-form-master'] = function(stateDropdownOptionsHtml = "") {
  // ðŸŸ¢ FIXED: Points to buildIftaQuarterlyReturnsFormPart1 to match your code splitting definitions
  const p1 = typeof window.buildIftaQuarterlyReturnsFormPart1 === "function" ? window.buildIftaQuarterlyReturnsFormPart1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildIftaQuarterlyReturnsFormPart2 === "function" ? window.buildIftaQuarterlyReturnsFormPart2(stateDropdownOptionsHtml) : "";
  return p1 + p2;
};
window.buildIftaQuarterlyReturnsFormPart2 = buildIftaQuarterlyReturnsFormPart2;



// ============================================================================ //
// ðŸ› ï¸ IFTA QUARTERLY RETURNS SERVICE: INTERACTIVE RUNTIME CONTROLLERS (PART 3) //
// ============================================================================ //

/**
 * Global execution index state tracking for IFTA jurisdiction dynamic row cards
 */
window.iftaJurisdictionCounter = 1;

/**
 * Dynamically appends a new full-width responsive traveled jurisdiction card.
 * Fully activates the "Add Additional Traveled Jurisdiction" button click behavior.
 */
window.appendNewIftaJurisdictionRow = function() {
  const container = document.getElementById('ifta_juris_container');
  if (!container) return console.error("[IFTA Engine] Target container '#ifta_juris_container' missing from active DOM.");

  // Cache state dropdown options safely from the first existing dropdown to duplicate
  const baseSelect = document.getElementById('ifta_state_1');
  const stateOptionsHtml = baseSelect ? baseSelect.innerHTML : '<option value="">Select State...</option>';

  // Increments tracking index variables contextually
  window.iftaJurisdictionCounter++;
  const nextIndex = window.iftaJurisdictionCounter;

  // Create structural base element card matching your layout properties
  const rowCardNode = document.createElement('div');
  rowCardNode.className = 'member-record-card';
  rowCardNode.id = `ifta_juris_card_${nextIndex}`;
  rowCardNode.setAttribute('data-row-index', nextIndex);
  rowCardNode.setAttribute('data-officer-index', nextIndex);

  // Normalizes layout fields side-by-side on desktop, while breaking columns cleanly on screen bottlenecks
  rowCardNode.style.cssText = "background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; position: relative; margin-top: 12px; width: 100% !important; clear: both !important;";
  
  rowCardNode.innerHTML = `
    <div style="grid-column: span 2; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 4px;">
      <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary, #10b981); text-transform: uppercase;">Jurisdiction Log Entry #${nextIndex}</span>
      <button type="button" onclick="window.removeIftaJurisdictionRow(${nextIndex})" style="background: transparent; border: none; color: #ef4444; font-weight: 700; cursor: pointer; font-size: 0.75rem; text-transform: uppercase; padding: 0; outline: none; transition: color 0.2s; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fa-solid fa-trash-can"></i> Remove Entry
      </button>
    </div>

    <!-- TRAVELED STATE DROPDOWN -->
    <div class="wizard-input-group" style="grid-column: span 2; margin: 0; display: flex; flex-direction: column; gap: 4px;">
      <label for="ifta_state_${nextIndex}" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Traveled State <span style="color: #ef4444;">*</span></label>
      <select id="ifta_state_${nextIndex}" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;">
        ${stateOptionsHtml}
      </select>
      <div class="wizard-error-message" id="err_ifta_state_${nextIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <!-- TOTAL JURISDICTION MILES -->
    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
      <label for="ifta_miles_${nextIndex}" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Total Miles <span style="color: #ef4444;">*</span></label>
      <input type="number" id="ifta_miles_${nextIndex}" required min="0" placeholder="0" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
      <div class="wizard-error-message" id="err_ifta_miles_${nextIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <!-- TAX-PAID GALLONS PURCHASED -->
    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 4px;">
      <label for="ifta_fuel_${nextIndex}" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase; display: block;">Paid Gallons <span style="color: #ef4444;">*</span></label>
      <input type="number" id="ifta_fuel_${nextIndex}" required min="0" placeholder="0" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
      <div class="wizard-error-message" id="err_ifta_fuel_${nextIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
  `;
  container.appendChild(rowCardNode);
};

/**
 * Removes a specific jurisdiction row configuration card from the log.
 * Automatically Normalizes structural layout array index tracks safely.
 */
window.removeIftaJurisdictionRow = function(indexValue) {
  const parentContainer = document.getElementById("ifta_juris_container");
  if (!parentContainer) return;

  const targetCard = document.getElementById(`ifta_juris_card_${indexValue}`);
  if (targetCard) {
    targetCard.remove();
  }

  // Re-index remaining records smoothly to preserve validation arrays
  const remainingCards = parentContainer.querySelectorAll(".member-record-card");
  remainingCards.forEach((card, loopIndex) => {
    const operationalNewIndex = loopIndex + 1;
    card.setAttribute('data-row-index', operationalNewIndex);
    card.setAttribute('data-officer-index', operationalNewIndex);
    card.id = `ifta_juris_card_${operationalNewIndex}`;

    const subtitleHeader = card.querySelector("span");
    if (subtitleHeader) {
      subtitleHeader.textContent = `Jurisdiction Log Entry #${operationalNewIndex}`;
    }

    const trashButton = card.querySelector("button[onclick]");
    if (trashButton) {
      trashButton.setAttribute("onclick", `window.removeIftaJurisdictionRow(${operationalNewIndex})`);
    }

    const trackingFields = ['state', 'miles', 'fuel'];
    trackingFields.forEach(field => {
      const inputEl = card.querySelector(`input[id*="_ifta_${field}_"], select[id*="_ifta_${field}_"]`);
      const labelEl = card.querySelector(`label[for*="_ifta_${field}_"]`);
      const errorEl = card.querySelector(`.wizard-error-message[id*="_ifta_${field}_"]`);

      if (inputEl) inputEl.id = `ifta_${field}_${operationalNewIndex}`;
      if (labelEl) labelEl.setAttribute("for", `ifta_${field}_${operationalNewIndex}`);
      if (errorEl) errorEl.id = `err_ifta_${field}_${operationalNewIndex}`;
    });
  });

  // Re-sync counting indices securely
  window.iftaJurisdictionCounter = remainingCards.length;
};


// ============================================================================ // 
// ðŸ“¦ MASTER IFTA APPLICATION ASSEMBLY HOOK (REPAIRED NAMING MATRIX)           // 
// ============================================================================ // 

/**
 * FIXED: Renamed to match the exact pointer your wizard engine invokes
 * ðŸŸ¢ FIXED: Compiles the individual split-part methods and wraps the layout strings 
 * into clear full-screen card panel modules matching your previous setups perfectly.
 */
window.buildIftaQuarterlyReturnsFormMaster = function(stateDropdownOptionsHtml = "") { 
  const p1 = typeof window.buildIftaQuarterlyReturnsFormPart1 === "function" ? window.buildIftaQuarterlyReturnsFormPart1(stateDropdownOptionsHtml) : ""; 
  const p2 = typeof window.buildIftaQuarterlyReturnsFormPart2 === "function" ? window.buildIftaQuarterlyReturnsFormPart2(stateDropdownOptionsHtml) : ""; 

  return `
    <div class="ifta-quarterly-wizard-grid" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;"> 
      <div id="ifta_panel_part1" class="ifta-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="ifta_panel_part2" class="ifta-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
    </div> 
  `; 
}; 

/**
 * Master multi-step verification sequencing scanner loop for global checkouts.
 * ðŸŸ¢ FIXED: Remapped registration string lookups to match 'ifta-quarterly-returns-validation' exactly as initialized.
 */
window.validateEntireIftaWizard = function() { 
  if (typeof window.formRegistry?.['ifta-quarterly-returns-validation']?.validate === 'function') { 
    const outcome = window.formRegistry['ifta-quarterly-returns-validation'].validate(); 
    return outcome.isValid; 
  } 
  return true; 
}; 

// Secure master framework registry mappings configuration tracking 
window.formRegistry = window.formRegistry || {}; 

// FIXED: Aligned registry key and internal callback function pointers exactly 
window.formRegistry['ifta-quarterly-returns-form-master'] = function(stateDropdownOptionsHtml = "") { 
  return window.buildIftaQuarterlyReturnsFormMaster(stateDropdownOptionsHtml); 
};

