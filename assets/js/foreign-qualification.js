  // ---------------------------------------------------------------------------- //
  // SECTION B: PART 1 LAYOUT ENGINE MATRIX                                       //
  // ---------------------------------------------------------------------------- //
  window.formRegistry['foreign-qualification-part1-layout'] = function(stateDropdownOptionsHtml = "") {
    const blankStatesHtml = stateDropdownOptionsHtml || '<option value="" disabled selected>-- Select State --</option><option value="WY">Wyoming</option>';

    return `
      <!-- CONTEXT-AWARE INTRODUCTORY TOOLTIP BANNER -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 12px;">
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Foreign Qualification?</strong>
        A Foreign Qualification grants an existing business entity explicit state authorization to conduct continuous, lawful operations within a new jurisdiction outside its original state of formation.
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 12px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Business Information</h3>
      </div>
      <!-- FIELD: PROPOSED FOREIGN NAME -->
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="fq_proposed_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Proposed Foreign Entity Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_proposed_name" required placeholder="Provide corporate legal name title..." class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
        <div class="wizard-error-message" id="err_fq_proposed_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD: CURRENT LEGAL NAME -->
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="fq_current_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Current Legal Entity Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_current_name" required placeholder="Exact name in home state" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
        <div class="wizard-error-message" id="err_fq_current_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

<!-- FIELD: ENTITY TYPE SELECTION -->
<div class="wizard-input-group" style="grid-column: span 1;">
  <label style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Entity Type<span style="color: #ef4444;">*</span></label>
        <select id="fq_state_of_formation" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
    <option value="" disabled selected>Select Entity Type...</option>
    <option value="llc">Limited Liability Company (LLC)</option>
    <option value="corporation">Corporation</option>
    <option value="partnership">Partnership</option>
  </select>
</div>


      
      <!-- FIELD: PRINCIPAL OFFICE STREET ADDRESS -->
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="fq_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Principal Office Street Address <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_principal_street" required placeholder="Physical office street address" class="wizard-input-field" onfocus="if(typeof attachGooglePlacesAutocompleteToNode==='function'){attachGooglePlacesAutocompleteToNode(this,'fq_principal')}" style="width: 100%; box-sizing: border-box;">
        <div class="wizard-error-message" id="err_fq_principal_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD: SUITE/UNIT -->
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="fq_principal_unit" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Suite / Building / Apt</label>
        <input type="text" id="fq_principal_unit" placeholder="e.g., Suite 100" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
      </div>

      <!-- FIELD: CITY -->
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="fq_principal_city" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">City <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_principal_city" required placeholder="City" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
        <div class="wizard-error-message" id="err_fq_principal_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <!-- COMPACT ROW FOR STATE & ZIP PARAMETERS -->
      <div class="wizard-input-group" style="grid-column: span 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0;">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="fq_principal_state" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">State *</label>
          <select id="fq_principal_state" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">${blankStatesHtml}</select>
          <div class="wizard-error-message" id="err_fq_principal_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="fq_principal_zip" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Zip *</label>
          <input type="text" id="fq_principal_zip" required placeholder="ZIP code" maxlength="5" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fq_principal_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

      <!-- FIELD: STATE OF FORMATION -->
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="fq_state_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">State of Formation <span style="color: #ef4444;">*</span></label>
        <select id="fq_state_of_formation" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
          <option value="" disabled selected>Select Home State...</option>
          ${blankStatesHtml}
        </select>
        <div class="wizard-error-message" id="err_fq_state_of_formation" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD: DATE OF FORMATION -->
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="fq_date_of_formation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Date of Formation <span style="color: #ef4444;">*</span></label>
        <input type="date" id="fq_date_of_formation" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <div class="wizard-error-message" id="err_fq_date_of_formation" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Contact Information</h3>
      </div>

      <!-- FIELD: CONTACT FIRST NAME -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="fq_contact_first_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">First Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_contact_first_name" required placeholder="First Name" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <div class="wizard-error-message" id="err_fq_contact_first_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD: CONTACT LAST NAME -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="fq_contact_last_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Last Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_contact_last_name" required placeholder="Last Name" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <div class="wizard-error-message" id="err_fq_contact_last_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD: CONTACT EMAIL ADDRESS -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="fq_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Email Address <span style="color: #ef4444;">*</span></label>
        <input type="email" id="fq_contact_email" required placeholder="Email address" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <div class="wizard-error-message" id="err_fq_contact_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD: CONTACT PHONE NUMBER -->
      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="fq_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Phone Number <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_contact_phone" required placeholder="Phone number" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <div class="wizard-error-message" id="err_fq_contact_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    `;
  };
  // ---------------------------------------------------------------------------- //
  // SECTION C: PART 2 LAYOUT ENGINE MATRIX (AGENT CHOICE)                        //
  // ---------------------------------------------------------------------------- //
  window.formRegistry['foreign-qualification-part2-layout'] = function(stateDropdownOptionsHtml = "") {
    const centralRegistrySource = window.CENTRAL_ADDON_DB || window.UPSELL_ADDON_REGISTRY || {};
    const agentMetaRecord = centralRegistrySource["customSelectedRegisteredAgentServiceActive"] || {};
    const liveAgentFee = parseFloat(agentMetaRecord.price || 125.00).toFixed(2);

    return `
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Registered Agent Information</h3>
      </div>

      <!-- CONTEXT-AWARE AGENT TOOLTIP BANNER -->
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 4px;">
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Registered Agent?</strong>
        States require business entities to designate a local physical location receiver. This person or service must stay open during regular business hours to accept legal notices, Service of Process (SOP), and state updates.
      </div>

      <!-- FIELD: REGISTERED AGENT PROVISION DROPDOWN -->
      <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;">
        <label for="fq_agent_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Select Registered Agent Provision <span style="color: #ef4444;">*</span></label>
        <select id="fq_agent_choice" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
          <option value="yes" selected>Utilize Filings4u Protected Agent Shield Service â€” $${liveAgentFee} / Year</option>
          <option value="no">Maintain External Independent Third-Party Registered Agent</option>
        </select>
        <div class="wizard-error-message" id="err_fq_agent_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    `;
  };
  // ---------------------------------------------------------------------------- //
  // SECTION D: PART 2 EXTRA MANUAL REGISTERED AGENT LAYOUT FIELDS BLOCK          //
  // ---------------------------------------------------------------------------- //
  window.formRegistry['foreign-qualification-custom-agent-layout'] = function(stateDropdownOptionsHtml = "") {
    const blankStatesHtml = stateDropdownOptionsHtml || '<option value="" disabled selected>-- Select State --</option>';

    return `
      <!-- REFACTORED HIDDEN WORKSPACE: INDEPENDENT THIRD-PARTY AGENT PROFILES -->
      <div id="fq_agent_manual_wrapper" style="grid-column: span 2; display: none; grid-template-columns: repeat(2, 1fr); gap: 20px; background: rgba(10, 31, 68, 0.01); padding: 20px; border-radius: 8px; border: 1px solid var(--border, #e2e8f0); box-sizing: border-box; width: 100%;">
        <div class="wizard-input-group" style="grid-column: span 2; margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fq_agent_name" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Registered Agent Name *</label>
          <input type="text" id="fq_agent_name" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fq_agent_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fq_agent_street" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Address (P.O. Boxes Prohibited) *</label>
          <input type="text" id="fq_agent_street" class="wizard-input-field" onfocus="if(typeof attachGooglePlacesAutocompleteToNode==='function'){attachGooglePlacesAutocompleteToNode(this,'fq_agent')}" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fq_agent_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fq_agent_unit" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Suite / Building / Apt</label>
          <input type="text" id="fq_agent_unit" placeholder="e.g., Suite 100" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fq_agent_city" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">City *</label>
          <input type="text" id="fq_agent_city" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fq_agent_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="fq_agent_state" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">State *</label>
            <select id="fq_agent_state" class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">${blankStatesHtml}</select>
            <div class="wizard-error-message" id="err_fq_agent_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="fq_agent_zip" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Zip Code *</label>
            <input type="text" id="fq_agent_zip" maxlength="5" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <div class="wizard-error-message" id="err_fq_agent_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
        </div>
      </div>
    `;
  };
  // ---------------------------------------------------------------------------- //
  // SECTION E: PART 3 LAYOUT ENGINE MATRIX (BUSINESS PURPOSE)                    //
  // ---------------------------------------------------------------------------- //
  window.formRegistry['foreign-qualification-purpose-layout'] = function() {
    return `
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Business Purpose</h3>
      </div>
      
      <!-- FIELD: DESCRIPTION OF BUSINESS ACTIVITIES -->
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="fq_business_activities" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Description of Business Activities in the New State <span style="color: #ef4444;">*</span></label>
        <textarea id="fq_business_activities" required placeholder="Brief description of what your business will do in the new state..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600;"></textarea>
        <div class="wizard-error-message" id="err_fq_business_activities" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    `;
  };
  // ---------------------------------------------------------------------------- //
  // SECTION F: PART 4 LAYOUT ENGINE MATRIX (COMPLIANCE INFRASTRUCTURE)           //
  // ---------------------------------------------------------------------------- //
  window.formRegistry['foreign-qualification-part3-layout'] = function() {
    return `
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Compliance Information</h3>
      </div>

      <!-- FIELD: LICENSE AUDIT CHECK OPTIONS -->
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="fq_license_check_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Have you checked for any necessary licenses or permits required for foreign operations in the new state? <span style="color: #ef4444;">*</span></label>
        <select id="fq_license_check_choice" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
          <option value="" disabled selected>Select Option...</option>
          <option value="yes">Yes, we have completed the baseline licensing review checks</option>
          <option value="no">No, we have not completely audited licensing dependencies</option>
        </select>
        <div class="wizard-error-message" id="err_fq_license_check_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- DYNAMIC CONDITIONAL WRAPPER A: USER SELECTED YES -->
      <div id="fq_license_details_wrapper" style="grid-column: span 2; display: none;">
        <div class="wizard-input-group" style="margin: 0; width: 100%;">
          <label for="fq_intended_licenses" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Please list any licenses or permits you intend to apply for:</label>
          <input type="text" id="fq_intended_licenses" placeholder="List intended operating permits, municipal tax nodes, or occupational licenses..." class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        </div>
      </div>

      <!-- DYNAMIC CONDITIONAL WRAPPER B: USER SELECTED NO (UPSELL MODULE) -->
      <div id="fq_license_assistance_wrapper" style="grid-column: span 2; display: none;">
        <div class="wizard-input-group" style="margin: 0; width: 100%;">
          <label for="fq_add_licensing_service" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Would you like assistance in checking for required licenses and/or permits for $125? <span style="color: #ef4444;">*</span></label>
          <select id="fq_add_licensing_service" class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
            <option value="no" selected>No, I will run state licensing research independently</option>
            <option value="yes">Yes, add Filings4u Corporate Licensing Procurement Audit â€” $125.00</option>
          </select>
          <div class="wizard-error-message" id="err_fq_add_licensing_service" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>
    `;
  };
  // ---------------------------------------------------------------------------- //
  // SECTION G: PART 5 LAYOUT ENGINE MATRIX (TAX, DURATION & PROVISIONS)          //
  // ---------------------------------------------------------------------------- //
  window.formRegistry['foreign-qualification-part4-layout'] = function() {
    return `
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Tax Information</h3>
      </div>

      <!-- FIELD: EIN CHOICE DROPDOWN -->
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="fq_ein_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Will you be applying for a new Employer Identification Number (EIN) for foreign operations? <span style="color: #ef4444;">*</span></label>
        <select id="fq_ein_choice" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
          <option value="no" selected>No, I already hold or will apply for EIN structures independently</option>
          <option value="yes">Yes, add Filings4u Master EIN Procurement Service â€” $75.00</option>
        </select>
        <div class="wizard-error-message" id="err_fq_ein_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- HIDDEN FLEX WRAPPER: EIN PROCURE COMPLIANCE REASON -->
      <div id="fq_ein_reason_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 8px;">
        <label for="fq_ein_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Reason for obtaining an EIN <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fq_ein_reason" placeholder="e.g. Opening an operational corporate bank account..." class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <div class="wizard-error-message" id="err_fq_ein_reason" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Duration of Qualification</h3>
      </div>

      <!-- FIELD: DURATION TYPE SELECTION -->
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="fq_duration_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Will this foreign qualification be temporary or ongoing? <span style="color: #ef4444;">*</span></label>
        <select id="fq_duration_type" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
          <option value="ongoing" selected>Ongoing (Indefinite statutory operational baseline registry)</option>
          <option value="temporary">Temporary (Defined localized corporate operational timeline constraints)</option>
        </select>
        <div class="wizard-error-message" id="err_fq_duration_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">8. Additional Provisions</h3>
      </div>

      <!-- FIELD: OPTIONAL TEXT MEMO AREA -->
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="fq_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Provisions</label>
        <textarea id="fq_provisions" placeholder="Detail any additional terms, specific clauses, or corporate structural agreements..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600;"></textarea>
      </div>
    `;
  };
  // ---------------------------------------------------------------------------- //
  // SECTION H: MASTER FOREIGN QUALIFICATION FORM COMPILATION ROUTER              //
  // ---------------------------------------------------------------------------- //
  window.formRegistry['foreign-qualification-form-master'] = function(stateDropdownOptionsHtml = "") {
    const p1 = window.formRegistry['foreign-qualification-part1-layout'] ? window.formRegistry['foreign-qualification-part1-layout'](stateDropdownOptionsHtml) : '';
    const p2 = window.formRegistry['foreign-qualification-part2-layout'] ? window.formRegistry['foreign-qualification-part2-layout'](stateDropdownOptionsHtml) : '';
    const p3 = window.formRegistry['foreign-qualification-custom-agent-layout'] ? window.formRegistry['foreign-qualification-custom-agent-layout'](stateDropdownOptionsHtml) : '';
    const p4 = window.formRegistry['foreign-qualification-purpose-layout'] ? window.formRegistry['foreign-qualification-purpose-layout']() : '';
    const p5 = window.formRegistry['foreign-qualification-part3-layout'] ? window.formRegistry['foreign-qualification-part3-layout']() : '';
    const p6 = window.formRegistry['foreign-qualification-part4-layout'] ? window.formRegistry['foreign-qualification-part4-layout']() : '';
    
    return p1 + p2 + p3 + p4 + p5 + p6;
  };

  // ---------------------------------------------------------------------------- //
  // SECTION I: INTERACTIVE INTERFACE CONTROLLERS & INVOICE PRICING HOOKS         //
  // ---------------------------------------------------------------------------- //
  window.toggleFqAgentDetailsVisibility = function(selectedValue) {
    const wrapper = document.getElementById("fq_agent_manual_wrapper");
    if (!wrapper) return;

    if (selectedValue === "no") {
      wrapper.style.setProperty("display", "grid", "important");
      window.customSelectedRegisteredAgentServiceActive = false;
      wrapper.querySelectorAll("input, select").forEach(el => {
        if (el.id !== "fq_agent_unit") el.setAttribute("required", "required");
      });
    } else {
      wrapper.style.setProperty("display", "none", "important");
      window.customSelectedRegisteredAgentServiceActive = true;
      wrapper.querySelectorAll("input, select").forEach(el => {
        el.removeAttribute("required");
        el.value = "";
        el.style.borderColor = "#cbd5e1";
        const errNode = document.getElementById("err_" + el.id);
        if (errNode) errNode.style.display = "none";
      });
    }

    if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
      window.updateDynamicPricingMatrixVanilla();
    }
  };

  window.toggleFqLicenseAssistanceVisibility = function(selectedValue) {
    const detailsWrapper = document.getElementById("fq_license_details_wrapper");
    const assistanceWrapper = document.getElementById("fq_license_assistance_wrapper");
    const auditSelect = document.getElementById("fq_add_licensing_service");
    if (!detailsWrapper || !assistanceWrapper) return;

    if (selectedValue === "yes") {
      detailsWrapper.style.setProperty("display", "block", "important");
      assistanceWrapper.style.setProperty("display", "none", "important");
      if (auditSelect) {
        auditSelect.value = "no";
        auditSelect.removeAttribute("required");
      }
      window.customSelectedLicenseAuditSuiteActive = false;
    } else if (selectedValue === "no") {
      detailsWrapper.style.setProperty("display", "none", "important");
      assistanceWrapper.style.setProperty("display", "block", "important");
      if (auditSelect) auditSelect.setAttribute("required", "required");
    }

    if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
      window.updateDynamicPricingMatrixVanilla();
    }
  };

  window.toggleFqEinWorkflow = function(selectedValue) {
    const reasonWrapper = document.getElementById("fq_ein_reason_wrapper");
    const reasonInput = document.getElementById("fq_ein_reason");
    if (!reasonWrapper) return;

    if (selectedValue === "yes") {
      reasonWrapper.style.setProperty("display", "flex", "important");
      window.customSelectedEinProcurementServiceActive = true;
      if (reasonInput) reasonInput.setAttribute("required", "required");
    } else {
      reasonWrapper.style.setProperty("display", "none", "important");
      window.customSelectedEinProcurementServiceActive = false;
      if (reasonInput) {
        reasonInput.removeAttribute("required");
        reasonInput.value = "";
        reasonInput.style.borderColor = "#cbd5e1";
        const errNode = document.getElementById("err_fq_ein_reason");
        if (errNode) errNode.style.display = "none";
      }
    }

    if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
      window.updateDynamicPricingMatrixVanilla();
    }
  };
  // ---------------------------------------------------------------------------- //
  // SECTION J: MASTER INTERFACE WORKFLOW INTERLOCK EVENT BRIDGES                 //
  // ---------------------------------------------------------------------------- //
  
  // Bridge change interactions on the core Registered Agent selection node
  document.addEventListener("change", function(event) {
    if (event.target && event.target.id === "fq_agent_choice") {
      window.toggleFqAgentDetailsVisibility(event.target.value);
    }
    
    // Process child licensing upsell choice modifications directly into the checkout total
    if (event.target && event.target.id === "fq_add_licensing_service") {
      window.customSelectedLicenseAuditSuiteActive = (event.target.value === "yes");
      if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
        window.updateDynamicPricingMatrixVanilla();
      }
    }
  });

  console.log("[Foreign Qualification Engine] System registration definitions successfully mounted.");


// Master Structural Initialization Execution Run Trigger
initForeignQualificationService();

