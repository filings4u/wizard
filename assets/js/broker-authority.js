// ============================================================================ // 
// ðŸš› SYSTEM COMPLIANCE SERVICE: BROKER AUTHORITY ENGINE (PART 1 - SECTION 1)
// ============================================================================ // 

function initBrokerAuthorityServices() {
  window.formRegistry = window.formRegistry || {};

  // --- PART 1 LAYOUT: SECTION 1 ONLY ---
  window.formRegistry['broker-authority-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;"> 
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> FMCSA Property Broker Authority Mandates</strong> 
        To arrange transportation of property or household goods for compensation, you must obtain a Property Broker License (Operating Authority) from the FMCSA.
      </div> 

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Corporate Broker Profile</h3> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="ba_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Legal Business Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="ba_legal_name" required placeholder="Exact name registered with IRS" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_ba_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="ba_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">EIN (Employer ID) <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="ba_federal_ein" required placeholder="00-0000000" class="wizard-input-field" style="font-family: monospace; width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_ba_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="ba_base_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Base State <span style="color: #ef4444;">*</span></label> 
        <select id="ba_base_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="" disabled selected>Select Base State...</option> 
          ${stateDropdownOptionsHtml} 
        </select> 
        <div class="wizard-error-message" id="err_ba_base_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };



  // --- PART 1 LAYOUT: SECTION 1 ADDRESS GRID ---
  window.formRegistry['broker-authority-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return `
      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="ba_physical_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Place of Business Address <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="ba_physical_street" required placeholder="Physical Address (FMCSA regulations strictly prohibit P.O. Boxes)" class="wizard-input-field" style="width: 100%; box-sizing: border-box;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ba_physical')"> 
        <div class="wizard-error-message" id="err_ba_physical_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;"> 
          <div> 
            <label for="ba_physical_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="ba_physical_city" required placeholder="City" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
            <div class="wizard-error-message" id="err_ba_physical_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
          <div> 
            <label for="ba_physical_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label> 
            <select id="ba_physical_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
              <option value="" disabled selected>Select...</option> 
              ${stateDropdownOptionsHtml} 
            </select> 
            <div class="wizard-error-message" id="err_ba_physical_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
          <div> 
            <label for="ba_physical_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label> 
            <input type="text" id="ba_physical_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; box-sizing: border-box;" class="wizard-input-field"> 
            <div class="wizard-error-message" id="err_ba_physical_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
          </div> 
        </div> 
      </div> 

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Broker Classification Sub-Type</h3> 
      </div> 

      <div class="wizard-input-group" style="grid-column: span 2;"> 
        <label for="ba_classification_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Logistics Broker Configuration Profile <span style="color: #ef4444;">*</span></label> 
        <select id="ba_classification_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="" disabled selected>Select Broker Sub-Type...</option> 
          <option value="property">Broker of Property (Except Household Goods)</option> 
          <option value="household-goods">Broker of Household Goods (Moving and Relocations)</option> 
          <option value="both">Dual Classification (Both general freight and household goods)</option> 
        </select> 
        <div class="wizard-error-message" id="err_ba_classification_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };


  // ============================================================================ // 
  // 3. COMPREHENSIVE ENGINE VALIDATORS (PARTS 1 & 2)
  // ============================================================================ // 

  // --- PART 1 VALIDATION MATRIX ENGINE ---
  window.formRegistry['broker-authority-part1-validation'] = {
    requiredFields: [
      { id: 'ba_legal_name', errId: 'err_ba_legal_name', msg: 'Legal business name or entity title is required.' },
      { id: 'ba_federal_ein', errId: 'err_ba_federal_ein', msg: 'Employer Identification Number (EIN) is required.' },
      { id: 'ba_base_state', errId: 'err_ba_base_state', msg: 'Please select your logistics base state of operations.' },
      { id: 'ba_physical_street', errId: 'err_ba_physical_street', msg: 'Principal place of business address is required.' },
      { id: 'ba_physical_city', errId: 'err_ba_physical_city', msg: 'City coordinate is required.' },
      { id: 'ba_physical_state', errId: 'err_ba_physical_state', msg: 'Please pick your business state coordinate.' },
      { id: 'ba_physical_zip', errId: 'err_ba_physical_zip', msg: 'Zip Code is required.' },
      { id: 'ba_classification_type', errId: 'err_ba_classification_type', msg: 'Please choose a logistics broker configuration profile.' }
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

      const einField = document.getElementById('ba_federal_ein'); const einErr = document.getElementById('err_ba_federal_ein');
      if (einField && einField.value.trim() && einField.value.replace(/\D/g, "").length !== 9) {
        markInvalid(einField, einErr, "A standard 9-digit EIN is required (e.g., 12-3456789).");
      }

      const streetField = document.getElementById('ba_physical_street'); const streetErr = document.getElementById('err_ba_physical_street');
      if (streetField && streetField.value.trim() && /\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i.test(streetField.value.trim())) {
        markInvalid(streetField, streetErr, "FMCSA regulatory standards strictly prohibit P.O. Box locations for licensed property brokers.");
      }
      return { isValid, errors };
    }
  };

  // --- PART 2 VALIDATION MATRIX ENGINE ---
  window.formRegistry['broker-authority-part2-validation'] = {
    requiredFields: [
      { id: 'ba_bond_type', errId: 'err_ba_bond_type', msg: 'Please select your planned federal financial responsibility instrument.' },
      { id: 'ba_partner_quote_choice', errId: 'err_ba_partner_quote_choice', msg: 'Please clarify your partner bond procurement preference.' },
      { id: 'ba_officer_name', errId: 'err_ba_officer_name', msg: 'Authorized representative full legal name is required.' },
      { id: 'ba_officer_phone', errId: 'err_ba_officer_phone', msg: 'Direct contact phone number is required.' },
      { id: 'ba_officer_email', errId: 'err_ba_officer_email', msg: 'Corporate communications email is required.' }
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

      const emailField = document.getElementById('ba_officer_email'); const emailErr = document.getElementById('err_ba_officer_email');
      if (emailField && emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        markInvalid(emailField, emailErr, "Please supply a valid representative email format.");
      }
      return { isValid, errors };
    }
  };

  // ============================================================================ // 
  // 4. MASTER SYSTEMS INTEGRATION HOOK
  // ============================================================================ // 
  window.formRegistry['broker-authority-form-master'] = function(stateDropdownOptionsHtml = "") {
    const layout1 = typeof window.formRegistry['broker-authority-part1-layout'] === 'function' ? window.formRegistry['broker-authority-part1-layout'](stateDropdownOptionsHtml) : '';
    const layout2 = typeof window.formRegistry['broker-authority-part2-layout'] === 'function' ? window.formRegistry['broker-authority-part2-layout'](stateDropdownOptionsHtml) : '';
    return layout1 + layout2;
  }
};

// Ignition
initBrokerAuthorityServices();


  // --- PART 2 LAYOUT: FINANCIAL SECURITY MATRIX ---
  window.formRegistry['broker-authority-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    return ` 
      <!-- SECTION 3: MANDATORY FEDERAL FINANCIAL GUARANTEE MATRIX --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Federal Financial Responsibility Mandate ($75,000 Guarantee)</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The FMCSA strictly mandates that all licensed property brokers maintain a continuous financial instrument of $75,000 to safely settle freight payment disputes.</p> 
      </div> 

      <!-- STRUCTURAL INSURANCE EXPLANATION TILES --> 
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: rgba(10, 31, 68, 0.01); box-sizing: border-box;"> 
        <div style="background: #ffffff; border: 1px solid var(--border); padding: 14px; border-radius: 8px; box-sizing: border-box; font-size: 0.8rem; line-height: 1.45;"> 
          <strong style="color: var(--navy); display: block; margin-bottom: 6px;"><i class="fa-solid fa-shield-halved"></i> BMC-84 Broker Surety Bond</strong> An annual premium payment model requiring zero collateral locking. Issued through an authorized treasury-listed surety corporation, underwriting rates are assigned based on personal credit tier maps. This is the standard operational pathway preferred by modern corporate brokerages. 
        </div> 
        <div style="background: #ffffff; border: 1px solid var(--border); padding: 14px; border-radius: 8px; box-sizing: border-box; font-size: 0.8rem; line-height: 1.45;"> 
          <strong style="color: var(--navy); display: block; margin-bottom: 6px;"><i class="fa-solid fa-building-columns"></i> BMC-85 Broker Trust Fund</strong> Requires an upfront cash deposition of the full $75,000 principal balance. This asset matrix is held securely inside a designated trust bank entity or escrow institution throughout the operational lifespan of your MC number, fully locking your liquidity. 
        </div> 
      </div> 

      <!-- FIELD 1: BOND TYPE DROPDOWN --> 
      <div class="wizard-input-group" style="grid-column: span 1; margin-top: 8px;"> 
        <label for="ba_bond_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Planned Security Choice <span style="color: #ef4444;">*</span></label> 
        <select id="ba_bond_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;"> 
          <option value="bmc-84" selected>BMC-84 Surety Bond (Annual Premium Risk Allocation)</option> 
          <option value="bmc-85">BMC-85 Trust Fund ($75,000 Cash Escrow Settlement)</option> 
          <option value="not-sure">Undecided / Reviewing Operational Capital</option> 
        </select> 
        <div class="wizard-error-message" id="err_ba_bond_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIELD 2: QUOTE CHOICE DROPDOWN --> 
      <div class="wizard-input-group" style="grid-column: span 1; margin-top: 8px;"> 
        <label for="ba_partner_quote_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Procure Partner Bond Quote? <span style="color: #ef4444;">*</span></label> 
        <select id="ba_partner_quote_choice" required class="wizard-input-field" style="font-weight: 600; border: 1px solid var(--primary); width: 100%; box-sizing: border-box;"> 
          <option value="yes" selected>Yes, route my application data to Filings4u partners for a free, fast BMC-84 premium quote</option> 
          <option value="no">No, I am utilizing an independent private bonding agent / market path</option> 
        </select> 
        <div class="wizard-error-message" id="err_ba_partner_quote_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 
    `; 
  };


window.formRegistry['broker-authority-part3-layout'] = function(stateDropdownOptionsHtml = "") { 
  return ` 
    <!-- SECTION 4: AUTHORIZED PROCESS OFFICIAL --> 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Authorized Broker Representative</h3> 
      <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide the contact details for the primary legal representative authorized to sign off on federal logistics filings.</p> 
    </div> 

    <!-- FIELD 3: REPRESENTATIVE NAME --> 
    <div class="wizard-input-group" style="grid-column: span 2;"> 
      <label for="ba_officer_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Representative Full Legal Name <span style="color: #ef4444;">*</span></label> 
      <input type="text" id="ba_officer_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
      <div class="wizard-error-message" id="err_ba_officer_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div> 

    <!-- FIELD 4: PHONE NUMBER --> 
    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ba_officer_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Direct Phone Number <span style="color: #ef4444;">*</span></label> 
      <input type="tel" id="ba_officer_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
      <div class="wizard-error-message" id="err_ba_officer_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div>

    <!-- FIELD 5: EMAIL ADDRESS --> 
    <div class="wizard-input-group" style="grid-column: span 1;"> 
      <label for="ba_officer_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Corporate Communications Email <span style="color: #ef4444;">*</span></label> 
      <input type="email" id="ba_officer_email" required placeholder="logistics@yourcompany.com" class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
      <div class="wizard-error-message" id="err_ba_officer_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div> 

    <!-- SECTION 5: ADDITIONAL PROVISIONS --> 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Handling Directives & Logistics Notes</h3> 
    </div> 

    <!-- FIELD 6: OPTIONAL TEXTAREA --> 
    <div class="wizard-input-group" style="grid-column: span 2;"> 
      <label for="ba_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Brokerage Instructions or Setup Notes</label> 
      <textarea id="ba_provisions" placeholder="Detail any immediate freight launching timelines, specialized cargo categories..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea> 
    </div> 
  `; 
};


// Master Render System Allocation
window.formRegistry['broker-authority-form-master'] = function(stateDropdownOptionsHtml = "") { 
  // FIXED: Functions are now properly executed using () brackets and receive arguments cleanly
  return window.formRegistry['broker-authority-part1-layout'](stateDropdownOptionsHtml) + 
         window.formRegistry['broker-authority-part2-layout']() + 
         window.formRegistry['broker-authority-part3-layout'](); 
}; 


