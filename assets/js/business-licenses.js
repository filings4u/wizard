// ============================================================================ // 
// ðŸ› ï¸ BUSINESS LICENSES APPLICATION ENGINE (PART 1 OF 5)
// ============================================================================ // 

function initBusinessLicensesServices() {
  window.formRegistry = window.formRegistry || {};

  // --- PART 1 VALIDATION MATRIX ENGINE ---
  window.formRegistry['business-licenses-part1-validation'] = { 
    requiredFields: [ 
      { id: 'bl_applicant_name', msg: 'Applicant Name or Company Name is required.' }, 
      { id: 'bl_business_structure', msg: 'Please select a Business Structure.' }, 
      { id: 'bl_business_street', msg: 'Business Address Street is required.' }, 
      { id: 'bl_business_city', msg: 'Business Address City is required.' }, 
      { id: 'bl_business_state', msg: 'Business Address State selection is required.' }, 
      { id: 'bl_business_zip', msg: 'Business Address Zip Code is required.' }, 
      { id: 'bl_mailing_choice', msg: 'Mailing Address Selection is required.' }, 
      { id: 'bl_applicant_phone', msg: 'Phone Number is required.' }, 
      { id: 'bl_applicant_email', msg: 'Email Address is required.' } 
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

      // 1. Process standard mandatory fields presence checks 
      this.requiredFields.forEach(field => { 
        const el = document.getElementById(field.id); 
        if (el) { 
          if (!el.value.trim()) setError(el, field.msg); 
          else clearError(el); 
        } 
      }); 

      // 2. Validate Baseline Business ZIP Formatting 
      const zipEl = document.getElementById("bl_business_zip"); 
      if (zipEl && zipEl.value.trim() && !/^\d{5}$/.test(zipEl.value.trim())) { 
        setError(zipEl, 'Business Address Zip Code must consist of exactly 5 numbers.'); 
      } 

      // 3. Conditional Check: Validate Alternate Mailing blocks if choice is set to "different" 
      const mailingChoice = document.getElementById("bl_mailing_choice"); 
      if (mailingChoice && mailingChoice.value === "different") { 
        const alternateMailingFields = [ 
          { id: 'bl_mailing_street', msg: 'Alternate Mailing Street Address is required.' }, 
          { id: 'bl_mailing_city', msg: 'Alternate Mailing City is required.' }, 
          { id: 'bl_mailing_state', msg: 'Alternate Mailing State selection is required.' }, 
          { id: 'bl_mailing_zip', msg: 'Alternate Mailing Zip Code is required.' } 
        ]; 
        alternateMailingFields.forEach(field => { 
          const el = document.getElementById(field.id); 
          if (el) { 
            const val = el.value.trim(); 
            let isFieldValid = !!val; 
            if (field.id === 'bl_mailing_zip' && val && !/^\d{5}$/.test(val)) { 
              isFieldValid = false; 
              setError(el, 'Alternate Mailing Zip Code must consist of exactly 5 numbers.'); 
            } 
            if (!isFieldValid) { 
              setError(el, field.msg); 
            } else if (field.id !== 'bl_mailing_zip' || /^\d{5}$/.test(val)) { 
              clearError(el); 
            } 
          } 
        }); 
      } 

      // 4. Validate Applicant Email Structure Syntax 
      const emailEl = document.getElementById("bl_applicant_email"); 
      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) { 
        setError(emailEl, "Please provide a valid applicant email address."); 
      } 

      // 5. Validate Phone Number Baseline Digits Length 
      const phoneEl = document.getElementById("bl_applicant_phone"); 
      if (phoneEl && phoneEl.value.trim()) { 
        const pureDigits = phoneEl.value.replace(/\D/g, ""); 
        if (pureDigits.length < 10) setError(phoneEl, "Phone Number must contain at least 10 numbers."); 
      } 

      return { isValid, errors }; 
    } 
  };


  // --- PART 1 LAYOUT: APPLICANT INFORMATION ---
  window.formRegistry['business-licenses-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: BUSINESS LICENSES & PERMITS --> 
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;"> 
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Compliance Standards for Operating Licenses</strong> 
        Operating a business in the United States requires strict adherence to multi-jurisdictional compliance criteria. Depending on your industry and precise geographic matrix, you may require a combination of local, municipal, county, state, and federal operational credentials to legally conduct trade and insulate your firm from severe statutory enforcement. 
      </div> 

      <!-- SECTION 1: APPLICANT INFORMATION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Applicant Information</h3> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_applicant_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Applicant Name or Company Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bl_applicant_name" required placeholder="Full individual name or official company name" class="wizard-input-field"> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_business_structure" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Structure <span style="color: #ef4444;">*</span></label> 
        <select id="bl_business_structure" required class="wizard-input-field" style="font-weight: 600;"> 
          <option value="" disabled selected>Select Structure...</option> 
          <option value="corporation">Corporation (Inc. / Corp.)</option> 
          <option value="llc">Limited Liability Company (LLC)</option> 
          <option value="partnership">Partnership</option> 
          <option value="sole_proprietorship">Sole Proprietorship</option> 
        </select> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_business_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Address <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bl_business_street" required placeholder="Street Address, Suite, Unit (No P.O. Boxes)" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,\\\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'bl_business')"> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;"> 
          <div> 
            <label for="bl_business_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="bl_business_city" required placeholder="City" class="wizard-input-field"> 
          </div> 
          <div> 
            <label for="bl_business_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
            <select id="bl_business_state" required class="wizard-input-field" style="font-weight: 600;"> 
              ${stateDropdownOptionsHtml} 
            </select> 
          </div> 
          <div> 
            <label for="bl_business_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="bl_business_zip" required placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field"> 
          </div> 
        </div> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_mailing_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Mailing Address Selection <span style="color: #ef4444;">*</span></label> 
        <select id="bl_mailing_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleBusinessLicensesMailingVisibility(this.value)"> 
          <option value="same" selected>Mailing Address is identical to Business Address</option> 
          <option value="different">Mailing Address is different</option> 
        </select> 
      </div> 

      <!-- Hidden Conditional Container: Alternate Mailing Address Data --> 
      <div id="bl_mailing_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;"> 
        <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;"> 
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Alternate Mailing Address Records</span> 
          <div class="wizard-input-group" style="grid-column: span 2; margin: 0;"> 
            <label for="bl_mailing_street" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Mailing Street Address <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="bl_mailing_street" placeholder="Street Name and Number, Suite, Unit" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'bl_mailing')"> 
          </div> 
          <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; box-sizing: border-box;"> 
            <div> 
              <label for="bl_mailing_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
              <input type="text" id="bl_mailing_city" placeholder="City" class="wizard-input-field"> 
            </div> 
            <div> 
              <label for="bl_mailing_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
              <select id="bl_mailing_state" class="wizard-input-field" style="font-weight: 600;"> 
                ${stateDropdownOptionsHtml} 
              </select> 
            </div> 
            <div> 
              <label for="bl_mailing_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
              <input type="text" id="bl_mailing_zip" placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field"> 
            </div> 
          </div> 
        </div> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_applicant_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Phone Number <span style="color: #ef4444;">*</span></label> 
        <input type="tel" id="bl_applicant_phone" required placeholder="(512) 555-0199" class="wizard-input-field"> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_applicant_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Email Address <span style="color: #ef4444;">*</span></label> 
        <input type="email" id="bl_applicant_email" required placeholder="email@example.com" class="wizard-input-field"> 
      </div> 
    `; 
  };


  // --- PART 2 VALIDATION MATRIX ENGINE ---
  window.formRegistry['business-licenses-part2-validation'] = { 
    validate: function() { 
      let isValid = false; 
      let errors = []; 
      
      // 1. Iterate through checkboxes 1-12 to ensure a baseline selection exists 
      for (let i = 1; i <= 12; i++) { 
        const checkboxNode = document.getElementById(`bl_type_${i}`); 
        if (checkboxNode && checkboxNode.checked) { 
          isValid = true; 
          break; // Selection criteria met 
        } 
      } 
      
      // 2. Process structural layout fallback indicators if no items are flagged 
      if (!isValid) { 
        errors.push("Please select at least one license or permit type to continue."); 
        // Visual feedback: briefly blink checkbox container border if tracking elements exist 
        for (let i = 1; i <= 12; i++) { 
          const checkEl = document.getElementById(`bl_type_${i}`); 
          if (checkEl) checkEl.style.outline = "1px solid #ef4444"; 
        } 
      } else { 
        // Clear visual feedback indicators 
        for (let i = 1; i <= 12; i++) { 
          const checkEl = document.getElementById(`bl_type_${i}`); 
          if (checkEl) checkEl.style.outline = "none"; 
        } 
      } 
      
      return { isValid, errors }; 
    } 
  };

  // --- PART 2 LAYOUT: TYPE OF BUSINESS LICENSE ---
  window.formRegistry['business-licenses-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 2: TYPE OF BUSINESS LICENSE --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; margin-bottom: 8px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Type of Business License &amp; Permits</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Please select the licenses you are applying for or require verification checking maps (Check all that apply):</p> 
      </div> 
      
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box;"> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_1" value="general" style="margin-top: 3px;"> 
          <label for="bl_type_1" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">1. General Business License</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_2" value="sales_tax" style="margin-top: 3px;"> 
          <label for="bl_type_2" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">2. Sales Tax Permit / Registration</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_3" value="registration" style="margin-top: 3px;"> 
          <label for="bl_type_3" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">3. Business Entity Registration</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_4" value="ein" style="margin-top: 3px;"> 
          <label for="bl_type_4" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">4. Employer Identification Number (EIN)</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_5" value="professional" style="margin-top: 3px;"> 
          <label for="bl_type_5" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">5. Professional License (Oversight Guilds)</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_6" value="food_service" style="margin-top: 3px;"> 
          <label for="bl_type_6" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">6. Food Service License</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_7" value="health_dept" style="margin-top: 3px;"> 
          <label for="bl_type_7" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">7. Health Department Permit</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_8" value="liquor" style="margin-top: 3px;"> 
          <label for="bl_type_8" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">8. Liquor License / Alcohol Permit</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_9" value="home_occ" style="margin-top: 3px;"> 
          <label for="bl_type_9" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">9. Home Occupation Permit</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_10" value="zoning" style="margin-top: 3px;"> 
          <label for="bl_type_10" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">10. Zoning Permit Verification</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_11" value="contractor" style="margin-top: 3px;"> 
          <label for="bl_type_11" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">11. Contractor &amp; Trade License</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_12" value="child_care" style="margin-top: 3px;"> 
          <label for="bl_type_12" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">12. Child Care Facility License</label> 
        </div> 
      </div> 
    `; 
  };


  // --- PART 3 VALIDATION MATRIX ENGINE ---
  window.formRegistry['business-licenses-part3-validation'] = { 
    validate: function() { 
      let isValid = false; 
      let errors = []; 
      
      // 1. Iterate through checkboxes 13-24 to see if any items are flagged in this view slice 
      for (let i = 13; i <= 24; i++) { 
        const checkboxNode = document.getElementById(`bl_type_${i}`); 
        if (checkboxNode && checkboxNode.checked) { 
          isValid = true; 
          break; 
        } 
      } 
      
      // NOTE: Because this block continues the Part 2 list, your master layout wizard 
      // will combine check flags across parts 2 and 3 before restricting pagination. 
      return { isValid, errors }; 
    } 
  };

  // --- PART 3 LAYOUT: ADDITIONAL LICENSE SUB-TYPES ---
  window.formRegistry['business-licenses-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box;">
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_13" value="animal" style="margin-top: 3px;"> 
          <label for="bl_type_13" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">13. Animal and Veterinary Licenses</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_14" value="beauty" style="margin-top: 3px;"> 
          <label for="bl_type_14" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">14. Beauty and Cosmetology Licenses</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_15" value="transportation" style="margin-top: 3px;"> 
          <label for="bl_type_15" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">15. Transportation / Logistics Permits</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_16" value="environmental" style="margin-top: 3px;"> 
          <label for="bl_type_16" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">16. Environmental Control Permits</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_17" value="special_event" style="margin-top: 3px;"> 
          <label for="bl_type_17" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">17. Special Events / Assembly Permit</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_18" value="signage" style="margin-top: 3px;"> 
          <label for="bl_type_18" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">18. Structural Signage Permit</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_19" value="tobacco" style="margin-top: 3px;"> 
          <label for="bl_type_19" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">19. Tobacco Retailer License</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_20" value="auctioneer" style="margin-top: 3px;"> 
          <label for="bl_type_20" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">20. Auctioneer Statutory License</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_21" value="pharmacy" style="margin-top: 3px;"> 
          <label for="bl_type_21" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">21. Pharmacy Facility License</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_22" value="fire" style="margin-top: 3px;"> 
          <label for="bl_type_22" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">22. Fire Marshal Operating Permit</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_23" value="nursing" style="margin-top: 3px;"> 
          <label for="bl_type_23" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">23. Nursing Home Care Facility License</label> 
        </div> 
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="bl_type_24" value="real_estate" style="margin-top: 3px;"> 
          <label for="bl_type_24" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">24. Real Estate Brokerage License</label> 
        </div> 
      </div> 
    `; 
  };


  // --- PART 4 VALIDATION MATRIX ENGINE ---
  window.formRegistry['business-licenses-part4-validation'] = { 
    requiredFields: [ 
      { id: 'bl_activities_desc', msg: 'Description of Business Activities is required.' }, 
      { id: 'bl_business_hours', msg: 'Business Hours are required.' }, 
      { id: 'bl_tenure_choice', msg: 'Location property tenancy type selection is required.' }, 
      { id: 'bl_zoning_compliant', msg: 'Zoning-compliance registration answer is required.' } 
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

      // 1. Process basic mandatory fields presence checks 
      this.requiredFields.forEach(field => { 
        const el = document.getElementById(field.id); 
        if (el) { 
          if (!el.value.trim()) setError(el, field.msg); 
          else clearError(el); 
        } 
      }); 

      // 2. Validate Employee Count numeric ranges if values exist 
      const countEl = document.getElementById("bl_employee_count"); 
      if (countEl && countEl.value.trim()) { 
        const parsedVal = parseInt(countEl.value, 10); 
        if (isNaN(parsedVal) || parsedVal < 0) { 
          setError(countEl, "Number of Employees must be a valid positive number."); 
        } 
      } 

      // 3. Conditional Check: Validate Landlord Details if choice equals LEASE 
      const tenureChoice = document.getElementById("bl_tenure_choice"); 
      if (tenureChoice && tenureChoice.value === "lease") { 
        const landlordName = document.getElementById("bl_landlord_name"); 
        const landlordPhone = document.getElementById("bl_landlord_phone"); 
        
        if (landlordName && !landlordName.value.trim()) setError(landlordName, "Landlord's Name is required under lease structures."); 
        else clearError(landlordName); 
        
        if (landlordPhone) { 
          const pureDigits = landlordPhone.value.replace(/\D/g, ""); 
          if (!landlordPhone.value.trim()) { 
            setError(landlordPhone, "Landlord's Phone Number is required under lease structures."); 
          } else if (pureDigits.length < 10) { 
            setError(landlordPhone, "Landlord's Phone Number must contain at least 10 numbers."); 
          } else { 
            clearError(landlordPhone); 
          } 
        } 
      } 
      
      return { isValid, errors }; 
    } 
  };

  // --- PART 4 LAYOUT: BUSINESS & LOCATION DETAIL MATRIX ---
  window.formRegistry['business-licenses-part4-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 3: BUSINESS INFORMATION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Business Information</h3> 
      </div> 
      
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_activities_desc" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Description of Business Activities <span style="color: #ef4444;">*</span></label> 
        <textarea id="bl_activities_desc" required placeholder="Briefly describe what your business will do..." class="wizard-input-field" style="width: 100%; min-height: 70px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
      </div> 
      
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_employee_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Number of Employees (If Applicable)</label> 
        <input type="number" id="bl_employee_count" placeholder="0" min="0" class="wizard-input-field"> 
      </div> 
      
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_business_hours" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Hours <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bl_business_hours" required placeholder="e.g., Mon-Fri 9AM-5PM, Sat 10AM-2PM" class="wizard-input-field"> 
      </div> 

      <!-- SECTION 4: LOCATION INFORMATION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Location Information</h3> 
      </div> 
      
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_tenure_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Do you own or lease the business location? <span style="color: #ef4444;">*</span></label> 
        <select id="bl_tenure_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleBusinessLicensesLandlordVisibility(this.value)"> 
          <option value="own" selected>Own (Premises are held under direct structural asset equity)</option> 
          <option value="lease">Lease (Premises are occupied via third-party tenancy agreement)</option> 
        </select> 
      </div> 

      <!-- Hidden Conditional Container: Lease Landlord Details --> 
      <div id="bl_landlord_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;"> 
        <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;"> 
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Landlord Contact Record Registry</span> 
          <div class="wizard-input-group" style="margin: 0;"> 
            <label for="bl_landlord_name" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Landlord's Name <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="bl_landlord_name" placeholder="Individual Name or Property Management Entity" class="wizard-input-field"> 
          </div> 
          <div class="wizard-input-group" style="margin: 0;"> 
            <label for="bl_landlord_phone" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Landlord's Phone Number <span style="color: #ef4444;">*</span></label> 
            <input type="tel" id="bl_landlord_phone" placeholder="(512) 555-0144" class="wizard-input-field"> 
          </div> 
        </div> 
      </div> 
      
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_zoning_compliant" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Is your business located in a zoning-compliant area? <span style="color: #ef4444;">*</span></label> 
        <select id="bl_zoning_compliant" required class="wizard-input-field" style="font-weight: 600;"> 
          <option value="" disabled selected>Select Option...</option> 
          <option value="yes">Yes, verified against local structural master maps</option> 
          <option value="no">No, requires municipal zoning adjustment variance processing</option> 
        </select> 
      </div> 
    `; 
  };


  // --- PART 5 VALIDATION MATRIX ENGINE ---
  window.formRegistry['business-licenses-part5-validation'] = {
    requiredFields: [
      { id: 'bl_city_regs_choice', msg: 'Please specify if you have checked city regulations.' },
      { id: 'bl_other_permits_choice', msg: 'Please specify if you hold permits from other agencies.' },
      { id: 'bl_file_id', msg: 'A valid copy of your Identification document upload is required.' },
      { id: 'bl_file_lease', msg: 'Lease agreement or proof of location ownership document upload is required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      // 1. Standard presence checks pass
      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) { if (!el.value.trim()) setError(el, field.msg); else clearError(el); }
      });

      // 2. Conditional City Regulations Textbox
      const cityChoice = document.getElementById("bl_city_regs_choice");
      if (cityChoice && cityChoice.value === "yes") {
        const cityDetails = document.getElementById("bl_city_regs_details");
        if (cityDetails && !cityDetails.value.trim()) setError(cityDetails, "Please specify which municipal regulations you have reviewed.");
        else if (cityDetails) clearError(cityDetails);
      }

      // 3. Conditional Other Permits Textbox
      const otherChoice = document.getElementById("bl_other_permits_choice");
      if (otherChoice && otherChoice.value === "yes") {
        const otherList = document.getElementById("bl_other_permits_list");
        if (otherList && !otherList.value.trim()) setError(otherList, "Please list your external agency permits or licenses.");
        else if (otherList) clearError(otherList);
      }
      return { isValid, errors };
    }
  };


  // --- PART 5 LAYOUT: COMPLIANCE REQUIREMENTS ---
  window.formRegistry['business-licenses-part5-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 5: COMPLIANCE REQUIREMENTS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Compliance Requirements</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_city_regs_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have you checked city regulations applicable to your business type? <span style="color: #ef4444;">*</span></label> 
        <select id="bl_city_regs_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleBusinessLicensesCityRegsVisibility(this.value)"> 
          <option value="" disabled selected>Select Option...</option> 
          <option value="yes">Yes, we have reviewed our localized municipal regulations</option> 
          <option value="no">No, we have not completely audited city regulatory overlays</option> 
        </select> 
      </div> 
      <!-- Hidden Conditional Container --> 
      <div id="bl_city_regs_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;"> 
        <label for="bl_city_regs_details" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify which regulations you have reviewed: <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bl_city_regs_details" placeholder="List reviewed ordinances..." class="wizard-input-field"> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_other_permits_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Do you have required permits or licenses from other agencies? <span style="color: #ef4444;">*</span></label> 
        <select id="bl_other_permits_choice" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleBusinessLicensesOtherPermitsVisibility(this.value)"> 
          <option value="" disabled selected>Select Option...</option> 
          <option value="no">No secondary external authorizations are mandatory</option> 
          <option value="yes">Yes, secondary state or environmental parameters apply</option> 
        </select> 
      </div> 
      <!-- Hidden Conditional Container --> 
      <div id="bl_other_permits_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;"> 
        <label for="bl_other_permits_list" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please list: <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bl_other_permits_list" placeholder="List existing state professional licenses..." class="wizard-input-field"> </div> 
      <!-- SECTION 6: ADDITIONAL DOCUMENTATION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Additional Documentation</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Please attach verifiable file elements:</p> </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_file_id" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Copy of a valid ID <span style="color: #ef4444;">*</span></label> 
        <input type="file" id="bl_file_id" required class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff;"> </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_file_reg" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Proof of Business Registration</label> 
        <input type="file" id="bl_file_reg" class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff;"> </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_file_lease" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Lease agreement or proof of ownership <span style="color: #ef4444;">*</span></label> 
        <input type="file" id="bl_file_lease" required class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff;"> </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bl_file_health" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Health permits (If Applicable)</label> 
        <input type="file" id="bl_file_health" class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff;"> </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bl_file_extra" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Additional documents:</label> 
        <input type="text" id="bl_file_extra_note" placeholder="Describe additional items..." class="wizard-input-field" style="margin-bottom: 8px;"> 
        <input type="file" id="bl_file_extra" class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff;"> </div> 
    `; 
  };

  // ============================================================================ // 
  // âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS
  // ============================================================================ // 
  window.toggleBusinessLicensesMailingVisibility = function(value) { 
    const mailingWrapper = document.getElementById("bl_mailing_wrapper"); 
    if (!mailingWrapper) return; 
    const inputs = mailingWrapper.querySelectorAll("input, select"); 
    if (value === "different") { 
      mailingWrapper.style.setProperty("display", "grid", "important"); 
      inputs.forEach(el => el.setAttribute("required", "required")); 
    } else { 
      mailingWrapper.style.setProperty("display", "none", "important"); 
      inputs.forEach(el => { el.removeAttribute("required"); el.value = ""; el.style.borderColor = "#cbd5e1"; }); 
    } 
  }; 

  window.toggleBusinessLicensesLandlordVisibility = function(value) { 
    const landlordWrapper = document.getElementById("bl_landlord_wrapper"); 
    if (!landlordWrapper) return; 
    const inputs = landlordWrapper.querySelectorAll("input"); 
    if (value === "lease") { 
      landlordWrapper.style.setProperty("display", "grid", "important"); 
      inputs.forEach(el => el.setAttribute("required", "required")); 
    } else { 
      landlordWrapper.style.setProperty("display", "none", "important"); 
      inputs.forEach(el => { el.removeAttribute("required"); el.value = ""; el.style.borderColor = "#cbd5e1"; }); 
    } 
  }; 

  window.toggleBusinessLicensesCityRegsVisibility = function(value) { 
    const cityWrapper = document.getElementById("bl_city_regs_wrapper"); 
    const cityInput = document.getElementById("bl_city_regs_details"); 
    if (!cityWrapper) return; 
    if (value === "yes") { 
      cityWrapper.style.setProperty("display", "grid", "important"); 
      if (cityInput) cityInput.setAttribute("required", "required"); 
    } else { 
      cityWrapper.style.setProperty("display", "none", "important"); 
      if (cityInput) { cityInput.removeAttribute("required"); cityInput.value = ""; cityInput.style.borderColor = "#cbd5e1"; } 
    } 
  }; 

  window.toggleBusinessLicensesOtherPermitsVisibility = function(value) { 
    const otherWrapper = document.getElementById("bl_other_permits_wrapper"); 
    const otherInput = document.getElementById("bl_other_permits_list"); 
    if (!otherWrapper) return; 
    if (value === "yes") { 
      otherWrapper.style.setProperty("display", "grid", "important"); 
      if (otherInput) otherInput.setAttribute("required", "required"); 
    } else { 
      otherWrapper.style.setProperty("display", "none", "important"); 
      if (otherInput) { otherInput.removeAttribute("required"); otherInput.value = ""; otherInput.style.borderColor = "#cbd5e1"; } 
    } 
  };

  // ============================================================================ // 
  // ðŸ“¦ MASTER RENDER SYSTEM ALLOCATION
  // ============================================================================ // 
  window.formRegistry['business-licenses-form-master'] = function(stateDropdownOptionsHtml = "") { 
    return window.formRegistry['business-licenses-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['business-licenses-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['business-licenses-part3-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['business-licenses-part4-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['business-licenses-part5-layout'](stateDropdownOptionsHtml); 
  }; 
}

// Ignition
initBusinessLicensesServices();


