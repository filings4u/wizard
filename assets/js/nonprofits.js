// ============================================================================ //
// ðŸ› ï¸ NONPROFIT PART 1 VALIDATION MATRIX ENGINE                                 //
// ============================================================================ //

var nonprofitPart1Validation = {
  requiredFields: [
    { id: 'np_proposed_name', msg: 'Proposed Nonprofit Name is required.' },
    { id: 'np_mission_statement', msg: 'Mission Statement is required.' },
    { id: 'np_principal_street', msg: 'Principal Location Street Address is required.' },
    { id: 'np_principal_city', msg: 'Principal Location City is required.' },
    { id: 'np_principal_state', msg: 'Principal Location State selection is required.' },
    { id: 'np_principal_zip', msg: 'Principal Location Zip Code is required.' },
    { id: 'np_contact_name', msg: 'Liaison Full Name is required.' },
    { id: 'np_contact_phone', msg: 'Liaison Phone Number is required.' },
    { id: 'np_contact_email', msg: 'Liaison Email Address is required.' },
    { id: 'np_contact_street', msg: 'Liaison Mailing Street Address is required.' },
    { id: 'np_contact_city', msg: 'Liaison City is required.' },
    { id: 'np_contact_state', msg: 'Liaison State selection is required.' },
    { id: 'np_contact_zip', msg: 'Liaison Zip Code is required.' }
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

    // 1. Core Fields Existence Verification Check
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) setError(el, field.msg);
        else clearError(el);
      }
    });

    // 2. State Codes 2-Digit Matrix Checking Lookups
    ['np_principal_state', 'np_contact_state'].forEach(id => {
      const el = document.getElementById(id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (val && !/^[a-zA-Z]{2}$/.test(val)) {
          setError(el, 'State codes must be exactly 2 alphabet letters.');
        }
      }
    });

    // 3. Postal ZIP Format Strict Checking Controls
    ['np_principal_zip', 'np_contact_zip'].forEach(id => {
      const el = document.getElementById(id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (val && !/^\d{5}$/.test(val)) {
          setError(el, 'Zip Codes must be exactly 5 numbers.');
        }
      }
    });

    // 4. Contact Email Address Format Selector Engine
    const emailEl = document.getElementById("np_contact_email");
    if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
      const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(emailEl, "Please provide a valid structured email formatting layout.");
      }
    }

    // 5. Contact Phone Formats Number Array Filter Engine
    const phoneEl = document.getElementById("np_contact_phone");
    if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0)) {
      const phoneVal = phoneEl.value ? String(phoneEl.value).trim() : "";
      if (phoneVal) {
        const digits = phoneVal.replace(/\D/g, "");
        if (digits.length < 10) {
          setError(phoneEl, "Liaison Phone Number must contain at least 10 numbers.");
        }
      }
    }

    return { isValid, errors };
  }
};

window.nonprofitPart1Validation = nonprofitPart1Validation;


// Part 2: HTML Component Structural Output Definition (Designs Untouched)
function buildNonprofitOrganizationFieldsLayoutHtml() {
  return `
    <!-- SECTION 1: ORGANIZATION INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 12px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Organization Information</h3>
    </div>
    <div class="wizard-input-field-wrapper">
      <label for="np_proposed_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Proposed Nonprofit Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="np_proposed_name" required placeholder="Example Foundation Inc." class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_proposed_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      <span style="font-size: 0.7rem; color: var(--slate); font-weight: 500; padding-left: 2px;">Ensure chosen name complies with state nonprofit registry standards.</span>
    </div>
    <div class="wizard-input-field-wrapper">
      <label for="np_mission_statement" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Mission Statement <span style="color: #ef4444;">*</span></label>
      <input type="text" id="np_mission_statement" required placeholder="Brief description of mission and charitable objectives..." class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_mission_statement" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper" style="grid-column: span 2;">
      <label for="np_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Location Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="np_principal_street" required placeholder="123 Community Way" class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_principal_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper">
      <label for="np_principal_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="np_principal_city" required placeholder="Austin" class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_principal_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div>
        <label for="np_principal_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
        <input type="text" id="np_principal_state" required placeholder="TX" maxlength="2" class="wizard-input-field">
        <div class="wizard-error-message" id="err_np_principal_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div>
        <label for="np_principal_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
        <input type="text" id="np_principal_zip" required placeholder="78701" class="wizard-input-field">
        <div class="wizard-error-message" id="err_np_principal_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>

    <!-- SECTION 2: CONTACT INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Primary Contact Liaison</h3>
    </div>
    <div class="wizard-input-field-wrapper">
      <label for="np_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Liaison Full Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="np_contact_name" required placeholder="Jane Doe" class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_contact_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper">
      <label for="np_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Liaison Phone Number <span style="color: #ef4444;">*</span></label>
      <input type="tel" id="np_contact_phone" required placeholder="(512) 555-0144" style="font-family: monospace;" class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_contact_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper" style="grid-column: span 2;">
      <label for="np_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Liaison Email Address <span style="color: #ef4444;">*</span></label>
      <input type="email" id="np_contact_email" required placeholder="liaison@nonprofit.org" class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_contact_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper" style="grid-column: span 2;">
      <label for="np_contact_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Liaison Mailing Street Address <span style="color: #ef4444;">*</span></label> <input type="text" id="np_contact_street" required placeholder="456 Officer Ave" class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_contact_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper">
      <label for="np_contact_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">City <span style="color: #ef4444;">*</span></label>
      <input type="text" id="np_contact_city" required placeholder="Austin" class="wizard-input-field">
      <div class="wizard-error-message" id="err_np_contact_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>
    <div class="wizard-input-field-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div>
        <label for="np_contact_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State <span style="color: #ef4444;">*</span></label>
        <input type="text" id="np_contact_state" required placeholder="TX" maxlength="2" class="wizard-input-field">
        <div class="wizard-error-message" id="err_np_contact_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div>
        <label for="np_contact_zip" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Zip Code <span style="color: #ef4444;">*</span></label>
        <input type="text" id="np_contact_zip" required placeholder="78701" class="wizard-input-field">
        <div class="wizard-error-message" id="err_np_contact_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  ` + (typeof window.buildNonprofitOrganizationFieldsLayoutHtmlPart2 === "function" ? window.buildNonprofitOrganizationFieldsLayoutHtmlPart2() : "");
}

window.buildNonprofitOrganizationFieldsLayoutHtml = buildNonprofitOrganizationFieldsLayoutHtml;


// ============================================================================ //
// ðŸ› ï¸ NONPROFIT MODULE VALIDATION ENGINE (COMPREHENSIVE)                       //
// ============================================================================ //

var nonprofitValidation = {
  validateStep: function() {
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

    // 1. Organization & Contact Fields Validation List
    const baseFields = [
      { id: 'np_proposed_name', msg: 'Proposed Nonprofit Name is required.' },
      { id: 'np_mission_statement', msg: 'Mission Statement is required.' },
      { id: 'np_principal_street', msg: 'Principal Location Street Address is required.' },
      { id: 'np_principal_city', msg: 'Principal Location City is required.' },
      { id: 'np_principal_state', msg: 'Principal Location State code is required.' },
      { id: 'np_principal_zip', msg: 'Principal Location Zip Code is required.' },
      { id: 'np_contact_name', msg: 'Liaison Full Name is required.' },
      { id: 'np_contact_phone', msg: 'Liaison Phone Number is required.' },
      { id: 'np_contact_email', msg: 'Liaison Email Address is required.' },
      { id: 'np_contact_street', msg: 'Liaison Mailing Street Address is required.' },
      { id: 'np_contact_city', msg: 'Liaison City is required.' },
      { id: 'np_contact_state', msg: 'Liaison State code is required.' },
      { id: 'np_contact_zip', msg: 'Liaison Zip Code is required.' }
    ];

    baseFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) setError(el, field.msg);
        else clearError(el);
      }
    });

    // 2. Strict Layout Checks (State length and Postal formatting filters)
    ['np_principal_state', 'np_contact_state'].forEach(id => {
      const el = document.getElementById(id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const stateVal = el.value ? String(el.value).trim() : "";
        if (stateVal && !/^[a-zA-Z]{2}$/.test(stateVal)) {
          setError(el, 'State codes must be a valid 2-letter uppercase token.');
        }
      }
    });

    ['np_principal_zip', 'np_contact_zip'].forEach(id => {
      const el = document.getElementById(id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const zipVal = el.value ? String(el.value).trim() : "";
        if (zipVal && !/^\d{5}$/.test(zipVal)) {
          setError(el, 'Zip Codes must consist of exactly 5 numbers.');
        }
      }
    });

    const emailEl = document.getElementById("np_contact_email");
    if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
      const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(emailEl, "Please supply a valid contact email address layout.");
      }
    }

    // 3. Static Loop Checks: Validate Three Mandatory Board Members
    for (let i = 1; i <= 3; i++) {
      const nameEl = document.getElementById(`np_board_name_${i}`);
      const roleEl = document.getElementById(`np_board_role_${i}`);
      const contactEl = document.getElementById(`np_board_contact_${i}`);

      if (nameEl && (nameEl.offsetWidth > 0 || nameEl.offsetHeight > 0)) {
        if (!nameEl.value.trim()) setError(nameEl, `Board Officer #${i}: Full Legal Name is required.`);
        else clearError(nameEl);
      }
      if (roleEl && (roleEl.offsetWidth > 0 || roleEl.offsetHeight > 0)) {
        if (!roleEl.value.trim()) setError(roleEl, `Board Officer #${i}: Position title is required.`);
        else clearError(roleEl);
      }
      if (contactEl && (contactEl.offsetWidth > 0 || contactEl.offsetHeight > 0)) {
        if (!contactEl.value.trim()) setError(contactEl, `Board Officer #${i}: Contact details are required.`);
        else clearError(contactEl);
      }
    }

    return { isValid, errors };
  }
};

window.nonprofitValidation = nonprofitValidation;


// ============================================================================ //
// ðŸ› ï¸ NONPROFIT PART 2 VALIDATION MATRIX ENGINE                                 //
// ============================================================================ //

var nonprofitPart2Validation = {
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

    // Static validation scan for the three required board member blocks
    for (let i = 1; i <= 3; i++) {
      const nameEl = document.getElementById(`np_board_name_${i}`);
      const roleEl = document.getElementById(`np_board_role_${i}`);
      const contactEl = document.getElementById(`np_board_contact_${i}`);

      if (nameEl && (nameEl.offsetWidth > 0 || nameEl.offsetHeight > 0)) {
        if (!nameEl.value.trim()) setError(nameEl, `Board Officer #${i}: Full Legal Name is required.`);
        else clearError(nameEl);
      }
      if (roleEl && (roleEl.offsetWidth > 0 || roleEl.offsetHeight > 0)) {
        if (!roleEl.value.trim()) setError(roleEl, `Board Officer #${i}: Position title is required.`);
        else clearError(roleEl);
      }
      if (contactEl && (contactEl.offsetWidth > 0 || contactEl.offsetHeight > 0)) {
        if (!contactEl.value.trim()) setError(contactEl, `Board Officer #${i}: Contact details are required.`);
        else clearError(contactEl);
      }
    }

    return { isValid, errors };
  }
};

window.nonprofitPart2Validation = nonprofitPart2Validation;


// FAMILY 2B: NONPROFIT ORGANIZATION REGISTRATION LAYOUT MATRIX (PART 2 OF 2)
function buildNonprofitOrganizationFieldsLayoutHtmlPart2() {
  return `
    <!-- SECTION 3: BOARD OF DIRECTORS INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Board of Directors Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <div id="np_board_members_container" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        
        <!-- Core Member 1 (Static) -->
        <div class="member-record-card" style="background: #ffffff; border: 1px solid var(--border); padding: 14px; border-radius: 8px; box-sizing: border-box;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Board Member #1 (Required Primary Officer)</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
            <div>
              <label for="np_board_name_1" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Full Legal Name <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_name_1" required placeholder="Full Legal Name" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_name_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
            <div>
              <label for="np_board_role_1" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Position <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_role_1" required placeholder="Position (e.g., President / Chair)" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_role_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
            <div style="grid-column: span 2;">
              <label for="np_board_contact_1" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Contact Details <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_contact_1" required placeholder="Contact Details (Phone / Email)" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_contact_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
          </div>
        </div>

        <!-- Core Member 2 (Static) -->
        <div class="member-record-card" style="background: #ffffff; border: 1px solid var(--border); padding: 14px; border-radius: 8px; box-sizing: border-box;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Board Member #2 (Required Secretary)</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
            <div>
              <label for="np_board_name_2" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Full Legal Name <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_name_2" required placeholder="Full Legal Name" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_name_2" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
            <div>
              <label for="np_board_role_2" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Position <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_role_2" required placeholder="Position (e.g., Secretary)" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_role_2" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
            <div style="grid-column: span 2;">
              <label for="np_board_contact_2" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Contact Details <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_contact_2" required placeholder="Contact Details (Phone / Email)" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_contact_2" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
          </div>
        </div>

        <!-- Core Member 3 (Static) -->
        <div class="member-record-card" style="background: #ffffff; border: 1px solid var(--border); padding: 14px; border-radius: 8px; box-sizing: border-box;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Board Member #3 (Required Treasurer)</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
            <div>
              <label for="np_board_name_3" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Full Legal Name <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_name_3" required placeholder="Full Legal Name" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_name_3" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
            <div>
              <label for="np_board_role_3" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Position <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_role_3" required placeholder="Position (e.g., Treasurer)" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_role_3" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
            <div style="grid-column: span 2;">
              <label for="np_board_contact_3" style="display: block; font-weight: 700; font-size: 0.75rem; color: var(--navy); margin-bottom: 4px;">Contact Details <span style="color: #ef4444;">*</span></label>
              <input type="text" id="np_board_contact_3" required placeholder="Contact Details (Phone / Email)" class="wizard-input-field">
              <div class="wizard-error-message" id="err_np_board_contact_3" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

window.buildNonprofitOrganizationFieldsLayoutHtmlPart2 = buildNonprofitOrganizationFieldsLayoutHtmlPart2;


// ============================================================================ //
// ðŸ› ï¸ NONPROFIT PART 2 (ADDITIONS) VALIDATION MATRIX ENGINE                     //
// ============================================================================ //

var nonprofitPart2AdditionsValidation = {
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

    // 1. Process base mandatory input items
    const requiredSelects = [
      { id: 'np_irc_type', msg: 'IRC Section Tax-Exempt Status Designation is required.' },
      { id: 'np_ein_choice', msg: 'Please select an option for your Employer Identification Number (EIN).' },
      { id: 'np_license_check', msg: 'Please answer if you have checked for business licenses.' },
      { id: 'np_funding_sources', msg: 'Initial Funding Sources specification is required.' },
      { id: 'np_annual_budget', msg: 'Annual Budget Estimate is required.' },
      { id: 'np_duration_choice', msg: 'Filing Operational Lifespan Horizon selection is required.' }
    ];

    requiredSelects.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const val = el.value ? String(el.value).trim() : "";
        if (!val) setError(el, field.msg);
        else clearError(el);
      }
    });

    // 2. Conditional Check: Validate EIN Reason input box if choice is YES
    const einChoice = document.getElementById("np_ein_choice");
    if (einChoice && einChoice.value === "yes" && (einChoice.offsetWidth > 0 || einChoice.offsetHeight > 0)) {
      const reasonEl = document.getElementById("np_ein_reason");
      if (reasonEl) {
        const reasonVal = reasonEl.value ? String(reasonEl.value).trim() : "";
        if (!reasonVal) {
          setError(reasonEl, "Reason for obtaining an EIN is required when procurement service is selected.");
        } else {
          clearError(reasonEl);
        }
      }
    }

    return { isValid, errors };
  }
};

window.nonprofitPart2AdditionsValidation = nonprofitPart2AdditionsValidation;


// FAMILY 2B: NONPROFIT ORGANIZATION REGISTRATION LAYOUT MATRIX (PART 3 OF 3)
function buildNonprofitOrganizationFieldsLayoutHtmlPart3() {
  return `
    <!-- SECTION 4: ORGANIZATION STRUCTURE (IRC Section Types Selection) -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Organization Structure</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="np_irc_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">IRC Section Tax-Exempt Status Designation <span style="color: #ef4444;">*</span></label>
      <select id="np_irc_type" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select IRC Exemption Classification...</option>
        <option value="501c3">501(c)(3) Charitable, Religious, Educational, Scientific Organizations</option>
        <option value="501c1">501(c)(1) Corporations Organized Under Act of Congress</option>
        <option value="501c2">501(c)(2) Title Holding Corporations for Exempt Organizations</option>
        <option value="501c4">501(c)(4) Civic Leagues and Social Welfare Organizations</option>
        <option value="501c5">501(c)(5) Labor, Agricultural and Horticultural Organizations</option>
        <option value="501c6">501(c)(6) Business Leagues, Chambers of Commerce, etc.</option>
        <option value="501c7">501(c)(7) Social and Recreation Clubs</option>
        <option value="501c8">501(c)(8) Fraternal Beneficiary Societies and Associations</option>
        <option value="501c9">501(c)(9) Voluntary Employees' Beneficiary Associations</option>
        <option value="501c10">501(c)(10) Domestic Fraternal Societies and Associations</option>
        <option value="501c11">501(c)(11) Teachers' Retirement Fund Associations</option>
        <option value="501c12">501(c)(12) Benevolent Life Insurance &amp; Mutual Irrigation Companies</option>
        <option value="501c13">501(c)(13) Cemetery Companies and Burial Corporations</option>
        <option value="501c14">501(c)(14) State Chartered Credit Unions &amp; Mutual Reserve Funds</option>
        <option value="501c15">501(c)(15) Mutual Insurance Companies or Associations</option>
        <option value="501c16">501(c)(16) Cooperative Organizations to Finance Crop Operations</option>
        <option value="501c17">501(c)(17) Supplemental Unemployment Benefit Trusts</option>
        <option value="501c18">501(c)(18) Employee Funded Pension Trusts (Pre-1959)</option>
        <option value="501c19">501(c)(19) Veterans' Organizations and Auxiliaries</option>
        <option value="501c21">501(c)(21) Black Lung Benefit Trusts</option>
        <option value="501c22">501(c)(22) Withdrawal Liability Payment Funds</option>
        <option value="501c25">501(c)(25) Title Holding Corporations/Trusts with Multiple Parents</option> <option value="501c26">501(c)(26) State-Sponsored High-Risk Health Coverage Organizations</option> <option value="501c27">501(c)(27) State-Sponsored Workers' Comp Reinsurance Units</option> <option value="501c28">501(c)(28) National Railroad Retirement Investment Trust</option> <option value="501c29">501(c)(29) Qualified Nonprofit Health Insurance Issuers</option> <option value="501d">501(d) Religious and Apostolic Associations</option> <option value="501e">501(e) Cooperative Hospital Service Organizations</option> <option value="501f">501(f) Cooperative Service Organizations of Educational Units</option> <option value="501k">501(k) Child Care Organizations</option> <option value="521a">521(a) Farmers' Cooperative Associations</option>
      </select>
    </div>

    <!-- SECTION 5: TAX INFORMATION (EIN PROCUREMENT) -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Tax Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="np_ein_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you be applying for an Employer Identification Number (EIN)? <span style="color: #ef4444;">*</span></label>
      <select id="np_ein_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleNonprofitEinReasonField(this.value)">
        <option value="no" selected>No, our organization already possesses an active EIN reference</option>
        <option value="yes">Yes, I want to add Filings4u EIN Procurement Service â€” $79.00</option>
      </select>
    </div>
    <div id="np_ein_reason_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
      <label for="np_ein_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Reason for obtaining an EIN <span style="color: #ef4444;">*</span></label>
      <input type="text" id="np_ein_reason" placeholder="e.g., Opening a dedicated nonprofit bank account, hiring operational employees..." class="wizard-input-field">
    </div>

    <!-- SECTION 6: COMPLIANCE AND LICENSES -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Compliance and Licenses</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="np_license_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have you checked for necessary business licenses or permits? <span style="color: #ef4444;">*</span></label>
      <select id="np_license_check" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleNonprofitLicenseWorkflow(this.value)">
        <option value="yes" selected>Yes, I have verified my structural requirements</option> <option value="no">No, I need assistance checking for required licenses/permits â€” $79.00</option>
      </select>
    </div>

    <!-- SECTION 7: FUNDING AND BUDGET -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Funding and Budget</h3>
    </div>
    <div class="wizard-input-group">
      <label for="np_funding_sources" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Initial Funding Sources <span style="color: #ef4444;">*</span></label> <input type="text" id="np_funding_sources" required placeholder="e.g., Public donations, grants, corporate backing" class="wizard-input-field">
    </div>
    <div class="wizard-input-group">
      <label for="np_annual_budget" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Annual Budget Estimate (Year 1) <span style="color: #ef4444;">*</span></label> <input type="text" id="np_annual_budget" required placeholder="e.g., $50,000" style="font-family: monospace;" class="wizard-input-field">
    </div>

    <!-- SECTION 8: DURATION OF OPERATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">8. Duration of Operation</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="np_duration_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Filing Operational Lifespan Horizon <span style="color: #ef4444;">*</span></label> <select id="np_duration_choice" required class="wizard-input-field" style="font-weight: 600;"> <option value="ongoing" selected>Ongoing Operations (Perpetual corporate horizon existence status)</option> <option value="project">Project-Based (Defined/temporary operational threshold)</option> </select>
    </div>

    <!-- SECTION 9: ADDITIONAL PROVISIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">9. Additional Provisions (Optional)</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="np_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Conditions / Clauses</label> <textarea id="np_provisions" placeholder="Detail any extra organizational parameters, dissolution clauses, or specific asset distribution terms..." rows="3" class="wizard-input-field" style="font-family: inherit; resize: vertical; padding: 14px;"></textarea>
    </div>
  `;
}
window.buildNonprofitOrganizationFieldsLayoutHtmlPart2 = buildNonprofitOrganizationFieldsLayoutHtmlPart2;

