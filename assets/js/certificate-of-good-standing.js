// ============================================================================ // 
// ðŸ“œ SYSTEM COMPLIANCE SERVICE: CERTIFICATE OF GOOD STANDING (PART 1 OF 3)
// ============================================================================ // 

function initCertificateOfGoodStandingServices() {
  window.formRegistry = window.formRegistry || {};

    // --- PART 1 LAYOUT: CORE COMPANY REGISTRY DETAILS ---
  window.formRegistry['certificate-of-good-standing-part1-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
      <!-- SECTION 1: ENTITY INFORMATION -->
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Corporate Entity Identification</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="cgs_company_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Entity Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="cgs_company_name" required placeholder="Legal company name exactly as filed with the State" class="wizard-input-field">
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="cgs_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State of Formation <span style="color: #ef4444;">*</span></label>
        <select id="cgs_state_of_formation" required class="wizard-input-field" style="font-weight: 600;">
          <option value="" disabled selected>Select Formation State...</option>
          ${stateDropdownOptionsHtml}
        </select>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        State Charter / Entity File ID Number</label>
        
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="cgs_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Business Address <span style="color: #ef4444;">*</span></label>
        <input type="text" id="cgs_principal_street" required placeholder="Street Address, Suite, Unit" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'cgs_principal')">
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
          <div>
            <label for="cgs_principal_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
            <input type="text" id="cgs_principal_city" required placeholder="City" class="wizard-input-field">
          </div>
          <div>
            <label for="cgs_principal_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
            <select id="cgs_principal_state" required class="wizard-input-field" style="font-weight: 600;">
              <option value="" disabled selected>Select...</option>
              ${stateDropdownOptionsHtml}
            </select>
          </div>
          <div>
            <label for="cgs_principal_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
            <input type="text" id="cgs_principal_zip" required placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field">
          </div>
        </div>
      </div>
    `;
  };



  // --- PART 2 VALIDATION MATRIX ENGINE ---
  window.formRegistry['certificate-of-good-standing-part2-validation'] = {
    requiredFields: [
      { id: 'cgs_contact_name', msg: 'Primary Contact Person Name is required.' },
      { id: 'cgs_contact_phone', msg: 'Contact Phone Number is required.' },
      { id: 'cgs_contact_email', msg: 'Contact Email Address is required.' },
      { id: 'cgs_issuance_purpose', msg: 'Primary Reason for Requesting Certificate is required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      // Presence loop checkpass
      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) { if (!el.value.trim()) setError(el, field.msg); else clearError(el); }
      });

      // Validate Contact Email String Layout
      const emailEl = document.getElementById("cgs_contact_email");
      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        setError(emailEl, "Please enter a valid contact email address.");
      }

      // Validate Contact Phone Numeric Baseline Length
      const phoneEl = document.getElementById("cgs_contact_phone");
      if (phoneEl && phoneEl.value.trim() && phoneEl.value.replace(/\D/g, "").length < 10) {
        setError(phoneEl, "Contact Phone Number must contain at least 10 numbers.");
      }

      // Conditional Check: Validate Custom Purpose Textbox if choice equals OTHER
      const purposeChoice = document.getElementById("cgs_issuance_purpose");
      if (purposeChoice && purposeChoice.value === "other") {
        const otherTextEl = document.getElementById("cgs_purpose_other_text");
        if (otherTextEl && !otherTextEl.value.trim()) setError(otherTextEl, "Please specify your intended use parameters.");
        else if (otherTextEl) clearError(otherTextEl);
      }
      return { isValid, errors };
    }
  };

  // --- PART 3 VALIDATION MATRIX ENGINE ---
  window.formRegistry['certificate-of-good-standing-part3-validation'] = {
    requiredFields: [
      { id: 'cgs_delivery_speed', msg: 'Fulfillment Processing Speed selection is required.' },
      { id: 'cgs_delivery_method', msg: 'Document Delivery Format selection is required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) { if (!el.value.trim()) setError(el, field.msg); else clearError(el); }
      });

      // Conditional Check: Validate Shipping Address Profile if method equals PHYSICAL
      const deliveryMethod = document.getElementById("cgs_delivery_method");
      if (deliveryMethod && deliveryMethod.value === "physical") {
        const shippingFields = [
          { id: 'cgs_shipping_street', msg: 'Shipping Street Address is required for hardcopy delivery.' },
          { id: 'cgs_shipping_city', msg: 'Shipping City is required for hardcopy delivery.' },
          { id: 'cgs_shipping_state', msg: 'Shipping State selection is required for hardcopy delivery.' },
          { id: 'cgs_shipping_zip', msg: 'Shipping Zip Code is required for hardcopy delivery.' }
        ];
        shippingFields.forEach(field => {
          const el = document.getElementById(field.id);
          if (el) {
            const val = el.value.trim(); let isFieldValid = !!val;
            if (field.id === 'cgs_shipping_zip' && val && !/^\d{5}$/.test(val)) {
              isFieldValid = false; setError(el, 'Shipping Zip Code must consist of exactly 5 numbers.');
            }
            if (!isFieldValid) setError(el, field.msg);
            else if (field.id !== 'cgs_shipping_zip' || /^\d{5}$/.test(val)) clearError(el);
          }
        });
      }
      return { isValid, errors };
    }
  };


  // --- PART 2 LAYOUT: CONTACT DETAILS & INTENT PARAMETERS ---
  window.formRegistry['certificate-of-good-standing-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 2: CONTACT INFORMATION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Primary Contact Details</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cgs_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Contact Person Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cgs_contact_name" required placeholder="First and Last Legal Name" class="wizard-input-field"> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cgs_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Contact Phone Number <span style="color: #ef4444;">*</span></label> 
        <input type="tel" id="cgs_contact_phone" required placeholder="(512) 555-0199" class="wizard-input-field"> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cgs_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Contact Email Address <span style="color: #ef4444;">*</span></label> 
        <input type="email" id="cgs_contact_email" required placeholder="email@example.com" class="wizard-input-field"> 
      </div> 

      <!-- SECTION 3: CERTIFICATION INTENT & CONTEXT --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Intent &amp; Context Parameters</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cgs_issuance_purpose" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Reason for Requesting Certificate <span style="color: #ef4444;">*</span></label> 
        <select id="cgs_issuance_purpose" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleGoodStandingPurposeSpecificationVisibility(this.value)"> 
          <option value="" disabled selected>Select Intended Use...</option> 
          <option value="banking">Opening Corporate Bank Account / Securing Commercial Lending</option> 
          <option value="foreign-qualification">Filing for Foreign Qualification Certificate in another state</option> 
          <option value="contractual">Contractual Requirement / Request from Business Partners</option> 
          <option value="regulatory">Regulatory Compliance / Capitalization Requirements</option> 
          <option value="other">Other Brand / Operational Context (Specify below)</option> 
        </select> 
      </div> 

      <!-- Hidden Conditional Container: Other Purpose Description --> 
      <div id="cgs_purpose_other_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; margin-top: 8px;"> 
        <label for="cgs_purpose_other_text" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify intended use parameters: <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cgs_purpose_other_text" placeholder="Describe the specific verification requirement needing status proof..." class="wizard-input-field"> 
      </div> 
    `; 
  };


  // --- PART 3 LAYOUT: FULFILLMENT & DELIVERY MATRIX ---
  window.formRegistry['certificate-of-good-standing-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 4: DELIVERY SELECTION & EXTRA COPIES --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Fulfillment &amp; Delivery Options</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cgs_delivery_speed" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Fulfillment Processing Speed <span style="color: #ef4444;">*</span></label> 
        <select id="cgs_delivery_speed" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleGoodStandingFulfillmentSpeedWorkflow(this.value)"> 
          <option value="standard" selected>Standard Processing (Timeline varies based on state speed arrays)</option> 
          <option value="expedited">Expedited Courier Service â€” Add $49.00 (Priority state extraction filing)</option> 
        </select> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cgs_delivery_method" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Document Delivery Format <span style="color: #ef4444;">*</span></label> 
        <select id="cgs_delivery_method" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleGoodStandingPhysicalDeliveryVisibility(this.value)"> 
          <option value="digital" selected>Digital Extraction Only (Secure PDF download link via dashboard portal)</option> 
          <option value="physical">Digital PDF + Certified Physical Hardcopy Delivery â€” Add $35.00</option> 
        </select> 
      </div> 

      <!-- Hidden Conditional Container: Physical Shipping Address Records --> 
      <div id="cgs_shipping_address_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;"> 
        <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;"> 
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Physical Certificate Delivery Shipping Address</span> 
          <div class="wizard-input-group" style="grid-column: span 2; margin: 0;"> 
            <label for="cgs_shipping_street" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Shipping Street Address <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="cgs_shipping_street" placeholder="Street Name and Number, Suite, Apt, Unit" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'cgs_shipping')"> 
          </div> 
          <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; box-sizing: border-box;"> 
            <div> 
              <label for="cgs_shipping_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
              <input type="text" id="cgs_shipping_city" placeholder="City" class="wizard-input-field"> 
            </div> 
            <div> 
              <label for="cgs_shipping_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
              <select id="cgs_shipping_state" class="wizard-input-field" style="font-weight: 600;"> 
                ${stateDropdownOptionsHtml} 
              </select> 
            </div> 
            <div> 
              <label for="cgs_shipping_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
              <input type="text" id="cgs_shipping_zip" placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field"> 
            </div> 
          </div> 
        </div> 
      </div> 

      <!-- SECTION 5: ADDITIONAL PROVISIONS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Additional Provisions</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cgs_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Instructions or Requirements</label> 
        <textarea id="cgs_provisions" placeholder="Detail any unique criteria, certified status indicators, or explicit provisions required on your Certificate of Good Standing registration..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
      </div> 
    `; 
  };

  // ============================================================================ // 
  // âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS
  // ============================================================================ // 
  window.toggleGoodStandingPurposeSpecificationVisibility = function(value) { 
    const purposeWrapper = document.getElementById("cgs_purpose_other_wrapper"); 
    const purposeInput = document.getElementById("cgs_purpose_other_text"); 
    if (!purposeWrapper) return; 
    
    if (value === "other") { 
      purposeWrapper.style.setProperty("display", "grid", "important"); 
      if (purposeInput) purposeInput.setAttribute("required", "required"); 
    } else { 
      purposeWrapper.style.setProperty("display", "none", "important"); 
      if (purposeInput) { purposeInput.removeAttribute("required"); purposeInput.value = ""; purposeInput.style.borderColor = "#cbd5e1"; } 
    } 
  }; 

  window.toggleGoodStandingFulfillmentSpeedWorkflow = function(value) { 
    window.customSelectedExpeditedCourierServiceActive = (value === "expedited"); // Adds $49.00 premium if selected 
    if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla(); 
    if (typeof window.updateWizardFinalTotalAmountMatrix === "function") window.updateWizardFinalTotalAmountMatrix();
  }; 

  window.toggleGoodStandingPhysicalDeliveryVisibility = function(value) { 
    const shipWrapper = document.getElementById("cgs_shipping_address_wrapper"); 
    if (!shipWrapper) return; 
    const inputs = shipWrapper.querySelectorAll("input, select"); 
    
    if (value === "physical") { 
      shipWrapper.style.setProperty("display", "grid", "important"); 
      inputs.forEach(el => el.setAttribute("required", "required")); 
      window.customSelectedHardcopyDeliveryServiceActive = true; // Adds $35.00 hardcopy fee 
    } else { 
      shipWrapper.style.setProperty("display", "none", "important"); 
      inputs.forEach(el => { el.removeAttribute("required"); el.value = ""; el.style.borderColor = "#cbd5e1"; }); 
      window.customSelectedHardcopyDeliveryServiceActive = false; 
    } 
    if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla(); 
    if (typeof window.updateWizardFinalTotalAmountMatrix === "function") window.updateWizardFinalTotalAmountMatrix();
  };

  // ============================================================================ // 
  // ðŸ“¦ MASTER CERTIFICATE OF GOOD STANDING ASSEMBLY HOOK
  // ============================================================================ // 
  window.formRegistry['certificate-of-good-standing-form-master'] = function(stateDropdownOptionsHtml = "") { 
    return window.formRegistry['certificate-of-good-standing-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['certificate-of-good-standing-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['certificate-of-good-standing-part3-layout'](stateDropdownOptionsHtml); 
  }; 
}

// Ignition
initCertificateOfGoodStandingServices();


