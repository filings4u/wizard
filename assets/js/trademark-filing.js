// ============================================================================ //
// ðŸ› ï¸ TRADEMARK FILING PART 1 VALIDATION MATRIX ENGINE 
// ============================================================================ //
const trademarkFilingPart1Validation = {
  requiredFields: [
    { id: 'tm_applicant_name', msg: "Applicant's Full Name or Company Name is required." },
    { id: 'tm_applicant_street', msg: "Applicant's Mailing Street Address is required." },
    { id: 'tm_applicant_city', msg: "Applicant's City is required." },
    { id: 'tm_applicant_state', msg: "Applicant's State selection is required." },
    { id: 'tm_applicant_zip', msg: "Applicant's Zip Code is required." },
    { id: 'tm_applicant_phone', msg: "Applicant's Phone Number is required." },
    { id: 'tm_applicant_email', msg: "Applicant's Email Address is required." },
    { id: 'tm_proposed_name', msg: 'Proposed Trademark Name is required.' },
    { id: 'tm_type_choice', msg: 'Trademark Type selection is required.' },
    { id: 'tm_goods_services_desc', msg: 'Description of Goods/Services is required.' }
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

    // 2. Validate Postal ZIP Pattern Format
    const zipEl = document.getElementById("tm_applicant_zip");
    if (zipEl && zipEl.value.trim() && !/^\d{5}$/.test(zipEl.value.trim())) {
      setError(zipEl, 'Applicant Zip Code must consist of exactly 5 numbers.');
    }

    // 3. Validate Applicant Email Structure
    const emailEl = document.getElementById("tm_applicant_email");
    if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      setError(emailEl, "Please enter a valid applicant email address.");
    }

    // 4. Validate Phone Number Numerical Baseline Length
    const phoneEl = document.getElementById("tm_applicant_phone");
    if (phoneEl && phoneEl.value.trim()) {
      const pureDigits = phoneEl.value.replace(/\D/g, "");
      if (pureDigits.length < 10) setError(phoneEl, "Applicant's Phone Number must contain at least 10 numbers.");
    }

    return { isValid, errors };
  }
};

// FAMILY 4A: TRADEMARK FILING APPLICATION LAYOUT MATRIX (PART 1 OF 3)
function buildTrademarkFilingPart1(stateDropdownOptionsHtml = "") {
  return `
    <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS A TRADEMARK? -->
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
      <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Trademark?</strong> A Trademark is a specialized legal protection issued by the USPTO that secures exclusive rights over your company's brand name, logos, slogans, or distinctive identifiers, legally preventing competitors from exploiting similar assets or causing market confusion.
    </div>

    <!-- SECTION 1: APPLICANT INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Applicant Information</h3>
    </div>
    
    <!-- REPAIRED SYSTEM INPUT NODE: Injected missing input tag beneath layout label -->
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_applicant_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Applicant's Full Name or Company Name <span style="color: #ef4444;">*</span></label>
      
    </div>

    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_applicant_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Applicant's Mailing Street Address <span style="color: #ef4444;">*</span></label>
      <input type="text" id="tm_applicant_street" required placeholder="Street Name and Number, Suite, Unit" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,\\\\s]+" title="Please provide a valid address layout." class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'tm_applicant')">
    </div>

    <div class="wizard-input-group" style="grid-column: span 2;">
      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
        <div>
          <label for="tm_applicant_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
          <input type="text" id="tm_applicant_city" required placeholder="City" pattern="[A-Za-z\\\\s\\\\-\\\\.]+" title="Valid text characters required." class="wizard-input-field">
        </div>
        <div>
          <label for="tm_applicant_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
          <select id="tm_applicant_state" required class="wizard-input-field" style="font-weight: 600;">
            ${stateDropdownOptionsHtml}
          </select>
        </div>
        <div>
          <label for="tm_applicant_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
          <input type="text" id="tm_applicant_zip" required placeholder="Zip Code" pattern="[0-9]{5}(\\\\-[0-9]{4})?" title="5 digit standard postal code required." style="font-family: monospace;" class="wizard-input-field">
        </div>
      </div>
    </div>

    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="tm_applicant_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Applicant's Phone Number <span style="color: #ef4444;">*</span></label>
      <input type="tel" id="tm_applicant_phone" required placeholder="(512) 555-0199" class="wizard-input-field">
    </div>

    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="tm_applicant_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Applicant's Email Address <span style="color: #ef4444;">*</span></label>
      <input type="email" id="tm_applicant_email" required placeholder="email@example.com" class="wizard-input-field">
    </div>

    <!-- SECTION 2: TRADEMARK INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Trademark Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="tm_proposed_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Proposed Trademark Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="tm_proposed_name" required placeholder="The brand name or text phrase you wish to register" class="wizard-input-field">
    </div>
    <div class="wizard-input-group" style="grid-column: span 1;">
      <label for="tm_type_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Trademark Type <span style="color: #ef4444;">*</span></label>
      <select id="tm_type_choice" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select Type...</option>
        <option value="word-mark">Word mark (Standard text styling and letters only)</option>
        <option value="design-mark">Design mark (Stylized graphic icon illustration or standalone logo)</option>
        <option value="combined-mark">Combined mark (Graphic logo elements coupled with stylized brand text)</option>
      </select>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_goods_services_desc" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Description of Goods/Services <span style="color: #ef4444;">*</span></label>
      <textarea id="tm_goods_services_desc" required placeholder="Briefly describe the commercial products, retail items, or commercial services associated with this trademark..." class="wizard-input-field" style="width: 100%; min-height: 70px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
    </div>
  `;
}

// Global registry setup matrix tracking allocation routes
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['trademark-filing-part1-layout'] = buildTrademarkFilingPart1;
window.formRegistry['trademark-filing-part1-validation'] = trademarkFilingPart1Validation;

// ============================================================================ //
// ðŸ› ï¸ TRADEMARK FILING PART 2 VALIDATION MATRIX ENGINE 
// ============================================================================ //
const trademarkFilingPart2Validation = {
  requiredFields: [
    { id: 'tm_filing_basis', msg: 'Filing Basis selection is required.' },
    { id: 'tm_search_conducted', msg: 'Please answer if you have conducted a trademark search.' }
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

    // 2. Conditional Check: Validate Specimen fields if basis matches USE IN COMMERCE
    const filingBasis = document.getElementById("tm_filing_basis");
    if (filingBasis && filingBasis.value === "use-in-commerce") {
      const descEl = document.getElementById("tm_specimen_desc");
      const fileEl = document.getElementById("tm_specimen_file");

      if (descEl && !descEl.value.trim()) setError(descEl, "Description of the Specimen is required."); else clearError(descEl);
      if (fileEl && !fileEl.value.trim()) setError(fileEl, "Please upload a copy of the specimen document file."); else clearError(fileEl);
    }

    // 3. Conditional Check: Validate results field if search selection matches YES
    const searchConducted = document.getElementById("tm_search_conducted");
    if (searchConducted && searchConducted.value === "yes") {
      const resultsEl = document.getElementById("tm_search_results_data");
      if (resultsEl && !resultsEl.value.trim()) {
        setError(resultsEl, "Please provide structural details of your trademark search results.");
      } else if (resultsEl) {
        clearError(resultsEl);
      }
    }

    // 4. Conditional Check: Validate search service dropdown if selection matches NO
    if (searchConducted && searchConducted.value === "no") {
      const searchServiceEl = document.getElementById("tm_add_search_service");
      if (searchServiceEl && !searchServiceEl.value.trim()) {
        setError(searchServiceEl, "Please confirm your brand clearance search option choice.");
      } else if (searchServiceEl) {
        clearError(searchServiceEl);
      }
    }

    return { isValid, errors };
  }
};

// FAMILY 4A: TRADEMARK FILING APPLICATION LAYOUT MATRIX (PART 2 OF 3)
function buildTrademarkFilingPart2(stateDropdownOptionsHtml = "") {
  return `
    <!-- SECTION 3: FILING BASIS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Filing Basis</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_filing_basis" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please select the filing basis <span style="color: #ef4444;">*</span></label>
      <select id="tm_filing_basis" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleTrademarkSpecimenWorkflow(this.value)">
        <option value="" disabled selected>Select Filing Basis...</option>
        <option value="use-in-commerce">Use in Commerce (The trademark is already being actively used in public trade/sales)</option>
        <option value="intent-to-use">Intent to Use (The trademark is not currently in use but you plan to use it commercially soon)</option>
      </select>
    </div>

    <!-- SECTION 4: SPECIMEN INFORMATION (CONDITIONAL) -->
    <div id="tm_specimen_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 8px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Specimen Information</h3>
      </div>
      <div class="wizard-input-group" style="margin: 0; width: 100%;">
        <label for="tm_specimen_desc" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Description of the Specimen <span style="color: #ef4444;">*</span></label>
        <input type="text" id="tm_specimen_desc" placeholder="e.g. Logo printed on product retail tag, website checkout snapshot, branded packaging..." class="wizard-input-field">
      </div>
      <div class="wizard-input-group" style="margin: 0; width: 100%;">
        <label for="tm_specimen_file" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Upload a copy of the specimen showing the trademark as used in commerce <span style="color: #ef4444;">*</span></label>
        <input type="file" id="tm_specimen_file" class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff;">
      </div>
    </div>

    <!-- SECTION 5: TRADEMARK SEARCH -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Trademark Search</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_search_conducted" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Have you conducted a trademark search to check for similar existing trademarks? <span style="color: #ef4444;">*</span></label>
      <select id="tm_search_conducted" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleTrademarkSearchAssistanceVisibility(this.value)">
        <option value="" disabled selected>Select Option...</option>
        <option value="yes">Yes, we have run comprehensive clearance check reviews</option>
        <option value="no">No, we have not completely cross-referenced conflicting entries</option>
      </select>
    </div>

    <!-- Dynamic Group A: User selected YES to search results -->
    <div id="tm_search_details_wrapper" style="grid-column: span 2; display: none;">
      <div class="wizard-input-group" style="margin: 0; width: 100%;">
        <label for="tm_search_results_data" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please provide details of the search results: <span style="color: #ef4444;">*</span></label>
        <input type="text" id="tm_search_results_data" placeholder="Detail any findings, matching TESS records, or similar design codes discovered..." class="wizard-input-field">
      </div>
    </div>

    <!-- Dynamic Group B: User selected NO to search results -->
    <div id="tm_search_assistance_wrapper" style="grid-column: span 2; display: none;">
      <div class="wizard-input-group" style="margin: 0; width: 100%;">
        <label for="tm_add_search_service" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Would you like to use filings4u Search Service for $79? <span style="color: #ef4444;">*</span></label>
        <select id="tm_add_search_service" class="wizard-input-field" style="font-weight: 600;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }">
          <option value="no" selected>No, I will review existing conflicting filings independently</option>
          <option value="yes">Yes, add Filings4u Comprehensive Brand Clearance Search â€” $79.00</option>
        </select>
      </div>
    </div>
  `;
}

// Global registry setup matrix tracking allocation routes
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['trademark-filing-part2-layout'] = buildTrademarkFilingPart2;
window.formRegistry['trademark-filing-part2-validation'] = trademarkFilingPart2Validation;

// ============================================================================ //
// ðŸ› ï¸ TRADEMARK FILING PART 3 VALIDATION MATRIX ENGINE 
// ============================================================================ //
const trademarkFilingPart3Validation = {
  requiredFields: [
    { id: 'tm_has_attorney', msg: 'Please specify if an attorney is filing this application.' },
    { id: 'tm_renewal_awareness', msg: 'Please select an option for trademark renewal awareness.' }
  ],

  validate: function() {
    let isValid = true;
    let errors = [];

    const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
    const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

    // 1. Check baseline mandatory selection elements presence
    this.requiredFields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        if (!el.value.trim()) setError(el, field.msg); else clearError(el);
      }
    });

    // 2. Conditional Check: Validate Attorney Profile block if choice is YES
    const hasAttorney = document.getElementById("tm_has_attorney");
    if (hasAttorney && hasAttorney.value === "yes") {
      const attorneyFields = [
        { id: 'tm_attorney_name', msg: "Attorney's Full Name is required." },
        { id: 'tm_attorney_firm', msg: "Attorney's Firm Name is required." },
        { id: 'tm_attorney_street', msg: 'Firm Street Address is required.' },
        { id: 'tm_attorney_city', msg: 'Attorney City is required.' },
        { id: 'tm_attorney_state', msg: 'Attorney State selection is required.' },
        { id: 'tm_attorney_zip', msg: 'Attorney Zip Code is required.' },
        { id: 'tm_attorney_phone', msg: "Attorney's Phone Number is required." },
        { id: 'tm_attorney_email', msg: "Attorney's Email Address is required." }
      ];

      attorneyFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
          const val = el.value.trim();
          let isFieldValid = !!val;

          if (field.id === 'tm_attorney_zip' && val && !/^\d{5}$/.test(val)) {
            isFieldValid = false;
            setError(el, 'Attorney Zip Code must be exactly 5 digits.');
          }

          if (field.id === 'tm_attorney_email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            isFieldValid = false;
            setError(el, "Please enter a valid attorney email address.");
          }

          if (!isFieldValid) {
            setError(el, field.msg);
          } else if ((field.id !== 'tm_attorney_zip' && field.id !== 'tm_attorney_email') || isFieldValid) {
            clearError(el);
          }
        }
      });
    }

    return { isValid, errors };
  }
};

// FAMILY 4A: TRADEMARK FILING APPLICATION LAYOUT MATRIX (PART 3 OF 3)
function buildTrademarkFilingPart3(stateDropdownOptionsHtml = "") {
  return `
    <!-- SECTION 6: ATTORNEY INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Attorney Information (If Applicable)</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_has_attorney" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Is an attorney filing this application on your behalf? <span style="color: #ef4444;">*</span></label>
      <select id="tm_has_attorney" required class="wizard-input-field" style="font-weight: 600;" onchange="toggleTrademarkAttorneyWrapperVisibility(this.value)">
        <option value="no" selected>No, I am filing as an independent individual or corporate officer</option>
        <option value="yes">Yes, legal counsel is representing this trademark execution</option>
      </select>
    </div>

    <!-- Hidden Conditional Container: Attorney Records Layout Matrix -->
    <div id="tm_attorney_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">
      <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Counsel of Record Entry Data</span>
        <div class="wizard-input-group" style="margin: 0;">
          <label for="tm_attorney_name" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Attorney's Full Name <span style="color: #ef4444;">*</span></label>
          <input type="text" id="tm_attorney_name" placeholder="Full Legal Name" class="wizard-input-field">
        </div>
        <div class="wizard-input-group" style="margin: 0;">
          <label for="tm_attorney_firm" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Attorney's Firm Name <span style="color: #ef4444;">*</span></label>
          <input type="text" id="tm_attorney_firm" placeholder="Legal Practice or Firm Entity" class="wizard-input-field">
        </div>
        <div class="wizard-input-group" style="grid-column: span 2; margin: 0;">
          <label for="tm_attorney_street" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Firm Street Address <span style="color: #ef4444;">*</span></label>
          <input type="text" id="tm_attorney_street" placeholder="Street Address, Suite, Floor" class="wizard-input-field" onfocus="attachGooglePlacesAutocompleteToNode(this, 'tm_attorney')">
        </div>
        <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; box-sizing: border-box;">
          <div>
            <label for="tm_attorney_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
            <input type="text" id="tm_attorney_city" placeholder="City" class="wizard-input-field">
          </div>
          <div>
            <label for="tm_attorney_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
            <select id="tm_attorney_state" class="wizard-input-field" style="font-weight: 600;">
              ${stateDropdownOptionsHtml}
            </select>
          </div>
          <div>
            <label for="tm_attorney_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
            <input type="text" id="tm_attorney_zip" placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field">
          </div>
        </div>
        <div class="wizard-input-group" style="margin: 0;">
          <label for="tm_attorney_phone" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Attorney's Phone Number <span style="color: #ef4444;">*</span></label>
          <input type="tel" id="tm_attorney_phone" placeholder="(512) 555-0199" class="wizard-input-field">
        </div>
        <div class="wizard-input-group" style="margin: 0;">
          <label for="tm_attorney_email" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Attorney's Email Address <span style="color: #ef4444;">*</span></label>
          <input type="email" id="tm_attorney_email" placeholder="counsel@firm.com" class="wizard-input-field">
        </div>
      </div>
    </div>

    <!-- SECTION 7: ADDITIONAL PROVISIONS -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Additional Provisions</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Provisions</label>
      <textarea id="tm_provisions" placeholder="Detail any optional fields for specific clauses, disclaimers, color claims, or agreements related to the trademark application..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
    </div>

    <!-- SECTION 8: DURATION AND RENEWAL INFORMATION -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">8. Duration and Renewal Information</h3>
    </div>
    <div class="wizard-input-group" style="grid-column: span 2;">
      <label for="tm_renewal_awareness" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Are you aware of the trademark renewal requirements? <span style="color: #ef4444;">*</span></label>
      <select id="tm_renewal_awareness" required class="wizard-input-field" style="font-weight: 600;">
        <option value="" disabled selected>Select Option...</option>
        <option value="yes">Yes, I am aware that a Declaration of Use must be filed between years 5 and 6, and renewals occur every 10 years</option>
        <option value="no">No, I would like Filings4u to manage renewal lifecycle tracking indices via dashboard notification logs</option>
      </select>
    </div>
  `;
}
window.buildTrademarkFilingPart3 = buildTrademarkFilingPart3;

// ðŸ“¦ MASTER USPTO TRADEMARK FILING APPLICATION ASSEMBLY HOOK
function buildTrademarkFilingForm(stateDropdownOptionsHtml = "") {
  return buildTrademarkFilingPart1(stateDropdownOptionsHtml) + buildTrademarkFilingPart2(stateDropdownOptionsHtml) + buildTrademarkFilingPart3(stateDropdownOptionsHtml);
}

// Global registry setup matrix tracking allocation routes
if (!window.formRegistry) window.formRegistry = {};
window.formRegistry['trademark-filing-part3-layout'] = buildTrademarkFilingPart3;
window.formRegistry['trademark-filing-part3-validation'] = trademarkFilingPart3Validation;
window.formRegistry['trademark-filing-form-master'] = buildTrademarkFilingForm;

// ============================================================================ //
// âš™ï¸ INTERACTIVE INTERFACE CONTROLLERS (TRADEMARK FILING APPLICATION)
// ============================================================================ //

window.toggleTrademarkSpecimenWorkflow = function(value) {
  const specimenWrapper = document.getElementById("tm_specimen_wrapper");
  if (!specimenWrapper) return;

  const inputs = specimenWrapper.querySelectorAll("input");

  if (value === "use-in-commerce") {
    specimenWrapper.style.setProperty("display", "flex", "important");
    inputs.forEach(el => el.setAttribute("required", "required"));
  } else {
    specimenWrapper.style.setProperty("display", "none", "important");
    inputs.forEach(el => { el.removeAttribute("required"); el.value = ""; });
  }
};

window.toggleTrademarkSearchAssistanceVisibility = function(value) {
  const detailsWrapper = document.getElementById("tm_search_details_wrapper");
  const assistanceWrapper = document.getElementById("tm_search_assistance_wrapper");
  const auditSelect = document.getElementById("tm_add_search_service");

  if (!detailsWrapper || !assistanceWrapper) return;

  if (value === "yes") {
    detailsWrapper.style.setProperty("display", "block", "important");
    assistanceWrapper.style.setProperty("display", "none", "important");
    if (auditSelect) { auditSelect.value = "no"; auditSelect.removeAttribute("required"); }
    window.customSelectedTrademarkSearchServiceActive = false; // Turn off search fee
  } else {
    detailsWrapper.style.setProperty("display", "none", "important");
    assistanceWrapper.style.setProperty("display", "block", "important");
    if (auditSelect) auditSelect.setAttribute("required", "required");
    window.customSelectedTrademarkSearchServiceActive = (auditSelect && auditSelect.value === "yes");
  }
  if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla();
};

window.toggleTrademarkAttorneyWrapperVisibility = function(value) {
  const attyWrapper = document.getElementById("tm_attorney_wrapper");
  if (!attyWrapper) return;

  const fields = attyWrapper.querySelectorAll("input, select");

  if (value === "yes") {
    attyWrapper.style.setProperty("display", "flex", "important");
    fields.forEach(el => el.setAttribute("required", "required"));
  } else {
    attyWrapper.style.setProperty("display", "none", "important");
    fields.forEach(el => { el.removeAttribute("required"); el.value = ""; });
  }
};

