// ============================================================================ //
// ðŸ› ï¸ OPERATING AGREEMENT VALIDATION MATRIX ENGINE (PART 1 OF 3)
// ============================================================================ //
const operatingAgreementPart1Validation = {
  requiredFields: [
    { id: 'oa_company_name', msg: 'Official Company Name is required.' },
    { id: 'oa_state_of_formation', msg: 'State of Formation selection is required.' },
    { id: 'oa_formation_date', msg: 'Effective Formation Date is required.' },
    { id: 'oa_principal_street', msg: 'Principal Place of Business Street Address is required.' },
    { id: 'oa_principal_city', msg: 'Principal Place of Business City is required.' },
    { id: 'oa_principal_state', msg: 'Principal Place of Business State selection is required.' },
    { id: 'oa_principal_zip', msg: 'Principal Place of Business Zip Code is required.' },
    { id: 'oa_membership_structure', msg: 'Membership Structure Type selection is required.' }
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

    // 2. Validate Principal ZIP String Pattern Formats
    const zipEl = document.getElementById("oa_principal_zip");
    if (zipEl && zipEl.value.trim() && !/^\d{5}$/.test(zipEl.value.trim())) {
      setError(zipEl, 'Principal Office Zip Code must consist of exactly 5 numbers.');
    }

    return { isValid, errors };
  }
};


// FAMILY 7A: OPERATING AGREEMENT CONFIGURATOR LAYOUT MATRIX (PART 1 OF 3)
function buildOperatingAgreementPart1(stateDropdownOptionsHtml = "") {
  return `
    <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS AN OPERATING AGREEMENT? -->
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
      <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Automated Document Assembly Architecture</strong> An Operating Agreement outlines your entity's internal governance rules, financial allocations, and liability constraints. After checkout completion, your information will be compiled into an official corporate PDF and immediately pushed to your account on our secure portal. You will then be able to download it.
    </div>

    <!-- SECTION 1: ENTITY FOUNDATION PROFILE -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Company Baseline Profile</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="oa_company_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Company Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="oa_company_name" required placeholder="Enter LLC name exactly as registered with the state registry" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="oa_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State of Formation <span style="color: #ef4444;">*</span></label>
      <select id="oa_state_of_formation" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select State...</option>
        ${stateDropdownOptionsHtml}
      </select>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="oa_formation_date" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Effective Formation Date <span style="color: #ef4444;">*</span></label>
      <input type="date" id="oa_formation_date" required class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="oa_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Place of Business Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="oa_principal_street" required placeholder="Street address, suite, unit (No P.O. Boxes)" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,\\\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'oa_principal')">
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
        <div>
          <label for="oa_principal_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
          <input type="text" id="oa_principal_city" required placeholder="City" class="wizard-input-field">
        </div>
        <div>
          <label for="oa_principal_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
          <select id="oa_principal_state" required class="wizard-input-field" style="font-weight: 600;">
            ${stateDropdownOptionsHtml}
          </select>
        </div>
        <div>
          <label for="oa_principal_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
          <input type="text" id="oa_principal_zip" required placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field">
        </div>
      </div>
    </div>

    <!-- SECTION 2: OWNERSHIP ARCHITECTURE SELECTION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Ownership Architecture</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="oa_membership_structure" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Select Membership Structure Type <span style="color: #ef4444;">*</span></label>
      <select id="oa_membership_structure" required class="wizard-input-field" style="font-weight: 700; border: 2px solid var(--navy);" onchange="toggleOperatingAgreementOwnershipSubForm(this.value)">
        <option value="" disabled selected>Choose Structure Type...</option>
        <option value="single-member">Single-Member Framework (100% Solitary Equity Ownership Holding)</option>
        <option value="multi-member">Multi-Member Framework (Distributed Multi-Partner Equity Structures)</option>
      </select>
    </div>
  `;
}

// Global scope initialization window object registration
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['operating-agreement-part1-layout'] = buildOperatingAgreementPart1;
window.formRegistry['operating-agreement-part1-validation'] = operatingAgreementPart1Validation;


// ============================================================================ //
// ðŸ› ï¸ OPERATING AGREEMENT VALIDATION MATRIX ENGINE (PART 2 OF 3)
// ============================================================================ //
const operatingAgreementPart2Validation = {
  validateStep: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
    const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

    const structureChoice = document.getElementById("oa_membership_structure");
    if (!structureChoice) return { isValid: true, errors: [] };

    // 1. Conditional Logic: Validate Single-Member Structural Tracks
    if (structureChoice.value === "single-member") {
      const soleName = document.getElementById("oa_sole_member_name");
      const soleContrib = document.getElementById("oa_sole_member_contribution");

      if (soleName && !soleName.value.trim()) setError(soleName, "Full Legal Name of Sole Member is required."); else clearError(soleName);
      
      if (soleContrib) {
        if (!soleContrib.value.trim() || parseFloat(soleContrib.value) < 0) {
          setError(soleContrib, "Initial Capital Contribution must be a positive number.");
        } else {
          clearError(soleContrib);
        }
      }
    }

    // 2. Conditional Logic: Validate Multi-Member Dynamic Records Grid
    if (structureChoice.value === "multi-member") {
      const container = document.getElementById("oa_members_container") || document.body;
      const memberCards = container.querySelectorAll(".member-record-card");
      let totalPercentageWeight = 0;

      memberCards.forEach(card => {
        const idx = card.id.replace("oa_member_card_", "");
        const nameEl = document.getElementById(`oa_member_name_${idx}`);
        const contribEl = document.getElementById(`oa_member_contribution_${idx}`);
        const percentEl = document.getElementById(`oa_member_percentage_${idx}`);

        if (nameEl && !nameEl.value.trim()) setError(nameEl, `Member #${idx}: Full Legal Name is required.`); else clearError(nameEl);
        
        if (contribEl) {
          if (!contribEl.value.trim() || parseFloat(contribEl.value) < 0) {
            setError(contribEl, `Member #${idx}: Capital Contribution must be a positive number.`);
          } else {
            clearError(contribEl);
          }
        }

        if (percentEl) {
          const pVal = parseFloat(percentEl.value) || 0;
          totalPercentageWeight += pVal;
          if (!percentEl.value.trim() || pVal <= 0 || pVal > 100) {
            setError(percentEl, `Member #${idx}: Ownership % must be a number greater than 0 and less than or equal to 100.`);
          } else {
            clearError(percentEl);
          }
        }
      });

      // Enforce total ownership structural baseline matching rulesets
      if (totalPercentageWeight !== 100) {
        isValid = false;
        errors.push(`The cumulative total ownership percentage must equal exactly 100%. Current ledger status: ${totalPercentageWeight}%.`);
        const alertBanner = document.getElementById("oa_percentage_balance_alert");
        if (alertBanner) alertBanner.style.background = "#fef2f2"; // Visual hint change
      }
    }

    return { isValid, errors };
  }
};

// FAMILY 7A: OPERATING AGREEMENT CONFIGURATOR LAYOUT MATRIX (PART 2 OF 3)
function buildOperatingAgreementPart2(stateDropdownOptionsHtml = "") {
  return `
    <!-- SINGLE-MEMBER FRAMEWORK WRAPPER -->
    <div id="oa_single_member_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 8px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Sole Member & Capital Contribution Profile</h3>
      </div>
      <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="wizard-input-group" style="grid-column: span 2; margin: 0;">
          <label for="oa_sole_member_name" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Full Legal Name of Sole Member <span style="color: #ef4444;">*</span></label>
          <input type="text" id="oa_sole_member_name" placeholder="Full Legal Name" class="wizard-input-field">
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0;">
          <label for="oa_sole_member_contribution" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Initial Capital Contribution ($) <span style="color: #ef4444;">*</span></label>
          <input type="number" id="oa_sole_member_contribution" placeholder="e.g. 100" min="0" class="wizard-input-field">
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0;">
          <label for="oa_sole_member_percentage" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Membership Percentage (%)</label>
          <input type="text" id="oa_sole_member_percentage" readonly value="100%" class="wizard-input-field" style="background: #f1f5f9; font-weight: 700; color: var(--navy); cursor: not-allowed;">
        </div>
      </div>
    </div>

    <!-- MULTI-MEMBER FRAMEWORK WRAPPER -->
    <div id="oa_multi_member_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 8px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Multi-Member & Equity Distribution Ledger</h3>
      </div>
      <p style="color: var(--slate); font-size: 0.825rem; margin: 0; line-height: 1.4;">
        Add all equity owners. The cumulative total percentage metrics of all members listed below must equal exactly **100%** to generate a compliant legal profile inside your dashboard.
      </p>
      <div id="oa_members_container" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        <!-- Initial Member #1 Entry Row Layout -->
        <div class="member-record-card" id="oa_member_card_1" style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 3;">Member #1 Equity Node</span>
          <div class="wizard-input-group" style="margin: 0;">
            <label for="oa_member_name_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Full Legal Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="oa_member_name_1" placeholder="Full Legal Name" class="wizard-input-field">
          </div>
          <div class="wizard-input-group" style="margin: 0;">
            <label for="oa_member_contribution_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Capital Contribution ($) <span style="color: #ef4444;">*</span></label>
            <input type="number" id="oa_member_contribution_1" placeholder="e.g. 500" min="0" class="wizard-input-field">
          </div>
          <div class="wizard-input-group" style="margin: 0;">
            <label for="oa_member_percentage_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Ownership % <span style="color: #ef4444;">*</span></label>
            <input type="number" id="oa_member_percentage_1" placeholder="e.g. 50" min="0" max="100" class="wizard-input-field oa-percentage-field" oninput="calculateCumulativeOperatingAgreementEquityTotal()">
          </div>
        </div>
      </div>
      <button type="button" onclick="appendNewOperatingAgreementMemberRow()" style="background: transparent; border: 1px dashed var(--primary); color: var(--primary); font-weight: 700; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; width: fit-content;">
        <i class="fa-solid fa-plus"></i> Add Additional Member
      </button>
      
      <!-- Dynamic Live Percentage Balance Banner -->
      <div id="oa_percentage_balance_alert" style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 0.85rem; color: var(--navy); font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-chart-pie" style="color: var(--primary);"></i> Current Ledger Weight Status: <span id="oa_live_percentage_total_span">0</span>% / 100%
      </div>
    </div>
  `;
}

// Global registry setup matrix tracking allocation routes
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['operating-agreement-part2-layout'] = buildOperatingAgreementPart2;
window.formRegistry['operating-agreement-part2-validation'] = operatingAgreementPart2Validation;

// ============================================================================ //
// ðŸ› ï¸ OPERATING AGREEMENT VALIDATION MATRIX ENGINE (PART 3 OF 3)
// ============================================================================ //
const operatingAgreementPart3Validation = {
  requiredFields: [
    { id: 'oa_management_type', msg: 'Management Designation selection is required.' }
  ],

  validate: function() {
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

// FAMILY 7A: OPERATING AGREEMENT CONFIGURATOR LAYOUT MATRIX (PART 3 OF 3)
function buildOperatingAgreementPart3(stateDropdownOptionsHtml = "") {
  return `
    <!-- SECTION 5: MANAGEMENT STRUCTURE -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Management &amp; Governance Structure</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="oa_management_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Management Designation <span style="color: #ef4444;">*</span></label>
      <select id="oa_management_type" required class="wizard-input-field" style="font-weight: 600;">
        <option value="member-managed" selected>Member-Managed (Managed directly by internal equity owners)</option>
        <option value="manager-managed">Manager-Managed (Managed via appointed corporate executives/managers)</option>
      </select>
    </div>

    <!-- SECTION 6: ADDITIONAL PROVISIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Additional Provisions &amp; Special Clauses</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="oa_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Custom Clauses or Agreements</label>
      <textarea id="oa_provisions" placeholder="Detail any specific voting thresholds, asset distribution rules, buy-out parameters, or specific legal clauses to inject into your generated PDF document..." class="wizard-input-field" style="width: 100%; min-height: 90px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
    </div>
  `;
}
window.buildOperatingAgreementPart3 = buildOperatingAgreementPart3;

// ðŸ“¦ MASTER OPERATING AGREEMENT ASSEMBLY HOOK
function buildOperatingAgreementForm(stateDropdownOptionsHtml = "") {
  return buildOperatingAgreementPart1(stateDropdownOptionsHtml) + buildOperatingAgreementPart2(stateDropdownOptionsHtml) + buildOperatingAgreementPart3(stateDropdownOptionsHtml);
}

// Global registry setup matrix tracking allocation routes
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['operating-agreement-part3-layout'] = buildOperatingAgreementPart3;
window.formRegistry['operating-agreement-part3-validation'] = operatingAgreementPart3Validation;
window.formRegistry['operating-agreement-form-master'] = buildOperatingAgreementForm;


// ============================================================================ //
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (OPERATING AGREEMENT LEDGERS)
// ============================================================================ //

window.toggleOperatingAgreementOwnershipSubForm = function(value) {
  const singleWrapper = document.getElementById("oa_single_member_wrapper");
  const multiWrapper = document.getElementById("oa_multi_member_wrapper");

  if (!singleWrapper || !multiWrapper) return;

  if (value === "single-member") {
    singleWrapper.style.setProperty("display", "flex", "important");
    multiWrapper.style.setProperty("display", "none", "important");
    
    singleWrapper.querySelectorAll("input").forEach(el => {
      if(el.id !== "oa_sole_member_percentage") el.setAttribute("required", "required");
    });
    multiWrapper.querySelectorAll("input").forEach(el => {
      el.removeAttribute("required");
      el.value = "";
    });
  } else if (value === "multi-member") {
    singleWrapper.style.setProperty("display", "none", "important");
    multiWrapper.style.setProperty("display", "flex", "important");
    
    singleWrapper.querySelectorAll("input").forEach(el => {
      el.removeAttribute("required");
      el.value = "";
    });
    multiWrapper.querySelectorAll(".member-record-card input").forEach(el => el.setAttribute("required", "required"));
    calculateCumulativeOperatingAgreementEquityTotal();
  }
};

window.calculateCumulativeOperatingAgreementEquityTotal = function() {
  const fields = document.querySelectorAll("#oa_members_container .oa-percentage-field");
  let combinedTotal = 0;

  fields.forEach(el => {
    combinedTotal += parseFloat(el.value) || 0;
  });

  const liveSpan = document.getElementById("oa_live_percentage_total_span");
  const alertBanner = document.getElementById("oa_percentage_balance_alert");

  if (liveSpan) liveSpan.innerText = combinedTotal;

  if (alertBanner) {
    if (combinedTotal === 100) {
      alertBanner.style.background = "#e2e8f0";
      alertBanner.style.color = "var(--navy)";
    } else {
      alertBanner.style.background = "#fff7ed";
      alertBanner.style.color = "#c2410c";
    }
  }
};

window.appendNewOperatingAgreementMemberRow = function() {
  const container = document.getElementById("oa_members_container");
  if (!container) return;

  const currentCount = container.querySelectorAll(".member-record-card").length + 1;

  const newCard = document.createElement("div");
  newCard.className = "member-record-card";
  newCard.id = `oa_member_card_${currentCount}`;
  newCard.style.cssText = "background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-top: 12px;";

  // Programmatic state selection array options injection
  const targetStateOptions = typeof window.getUsaStatesHtml === "function" ? window.getUsaStatesHtml("") : "";

  newCard.innerHTML = `
    <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Member #${currentCount} Equity Node</span>
    <button type="button" onclick="this.parentElement.remove(); calculateCumulativeOperatingAgreementEquityTotal();" style="grid-column: span 1; justify-self: end; background: transparent; border: none; color: #ef4444; font-weight:700; cursor:pointer;"><i class="fa-solid fa-trash-can"></i> Remove</button>
    <div class="wizard-input-group" style="margin: 0;">
      <label style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Full Legal Name *</label>
      <input type="text" id="oa_member_name_${currentCount}" required placeholder="Full Legal Name" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="margin: 0;">
      <label style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Capital Contribution ($) *</label>
      <input type="number" id="oa_member_contribution_${currentCount}" required placeholder="e.g. 500" min="0" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="margin: 0;">
      <label style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Ownership % *</label>
      <input type="number" id="oa_member_percentage_${currentCount}" required placeholder="e.g. 50" min="0" max="100" class="wizard-input-field oa-percentage-field" oninput="calculateCumulativeOperatingAgreementEquityTotal()">
    </div>
  `;

  container.appendChild(newCard);
};

