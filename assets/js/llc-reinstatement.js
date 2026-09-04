/**
 * filings4u, LLC - Global Wizard-Wide Typography Standardizer
 * Injects a global stylesheet targeting all heading levels inside the wizard container.
 */;(function enforceWizardWideHeadingScaling() {
  console.log("[Typography Suite] Applying smaller layout scaling matrix throughout the entire wizard...");
  
  const styleNode = document.createElement("style");
  styleNode.id = "filings4u-wizard-wide-typography-override";
  
  styleNode.textContent = `
    /* Targets every title element inside the wizard container, panels, and dynamic cards */
    .wizard-container h1, .wizard-step-container h1,
    .wizard-container h2, .wizard-step-container h2,
    .wizard-container h3, .wizard-step-container h3,
    .wizard-container h4, .wizard-step-container h4,
    .wizard-container h5, .wizard-step-container h5,
    [id*="step-panel"] h1, [id*="step-panel"] h2, [id*="step-panel"] h3, [id*="step-panel"] h4, [id*="step-panel"] h5,
    [id*="step-rein"] h1, [id*="step-rein"] h2, [id*="step-rein"] h3, [id*="step-rein"] h4, [id*="step-rein"] h5,
    .member-record-card h3, .member-record-card h4,
    div[style*="border-bottom"] h3, div[style*="border-bottom"] h4 {
      font-size: 1.0rem !important;
      font-weight: 700 !important;
      letter-spacing: -0.015em !important;
      margin-top: 4px !important;
      margin-bottom: 4px !important;
    }

    /* Standardizes section layout lines slightly to match the smaller text */
    div[style*="border-bottom"] {
      margin-top: 14px !important;
      padding-bottom: 6px !important;
    }
  `;
  
  // Guard against style duplication in active memory
  const existingOverride = document.getElementById(styleNode.id);
  if (existingOverride) {
    existingOverride.remove();
  }
  
  document.head.appendChild(styleNode);
  console.log("[Typography Suite] Wizard-wide title scaling successfully active.");
})();





// ============================================================================ //
// ðŸ›ï¸ FILINGS4U, LLC - UNIFIED LLC-REINSTATEMENT VALIDATION MATRIX ENGINE        //
// ============================================================================ //

// Safely configure and instantiate the exact system framework properties
window.formRegistry = window.formRegistry || {};

const llcReinstatementValidation = {
  validateStep: function(stepNumber) {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);
      
      const errorMsgNode = document.getElementById("err_" + el.id) || 
                           el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");
      const errorMsgNode = document.getElementById("err_" + el.id) || 
                           el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    // --- STEP 1 VALIDATION: Core Base Corporate Identity & Location ---
    if (stepNumber === 1) {
      const step1Fields = [
        { id: 'rein_original_name', msg: 'Original LLC Name is required.' },
        { id: 'rein_state_of_formation', msg: 'State of Formation selection is required.' },
        { id: 'rein_principal_street', msg: 'Principal Office Street Address is required.' },
        { id: 'rein_principal_city', msg: 'Principal Office City is required.' },
        { id: 'rein_principal_state', msg: 'Principal Office State selection is required.' },
        { id: 'rein_principal_zip', msg: 'Principal Office Zip Code is required.' }
      ];

      step1Fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
          const val = el.value ? String(el.value).trim() : "";
          if (!val) setError(el, field.msg);
          else clearError(el);
        }
      });

      const zipEl = document.getElementById('rein_principal_zip');
      if (zipEl && (zipEl.offsetWidth > 0 || zipEl.offsetHeight > 0)) {
        const zipVal = zipEl.value ? String(zipEl.value).trim() : "";
        if (zipVal && !/^\d{5}$/.test(zipVal)) {
          setError(zipEl, 'Zip Code must consist of exactly 5 numbers.');
        }
      }
    }
    // --- STEP 2 VALIDATION: Contact Person Data ---
    if (stepNumber === 2) {
      const step2Fields = [
        { id: 'rein_contact_name', msg: "Primary Contact Person's Full Name is required." },
        { id: 'rein_contact_street', msg: "Contact Person's Address is required." },
        { id: 'rein_contact_city', msg: "Contact Person's City is required." },
        { id: 'rein_contact_state', msg: "Contact Person's State selection is required." },
        { id: 'rein_contact_zip', msg: "Contact Person's Zip Code is required." },
        { id: 'rein_contact_phone', msg: "Contact Person's Phone Number is required." },
        { id: 'rein_contact_email', msg: "Contact Person's Email Address is required." }
      ];

      step2Fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
          const val = el.value ? String(el.value).trim() : "";
          if (!val) setError(el, field.msg);
          else clearError(el);
        }
      });

      const contactZip = document.getElementById('rein_contact_zip');
      if (contactZip && (contactZip.offsetWidth > 0 || contactZip.offsetHeight > 0)) {
        const zipVal = contactZip.value ? String(contactZip.value).trim() : "";
        if (zipVal && !/^\d{5}$/.test(zipVal)) {
          setError(contactZip, 'Zip Code must consist of exactly 5 numbers.');
        }
      }

      const emailEl = document.getElementById("rein_contact_email");
      if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
        const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          setError(emailEl, "Please provide a valid structured email address.");
        }
      }

      const phoneEl = document.getElementById("rein_contact_phone");
      if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0)) {
        const phoneVal = phoneEl.value ? String(phoneVal).trim() : "";
        if (phoneVal) {
          const cleanDigits = phoneVal.replace(/\D/g, "");
          if (cleanDigits.length < 10) {
            setError(phoneEl, "Phone number must be at least 10 digits.");
          }
        }
      }
    }

    return { isValid, errors };
  }
};

// Map validator rules back to the exact required platform tokens
window.llcReinstatementValidation = llcReinstatementValidation;

window.formRegistry['llc-reinstatement-part1-validation'] = function() {
  return llcReinstatementValidation.validateStep(1);
};

window.formRegistry['llc-reinstatement-part2-validation'] = function() {
  return llcReinstatementValidation.validateStep(2);
};



window.formRegistry = window.formRegistry || {};

// --- STEP 1 REINSTATEMENT LAYOUT ENGINE ---
window.formRegistry['llc-reinstatement-part1-layout'] = function(stateDropdownOptionsHtml) {
  console.log("[LLC Reinstatement] Compiling Step 1 Form Layout...");
  
  // Enforce defensive fallback validation strings to protect template strings from breaking
  const optionsHtml = stateDropdownOptionsHtml || 
    (typeof window.buildGlobalUsaStateDropdownOptionsHtml === "function" ? window.buildGlobalUsaStateDropdownOptionsHtml("") : "");

  return [
'<!-- Info Banner -->', 
        '<div style="width: 100%; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 16px;">', 
        '<strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i>Understanding LLC Reinstatement</strong>', 
        'An LLC Reinstatement is the formal legal process required to restore a limited liability company back to active, compliant, and good standing status after it has been administratively suspended, forfeited, or dissolved by the state registry.', 
        '</div>', 
    
    '<!-- SECTION 1: LLC INFORMATION -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 8px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. LLC Information</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 1;">',
      '<label for="rein_original_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Original LLC Name <span style="color: #ef4444;">*</span></label>',
      '<input type="text" id="rein_original_name" required placeholder="The name of the LLC as it appears in the state records" class="wizard-input-field">',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 1;">',
      '<label for="rein_current_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Current LLC Name (If Applicable)</label>',
      '<input type="text" id="rein_current_name" placeholder="Enter name if changed after deactivation" class="wizard-input-field">',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 1;">',
      '<label for="rein_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State of Formation <span style="color: #ef4444;">*</span></label>',
      '<select id="rein_state_of_formation" required class="wizard-input-field" style="font-weight: 600;">',
        '<option value="" disabled selected>Select State...</option>',
        optionsHtml,
      '</select>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 1;">',
      '<label for="rein_llc_id" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">LLC ID Number (If Known)</label>',
      '<input type="text" id="rein_llc_id" placeholder="State filing number ID reference" class="wizard-input-field">',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Office Street Address <span style="color: #ef4444;">*</span></label>',
      '<input type="text" id="rein_principal_street" required placeholder="Street Name and Number, Suite, Unit" pattern="[A-Za-z0-9\\s\\#\\-\\.\\,\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, \'rein_principal\')">',
    '</div>'
  ].join('');
};
function buildReinstatementContactLayoutHtml(stateDropdownOptionsHtml) {
  const optionsHtml = stateDropdownOptionsHtml || 
    (typeof window.buildGlobalUsaStateDropdownOptionsHtml === "function" ? window.buildGlobalUsaStateDropdownOptionsHtml("") : "");

  return [
    '<!-- SECTION 2: CONTACT INFORMATION -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Contact Information</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Contact Person\'s Full Name <span style="color: #ef4444;">*</span></label>',
      '<input type="text" id="rein_contact_name" required placeholder="First and Last Legal Name" class="wizard-input-field">',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_contact_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Contact Person\'s Address <span style="color: #ef4444;">*</span></label>',
      '<input type="text" id="rein_contact_street" required placeholder="Street Address, Suite, Apt" pattern="[A-Za-z0-9\\s\\#\\-\\.\\,\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, \'rein_contact\')">',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">',
        '<div>',
          '<label for="rein_contact_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>',
          '<input type="text" id="rein_contact_city" required placeholder="City" pattern="[A-Za-z\\s\\-\\.]+" title="Valid text characters required." class="wizard-input-field">',
        '</div>',
        '<div>',
          '<label for="rein_contact_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>',
          '<select id="rein_contact_state" required class="wizard-input-field" style="font-weight: 600;">',
            optionsHtml,
          '</select>',
        '</div>',
        '<div>',
          '<label for="rein_contact_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>',
          '<input type="text" id="rein_contact_zip" required placeholder="Zip Code" pattern="[0-9]{5}(\\-[0-9]{4})?" title="5 digit standard postal code required." style="font-family: monospace;" class="wizard-input-field">',
        '</div>',
      '</div>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 1;">',
      '<label for="rein_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Contact Person\'s Phone Number <span style="color: #ef4444;">*</span></label>',
      '<input type="tel" id="rein_contact_phone" required placeholder="(512) 555-0199" class="wizard-input-field">',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 1;">',
      '<label for="rein_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Contact Person\'s Email Address <span style="color: #ef4444;">*</span></label>',
      '<input type="email" id="rein_contact_email" required placeholder="email@example.com" class="wizard-input-field">',
    '</div>'
  ].join('');
}

// --- MASTER RENDER SYSTEM ALLOCATION FOR REINSTATEMENT ---
window.formRegistry['llc-reinstatement-form-master'] = function(stateDropdownOptionsHtml) {
  console.log("[LLC Reinstatement Master Render] Compiling entire multi-part template pipeline...");
  
  var cleanOptions = stateDropdownOptionsHtml || "";
  
  var part1Html = window.formRegistry['llc-reinstatement-part1-layout'](cleanOptions);
  var contactPartHtml = buildReinstatementContactLayoutHtml(cleanOptions);
  
  // Clean string assembly return to eliminate screen rendering duplication crashes
  return part1Html + contactPartHtml;
};

// Backwards-compatible assignment layer for native global context mappings
function buildLlcReinstatementPart1(stateDropdownOptionsHtml) {
  return window.formRegistry['llc-reinstatement-form-master'](stateDropdownOptionsHtml);
}
window.buildLlcReinstatementPart1 = buildLlcReinstatementPart1;

console.log("[LLC Reinstatement Core] Master registration layout matrix fully initialized and live.");


window.formRegistry = window.formRegistry || {};

// Extend our central validation validation system matching your exact wizard hooks
const llcReinstatementPart2Validation = {
  requiredFields: [
    { id: 'rein_deactivation_reason', msg: 'Please select a reason for deactivation.' },
    { id: 'rein_fees_paid_choice', msg: 'Please select a fees and penalties verification option.' },
    { id: 'rein_rectified_choice', msg: 'Please specify if compliance issues have been rectified.' }
  ],
  validate: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);
      const errorMsgNode = document.getElementById("err_" + el.id) || 
                           el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");
      const errorMsgNode = document.getElementById("err_" + el.id) || 
                           el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    const isFieldVisible = (el) => !!(el && (el.offsetWidth > 0 || el.offsetHeight > 0));

    // 1. Process primary required dropdown targets
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (isFieldVisible(el)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) setError(el, field.msg);
        else clearError(el);
      }
    });
    // 2. Conditional Check: Validate Compliance Audit field if fees selection matches NO
    const feesPaidChoice = document.getElementById("rein_fees_paid_choice");
    if (feesPaidChoice && feesPaidChoice.value === "no" && !!(feesPaidChoice.offsetWidth > 0 || feesPaidChoice.offsetHeight > 0)) {
      const auditSelect = document.getElementById("rein_add_compliance_audit");
      if (auditSelect) {
        const auditVal = auditSelect.value ? String(auditSelect.value).trim() : "";
        if (!auditVal) {
          setError(auditSelect, "Please choose a compliance audit preference option.");
        } else {
          clearError(auditSelect);
        }
      }
    }

    // 3. Conditional Check: Validate Pending Issues textbox if rectified selection matches NO
    const rectifiedChoice = document.getElementById("rein_rectified_choice");
    if (rectifiedChoice && rectifiedChoice.value === "no" && !!(rectifiedChoice.offsetWidth > 0 || rectifiedChoice.offsetHeight > 0)) {
      const pendingDetails = document.getElementById("rein_pending_details");
      if (pendingDetails) {
        const pendingVal = pendingDetails.value ? String(pendingDetails.value).trim() : "";
        if (!pendingVal) {
          setError(pendingDetails, "Please provide structural details on what compliance items remain to be addressed.");
        } else {
          clearError(pendingDetails);
        }
      }
    }

    return { isValid, errors };
  }
};

// Bind cleanly back into legacy name scopes for global framework backward compatibility
window.llcReinPart2Validation = llcReinstatementPart2Validation;

// Register directly under the platform's exact expected platform service token
window.formRegistry['llc-reinstatement-part2-validation'] = function() {
  return llcReinstatementPart2Validation.validate();
};

console.log("[LLC Reinstatement Part 2] Validation hooks successfully live.");



window.formRegistry = window.formRegistry || {};

// --- STEP 2 REINSTATEMENT LAYOUT ENGINE ---
window.formRegistry['llc-reinstatement-part2-layout'] = function() {
  console.log("[LLC Reinstatement] Compiling Step 2 Layout...");

  return [
    '<!-- SECTION 3: REASON FOR REINSTATEMENT -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Reason for Reinstatement</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_deactivation_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Why has your entity been deactivated or dissolved? <span style="color: #ef4444;">*</span></label>',
      '<select id="rein_deactivation_reason" required class="wizard-input-field" style="font-weight: 600;">',
        '<option value="" disabled selected>Select Reason...</option>',
        '<option value="annual-reports">Failure to file periodic annual reports / statements</option>',
        '<option value="unpaid-taxes">Unpaid franchise taxes or delinquency indicators</option>',
        '<option value="registered-agent">Failure to maintain an active registered agent</option>',
        '<option value="voluntary">Voluntary dissolution error adjustment</option>',
        '<option value="other">Other statutory non-compliance issue</option>',
      '</select>',
    '</div>',
    
    '<!-- SECTION 4: OUTSTANDING FEES AUDIT -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Fees & Penalties Verification</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_fees_paid_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have all outstanding fees and penalties been paid? <span style="color: #ef4444;">*</span></label>',
      '<select id="rein_fees_paid_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleReinstatementFeesNoticeVisibility(this.value)">',
        '<option value="" disabled selected>Select Option...</option>',
        '<option value="yes">Yes, all standard balances have been completely cleared</option>',
        '<option value="no">No, there are outstanding balances or state collections pending</option>',
      '</select>',
    '</div>',
    
    '<!-- Conditional Container: Balance Recovery Notice & Compliance Add-on Selection Linkages -->',
    '<div id="rein_fees_unpaid_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">',
      '<div style="background: #fffaf0; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 0 8px 8px 0; box-sizing: border-box;">',
        '<p style="color: #b45309; font-size: 0.825rem; margin: 0; font-weight: 600; line-height: 1.5;">',
          'âš ï¸ All outstanding fees must be paid before the state will reinstate your formation. Filings4u will send you a notification inside your dashboard if there is a balance on your account.',
        '</p>',
      '</div>',
      '<div class="wizard-input-group" style="margin: 0; width: 100%;">',
        '<label for="rein_add_compliance_audit" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Would you like to use Filings4u Compliance Service for $99 + State Fees to check if all fees have been paid? <span style="color: #ef4444;">*</span></label>',
        '<select id="rein_add_compliance_audit" class="wizard-input-field" style="font-weight: 600;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === \'function\') { updateWizardFinalTotalAmountMatrix(); }">',
          '<option value="no" selected>No, I will review outstanding agency ledger lines independently</option>',
          '<option value="yes">Yes, add Filings4u Compliance Balance Check & State Audit Service â€” $99.00</option>',
        '</select>',
      '</div>',
    '</div>'
  ].join('');
};

// --- SECTION 5 LAYOUT ASSEMBLY LAYER ---
function buildReinstatementComplianceSectionHtml() {
  return [
    '<!-- SECTION 5: COMPLIANCE INFORMATION -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Compliance Information</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_rectified_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have you rectified all compliance issues that led to the suspension/dissolution? <span style="color: #ef4444;">*</span></label>',
      '<select id="rein_rectified_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleReinstatementIssuesVisibility(this.value)">',
        '<option value="" disabled selected>Select Option...</option>',
        '<option value="yes">Yes, all historical compliance issues have been fully resolved</option>',
        '<option value="no">No, certain administrative compliance discrepancies remain active</option>',
      '</select>',
    '</div>',
    '<div id="rein_pending_issues_wrapper" style="grid-column: span 2; display: none;">',
      '<div class="wizard-input-group" style="margin: 0; width: 100%;">',
        '<label for="rein_pending_details" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">If no, please detail what remains to be addressed: <span style="color: #ef4444;">*</span></label>',
        '<input type="text" id="rein_pending_details" placeholder="Describe unfiled reports, outstanding tax adjustments, or remaining items..." class="wizard-input-field">',
      '</div>',
    '</div>'
  ].join('');
}

// --- DYNAMIC FRONTEND INTERACTIVE TOGGLE CONTROLLERS ---
window.toggleReinstatementFeesNoticeVisibility = function(selectedValue) {
  const wrapper = document.getElementById("rein_fees_unpaid_wrapper");
  const field = document.getElementById("rein_add_compliance_audit");
  if (!wrapper) return;
  
  if (selectedValue === "no") {
    wrapper.style.setProperty("display", "flex", "important");
    if (field) field.setAttribute("required", "required");
  } else {
    wrapper.style.setProperty("display", "none", "important");
    if (field) {
      field.removeAttribute("required");
      field.value = "no";
    }
  }
};

window.toggleReinstatementIssuesVisibility = function(selectedValue) {
  const wrapper = document.getElementById("rein_pending_issues_wrapper");
  const field = document.getElementById("rein_pending_details");
  if (!wrapper) return;

  if (selectedValue === "no") {
    wrapper.style.setProperty("display", "block", "important");
    if (field) field.setAttribute("required", "required");
  } else {
    wrapper.style.setProperty("display", "none", "important");
    if (field) {
      field.removeAttribute("required");
      field.value = "";
      field.style.border = "";
    }
  }
};

// --- MASTER COMPILATION INTEGRATOR EXTENSION FOR PART 2 ---
const originalMasterRender = window.formRegistry['llc-reinstatement-form-master'];
window.formRegistry['llc-reinstatement-form-master'] = function(stateDropdownOptionsHtml) {
  // Capture base layers from the Part 1 pipeline allocations
  var baseOutput = typeof originalMasterRender === "function" ? originalMasterRender(stateDropdownOptionsHtml) : "";
  
  // Extract and compile Part 2 layer variables
  var part2LayoutHtml = window.formRegistry['llc-reinstatement-part2-layout']();
  var complianceHtml = buildReinstatementComplianceSectionHtml();
  
  return baseOutput + part2LayoutHtml + complianceHtml;
};

// Backwards-compatible assignment mapper layer
function buildLlcReinstatementPart2(stateDropdownOptionsHtml) {
  return window.formRegistry['llc-reinstatement-part2-layout']() + buildReinstatementComplianceSectionHtml();
}
window.buildLlcReinstatementPart2 = buildLlcReinstatementPart2;

console.log("[LLC Reinstatement Part 2] Full layout templates and conditional controllers successfully live.");

window.formRegistry = window.formRegistry || {};

// Extend our central validation system matching your exact wizard hooks
const llcReinstatementPart3Validation = {
  requiredFields: [
    { id: 'rein_ein_choice', msg: 'Please select an option for your Employer Identification Number (EIN).' },
    { id: 'rein_duration_type', msg: 'Please specify if this restoration is for a specific period or ongoing.' }
  ],
  validate: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);
      const errorMsgNode = document.getElementById("err_" + el.id) || 
                           el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");
      const errorMsgNode = document.getElementById("err_" + el.id) || 
                           el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    const isFieldVisible = (el) => !!(el && (el.offsetWidth > 0 || el.offsetHeight > 0));

    // 1. Check baseline mandatory selection elements presence
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (isFieldVisible(el)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) setError(el, field.msg);
        else clearError(el);
      }
    });
    // 2. Conditional Check: Validate new EIN Reason input field if selection matches YES
    const einChoice = document.getElementById("rein_ein_choice");
    if (einChoice && einChoice.value === "yes" && !!(einChoice.offsetWidth > 0 || einChoice.offsetHeight > 0)) {
      const reasonEl = document.getElementById("rein_ein_reason");
      if (reasonEl) {
        const reasonVal = reasonEl.value ? String(reasonEl.value).trim() : "";
        if (!reasonVal) {
          setError(reasonEl, "Reason for obtaining a new EIN is required.");
        } else {
          clearError(reasonEl);
        }
      }
    }

    // 3. Conditional Check: Validate Target Dissolution Date if duration matches SPECIFIC
    const durationType = document.getElementById("rein_duration_type");
    if (durationType && durationType.value === "specific" && !!(durationType.offsetWidth > 0 || durationType.offsetHeight > 0)) {
      const dateEl = document.getElementById("rein_duration_date");
      if (dateEl) {
        const dateVal = dateEl.value ? String(dateEl.value).trim() : "";
        if (!dateVal) {
          setError(dateEl, "Target Dissolution / Expiration Date is required.");
        } else {
          clearError(dateEl);
        }
      }
    }

    return { isValid, errors };
  }
};

// Bind cleanly back into legacy name scopes for global framework backward compatibility
window.llcReinPart3Validation = llcReinstatementPart3Validation;

// Register directly under the platform's exact expected platform service token
window.formRegistry['llc-reinstatement-part3-validation'] = function() {
  return llcReinstatementPart3Validation.validate();
};

console.log("[LLC Reinstatement Part 3] Validation hooks successfully live.");



window.formRegistry = window.formRegistry || {};

// --- STEP 3 REINSTATEMENT LAYOUT ENGINE ---
window.formRegistry['llc-reinstatement-part3-layout'] = function() {
  console.log("[LLC Reinstatement] Compiling Step 3 Layout...");

  return [
    '<!-- SECTION 6: TAX INFORMATION -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Tax Information</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_ein_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you be applying for a new Employer Identification Number (EIN) after reinstatement? <span style="color: #ef4444;">*</span></label>',
      '<select id="rein_ein_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleReinstatementEinWorkflow(this.value)">',
        '<option value="no" selected>No, I already hold or will apply for EIN structures independently</option>',
        '<option value="yes">Yes, add Filings4u Master EIN Procurement Service â€” $75.00</option>',
      '</select>',
      '<div class="wizard-error-message" id="err_rein_ein_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>',
    '</div>',
    '<div id="rein_ein_reason_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">',
      '<label for="rein_ein_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Reason for obtaining a new EIN (if applicable) <span style="color: #ef4444;">*</span></label>',
      '<input type="text" id="rein_ein_reason" placeholder="e.g. Corporate operational baseline reconstruction request..." class="wizard-input-field">',
      '<div class="wizard-error-message" id="err_rein_ein_reason" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>',
    '</div>',
    
    '<!-- SECTION 7: DURATION OF REINSTATEMENT -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Duration of Reinstatement</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_duration_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will this reinstatement be for a specific period or ongoing? <span style="color: #ef4444;">*</span></label>',
      '<select id="rein_duration_type" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleReinstatementDurationFieldVisibility(this.value)">',
        '<option value="ongoing" selected>Ongoing (Indefinite corporate lifecycle post-restoration)</option>',
        '<option value="specific">Specific Period (Defined timeline constraint structures)</option>',
      '</select>',
      '<div class="wizard-error-message" id="err_rein_duration_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>',
    '</div>',
    '<div id="rein_duration_date_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">',
      '<label for="rein_duration_date" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Target Dissolution / Expiration Date <span style="color: #ef4444;">*</span></label>',
      '<input type="date" id="rein_duration_date" class="wizard-input-field">',
      '<div class="wizard-error-message" id="err_rein_duration_date" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>',
    '</div>'
  ].join('');
};
// --- SECTION 8 LAYOUT ASSEMBLY LAYER ---
function buildReinstatementProvisionsSectionHtml() {
  return [
    '<!-- SECTION 8: ADDITIONAL PROVISIONS -->',
    '<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">',
      '<h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">8. Additional Provisions</h3>',
    '</div>',
    '<div class="wizard-input-group" style="grid-column: span 2;">',
      '<label for="rein_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Provisions</label>',
      '<textarea id="rein_provisions" placeholder="Detail any additional terms, specific clauses, or agreements relevant to your LLC reinstatement..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>',
    '</div>'
  ].join('');
}

// --- DYNAMIC REINSTATEMENT STEP 3 INTERACTIVE CONTROLLERS ---
window.toggleReinstatementEinWorkflow = function(selectedValue) {
  const wrapper = document.getElementById("rein_ein_reason_wrapper");
  const field = document.getElementById("rein_ein_reason");
  if (!wrapper) return;
  
  if (selectedValue === "yes") {
    wrapper.style.setProperty("display", "flex", "important");
    if (field) field.setAttribute("required", "required");
  } else {
    wrapper.style.setProperty("display", "none", "important");
    if (field) {
      field.removeAttribute("required");
      field.value = "";
      field.style.border = "";
    }
  }
};

window.toggleReinstatementDurationFieldVisibility = function(selectedValue) {
  const wrapper = document.getElementById("rein_duration_date_wrapper");
  const field = document.getElementById("rein_duration_date");
  if (!wrapper) return;

  if (selectedValue === "specific") {
    wrapper.style.setProperty("display", "flex", "important");
    if (field) field.setAttribute("required", "required");
  } else {
    wrapper.style.setProperty("display", "none", "important");
    if (field) {
      field.removeAttribute("required");
      field.value = "";
      field.style.border = "";
    }
  }
};

// --- MASTER COMPILATION INTEGRATOR EXTENSION FOR PART 3 ---
const primaryMasterRenderSystem = window.formRegistry['llc-reinstatement-form-master'];
window.formRegistry['llc-reinstatement-form-master'] = function(stateDropdownOptionsHtml) {
  // Pull forward compiled data fields from Parts 1 & 2 allocations safely
  var accumulatedOutput = typeof primaryMasterRenderSystem === "function" ? primaryMasterRenderSystem(stateDropdownOptionsHtml) : "";
  
  // Extract and compile final Part 3 layer string modifications
  var part3LayoutHtml = window.formRegistry['llc-reinstatement-part3-layout']();
  var finalProvisionsHtml = buildReinstatementProvisionsSectionHtml();
  
  return accumulatedOutput + part3LayoutHtml + finalProvisionsHtml;
};

// Backwards-compatible assignment mapper layer for platform backward compatibility
function buildLlcReinstatementPart3(stateDropdownOptionsHtml) {
  return window.formRegistry['llc-reinstatement-part3-layout']() + buildReinstatementProvisionsSectionHtml();
}
window.buildLlcReinstatementPart3 = buildLlcReinstatementPart3;

console.log("[LLC Reinstatement Part 3] Final layout templates and conditional controllers successfully live.");


// ============================================================================ //
// ðŸ“¦ MASTER LLC REINSTATEMENT ASSEMBLY HOOK                                   //
// ============================================================================ //

/**
 * Orchestrates the full compilation matrix for LLC Reinstatement.
 * Securely streams template parts matching your exact required naming conventions.
 */
function buildLlcReinstatementForm(stateDropdownOptionsHtml) {
  console.log("[LLC Reinstatement] Running master layout assembly compilation...");
  
  // Use passed state dropdown options string, or fall back to global built-in generator
  const optionsHtml = stateDropdownOptionsHtml || 
    (typeof window.buildGlobalUsaStateDropdownOptionsHtml === "function" ? window.buildGlobalUsaStateDropdownOptionsHtml("") : "");

  // FIXED: Execute utilizing the clean formRegistry pipeline variables to prevent double fields
  return window.formRegistry['llc-reinstatement-form-master'](optionsHtml);
}

// Bind cleanly back into the global tree references for legacy master calls
window.buildLlcReinstatementForm = buildLlcReinstatementForm;
// ============================================================================ //
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (LLC REINSTATEMENT)                      //
// ============================================================================ //

window.toggleReinstatementFeesNoticeVisibility = function(value) {
  const unpaidWrapper = document.getElementById("rein_fees_unpaid_wrapper");
  const auditSelect = document.getElementById("rein_add_compliance_audit");
  if (!unpaidWrapper) return;

  if (value === "no") {
    unpaidWrapper.style.setProperty("display", "flex", "important");
    if (auditSelect) auditSelect.setAttribute("required", "required");
  } else {
    unpaidWrapper.style.setProperty("display", "none", "important");
    if (auditSelect) {
      auditSelect.removeAttribute("required");
      auditSelect.value = "no";
    }
    window.customSelectedComplianceAuditServiceActive = false;
  }

  if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
    window.updateDynamicPricingMatrixVanilla();
  }
};

window.toggleReinstatementIssuesVisibility = function(value) {
  const issuesWrapper = document.getElementById("rein_pending_issues_wrapper");
  const issuesInput = document.getElementById("rein_pending_details");
  if (!issuesWrapper) return;

  if (value === "no") {
    issuesWrapper.style.setProperty("display", "block", "important");
    if (issuesInput) issuesInput.setAttribute("required", "required");
  } else {
    issuesWrapper.style.setProperty("display", "none", "important");
    if (issuesInput) {
      issuesInput.removeAttribute("required");
      issuesInput.value = "";
    }
  }
};

window.toggleReinstatementEinWorkflow = function(value) {
  const einWrapper = document.getElementById("rein_ein_reason_wrapper");
  const einInput = document.getElementById("rein_ein_reason");
  if (!einWrapper) return;

  if (value === "yes") {
    einWrapper.style.setProperty("display", "flex", "important");
    if (einInput) einInput.setAttribute("required", "required");
    window.customSelectedEinProcurementServiceActive = true;
  } else {
    einWrapper.style.setProperty("display", "none", "important");
    if (einInput) {
      einInput.removeAttribute("required");
      einInput.value = "";
    }
    window.customSelectedEinProcurementServiceActive = false;
  }

  if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
    window.updateDynamicPricingMatrixVanilla();
  }
};

window.toggleReinstatementDurationFieldVisibility = function(value) {
  const dateWrapper = document.getElementById("rein_duration_date_wrapper");
  const dateInput = document.getElementById("rein_duration_date");
  if (!dateWrapper) return;

  if (value === "specific") {
    dateWrapper.style.setProperty("display", "flex", "important");
    if (dateInput) dateInput.setAttribute("required", "required");
  } else {
    dateWrapper.style.setProperty("display", "none", "important");
    if (dateInput) {
      dateInput.removeAttribute("required");
      dateInput.value = "";
    }
  }
};

window.toggleReinstatementAuditServicePricingHook = function(value) {
  window.customSelectedComplianceAuditServiceActive = (value === "yes");
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
    window.updateDynamicPricingMatrixVanilla();
  }
};

console.log("[LLC Reinstatement Finalizer] All interactive elements and billing recalculation modules fully loaded.");


