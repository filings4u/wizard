// ============================================================================ //
// ðŸ› ï¸ HAZMAT REGISTRATION MODULE VALIDATION MATRIX ENGINE                         //
// ============================================================================ //
function initHazmatRegistrationService() {
  // Global wizard registries allocation
  window.formRegistry = window.formRegistry || {};

  const part1Fields = [
    { id: 'haz_legal_name', msg: 'Official legal company name is required.' },
    { id: 'haz_usdot_number', msg: 'USDOT number is required.' },
    { id: 'haz_federal_ein', msg: 'A standard 9-digit EIN is required (e.g., 12-3456789).' },
    { id: 'haz_business_tier', msg: 'Please specify your federal business entity size classification.' }
  ];

  window.formRegistry['hazmat-registration-part1-validation'] = {
    requiredFields: part1Fields,
    validate: function() {
      let isValid = true;
      let errors = [];

      const setError = (el, msg) => {
        if (!el) return;
        isValid = false;
        el.style.setProperty("border-color", "#ef4444", "important");
        if (!errors.includes(msg)) errors.push(msg);
        
        const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.textContent = msg;
          errorMsgNode.style.setProperty("display", "block", "important");
        }
      };

      const clearError = (el) => {
        if (!el) return;
        el.style.removeProperty("border-color");
        
        const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.style.setProperty("display", "none", "important");
          errorMsgNode.textContent = "";
        }
      };

      // 1. Process Legal Business Name Presence Check
      const nameField = document.getElementById('haz_legal_name');
      if (nameField && (nameField.offsetWidth > 0 || nameField.offsetHeight > 0)) {
        const nameVal = nameField.value ? String(nameField.value).trim() : "";
        if (!nameVal) setError(nameField, "Official legal company name is required.");
        else clearError(nameField);
      }

      // 2. Process USDOT Number Matrix Checks (Pure Numerical String Validation)
      const dotField = document.getElementById('haz_usdot_number');
      if (dotField && (dotField.offsetWidth > 0 || dotField.offsetHeight > 0)) {
        const dotVal = dotField.value ? String(dotField.value).trim() : "";
        if (!dotVal) {
          setError(dotField, "USDOT number is required.");
        } else if (!/^\d+$/.test(dotVal)) {
          setError(dotField, "USDOT parameters must contain numbers only.");
        } else {
          clearError(dotField);
        }
      }

      // 3. Process Federal EIN Pattern Matrix Checks (Pure 9 Numeric Digits Validation)
      const einField = document.getElementById('haz_federal_ein');
      if (einField && (einField.offsetWidth > 0 || einField.offsetHeight > 0)) {
        const einVal = einField.value ? String(einField.value).trim() : "";
        const pureDigits = einVal.replace(/\D/g, "");
        if (pureDigits.length !== 9) {
          setError(einField, "A standard 9-digit EIN is required (e.g., 12-3456789).");
        } else {
          clearError(einField);
        }
      }

      // 4. Process Business Tier Dropdown Selection Check
      const tierField = document.getElementById('haz_business_tier');
      if (tierField && (tierField.offsetWidth > 0 || tierField.offsetHeight > 0)) {
        const tierVal = tierField.value ? String(tierField.value).trim() : "";
        if (!tierVal) setError(tierField, "Please specify your federal business entity size classification.");
        else clearError(tierField);
      }

      return { isValid, errors };
    }
  };

  // Sync back to historical standalone global function pointer just like previous modules
  window.validateHazmatRegistrationFormPart1 = function() {
    const outcome = window.formRegistry['hazmat-registration-part1-validation'].validate();
    return outcome.isValid;
  };
}

// Global invocation tracking configuration hook execution
window.initHazmatRegistrationService = initHazmatRegistrationService;


function buildHazmatRegistrationFormPart1(stateDropdownOptionsHtml = "") {
  return `
    <!-- PART 1 MASTER WRAPPER ELEMENT LAYER -->
    <div class="hazmat-template-wrapper-block" style="display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; grid-column: span 2;">

      <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP -->
      <div style="background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Pipeline and Hazardous Materials Safety Administration (PHMSA) Compliance</strong>
        Any business entity transporting or offering for transport specific types and quantities of hazardous materials in commerce must maintain a valid federal Hazardous Materials Registration certificate with the PHMSA department. Operating a commercial fleet unit handling placarded explosives, flammable gases, radioactive materials, or toxic-by-inhalation cargo without a processed PHMSA credential voids safety standing and brings substantial federal daily enforcement citations.
      </div>

      <!-- SECTION 1: HAZARDOUS MATERIALS CARRIER PROFILE -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Carrier Identity Profile</h3>
      </div>

      <!-- FIELD 1: OFFICIAL LEGAL COMPANY NAME -->
      <div class="wizard-input-group" style="margin-top: 12px;">
        <label for="haz_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Legal Company Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="haz_legal_name" required placeholder="Enter exact name registered with your USDOT number and state records" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
        <div class="wizard-error-message" id="err_haz_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SUB-GRID ROW MATRIX: FORCES USDOT & EIN SIDE-BY-SIDE -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
        <!-- FIELD 2: USDOT NUMBER -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="haz_usdot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">USDOT Number <span style="color: #ef4444;">*</span></label>
          <input type="text" id="haz_usdot_number" required placeholder="Enter USDOT Number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <div class="wizard-error-message" id="err_haz_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 3: EMPLOYER IDENTIFICATION NUMBER -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="haz_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Employer Identification Number (EIN) <span style="color: #ef4444;">*</span></label>
          <input type="text" id="haz_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <div class="wizard-error-message" id="err_haz_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- SECTION 2: PHMSA TIER CLASSIFICATIONS -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. PHMSA Regulatory Tier Selection</h3>
      </div>

      <!-- FIELD 4: BUSINESS SIZE DROPDOWN -->
      <div class="wizard-input-group" style="margin-top: 12px;">
        <label for="haz_business_tier" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Federal Business Entity Size Classification <span style="color: #ef4444;">*</span></label>
        <select id="haz_business_tier" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }">
          <option value="" disabled selected>Select Business Classification...</option>
          <option value="small">Small Business / Non-Profit Operator (Meets SBA size criteria parameters â€” Reduced federal registration fees apply)</option>
          <option value="large">Large Business Entity (Exceeds baseline SBA size parameters â€” Standard federal registration fees apply)</option>
        </select>
        <div class="wizard-error-message" id="err_haz_business_tier" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
}



// ============================================================================ //
// ðŸ› ï¸ FAMILY 31B: HAZMAT REGISTRATION LAYOUT MATRIX (PART 2 OF 3)               //
// ============================================================================ //
function buildHazmatRegistrationFormPart2(stateDropdownOptionsHtml = "") {
  return `
    <!-- PART 2 MASTER WRAPPER ELEMENT LAYER -->
    <div class="hazmat-template-wrapper-block" style="display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; grid-column: span 2;">

      <!-- SECTION 3: PHMSA MULTI-YEAR REGISTRATION PACKAGE SELECTION -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Registration Validity Multi-Period Package</h3>
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Select your planned multi-year processing horizon package. Selecting a multi-year setup locks in current rates and reduces annual filing overhead loops.</p>
      </div>

      <!-- FIELD 1: REGISTRATION PERIOD DROPDOWN -->
      <div class="wizard-input-group" style="margin-top: 12px;">
        <label for="haz_registration_period" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Filing Multi-Year Term Selection <span style="color: #ef4444;">*</span></label>
        <select id="haz_registration_period" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }">
          <option value="1-year" selected>1-Year Registration Term Package (Valid for the upcoming standard federal cycle)</option>
          <option value="2-year">2-Year Multi-Period Registration Term (Locks in pricing and structural tracking validations)</option>
          <option value="3-year">3-Year Extended Multi-Period Registration Term (Maximum authorized coverage block window)</option>
        </select>
        <div class="wizard-error-message" id="err_haz_registration_period" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SECTION 4: HAZARDOUS MATERIALS CARGO CLASS CATEGORIES CHECKLIST -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; margin-bottom: 8px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Hazardous Materials Commodity Profile Checklist</h3>
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Select the specific classifications of hazardous products your equipment asset frameworks are hauling (Check all that apply):</p>
      </div>

      <!-- HAZMAT COMMODITY GRID CONTAINER -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 16px; border-radius: 8px; box-sizing: border-box;">
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_1" value="explosives" style="margin-top: 3px;">
          <label for="haz_class_1" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 1: Explosives (Placardable quantities/divisions)</label>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_2" value="gases" style="margin-top: 3px;">
          <label for="haz_class_2" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 2: Gases (Flammable, non-flammable, or toxic variants)</label>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_3" value="flammable_liquids" style="margin-top: 3px;">
          <label for="haz_class_3" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 3: Flammable and Combustible Liquids (e.g. Fuel, Oils)</label>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_4" value="flammable_solids" style="margin-top: 3px;">
          <label for="haz_class_4" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 4: Flammable Solids / Spontaneously Combustible</label>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_5" value="oxidizers" style="margin-top: 3px;">
          <label for="haz_class_5" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 5: Oxidizers and Organic Peroxides</label>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_6" value="poisons" style="margin-top: 3px;">
          <label for="haz_class_6" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 6: Poisons, Toxic Substances, or Infectious Agents</label>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_7" value="radioactive" style="margin-top: 3px;">
          <label for="haz_class_7" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 7: Radioactive Materials (Yellow III label requirements)</label>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <input type="checkbox" id="haz_class_8" value="corrosives" style="margin-top: 3px;">
          <label for="haz_class_8" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 8: Corrosive Liquids or Solid Compounds</label>
        </div>
        <div class="wizard-error-message" id="err_haz_commodity_matrix" style="color: #ef4444; font-size: 0.75rem; margin-top: 8px; grid-column: span 2; display: none;"></div>
      </div>

    </div>
  `;
}


window.buildHazmatRegistrationFormPart2 = buildHazmatRegistrationFormPart2;

// ============================================================================ //
// ðŸ› ï¸ FAMILY 31C: HAZMAT REGISTRATION LAYOUT MATRIX (PART 3 OF 3)               //
// ============================================================================ //
function buildHazmatRegistrationFormPart3(stateDropdownOptionsHtml = "") {
  return `
    <!-- PART 3 MASTER WRAPPER ELEMENT LAYER -->
    <div class="hazmat-template-wrapper-block" style="display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; grid-column: span 2;">

      <!-- SECTION 5: AUTHORIZED SAFETY OFFICIAL POC -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Authorized Safety Official Contact</h3>
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide the profile details of the compliance or logistics manager responsible for PHMSA hazardous material cargo declarations.</p>
      </div>

      <!-- FIELD 2: POC FULL LEGAL NAME -->
      <div class="wizard-input-group" style="margin-top: 12px;">
        <label for="haz_poc_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Safety Official Full Legal Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="haz_poc_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
        <div class="wizard-error-message" id="err_haz_poc_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- SUB-GRID ROW MATRIX: FORCES PHONE AND EMAIL SIDE-BY-SIDE -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
        <!-- FIELD 3: POC PHONE NUMBER -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="haz_poc_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Direct Phone Number <span style="color: #ef4444;">*</span></label>
          <input type="tel" id="haz_poc_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <div class="wizard-error-message" id="err_haz_poc_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 4: POC EMAIL ADDRESS -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="haz_poc_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Compliance Communications Email <span style="color: #ef4444;">*</span></label>
          <input type="email" id="haz_poc_email" required placeholder="safety@yourcarrier.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <div class="wizard-error-message" id="err_haz_poc_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- SECTION 6: ADDITIONAL PROVISIONS -->
      <div style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Special Handling Directives & Hazmat Notes</h3>
      </div>

      <!-- FIELD 5: OPTIONAL TEXTAREA -->
      <div class="wizard-input-group" style="margin-top: 12px;">
        <label for="haz_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Special Carrier Instructions or Disclosure Notes</label>
        <textarea id="haz_provisions" placeholder="Detail any immediate shipping lane deadlines, bulk packaging exceptions, radioactive transport route permits, or custom proxy handling directives relative to your PHMSA HAZMAT registration dossier..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
      </div>

    </div>
  `;
}

window.buildHazmatRegistrationFormPart3 = buildHazmatRegistrationFormPart3;


// ============================================================================ // 
// ðŸ› ï¸ FAMILY 31A: HAZMAT REGISTRATION LAYOUT MATRIX (PART 2 OF 3)               // 
// ============================================================================ // 
function buildHazmatRegistrationFormPart2(stateDropdownOptionsHtml = "") { 
  return ` 
    <!-- MAIN GRID CONTAINER WRAPPER -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">

      <!-- SECTION 3: PHMSA MULTI-YEAR REGISTRATION PACKAGE SELECTION --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Registration Validity Multi-Period Package</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Select your planned multi-year processing horizon package. Selecting a multi-year setup locks in current rates and reduces annual filing overhead loops.</p> 
      </div> 

      <!-- FIELD 1: REGISTRATION PERIOD DROPDOWN WITH CLEAN ROUNDED BOUNDS --> 
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;"> 
        <label for="haz_registration_period" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Filing Multi-Year Term Selection <span style="color: #ef4444;">*</span></label> 
        <select id="haz_registration_period" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }"> 
          <option value="1-year" selected>1-Year Registration Term Package (Valid for the upcoming standard federal cycle)</option> 
          <option value="2-year">2-Year Multi-Period Registration Term (Locks in pricing and structural tracking validations)</option> 
          <option value="3-year">3-Year Extended Multi-Period Registration Term (Maximum authorized coverage block window)</option> 
        </select> 
        <div class="wizard-error-message" id="err_haz_registration_period" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- SECTION 4: HAZARDOUS MATERIALS CARGO CLASS CATEGORIES CHECKLIST --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; margin-bottom: 8px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Hazardous Materials Commodity Profile Checklist</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Select the specific classifications of hazardous products your equipment asset frameworks are hauling (Check all that apply):</p> 
      </div> 

      <!-- HAZMAT COMMODITY GRID CONTAINER --> 
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 16px; border-radius: 8px; box-sizing: border-box;"> 
        
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_1" value="explosives" style="margin-top: 3px;"> 
          <label for="haz_class_1" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 1: Explosives (Placardable quantities/divisions)</label> 
        </div> 
        
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_2" value="gases" style="margin-top: 3px;"> 
          <label for="haz_class_2" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 2: Gases (Flammable, non-flammable, or toxic variants)</label> 
        </div> 
        
        <!-- FIXED FOR ATTRIBUTE SYNTAX HERE -->
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_3" value="flammable_liquids" style="margin-top: 3px;"> 
          <label for="haz_class_3" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 3: Flammable and Combustible Liquids (e.g. Fuel, Oils)</label> 
        </div> 
        
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_4" value="flammable_solids" style="margin-top: 3px;"> 
          <label for="haz_class_4" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 4: Flammable Solids / Spontaneously Combustible</label> 
        </div> 
        
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_5" value="oxidizers" style="margin-top: 3px;"> 
          <label for="haz_class_5" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 5: Oxidizers and Organic Peroxides</label> 
        </div> 
        
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_6" value="poisons" style="margin-top: 3px;"> 
          <label for="haz_class_6" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 6: Poisons, Toxic Substances, or Infectious Agents</label> 
        </div> 
        
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_7" value="radioactive" style="margin-top: 3px;"> 
          <label for="haz_class_7" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 7: Radioactive Materials (Yellow III label requirements)</label> 
        </div> 
        
        <div style="display: flex; align-items: flex-start; gap: 8px;"> 
          <input type="checkbox" id="haz_class_8" value="corrosives" style="margin-top: 3px;"> 
          <label for="haz_class_8" style="font-size: 0.825rem; color: var(--navy); font-weight: 600; cursor: pointer;">Class 8: Corrosive Liquids or Solid Compounds</label> 
        </div> 
        
        <!-- GLOBAL MATRIX ERROR TEXT ROW --> 
        <div class="wizard-error-message" id="err_haz_commodity_matrix" style="color: #ef4444; font-size: 0.75rem; margin-top: 8px; grid-column: span 2; display: none;"></div> 
      </div>

    </div> <!-- END CONTAINER WRAPPER -->
  `; 
} 
window.buildHazmatRegistrationFormPart2 = buildHazmatRegistrationFormPart2;



// ============================================================================ // 
// ðŸ› ï¸ FAMILY 31A: HAZMAT REGISTRATION LAYOUT MATRIX (PART 3 OF 3)               // 
// ============================================================================ // 
function buildHazmatRegistrationFormPart3(stateDropdownOptionsHtml = "") { 
  return ` 
    <!-- MAIN GRID CONTAINER WRAPPER -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">

      <!-- SECTION 5: AUTHORIZED SAFETY OFFICIAL POC --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Authorized Safety Official Contact</h3> 
        <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide the profile details of the compliance or logistics manager responsible for PHMSA hazardous material cargo declarations.</p> 
      </div> 

      <!-- FIELD 2: POC FULL LEGAL NAME --> 
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;"> 
        <label for="haz_poc_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Safety Official Full Legal Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="haz_poc_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;"> 
        <div class="wizard-error-message" id="err_haz_poc_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
      </div> 

      <!-- FIXED REPAIRED SUB-GRID ROW MATRIX: FORCES PHONE AND EMAIL SIDE-BY-SIDE --> 
      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;"> 
        <!-- FIELD 3: POC PHONE NUMBER --> 
        <div class="wizard-input-group" style="margin: 0;"> 
          <label for="haz_poc_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Direct Phone Number <span style="color: #ef4444;">*</span></label> 
          <input type="tel" id="haz_poc_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;"> 
          <div class="wizard-error-message" id="err_haz_poc_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        </div> 

        <!-- FIELD 4: POC EMAIL ADDRESS --> 
        <div class="wizard-input-group" style="margin: 0;"> 
          <label for="haz_poc_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Compliance Communications Email <span style="color: #ef4444;">*</span></label> 
          <input type="email" id="haz_poc_email" required placeholder="safety@yourcarrier.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;"> 
          <div class="wizard-error-message" id="err_haz_poc_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        </div> 
      </div> 

      <!-- SECTION 6: ADDITIONAL PROVISIONS --> 
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Special Handling Directives & Hazmat Notes</h3> 
      </div> 

      <!-- FIELD 5: OPTIONAL TEXTAREA --> 
      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;"> 
        <label for="haz_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Special Carrier Instructions or Disclosure Notes</label> 
        <textarea id="haz_provisions" placeholder="Detail any immediate shipping lane deadlines, bulk packaging exceptions, radioactive transport route permits, or custom proxy handling directives relative to your PHMSA HAZMAT registration dossier..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea> 
      </div> 

    </div> <!-- END CONTAINER WRAPPER -->
  `; 
}


// ============================================================================ // 
// ðŸ“¦ MASTER HAZMAT REGISTRATION APPLICATION ASSEMBLY FRAMEWORK                 // 
// ============================================================================ // 
window.buildHazmatRegistrationForm = function(stateDropdownOptionsHtml = "") { 
  // 1. Gather all sub-module field matrices strings
  const p1 = typeof window.buildHazmatRegistrationFormPart1 === "function" ? window.buildHazmatRegistrationFormPart1(stateDropdownOptionsHtml) : ""; 
  const p2 = typeof window.buildHazmatRegistrationFormPart2 === "function" ? window.buildHazmatRegistrationFormPart2(stateDropdownOptionsHtml) : ""; 
  const p3 = typeof window.buildHazmatRegistrationFormPart3 === "function" ? window.buildHazmatRegistrationFormPart3(stateDropdownOptionsHtml) : ""; 

  // 2. WRAP THE ENTIRE COMPLIED FLOW IN A SINGLE FULL-WIDTH RECEPTACLE BOUNDARY AT TOP & BOTTOM
  return `
    <div class="hazmat-unified-form-wrapper" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      
      <!-- FLOW PARTS INTEGRATED HERE AS A SINGLE STREAM -->
      ${p1} 
      ${p2} 
      ${p3} 
      
    </div>
  `; 
}; 

/** 
 * Scans all field parameters inside the Hazmat Registration Wizard. 
 * @returns {boolean} Outcome indicating global form validation success. 
 */ 
window.validateEntireHazmatWizard = function() { 
  const isPart1Valid = typeof window.formRegistry?.['hazmat-registration-part1-validation']?.validate === 'function' ? window.formRegistry['hazmat-registration-part1-validation'].validate().isValid : true; 
  const isPart2Valid = typeof window.validateHazmatRegistrationFormParts2And3 === 'function' ? window.validateHazmatRegistrationFormParts2And3() : true; 
  
  return (isPart1Valid && isPart2Valid); 
}; 

window.formRegistry = window.formRegistry || {}; 
window.formRegistry['hazmat-registration-form-master'] = function(stateDropdownOptionsHtml = "") { 
  return window.buildHazmatRegistrationForm(stateDropdownOptionsHtml); 
};

