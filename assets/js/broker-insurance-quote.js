// ============================================================================ // 
// ðŸš› SYSTEM COMPLIANCE SERVICE: BROKER INSURANCE QUOTE ENGINE (PART 1)
// ============================================================================ // 

function initBrokerInsuranceQuoteServices() {
  window.formRegistry = window.formRegistry || {};

  // --- PART 1 VALIDATION MATRIX ---
  window.formRegistry['broker-insurance-quote-part1-validation'] = {
    requiredFields: [
      { id: 'bins_legal_name', errId: 'err_bins_legal_name', msg: 'Official freight brokerage name is required.' },
      { id: 'bins_base_state', errId: 'err_bins_base_state', msg: 'Please pick your corporate base state.' },
      { id: 'bins_contingent_cargo', errId: 'err_bins_contingent_cargo', msg: 'Please pick a contingent cargo liability request tier.' },
      { id: 'bins_broker_liability', errId: 'err_bins_broker_liability', msg: 'Please specify an option for freight broker general liability.' }
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

      // Base required items check loop
      this.requiredFields.forEach(f => {
        const inputEl = document.getElementById(f.id); const errorEl = document.getElementById(f.errId);
        if (inputEl) { if (!inputEl.value.trim()) markInvalid(inputEl, errorEl, f.msg); else markValid(inputEl, errorEl); }
      });

      // Optional MC Number custom match syntax validation check
      const mcField = document.getElementById('bins_mc_number'); const mcErr = document.getElementById('err_bins_mc_number');
      if (mcField && mcErr) {
        if (mcField.value.trim()) {
          const rawMc = mcField.value.trim().toUpperCase();
          if (!/^(MC|MX)?-?\d+$/.test(rawMc)) {
            markInvalid(mcField, mcErr, "Please enter a valid MC designation format (e.g., MC-123456).");
          } else { markValid(mcField, mcErr); }
        } else { markValid(mcField, mcErr); }
      }

      return { isValid, errors };
    }
  };


  // --- PART 1 LAYOUT: RISK AND COVERAGE CEILINGS ---
  window.formRegistry['broker-insurance-quote-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP --> 
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;"> 
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Freight Broker Insurance Lead Clearinghouse & BMC-85 Financial Network</strong> 
        Operating safely as an FMCSA licensed property broker requires robust risk management parameter shields to insulate your logistics firm from vicarious liability claims. <span style="font-weight: 700; color: var(--primary);">âš  Crucial Disclosing Provision:</span> Filings4u is a specialized commercial document filing service organization. We are not a licensed insurance agency, brokerage, or underwriter, and we do not sell insurance policies directly. All risk profile metrics submitted here are securely routed to our premium licensed insurance entity partners to compile and issue a competitive, non-binding quote tailored to your brokerage. <span style="font-weight: 700; color: var(--navy);">Notice:</span> Financial underwriting requests through this channel are strictly structured for **BMC-85 Trust Fund ($75,000 Cash Escrow Settlement)** options. 
      </div> 

      <!-- SECTION 1: BROKER RISK ASSESSMENT PROFILE --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Broker Corporate Risk Profile</h3> 
      </div> 

      <!-- FIELD 1: OFFICIAL FREIGHT BROKERAGE NAME --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bins_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Freight Brokerage Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bins_legal_name" required placeholder="Enter name exactly as registered on your corporate state records or MC profile" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_bins_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 2: MC NUMBER --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_mc_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">MC Number (If Pending/Issued)</label> 
        <input type="text" id="bins_mc_number" placeholder="e.g., MC-000000" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_bins_mc_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 3: CORPORATE BASE STATE --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_base_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Corporate Base State <span style="color: #ef4444;">*</span></label> 
        <select id="bins_base_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="" disabled selected>Select State...</option> 
          ${stateDropdownOptionsHtml} 
        </select> 
        <div class="wizard-error-message" id="err_bins_base_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- SECTION 2: CONTINGENT LIABILITY LIMITS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Contingent Risk Coverage Ceilings</h3> 
      </div> 

      <!-- FIELD 4: CONTINGENT CARGO LIABILITY --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_contingent_cargo" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Contingent Cargo Liability Request <span style="color: #ef4444;">*</span></label> 
        <select id="bins_contingent_cargo" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="100k" selected>$100,000 Contingent Cargo Limit (Standard baseline preferred by most domestic shippers)</option> 
          <option value="250k">$250,000 Contingent Cargo Limit (Enhanced structural tier for high-value logistics tracking)</option> 
          <option value="500k">$500,000 Contingent Cargo Limit (Premium specialized commodity carrier matching matrix)</option> 
          <option value="none">Exclude Contingent Cargo (Seeking BMC-85 Trust Account quotation parameters only)</option> 
        </select> 
        <div class="wizard-error-message" id="err_bins_contingent_cargo" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 5: FREIGHT BROKER LIABILITY --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_broker_liability" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Freight Broker Liability (FBL) Limit <span style="color: #ef4444;">*</span></label> 
        <select id="bins_broker_liability" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="none" selected>Exclude Freight Broker General Liability</option> 
          <option value="1m">$1,000,000 General Liability Bracket (Protects against third-party bodily injury / property damage claims)</option> 
          <option value="2m">$2,000,000 Extended General Liability Bracket</option> 
        </select> 
        <div class="wizard-error-message" id="err_bins_broker_liability" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };


  // --- PART 2 VALIDATION MATRIX ENGINE ---
  window.formRegistry['broker-insurance-quote-part2-validation'] = {
    requiredFields: [
      { id: 'bins_marital_status', errId: 'err_bins_marital_status', msg: 'Please specify your current marital status.' },
      { id: 'bins_has_bankruptcy', errId: 'err_bins_has_bankruptcy', msg: 'Please clarify bankruptcy status parameters.' },
      { id: 'bins_has_felony', errId: 'err_bins_has_felony', msg: 'Please clarify background felony histories.' },
      { id: 'bins_has_tax_liens', errId: 'err_bins_has_tax_liens', msg: 'Please specify outstanding tax lien parameters.' }
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

      // Base required items check loop
      this.requiredFields.forEach(f => {
        const inputEl = document.getElementById(f.id); const errorEl = document.getElementById(f.errId);
        if (inputEl) { if (!inputEl.value.trim()) markInvalid(inputEl, errorEl, f.msg); else markValid(inputEl, errorEl); }
      });

      // Conditional Bankruptcy Field Check
      const bankruptcyField = document.getElementById('bins_has_bankruptcy');
      const bankruptcyWrapper = document.getElementById('bins_bankruptcy_details_wrapper');
      const bankruptcyDetailsField = document.getElementById('bins_bankruptcy_details');
      const bankruptcyDetailsErr = document.getElementById('err_bins_bankruptcy_details');
      if (bankruptcyWrapper && (bankruptcyWrapper.style.display === "block" || bankruptcyWrapper.style.display === "grid" || (bankruptcyField && bankruptcyField.value === "yes"))) {
        if (!bankruptcyDetailsField || !bankruptcyDetailsField.value.trim()) {
          markInvalid(bankruptcyDetailsField, bankruptcyDetailsErr, "Underwriters require bankruptcy details and filing types.");
        } else { markValid(bankruptcyDetailsField, bankruptcyDetailsErr); }
      } else if (bankruptcyDetailsField && bankruptcyDetailsErr) { markValid(bankruptcyDetailsField, bankruptcyDetailsErr); }

      // Conditional Felony Field Check
      const felonyField = document.getElementById('bins_has_felony');
      const felonyWrapper = document.getElementById('bins_felony_details_wrapper');
      const felonyDetailsField = document.getElementById('bins_felony_details');
      const felonyDetailsErr = document.getElementById('err_bins_felony_details');
      if (felonyWrapper && (felonyWrapper.style.display === "block" || felonyWrapper.style.display === "grid" || (felonyField && felonyField.value === "yes"))) {
        if (!felonyDetailsField || !felonyDetailsField.value.trim()) {
          markInvalid(felonyDetailsField, felonyDetailsErr, "Explanations are mandatory when background histories are declared.");
        } else { markValid(felonyDetailsField, felonyDetailsErr); }
      } else if (felonyDetailsField && felonyDetailsErr) { markValid(felonyDetailsField, felonyDetailsErr); }

      return { isValid, errors };
    }
  };

  // --- PART 3 VALIDATION MATRIX ENGINE ---
  window.formRegistry['broker-insurance-quote-part3-validation'] = {
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

      // Validate Projected Monthly Shipments
      const loadsField = document.getElementById('bins_projected_loads'); const loadsErr = document.getElementById('err_bins_projected_loads');
      if (loadsField && loadsErr) {
        const val = parseInt(loadsField.value, 10);
        if (isNaN(val) || val < 0) {
          markInvalid(loadsField, loadsErr, "Please enter a valid projected shipments count (0 or greater).");
        } else { markValid(loadsField, loadsErr); }
      }

      // Validate Logistics Experience Years
      const expField = document.getElementById('bins_years_experience'); const expErr = document.getElementById('err_bins_years_experience');
      if (expField && expErr) {
        const val = parseInt(expField.value, 10);
        if (isNaN(val) || val < 0) {
          markInvalid(expField, expErr, "Please enter a valid number for years of experience (0 or greater).");
        } else { markValid(expField, expErr); }
      }

      return { isValid, errors };
    }
  };


  // --- PART 2 LAYOUT: UNDERWRITING BACKGROUND BACKGROUND QUESTIONNAIRE ---
  window.formRegistry['broker-insurance-quote-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 3: UNDERWRITING BACKGROUND RISK QUESTIONNAIRE --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Principal Underwriting & Background Risk Assessment</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">BMC-85 trust fund underwriters require personal background disclosures to assess financial stability, operational compliance, and processing risk tiers.</p> 
      </div> 

      <!-- FIELD 1: MARITAL STATUS DROPDOWN --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_marital_status" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Marital Status <span style="color: #ef4444;">*</span></label> 
        <select id="bins_marital_status" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="" disabled selected>Select Status...</option> 
          <option value="single">Single</option> 
          <option value="married">Married (May qualify for optimized financial accountability tiers)</option> 
          <option value="divorced">Divorced / Separated</option> 
          <option value="widowed">Widowed</option> 
        </select> 
        <div class="wizard-error-message" id="err_bins_marital_status" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 2: BANKRUPTCY DROPDOWN --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_has_bankruptcy" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Prior Personal or Business Bankruptcy? <span style="color: #ef4444;">*</span></label> 
        <select id="bins_has_bankruptcy" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;" onchange="toggleBrokerInsuranceBankruptcyDetailsVisibility(this.value)"> 
          <option value="no" selected>No, explicitly zero history of structural insolvency or Chapter filings</option> 
          <option value="yes">Yes, a past personal or business bankruptcy record exists</option> 
        </select> 
        <div class="wizard-error-message" id="err_bins_has_bankruptcy" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- Hidden Conditional Container: Bankruptcy Verification Details --> 
      <div id="bins_bankruptcy_details_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;"> 
        <label for="bins_bankruptcy_details" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify bankruptcy type, filing date, and discharge status: <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bins_bankruptcy_details" placeholder="e.g., Chapter 7 discharged in 2021, Chapter 11 corporate wrap..." class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_bins_bankruptcy_details" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 3: FELONY DROPDOWN --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_has_felony" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Any Felony Convictions or Legal Judgments? <span style="color: #ef4444;">*</span></label> 
        <select id="bins_has_felony" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;" onchange="toggleBrokerInsuranceFelonyDetailsVisibility(this.value)"> 
          <option value="no" selected>No, principal officers possess completely clear background records</option> 
          <option value="yes">Yes, legal background histories or pending statutory counts exist</option> 
        </select> 
        <div class="wizard-error-message" id="err_bins_has_felony" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- Hidden Conditional Container: Felony Background Explanations --> 
      <div id="bins_felony_details_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;"> 
        <label for="bins_felony_details" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify year, charge classification, and resolution status: <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="bins_felony_details" placeholder="Provide background profile details for underwriting review..." class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_bins_felony_details" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 4: TAX LIENS DROPDOWN --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_has_tax_liens" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Any Outstanding Tax Liens or Judgments? <span style="color: #ef4444;">*</span></label> 
        <select id="bins_has_tax_liens" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="no" selected>No outstanding state or federal tax liens are filed against the principal</option> 
          <option value="yes">Yes, active state/federal tax lien parameters exist or are being resolved</option> 
        </select> 
        <div class="wizard-error-message" id="err_bins_has_tax_liens" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };


  // --- PART 3 LAYOUT: FREIGHT VOLUMES & SPECIAL NOTES ---
  window.formRegistry['broker-insurance-quote-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 4: OPERATIONAL VOLUMES --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Projected Freight Volumes</h3> 
      </div> 

      <!-- FIELD 5: PROJECTED MONTHLY LOADS --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_projected_loads" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Projected Monthly Shipments / Loads <span style="color: #ef4444;">*</span></label> 
        <input type="number" id="bins_projected_loads" required placeholder="0" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_bins_projected_loads" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 6: YEARS EXPERIENCE --> 
      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="bins_years_experience" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Years of Transportation Logistics Experience <span style="color: #ef4444;">*</span></label> 
        <input type="number" id="bins_years_experience" required placeholder="0" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_bins_years_experience" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- SECTION 5: ADDITIONAL PROVISIONS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Handling Directives & Background Notes</h3> 
      </div> 

      <!-- FIELD 7: OPTIONAL TEXTAREA --> 
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="bins_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Instructions or Explanatory Background Notes</label> 
        <textarea id="bins_provisions" placeholder="Detail any specific commodity focus lines, partner asset tracking requirements..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
      </div> 
    `; 
  };

  // ============================================================================ // 
  // 4. INTERACTIVE INTERFACE CONTROLLERS (CONDITIONAL DISPLAY VISIBILITY)
  // ============================================================================ // 
  window.toggleBrokerInsuranceBankruptcyDetailsVisibility = function(value) {
    const wrapper = document.getElementById("bins_bankruptcy_details_wrapper");
    const input = document.getElementById("bins_bankruptcy_details");
    if (!wrapper) return;
    if (value === "yes") {
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

  window.toggleBrokerInsuranceFelonyDetailsVisibility = function(value) {
    const wrapper = document.getElementById("bins_felony_details_wrapper");
    const input = document.getElementById("bins_felony_details");
    if (!wrapper) return;
    if (value === "yes") {
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
  // 5. MASTER RENDER SYSTEM ALLOCATION (FIXED CONTEXT ARGS)
  // ============================================================================ // 
  window.formRegistry['broker-insurance-quote-form-master'] = function(stateDropdownOptionsHtml = "") { 
    return window.formRegistry['broker-insurance-quote-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['broker-insurance-quote-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['broker-insurance-quote-part3-layout'](stateDropdownOptionsHtml); 
  }; 
}

// Ignition
initBrokerInsuranceQuoteServices();

