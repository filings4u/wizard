// ============================================================================ //
// ðŸ›ï¸ FAMILY: ENTITY DISSOLUTION APPLICATION UNIFIED WIZARD ENGINE
// ============================================================================ //

function initDissolutionService() { 
  // Global wizard registries allocation 
  window.formRegistry = window.formRegistry || {}; 

  // ============================================================================ //
  // ðŸ“‹ PART 1: ENTITY DISSOLUTION APPLICATION VALIDATION MATRIX ENGINE (PART 1 OF 5)
  // ============================================================================ //
  
  // Part 1 Validation Allocation
  window.formRegistry['dissolution-part1-validation'] = {
    requiredFields: [
      { id: 'dis_entity_name', msg: 'Name of Entity is required.' },
      { id: 'dis_entity_type', msg: 'Please select an Entity Type.' },
      { id: 'dis_state_of_formation', msg: 'State of Incorporation/Formation selection is required.' },
      { id: 'dis_business_street', msg: 'Business Address Street is required.' },
      { id: 'dis_business_city', msg: 'Business Address City is required.' },
      { id: 'dis_business_state', msg: 'Business Address State selection is required.' },
      { id: 'dis_business_zip', msg: 'Business Address Zip Code is required.' }
    ],
    validateStep: function() {
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

      // 1. Process standard baseline elements presence checks
      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
          const currentVal = el.value ? String(el.value).trim() : "";
          if (!currentVal) setError(el, field.msg);
          else clearError(el);
        }
      });

      // 2. Validate Baseline Location ZIP Formatting
      const zipEl = document.getElementById("dis_business_zip");
      if (zipEl && (zipEl.offsetWidth > 0 || zipEl.offsetHeight > 0)) {
        const zipVal = zipEl.value ? String(zipEl.value).trim() : "";
        if (zipVal && !/^\d{5}$/.test(zipVal)) {
          setError(zipEl, 'Business Address Zip Code must consist of exactly 5 numbers.');
        }
      }

      // 3. Conditional Check: Validate Custom Entity text line if selector is set to OTHER
      const typeChoice = document.getElementById("dis_entity_type");
      if (typeChoice && typeChoice.value === "other" && (typeChoice.offsetWidth > 0 || typeChoice.offsetHeight > 0)) {
        const otherTextEl = document.getElementById("dis_structure_other_text");
        if (otherTextEl) {
          const otherTextVal = otherTextEl.value ? String(otherTextEl.value).trim() : "";
          if (!otherTextVal) {
            setError(otherTextEl, "Please specify your unique entity structure formatting.");
          } else {
            clearError(otherTextEl);
          }
        }
      }

      return { isValid, errors };
    }
  };


// ============================================================================ // 
// ðŸ“ PART 2: ENTITY DISSOLUTION UI LAYOUT ARCHITECTURE (PART 1 OF 5)           // 
// ============================================================================ // 

// Part 1 Layout Allocation: Entity Information Template 
window.formRegistry['dissolution-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
  return ` 
    <!-- WRAPPER CONTAINER: Activates CSS Grid & Resolves Layout Variables -->
    <div class="wizard-grid-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; box-sizing: border-box; --navy: #0a1f44; --slate: #334155; --border: #cbd5e1;">

      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS AN ENTITY DISSOLUTION? --> 
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;"> 
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Corporate Dissolution &amp; Winding Up Standards</strong> 
        An Entity Dissolution is the formal, statutory process required to legally terminate a business entity's operational existence with the state registry. Filing Articles of Dissolution limits ongoing corporate tax liabilities, cuts off future operational fees, and initiates the formal winding-up period to safely settle creditor claims and distribute residual assets. 
      </div> 
      
   <!-- SECTION 1: ENTITY INFORMATION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px; margin-bottom: 12px;"> 
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0; font-family: sans-serif;">1. Entity Information</h3> 
      </div>
      
<!-- FIXED SYSTEM INPUT DATA NODE -->
<div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
    <label style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Name of Entity <span style="color: #ef4444;">*</span></label>
    <input type="text" placeholder="Legal Name of Corporate Entity" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; height: 42px;">
</div>

<!-- FIXED SYSTEM SELECT NODE CONTAINER -->
<div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
    <label style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Entity Type <span style="color: #ef4444;">*</span></label>
    <select class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; background-color: #ffffff; color: var(--slate, #334155); font-weight: 600; box-sizing: border-box; height: 42px;">
        <option value="" disabled selected>Select Entity Type...</option>
        <option value="corporation">Corporation (Inc. / Corp.)</option>
        <option value="llc">Limited Liability Company (LLC)</option>
        <option value="partnership">Partnership (LP / LLP)</option>
        <option value="sole_proprietorship">Sole Proprietorship</option>
        <option value="other">Other Structure Suffix</option>
    </select>
</div>

<!-- CONDITIONAL SPECIFICATION CONTAINER (HIDDEN BY DEFAULT) -->
<div id="dis_structure_other_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; flex-direction: column; gap: 6px;">
    <label for="dis_structure_other_text" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Please specify structure: <span style="color: #ef4444;">*</span></label>
    <input type="text" id="dis_structure_other_text" placeholder="e.g., Professional Association, Benefit Corporation..." class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; height: 42px;">
</div>

      
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"> 
        <label for="dis_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State of Incorporation/Formation <span style="color: #ef4444;">*</span></label> 
        <select id="dis_state_of_formation" required class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); font-weight: 600; box-sizing: border-box; height: 42px;"> 
          <option value="" disabled selected>Select State...</option> 
          ${stateDropdownOptionsHtml} 
        </select> 
        <div class="wizard-error-message" id="err_dis_state_of_formation" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      
      <!-- REPAIRED CHARTER FILE REFERENCE LAYOUT TAGS --> 
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"> 
        <label for="dis_charter_id" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Filing or Charter ID Number (If Known)</label> 
        <input type="text" id="dis_charter_id" placeholder="State SOS Registry Identification Reference Number" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box;"> 
      </div> 
      
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;"> 
        <label for="dis_business_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Address <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="dis_business_street" required placeholder="Street Address, Suite, Unit (No P.O. Boxes)" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,\\\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'dis_business')" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_dis_business_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;"> 
          <div> 
            <label for="dis_business_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="dis_business_city" required placeholder="City" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box;"> 
            <div class="wizard-error-message" id="err_dis_business_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
          <div> 
            <label for="dis_business_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
            <select id="dis_business_state" required class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); font-weight: 600; box-sizing: border-box; height: 42px;"> 
              ${stateDropdownOptionsHtml} 
            </select> 
            <div class="wizard-error-message" id="err_dis_business_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
          <div> 
            <label for="dis_business_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="dis_business_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box;" class="wizard-input-field"> 
            <div class="wizard-error-message" id="err_dis_business_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
        </div> 
      </div>

    </div>
  `; 
};

   // ============================================================================ // 
// ðŸ“‹ PART 1: ENTITY DISSOLUTION APPLICATION VALIDATION MATRIX ENGINE (PART 2)   // 
// ============================================================================ // 

// Part 2 Validation Allocation: Contact, Timeline, and Reasons 
window.formRegistry['dissolution-part2-validation'] = {
  requiredFields: [
    { id: 'dis_contact_name', msg: 'Contact Person Name is required.' },
    { id: 'dis_contact_phone', msg: 'Contact Phone Number is required.' },
    { id: 'dis_contact_email', msg: 'Contact Email Address is required.' },
    { id: 'dis_date_of_effective', msg: 'Date of Dissolution is required.' },
    { id: 'dis_final_tax_year', msg: 'Final Tax Year is required.' }
  ],
  validateStep: function() {
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

    // 1. Process standard mandatory fields presence checks
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
        const currentVal = el.value ? String(el.value).trim() : "";
        if (!currentVal) setError(el, field.msg);
        else clearError(el);
      }
    });

    // 2. Validate Contact Email Layout String Formatting
    const emailEl = document.getElementById("dis_contact_email");
    if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
      const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(emailEl, "Please provide a valid contact email address.");
      }
    }

    // 3. Validate Phone Number Baseline Digits Length
    const phoneEl = document.getElementById("dis_contact_phone");
    if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0)) {
      const phoneVal = phoneEl.value ? String(phoneEl.value).trim() : "";
      if (phoneVal) {
        const pureDigits = phoneVal.replace(/\D/g, "");
        if (pureDigits.length < 10) setError(phoneEl, "Contact Phone Number must contain at least 10 numbers.");
      }
    }

    // 4. Validate Tax Year Range
    const taxYearEl = document.getElementById("dis_final_tax_year");
    if (taxYearEl && (taxYearEl.offsetWidth > 0 || taxYearEl.offsetHeight > 0)) {
      const taxYearVal = taxYearEl.value ? String(taxYearEl.value).trim() : "";
      if (taxYearVal) {
        const taxYearInt = parseInt(taxYearVal, 10);
        if (isNaN(taxYearInt) || taxYearInt < 1900 || taxYearInt > 2100) {
          setError(taxYearEl, "Final Tax Year must be a valid year between 1900 and 2100.");
        }
      }
    }

    // 5. FIXED: Loop expression perfectly rewritten and wrapped
    let baselineReasonChecked = false;
    for (let i = 1; i <= 3; i++) {
      const customTextEl = document.getElementById("dis_reason_other_text");
      if (customTextEl) {
        const customTextVal = customTextEl.value ? String(customTextEl.value).trim() : "";
        if (!customTextVal) {
          setError(customTextEl, "Please specify your unique reasons for dissolution.");
        } else {
          clearError(customTextEl);
        }
      }
    }

    return { isValid, errors };
  }
};

  // ============================================================================ //
  // ðŸ“‹ PART 1: ENTITY DISSOLUTION APPLICATION VALIDATION MATRIX ENGINE (PART 3)
  // ============================================================================ //

  // Part 3 Validation Allocation: Asset and Debt Breakdowns
  window.formRegistry['dissolution-part3-validation'] = {
    requiredFields: [
      { id: 'dis_asset_dist_choice', msg: 'Asset Distribution choice option is required.' },
      { id: 'dis_debts_choice', msg: 'Outstanding Debts and Obligations choice option is required.' }
    ],
    validateStep: function() {
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

      // 1. Process standard layout fields presence
      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
          const currentVal = el.value ? String(el.value).trim() : "";
          if (!currentVal) setError(el, field.msg);
          else clearError(el);
        }
      });

      // 7. Conditional Check: Validate Asset Distribution details box if choice is YES
      const assetChoice = document.getElementById("dis_asset_dist_choice");
      if (assetChoice && assetChoice.value === "yes" && (assetChoice.offsetWidth > 0 || assetChoice.offsetHeight > 0)) {
        const assetDetails = document.getElementById("dis_asset_dist_details");
        if (assetDetails) {
          const assetDetailsVal = assetDetails.value ? String(assetDetails.value).trim() : "";
          if (!assetDetailsVal) {
            setError(assetDetails, "Please provide asset distribution profile details.");
          } else {
            clearError(assetDetails);
          }
        }
      }

      // 8. Conditional Check: Validate Debt Settlement details box if choice is YES
      const debtChoice = document.getElementById("dis_debts_choice");
      if (debtChoice && debtChoice.value === "yes" && (debtChoice.offsetWidth > 0 || debtChoice.offsetHeight > 0)) {
        const debtDetails = document.getElementById("dis_debts_details");
        if (debtDetails) {
          const debtDetailsVal = debtDetails.value ? String(debtDetails.value).trim() : "";
          if (!debtDetailsVal) {
            setError(debtDetails, "Please provide debt settlement breakdown details.");
          } else {
            clearError(debtDetails);
          }
        }
      }

      return { isValid, errors };
    }
  };


  // ============================================================================ //
  // ðŸ“ PART 2: UPDATE - ENTITY DISSOLUTION PART 2 UI LAYOUT ENGINE
  // ============================================================================ //

  // Part 2 Layout Allocation: Contact Information & Reasons Template
  window.formRegistry['dissolution-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return `
      <!-- SECTION 2: CONTACT INFORMATION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Contact Information</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="dis_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Contact Person Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="dis_contact_name" required placeholder="Full name of corporate officer or legal contact handling dissolution" class="wizard-input-field"> 
        <div class="wizard-error-message" id="err_dis_contact_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="dis_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Phone Number <span style="color: #ef4444;">*</span></label> 
        <input type="tel" id="dis_contact_phone" required placeholder="(512) 555-0199" class="wizard-input-field"> 
        <div class="wizard-error-message" id="err_dis_contact_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="dis_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Email Address <span style="color: #ef4444;">*</span></label> 
        <input type="email" id="dis_contact_email" required placeholder="email@example.com" class="wizard-input-field"> 
        <div class="wizard-error-message" id="err_dis_contact_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      
      <!-- SECTION 3: REASON FOR DISSOLUTION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; margin-bottom: 8px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Reason for Dissolution</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Select the primary reasons for winding up and dissolving this entity (Check all that apply):</p> 
      </div> 
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box;"> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="dis_reason_1" value="voluntary" style="margin-top: 3px;"> 
          <label for="dis_reason_1" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Voluntary dissolution (Approved by members/shareholders)</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="dis_reason_2" value="involuntary" style="margin-top: 3px;"> 
          <label for="dis_reason_2" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Involuntary dissolution (Court order or operational cessation)</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px; grid-column: span 2;"> 
          <input type="checkbox" id="dis_reason_3" value="other" style="margin-top: 3px;" onchange="if(typeof window.toggleDissolutionReasonSpecificationVisibility === 'function') window.toggleDissolutionReasonSpecificationVisibility(this.checked)"> 
          <label for="dis_reason_3" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Other corporate parameters (Specify below)</label> 
        </div> 
      </div> 
      
      <!-- Hidden Conditional Container: Other Reason Specification --> 
      <div id="dis_reason_other_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; margin-top: 8px;"> 
        <label for="dis_reason_other_text" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify reason: <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="dis_reason_other_text" placeholder="e.g., Business merger, corporate restructuring, retirement of principals..." class="wizard-input-field"> 
        <div class="wizard-error-message" id="err_dis_reason_other_text" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };


  // ============================================================================ //
  // ðŸ“ PART 2: UPDATE - ENTITY DISSOLUTION PARTS 3 & 4 UI LAYOUT ENGINES
  // ============================================================================ //

  // Part 3 Layout Allocation: Dissolution Details Template
  window.formRegistry['dissolution-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
    return `
      <!-- SECTION 4: DISSOLUTION DETAILS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Dissolution Details</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="dis_date_of_effective" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Date of Dissolution <span style="color: #ef4444;">*</span></label> 
        <input type="date" id="dis_date_of_effective" required class="wizard-input-field"> 
        <div class="wizard-error-message" id="err_dis_date_of_effective" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="dis_final_tax_year" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Final Tax Year (if applicable) <span style="color: #ef4444;">*</span></label> 
        <input type="number" id="dis_final_tax_year" required placeholder="2026" min="1900" max="2100" class="wizard-input-field"> 
        <div class="wizard-error-message" id="err_dis_final_tax_year" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };

  // Part 4 Layout Allocation: Asset Distribution Template
  window.formRegistry['dissolution-part4-layout'] = function(stateDropdownOptionsHtml = "") { 
    return `
      <!-- SECTION 5: ASSET DISTRIBUTION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Asset Distribution Profile</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="dis_asset_dist_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will you be distributing any assets? <span style="color: #ef4444;">*</span></label> 
        <select id="dis_asset_dist_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="if(typeof window.toggleDissolutionAssetDistributionVisibility === 'function') window.toggleDissolutionAssetDistributionVisibility(this.value)"> 
          <option value="no" selected>No asset distribution actions are pending or required</option> 
          <option value="yes">Yes, assets will be distributed to members / shareholders</option> 
        </select> 
        <div class="wizard-error-message" id="err_dis_asset_dist_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      
      <!-- Hidden Conditional Container: Asset Distribution Details Entry --> 
      <div id="dis_asset_dist_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;"> 
        <label for="dis_asset_dist_details" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please provide asset distribution details: <span style="color: #ef4444;">*</span></label> 
        <textarea id="dis_asset_dist_details" placeholder="Describe how cash balances, real property, equipment, or inventory allocations are being cleared and transferred..." class="wizard-input-field" style="width: 100%; min-height: 70px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
        <div class="wizard-error-message" id="err_dis_asset_dist_details" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };



    // Part 5 Layout Allocation: Outstanding Debts and Obligations Template
  window.formRegistry['dissolution-part5-layout'] = function(stateDropdownOptionsHtml = "") { 
    return `
      <!-- SECTION 6: OUTSTANDING DEBTS AND OBLIGATIONS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Outstanding Debts and Obligations</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">State regulatory offices mandate that all corporate creditors must be accounted for or cleared before total closure approval.</p> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="dis_debts_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Are there any outstanding debts or obligations? <span style="color: #ef4444;">*</span></label> 
        <select id="dis_debts_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="if(typeof window.toggleDissolutionDebtsVisibility === 'function') window.toggleDissolutionDebtsVisibility(this.value)"> 
          <option value="no" selected>No, all liabilities, creditor bills, and operational debts are settled</option> 
          <option value="yes">Yes, outstanding debts or structural corporate liabilities remain</option> 
        </select> 
        <div class="wizard-error-message" id="err_dis_debts_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
      
      <!-- Hidden Conditional Container: Outstanding Debts Details Entry --> 
      <div id="dis_debts_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;"> 
        <label for="dis_debts_details" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please provide debt settlement details: <span style="color: #ef4444;">*</span></label> 
        <textarea id="dis_debts_details" placeholder="Detail active corporate loans, pending trade credit structures, or winding-up payment reserve allocations..." class="wizard-input-field" style="width: 100%; min-height: 70px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
        <div class="wizard-error-message" id="err_dis_debts_details" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };

  // ============================================================================ //
  // âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (ENTITY DISSOLUTIONS)
  // ============================================================================ //

  function toggleDissolutionStructureOther(value) { 
    const otherWrapper = document.getElementById("dis_structure_other_wrapper"); 
    const otherInput = document.getElementById("dis_structure_other_text"); 
    if (!otherWrapper) return; 
    if (value === "other") { 
      otherWrapper.style.setProperty("display", "block", "important"); 
      if (otherInput) otherInput.setAttribute("required", "required"); 
    } else { 
      otherWrapper.style.setProperty("display", "none", "important"); 
      if (otherInput) { 
        otherInput.removeAttribute("required"); 
        otherInput.value = ""; 
      } 
    } 
  }

  function toggleDissolutionReasonSpecificationVisibility(isChecked) { 
    const otherReasonWrapper = document.getElementById("dis_reason_other_wrapper"); 
    const otherReasonInput = document.getElementById("dis_reason_other_text"); 
    if (!otherReasonWrapper) return; 
    if (isChecked) { 
      otherReasonWrapper.style.setProperty("display", "block", "important"); 
      if (otherReasonInput) otherReasonInput.setAttribute("required", "required"); 
    } else { 
      otherReasonWrapper.style.setProperty("display", "none", "important"); 
      if (otherReasonInput) { 
        otherReasonInput.removeAttribute("required"); 
        otherReasonInput.value = ""; 
      } 
    } 
  }

  function toggleDissolutionAssetDistributionVisibility(value) { 
    const assetWrapper = document.getElementById("dis_asset_dist_wrapper"); 
    const assetInput = document.getElementById("dis_asset_dist_details"); 
    if (!assetWrapper) return; 
    if (value === "yes") { 
      assetWrapper.style.setProperty("display", "block", "important"); 
      if (assetInput) assetInput.setAttribute("required", "required"); 
    } else { 
      assetWrapper.style.setProperty("display", "none", "important"); 
      if (assetInput) { 
        assetInput.removeAttribute("required"); 
        assetInput.value = ""; 
      } 
    } 
  }

  function toggleDissolutionDebtsVisibility(value) { 
    const debtsWrapper = document.getElementById("dis_debts_wrapper"); 
    const debtsInput = document.getElementById("dis_debts_details"); 
    if (!debtsWrapper) return; 
    if (value === "yes") { 
      debtsWrapper.style.setProperty("display", "block", "important"); 
      if (debtsInput) debtsInput.setAttribute("required", "required"); 
    } else { 
      debtsWrapper.style.setProperty("display", "none", "important"); 
      if (debtsInput) { 
        debtsInput.removeAttribute("required"); 
        debtsInput.value = ""; 
      } 
    } 
  }

  // Bind to window scope so element-level event triggers can locate them seamlessly
  window.toggleDissolutionStructureOther = toggleDissolutionStructureOther; 
  window.toggleDissolutionReasonSpecificationVisibility = toggleDissolutionReasonSpecificationVisibility; 
  window.toggleDissolutionAssetDistributionVisibility = toggleDissolutionAssetDistributionVisibility; 
  window.toggleDissolutionDebtsVisibility = toggleDissolutionDebtsVisibility;

  // ============================================================================ //
  // ðŸ PART 4: MASTER VALIDATION INTERCEPTOR HOOK
  // ============================================================================ //

  /**
   * filings4u, LLC - Master Dissolution Validation Interceptor Hook
   * Chains internal checker methods directly into the master page navigation suite.
   * @returns {boolean} Status report signaling clean parameter validation.
   */
  function validateEntireDissolutionWizard() {
    console.log("[Validation Suite] Running master validation sweep inside entity-dissolution.js...");
    let finalOutcome = true;

    // Validate Part 1
    if (window.formRegistry['dissolution-part1-validation'] && typeof window.formRegistry['dissolution-part1-validation'].validateStep === "function") {
      const part1Outcome = window.formRegistry['dissolution-part1-validation'].validateStep();
      if (!part1Outcome.isValid) finalOutcome = false;
    }

    // Validate Part 2
    if (window.formRegistry['dissolution-part2-validation'] && typeof window.formRegistry['dissolution-part2-validation'].validateStep === "function") {
      const part2Outcome = window.formRegistry['dissolution-part2-validation'].validateStep();
      if (!part2Outcome.isValid) finalOutcome = false;
    }

    // Validate Part 3
    if (window.formRegistry['dissolution-part3-validation'] && typeof window.formRegistry['dissolution-part3-validation'].validateStep === "function") {
      const part3Outcome = window.formRegistry['dissolution-part3-validation'].validateStep();
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

  window.validateEntireDissolutionWizard = validateEntireDissolutionWizard;
  window.validateDissolutionWizard = validateEntireDissolutionWizard;

 
  // ============================================================================ //
  // ðŸ PART 4: MASTER VALIDATION INTERCEPTOR HOOK
  // ============================================================================ //

  /**
   * filings4u, LLC - Master Dissolution Validation Interceptor Hook
   * Chains internal checker methods directly into the master page navigation suite.
   * @returns {boolean} Status report signaling clean parameter validation.
   */
  function validateEntireDissolutionWizard() {
    console.log("[Validation Suite] Running master validation sweep inside entity-dissolution.js...");
    let finalOutcome = true;

    // Validate Part 1
    if (window.formRegistry['dissolution-part1-validation'] && typeof window.formRegistry['dissolution-part1-validation'].validateStep === "function") {
      const part1Outcome = window.formRegistry['dissolution-part1-validation'].validateStep();
      if (!part1Outcome.isValid) finalOutcome = false;
    }

    // Validate Part 2
    if (window.formRegistry['dissolution-part2-validation'] && typeof window.formRegistry['dissolution-part2-validation'].validateStep === "function") {
      const part2Outcome = window.formRegistry['dissolution-part2-validation'].validateStep();
      if (!part2Outcome.isValid) finalOutcome = false;
    }

    // Validate Part 3
    if (window.formRegistry['dissolution-part3-validation'] && typeof window.formRegistry['dissolution-part3-validation'].validateStep === "function") {
      const part3Outcome = window.formRegistry['dissolution-part3-validation'].validateStep();
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

  window.validateEntireDissolutionWizard = validateEntireDissolutionWizard;
  window.validateDissolutionWizard = validateEntireDissolutionWizard;

  // Master Render System Allocation
  window.formRegistry['dissolution-form-master'] = function(stateDropdownOptionsHtml = "") { 
    // FIXED: Functions are now properly executed using () brackets and receive arguments cleanly
    return window.formRegistry['dissolution-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['dissolution-part2-layout']() + 
           window.formRegistry['dissolution-part3-layout']() +
           window.formRegistry['dissolution-part4-layout']() +
           window.formRegistry['dissolution-part5-layout'](); 
  };

} // End of initEntityDissolutionService() closure wrapper


