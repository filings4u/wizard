// ============================================================================ //
// ðŸ› ï¸ SERIES LLC PART 1 VALIDATION MATRIX ENGINE                                //
// ============================================================================ //

var seriesLlcPart1Validation = {
  requiredFields: [
    { id: 'sllc_proposed_name', msg: 'Proposed Series LLC Name is required.' },
    { id: 'sllc_formation_state', msg: 'Filing Jurisdiction selection is required.' },
    { id: 'sllc_business_purpose', msg: 'Purpose of Series LLC is required.' },
    { id: 'sllc_principal_street', msg: 'Principal Office Street Address is required.' },
    { id: 'sllc_principal_city', msg: 'Principal Office City is required.' },
    { id: 'sllc_principal_state', msg: 'Principal Office State selection is required.' },
    { id: 'sllc_principal_zip', msg: 'Principal Office Zip Code is required.' }
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

    // 1. Process standard mandatory fields
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) {
          setError(el, field.msg);
        } else {
          clearError(el);
        }
      }
    });

    // 2. Specialized Check: Business Suffix Rules Compliance
    const nameEl = document.getElementById("sllc_proposed_name");
    if (nameEl && (nameEl.offsetWidth > 0 || nameEl.offsetHeight > 0)) {
      const val = nameEl.value ? String(nameEl.value).trim().toLowerCase() : "";
      if (val) {
        const hasSuffix = val.endsWith("llc") || val.endsWith("l.l.c.") || val.includes("limited liability company");
        if (!hasSuffix) {
          setError(nameEl, 'Proposed Series LLC name must contain corporate designations like "LLC".');
        }
      }
    }

    // 3. Specialized Check: Zip Length Framework Matrix Matcher
    const zipEl = document.getElementById("sllc_principal_zip");
    if (zipEl && (zipEl.offsetWidth > 0 || zipEl.offsetHeight > 0)) {
      const zipVal = zipEl.value ? String(zipEl.value).trim() : "";
      if (zipVal && !/^\d{5}$/.test(zipVal)) {
        setError(zipEl, 'Principal Office Zip Code must consist of exactly 5 numbers.');
      }
    }

    return { isValid, errors };
  }
};

window.seriesLlcPart1Validation = seriesLlcPart1Validation;


// Part 2: Form layout template definition (Designs untouched)
function buildSeriesLlcPart1() {
  // Programmatically fetches uniform state lists straight out of the active utility function
  const stateDropdownOptionsHtml = typeof getUsaStatesHtml === "function" ? getUsaStatesHtml(window.selectedFormationStateCode || "") : '<option value="">Select State...</option>';
  
  return `
    <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS A SERIES LLC? -->
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 8px;">
      <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-check"></i> What is a Series LLC?</strong> A Series LLC is a specialized corporate structure allowing a master entity to isolate assets across independent sub-units or cells.
    </div>

    <!-- SECTION 1: ORGANIZATION INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 12px;">
      <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Master Organization Details</h3>
    </div>

    <div class="wizard-input-group" style="display:flex; flex-direction:column; gap:6px;">
      <label for="sllc_proposed_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Proposed Series LLC Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_proposed_name" name="sllc_proposed_name" required placeholder="Provide corporate title name..." class="wizard-input-field validate-letters" style="width:100%; height:40px; padding:0 8px; border-radius:6px; border:1px solid #cbd5e1; box-sizing:border-box;" onblur="if(typeof validateLlcNameSuffix==='function')validateLlcNameSuffix(this);">
      <div class="wizard-error-message" id="err_sllc_proposed_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <div class="wizard-input-group" style="display:flex; flex-direction:column; gap:6px;">
      <label for="sllc_formation_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">State of Formation / Filing Jurisdiction <span style="color: #ef4444;">*</span></label>
      <select id="sllc_formation_state" name="sllc_formation_state" required class="wizard-input-field" style="font-weight: 600; width:100%; height:40px; padding:0 8px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; box-sizing:border-box;">
        ${stateDropdownOptionsHtml}
      </select>
      <div class="wizard-error-message" id="err_sllc_formation_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <div class="wizard-input-group" style="grid-column: span 2; display:flex; flex-direction:column; gap:6px;">
      <label for="sllc_business_purpose" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Purpose of Series LLC <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_business_purpose" name="sllc_business_purpose" required placeholder="Brief description of primary activities..." class="wizard-input-field" style="width:100%; height:40px; padding:0 8px; border-radius:6px; border:1px solid #cbd5e1; box-sizing:border-box;">
      <div class="wizard-error-message" id="err_sllc_business_purpose" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <div class="wizard-input-group" style="grid-column: span 2; display:flex; flex-direction:column; gap:6px;">
      <label for="sllc_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Principal Office Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_principal_street" name="sllc_principal_street" required placeholder="Street address" class="wizard-input-field" style="width:100%; height:40px; padding:0 8px; border-radius:6px; border:1px solid #cbd5e1; box-sizing:border-box;" onfocus="if(typeof attachGooglePlacesAutocompleteToNode==='function')attachGooglePlacesAutocompleteToNode(this, 'llc_principal');">
      <div class="wizard-error-message" id="err_sllc_principal_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <div class="wizard-input-group" style="display:flex; flex-direction:column; gap:6px;">
      <label for="sllc_principal_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_principal_city" name="sllc_principal_city" required placeholder="City" class="wizard-input-field validate-letters" style="width:100%; height:40px; padding:0 8px; border-radius:6px; border:1px solid #cbd5e1; box-sizing:border-box;">
      <div class="wizard-error-message" id="err_sllc_principal_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <div class="wizard-input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="display:flex; flex-direction:column; gap:6px;">
        <label for="sllc_principal_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">State <span style="color: #ef4444;">*</span></label>
        <select id="sllc_principal_state" name="sllc_principal_state" required class="wizard-input-field" style="font-weight: 600; width:100%; height:40px; padding:0 8px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; box-sizing:border-box;">
          ${stateDropdownOptionsHtml}
        </select>
        <div class="wizard-error-message" id="err_sllc_principal_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <label for="sllc_principal_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Zip Code <span style="color: #ef4444;">*</span></label>
        <input type="text" id="sllc_principal_zip" name="sllc_principal_zip" required maxlength="5" placeholder="ZIP code" class="wizard-input-field validate-numbers" style="width:100%; height:40px; padding:0 8px; border-radius:6px; border:1px solid #cbd5e1; box-sizing:border-box;">
        <div class="wizard-error-message" id="err_sllc_principal_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;
}

window.buildSeriesLlcPart1 = buildSeriesLlcPart1;


// ============================================================================ //
// ðŸ› ï¸ SERIES LLC PART 2 VALIDATION MATRIX ENGINE                                //
// ============================================================================ //

var seriesLlcPart2Validation = {
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

    // 1. Validate Core Registered Agent Selection Dropdown
    const raChoice = document.getElementById("sllc_ra_choice");
    if (raChoice && (raChoice.offsetWidth > 0 || raChoice.offsetHeight > 0)) {
      const raVal = raChoice.value ? String(raChoice.value).trim() : "";
      if (!raVal) {
        setError(raChoice, "Please select a registered agent provision option to continue.");
      } else {
        clearError(raChoice);
      }
    }

    // 2. Conditional Validation: Third-Party Agent Fields Matrix
    if (raChoice && raChoice.value === "custom" && (raChoice.offsetWidth > 0 || raChoice.offsetHeight > 0)) {
      const customAgentFields = [
        { id: 'sllc_ra_custom_name', msg: 'Custom Registered Agent Full Legal Name is required.' },
        { id: 'sllc_ra_custom_street', msg: 'Registered Office Physical Street Address is required.' },
        { id: 'sllc_ra_custom_city', msg: 'Registered Agent City is required.' },
        { id: 'sllc_ra_custom_state', msg: 'Registered Agent State selection is required.' },
        { id: 'sllc_ra_custom_zip', msg: 'Registered Agent Zip Code is required.' }
      ];

      customAgentFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
          const val = el.value ? String(el.value).trim() : "";
          let isFieldValid = !!val;

          // Enforce 5-digit numerical ZIP constraints if checking the ZIP input node
          if (field.id === 'sllc_ra_custom_zip' && val && !/^\d{5}$/.test(val)) {
            isFieldValid = false;
            setError(el, 'Registered Agent Zip Code must consist of exactly 5 numbers.');
          }

          if (!isFieldValid) {
            setError(el, field.msg);
          } else if (field.id !== 'sllc_ra_custom_zip' || /^\d{5}$/.test(val)) {
            clearError(el);
          }
        }
      });
    }

    return { isValid, errors };
  }
};

window.seriesLlcPart2Validation = seriesLlcPart2Validation;


// Part 2: HTML Structural Layout Template Definition (Designs Untouched)
function buildSeriesLlcPart2(stateDropdownOptionsHtml) {
  // DYNAMIC FIX: Query the registry database programmatically to find current agent pricing rather than hardcoding static "$75.00" string text.
  const centralRegistrySource = window.CENTRAL_ADDON_DB || window.UPSELL_ADDON_REGISTRY || {};
  const agentMetaRecord = centralRegistrySource["customSelectedRegisteredAgentServiceActive"] || {};
  const liveAgentFee = parseFloat(agentMetaRecord.price || 75.00).toFixed(2);
  
  // DYNAMIC FIX: Prevent empty dropdown containers by falling back to the centralized helper utility array pass
  const resolvedStateOptions = stateDropdownOptionsHtml || (typeof getUsaStatesHtml === "function" ? getUsaStatesHtml(window.selectedFormationStateCode || "") : '<option value="">Select State...</option>');
  
  return `
    <!-- SECTION 2: REGISTERED AGENT INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Registered Agent Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_ra_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Select Registered Agent Provision <span style="color: #ef4444;">*</span></label>
      <select id="sllc_ra_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleRegisteredAgentConditionalFields(this.value)">
        <option value="" disabled selected>Choose an option...</option>
        <option value="filings4u">Utilize Filings4u Protected Agent Shield Service â€” $${liveAgentFee} / Year</option>
        <option value="custom">Maintain External Independent Third-Party Registered Agent</option>
      </select>
      <div class="wizard-error-message" id="err_sllc_ra_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <div id="llc_custom_ra_wrapper" style="grid-column: span 2; display: none; grid-template-columns: 1fr 1fr; gap: 24px; background: var(--light-bg); padding: 20px; border-radius: 8px; border: 1px solid var(--border); box-sizing: border-box; width: 100%;">
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="sllc_ra_custom_name" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">Registered Agent Full Legal Name</label>
        <input type="text" id="sllc_ra_custom_name" placeholder="Agent or company legal title" class="wizard-input-field">
        <div class="wizard-error-message" id="err_sllc_ra_custom_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="sllc_ra_custom_street" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">Registered Office Physical Street Address (No PO Boxes)</label>
        <input type="text" id="sllc_ra_custom_street" placeholder="Physical street address" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'llc_ra_custom')">
        <div class="wizard-error-message" id="err_sllc_ra_custom_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div class="wizard-input-group">
        <label for="sllc_ra_custom_city" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">City</label>
        <input type="text" id="sllc_ra_custom_city" placeholder="City" class="wizard-input-field">
        <div class="wizard-error-message" id="err_sllc_ra_custom_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div class="wizard-input-group" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label for="sllc_ra_custom_state" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">State</label>
          <select id="sllc_ra_custom_state" class="wizard-input-field" style="font-weight: 600;">
            ${resolvedStateOptions}
          </select>
          <div class="wizard-error-message" id="err_sllc_ra_custom_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div>
          <label for="sllc_ra_custom_zip" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">Zip Code</label>
          <input type="text" id="sllc_ra_custom_zip" placeholder="ZIP code" class="wizard-input-field">
          <div class="wizard-error-message" id="err_sllc_ra_custom_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>
    </div>
  `;
}

window.buildSeriesLlcPart2 = buildSeriesLlcPart2;


// ============================================================================ //
// ðŸ› ï¸ SERIES LLC CONTACT VALIDATION MATRIX ENGINE                              //
// ============================================================================ //

var seriesLlcContactValidation = {
  fields: [
    { id: 'sllc_contact_name', msg: 'Primary Contact Full Name is required.' },
    { id: 'sllc_contact_phone', msg: 'Primary Contact Phone Number is required.' },
    { id: 'sllc_contact_email', msg: 'Primary Contact Email Address is required.' },
    { id: 'sllc_contact_street', msg: 'Primary Contact Mailing Street Address is required.' },
    { id: 'sllc_contact_city', msg: 'Primary Contact City is required.' },
    { id: 'sllc_contact_state', msg: 'Primary Contact State selection is required.' },
    { id: 'sllc_contact_zip', msg: 'Primary Contact Zip Code is required.' }
  ],
  validateSection: function() {
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

    // 1. Check existence of required values
    this.fields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) {
          setError(el, field.msg);
        } else {
          clearError(el);
        }
      }
    });

    // 2. Validate Email Syntax
    const emailEl = document.getElementById("sllc_contact_email");
    if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
      const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(emailEl, "Please enter a valid structural email address.");
      }
    }

    // 3. Validate Numeric Phone Length
    const phoneEl = document.getElementById("sllc_contact_phone");
    if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0)) {
      const phoneVal = phoneEl.value ? String(phoneEl.value).trim() : "";
      if (phoneVal) {
        const pureDigits = phoneVal.replace(/\D/g, "");
        if (pureDigits.length < 10) {
          setError(phoneEl, "Please enter a valid 10-digit phone number.");
        }
      }
    }

    // 4. Validate ZIP Length Matcher
    const zipEl = document.getElementById("sllc_contact_zip");
    if (zipEl && (zipEl.offsetWidth > 0 || zipEl.offsetHeight > 0)) {
      const zipVal = zipEl.value ? String(zipEl.value).trim() : "";
      if (zipVal && !/^\d{5}$/.test(zipVal)) {
        setError(zipEl, "Primary Contact Zip Code must be exactly 5 digits.");
      }
    }

    return { isValid, errors };
  }
};

window.seriesLlcContactValidation = seriesLlcContactValidation;


// This string returns the full Section 3 contact module exactly as written
var section3HtmlPayload = `
<!-- SECTION 3: CONTACT INFORMATION -->
<div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
  <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Contact Information</h3>
</div>
<div class="wizard-input-group">
  <label for="sllc_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Contact Full Name <span style="color: #ef4444;">*</span></label>
  <input type="text" id="sllc_contact_name" required placeholder="Full legal name" pattern="[A-Za-z\\\\s\\\\.\\\\-\\'\\s]+" title="Please provide a valid legal name character string." class="wizard-input-field">
</div>
<div class="wizard-input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
  <div>
    <label for="sllc_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Phone Number <span style="color: #ef4444;">*</span></label>
    <input type="tel" id="sllc_contact_phone" required placeholder="Phone number" pattern="\\\\+?[0-9\\\\s\\\\-\\\\(\\\\)]+" title="Please provide a valid phone layout structure." style="font-family: monospace;" class="wizard-input-field">
  </div>
  <div>
    <label for="sllc_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Email Address <span style="color: #ef4444;">*</span></label>
    <input type="email" id="sllc_contact_email" required placeholder="Email address" class="wizard-input-field">
  </div>
</div>
<div class="wizard-input-group" style="grid-column: span 2;">
  <label for="sllc_contact_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Mailing Street Address <span style="color: #ef4444;">*</span></label>
  <input type="text" id="sllc_contact_street" required placeholder="Street address" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,]+" title="Please provide a valid structural address format line." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'sllc_contact')">
</div>
<div class="wizard-input-group">
  <label for="sllc_contact_unit" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Suite / Apt / Unit</label>
  <input type="text" id="sllc_contact_unit" placeholder="Suite, Apt, Unit" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.]+" title="Alpha-numeric tracking symbols allowed." class="wizard-input-field">
</div>
<div class="wizard-input-group">
  <label for="sllc_contact_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">City <span style="color: #ef4444;">*</span></label>
  <input type="text" id="sllc_contact_city" required placeholder="City" pattern="[A-Za-z\\\\s\\\\-\\\\.]+" title="Valid text city location characters required." class="wizard-input-field">
</div>
<div class="wizard-input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; grid-column: span 2;">
  <div>
    <label for="sllc_contact_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
    <select id="sllc_contact_state" required class="wizard-input-field" style="font-weight: 600;">
      \${resolvedStateOptions}
    </select>
  </div>
  <div>
    <label for="sllc_contact_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
    <input type="text" id="sllc_contact_zip" required placeholder="ZIP code" pattern="[0-9]{5}(\\\\-[0-9]{4})?" title="5 digit standard postal code metric required." style="font-family: monospace;" class="wizard-input-field">
  </div>
</div>
\`;
`;
window.buildSeriesLlcPart2 = buildSeriesLlcPart2;

// ============================================================================ //
// ðŸ› ï¸ SERIES LLC PART 2A VALIDATION MATRIX ENGINE                               //
// ============================================================================ //

var seriesLlcPart2AValidation = {
  requiredFields: [
    { id: 'sllc_ra_choice', msg: 'Please select a registered agent option.' },
    { id: 'sllc_contact_name', msg: 'Primary Contact Full Name is required.' },
    { id: 'sllc_contact_phone', msg: 'Primary Contact Phone Number is required.' },
    { id: 'sllc_contact_email', msg: 'Primary Contact Email Address is required.' },
    { id: 'sllc_contact_street', msg: 'Primary Contact Mailing Street Address is required.' },
    { id: 'sllc_contact_city', msg: 'Primary Contact City is required.' },
    { id: 'sllc_contact_state', msg: 'Primary Contact State selection is required.' },
    { id: 'sllc_contact_zip', msg: 'Primary Contact Zip Code is required.' }
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

    // 1. Validate Base Contact & Agent Selection
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) {
          setError(el, field.msg);
        } else {
          clearError(el);
        }
      }
    });

    // 2. Validate Contact Email String Layout Format
    const emailEl = document.getElementById("sllc_contact_email");
    if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
      const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(emailEl, "Please enter a valid legal email address structure.");
      }
    }

    // 3. Validate Contact Phone Number Length
    const phoneEl = document.getElementById("sllc_contact_phone");
    if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0)) {
      const phoneVal = phoneEl.value ? String(phoneEl.value).trim() : "";
      if (phoneVal) {
        const cleanPhone = phoneVal.replace(/\D/g, "");
        if (cleanPhone.length < 10) {
          setError(phoneEl, "Primary Contact Phone Number must be a valid 10-digit number.");
        }
      }
    }

    // 4. Validate Contact ZIP Code Format Constraint
    const zipEl = document.getElementById("sllc_contact_zip");
    if (zipEl && (zipEl.offsetWidth > 0 || zipEl.offsetHeight > 0)) {
      const zipVal = zipEl.value ? String(zipEl.value).trim() : "";
      if (zipVal && !/^\d{5}$/.test(zipVal)) {
        setError(zipEl, "Primary Contact Zip Code must consist of exactly 5 numbers.");
      }
    }

    // 5. Conditional Ruleset Check: Custom Third Party Agent Fields
    const raChoice = document.getElementById("sllc_ra_choice");
    if (raChoice && raChoice.value === "custom" && (raChoice.offsetWidth > 0 || raChoice.offsetHeight > 0)) {
      const customAgentFields = [
        { id: 'sllc_ra_custom_name', msg: 'Custom Registered Agent Full Legal Name is required.' },
        { id: 'sllc_ra_custom_street', msg: 'Registered Office Physical Street Address is required.' },
        { id: 'sllc_ra_custom_city', msg: 'Registered Agent City is required.' },
        { id: 'sllc_ra_custom_state', msg: 'Registered Agent State selection is required.' },
        { id: 'sllc_ra_custom_zip', msg: 'Registered Agent Zip Code is required.' }
      ];

      customAgentFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
          const val = el.value ? String(el.value).trim() : "";
          let isFieldValid = !!val;

          if (field.id === 'sllc_ra_custom_zip' && val && !/^\d{5}$/.test(val)) {
            isFieldValid = false;
            setError(el, 'Registered Agent Zip Code must consist of exactly 5 numbers.');
          }

          if (!isFieldValid) {
            setError(el, field.msg);
          } else if (field.id !== 'sllc_ra_custom_zip' || /^\d{5}$/.test(val)) {
            clearError(el);
          }
        }
      });
    }

    return { isValid, errors };
  }
};

window.seriesLlcPart2AValidation = seriesLlcPart2AValidation;


// Part 2: HTML Component Structural Output Definition (Designs Untouched)
function buildSeriesLlcPart2A(stateDropdownOptionsHtml) {
  const centralRegistrySource = window.CENTRAL_ADDON_DB || window.UPSELL_ADDON_REGISTRY || {};
  const agentMetaRecord = centralRegistrySource["customSelectedRegisteredAgentServiceActive"] || {};
  const liveAgentFee = parseFloat(agentMetaRecord.price || 75.00).toFixed(2);
  const resolvedStateOptions = stateDropdownOptionsHtml || (typeof getUsaStatesHtml === "function" ? getUsaStatesHtml(window.selectedFormationStateCode || "") : '<option value="">Select State...</option>');

  return `
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Registered Agent Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_ra_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Select Registered Agent Provision <span style="color: #ef4444;">*</span></label>
      <select id="sllc_ra_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleRegisteredAgentConditionalFields(this.value)">
        <option value="" disabled selected>Choose an option...</option>
        <option value="filings4u">Utilize Filings4u Protected Agent Shield Service â€” $${liveAgentFee} / Year</option>
        <option value="custom">Maintain External Independent Third-Party Registered Agent</option>
      </select>
      <div class="wizard-error-message" id="err_sllc_ra_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <div id="llc_custom_ra_wrapper" style="grid-column: span 2; display: none; grid-template-columns: 1fr 1fr; gap: 24px; background: var(--light-bg); padding: 20px; border-radius: 8px; border: 1px solid var(--border); box-sizing: border-box; width: 100%;">
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="sllc_ra_custom_name" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">Registered Agent Full Legal Name</label>
        <input type="text" id="sllc_ra_custom_name" placeholder="Agent or company legal title" class="wizard-input-field">
        <div class="wizard-error-message" id="err_sllc_ra_custom_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="sllc_ra_custom_street" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">Registered Office Physical Street Address (No PO Boxes)</label>
        <input type="text" id="sllc_ra_custom_street" placeholder="Physical street address" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'llc_ra_custom')">
        <div class="wizard-error-message" id="err_sllc_ra_custom_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div class="wizard-input-group">
        <label for="sllc_ra_custom_city" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">City</label>
        <input type="text" id="sllc_ra_custom_city" placeholder="City" class="wizard-input-field">
        <div class="wizard-error-message" id="err_sllc_ra_custom_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div class="wizard-input-group" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label for="sllc_ra_custom_state" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">State</label>
          <select id="sllc_ra_custom_state" class="wizard-input-field" style="font-weight: 600;">
            ${resolvedStateOptions}
          </select>
          <div class="wizard-error-message" id="err_sllc_ra_custom_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div>
          <label for="sllc_ra_custom_zip" style="font-weight:700; font-size:0.8rem; color:var(--navy); text-transform:uppercase;">Zip Code</label>
          <input type="text" id="sllc_ra_custom_zip" placeholder="ZIP code" class="wizard-input-field">
          <div class="wizard-error-message" id="err_sllc_ra_custom_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>
    </div>

    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Contact Information</h3>
    </div>
    <div class="wizard-input-group">
      <label for="sllc_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Contact Full Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_contact_name" required placeholder="Full legal name" pattern="[A-Za-z\\s\\.\\-\\'\\s]+" class="wizard-input-field">
      <div class="wizard-error-message" id="err_sllc_contact_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div>
        <label for="sllc_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Phone Number <span style="color: #ef4444;">*</span></label>
        <input type="tel" id="sllc_contact_phone" required placeholder="Phone number" style="font-family: monospace;" class="wizard-input-field">
        <div class="wizard-error-message" id="err_sllc_contact_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div>
        <label for="sllc_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Email Address <span style="color: #ef4444;">*</span></label>
        <input type="email" id="sllc_contact_email" required placeholder="Email address" class="wizard-input-field">
        <div class="wizard-error-message" id="err_sllc_contact_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_contact_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Mailing Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_contact_street" required placeholder="Street address" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'sllc_contact')">
      <div class="wizard-error-message" id="err_sllc_contact_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-group">
      <label for="sllc_contact_unit" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Suite / Apt / Unit</label>
      <input type="text" id="sllc_contact_unit" placeholder="Suite, Apt, Unit" class="wizard-input-field">
    </div>
    <div class="wizard-input-group">
      <label for="sllc_contact_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_contact_city" required placeholder="City" class="wizard-input-field">
      <div class="wizard-error-message" id="err_sllc_contact_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; grid-column: span 2;">
      <div>
        <label for="sllc_contact_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
        <select id="sllc_contact_state" required class="wizard-input-field" style="font-weight: 600;">
          ${resolvedStateOptions}
        </select>
        <div class="wizard-error-message" id="err_sllc_contact_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div>
        <label for="sllc_contact_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
        <input type="text" id="sllc_contact_zip" required placeholder="ZIP code" style="font-family: monospace;" class="wizard-input-field">
        <div class="wizard-error-message" id="err_sllc_contact_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;
}

window.buildSeriesLlcPart2A = buildSeriesLlcPart2A;


// ============================================================================ //
// ðŸ› ï¸ SERIES LLC PART 2B VALIDATION MATRIX ENGINE                               //
// ============================================================================ //

var seriesLlcPart2BValidation = {
  validate: function() {
    const container = document.getElementById("step-panel-2") || document.getElementById("step-2") || document.body;
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

    // 1. Validate Base Dropdowns
    const mgmtType = document.getElementById("sllc_management_type");
    if (mgmtType && (mgmtType.offsetWidth > 0 || mgmtType.offsetHeight > 0)) {
      if (!mgmtType.value) setError(mgmtType, "Management Designation selection is required.");
      else clearError(mgmtType);
    }

    const seriesChoice = document.getElementById("sllc_form_series_choice");
    if (seriesChoice && (seriesChoice.offsetWidth > 0 || seriesChoice.offsetHeight > 0)) {
      if (!seriesChoice.value) setError(seriesChoice, "Please answer if you will be forming distinct series cells.");
      else clearError(seriesChoice);
    }

    const einChoice = document.getElementById("sllc_ein_choice");
    if (einChoice && (einChoice.offsetWidth > 0 || einChoice.offsetHeight > 0)) {
      if (!einChoice.value) setError(einChoice, "Please select an option for your Employer Identification Number (EIN).");
      else clearError(einChoice);
    }

    // 2. Loop Check: Dynamic Member Cards
    const memberCards = container.querySelectorAll("#sllc_members_container .member-record-card");
    memberCards.forEach(card => {
      if (card && (card.offsetWidth > 0 || card.offsetHeight > 0)) {
        const idx = card.id.replace("sllc_member_card_", "");
        const nameEl = document.getElementById(`sllc_member_name_${idx}`);
        const streetEl = document.getElementById(`sllc_member_street_${idx}`);
        const cityEl = document.getElementById(`sllc_member_city_${idx}`);
        const stateEl = document.getElementById(`sllc_member_state_${idx}`);
        const zipEl = document.getElementById(`sllc_member_zip_${idx}`);

        if (nameEl && !nameEl.value.trim()) setError(nameEl, `Member #${idx}: Full Legal Name is required.`);
        else if (nameEl) clearError(nameEl);

        if (streetEl && !streetEl.value.trim()) setError(streetEl, `Member #${idx}: Mailing Street Address is required.`);
        else if (streetEl) clearError(streetEl);

        if (cityEl && !cityEl.value.trim()) setError(cityEl, `Member #${idx}: City is required.`);
        else if (cityEl) clearError(cityEl);

        if (stateEl && !stateEl.value.trim()) setError(stateEl, `Member #${idx}: State is required.`);
        else if (stateEl) clearError(stateEl);

        if (zipEl) {
          const zipVal = zipEl.value.trim();
          if (!zipVal) setError(zipEl, `Member #${idx}: Zip Code is required.`);
          else if (!/^\d{5}$/.test(zipVal)) setError(zipEl, `Member #${idx}: Zip Code must be exactly 5 digits.`);
          else clearError(zipEl);
        }
      }
    });

    // 3. Conditional Loop Check: Dynamic Series Cell Subunits
    if (seriesChoice && seriesChoice.value === "yes" && (seriesChoice.offsetWidth > 0 || seriesChoice.offsetHeight > 0)) {
      const cellCards = container.querySelectorAll("#sllc_cells_container .member-record-card");
      cellCards.forEach(card => {
        if (card && (card.offsetWidth > 0 || card.offsetHeight > 0)) {
          const idx = card.id.replace("sllc_cell_card_", "");
          const cellNameEl = document.getElementById(`sllc_cell_name_${idx}`);
          const cellDescEl = document.getElementById(`sllc_cell_desc_${idx}`);

          if (cellNameEl && !cellNameEl.value.trim()) {
            setError(cellNameEl, `Series Cell #${idx}: Cell Legal Name Target is required.`);
          } else if (cellNameEl) {
            clearError(cellNameEl);
          }

          if (cellDescEl && !cellDescEl.value.trim()) {
            setError(cellDescEl, `Series Cell #${idx}: Purpose description is required.`);
          } else if (cellDescEl) {
            clearError(cellDescEl);
          }
        }
      });
    }

    // 4. Conditional Check: EIN Reason Input field
    if (einChoice && einChoice.value === "yes" && (einChoice.offsetWidth > 0 || einChoice.offsetHeight > 0)) {
      const einReasonEl = document.getElementById("sllc_ein_reason");
      if (einReasonEl) {
        if (!einReasonEl.value.trim()) setError(einReasonEl, "Reason for obtaining an EIN is required.");
        else clearError(einReasonEl);
      }
    }

    return { isValid, errors };
  }
};

window.seriesLlcPart2BValidation = seriesLlcPart2BValidation;


// Part 2: HTML Component Structural Output Definition (Designs Untouched)
function buildSeriesLlcPart2B(stateDropdownOptionsHtml) {
  const centralRegistrySource = window.CENTRAL_ADDON_DB || window.UPSELL_ADDON_REGISTRY || {};
  const einMetaRecord = centralRegistrySource["customSelectedEinProcurementServiceActive"] || {};
  const liveEinFee = parseFloat(einMetaRecord.price || 75.00).toFixed(2);
  const resolvedStateOptions = stateDropdownOptionsHtml || (typeof getUsaStatesHtml === "function" ? getUsaStatesHtml(window.selectedFormationStateCode || "") : '<option value="">Select State...</option>');

  return `
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Management Structure</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_management_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Management Designation <span style="color: #ef4444;">*</span></label>
      <select id="sllc_management_type" required class="wizard-input-field" style="font-weight: 600;">
        <option value="member-managed" selected>Member-Managed (Run directly by internal equity owners)</option>
        <option value="manager-managed">Manager-Managed (Run via appointed corporate executives)</option>
      </select>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <div id="sllc_members_container" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        <div class="member-record-card" id="sllc_member_card_1" style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Initial Member #1 Records</span>
          <div class="wizard-input-group" style="grid-column: span 2; margin: 0;">
            <label for="sllc_member_name_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Full Legal Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="sllc_member_name_1" required placeholder="Full legal name" class="wizard-input-field">
          </div>
          <div class="wizard-input-group" style="grid-column: span 2; margin: 0;">
            <label for="sllc_member_street_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Mailing Street Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="sllc_member_street_1" required placeholder="Street address" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'llc_member_1')">
          </div>
          <div class="wizard-input-group" style="margin: 0;">
            <label for="sllc_member_unit_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Suite / Building / Apt / Unit</label>
            <input type="text" id="sllc_member_unit_1" placeholder="Suite, Apt, Unit" class="wizard-input-field">
          </div>
          <div class="wizard-input-group" style="margin: 0;">
            <label for="sllc_member_city_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">City <span style="color: #ef4444;">*</span></label>
            <input type="text" id="sllc_member_city_1" required placeholder="City" class="wizard-input-field">
          </div>
          <div class="wizard-input-group" style="margin: 0;">
            <label for="sllc_member_state_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">State <span style="color: #ef4444;">*</span></label>
            <select id="sllc_member_state_1" required class="wizard-input-field" style="font-weight: 600;">
              \${resolvedStateOptions}
            </select>
          </div>
          <div class="wizard-input-group" style="margin: 0;">
            <label for="sllc_member_zip_1" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Zip Code <span style="color: #ef4444;">*</span></label>
            <input type="text" id="sllc_member_zip_1" required placeholder="ZIP code" style="font-family: monospace;" class="wizard-input-field">
          </div>
        </div>
      </div>
      <button type="button" onclick="appendNewSeriesLlcMemberNode()" style="margin-top: 12px; background: transparent; border: 1px dashed var(--primary); color: var(--primary); font-weight: 700; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; width: fit-content;">
        <i class="fa-solid fa-plus"></i> Add Additional Member
      </button>
    </div>
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Initial Sub-Series Cells Registry</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_form_series_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you initially be forming any distinct series cells under this LLC? <span style="color: #ef4444;">*</span></label>
      <select id="sllc_form_series_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSeriesCellsWrapperVisibility(this.value)">
        <option value="no" selected>No, establish master umbrella structure only</option>
        <option value="yes">Yes, establish initial distinct series cells/cells registry</option>
      </select>
    </div>
    <div id="sllc_cells_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">
      <div id="sllc_cells_container" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        <div class="member-record-card" id="sllc_cell_card_1" style="background: #ffffff; border: 1px solid var(--border); padding: 14px; border-radius: 8px; box-sizing: border-box;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Initial Sub-Series Cell #1</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
            <div>
              <label for="sllc_cell_name_1" style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--navy); margin-bottom: 4px;">Cell Legal Name Target</label>
              <input type="text" id="sllc_cell_name_1" placeholder="Series Cell Name (e.g. Series A Real Estate)" class="wizard-input-field">
            </div>
            <div>
              <label for="sllc_cell_desc_1" style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--navy); margin-bottom: 4px;">Cell Functional Objective</label>
              <input type="text" id="sllc_cell_desc_1" placeholder="Asset / Operational Purpose Summary" class="wizard-input-field">
            </div>
          </div>
        </div>
      </div>
      <button type="button" onclick="appendNewSubSeriesCellNode()" style="background: transparent; border: 1px dashed var(--primary); color: var(--primary); font-weight: 700; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; width: fit-content;">
        <i class="fa-solid fa-plus"></i> Add Additional Series Cell
      </button>
    </div>
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Tax Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_ein_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you be applying for an Employer Identification Number (EIN)? <span style="color: #ef4444;">*</span></label>
      <select id="sllc_ein_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSeriesEinWorkflow(this.value)">
        <option value="no" selected>No, I already hold or will apply for EIN structures independently</option>
        <option value="yes">Yes, add Filings4u Master EIN Procurement Service â€” $\${liveEinFee}</option>
      </select>
    </div>
    <div id="sllc_ein_reason_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
      <label for="sllc_ein_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Reason for obtaining an EIN <span style="color: #ef4444;">*</span></label>
      <input type="text" id="sllc_ein_reason" placeholder="e.g. Opening an operational corporate bank account..." class="wizard-input-field">
    </div>
  `;
}

// ============================================================================ //
// ðŸ›ï¸ SERIES LLC MASTER LAYOUT COMPILER & PART 3 VALIDATION MATRIX              //
// ============================================================================ //

function buildSeriesLlcFieldsLayoutHtml() {
  const resolvedStateOptions = typeof getUsaStatesHtml === "function" ? getUsaStatesHtml(window.selectedFormationStateCode || "") : '<option value="">Select State...</option>';
  const p1 = typeof window.buildSeriesLlcPart1 === "function" ? window.buildSeriesLlcPart1() : "";
  const p2a = typeof window.buildSeriesLlcPart2A === "function" ? window.buildSeriesLlcPart2A(resolvedStateOptions) : "";
  const p2b = typeof window.buildSeriesLlcPart2B === "function" ? window.buildSeriesLlcPart2B(resolvedStateOptions) : "";
  return p1 + p2a + p2b;
}

window.buildSeriesLlcFieldsLayoutHtml = buildSeriesLlcFieldsLayoutHtml;

var seriesLlcPart3Validation = {
  requiredFields: [
    { id: 'sllc_license_check', msg: 'Please answer if you have verified localized licenses.' },
    { id: 'sllc_duration_choice', msg: 'Filing Operational Lifespan Horizon selection is required.' }
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

    // 1. Process mandatory selection choices
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) {
          setError(el, field.msg);
        } else {
          clearError(el);
        }
      }
    });

    // 2. Conditional Check: Enforce Expiration Date for Temporary Term selections
    const durationChoice = document.getElementById("sllc_duration_choice");
    if (durationChoice && durationChoice.value === "project" && (durationChoice.offsetWidth > 0 || durationChoice.offsetHeight > 0)) {
      const dateEl = document.getElementById("sllc_expiration_date");
      if (dateEl) {
        if (!dateEl.value) {
          setError(dateEl, "Please specify an expected expiration / dissolution date for project-based lifespans.");
        } else {
          clearError(dateEl);
        }
      }
    }

    return { isValid, errors };
  }
};

window.seriesLlcPart3Validation = seriesLlcPart3Validation;


// Part 2: HTML Component Structural Output Definition (Designs Untouched)
function buildSeriesLlcPart3() {
  // DYNAMIC FIX: Query the registry database programmatically to find current license audit pricing rather than hardcoding static "$125.00" string text.
  const centralRegistrySource = window.CENTRAL_ADDON_DB || window.UPSELL_ADDON_REGISTRY || {};
  const licenseMetaRecord = centralRegistrySource["customSelectedLicenseAuditSuiteActive"] || {};
  const liveLicenseFee = parseFloat(licenseMetaRecord.price || 125.00).toFixed(2);

  return `
    <!-- SECTION 6: COMPLIANCE AND LICENSES -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Compliance and Licenses</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_license_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have you verified the necessary localized business licenses or permits? <span style="color: #ef4444;">*</span></label>
      <select id="sllc_license_check" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSeriesLicenseWorkflow(this.value)">
        <option value="yes" selected>Yes, I have verified my structural compliance tracks</option>
        <option value="no">No, I need help â€” Add Filings4u License &amp; Permit Audit Suite â€” $${liveLicenseFee}</option>
      </select>
      <div class="wizard-error-message" id="err_sllc_license_check" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div id="sllc_custom_license_wrapper" style="grid-column: span 2; display: flex; flex-direction: column; gap: 8px;">
      <label for="sllc_intended_licenses" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">List Intended Licenses / Permits to Apply For</label>
      <textarea id="sllc_intended_licenses" placeholder="Provide general targets: e.g. State Sales Tax License, Municipal Operating Permits..." rows="2" class="wizard-input-field" style="font-family: inherit; resize: vertical; padding: 14px;"></textarea>
    </div>

    <!-- SECTION 7: DURATION OF OPERATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Duration of Operation</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_duration_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Filing Operational Lifespan Horizon <span style="color: #ef4444;">*</span></label>
      <select id="sllc_duration_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleSeriesLlcDurationField(this.value)">
        <option value="ongoing" selected>Ongoing Operations (Perpetual corporate horizon)</option>
        <option value="project">Project-Based (Defined/temporary operational threshold)</option>
      </select>
      <div class="wizard-error-message" id="err_sllc_duration_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div id="sllc_duration_term_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
      <label for="sllc_expiration_date" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Specify Expected Expiration / Dissolution Date <span style="color: #ef4444;">*</span></label>
      <input type="date" id="sllc_expiration_date" class="wizard-input-field" style="font-weight: 600;">
      <div class="wizard-error-message" id="err_sllc_expiration_date" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <!-- SECTION 8: ADDITIONAL PROVISIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">8. Additional Provisions (Optional)</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="sllc_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Conditions / Operating Clauses</label>
      <textarea id="sllc_provisions" placeholder="Detail any extra organizational parameters, series limitation statements, or specific distribution terms..." rows="3" class="wizard-input-field" style="font-family: inherit; resize: vertical; padding: 14px;"></textarea>
    </div>
  `;
}

window.buildSeriesLlcPart3 = buildSeriesLlcPart3;

// Part 3: Master Assembly Stitch Layers (Designs Untouched)
function buildSeriesLlcFieldsLayoutHtml() {
  const resolvedStateOptions = typeof getUsaStatesHtml === "function" ? getUsaStatesHtml(window.selectedFormationStateCode || "") : '<option value="">Select State...</option>';
  const p1 = typeof window.buildSeriesLlcPart1 === "function" ? window.buildSeriesLlcPart1() : "";
  const p2a = typeof window.buildSeriesLlcPart2A === "function" ? window.buildSeriesLlcPart2A(resolvedStateOptions) : "";
  const p2b = typeof window.buildSeriesLlcPart2B === "function" ? window.buildSeriesLlcPart2B(resolvedStateOptions) : "";
  const p3 = typeof window.buildSeriesLlcPart3 === "function" ? window.buildSeriesLlcPart3() : "";
  return p1 + p2a + p2b + p3;
}

function buildSeriesLlcRegistrationFieldsLayoutHtml() {
  const stateDropdownOptionsHtml = typeof getUsaStatesHtml === "function" ? getUsaStatesHtml(window.selectedFormationStateCode || "") : '<option value="">Select State...</option>';
  const p1 = typeof window.buildSeriesLlcPart1 === "function" ? window.buildSeriesLlcPart1() : "";
  const p2a = typeof window.buildSeriesLlcPart2A === "function" ? window.buildSeriesLlcPart2A(stateDropdownOptionsHtml) : "";
  const p2b = typeof window.buildSeriesLlcPart2B === "function" ? window.buildSeriesLlcPart2B(stateDropdownOptionsHtml) : "";
  const p3 = typeof window.buildSeriesLlcPart3 === "function" ? window.buildSeriesLlcPart3() : "";
  return p1 + p2a + p2b + p3;
}

window.buildSeriesLlcFieldsLayoutHtml = buildSeriesLlcFieldsLayoutHtml;
window.buildSeriesLlcRegistrationFieldsLayoutHtml = buildSeriesLlcRegistrationFieldsLayoutHtml;


