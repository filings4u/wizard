// ============================================================================ //
// ðŸ› ï¸ SOLE PROPRIETORSHIP PART 1 VALIDATION MATRIX ENGINE                      //
// ============================================================================ //

var solePropPart1Validation = {
  requiredFields: [
    { id: 'sp_proposed_name', msg: 'Proposed Business Name is required.' },
    { id: 'sp_business_purpose', msg: 'Business Purpose is required.' },
    { id: 'sp_bus_street', msg: 'Business Location Street Address is required.' },
    { id: 'sp_bus_city', msg: 'Business City is required.' },
    { id: 'sp_bus_state', msg: 'Business State code is required.' },
    { id: 'sp_bus_zip', msg: 'Business Zip Code is required.' },
    { id: 'sp_owner_name', msg: "Owner's Full Name is required." },
    { id: 'sp_owner_phone', msg: "Owner's Contact Number is required." },
    { id: 'sp_owner_email', msg: "Owner's Email Address is required." },
    { id: 'sp_owner_street', msg: "Owner's Residential Street Address is required." },
    { id: 'sp_owner_city', msg: "Owner's City is required." },
    { id: 'sp_owner_state', msg: "Owner's State code is required." },
    { id: 'sp_owner_zip', msg: "Owner's Zip Code is required." },
    { id: 'sp_dba_choice', msg: 'Fictitious name preference selection is required.' }
  ],
  validate: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);

      const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");

      const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    // 1. Process standard mandatory fields presence
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) setError(el, field.msg);
        else clearError(el);
      }
    });

    // 2. Validate Two-Letter State Abbreviations
    ['sp_bus_state', 'sp_owner_state'].forEach(id => {
      const el = document.getElementById(id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (val && !/^[a-zA-Z]{2}$/.test(val)) {
          setError(el, 'State code must be exactly 2 alphabet letters.');
        }
      }
    });

    // 3. Validate 5-Digit ZIP Format Constraints
    ['sp_bus_zip', 'sp_owner_zip'].forEach(id => {
      const el = document.getElementById(id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (val && !/^\d{5}$/.test(val)) {
          setError(el, 'Zip Code must consist of exactly 5 digits.');
        }
      }
    });

    // 4. Validate Email Syntax Rules
    const emailEl = document.getElementById("sp_owner_email");
    if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
      const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(emailEl, "Please enter a valid owner email address.");
      }
    }

    // 5. Validate Phone Number baseline digits length
    const phoneEl = document.getElementById("sp_owner_phone");
    if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0)) {
      const phoneVal = phoneEl.value ? String(phoneEl.value).trim() : "";
      if (phoneVal) {
        const digits = phoneVal.replace(/\D/g, "");
        if (digits.length < 10) {
          setError(phoneEl, "Owner's Contact Number must contain at least 10 numbers.");
        }
      }
    }

    // 6. Conditional Check: Validate custom DBA field if selection matches YES
    const dbaChoice = document.getElementById("sp_dba_choice");
    if (dbaChoice && dbaChoice.value === "yes" && (dbaChoice.offsetWidth > 0 || dbaChoice.offsetHeight > 0)) {
      const dbaNameEl = document.getElementById("sp_dba_name");
      if (dbaNameEl) {
        const dbaVal = dbaNameEl.value ? String(dbaNameEl.value).trim() : "";
        if (!dbaVal) {
          setError(dbaNameEl, "Please specify your Fictitious / DBA Name.");
        } else {
          clearError(dbaNameEl);
        }
      }
    }

    return { isValid, errors };
  }
};

window.solePropPart1Validation = solePropPart1Validation;


// FAMILY 3: INFORMAL ENTITIES (SOLE PROPRIETORSHIPS / DBAS) - PART 1
function buildInformalEntityFieldsLayoutHtml() {
  return `
    <!-- SECTION 1: BUSINESS INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 12px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Business Information</h3>
    </div>
    <div class="wizard-input-group">
      <label for="sp_proposed_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Proposed Business Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_proposed_name" required placeholder="Your Legal Name or Fictitious Entity Name" class="wizard-input-field">
      <span style="font-size: 0.7rem; color: var(--slate); font-weight: 500; padding-left: 2px;">Be sure to check for name availability in your state.</span>
    </div>
    <div class="wizard-input-group">
      <label for="sp_business_purpose" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Purpose <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_business_purpose" required placeholder="Brief description of what the business will do..." class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_bus_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Location Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_bus_street" required placeholder="123 Main St" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'sp_bus')">
    </div>
    <div class="wizard-input-group">
      <label for="sp_bus_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_bus_city" required placeholder="Austin" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div>
        <label for="sp_bus_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
        <input type="text" id="sp_bus_state" required placeholder="TX" maxlength="2" class="wizard-input-field">
      </div>
      <div>
        <label for="sp_bus_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
        <input type="text" id="sp_bus_zip" required placeholder="78701" class="wizard-input-field">
      </div>
    </div>

    <!-- SECTION 2: OWNER INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Owner Information</h3>
    </div>
    <div class="wizard-input-group">
      <label for="sp_owner_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Full Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_owner_name" required placeholder="Full Legal Name" class="wizard-input-field">
    </div>
    <div class="wizard-input-group">
      <label for="sp_owner_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Contact Number <span style="color: #ef4444;">*</span></label>
      <input type="tel" id="sp_owner_phone" required placeholder="(512) 555-0199" style="font-family: monospace;" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_owner_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Email Address <span style="color: #ef4444;">*</span></label>
      <input type="email" id="sp_owner_email" required placeholder="name@domain.com" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_owner_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Residential Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_owner_street" required placeholder="456 Residential Ave" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'sp_owner')">
    </div>
    <div class="wizard-input-group">
      <label for="sp_owner_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_owner_city" required placeholder="Austin" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div>
        <label for="sp_owner_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
        <input type="text" id="sp_owner_state" required placeholder="TX" maxlength="2" class="wizard-input-field">
      </div>
      <div>
        <label for="sp_owner_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
        <input type="text" id="sp_owner_zip" required placeholder="78701" class="wizard-input-field">
      </div>
    </div>

    <!-- SECTION 3: BUSINESS STRUCTURE (DBA CONFIGURATOR) -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Business Structure</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_dba_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you be using a fictitious name (DBA)? <span style="color: #ef4444;">*</span></label>
      <select id="sp_dba_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSolePropDbaField(this.value)">
        <option value="no" selected>No, operating under my own legal name</option>
        <option value="yes">Yes, operating under a Fictitious/DBA trade name</option>
      </select>
    </div>
    <div id="sp_dba_name_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
      <label for="sp_dba_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Specify Fictitious / DBA Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_dba_name" placeholder="e.g. Apex Contracting Services" class="wizard-input-field">
    </div>
  ` + (typeof buildSolePropPart2FieldsLayoutHtml === "function" ? buildSolePropPart2FieldsLayoutHtml() : "");
}

// ============================================================================ //
// ðŸ› ï¸ SOLE PROPRIETORSHIP PART 2 VALIDATION MATRIX ENGINE                      //
// ============================================================================ //

var solePropPart2Validation = {
  requiredFields: [
    { id: 'sp_ein_choice', msg: 'Please select an option for your Employer Identification Number (EIN).' },
    { id: 'sp_duration_choice', msg: 'Please specify if this business operational model is temporary or ongoing.' },
    { id: 'sp_license_check', msg: 'Please verify if you have checked localized business licenses.' }
  ],
  validate: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);

      const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");

      const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    // 1. Check baseline mandatory selection elements presence
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) setError(el, field.msg);
        else clearError(el);
      }
    });

    // 2. Conditional Check: Validate EIN Reason input field if choice matches YES
    const einChoice = document.getElementById("sp_ein_choice");
    if (einChoice && einChoice.value === "yes" && (einChoice.offsetWidth > 0 || einChoice.offsetHeight > 0)) {
      const reasonEl = document.getElementById("sp_ein_reason");
      if (reasonEl) {
        const reasonVal = reasonEl.value ? String(reasonEl.value).trim() : "";
        if (!reasonVal) {
          setError(reasonEl, "Reason for obtaining an EIN is required.");
        } else {
          clearError(reasonEl);
        }
      }
    }

    // 3. Conditional Check: Validate Temporary Duration field if choice matches TEMPORARY
    const durationChoice = document.getElementById("sp_duration_choice");
    if (durationChoice && durationChoice.value === "temporary" && (durationChoice.offsetWidth > 0 || durationChoice.offsetHeight > 0)) {
      const termEl = document.getElementById("sp_duration_term");
      if (termEl) {
        const termVal = termEl.value ? String(termEl.value).trim() : "";
        if (!termVal) {
          setError(termEl, "Expected project or business duration description is required.");
        } else {
          clearError(termEl);
        }
      }
    }

    return { isValid, errors };
  }
};

window.solePropPart2Validation = solePropPart2Validation;


// FAMILY 3: INFORMAL ENTITIES (SOLE PROPRIETORSHIPS / DBAS) - PART 2
function buildSolePropPart2FieldsLayoutHtml() {
  return `
    <!-- SECTION 4: TAX INFORMATION (EIN CONFIGURATOR) -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Tax Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_ein_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you be applying for an Employer Identification Number (EIN)? <span style="color: #ef4444;">*</span></label>
      <select id="sp_ein_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSolePropEinReasonField(this.value)">
        <option value="no" selected>No, I do not require a Federal EIN at this time</option>
        <option value="yes">Yes, I want to procure an EIN record</option>
      </select>
    </div>
    <div id="sp_ein_reason_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
      <label for="sp_ein_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Reason for obtaining an EIN <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_ein_reason" placeholder="e.g. Hiring employees, opening a business bank account..." class="wizard-input-field">
    </div>

    <!-- SECTION 5: ADDITIONAL PROVISIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Additional Provisions (Optional)</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Sole Proprietorship Special Clauses</label>
      <textarea id="sp_provisions" placeholder="Detail any specific business terms, partnership understandings, or special conditions..." rows="3" class="wizard-input-field" style="font-family: inherit; resize: vertical; padding: 14px;"></textarea>
    </div>

    <!-- SECTION 6: DURATION OF BUSINESS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Duration of Business</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_duration_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will this be a temporary or ongoing business? <span style="color: #ef4444;">*</span></label>
      <select id="sp_duration_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSolePropDurationField(this.value)">
        <option value="perpetual" selected>Perpetual (Ongoing baseline existence status)</option>
        <option value="temporary">Temporary / Specified Term</option>
      </select>
    </div>
    <div id="sp_duration_term_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
      <label for="sp_duration_term" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Specify Expected Project/Business Duration <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sp_duration_term" placeholder="e.g. 6 Months, Project Ends Dec 2026..." class="wizard-input-field">
    </div>

    <!-- SECTION 7: COMPLIANCE AND LICENSES -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Compliance and Licenses</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sp_license_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have you verified the necessary localized business licenses or permits? <span style="color: #ef4444;">*</span></label>
      <select id="sp_license_check" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSolePropLicenseWorkflow(this.value)">
        <option value="" disabled selected>Choose an option...</option>
        <option value="yes">Yes, I have verified my structural requirements</option>
        <option value="no">No, I need help â€” Add Filings4u Compliance Research Suite â€” $79.00</option>
      </select>
    </div>
    <div id="sp_custom_license_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
      <label for="sp_intended_licenses" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">List Intentional Licenses / Permits to Apply For</label>
      <textarea id="sp_intended_licenses" placeholder="Provide general targets: e.g. Municipal Sales Tax Permit, Local Health Department Authorization..." rows="2" class="wizard-input-field" style="font-family: inherit; resize: vertical; padding: 14px;"></textarea>
    </div>
  `;
}
window.buildSolePropPart2FieldsLayoutHtml = buildSolePropPart2FieldsLayoutHtml;

// ============================================================================ //
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (SOLE PROPRIETORSHIPS)
// ============================================================================ //

window.toggleSolePropDbaField = function(value) {
  const dbaWrapper = document.getElementById("sp_dba_name_wrapper");
  const dbaInput = document.getElementById("sp_dba_name");
  if (!dbaWrapper) return;

  if (value === "yes") {
    dbaWrapper.style.setProperty("display", "flex", "important");
    if (dbaInput) dbaInput.setAttribute("required", "required");
  } else {
    dbaWrapper.style.setProperty("display", "none", "important");
    if (dbaInput) { dbaInput.removeAttribute("required"); dbaInput.value = ""; }
  }
};

window.toggleSolePropEinReasonField = function(value) {
  const einWrapper = document.getElementById("sp_ein_reason_wrapper");
  const einInput = document.getElementById("sp_ein_reason");
  if (!einWrapper) return;

  if (value === "yes") {
    einWrapper.style.setProperty("display", "flex", "important");
    if (einInput) einInput.setAttribute("required", "required");
    window.customSelectedEinProcurementServiceActive = true; // Appends EIN fee to subtotals
  } else {
    einWrapper.style.setProperty("display", "none", "important");
    if (einInput) { einInput.removeAttribute("required"); einInput.value = ""; }
    window.customSelectedEinProcurementServiceActive = false;
  }
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla();
};

window.toggleSolePropDurationField = function(value) {
  const termWrapper = document.getElementById("sp_duration_term_wrapper");
  const termInput = document.getElementById("sp_duration_term");
  if (!termWrapper) return;

  if (value === "temporary") {
    termWrapper.style.setProperty("display", "flex", "important");
    if (termInput) termInput.setAttribute("required", "required");
  } else {
    termWrapper.style.setProperty("display", "none", "important");
    if (termInput) { termInput.removeAttribute("required"); termInput.value = ""; }
  }
};

window.toggleSolePropLicenseWorkflow = function(value) {
  const licWrapper = document.getElementById("sp_custom_license_wrapper");
  if (!licWrapper) return;

  if (value === "yes") {
    licWrapper.style.setProperty("display", "flex", "important");
    window.customSelectedLicenseAuditSuiteActive = false; // Turn off research suite fee
  } else {
    licWrapper.style.setProperty("display", "none", "important");
    licWrapper.querySelectorAll("textarea").forEach(el => el.value = "");
    window.customSelectedLicenseAuditSuiteActive = (value === "no"); // Appends research suite fee if NO
  }
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla();
};

