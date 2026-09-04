// ============================================================================ //
// ðŸ› ï¸ REGISTERED AGENT SERVICE VALIDATION MATRIX ENGINE (PART 1 OF 3)
// ============================================================================ //
const registeredAgentPart1Validation = {
  requiredFields: [
    { id: 'ra_client_name', msg: 'Full Name or Company Name is required.' },
    { id: 'ra_business_structure', msg: 'Please select a Business Structure.' },
    { id: 'ra_principal_street', msg: 'Principal Business Address Street is required.' },
    { id: 'ra_principal_city', msg: 'Principal Business Address City is required.' },
    { id: 'ra_principal_state', msg: 'Principal Business Address State selection is required.' },
    { id: 'ra_principal_zip', msg: 'Principal Business Address Zip Code is required.' },
    { id: 'ra_mailing_choice', msg: 'Mailing Address Selection is required.' },
    { id: 'ra_client_phone', msg: 'Phone Number is required.' },
    { id: 'ra_client_email', msg: 'Email Address is required.' },
    { id: 'ra_target_states', msg: 'State(s) for Registered Agent Service description is required.' }
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

    // 2. Validate Baseline Principal ZIP Formatting
    const zipEl = document.getElementById("ra_principal_zip");
    if (zipEl && zipEl.value.trim() && !/^\d{5}$/.test(zipEl.value.trim())) {
      setError(zipEl, 'Principal Business Address Zip Code must consist of exactly 5 numbers.');
    }

    // 3. Conditional Check: Validate Alternate Mailing blocks if choice is set to "different"
    const mailingChoice = document.getElementById("ra_mailing_choice");
    if (mailingChoice && mailingChoice.value === "different") {
      const alternateMailingFields = [
        { id: 'ra_mailing_street', msg: 'Alternate Mailing Street Address is required.' },
        { id: 'ra_mailing_city', msg: 'Alternate Mailing City is required.' },
        { id: 'ra_mailing_state', msg: 'Alternate Mailing State selection is required.' },
        { id: 'ra_mailing_zip', msg: 'Alternate Mailing Zip Code is required.' }
      ];

      alternateMailingFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
          const val = el.value.trim();
          let isFieldValid = !!val;

          if (field.id === 'ra_mailing_zip' && val && !/^\d{5}$/.test(val)) {
            isFieldValid = false;
            setError(el, 'Alternate Mailing Zip Code must consist of exactly 5 numbers.');
          }

          if (!isFieldValid) {
            setError(el, field.msg);
          } else if (field.id !== 'ra_mailing_zip' || /^\d{5}$/.test(val)) {
            clearError(el);
          }
        }
      });
    }

    // 4. Validate Client Email Structure Syntax
    const emailEl = document.getElementById("ra_client_email");
    if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      setError(emailEl, "Please provide a valid client email address.");
    }

    // 5. Validate Phone Numeric Baseline Length Parameter
    const phoneEl = document.getElementById("ra_client_phone");
    if (phoneEl && phoneEl.value.trim()) {
      const pureDigits = phoneEl.value.replace(/\D/g, "");
      if (pureDigits.length < 10) setError(phoneEl, "Phone Number must contain at least 10 numbers.");
    }

    return { isValid, errors };
  }
};

// FAMILY 8A: REGISTERED AGENT SERVICE LAYOUT MATRIX (PART 1 OF 3)
function buildRegisteredAgentServicePart1(stateDropdownOptionsHtml = "") {
  return `
    <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: REGISTERED AGENT SERVICES -->
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
      <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Statutory Registered Agent?</strong> A Registered Agent is a legally mandated entity or professional office physically located within your operating state tasked with maintaining structured, continuous business-hour coverage. This ensures your corporate layout securely intercepts, logs, and processes official government statutes, annual compliance documents, tax franchise notifications, and time-critical service of process (lawsuits) natively.
    </div>

    <!-- SECTION 1: CLIENT INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Client Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_client_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Full Name or Company Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="ra_client_name" required placeholder="Individual primary registrant full name or legal corporate title" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_business_structure" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Structure <span style="color: #ef4444;">*</span></label>
      <select id="ra_business_structure" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select Structure...</option>
        <option value="llc">Limited Liability Company (LLC)</option>
        <option value="corporation">Corporation (Inc. / Corp.)</option>
        <option value="partnership">Partnership (LP / LLP)</option>
        <option value="sole_prop">Sole Proprietorship</option>
      </select>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="ra_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Business Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="ra_principal_street" required placeholder="Street address, building, suite (No P.O. Boxes)" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,\\\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ra_principal')">
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
        <div>
          <label for="ra_principal_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ra_principal_city" required placeholder="City" class="wizard-input-field">
        </div>
        <div>
          <label for="ra_principal_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
          <select id="ra_principal_state" required class="wizard-input-field" style="font-weight: 600;">
            ${stateDropdownOptionsHtml}
          </select>
        </div>
        <div>
          <label for="ra_principal_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ra_principal_zip" required placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field">
        </div>
      </div>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="ra_mailing_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Mailing Address Selection <span style="color: #ef4444;">*</span></label>
      <select id="ra_mailing_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleRegisteredAgentMailingVisibility(this.value)">
        <option value="same" selected>Mailing Address is identical to Principal Address</option>
        <option value="different">Mailing Address is different</option>
      </select>
    </div>

    <!-- Hidden Conditional Container: Alternate Mailing Records -->
    <div id="ra_mailing_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">
      <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Alternate Mailing Address Records</span>
        <div class="wizard-input-group" style="grid-column: span 2; margin: 0;">
          <label for="ra_mailing_street" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Mailing Street Address <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ra_mailing_street" placeholder="Street Name and Number, Suite, Unit" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ra_mailing')">
        </div>
        <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; box-sizing: border-box;">
          <div>
            <label for="ra_mailing_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ra_mailing_city" placeholder="City" class="wizard-input-field">
          </div>
          <div>
            <label for="ra_mailing_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
            <select id="ra_mailing_state" class="wizard-input-field" style="font-weight: 600;">
              ${stateDropdownOptionsHtml}
            </select>
          </div>
          <div>
            <label for="ra_mailing_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ra_mailing_zip" placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field">
          </div>
        </div>
      </div>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_client_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Phone Number <span style="color: #ef4444;">*</span></label>
      <input type="tel" id="ra_client_phone" required placeholder="(512) 555-0199" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_client_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Email Address <span style="color: #ef4444;">*</span></label>
      <input type="email" id="ra_client_email" required placeholder="email@example.com" class="wizard-input-field">
    </div>

    <!-- SECTION 2: REGISTERED AGENT SERVICE INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Registered Agent Jurisdiction Mapping</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="ra_target_states" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State(s) for Registered Agent Service <span style="color: #ef4444;">*</span></label>
      <input type="text" id="ra_target_states" required placeholder="List all jurisdictions where you require registered agent services (e.g. TX, DE, NV)" class="wizard-input-field">
    </div>
  `;
}

// Map parameters out to global registry matrix window object layers
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['registered-agent-part1-layout'] = buildRegisteredAgentServicePart1;
window.formRegistry['registered-agent-part1-validation'] = registeredAgentPart1Validation;

// ============================================================================ //
// ðŸ› ï¸ REGISTERED AGENT SERVICE VALIDATION MATRIX ENGINE (PART 2 OF 3)
// ============================================================================ //
const registeredAgentPart2Validation = {
  requiredFields: [
    { id: 'ra_multiple_entities_choice', msg: 'Multiple entities selection is required.' },
    { id: 'ra_start_date', msg: 'Desired Start Date is required.' },
    { id: 'ra_mail_forwarding_choice', msg: 'Please select a mail forwarding preference option.' }
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

    // 2. Dynamic Loop Check: Validate Multi-Entity Sub-cards if selection is YES
    const multiEntityChoice = document.getElementById("ra_multiple_entities_choice");
    if (multiEntityChoice && multiEntityChoice.value === "yes") {
      const container = document.getElementById("ra_entities_container") || document.body;
      const entityCards = container.querySelectorAll(".ra-entity-card");
      
      entityCards.forEach(card => {
        const idx = card.id.replace("ra_entity_card_", "");
        const nameEl = document.getElementById(`ra_entity_name_${idx}`);
        const typeEl = document.getElementById(`ra_entity_type_${idx}`);

        if (nameEl && !nameEl.value.trim()) setError(nameEl, `Secondary Entity #${idx}: Name is required.`); else clearError(nameEl);
        if (typeEl && !typeEl.value.trim()) setError(typeEl, `Secondary Entity #${idx}: Type selection is required.`); else clearError(typeEl);
      });
    }

    // 3. Conditional Check: Validate Forwarding Street Address if choice is YES
    const forwardingChoice = document.getElementById("ra_mail_forwarding_choice");
    if (forwardingChoice && forwardingChoice.value === "yes") {
      const forwardStreet = document.getElementById("ra_forwarding_street");
      if (forwardStreet && !forwardStreet.value.trim()) {
        setError(forwardStreet, "Mailing Address for Forwarding is required when custom physical forwarding is selected.");
      } else if (forwardStreet) {
        clearError(forwardStreet);
      }
    }

    return { isValid, errors };
  }
};

// FAMILY 8A: REGISTERED AGENT SERVICE LAYOUT MATRIX (PART 2 OF 3)
function buildRegisteredAgentServicePart2(stateDropdownOptionsHtml = "") {
  return `
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="ra_multiple_entities_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Do you require registered agent services for multiple entities? <span style="color: #ef4444;">*</span></label>
      <select id="ra_multiple_entities_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleRegisteredAgentMultiEntityVisibility(this.value)">
        <option value="no" selected>No, solitary entity registration coverage only</option>
        <option value="yes">Yes, establish shared dynamic registry fields for multiple entities</option>
      </select>
    </div>

    <!-- Hidden Conditional Container: Multi-Entity Dynamic Record Registry -->
    <div id="ra_entities_wrapper" style="grid-column: span 2; display: none;">
      <p style="color: var(--slate); font-size: 0.825rem; margin: 0 0 16px 0; line-height: 1.4;">
        Provide the names and legal structuring types for each secondary enterprise requiring professional registered agent coverage down this pathway.
      </p>
      
      <div id="ra_entities_container" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        <!-- Initial Secondary Entity Entry Node Structure (Wrapped in explicit tracking class) -->
        
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Secondary Entity #1 Records</span>
          
          <!-- REPAIRED SYSTEM STRUCTURE: Injected missing input layout tag cleanly -->
          <div class="wizard-input-group" style="margin: 0;">
            <label style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Entity Name <span style="color: #ef4444;">*</span></label>
            
          </div>
          
          <!-- REPAIRED SYSTEM STRUCTURE: Injected missing select tag wrapper cleanly -->
          <div class="wizard-input-group" style="margin: 0;">
            <label style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Entity Type <span style="color: #ef4444;">*</span></label>
            
              <option value="" disabled selected>Select Type...</option>
              <option value="llc">Limited Liability Company (LLC)</option>
              <option value="corporation">Corporation</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other Suffix Form</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- FIXED STRUCTURAL BUTTON POSITION -->
      <button type="button" onclick="appendNewRegisteredAgentEntityRow()" style="background: transparent; border: 1px dashed var(--primary); color: var(--primary); font-weight: 700; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; width: fit-content; margin-top: 12px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-plus"></i> Add Additional Entity
      </button>
    </div>

    <!-- SECTION 3: SERVICE REQUIREMENTS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Service Requirements</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_start_date" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Desired Start Date <span style="color: #ef4444;">*</span></label>
      <input type="date" id="ra_start_date" required class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_mail_forwarding_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Do you need mail forwarding services? <span style="color: #ef4444;">*</span></label>
      <select id="ra_mail_forwarding_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleRegisteredAgentMailForwardingWorkflow(this.value)">
        <option value="" disabled selected>Select Option...</option>
        <option value="yes">Yes, I require custom mail processing and physical forwarding profiles</option>
        <option value="no">No, add Filings4u Premium Mail Forwarding Digital Node â€” $25.00 / Mo</option>
      </select>
    </div>

    <!-- Hidden Conditional Container: Mail Forwarding Data Destinations -->
    <div id="ra_forwarding_address_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;">
      <label for="ra_forwarding_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Mailing Address for Forwarding <span style="color: #ef4444;">*</span></label>
      <input type="text" id="ra_forwarding_street" placeholder="Destination street address, building, unit, or clear mailbox drop layout" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ra_forwarding')">
    </div>
  `;
}

// Map parameters out to global registry matrix window object layers
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['registered-agent-part2-layout'] = buildRegisteredAgentServicePart2;
window.formRegistry['registered-agent-part2-validation'] = registeredAgentPart2Validation;

// ============================================================================ //
// ðŸ› ï¸ REGISTERED AGENT SERVICE VALIDATION MATRIX ENGINE (PART 3 OF 3)
// ============================================================================ //
const registeredAgentPart3Validation = {
  requiredFields: [
    { id: 'ra_handled_documents', msg: 'Please specify the documents to handle.' },
    { id: 'ra_notification_preference', msg: 'Document Notification Preference selection is required.' },
    { id: 'ra_responsibility_check', msg: 'Please answer if you are aware of the agent responsibilities.' },
    { id: 'ra_data_update_agreement', msg: 'Agreement to keep contact information updated is required.' }
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

// FAMILY 8A: REGISTERED AGENT SERVICE LAYOUT MATRIX (PART 3 OF 3)
function buildRegisteredAgentServicePart3(stateDropdownOptionsHtml = "") {
  return `
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_handled_documents" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Documents to Handle <span style="color: #ef4444;">*</span></label>
      <input type="text" id="ra_handled_documents" required placeholder="e.g. Legal documents, service of process, tax notices, all state correspondence" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_notification_preference" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Document Notification Preference <span style="color: #ef4444;">*</span></label>
      <select id="ra_notification_preference" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select Preference...</option>
        <option value="email">Immediate Email Scan Transmission (Fastest & Recommended)</option>
        <option value="mail">Physical First-Class Mail Forwarding</option>
        <option value="phone">Direct Phone Call / SMS Notification Alert</option>
      </select>
    </div>

    <!-- SECTION 4: COMPLIANCE AND RESPONSIBILITIES -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Compliance and Responsibilities</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_responsibility_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Are you aware of the agent responsibilities? <span style="color: #ef4444;">*</span></label>
      <select id="ra_responsibility_check" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select Option...</option>
        <option value="yes">Yes, I acknowledge the roles, presence mandates, and statutory scope of an agent</option>
        <option value="no">No, please send a copy of operational parameters via dashboard portal</option>
      </select>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="ra_data_update_agreement" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Agree to keep contact info updated? <span style="color: #ef4444;">*</span></label>
      <select id="ra_data_update_agreement" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select Option...</option>
        <option value="yes">Yes, I explicitly agree to maintain accurate records for processing alerts</option>
        <option value="no">No, do not register tracking credentials</option>
      </select>
    </div>

    <!-- SECTION 5: ADDITIONAL PROVISIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Additional Provisions</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="ra_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Provisions</label>
      <textarea id="ra_provisions" placeholder="Detail any optional fields for specific clauses, internal corporate resolutions, or custom legal handling instructions relative to your agent service profile..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
    </div>
  `;
}
window.buildRegisteredAgentServicePart3 = buildRegisteredAgentServicePart3;

// MASTER REGISTERED AGENT SERVICE ASSEMBLY HOOK
function buildRegisteredAgentServiceForm(stateDropdownOptionsHtml = "") {
  return buildRegisteredAgentServicePart1(stateDropdownOptionsHtml) + buildRegisteredAgentServicePart2(stateDropdownOptionsHtml) + buildRegisteredAgentServicePart3(stateDropdownOptionsHtml);
}

// Global registry setup matrix tracking allocation routes
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['registered-agent-part3-layout'] = buildRegisteredAgentServicePart3;
window.formRegistry['registered-agent-part3-validation'] = registeredAgentPart3Validation;
window.formRegistry['registered-agent-form-master'] = buildRegisteredAgentServiceForm;

// ============================================================================ //
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (REGISTERED AGENT SERVICE EXPOSURES)
// ============================================================================ //

window.toggleRegisteredAgentMailingVisibility = function(value) {
  const mailingWrapper = document.getElementById("ra_mailing_wrapper");
  if (!mailingWrapper) return;
  const inputs = mailingWrapper.querySelectorAll("input, select");

  if (value === "different") {
    mailingWrapper.style.setProperty("display", "flex", "important");
    inputs.forEach(el => el.setAttribute("required", "required"));
  } else {
    mailingWrapper.style.setProperty("display", "none", "important");
    inputs.forEach(el => { el.removeAttribute("required"); el.value = ""; });
  }
};

window.toggleRegisteredAgentMultiEntityVisibility = function(value) {
  const entitiesWrapper = document.getElementById("ra_entities_wrapper");
  if (!entitiesWrapper) return;
  const inputs = entitiesWrapper.querySelectorAll(".ra-entity-card input, .ra-entity-card select");

  if (value === "yes") {
    entitiesWrapper.style.setProperty("display", "block", "important");
    inputs.forEach(el => el.setAttribute("required", "required"));
  } else {
    entitiesWrapper.style.setProperty("display", "none", "important");
    entitiesWrapper.querySelectorAll("input, select").forEach(el => { el.removeAttribute("required"); el.value = ""; });
  }
};

window.toggleRegisteredAgentMailForwardingWorkflow = function(value) {
  const addressWrapper = document.getElementById("ra_forwarding_address_wrapper");
  const streetInput = document.getElementById("ra_forwarding_street");
  if (!addressWrapper) return;

  if (value === "yes") {
    addressWrapper.style.setProperty("display", "block", "important");
    if (streetInput) streetInput.setAttribute("required", "required");
    window.customSelectedMailForwardingServiceActive = false; // Turned off add-on premium option
  } else {
    addressWrapper.style.setProperty("display", "none", "important");
    if (streetInput) { streetInput.removeAttribute("required"); streetInput.value = ""; }
    window.customSelectedMailForwardingServiceActive = (value === "no"); // Adds $25.00/Mo premium add-on if NO
  }
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla();
};

window.appendNewRegisteredAgentEntityRow = function() {
  const container = document.getElementById("ra_entities_container");
  if (!container) return;

  const currentCount = container.querySelectorAll(".ra-entity-card").length + 1;

  const newCard = document.createElement("div");
  newCard.className = "ra-entity-card";
  newCard.id = `ra_entity_card_${currentCount}`;
  newCard.style.cssText = "display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border: 1px solid var(--border); padding: 12px; border-radius: 6px; box-sizing: border-box; margin-top: 12px;";

  newCard.innerHTML = `
    <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase;">Secondary Entity #${currentCount} Records</span>
    <button type="button" onclick="this.parentElement.remove();" style="justify-self: end; background: transparent; border: none; color: #ef4444; font-weight:700; cursor:pointer;"><i class="fa-solid fa-trash-can"></i> Remove</button>
    <div class="wizard-input-group" style="margin: 0;">
      <label style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Entity Name *</label>
      
    </div>
    <div class="wizard-input-group" style="margin: 0;">
      <label style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Entity Type *</label>
      
        <option value="" disabled selected>Select Type...</option>
        <option value="llc">Limited Liability Company (LLC)</option>
        <option value="corporation">Corporation</option>
        <option value="partnership">Partnership</option>
        <option value="other">Other Suffix Form</option>
      </select>
    </div>
  `;

  container.appendChild(newCard);
};

