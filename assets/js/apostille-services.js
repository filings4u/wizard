function initApostilleServices() { 
  // Global wizard registries allocation 
  window.formRegistry = window.formRegistry || {}; 

  // ============================================================================ // 
  // ðŸ› ï¸ APOSTILLE AUTHENTICATION VALIDATION MATRIX ENGINE (PART 1 OF 3) 
  // ============================================================================ // 
  window.formRegistry['apostille-services-part1-validation'] = { 
    requiredFields: [ 
      { id: 'ap_document_type', msg: 'Document Type selection is required.' }, 
      { id: 'ap_issuing_authority', msg: 'Document Origin Jurisdiction State selection is required.' }, 
      { id: 'ap_target_country', msg: 'Destination Country is required.' } 
    ], 
    
    validate: function() { // Unified name from 'validateStep' to 'validate' for master engine consistency
      let isValid = true; 
      let errors = []; 
      
      const setError = (el, msg) => { 
        if (el) el.style.borderColor = "#ef4444"; 
        isValid = false; 
        if (!errors.includes(msg)) errors.push(msg); 
      }; 
      
      const clearError = (el) => { 
        if (el) el.style.borderColor = "#cbd5e1"; 
        // Optional: If you use the CSS class approach, you can uncomment the line below:
        // if (el) el.classList.remove('input-error');
      }; 

      // 1. Process standard mandatory fields presence checks 
      this.requiredFields.forEach(field => { 
        const el = document.getElementById(field.id); 
        if (el) { 
          if (!el.value.trim()) {
            setError(el, field.msg); 
          } else {
            clearError(el); 
          }
        } 
      }); 

      // 2. Conditional Check: Validate custom specification text if type is OTHER 
      const docTypeChoice = document.getElementById("ap_document_type"); 
      if (docTypeChoice && docTypeChoice.value === "other") { 
        const otherTextEl = document.getElementById("ap_doc_type_other_text"); 
        if (otherTextEl) {
          if (!otherTextEl.value.trim()) { 
            setError(otherTextEl, "Please specify your unique document type details."); 
          } else { 
            clearError(otherTextEl); 
          } 
        }
      } else {
        // Clean up state if selection was toggled back away from "other"
        const otherTextEl = document.getElementById("ap_doc_type_other_text");
        if (otherTextEl) clearError(otherTextEl);
      }

      return { isValid, errors }; 
    } 
  };

  // Rest of apostille-services.js components go here...
}


// ============================================================================ // 
// FAMILY 13A: APOSTILLE AUTHENTICATION SERVICES LAYOUT MATRIX (PART 1 OF 3) 
// ============================================================================ // 

// 1. Layout Registration Function
window.formRegistry['apostille-services-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
  return ` 
    <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS AN APOSTILLE? --> 
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;"> 
      <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is an Apostille Authentication?</strong> 
      An Apostille is a specialized legal certification issued under the terms of the 1961 Hague Convention. It validates the authenticity of a public official's signature or seal on a document (such as birth certificates, corporate bylaws, or diplomas), ensuring that the document is recognized as legally binding and authentic within foreign jurisdictions. 
    </div> 

    <!-- SECTION 1: DOCUMENT INFORMATION --> 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Document Parameters</h3> 
    </div> 

    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ap_document_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Document Type <span style="color: #ef4444;">*</span></label> 
      <select id="ap_document_type" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleApostilleDocumentSpecificationVisibility(this.value)"> 
        <option value="" disabled selected>Select Document Type...</option> 
        <option value="corporate">Corporate (Articles, Bylaws, Certificates of Status, Power of Attorney)</option> 
        <option value="vital-record">Vital Records (Birth, Marriage, Death Certificates)</option> 
        <option value="academic">Academic Records (Diplomas, Transcripts, Certifications)</option> 
        <option value="notarized">Notarized Personal Document (Affidavits, Agreements, Deeds)</option> 
        <option value="other">Other Specialized Document (Specify below)</option> 
      </select> 
    </div> 

    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ap_issuing_authority" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Document Origin Jurisdiction (State) <span style="color: #ef4444;">*</span></label> 
      <select id="ap_issuing_authority" required class="wizard-input-field" style="font-weight: 600;"> 
        <option value="" disabled selected>Select State of Document Origin...</option> 
        ${stateDropdownOptionsHtml} 
      </select> 
    </div> 

    <!-- Hidden Conditional Container: Other Document Type Description --> 
    <div id="ap_doc_type_other_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; margin-top: 8px;"> 
      <label for="ap_doc_type_other_text" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify document type details: <span style="color: #ef4444;">*</span></label> 
      <input type="text" id="ap_doc_type_other_text" placeholder="e.g., Federal background check, trademark registration letter..." class="wizard-input-field"> 
    </div> 

    <!-- SECTION 2: TARGET COUNTRY & JURISDICTION DETAILS --> 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Destination &amp; International Intent</h3> 
    </div> 
    
    <div class="wizard-input-group" style="grid-column: span 2;"> 
      <label for="ap_target_country" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Destination Country <span style="color: #ef4444;">*</span></label> 
      <input type="text" id="ap_target_country" required placeholder="Enter the foreign nation where this document will be presented (e.g., Spain, United Kingdom, Mexico)" class="wizard-input-field"> 
    </div> 
  `; 
};

// 2. Validation Registration Function
window.formRegistry['apostille-services-part1-validation'] = {
  requiredFields: [ 
    { id: 'ap_document_type', msg: 'Document Type selection is required.' }, 
    { id: 'ap_issuing_authority', msg: 'Document Origin Jurisdiction State selection is required.' }, 
    { id: 'ap_target_country', msg: 'Destination Country is required.' } 
  ], 
  
  validate: function() { 
    let isValid = true; 
    let errors = []; 
    
    const setError = (el, msg) => { 
      if (el) el.style.borderColor = "#ef4444"; 
      isValid = false; 
      if (!errors.includes(msg)) errors.push(msg); 
    }; 
    
    const clearError = (el) => { 
      if (el) el.style.borderColor = "#cbd5e1"; 
    }; 

    // Process standard mandatory fields presence checks 
    this.requiredFields.forEach(field => { 
      const el = document.getElementById(field.id); 
      if (el) { 
        if (!el.value.trim()) {
          setError(el, field.msg); 
        } else {
          clearError(el); 
        }
      } 
    }); 

    // Conditional Check: Validate custom specification text if type is OTHER 
    const docTypeChoice = document.getElementById("ap_document_type"); 
    if (docTypeChoice && docTypeChoice.value === "other") { 
      const otherTextEl = document.getElementById("ap_doc_type_other_text"); 
      if (otherTextEl) {
        if (!otherTextEl.value.trim()) { 
          setError(otherTextEl, "Please specify your unique document type details."); 
        } else { 
          clearError(otherTextEl); 
        } 
      }
    } else {
      const otherTextEl = document.getElementById("ap_doc_type_other_text");
      if (otherTextEl) clearError(otherTextEl);
    }

    return { isValid, errors }; 
  } 
};

// 3. Master Aggregator Block Framework
window.formRegistry['apostille-services-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.formRegistry['apostille-services-part1-layout'](stateDropdownOptionsHtml);
};


// ============================================================================ // 
// ðŸ› ï¸ APOSTILLE AUTHENTICATION VALIDATION MATRIX ENGINE (PARTS 2 & 3)
// ============================================================================ // 

// 1. Part 2 Validation Registration (Document Counts & Upload Processing)
window.formRegistry['apostille-services-part2-validation'] = {
  requiredFields: [
    { id: 'ap_document_count', msg: 'Total Number of Documents is required.' }, 
    { id: 'ap_file_upload', msg: 'Please upload a scanned digital copy of your document.' }
  ],
  
  validate: function() {
    let isValid = true;
    let errors = [];
    
    const setError = (el, msg) => {
      if (el) el.style.borderColor = "#ef4444";
      isValid = false;
      if (!errors.includes(msg)) errors.push(msg);
    };
    
    const clearError = (el) => {
      if (el) el.style.borderColor = "#cbd5e1";
    };

    // Standard required fields pass
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        if (!el.value.trim()) setError(el, field.msg);
        else clearError(el);
      }
    });

    // Validate Document Count range parameters
    const countEl = document.getElementById("ap_document_count");
    if (countEl && countEl.value.trim()) {
      const parsedVal = parseInt(countEl.value, 10);
      if (isNaN(parsedVal) || parsedVal < 1 || parsedVal > 50) {
        setError(countEl, "Total Number of Documents must be a valid number between 1 and 50.");
      }
    }

    return { isValid, errors };
  }
};

// 2. Part 3 Validation Registration (Courier Logistics & Shipping Address)
window.formRegistry['apostille-services-part3-validation'] = {
  requiredFields: [
    { id: 'ap_inbound_courier', msg: 'Inbound Document Delivery Method choice is required.' }, 
    { id: 'ap_outbound_courier', msg: 'Outbound Safe Delivery Speed choice is required.' }, 
    { id: 'ap_shipping_street', msg: 'Shipping Street Address is required.' }, 
    { id: 'ap_shipping_city', msg: 'Shipping City is required.' }, 
    { id: 'ap_shipping_state', msg: 'Shipping State selection is required.' }, 
    { id: 'ap_shipping_zip', msg: 'Shipping Zip Code is required.' }
  ],
  
  validate: function() {
    let isValid = true;
    let errors = [];
    
    const setError = (el, msg) => {
      if (el) el.style.borderColor = "#ef4444";
      isValid = false;
      if (!errors.includes(msg)) errors.push(msg);
    };
    
    const clearError = (el) => {
      if (el) el.style.borderColor = "#cbd5e1";
    };

    // Standard required fields pass
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        if (!el.value.trim()) setError(el, field.msg);
        else clearError(el);
      }
    });

    // Validate Shipping ZIP Layout Code Format Rules
    const zipEl = document.getElementById("ap_shipping_zip");
    if (zipEl && zipEl.value.trim()) {
      if (!/^\d{5}$/.test(zipEl.value.trim())) {
        setError(zipEl, 'Shipping Zip Code must consist of exactly 5 numbers.');
      }
    }

    return { isValid, errors };
  }
};

// 3. Updated Master Aggregator Function Layer
window.formRegistry['apostille-services-form-master'] = function(stateDropdownOptionsHtml = "") {
  // Gracefully handles empty layout fallbacks until structural layouts are injected
  const layout1 = typeof window.formRegistry['apostille-services-part1-layout'] === 'function' ? window.formRegistry['apostille-services-part1-layout'](stateDropdownOptionsHtml) : '';
  const layout2 = typeof window.formRegistry['apostille-services-part2-layout'] === 'function' ? window.formRegistry['apostille-services-part2-layout']() : '';
  const layout3 = typeof window.formRegistry['apostille-services-part3-layout'] === 'function' ? window.formRegistry['apostille-services-part3-layout']() : '';
  
  return layout1 + layout2 + layout3;
};


// ============================================================================ // 
// FAMILY 13A: APOSTILLE AUTHENTICATION SERVICES LAYOUT MATRIX (PART 2 OF 3) 
// ============================================================================ // 

window.formRegistry['apostille-services-part2-layout'] = function() { 
  return ` 
    <!-- SECTION 3: FULFILLMENT VOLUMES & UPLOAD MATRIX --> 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Document Counts &amp; Digital Pre-Review</h3> 
      <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Filings4u performs an advanced structural validation check on your document scan before routing to the Secretary of State.</p> 
    </div> 
    
    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ap_document_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Total Number of Documents <span style="color: #ef4444;">*</span></label> 
      <input type="number" id="ap_document_count" required value="1" min="1" max="50" class="wizard-input-field" onchange="toggleApostilleDocCountVolumePricingHook(); if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }"> 
    </div> 
    
    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ap_file_upload" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Upload Scanned Document Copy <span style="color: #ef4444;">*</span></label> 
      <input type="file" id="ap_file_upload" required class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff;"> 
    </div> 
    
    <!-- SECTION 4: FULFILLMENT SHIPPING FRAMEWORK --> 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Shipping &amp; Courier Options</h3> 
      <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">An Apostille must be physically bound to your original paperwork. Select your inbound and outbound track paths below:</p> 
    </div> 
    
    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ap_inbound_courier" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Inbound Document Delivery Method <span style="color: #ef4444;">*</span></label> 
      <select id="ap_inbound_courier" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleApostilleInboundShippingLabelHook(this.value)"> 
        <option value="user-ship" selected>I will ship my original hardcopy paperwork to Filings4u independently</option> 
        <option value="filings4u-label">Generate a Filings4u Prepaid FedEx Overnight Shipping Label â€” Add $35.00</option> 
      </select> 
    </div> 
    
    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ap_outbound_courier" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Outbound Safe Delivery Speed <span style="color: #ef4444;">*</span></label> 
      <select id="ap_outbound_courier" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleApostilleOutboundDeliveryWorkflow(this.value)"> 
        <option value="standard" selected>Standard Secure Return Courier Tracker (Included)</option> 
        <option value="intl-express">International Express Courier Outbound Delivery â€” Add $75.00</option> 
      </select> 
    </div> 
  `; 
};

// Master Aggregator Function Layer Update
window.formRegistry['apostille-services-form-master'] = function(stateDropdownOptionsHtml = "") {
  const layout1 = typeof window.formRegistry['apostille-services-part1-layout'] === 'function' ? window.formRegistry['apostille-services-part1-layout'](stateDropdownOptionsHtml) : '';
  const layout2 = typeof window.formRegistry['apostille-services-part2-layout'] === 'function' ? window.formRegistry['apostille-services-part2-layout']() : '';
  const layout3 = typeof window.formRegistry['apostille-services-part3-layout'] === 'function' ? window.formRegistry['apostille-services-part3-layout']() : '';
  
  return layout1 + layout2 + layout3;
};


// ============================================================================ // 
// FAMILY 13A: APOSTILLE AUTHENTICATION SERVICES LAYOUT MATRIX (PART 3 OF 3) 
// ============================================================================ // 

window.formRegistry['apostille-services-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
  return ` 
    <!-- SHIPPING DESTINATION RECORDS --> 
    <div style="grid-column: span 2; margin-top: 8px;"> 
      <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;"> 
        <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Outbound Final Delivery Shipping Address</span> 
        
        <div class="wizard-input-group" style="grid-column: span 2; margin: 0;"> 
          <label for="ap_shipping_street" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Shipping Street Address <span style="color: #ef4444;">*</span></label> 
          <input type="text" id="ap_shipping_street" required placeholder="Street Name and Number, Suite, Apt, Unit" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ap_shipping')"> 
        </div> 
        
        <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; box-sizing: border-box;"> 
          <div> 
            <label for="ap_shipping_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="ap_shipping_city" required placeholder="City" class="wizard-input-field"> 
          </div> 
          <div> 
            <label for="ap_shipping_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
            <select id="ap_shipping_state" required class="wizard-input-field" style="font-weight: 600;"> 
              ${stateDropdownOptionsHtml} 
            </select> 
          </div> 
          <div> 
            <label for="ap_shipping_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="ap_shipping_zip" required placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field"> 
          </div> 
        </div> 
      </div> 
    </div> 

    <!-- SECTION 5: ADDITIONAL PROVISIONS --> 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Additional Provisions &amp; Special Instructions</h3> 
    </div> 
    
    <div class="wizard-input-group" style="grid-column: span 2;"> 
      <label for="ap_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Handling Notes</label> 
      <textarea id="ap_provisions" placeholder="Detail any explicit legalization criteria, translator dependencies, or timing constraints needed for your international application..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
    </div> 
  `; 
};

// ============================================================================ // 
// ðŸ“¦ MASTER APOSTILLE AUTHENTICATION SERVICES ASSEMBLY HOOK
// ============================================================================ // 
window.formRegistry['apostille-services-form-master'] = function(stateDropdownOptionsHtml = "") {
  const layout1 = typeof window.formRegistry['apostille-services-part1-layout'] === 'function' ? window.formRegistry['apostille-services-part1-layout'](stateDropdownOptionsHtml) : '';
  const layout2 = typeof window.formRegistry['apostille-services-part2-layout'] === 'function' ? window.formRegistry['apostille-services-part2-layout']() : '';
  const layout3 = typeof window.formRegistry['apostille-services-part3-layout'] === 'function' ? window.formRegistry['apostille-services-part3-layout'](stateDropdownOptionsHtml) : '';
  
  return layout1 + layout2 + layout3;
};

// ============================================================================ // 
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (APOSTILLE AUTHENTICATION)
// ============================================================================ // 

// 1. Controller: Toggle Document Specification Visibility
window.toggleApostilleServicesDocumentSpecificationVisibility = function(value) { 
  const otherWrapper = document.getElementById("ap_doc_type_other_wrapper"); 
  const otherInput = document.getElementById("ap_doc_type_other_text"); 
  
  if (!otherWrapper) return; 
  
  if (value === "other") { 
    // FIXED: Changed display block to grid to preserve parent layout structure without fracturing alignment
    otherWrapper.style.setProperty("display", "grid", "important"); 
    if (otherInput) otherInput.setAttribute("required", "required"); 
  } else { 
    otherWrapper.style.setProperty("display", "none", "important"); 
    if (otherInput) { 
      otherInput.removeAttribute("required"); 
      otherInput.value = ""; 
      // Safely wipe out invalid validation states on elements hidden from the view path
      otherInput.style.borderColor = "#cbd5e1";
    } 
  } 
}; 

// Helper Pricing Wrapper to satisfy multiple dynamic system naming layouts safely
const triggerPricingEngineMatrixUpdate = () => {
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla();
  if (typeof window.updateWizardFinalTotalAmountMatrix === "function") window.updateWizardFinalTotalAmountMatrix();
};

// 2. Controller: Inbound Shipping Flag Toggle Hook
window.toggleApostilleInboundShippingLabelHook = function(value) { 
  window.customSelectedInboundFedexLabelActive = (value === "filings4u-label"); // Adds $35.00 freight label fee if selected 
  triggerPricingEngineMatrixUpdate();
}; 

// 3. Controller: Outbound Courier Strategy Toggle Hook
window.toggleApostilleServicesOutboundDeliveryWorkflow = function(value) { 
  window.customSelectedInternationalExpressOutboundActive = (value === "intl-express"); // Adds $75.00 premium if selected 
  triggerPricingEngineMatrixUpdate();
}; 

// 4. Controller: Volume Multiplication Pricing Calculator Hook
window.toggleApostilleServicesDocCountVolumePricingHook = function() { 
  const countInput = document.getElementById("ap_document_count"); 
  if (!countInput) return; 
  
  const currentVolCount = parseInt(countInput.value, 10) || 1; 
  
  // Exposes raw calculated volume parameters directly out onto the global state scope window object 
  window.globalActiveFormDocumentVolumeCountParameter = Math.max(1, currentVolCount); 
  triggerPricingEngineMatrixUpdate();
};

// ============================================================================ // 
// ðŸ“¦ MASTER SYSTEM INTEGRATION HOOK
// ============================================================================ // 
window.formRegistry['apostille-services-form-master'] = function(stateDropdownOptionsHtml = "") {
  const layout1 = typeof window.formRegistry['apostille-services-part1-layout'] === 'function' ? window.formRegistry['apostille-services-part1-layout'](stateDropdownOptionsHtml) : '';
  const layout2 = typeof window.formRegistry['apostille-services-part2-layout'] === 'function' ? window.formRegistry['apostille-services-part2-layout']() : '';
  const layout3 = typeof window.formRegistry['apostille-services-part3-layout'] === 'function' ? window.formRegistry['apostille-services-part3-layout'](stateDropdownOptionsHtml) : '';
  
  return layout1 + layout2 + layout3;
};


