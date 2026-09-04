// ============================================================================ // 
// ðŸš› SYSTEM COMPLIANCE SERVICE: BOC-3 AMENDMENT ENGINE (PART 1 OF 3)
// ============================================================================ // 

function initBoc3AmendmentServices() {
  window.formRegistry = window.formRegistry || {};

  // ============================================================================ // 
  // 1. PART 1 FORM LAYOUT MATRIX
  // ============================================================================ // 
  window.formRegistry['boc-3-amendment-part1-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
      <!-- FMCSA LEGAL TOOLTIP -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a BOC-3 Amendment Filing?</strong>
        The FMCSA requires interstate motor carriers, brokers, and freight forwarders to maintain active Process Agents via Form BOC-3. An amendment must be submitted within 30 days of any change to your legal business structure, address parameters, or individual processing agent designations.
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Carrier Identity &amp; FMCSA Credentials</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="boc_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Legal Business / Corporate Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="boc_legal_name" required placeholder="As registered with the FMCSA (e.g., Global Transport Logistics LLC)" class="wizard-input-field">
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="boc_dot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">US DOT Number <span style="color: #ef4444;">*</span></label>
        <input type="text" id="boc_dot_number" required placeholder="e.g., 3456789" class="wizard-input-field">
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="boc_authority_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Operation Classification *</label>
        <select id="boc_authority_type" required class="wizard-input-field" onchange="window.toggleBoc3AuthorityDocketFieldVisibility(this.value)">
          <option value="" disabled selected>Select operation matrix...</option>
          <option value="private">Private Motor Carrier (No MC Needed)</option>
          <option value="common">For-Hire Common Carrier (MC Required)</option>
          <option value="contract">For-Hire Contract Carrier (MC Required)</option>
          <option value="broker">Property Broker (MC/MX Required)</option>
          <option value="forwarder">Freight Forwarder (FF Number Required)</option>
        </select>
      </div>

      <!-- Conditional Container: MC/MX/FF Number Block -->
      <div id="boc_mc_number_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;">
        <label for="boc_mc_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">MC / MX / FF Operating Authority Docket # <span style="color: #ef4444;">*</span></label>
        <input type="text" id="boc_mc_number" placeholder="e.g., MC-123456 or FF-987654" class="wizard-input-field">
      </div>
    `;
  };

  // ============================================================================ // 
  // 2. PART 1 VALIDATION MATRIX ENGINE
  // ============================================================================ // 
  window.formRegistry['boc-3-amendment-part1-validation'] = {
    requiredFields: [
      { id: 'boc_legal_name', msg: 'Legal Business Name is required.' },
      { id: 'boc_dot_number', msg: 'US DOT Number is required.' },
      { id: 'boc_authority_type', msg: 'Please select an Authority Operation Type.' }
    ],
    validate: function() {
      let isValid = true;
      let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      // Base presence pass
      this.requiredFields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) { if (!el.value.trim()) setError(el, f.msg); else clearError(el); }
      });

      // Strict Validation: USDOT numbers must be numeric digits between 5 and 8 chars
      const dotEl = document.getElementById("boc_dot_number");
      if (dotEl && dotEl.value.trim()) {
        const cleanDot = dotEl.value.replace(/\D/g, "");
        if (cleanDot.length < 5 || cleanDot.length > 8) {
          setError(dotEl, "USDOT Number must be a valid numerical sequence containing between 5 and 8 digits.");
        }
      }

      // Conditional Field Validation: Operating Authority Docket Number
      const authType = document.getElementById("boc_authority_type");
      const mcEl = document.getElementById("boc_mc_number");
      if (authType && (authType.value === "common" || authType.value === "contract" || authType.value === "broker" || authType.value === "forwarder")) {
        if (mcEl && !mcEl.value.trim()) {
          setError(mcEl, "Operating Authority Docket Number is required for your classification choice.");
        } else if (mcEl) {
          clearError(mcEl);
        }
      } else if (mcEl) {
        clearError(mcEl);
      }

      return { isValid, errors };
    }
  };


    // ============================================================================ // 
  // 3. PART 2 FORM LAYOUT MATRIX
  // ============================================================================ // 
  window.formRegistry['boc-3-amendment-part2-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Amendment Scope &amp; Processing Agent Mapping</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="boc_scope_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Filing Scope Adjustment Intent <span style="color: #ef4444;">*</span></label>
        <select id="boc_scope_choice" required class="wizard-input-field" onchange="window.toggleBoc3FilingPricingWeightParameters(this.value)">
          <option value="blanket" selected>Full Blanket Designation (Covers all 50 US States under unified registry)</option>
          <option value="individual">Individual State Changes (Update agents for specific target territories only) â€” Add $45.00</option>
        </select>
      </div>

      <div style="grid-column: span 2; margin-top: 8px;">
        <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Designated Process Agent / Corporate Headquarters Address</span>
          
          <div class="wizard-input-group" style="grid-column: span 2; margin: 0;">
            <label for="boc_agent_street" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Street Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="boc_agent_street" required placeholder="Street Name, Office Suite Number" class="wizard-input-field" onfocus="if(typeof attachGooglePlacesAutocompleteToNode === 'function') { attachGooglePlacesAutocompleteToNode(this, 'boc_agent'); }">
          </div>

          <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; box-sizing: border-box;">
            <div>
              <label for="boc_agent_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
              <input type="text" id="boc_agent_city" required placeholder="City" class="wizard-input-field">
            </div>
            <div>
              <label for="boc_agent_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
              <select id="boc_agent_state" required class="wizard-input-field" style="font-weight: 600;">
                ${stateDropdownOptionsHtml}
              </select>
            </div>
            <div>
              <label for="boc_agent_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
              <input type="text" id="boc_agent_zip" required placeholder="Zip Code" style="font-family: monospace;" class="wizard-input-field">
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // ============================================================================ // 
  // 4. PART 2 VALIDATION MATRIX ENGINE
  // ============================================================================ // 
  window.formRegistry['boc-3-amendment-part2-validation'] = {
    requiredFields: [
      { id: 'boc_scope_choice', msg: 'Please select an amendment adjustment scope.' },
      { id: 'boc_agent_street', msg: 'Service Agent Process Street Address is required.' },
      { id: 'boc_agent_city', msg: 'Service Agent Process City is required.' },
      { id: 'boc_agent_state', msg: 'Service Agent Process State selection is required.' },
      { id: 'boc_agent_zip', msg: 'Service Agent Process Zip Code is required.' }
    ],
    validate: function() {
      let isValid = true;
      let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      this.requiredFields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) { if (!el.value.trim()) setError(el, f.msg); else clearError(el); }
      });

      // Strict Postal Code Format Regex Guard
      const zipEl = document.getElementById("boc_agent_zip");
      if (zipEl && zipEl.value.trim() && !/^\d{5}$/.test(zipEl.value.trim())) {
        setError(zipEl, "Process Service Agent Zip Code must be exactly 5 numeric digits.");
      }

      return { isValid, errors };
    }
  };

    // ============================================================================ // 
  // 5. PART 3 FORM LAYOUT MATRIX
  // ============================================================================ // 
  window.formRegistry['boc-3-amendment-part3-layout'] = function() {
    return `
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. FMCSA Compliance Attestation &amp; Signature</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="boc_signatory_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Authorized Representative Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="boc_signatory_name" required placeholder="First and Last Legal Name" class="wizard-input-field">
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="boc_signatory_title" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Signatory Position Title <span style="color: #ef4444;">*</span></label>
        <select id="boc_signatory_title" required class="wizard-input-field">
          <option value="" disabled selected>Select relationship...</option>
          <option value="owner">Owner / Sole Member</option>
          <option value="officer">Corporate Officer (President, VP, Sec)</option>
          <option value="partner">Managing Partner</option>
          <option value="attorney">Attorney-in-Fact / Compliance Manager</option>
        </select>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; display: flex; align-items: flex-start; gap: 10px; margin-top: 8px;">
        <input type="checkbox" id="boc_electronic_attestation" required style="margin-top: 4px; transform: scale(1.2); cursor: pointer;">
        <label for="boc_electronic_attestation" style="font-size: 0.78rem; line-height: 1.4; color: var(--slate); font-weight: 600; cursor: pointer; user-select: none;">
          I explicitly declare under penalty of perjury that I am authorized by this motor entity to execute this amendment. I verify that all specified process agents have agreed to accept legal service of papers on behalf of this company under 49 CFR Part 366. <span style="color: #ef4444;">*</span>
        </label>
      </div>
    `;
  };

  // ============================================================================ // 
  // 6. PART 3 VALIDATION MATRIX ENGINE
  // ============================================================================ // 
  window.formRegistry['boc-3-amendment-part3-validation'] = {
    requiredFields: [
      { id: 'boc_signatory_name', msg: 'Authorized Signatory Full Name is required to bind filing.' },
      { id: 'boc_signatory_title', msg: 'Authorized Signatory Title selection is required.' },
      { id: 'boc_electronic_attestation', msg: 'You must affirm the regulatory submission attestation check to continue.' }
    ],
    validate: function() {
      let isValid = true;
      let errors = [];
      const setError = (el, msg) => { if (el) el.style.borderColor = "#ef4444"; isValid = false; if (!errors.includes(msg)) errors.push(msg); };
      const clearError = (el) => { if (el) el.style.borderColor = "#cbd5e1"; };

      this.requiredFields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) {
          if (el.type === "checkbox") {
            if (!el.checked) setError(el, f.msg); else clearError(el);
          } else {
            if (!el.value.trim()) setError(el, f.msg); else clearError(el);
          }
        }
      });

      return { isValid, errors };
    }
  };

  // ============================================================================ // 
  // 7. INTERACTIVE INTERFACE CONTROLLERS (BOC-3 OPERATIONS)
  // ============================================================================ // 
  window.toggleBoc3AuthorityDocketFieldVisibility = function(value) {
    const wrapper = document.getElementById("boc_mc_number_wrapper");
    const input = document.getElementById("boc_mc_number");
    if (!wrapper) return;

    if (value === "common" || value === "contract" || value === "broker" || value === "forwarder") {
      wrapper.style.setProperty("display", "grid", "important");
      if (input) {
        input.setAttribute("required", "required");
        if (value === "forwarder") {
          input.setAttribute("placeholder", "Enter Freight Forwarder ID (e.g., FF-123456)");
        } else {
          input.setAttribute("placeholder", "Enter Operating Authority Docket # (e.g., MC-123456)");
        }
      }
    } else {
      wrapper.style.setProperty("display", "none", "important");
      if (input) {
        input.removeAttribute("required");
        input.value = "";
        input.style.borderColor = "#cbd5e1";
      }
    }
  };

  window.toggleBoc3FilingPricingWeightParameters = function(value) {
    window.customSelectedIndividualBoc3StateScopeActive = (value === "individual");
    if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla();
    if (typeof window.updateWizardFinalTotalAmountMatrix === "function") window.updateWizardFinalTotalAmountMatrix();
  };

  // ============================================================================ // 
  // 8. MASTER SYSTEMS INTEGRATION HOOK
  // ============================================================================ // 
  window.formRegistry['boc-3-amendment-form-master'] = function(stateDropdownOptionsHtml = "") {
    const layout1 = typeof window.formRegistry['boc-3-amendment-part1-layout'] === 'function' ? window.formRegistry['boc-3-amendment-part1-layout'](stateDropdownOptionsHtml) : '';
    const layout2 = typeof window.formRegistry['boc-3-amendment-part2-layout'] === 'function' ? window.formRegistry['boc-3-amendment-part2-layout'](stateDropdownOptionsHtml) : '';
    const layout3 = typeof window.formRegistry['boc-3-amendment-part3-layout'] === 'function' ? window.formRegistry['boc-3-amendment-part3-layout']() : '';
    
    return layout1 + layout2 + layout3;
  };
}

// Global execution runtime ignition hook
initBoc3AmendmentServices();

