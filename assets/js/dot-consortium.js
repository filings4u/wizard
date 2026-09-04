// ============================================================================ //
// ðŸ› ï¸ DOT CONSORTIUM SERVICE: VALIDATION MATRIX ENGINE                          //
// ============================================================================ //
function initDotConsortiumService() {
  window.formRegistry = window.formRegistry || {};

  const consortiumFields = [
    { id: 'dot_con_legal_name', msg: 'Official Company Name is required.' },
    { id: 'dot_con_usdot_num', msg: 'USDOT Number is required to establish FMCSA compliance tracking.' },
    { id: 'dot_con_mode', msg: 'Please select your primary DOT operating agency mode.' },
    { id: 'dot_con_driver_count', msg: 'Please specify the number of safety-sensitive drivers.' },
    { id: 'dot_con_der_name', msg: 'Designated Employer Representative (DER) name is required.' },
    { id: 'dot_con_der_phone', msg: 'DER contact phone number is required.' },
    { id: 'dot_con_der_email', msg: 'DER administrative email address is required.' }
  ];

  window.formRegistry['dot-consortium-validation'] = {
    requiredFields: consortiumFields,
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

      // 1. Check Mandatory Fields Presence
      consortiumFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
          const val = el.value ? String(el.value).trim() : "";
          if (!val) setError(el, field.msg);
          else clearError(el);
        }
      });

      // 2. Specialized Numeric Validation: USDOT Format
      const dotEl = document.getElementById("dot_con_usdot_num");
      if (dotEl && (dotEl.offsetWidth > 0 || dotEl.offsetHeight > 0)) {
        const dotVal = dotEl.value ? String(dotEl.value).trim() : "";
        if (dotVal && !/^\d+$/.test(dotVal)) {
          setError(dotEl, "USDOT configuration tokens must contain numeric characters only.");
        }
      }

      // 3. Specialized Numeric Validation: Driver Count Constraint
      const driverEl = document.getElementById("dot_con_driver_count");
      if (driverEl && (driverEl.offsetWidth > 0 || driverEl.offsetHeight > 0)) {
        const driverVal = driverEl.value ? String(driverEl.value).trim() : "";
        if (driverVal && (parseInt(driverVal, 10) < 1 || isNaN(parseInt(driverVal, 10)))) {
          setError(driverEl, "Consortium enrollment pools must contain at least 1 safety-sensitive operator.");
        }
      }

      // 4. Contact Phone Digit Verification
      const phoneEl = document.getElementById("dot_con_der_phone");
      if (phoneEl && (phoneEl.offsetWidth > 0 || phoneEl.offsetHeight > 0)) {
        const phoneVal = phoneEl.value ? String(phoneEl.value).trim() : "";
        if (phoneVal && phoneVal.replace(/\D/g, "").length < 10) {
          setError(phoneEl, "Contact phone framework entries require a minimum of 10 digits.");
        }
      }

      // 5. Administrative Email Structural Analysis
      const emailEl = document.getElementById("dot_con_der_email");
      if (emailEl && (emailEl.offsetWidth > 0 || emailEl.offsetHeight > 0)) {
        const emailVal = emailEl.value ? String(emailEl.value).trim() : "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal && !emailRegex.test(emailVal)) {
          setError(emailEl, "Please enter a valid administrative compliance email format.");
        }
      }

      return { isValid, errors };
    }
  };

  // Standalone backward compatibility bridge mapping pointer
  window.validateDotConsortiumFormMaster = function() {
    return window.formRegistry['dot-consortium-validation'].validate().isValid;
  };
}

window.initDotConsortiumService = initDotConsortiumService;
// ============================================================================ //
// ðŸ› ï¸ DOT CONSORTIUM SERVICE: FORM LAYOUT TEMPLATE (PART 2 OF 3)                //
// ============================================================================ //

function buildDotConsortiumEnrollmentForm(stateDropdownOptionsHtml = "") {
  return `
    <!-- MAIN UNDERSTANDING OVERLAY TOOLTIP -->
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
      <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> FMCSA / DOT Drug &amp; Alcohol Consortium Enrolment Requirements</strong>
      Under 49 CFR Part 382, all commercial motor vehicle operators operating vehicles that require a CDL must belong to a random drug and alcohol testing consortium. This dynamic system manages your random selection pools, fulfills DOT auditing compliance criteria, and keeps your safety management scores clear of major administrative penalties.
    </div>

    <!-- SECTION 1: CARRIER COMPLIANCE PROFILE -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Company &amp; Compliance Identity</h3>
    </div>

    <!-- FIELD 1: OFFICIAL COMPANY LEGAL NAME -->
    <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
      <label for="dot_con_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Business / Carrier Legal Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dot_con_legal_name" required placeholder="Enter exact legal company or owner-operator name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
      <div class="wizard-error-message" id="err_dot_con_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <!-- SIDE-BY-SIDE MATRIX SUB-GRID ROW -->
    <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
      
      <!-- FIELD 2: USDOT NUMBER -->
      <div class="wizard-input-group" style="margin: 0;">
        <label for="dot_con_usdot_num" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">USDOT Number <span style="color: #ef4444;">*</span></label>
        <input type="text" id="dot_con_usdot_num" required placeholder="Enter USDOT ID Number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-family: monospace;">
        <div class="wizard-error-message" id="err_dot_con_usdot_num" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 3: PRIMARY DOT AGENCY MODE DROPDOWN -->
      <div class="wizard-input-group" style="margin: 0;">
        <label for="dot_con_mode" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">DOT Operating Agency Mode <span style="color: #ef4444;">*</span></label>
        <select id="dot_con_mode" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <option value="FMCSA" selected>FMCSA (Motor Carriers &amp; Trucking Logistics)</option>
          <option value="FAA">FAA (Aviation &amp; Commercial Flight Operators)</option>
          <option value="FTA">FTA (Mass Transit &amp; Public Transportation)</option>
          <option value="PHMSA">PHMSA (Pipeline Infrastructure Assets)</option>
          <option value="FRA">FRA (Railroad Systems &amp; Freight Infrastructure)</option>
        </select>
        <div class="wizard-error-message" id="err_dot_con_mode" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>

    <!-- FIELD 4: SAFETY SENSITIVE DRIVER COUNTER (CLEAN REPAIRED BOUNDS) --> 
<div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px;"> 
  <label for="dot_con_driver_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Total Safety-Sensitive CDL Operators <span style="color: #ef4444;">*</span></label> 
  <input type="number" id="dot_con_driver_count" required min="1" value="1" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;"> 
  <div class="wizard-error-message" id="err_dot_con_driver_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
</div>


    <!-- SECTION 2: DESIGNATED EMPLOYER REPRESENTATIVE (DER) POOL PROFILE -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Designated Employer Representative (DER)</h3>
      <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The DER is your company's primary point of contact authorized to take immediate actions regarding testing outcomes and compliance communications.</p>
    </div>

    <!-- FIELD 5: DER FULL NAME FULL WIDTH -->
    <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
      <label for="dot_con_der_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">DER Full Legal Name <span style="color: #ef4444;">*</span></label>
      <input type="text" id="dot_con_der_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
      <div class="wizard-error-message" id="err_dot_con_der_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
    </div>

    <!-- SIDE-BY-SIDE CONTACT DETAILS GRID ROW -->
    <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
      
      <!-- FIELD 6: DER PHONE NUMBER -->
      <div class="wizard-input-group" style="margin: 0;">
        <label for="dot_con_der_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Direct Phone Number <span style="color: #ef4444;">*</span></label>
        <input type="tel" id="dot_con_der_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
        <div class="wizard-error-message" id="err_dot_con_der_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 7: DER EMAIL ADDRESS -->
      <div class="wizard-input-group" style="margin: 0;">
        <label for="dot_con_der_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Compliance Communications Email <span style="color: #ef4444;">*</span></label>
        <input type="email" id="dot_con_der_email" required placeholder="der@yourtruckingcompany.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
        <div class="wizard-error-message" id="err_dot_con_der_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>

    <!-- SECTION 3: OPTIONAL DISCLOSURES TEXTAREA -->
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
      <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Additional Instructions</h3>
    </div>

    <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
      <label for="dot_con_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Special Consortium Filing Notes or Instructions</label>
      <textarea id="dot_con_provisions" placeholder="Detail any immediate corporate clearinghouse deadlines, pre-employment testing urgency requirements, or specialized proxy handling directives..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
    </div>
  `;
}

// Bind component builder securely to global scope layers
window.buildDotConsortiumEnrollmentForm = buildDotConsortiumEnrollmentForm;
// ============================================================================ //
// ðŸ› ï¸ DOT CONSORTIUM SERVICE: COMPILATION & HOOKS (PART 3 OF 3)                  //
// ============================================================================ //

/**
 * ðŸ“¦ MASTER DOT CONSORTIUM APPLICATION ASSEMBLY HOOK
 * Generates the clean outer dual-column CSS grid template envelope.
 */
window.buildDotConsortiumFormMaster = function(stateDropdownOptionsHtml = "") {
  const layoutTemplate = typeof window.buildDotConsortiumEnrollmentForm === "function"
    ? window.buildDotConsortiumEnrollmentForm(stateDropdownOptionsHtml)
    : "";

  return `
    <div class="dot-consortium-wizard-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
      ${layoutTemplate}
    </div>
  `;
};

/**
 * Executes a sequence scan across the DOT Consortium registry field sets.
 * Adds formatting validation formatting and reports raw data validity outcome.
 * @returns {boolean} Status signifying structural form compliance success.
 */
window.validateEntireConsortiumWizard = function() {
  if (typeof window.formRegistry?.['dot-consortium-validation']?.validate === 'function') {
    const outcome = window.formRegistry['dot-consortium-validation'].validate();
    return outcome.isValid;
  }
  return true;
};

// Secure master wizard framework registry registration mapping pointers
window.formRegistry = window.formRegistry || {};
window.formRegistry['dot-consortium-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildDotConsortiumFormMaster(stateDropdownOptionsHtml);
};

