// ============================================================================ // 
// ðŸ§ª SYSTEM COMPLIANCE SERVICE: CLIA CERTIFICATE ENGINE (PART 1 OF 3)
// ============================================================================ // 

function initCliaCertificateServices() {
  window.formRegistry = window.formRegistry || {};

  // --- PART 1 VALIDATION MATRIX ENGINE ---
  window.formRegistry['clia-certificate-part1-validation'] = { 
    requiredFields: [ 
      { id: 'clia_lab_name', msg: 'Official Laboratory Name is required.' }, 
      { id: 'clia_facility_street', msg: 'Physical Facility Address Street is required.' }, 
      { id: 'clia_facility_city', msg: 'Physical Facility Address City is required.' }, 
      { id: 'clia_facility_state', msg: 'Physical Facility Address State selection is required.' }, 
      { id: 'clia_facility_zip', msg: 'Physical Facility Address Zip Code is required.' }, 
      { id: 'clia_certificate_type', msg: 'Requested Certificate Type selection is required.' }, 
      { id: 'clia_facility_type', msg: 'Laboratory Facility Classification selection is required.' },
      { id: 'clia_tax_id', msg: 'Federal Tax ID Number (EIN or SSN) is required for CMS validation mapping.' }
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

      // 1. Process basic required field presence checks 
      this.requiredFields.forEach(field => { 
        const el = document.getElementById(field.id); 
        if (el) { 
          if (!el.value.trim()) setError(el, field.msg); 
          else clearError(el); 
        } 
      }); 

      // 2. Validate Physical Location Zip Code String Formatting 
      const zipEl = document.getElementById("clia_facility_zip"); 
      if (zipEl && zipEl.value.trim() && !/^\d{5}$/.test(zipEl.value.trim())) { 
        setError(zipEl, 'Physical Facility Address Zip Code must consist of exactly 5 numbers.'); 
      } 

      // EXPANSION UPGRADE: Enforce DLA/CMS "No P.O. Box" Rule for Laboratory Profiling
      const streetEl = document.getElementById("clia_facility_street");
      if (streetEl && streetEl.value.trim()) {
        const poBoxRegex = /\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i;
        if (poBoxRegex.test(streetEl.value.trim())) {
          setError(streetEl, 'CMS regulations strictly prohibit P.O. Boxes for physical laboratory location records.');
        }
      }

      // EXPANSION UPGRADE: Validate Tax ID Length Check (9 Digits)
      const taxEl = document.getElementById("clia_tax_id");
      if (taxEl && taxEl.value.trim()) {
        const cleanTax = taxEl.value.replace(/\D/g, "");
        if (cleanTax.length !== 9) {
          setError(taxEl, 'Federal Tax Identification parameters must consist of exactly 9 digits.');
        }
      }

      // 3. Conditional Check: Validate custom category details if selector is set to OTHER 
      const categoryChoice = document.getElementById("clia_facility_type"); 
      if (categoryChoice && categoryChoice.value === "other") { 
        const otherTextEl = document.getElementById("clia_facility_other_text"); 
        if (otherTextEl && !otherTextEl.value.trim()) { 
          setError(otherTextEl, "Please specify your unique laboratory facility classification details."); 
        } else if (otherTextEl) { 
          clearError(otherTextEl); 
        } 
      } 

      return { isValid, errors }; 
    } 
  };


  // --- PART 1 LAYOUT: LABORATORY IDENTIFICATION PROFILE ---
  window.formRegistry['clia-certificate-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS A CLIA CERTIFICATE? --> 
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;"> 
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Clinical Laboratory Improvement Amendments Compliance</strong> 
        A CLIA Certificate is a federal requirement administered by CMS (Centers for Medicare &amp; Medicaid Services) for any facility performing testing on human specimens for health assessment, diagnostic mapping, or treatment protocols. Operating a diagnostic center, workplace toxicity screening line, or clinical lab requires strict credential alignment to avoid immediate federal statutory closure and structural enforcement. 
      </div> 

      <!-- SECTION 1: LABORATORY IDENTIFICATION PROFILE --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Laboratory Identification Profile</h3> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="clia_lab_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Laboratory Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="clia_lab_name" required placeholder="Legal business or corporate facility name exactly as registered" class="wizard-input-field"> 
      </div> 

      <!-- EXPANSION FIELD Upgrade: Tax ID Input (EIN or SSN) -->
      <div class="wizard-input-group" style="grid-column: span 2; margin-bottom: 8px;">
        <label for="clia_tax_id" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Tax ID Number (EIN or SSN) <span style="color: #ef4444;">*</span></label>
        <input type="text" id="clia_tax_id" required placeholder="00-0000000 or 000-00-0000" style="font-family: monospace;" class="wizard-input-field">
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="clia_facility_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Physical Facility Address <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="clia_facility_street" required placeholder="Street Name and Number, Suite, Room, Lab Number (No P.O. Boxes allowed by CMS)" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,\\\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'clia_facility')"> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;"> 
          <div> 
            <label for="clia_facility_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="clia_facility_city" required placeholder="City" class="wizard-input-field"> 
          </div> 
          <div> 
            <label for="clia_facility_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
            <select id="clia_facility_state" required class="wizard-input-field" style="font-weight: 600;"> 
              ${stateDropdownOptionsHtml} 
            </select> 
          </div> 
          <div> 
            <label for="clia_facility_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="clia_facility_zip" required placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field"> 
          </div> 
        </div> 
      </div> 

      <!-- SECTION 2: FACILITY CLASSIFICATION PARAMETERS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Facility Classification &amp; Certificate Selection</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="clia_certificate_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Requested Certificate Type <span style="color: #ef4444;">*</span></label> 
        <select id="clia_certificate_type" required class="wizard-input-field" style="font-weight: 600;"> 
          <option value="" disabled selected>Select Certificate Type...</option> 
          <option value="waiver">Certificate of Waiver (Simple, low-risk tests e.g., blood glucose, pregnancy strips)</option> 
          <option value="ppm">Certificate for Provider-Performed Microscopy (PPM procedures)</option> 
          <option value="compliance">Certificate of Compliance (Moderate to high complexity testing inspections)</option> 
          <option value="accreditation">Certificate of Accreditation (Evaluated by private non-profit organizations)</option> 
        </select> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="clia_facility_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Laboratory Facility Classification <span style="color: #ef4444;">*</span></label> 
        <select id="clia_facility_type" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleCliaFacilityOtherSpecificationVisibility(this.value)"> 
          <option value="" disabled selected>Select Facility Category...</option> 
          <option value="physician-office">Physician Office Laboratory (POL)</option> 
          <option value="clinic">Independent Clinic / Urgent Care Center</option> 
          <option value="hospital">Hospital Testing Division</option> 
          <option value="pharmacy">Retail Pharmacy Screening Station</option> 
          <option value="mobile">Mobile Testing Unit / Temporary Health Site</option> 
          <option value="other">Other Laboratory Category (Specify below)</option> 
        </select> 
      </div> 
      
      <!-- Hidden Conditional Container: Other Facility Category Description --> 
      <div id="clia_facility_other_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; margin-top: 8px;"> 
        <label for="clia_facility_other_text" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify facility classification: <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="clia_facility_other_text" placeholder="e.g., Corporate workplace wellness screening suite, forensic fluid center..." class="wizard-input-field"> 
      </div> 
    `; 
  };


  // --- PART 2 VALIDATION MATRIX ENGINE ---
  window.formRegistry['clia-certificate-part2-validation'] = {
    requiredFields: [
      { id: 'clia_director_name', msg: 'Full Legal Name of Laboratory Director is required.' },
      { id: 'clia_director_phone', msg: 'Director / Admin Phone Number is required.' },
      { id: 'clia_director_email', msg: 'Director / Admin Email Address is required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      // Presence loop pass
      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) { if (!el.value.trim()) setError(el, field.msg); else clearError(el); }
      });

      // Validate Director Email Layout String Formatting
      const emailEl = document.getElementById("clia_director_email");
      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        setError(emailEl, "Please enter a valid laboratory director or admin email address.");
      }

      // Validate Director Phone Number Character Length
      const phoneEl = document.getElementById("clia_director_phone");
      if (phoneEl && phoneEl.value.trim() && phoneEl.value.replace(/\D/g, "").length < 10) {
        setError(phoneEl, "Director / Admin Phone Number must contain at least 10 numbers.");
      }
      return { isValid, errors };
    }
  };

  // --- PART 3 VALIDATION MATRIX ENGINE ---
  window.formRegistry['clia-certificate-part3-validation'] = {
    requiredFields: [
      { id: 'clia_estimated_annual_tests', msg: 'Estimated Total Annual Test Volume is required.' },
      { id: 'clia_operating_hours', msg: 'Laboratory Operating Hours are required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      this.requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) { if (!el.value.trim()) setError(el, field.msg); else clearError(el); }
      });

      // Validate Annual Test Volume Numerical Range Logic
      const testsEl = document.getElementById("clia_estimated_annual_tests");
      if (testsEl && testsEl.value.trim()) {
        const parsedVal = parseInt(testsEl.value, 10);
        if (isNaN(parsedVal) || parsedVal < 0) {
          setError(testsEl, "Estimated Total Annual Test Volume must be a valid positive number.");
        }
      }

      // Sync Tax ID Rule Check with global tracker configuration fields
      const einEl = document.getElementById("clia_tax_id");
      if (einEl && einEl.value.trim() && einEl.value.replace(/\D/g, "").length !== 9) {
        setError(einEl, "Federal Tax Identification Number (EIN) must consist of exactly 9 digits (XX-XXXXXXX).");
      }
      return { isValid, errors };
    }
  };


  // --- PART 2 LAYOUT: ADMINISTRATIVE CONTACT & DIRECTOR REGISTRY ---
  window.formRegistry['clia-certificate-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 3: ADMINISTRATIVE CONTACT & DIRECTOR REGISTRY --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Laboratory Director &amp; Contact Registry</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Federal law mandates the declaration of an authorized Laboratory Director responsible for analytical quality metrics.</p> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="clia_director_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Full Legal Name of Laboratory Director <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="clia_director_name" required placeholder="First and Last Legal Name (MD, DO, PhD, or qualified operator)" class="wizard-input-field"> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="clia_director_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Director / Admin Phone Number <span style="color: #ef4444;">*</span></label> 
        <input type="tel" id="clia_director_phone" required placeholder="(512) 555-0199" class="wizard-input-field"> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="clia_director_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Director / Admin Email Address <span style="color: #ef4444;">*</span></label> 
        <input type="email" id="clia_director_email" required placeholder="director@labname.com" class="wizard-input-field"> </div> 

      <!-- SECTION 4: TESTING VOLUMES & FISCAL PARAMETERS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; margin-bottom: 8px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Analytical Volume Estimates</h3> </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="clia_estimated_annual_tests" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Estimated Total Annual Test Volume <span style="color: #ef4444;">*</span></label> 
        <input type="number" id="clia_estimated_annual_tests" required placeholder="e.g. 5000" min="0" class="wizard-input-field"> </div> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="clia_tax_id" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Tax Identification Number (EIN) <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="clia_tax_id" required placeholder="00-0000000" pattern="[0-9]{2}\\\\-[0-9]{7}" title="Please provide a valid 9-digit format (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace;"> </div> 
    `; 
  };


  // --- PART 3 LAYOUT: OPERATIONAL SCHEDULE & PROVISIONS ---
  window.formRegistry['clia-certificate-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 5: OPERATIONAL SCHEDULE --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Facility Operating Schedule</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="clia_operating_hours" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Laboratory Operating Hours <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="clia_operating_hours" required placeholder="e.g., Mon-Fri 8:00 AM - 5:00 PM, Sat Closed" class="wizard-input-field"> 
      </div> 

      <!-- SECTION 6: ADDITIONAL PROVISIONS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Additional Provisions &amp; State Specific Parameters</h3> 
      </div> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="clia_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Directives or Multi-Site Exceptions</label> 
        <textarea id="clia_provisions" placeholder="Detail any regional director multi-site exemptions, specialty menu criteria..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
      </div> 
    `; 
  };

  // ============================================================================ // 
  // âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (CLIA CONDITIONAL TABS)
  // ============================================================================ // 
  window.toggleCliaFacilityOtherSpecificationVisibility = function(value) {
    const wrapper = document.getElementById("clia_facility_other_wrapper");
    const input = document.getElementById("clia_facility_other_text");
    if (!wrapper) return;
    
    if (value === "other") {
      wrapper.style.setProperty("display", "grid", "important");
      if (input) input.setAttribute("required", "required");
    } else {
      wrapper.style.setProperty("display", "none", "important");
      if (input) {
        input.removeAttribute("required");
        input.value = "";
        input.style.borderColor = "#cbd5e1";
      }
    }
  };

  // ============================================================================ // 
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (CLIA CERTIFICATE REGISTRATION)
// ============================================================================ // 
window.toggleCliaFacilityOtherSpecificationVisibility = function(value) { 
  const otherWrapper = document.getElementById("clia_facility_other_wrapper"); 
  const otherInput = document.getElementById("clia_facility_other_text"); 
  
  if (!otherWrapper) return; 
  
  if (value === "other") { 
    otherWrapper.style.setProperty("display", "grid", "important"); // Preserves layout structure continuity
    if (otherInput) otherInput.setAttribute("required", "required"); 
  } else { 
    otherWrapper.style.setProperty("display", "none", "important"); 
    if (otherInput) { 
      otherInput.removeAttribute("required"); 
      otherInput.value = ""; 
      otherInput.style.borderColor = "#cbd5e1"; // Safely resets validation highlights
    } 
  } 
};

// ============================================================================ // 
// ðŸ“¦ MASTER CLIA CERTIFICATE FORM ASSEMBLY HOOK (UNIFIED)
// ============================================================================ // 
window.formRegistry['clia-certificate-form-master'] = function(stateDropdownOptionsHtml = "") { 
  return window.formRegistry['clia-certificate-part1-layout'](stateDropdownOptionsHtml) + 
         window.formRegistry['clia-certificate-part2-layout'](stateDropdownOptionsHtml) + 
         window.formRegistry['clia-certificate-part3-layout'](stateDropdownOptionsHtml); 
}; 

// Close the core initialization function block
}

// Global execution runtime ignition hook
initCliaCertificateServices();

