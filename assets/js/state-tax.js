// ============================================================================ //
// ðŸ› ï¸ STATE INCOME TAX FILING VALIDATION MATRIX ENGINE (PART 1 OF 3)
// ============================================================================ //
const stateTaxPart1Validation = {
  requiredFields: [
    { id: 'state_tax_target_state', msg: 'Filing Jurisdiction State selection is required.' },
    { id: 'state_tax_id_number', msg: 'State Tax ID / Employer ID Number is required.' },
    { id: 'state_tax_classification', msg: 'Tax Classification selection is required.' }
  ],

  validateStep: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
    const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

    // 1. Process standard mandatory fields presence checks
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        if (!el.value.trim()) setError(el, field.msg); else clearError(el);
      }
    });

    return { isValid, errors };
  }
};

// FAMILY 16A: STATE INCOME TAX FILING LAYOUT MATRIX (PART 1 OF 3)
function buildStateTaxFormPart1(stateDropdownOptionsHtml = "") {
  return `
    <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: STATE INCOME TAX FILING -->
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
      <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> State Corporate Tax Filing Compliance</strong> State income tax obligations vary drastically based on your primary jurisdiction and physical footprint nexus. This layout automatically syncs with your federal data inputs to reduce manual entry errors, while offering targeted parameters for decoupled state deductions, municipal state apportionments, and local adjustments.
    </div>

    <!-- SECTION 1: JURISDICTION PROFILE -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. State Tax Jurisdiction Profile</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="state_tax_target_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Filing Jurisdiction State <span style="color: #ef4444;">*</span></label>
      <select id="state_tax_target_state" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleStateTaxPtetWorkflow(this.value)">
        <option value="" disabled selected>Select Taxing State...</option>
        ${stateDropdownOptionsHtml}
      </select>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="state_tax_id_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State Tax ID / Employer ID Number <span style="color: #ef4444;">*</span></label>
      <input type="text" id="state_tax_id_number" required placeholder="Enter State Revenue ID" class="wizard-input-field">
    </div>
    
    <!-- REPAIRED SYSTEM STRUCTURE: Injected missing select dropdown tag wrapper below -->
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="state_tax_classification" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Tax Classification Wrapper <span style="color: #ef4444;">*</span></label>
      <select id="state_tax_classification" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select Structure Style...</option>
        <option value="pass-through">Pass-Through Entity (LLC / Partnership / S-Corp)</option>
        <option value="c-corp">C-Corporation (Form 1120 / State Corporate Return)</option>
        <option value="sole-prop">Sole Proprietorship / Single-Member LLC</option>
      </select>
    </div>
  `;
}

// Global registry window configuration mapping
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['state-tax-part1-layout'] = buildStateTaxFormPart1;
window.formRegistry['state-tax-part1-validation'] = stateTaxPart1Validation;

// ============================================================================ //
// ðŸ› ï¸ STATE INCOME TAX FILING REMAINING SECTIONS VALIDATION ENGINE (PARTS 2-5)
// ============================================================================ //
const stateTaxRemainingValidation = {
  requiredFields: [
    { id: 'state_tax_gross_receipts', msg: 'Extracted Gross Receipts is required.' },
    { id: 'state_tax_gross_expenses', msg: 'Extracted Gross Expenses is required.' },
    { id: 'state_tax_is_multistate', msg: 'Multi-state operational status choice selection is required.' }
  ],

  validateStep: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
    const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

    // 1. Process standard mandatory fields presence checks
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        if (!el.value.trim()) setError(el, field.msg); else clearError(el);
      }
    });

    // 2. Validate Financial Extraction Range Logic boundaries
    const grossEl = document.getElementById("state_tax_gross_receipts");
    if (grossEl && grossEl.value.trim() && parseFloat(grossEl.value) < 0) {
      setError(grossEl, "Extracted Gross Receipts cannot be a negative value.");
    }
    const expEl = document.getElementById("state_tax_gross_expenses");
    if (expEl && expEl.value.trim() && parseFloat(expEl.value) < 0) {
      setError(expEl, "Extracted Gross Expenses cannot be a negative value.");
    }

    // 3. Conditional Check: Validate Pass-Through Entity Tax choice selection if the wrapper is currently visible
    const ptetWrapper = document.getElementById("state_tax_ptet_wrapper");
    if (ptetWrapper && ptetWrapper.style.display !== "none") {
      const ptetChoice = document.getElementById("state_tax_ptet_choice");
      if (ptetChoice && !ptetChoice.value.trim()) {
        setError(ptetChoice, "Pass-Through Entity Tax (PTET) election choice selection is required.");
      } else if (ptetChoice) {
        clearError(ptetChoice);
      }
    }

    // 4. Conditional Check: Validate Apportionment Factor Percentage ranges if choices equal YES
    const multiStateChoice = document.getElementById("state_tax_is_multistate");
    if (multiStateChoice && multiStateChoice.value === "yes") {
      const apportionPercentageEl = document.getElementById("state_tax_apportionment_percentage");
      if (apportionPercentageEl) {
        const pVal = parseFloat(apportionPercentageEl.value);
        if (!apportionPercentageEl.value.trim()) {
          setError(apportionPercentageEl, "Target State Apportionment Percentage is required under multi-state operations.");
        } else if (isNaN(pVal) || pVal < 0 || pVal > 100) {
          setError(apportionPercentageEl, "Target State Apportionment Percentage must be a valid percentage between 0 and 100.");
        } else {
          clearError(apportionPercentageEl);
        }
      }
    }

    return { isValid, errors };
  }
};

// FAMILY 16A: STATE INCOME TAX FILING LAYOUT MATRIX (PART 2 OF 5)
function buildStateTaxFormPart2(stateDropdownOptionsHtml = "") {
  return `
    <!-- SECTION 2: AUTOMATED LEDGER SYNC ARCHITECTURE -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Gross Financial Ledger Extraction</h3>
      <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The system automatically pulls your values from local storage cache memory. Use the secondary inputs to state decoupled modifications.</p>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="state_tax_gross_receipts" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Extracted Gross Receipts ($) <span style="color: #ef4444;">*</span></label>
      <input type="number" id="state_tax_gross_receipts" required placeholder="0.00" min="0" class="wizard-input-field" onfocus="executeStateTaxAutomatedCacheSync('fed_tax_gross_receipts', this)">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="state_tax_gross_expenses" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Extracted Gross Expenses ($) <span style="color: #ef4444;">*</span></label>
      <input type="number" id="state_tax_gross_expenses" required placeholder="0.00" min="0" class="wizard-input-field" onfocus="executeStateTaxAutomatedCacheSync('fed_tax_gross_expenses', this)">
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="state_tax_decoupled_modifications" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State-Specific Decoupled Adjustments / Add-Backs ($)</label>
      <input type="number" id="state_tax_decoupled_modifications" value="0" placeholder="e.g., State tax depreciation differences, municipal bond additions" class="wizard-input-field">
    </div>

    <!-- SECTION 3: PASS-THROUGH ENTITY TAX (PTET) SELECTION -->
    <div id="state_tax_ptet_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px; margin-top: 16px;">
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Pass-Through Entity Tax (PTET) Matrix</h3>
      </div>
      <div class="wizard-input-group" style="margin: 0; width: 100%;">
        <label for="state_tax_ptet_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Would you like to elect into the state-specific Pass-Through Entity Tax (PTET)? <span style="color: #ef4444;">*</span></label>
        <select id="state_tax_ptet_choice" class="wizard-input-field" style="font-weight: 600;">
          <option value="no" selected>No, do not execute PTET election (Income flows directly to partner personal filings)</option>
          <option value="yes">Yes, execute state PTET election (Entity pays state tax directly to yield a federal deduction hedge)</option>
        </select>
      </div>
    </div>
  `;
}
window.buildStateTaxFormPart2 = buildStateTaxFormPart2;

// FAMILY 16A: STATE INCOME TAX FILING LAYOUT MATRIX (PART 3 OF 5)
function buildStateTaxFormPart3(stateDropdownOptionsHtml = "") {
  return `
    <!-- SECTION 4: APPORTIONMENT FACTORS & NEXUS ALLOCATIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Apportionment Factors &amp; Nexus Footprint</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="state_tax_is_multistate" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Does the business operate in multiple states? <span style="color: #ef4444;">*</span></label>
      <select id="state_tax_is_multistate" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleStateTaxApportionmentVisibility(this.value)">
        <option value="no" selected>No, 100% of revenue and operations are single-state localized</option>
        <option value="yes">Yes, multi-state presence exists (Requires revenue apportionment splitting)</option>
      </select>
    </div>
    <!-- Hidden Conditional Container: Multi-State Apportionment Allocation Percentage -->
    <div id="state_tax_apportionment_wrapper" class="wizard-input-group" style="grid-column: span 1; display: none;">
      <label for="state_tax_apportionment_percentage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Target State Apportionment Percentage (%) <span style="color: #ef4444;">*</span></label>
      <input type="number" id="state_tax_apportionment_percentage" placeholder="e.g., 45.50" min="0" max="100" step="0.01" class="wizard-input-field">
    </div>
  `;
}
window.buildStateTaxFormPart3 = buildStateTaxFormPart3;

// FAMILY 16A: STATE INCOME TAX FILING LAYOUT MATRIX (PART 4 OF 5)
function buildStateTaxFormPart4(stateDropdownOptionsHtml = "") {
  return `
    <!-- SECTION 5: REQUIRED STATE-LEVEL DOCUMENTATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. State Tax Verification Documentation</h3>
      <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Please attach your matching state ledger reports or processed federal summaries to synchronize local tax packets:</p>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="state_tax_file_nexus" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">State Revenue Allocation Report / Apportionment Ledger</label>
      <input type="file" id="state_tax_file_nexus" class="wizard-input-field" accept=".pdf,.xls,.xlsx,.csv,image/*" style="padding: 8px; background: #ffffff;">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="state_tax_file_franchise_summary" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Prior State Tax Return copy (If Applicable)</label>
      <input type="file" id="state_tax_file_franchise_summary" class="wizard-input-field" accept=".pdf,image/*" style="padding: 8px; background: #ffffff;">
    </div>
  `;
}
window.buildStateTaxFormPart4 = buildStateTaxFormPart4;

// FAMILY 16A: STATE INCOME TAX FILING LAYOUT MATRIX (PART 5 OF 5)
function buildStateTaxFormPart5(stateDropdownOptionsHtml = "") {
  return `
    <!-- SECTION 6: ADDITIONAL PROVISIONS & DISCLOSURES -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. State Special Directives &amp; Disclosures</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="state_tax_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special State Instructions or Local Nexus Disclosures</label>
      <textarea id="state_tax_provisions" placeholder="Detail any city/county tax allocations, active local job credits, state-level R&amp;D exemptions, or custom filing notes..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
    </div>
  `;
}
window.buildStateTaxFormPart5 = buildStateTaxFormPart5;

// ðŸ“¦ MASTER STATE INCOME TAX APPLICATION ASSEMBLY HOOK
function buildStateTaxForm(stateDropdownOptionsHtml = "") {
  return buildStateTaxFormPart1(stateDropdownOptionsHtml) + 
         buildStateTaxFormPart2(stateDropdownOptionsHtml) + 
         buildStateTaxFormPart3(stateDropdownOptionsHtml) + 
         buildStateTaxFormPart4(stateDropdownOptionsHtml) + 
         buildStateTaxFormPart5(stateDropdownOptionsHtml);
}

// Global registry setup matrix tracking allocation routes
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['state-tax-part2-layout'] = buildStateTaxFormPart2;
window.formRegistry['state-tax-part3-layout'] = buildStateTaxFormPart3;
window.formRegistry['state-tax-part4-layout'] = buildStateTaxFormPart4;
window.formRegistry['state-tax-part5-layout'] = buildStateTaxFormPart5;
window.formRegistry['state-tax-remaining-validation'] = stateTaxRemainingValidation;
window.formRegistry['state-tax-form-master'] = buildStateTaxForm;

// ============================================================================ //
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (STATE INCOME TAX FILINGS)
// ============================================================================ //

window.toggleStateTaxPtetWorkflow = function(stateValue) {
  const ptetWrapper = document.getElementById("state_tax_ptet_wrapper");
  const ptetSelect = document.getElementById("state_tax_ptet_choice");
  const classification = document.getElementById("state_tax_classification");
  if (!ptetWrapper) return;

  // PTET selection protocols are programmatically restricted to pass-through entities
  const isPassThrough = classification && classification.value === "pass-through";

  // States without an active income tax matrix are excluded from local PTET processing options
  const nonPtetStates = ["AK", "FL", "NV", "NH", "SD", "TN", "TX", "WA", "WY"];
  const isEligibleState = stateValue && !nonPtetStates.includes(stateValue.toUpperCase());

  if (isPassThrough && isEligibleState) {
    ptetWrapper.style.setProperty("display", "flex", "important");
    if (ptetSelect) ptetSelect.setAttribute("required", "required");
  } else {
    ptetWrapper.style.setProperty("display", "none", "important");
    if (ptetSelect) { ptetSelect.removeAttribute("required"); ptetSelect.value = "no"; }
  }
};

window.toggleStateTaxApportionmentVisibility = function(value) {
  const apportionmentWrapper = document.getElementById("state_tax_apportionment_wrapper");
  const apportionmentInput = document.getElementById("state_tax_apportionment_percentage");
  if (!apportionmentWrapper) return;

  if (value === "yes") {
    apportionmentWrapper.style.setProperty("display", "block", "important");
    if (apportionmentInput) apportionmentInput.setAttribute("required", "required");
  } else {
    apportionmentWrapper.style.setProperty("display", "none", "important");
    if (apportionmentInput) { apportionmentInput.removeAttribute("required"); apportionmentInput.value = ""; }
  }
};

window.executeStateTaxAutomatedCacheSync = function(sourceId, targetNode) {
  if (!targetNode || targetNode.value.trim() !== "" && targetNode.value.trim() !== "0") return;
  const sourceNode = document.getElementById(sourceId);
  if (sourceNode && sourceNode.value.trim()) {
    targetNode.value = sourceNode.value.trim();
    console.log(`[Cache Sync] Successfully synchronized element value from target element index string: ${sourceId}`);
  }
};

