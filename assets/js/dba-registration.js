// ============================================================================ //
// ðŸ›ï¸ FAMILY 33A: DBA REGISTRATION UNIFIED WIZARD ENGINE                        //
// ============================================================================ //
function initDbaRegistrationService() {
  // Global wizard registries allocation
  window.formRegistry = window.formRegistry || {};

  // ============================================================================ //
  // ðŸ“‹ PART 1: DBA REGISTRATION VALIDATION MATRIX ENGINE                         //
  // ============================================================================ //
  window.formRegistry['dba-registration-part1-validation'] = {
    requiredFields: [
      { id: 'dba_proposed_name', msg: 'Proposed DBA Name is required.' },
      { id: 'dba_business_purpose', msg: 'Business Purpose description is required.' },
      { id: 'dba_bus_street', msg: 'Business Location Street Address is required (P.O. Boxes prohibited).' },
      { id: 'dba_bus_city', msg: 'Business City parameter is required.' },
      { id: 'dba_bus_state', msg: 'Business State code selection is required.' },
      { id: 'dba_bus_zip', msg: 'Business Zip Code is required.' }
    ],
    validateStep: function() {
      let isValid = true;
      let errors = [];

      const setError = (el, msg) => {
        if (!el) return;
        isValid = false;
        el.style.setProperty("border", "1px solid #ef4444", "important");
        if (!errors.includes(msg)) errors.push(msg);
        
        const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1')?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.textContent = msg;
          errorMsgNode.style.setProperty("display", "block", "important");
        }
      };

      const clearError = (el) => {
        if (!el) return;
        el.style.removeProperty("border");
        const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1')?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.style.setProperty("display", "none", "important");
          errorMsgNode.textContent = "";
        }
      };

      // 1. Check Required Status First
      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        
        if (!el || !(el.offsetWidth > 0 || el.offsetHeight > 0)) {
          if (el) clearError(el);
          return;
        }

        const currentVal = el.value ? String(el.value).trim() : "";

        if (!currentVal) {
          setError(el, field.msg);
        } else {
          clearError(el);
        }
      });

      // 2. Format & Pattern Checks (Only runs if element is visible and not already failing required check)
      const streetEl = document.getElementById('dba_bus_street');
      if (streetEl && (streetEl.offsetWidth > 0 || streetEl.offsetHeight > 0) && streetEl.value.trim() !== "") {
        const poBoxRegex = /\b(p[-.]?o[-.]?\s*box|post\s+office\s+box)\b/i;
        if (poBoxRegex.test(streetEl.value)) {
          setError(streetEl, 'P.O. Boxes are prohibited for the physical business location.');
        }
      }

      const stateEl = document.getElementById('dba_bus_state');
      if (stateEl && (stateEl.offsetWidth > 0 || stateEl.offsetHeight > 0) && stateEl.value.trim() !== "") {
        if (!/^[a-zA-Z]{2}$/.test(stateEl.value.trim())) {
          setError(stateEl, 'State code must consist of exactly 2 alphabetical letters (e.g. TX).');
        }
      }

      const zipEl = document.getElementById('dba_bus_zip');
      if (zipEl && (zipEl.offsetWidth > 0 || zipEl.offsetHeight > 0) && zipEl.value.trim() !== "") {
        if (!/^\d{5}$/.test(zipEl.value.trim())) {
          setError(zipEl, 'Zip Code must consist of exactly 5 numeric digits.');
        }
      }

      return { isValid, errors };
    }
  };

// ============================================================================ //
// ðŸ“‹ PART 2: DBA REGISTRATION VALIDATION MATRIX ENGINE                         //
// ============================================================================ //
window.formRegistry['dba-registration-part2-validation'] = {
  requiredFields: [
    { id: 'dba_owner_name', msg: "Owner's Full Legal Name is required." },
    { id: 'dba_owner_phone', msg: "Owner's Contact Phone Number is required." },
    { id: 'dba_owner_email', msg: "Owner's Administrative Email Address is required." },
    { id: 'dba_owner_street', msg: "Owner's Residential Street Address is required." },
    { id: 'dba_owner_city', msg: "Owner's Residential City is required." },
    { id: 'dba_owner_state', msg: "Owner's Residential State code is required." },
    { id: 'dba_owner_zip', msg: "Owner's Residential Zip Code is required." }
  ],
  validateStep: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);
      
      // Fixed: Scopes locally to the element's specific grid/column container to safeguard side-by-side elements
      const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1, .col-md-6')?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");
      const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1, .col-md-6')?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    // 1. Evaluate Required Rule Layer First
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      
      // If element is hidden by conditional rules, drop old errors and move past it
      if (!el || !(el.offsetWidth > 0 || el.offsetHeight > 0)) {
        if (el) clearError(el);
        return;
      }

      const currentVal = el.value ? String(el.value).trim() : "";

      if (!currentVal) {
        setError(el, field.msg);
      } else {
        clearError(el);
      }
    });

    // 2. Evaluate Formats & Complex Regex Validations
    const stateEl = document.getElementById('dba_owner_state');
    if (stateEl && (stateEl.offsetWidth > 0 || stateEl.offsetHeight > 0) && stateEl.value.trim() !== "") {
      if (!/^[a-zA-Z]{2}$/.test(stateEl.value.trim())) {
        setError(stateEl, 'State code must consist of exactly 2 alphabetical letters (e.g. TX).');
      }
    }

    const zipEl = document.getElementById('dba_owner_zip');
    if (zipEl && (zipEl.offsetWidth > 0 || zipEl.offsetHeight > 0) && zipEl.value.trim() !== "") {
      if (!/^\d{5}$/.test(zipEl.value.trim())) {
        setError(zipEl, 'Zip Code must consist of exactly 5 numeric digits.');
      }
    }

    const emailEl = document.getElementById("dba_owner_email");
    if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0) && emailEl.value.trim() !== "") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailEl.value.trim())) {
        setError(emailEl, "Please provide a valid administrative owner email pattern (e.g. name@domain.com).");
      }
    }

    const phoneEl = document.getElementById("dba_owner_phone");
    if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0) && phoneEl.value.trim() !== "") {
      const digits = phoneEl.value.replace(/\D/g, "");
      if (digits.length < 10) {
        setError(phoneEl, "Owner's Contact Number must contain at least 10 active numerical digits.");
      }
    }

    return { isValid, errors };
  }
};

// ============================================================================ //
// ðŸ“‹ PART 3: DBA REGISTRATION VALIDATION MATRIX ENGINE                         //
// ============================================================================ //
window.formRegistry['dba-registration-part3-validation'] = {
  validateStep: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);
      
      const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1, .col-md-6')?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");
      const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1, .col-md-6')?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    // Safely evaluate both potential conditional trigger elements independently
    const collisionCheckEl = document.getElementById("dba_collision_check");
    const permissionToggleEl = document.getElementById("dba_permission_toggle");
    const consentSelect = document.getElementById("dba_has_consent");

    let requiresConsent = false;

    // Verify if either driver element is active and set to affirmative trigger value
    if (collisionCheckEl && (collisionCheckEl.offsetWidth > 0 || collisionCheckEl.offsetHeight > 0) && collisionCheckEl.value === "yes") {
      requiresConsent = true;
    }
    if (permissionToggleEl && (permissionToggleEl.offsetWidth > 0 || permissionToggleEl.offsetHeight > 0) && permissionToggleEl.value === "yes") {
      requiresConsent = true;
    }

    // Process dependent element state validation
    if (consentSelect) {
      if (requiresConsent && (consentSelect.offsetWidth > 0 || consentSelect.offsetHeight > 0)) {
        const consentVal = consentSelect.value ? String(consentSelect.value).trim() : "";
        if (!consentVal) {
          setError(consentSelect, "Please specify if you hold executed written permission credentials to register this name variant.");
        } else {
          clearError(consentSelect);
        }
      } else {
        // Essential: Clear errors if the parent conditions shift or field hides away
        clearError(consentSelect);
      }
    }

    return { isValid, errors };
  }
};


// Step 1: Initialize the layout tracking array function assignment
window.formRegistry['dba-registration-part1-layout'] = function(stateDropdownOptionsHtml = "") {
  
  // Safe helper function to toggle text input or custom dropdown options
  const stateFieldHtml = (id, placeholder) => stateDropdownOptionsHtml ? 
    `<select id="${id}" required class="wizard-input-field" style="font-weight: 600;">
       <option value="" disabled selected>Select State</option>
       ${stateDropdownOptionsHtml}
     </select>` : 
    `<input type="text" id="${id}" required placeholder="${placeholder}" maxlength="2" class="wizard-input-field">`;

  // Start with an empty base string variable to allow safe multi-block code building
  let layoutHtml = "";

  // Append Section 1: Business Information fields safely
  layoutHtml += `
    <!-- SECTION 1: BUSINESS INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 12px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Business Information</h3>
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_proposed_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Proposed DBA Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dba_proposed_name" required placeholder="Fictitious trade name under which business will operate" class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_proposed_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      <span style="font-size: 0.7rem; color: var(--slate); font-weight: 500; padding-left: 2px;">Ensure your chosen trade name complies with state regulations.</span>
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_business_purpose" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Purpose <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dba_business_purpose" required placeholder="Brief description of what the business will do..." class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_business_purpose" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_bus_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Location Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dba_bus_street" required placeholder="123 Main St" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'dba_bus')">
      <div class="wizard-error-message" id="err_dba_bus_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_bus_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dba_bus_city" required placeholder="Austin" class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_bus_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <!-- FIXED GRID WRAPPERS: Isolates error node elements completely to preserve side-by-side spacing structure -->
    <div style="grid-column: span 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="display: flex; flex-direction: column;">
        <div class="form-group col-span-1 wizard-input-group" style="margin:0; width: 100%;">
          <label for="dba_bus_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
          ${stateFieldHtml('dba_bus_state', 'TX')}
        </div>
        <div class="wizard-error-message" id="err_dba_bus_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      
      <div style="display: flex; flex-direction: column;">
        <div class="form-group col-span-1 wizard-input-group" style="margin:0; width: 100%;">
          <label for="dba_bus_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
          <input type="text" id="dba_bus_zip" required placeholder="78701" class="wizard-input-field">
        </div>
        <div class="wizard-error-message" id="err_dba_bus_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;

  // Append Section 2: Owner Information fields safely
  layoutHtml += `
    <!-- SECTION 2: OWNER INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Owner Information</h3>
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_owner_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Full Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dba_owner_name" required placeholder="Full Legal Name" class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_owner_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_owner_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Contact Number <span style="color: #ef4444;">*</span></label>
      <input type="tel" id="dba_owner_phone" required placeholder="(512) 555-0199" style="font-family: monospace;" class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_owner_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_owner_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Email Address <span style="color: #ef4444;">*</span></label>
      <input type="email" id="dba_owner_email" required placeholder="owner@domain.com" class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_owner_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_owner_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's Residential Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dba_owner_street" required placeholder="789 Residential Blvd" class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_owner_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_owner_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Owner's City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dba_owner_city" required placeholder="Austin" class="wizard-input-field">
      <div class="wizard-error-message" id="err_dba_owner_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <!-- FIXED GRID WRAPPERS: Isolates error node elements completely to preserve side-by-side spacing structure -->
    <div style="grid-column: span 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="display: flex; flex-direction: column;">
        <div class="form-group col-span-1 wizard-input-group" style="margin:0; width: 100%;">
          <label for="dba_owner_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
          ${stateFieldHtml('dba_owner_state', 'TX')}
        </div>
        <div class="wizard-error-message" id="err_dba_owner_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      
      <div style="display: flex; flex-direction: column;">
        <div class="form-group col-span-1 wizard-input-group" style="margin:0; width: 100%;">
          <label for="dba_owner_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
          <input type="text" id="dba_owner_zip" required placeholder="78701" class="wizard-input-field">
        </div>
        <div class="wizard-error-message" id="err_dba_owner_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;

   // Append Section 3 & 4 fields, then finalize the unified layout payload
  layoutHtml += `
    <!-- SECTION 3: EXISTING BUSINESS INFORMATION (IF APPLICABLE) -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Existing Business Information (If Applicable)</h3>
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_exist_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Current Legal Business Name</label>
      <input type="text" id="dba_exist_legal_name" placeholder="Leave blank if registering as an individual" class="wizard-input-field">
    </div>
    
    <div class="form-group col-span-1 wizard-input-group">
      <label for="dba_exist_structure" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Current Legal Business Structure</label>
      <select id="dba_exist_structure" class="wizard-input-field" style="font-weight: 600;">
        <option value="none" selected>No parent structure (Individual / Sole Proprietorship)</option>
        <option value="llc">Limited Liability Company (LLC)</option>
        <option value="corporation">Corporation (C-Corp / S-Corp)</option>
        <option value="partnership">Partnership</option>
      </select>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_exist_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Current Business Street Address</label>
      <input type="text" id="dba_exist_street" placeholder="123 Corporate Pkwy, Suite 100" class="wizard-input-field">
    </div>

    <!-- SECTION 4: DBA DETAILS & CONFIRMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. DBA Details &amp; Name Search</h3>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_collision_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Is this DBA name already registered by another entity? <span style="color: #ef4444;">*</span></label>
      <select id="dba_collision_check" required class="wizard-input-field" style="font-weight: 600;">
        <option value="no" selected>No, name is completely available / original</option>
        <option value="yes">Yes, name is registered by another entity</option>
      </select>
      <div class="wizard-error-message" id="err_dba_collision_check" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <!-- Conditional Wrapper Group Block -->
    <div id="dba_permission_matrix_wrapper" style="grid-column: span 2; background: var(--light-bg); padding: 20px; border-radius: 8px; border: 1px dashed #cbd5e1; box-sizing: border-box; display: none; flex-direction: column; gap: 14px;">
      <div class="form-group col-span-2 wizard-input-group" style="margin: 0;">
        <label for="dba_has_consent" style="font-weight: 700; font-size: 0.82rem; color: var(--navy);">Have you obtained written permission from the original entity? <span style="color: #ef4444;">*</span></label>
        <select id="dba_has_consent" class="wizard-input-field" style="background: #ffffff; font-weight: 600;">
          <option value="yes" selected>Yes, I have executed written permission files ready to upload</option>
          <option value="no-buy">No, add Filings4u Comprehensive Name Availability Search â€” $79.00</option>
        </select>
        <div class="wizard-error-message" id="err_dba_has_consent" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;

  // Safely concatenate secondary optional modules and return string data to the main execution engine
  return layoutHtml + (typeof window.formRegistry['sole-prop-part2-layout'] === "function" ? window.formRegistry['sole-prop-part2-layout']() : "");
};

// ============================================================================ //
// ðŸ“‹ PART 1: UPDATE - DBA REGISTRATION PART 2 VALIDATION ENGINE                //
// ============================================================================ //
window.formRegistry['dba-registration-part2-validation'] = {
  requiredFields: [
    { id: 'dba_ein_choice', msg: 'Please select an option for your Employer Identification Number (EIN).' },
    { id: 'dba_license_check', msg: 'Please verify if you have checked localized business licenses.' },
    { id: 'dba_duration_choice', msg: 'Please specify if this trade name operational model is temporary or ongoing.' }
  ],
  validateStep: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => {
      if (!el) return;
      isValid = false;
      el.style.setProperty("border", "1px solid #ef4444", "important");
      if (!errors.includes(msg)) errors.push(msg);
      
      const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1, .col-md-6')?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.textContent = msg;
        errorMsgNode.style.setProperty("display", "block", "important");
      }
    };

    const clearError = (el) => {
      if (!el) return;
      el.style.removeProperty("border");
      const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.form-group, .col-span-1, .col-md-6')?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
    };

    // 1. Process standard layout validation loop
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (!el || !(el.offsetWidth > 0 || el.offsetHeight > 0)) {
        if (el) clearError(el);
        return;
      }

      const currentVal = el.value ? String(el.value).trim() : "";
      if (!currentVal) {
        setError(el, field.msg);
      } else {
        clearError(el);
      }
    });

    // 2. Conditional Check: Validate EIN Reason input box if selection matches YES
    const einChoice = document.getElementById("dba_ein_choice");
    const reasonEl = document.getElementById("dba_ein_reason");
    
    if (reasonEl) {
      if (einChoice && einChoice.value === "yes" && (einChoice.offsetWidth > 0 || einChoice.offsetHeight > 0) && (reasonEl.offsetWidth > 0 || reasonEl.offsetHeight > 0)) {
        const reasonVal = reasonEl.value ? String(reasonEl.value).trim() : "";
        if (!reasonVal) {
          setError(reasonEl, "Reason for obtaining an EIN is required.");
        } else {
          clearError(reasonEl);
        }
      } else {
        clearError(reasonEl); // Clear previous error states if hidden or unselected
      }
    }

    // 3. Conditional Check: Validate Expiration Date field if duration matches TEMPORARY
    const durationChoice = document.getElementById("dba_duration_choice");
    const dateEl = document.getElementById("dba_expiration_date");
    
    if (dateEl) {
      if (durationChoice && durationChoice.value === "temporary" && (durationChoice.offsetWidth > 0 || durationChoice.offsetHeight > 0) && (dateEl.offsetWidth > 0 || dateEl.offsetHeight > 0)) {
        const dateVal = dateEl.value ? String(dateEl.value).trim() : "";
        if (!dateVal) {
          setError(dateEl, "Specify Expiration Date is required.");
        } else {
          // Verify valid calendar date string formatting pattern
          const parsedTimestamp = Date.parse(dateVal);
          if (isNaN(parsedTimestamp)) {
            setError(dateEl, "Please provide a valid chronological expiration date format.");
          } else {
            clearError(dateEl);
          }
        }
      } else {
        clearError(dateEl); // Clear previous error states if hidden or unselected
      }
    }

    return { isValid, errors };
  }
};

// ============================================================================ //
// ðŸ“ PART 2: UPDATE - DBA REGISTRATION PART 2 UI LAYOUT ENGINE                //
// ============================================================================ //
// Continued Part 4 Layout Allocation: Tax, Compliance, Provisions, and Duration
layoutHtml += `
    <!-- SECTION 5: TAX INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Tax Information</h3>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_ein_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you be applying for an Employer Identification Number (EIN)? <span style="color: #ef4444;">*</span></label>
      <select id="dba_ein_choice" required class="wizard-input-field" style="font-weight: 600;">
        <option value="no" selected>No, I do not require a Federal EIN at this time</option>
        <option value="yes">Yes, I want to procure an EIN record</option>
      </select>
      <div class="wizard-error-message" id="err_dba_ein_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <!-- GRID WRAPPER SHIELD: Keeps flex toggles from breaking the form matrix -->
    <div style="grid-column: span 2;">
      <div id="dba_ein_reason_wrapper" style="display: none; flex-direction: column; gap: 8px; width: 100%;">
        <div class="form-group col-span-2 wizard-input-group" style="margin: 0;">
          <label for="dba_ein_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Reason for obtaining an EIN <span style="color: #ef4444;">*</span></label>
          <input type="text" id="dba_ein_reason" placeholder="e.g., Hiring employees, opening a business banking line..." class="wizard-input-field">
          <div class="wizard-error-message" id="err_dba_ein_reason" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>
    </div>

    <!-- SECTION 6: COMPLIANCE AND LICENSES -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Compliance and Licenses</h3>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_license_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have you verified the necessary localized business licenses or permits? <span style="color: #ef4444;">*</span></label>
      <select id="dba_license_check" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Choose an option...</option>
        <option value="yes">Yes, I have verified my structural requirements</option>
        <option value="no">No, I need help â€” Add Filings4u Compliance Research Suite â€” $79.00</option>
      </select>
      <div class="wizard-error-message" id="err_dba_license_check" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <!-- GRID WRAPPER SHIELD: Keeps flex toggles from breaking the form matrix -->
    <div style="grid-column: span 2;">
      <div id="dba_custom_license_wrapper" style="display: none; flex-direction: column; gap: 8px; width: 100%;">
        <div class="form-group col-span-2 wizard-input-group" style="margin: 0;">
          <label for="dba_intended_licenses" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">List Intentional Licenses / Permits to Apply For</label>
          <textarea id="dba_intended_licenses" placeholder="Provide general targets: e.g. Municipal Sales Tax Permit, Local Health Department Authorization..." rows="2" class="wizard-input-field" style="font-family: inherit; resize: vertical; padding: 14px;"></textarea>
          <div class="wizard-error-message" id="err_dba_intended_licenses" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>
    </div>

    <!-- SECTION 7: ADDITIONAL PROVISIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Additional Provisions (Optional)</h3>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">DBA Special Clauses or Understandings</label>
      <textarea id="dba_provisions" placeholder="Detail any extra terms or agreements relevant to your DBA registration..." rows="3" class="wizard-input-field" style="font-family: inherit; resize: vertical; padding: 14px;"></textarea>
    </div>

    <!-- SECTION 8: DURATION OF DBA -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">8. Duration of DBA</h3>
    </div>
    
    <div class="form-group col-span-2 wizard-input-group" style="grid-column: span 2;">
      <label for="dba_duration_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will this DBA be temporary or ongoing? <span style="color: #ef4444;">*</span></label>
      <select id="dba_duration_choice" required class="wizard-input-field" style="font-weight: 600;">
        <option value="perpetual" selected>Perpetual (Ongoing baseline trade presence status)</option>
        <option value="temporary">Temporary / Specified Term</option>
      </select>
      <div class="wizard-error-message" id="err_dba_duration_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    
    <!-- GRID WRAPPER SHIELD: Keeps flex toggles from breaking the form matrix -->
    <div style="grid-column: span 2;">
      <div id="dba_duration_term_wrapper" style="display: none; flex-direction: column; gap: 8px; width: 100%;">
        <div class="form-group col-span-2 wizard-input-group" style="margin: 0;">
          <label for="dba_expiration_date" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Specify Expiration Date <span style="color: #ef4444;">*</span></label>
          <input type="date" id="dba_expiration_date" class="wizard-input-field" style="font-weight: 600;">
          <div class="wizard-error-message" id="err_dba_expiration_date" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>
    </div>
  `;

  // Safe termination block
  return layoutHtml;
};

// ============================================================================ //
// ðŸŽ® PART 3: DBA INTERACTIVE INTERFACE CONTROLLER EXTENSIONS                  //
// ============================================================================ //

// 1. Handle name conflict permission visibility rules
function toggleDbaPermissionWorkflow(value) {
  const permWrapper = document.getElementById("dba_permission_matrix_wrapper");
  const consentSelect = document.getElementById("dba_has_consent");
  if (!permWrapper) return;

  if (value === "yes") {
    // FIXED: Keeps block container structure to protect parent layout cells
    permWrapper.style.setProperty("display", "block", "important");
    if (consentSelect) consentSelect.setAttribute("required", "required");
  } else {
    permWrapper.style.setProperty("display", "none", "important");
    if (consentSelect) {
      consentSelect.removeAttribute("required");
      consentSelect.value = ""; // FIXED: Resets value completely to prevent data corruption
    }
    window.customSelectedDbaSearchProcurementActive = false;
  }
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
    window.updateDynamicPricingMatrixVanilla();
  }
}

// 2. Handle availability search selection rules
function toggleDbaSearchProcurement(value) {
  window.customSelectedDbaSearchProcurementActive = (value === "no-buy");
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
    window.updateDynamicPricingMatrixVanilla();
  }
}

// 3. Handle federal tax ID input box rules
function toggleDbaEinReasonField(value) {
  const einWrapper = document.getElementById("dba_ein_reason_wrapper");
  const einInput = document.getElementById("dba_ein_reason");
  if (!einWrapper) return;

  if (value === "yes") {
    // FIXED: Keeps block container structure to protect parent layout cells
    einWrapper.style.setProperty("display", "block", "important");
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
}

// 4. Handle compliance permit options visibility rules
function toggleDbaLicenseWorkflow(value) {
  const licWrapper = document.getElementById("dba_custom_license_wrapper");
  if (!licWrapper) return;

  if (value === "yes") {
    // FIXED: Keeps block container structure to protect parent layout cells
    licWrapper.style.setProperty("display", "block", "important");
    window.customSelectedLicenseAuditSuiteActive = false;
  } else {
    licWrapper.style.setProperty("display", "none", "important");
    licWrapper.querySelectorAll("textarea").forEach(el => el.value = "");
    window.customSelectedLicenseAuditSuiteActive = (value === "no");
  }
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
    window.updateDynamicPricingMatrixVanilla();
  }
}

// 5. Handle temporal duration date pickers visibility rules
function toggleDbaDurationField(value) {
  const dateWrapper = document.getElementById("dba_duration_term_wrapper");
  const dateInput = document.getElementById("dba_expiration_date");
  if (!dateWrapper) return;

  if (value === "temporary") {
    // FIXED: Keeps block container structure to protect parent layout cells
    dateWrapper.style.setProperty("display", "block", "important");
    if (dateInput) dateInput.setAttribute("required", "required");
  } else {
    dateWrapper.style.setProperty("display", "none", "important");
    if (dateInput) {
      dateInput.removeAttribute("required");
      dateInput.value = "";
    }
  }
  // FIXED: Added missing tracking call to refresh state totals across form mutations
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
    window.updateDynamicPricingMatrixVanilla();
  }
}

// Map local control variables explicitly to the global window runtime structure
window.toggleDbaPermissionWorkflow = toggleDbaPermissionWorkflow;
window.toggleDbaSearchProcurement = toggleDbaSearchProcurement;
window.toggleDbaEinReasonField = toggleDbaEinReasonField;
window.toggleDbaLicenseWorkflow = toggleDbaLicenseWorkflow;
window.toggleDbaDurationField = toggleDbaDurationField;
// ============================================================================ //
// ðŸ PART 4: MASTER VALIDATION INTERCEPTOR HOOK                                //
// ============================================================================ //
/**
 * filings4u, LLC - Master DBA Validation Interceptor Hook
 * Chains internal checker methods directly into the master page navigation suite.
 * @returns {boolean} Status report signaling clean parameter validation.
 */
function validateEntireDbaRegistrationWizard() {
  console.log("[Validation Suite] Running master validation sweep inside dba-registration.js...");
  let finalOutcome = true;

  // Validate Part 1
  if (window.formRegistry['dba-registration-part1-validation'] && typeof window.formRegistry['dba-registration-part1-validation'].validateStep === "function") {
    const part1Outcome = window.formRegistry['dba-registration-part1-validation'].validateStep();
    if (!part1Outcome.isValid) finalOutcome = false;
  }

  // Validate Part 2
  if (window.formRegistry['dba-registration-part2-validation'] && typeof window.formRegistry['dba-registration-part2-validation'].validateStep === "function") {
    const part2Outcome = window.formRegistry['dba-registration-part2-validation'].validateStep();
    if (!part2Outcome.isValid) finalOutcome = false;
  }

  // Validate Part 3
  if (window.formRegistry['dba-registration-part3-validation'] && typeof window.formRegistry['dba-registration-part3-validation'].validateStep === "function") {
    const part3Outcome = window.formRegistry['dba-registration-part3-validation'].validateStep();
    if (!part3Outcome.isValid) finalOutcome = false;
  }

  const globalAlertBanner = document.getElementById("wizard-global-validation-alert");
  if (globalAlertBanner) {
    globalAlertBanner.style.display = finalOutcome ? "none" : "block";
    if (!finalOutcome) {
      globalAlertBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Action Required: Please correct fields highlighted in red to advance.`;
    }
  }
  return finalOutcome;
}

window.validateEntireDbaRegistrationWizard = validateEntireDbaRegistrationWizard;
window.validateDbaWizard = validateEntireDbaRegistrationWizard;

// Master Render System Allocation
window.formRegistry['dba-registration-form-master'] = function(stateDropdownOptionsHtml = "") {
  // FIXED: Accesses the singular layout engine function passing all necessary state context downstream
  if (typeof window.formRegistry['dba-registration-part1-layout'] === "function") {
    return window.formRegistry['dba-registration-part1-layout'](stateDropdownOptionsHtml);
  }
  return "";
};

// ============================================================================ //
// ðŸ› ï¸ AUTOMATED INTERACTIVE BINDING INITIALIZER ROUTINE                         //
// ============================================================================ //
function bindDbaInteractiveEventListeners() {
  document.addEventListener("change", function(event) {
    const targetId = event.target && event.target.id;
    if (!targetId) return;

    if (targetId === "dba_collision_check") {
      window.toggleDbaPermissionWorkflow(event.target.value);
    }
    if (targetId === "dba_has_consent") {
      window.toggleDbaSearchProcurement(event.target.value);
    }
    if (targetId === "dba_ein_choice") {
      window.toggleDbaEinReasonField(event.target.value);
    }
    if (targetId === "dba_license_check") {
      window.toggleDbaLicenseWorkflow(event.target.value);
    }
    if (targetId === "dba_duration_choice") {
      window.toggleDbaDurationField(event.target.value);
    }
  });
}

// Automatically register interaction layers alongside parent component initiation
bindDbaInteractiveEventListeners();

