// ============================================================================ // 
// ðŸªª SYSTEM COMPLIANCE SERVICE: CAGE CODE ENGINE (PART 1 OF 3)
// ============================================================================ // 

function initCageCodeServices() {
  window.formRegistry = window.formRegistry || {};

  // --- PART 1 VALIDATION MATRIX ENGINE ---
  window.formRegistry['cage-code-part1-validation'] = {
    requiredFields: [
      { id: 'cage_legal_name', errId: 'err_cage_legal_name', msg: 'Official business entity name is required.' },
      { id: 'cage_federal_ein', errId: 'err_cage_federal_ein', msg: 'A standard 9-digit EIN is required (e.g., 12-3456789).' },
      { id: 'cage_state_of_formation', errId: 'err_cage_state_of_formation', msg: 'Please select your state of formation.' },
      { id: 'cage_physical_street', errId: 'err_cage_physical_street', msg: 'Physical facility address is required.' },
      { id: 'cage_physical_city', errId: 'err_cage_physical_city', msg: 'City location parameter is required.' },
      { id: 'cage_physical_state', errId: 'err_cage_physical_state', msg: 'Please choose your facility state location.' },
      { id: 'cage_physical_zip', errId: 'err_cage_physical_zip', msg: 'Zip Code is required.' },
      { id: 'cage_primary_naics', errId: 'err_cage_primary_naics', msg: 'Primary 6-digit NAICS code is required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const markInvalid = (inputEl, errorEl, msg) => {
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
        if (inputEl) inputEl.style.borderColor = "#ef4444";
        isValid = false; if (!errors.includes(msg)) errors.push(msg);
      };
      const markValid = (inputEl, errorEl) => {
        if (errorEl) { errorEl.textContent = ""; errorEl.style.display = "none"; }
        if (inputEl) inputEl.style.borderColor = "#cbd5e1";
      };

      // Base presence loop checkpass
      this.requiredFields.forEach(f => {
        const inputEl = document.getElementById(f.id); const errorEl = document.getElementById(f.errId);
        if (inputEl) { if (!inputEl.value.trim()) markInvalid(inputEl, errorEl, f.msg); else markValid(inputEl, errorEl); }
      });

      // Strict Check: Federal EIN (9 digits)
      const einField = document.getElementById('cage_federal_ein'); const einErr = document.getElementById('err_cage_federal_ein');
      if (einField && einField.value.trim() && einField.value.replace(/\D/g, "").length !== 9) {
        markInvalid(einField, einErr, "A standard 9-digit EIN is required (e.g., 12-3456789).");
      }

      // Strict Check: Physical Address & Enforce DLA "No P.O. Box" Rule
      const streetField = document.getElementById('cage_physical_street'); const streetErr = document.getElementById('err_cage_physical_street');
      if (streetField && streetField.value.trim() && /\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i.test(streetField.value.trim())) {
        markInvalid(streetField, streetErr, "DLA security mandates strictly prohibit P.O. Boxes for facility profile registration.");
      }

      // Strict Check: Primary NAICS Code (6 Numerical Characters)
      const naicsField = document.getElementById('cage_primary_naics'); const naicsErr = document.getElementById('err_bins_primary_naics');
      if (naicsField && naicsField.value.trim() && !/^[0-9]{6}$/.test(naicsField.value.trim())) {
        markInvalid(naicsField, naicsErr, "NAICS parameters must consist of exactly 6 numerical numbers (e.g., 541511).");
      }

      // Optional Check: Secondary NAICS Format Verification
      const secondaryField = document.getElementById('cage_secondary_naics'); const secondaryErr = document.getElementById('err_cage_secondary_naics');
      if (secondaryField && secondaryField.value.trim()) {
        const individualCodes = secondaryField.value.split(','); let cleanListValid = true;
        for (let code of individualCodes) { if (!/^[0-9]{6}$/.test(code.trim())) { cleanListValid = false; break; } }
        if (!cleanListValid) markInvalid(secondaryField, secondaryErr, "Multi-NAICS segments must be comma-separated list of 6-digit values.");
        else markValid(secondaryField, secondaryErr);
      }
      return { isValid, errors };
    }
  };


  // --- PART 1 LAYOUT: CONTRACTOR BASELINE AND NAICS ---
  window.formRegistry['cage-code-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: CAGE CODE REGISTRATION --> 
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;"> 
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Federal CAGE Code Procurement Backplane</strong> 
        A Commercial and Government Entity (CAGE) Code is a specialized five-character identifier assigned by the Defense Logistics Agency (DLA). It is a mandatory structural parameter for corporate entities tracking federal grants, executing Department of Defense (DoD) procurement contracts, and securing facility clearances. <span style="font-weight: 700; color: var(--primary);">âš¡ Proxy Fulfillment Mode:</span> Filings4u acts as your official third-party proxy agent to prepare, validate, and execute this configuration sequence through the DLA and federal data backplanes. 
      </div> 

      <!-- SECTION 1: COMMERCIAL CONTRACTOR BASELINE PROFILE --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Contractor Identification Profile</h3> 
      </div> 

      <!-- FIELD 1: OFFICIAL BUSINESS ENTITY NAME --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cage_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Business Entity Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cage_legal_name" required placeholder="Enter exact legal name matching state registration and IRS files" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_cage_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 2: EMPLOYER IDENTIFICATION NUMBER (EIN) --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Employer Identification Number (EIN) <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cage_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_cage_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 3: STATE OF FORMATION --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">State of Formation <span style="color: #ef4444;">*</span></label> 
        <select id="cage_state_of_formation" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="" disabled selected>Select State...</option> 
          ${stateDropdownOptionsHtml} 
        </select> 
        <div class="wizard-error-message" id="err_cage_state_of_formation" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 4: PHYSICAL FACILITY ADDRESS --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cage_physical_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Physical Facility Address <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cage_physical_street" required placeholder="Street Name and Number, Suite, Unit (No P.O. Boxes allowed by DLA)" class="wizard-input-field" style="width: 100%; box-sizing: border-box;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'cage_physical')"> 
        <div class="wizard-error-message" id="err_cage_physical_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- PHYSICAL LOCATION SUB-METRICS LAYER --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;"> 
          <div> 
            <label for="cage_physical_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="cage_physical_city" required placeholder="City" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
            <div class="wizard-error-message" id="err_cage_physical_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
          <div> 
            <label for="cage_physical_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
            <select id="cage_physical_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
              <option value="" disabled selected>Select State...</option> 
              ${stateDropdownOptionsHtml} 
            </select> 
            <div class="wizard-error-message" id="err_cage_physical_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
          <div> 
            <label for="cage_physical_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="cage_physical_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; box-sizing: border-box;" class="wizard-input-field"> 
            <div class="wizard-error-message" id="err_cage_physical_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
        </div> 
      </div> 

      <!-- SECTION 2: NAICS CLASSIFICATION LEDGER --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Core NAICS Classification Ledger</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Input your primary 6-digit North American Industry Classification System (NAICS) codes targeted for government procurement matches.</p> 
      </div> 

      <!-- FIELD 5: PRIMARY NAICS CODE --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_primary_naics" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary 6-Digit NAICS Code <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cage_primary_naics" required placeholder="e.g., 541511 (Custom Computer Programming)" maxlength="6" style="font-family: monospace; width: 100%; box-sizing: border-box;" class="wizard-input-field"> 
        <div class="wizard-error-message" id="err_cage_primary_naics" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 6: OPTIONAL SECONDARY NAICS CODES --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_secondary_naics" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Secondary NAICS Code(s)</label> 
        <input type="text" id="cage_secondary_naics" placeholder="e.g., 541512, 541611 (Comma separated if multiple)" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_cage_secondary_naics" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };


  // --- PART 2 VALIDATION MATRIX ENGINE ---
  window.formRegistry['cage-code-part2-validation'] = {
    requiredFields: [
      { id: 'cage_ownership_type', errId: 'err_cage_ownership_type', msg: 'Please specify your business ownership classification.' },
      { id: 'cage_has_parent', errId: 'err_cage_has_parent', msg: 'Please clarify if your company possesses a parent enterprise.' },
      { id: 'cage_psc_codes', errId: 'err_cage_psc_codes', msg: 'At least one Federal Product or Service Code (PSC) is required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const markInvalid = (inputEl, errorEl, msg) => {
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
        if (inputEl) inputEl.style.borderColor = "#ef4444";
        isValid = false; if (!errors.includes(msg)) errors.push(msg);
      };
      const markValid = (inputEl, errorEl) => {
        if (errorEl) { errorEl.textContent = ""; errorEl.style.display = "none"; }
        if (inputEl) inputEl.style.borderColor = "#cbd5e1";
      };

      // Base presence loop checkpass
      this.requiredFields.forEach(f => {
        const inputEl = document.getElementById(f.id); const errorEl = document.getElementById(f.errId);
        if (inputEl) { if (!inputEl.value.trim()) markInvalid(inputEl, errorEl, f.msg); else markValid(inputEl, errorEl); }
      });

      // Conditional Parent Enterprise Field Check
      const parentFlagField = document.getElementById('cage_has_parent');
      const parentWrapper = document.getElementById('cage_parent_company_wrapper');
      const parentNameField = document.getElementById('cage_parent_legal_name');
      const parentNameErr = document.getElementById('err_cage_parent_legal_name');
      const parentCodeField = document.getElementById('cage_parent_cage_code');
      const parentCodeErr = document.getElementById('err_cage_parent_cage_code');

      if (parentWrapper && (parentWrapper.style.display === "grid" || parentWrapper.style.display === "block" || (parentFlagField && parentFlagField.value === "yes"))) {
        if (!parentNameField || !parentNameField.value.trim()) {
          markInvalid(parentNameField, parentNameErr, "Parent company legal name is required when subsidiary tracking is selected.");
        } else { markValid(parentNameField, parentNameErr); }

        if (parentCodeField && parentCodeErr && parentCodeField.value.trim()) {
          const parentCodeVal = parentCodeField.value.trim().toUpperCase();
          if (!/^[A-Z0-9]{5}$/.test(parentCodeVal)) {
            markInvalid(parentCodeField, parentCodeErr, "A legacy parent CAGE code must consist of exactly 5 alphanumeric characters.");
          } else { markValid(parentCodeField, parentCodeErr); parentCodeField.value = parentCodeVal; }
        }
      } else {
        if (parentNameField && parentNameErr) markValid(parentNameField, parentNameErr);
        if (parentCodeField && parentCodeErr) markValid(parentCodeField, parentCodeErr);
      }

      return { isValid, errors };
    }
  };

  // --- PART 3 VALIDATION MATRIX ENGINE ---
  window.formRegistry['cage-code-part3-validation'] = {
    requiredFields: [
      { id: 'cage_poc_name', errId: 'err_cage_poc_name', msg: 'Point of Contact (POC) full legal name is required.' },
      { id: 'cage_poc_phone', errId: 'err_cage_poc_phone', msg: 'Point of Contact phone number is required.' },
      { id: 'cage_poc_email', errId: 'err_cage_poc_email', msg: 'Point of Contact email address is required.' }
    ],
    validate: function() {
      let isValid = true; let errors = [];
      const markInvalid = (inputEl, errorEl, msg) => {
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
        if (inputEl) inputEl.style.borderColor = "#ef4444";
        isValid = false; if (!errors.includes(msg)) errors.push(msg);
      };
      const markValid = (inputEl, errorEl) => {
        if (errorEl) { errorEl.textContent = ""; errorEl.style.display = "none"; }
        if (inputEl) inputEl.style.borderColor = "#cbd5e1";
      };

      this.requiredFields.forEach(f => {
        const inputEl = document.getElementById(f.id); const errorEl = document.getElementById(f.errId);
        if (inputEl) { if (!inputEl.value.trim()) markInvalid(inputEl, errorEl, f.msg); else markValid(inputEl, errorEl); }
      });

      // Strict Administrative POC Email Validation
      const pocEmailField = document.getElementById('cage_poc_email'); const pocEmailErr = document.getElementById('err_cage_poc_email');
      if (pocEmailField && pocEmailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pocEmailField.value.trim())) {
        markInvalid(pocEmailField, pocEmailErr, "Please enter a valid administrative email pattern (e.g., name@domain.com).");
      }

      return { isValid, errors };
    }
  };


  // --- PART 2 LAYOUT: BUSINESS OWNERSHIP & SECURITY PROFILE ---
  window.formRegistry['cage-code-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 3: OWNERSHIP & SECURITY PROFILE --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Business Ownership & Security Profile</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The Defense Logistics Agency requests baseline data indicators to align federal security and sourcing layers.</p> 
      </div> 

      <!-- FIELD 1: OWNERSHIP CLASSIFICATION --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_ownership_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Ownership Classification <span style="color: #ef4444;">*</span></label> 
        <select id="cage_ownership_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="us-owned" selected>U.S. Owned and Operated Commercial Entity</option> 
          <option value="foreign-owned">Foreign Owned Entity / International Parent Alliance</option> 
          <option value="joint-venture">Joint Venture / Corporate Consortium Block</option> 
        </select> 
        <div class="wizard-error-message" id="err_cage_ownership_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 2: PARENT FLAG SELECTION --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_has_parent" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Does this entity have a legal Parent Company? <span style="color: #ef4444;">*</span></label> 
        <select id="cage_has_parent" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;" onchange="toggleCageParentCompanyWrapperVisibility(this.value)"> 
          <option value="no" selected>No, this is an independent / standalone corporate structure</option> 
          <option value="yes">Yes, this entity is a subsidiary of a parent holding enterprise</option> 
        </select> 
        <div class="wizard-error-message" id="err_cage_has_parent" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- Hidden Conditional Container: Parent Company Core Identifiers --> 
      <div id="cage_parent_company_wrapper" style="grid-column: span 2; display: none; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; grid-template-columns: 2fr 1fr; gap: 16px;"> 
        <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Immediate Parent Entity Credentials</span> 
        
        <!-- CONDITIONAL FIELD: PARENT LEGAL NAME --> 
        <div class="wizard-input-group" style="margin: 0;"> 
          <label for="cage_parent_legal_name" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Parent Company Legal Name <span style="color: #ef4444;">*</span></label> 
          <input type="text" id="cage_parent_legal_name" placeholder="Official Parent Name" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
          <div class="wizard-error-message" id="err_cage_parent_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        </div> 
        
        <!-- CONDITIONAL FIELD: PARENT CAGE CODE --> 
        <div class="wizard-input-group" style="margin: 0;"> 
          <label for="cage_parent_cage_code" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Parent CAGE Code (If Known)</label> 
          <input type="text" id="cage_parent_cage_code" placeholder="e.g. 1ABC2" maxlength="5" style="font-family: monospace; text-transform: uppercase; width: 100%; box-sizing: border-box;" class="wizard-input-field"> 
          <div class="wizard-error-message" id="err_cage_parent_cage_code" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        </div> 
      </div> 

      <!-- SECTION 4: PRODUCT/SERVICE CLASSIFICATION CODES --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Product & Service Codes (PSC) Mapping</h3> 
      </div> 

      <!-- FIELD 3: PSC CODES --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cage_psc_codes" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Product and Service Codes (PSC) <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cage_psc_codes" required placeholder="e.g. D302 (IT Systems Development), R408 (Program Management Support), Comma separated if multiple" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_cage_psc_codes" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };


  // --- PART 3 LAYOUT: GOVERNMENT POINT OF CONTACT ---
  window.formRegistry['cage-code-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 5: FULFILLMENT POINTS OF CONTACT --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Government Point of Contact (POC)</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide the designated administrative contact person for the Defense Logistics Agency (DLA) validation loops.</p> 
      </div> 

      <!-- FIELD 4: POC FULL LEGAL NAME --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cage_poc_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">POC Full Legal Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="cage_poc_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_cage_poc_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 5: POC PHONE NUMBER --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_poc_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">POC Phone Number <span style="color: #ef4444;">*</span></label> 
        <input type="tel" id="cage_poc_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_cage_poc_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 6: POC EMAIL ADDRESS --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="cage_poc_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">POC Email Address <span style="color: #ef4444;">*</span></label> 
        <input type="email" id="cage_poc_email" required placeholder="poc@company.com" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_cage_poc_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- SECTION 6: ADDITIONAL PROVISIONS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Special Clauses & Directives</h3> </div> 

      <!-- FIELD 7: OPTIONAL TEXTAREA --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="cage_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Directives or Contract Reference Notes</label> 
        <textarea id="cage_provisions" placeholder="Detail any immediate bidding deadlines..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
      </div> 
    `; 
  };

  // ============================================================================ // 
  // âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (CAGE CODE SUBSIDIARY FIELDS)
  // ============================================================================ // 
  window.toggleCageParentCompanyWrapperVisibility = function(value) {
    const wrapper = document.getElementById("cage_parent_company_wrapper");
    const parentName = document.getElementById("cage_parent_legal_name");
    
    if (!wrapper) return;
    
    if (value === "yes") {
      wrapper.style.setProperty("display", "grid", "important");
      if (parentName) parentName.setAttribute("required", "required");
    } else {
      wrapper.style.setProperty("display", "none", "important");
      if (parentName) {
        parentName.removeAttribute("required");
        parentName.value = "";
        parentName.style.borderColor = "#cbd5e1";
      }
      const parentCode = document.getElementById("cage_parent_cage_code");
      if (parentCode) { parentCode.value = ""; parentCode.style.borderColor = "#cbd5e1"; }
    }
  };

  // ============================================================================ // 
  // ðŸ“¦ MASTER RENDER SYSTEM ALLOCATION
  // ============================================================================ // 
  window.formRegistry['cage-code-form-master'] = function(stateDropdownOptionsHtml = "") { 
    return window.formRegistry['cage-code-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['cage-code-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['cage-code-part3-layout'](stateDropdownOptionsHtml); 
  }; 
}

// Ignition
initCageCodeServices();


