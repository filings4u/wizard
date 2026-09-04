/**
 * Full LLC form script mapped to your Orders and client_profiles tables.
 * - Preserves original design and copy.
 * - Input element IDs match the visible fields.
 * - Navigation buttons (Back / Continue) are included.
 * - Validation error checks reference plain variables (no orders.<prop>).
 * - buildPayloadsForSupabase(...) returns { orders, client_profiles, errors }.
 */

(function () {
  // Utilities
  const MAX = {
    COMPANY_NAME: 255, NAME: 255, EMAIL: 255, PHONE_ORDERS: 100, PHONE_PROFILES: 50,
    TRACKING: 100, CITY: 100, STATE: 50, ZIP: 20, STRIPE_ID: 255, POA_SIG: 255, UPS: 2000
  };

  const truncate = (v, n) => (v == null ? null : String(v).slice(0, n || v.length));
  const lower = (v) => (v == null ? null : String(v).toLowerCase());
  const parseAmount = (v) => { const n = Number(v); return Number.isFinite(n) ? Math.round(n*100)/100 : 0.00; };
  const genUUID = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{const r=(Math.random()*16)|0; return (c==='x'?r:(r&0x3)|0x8).toString(16);});

  window.formRegistry = window.formRegistry || {};

  // Validation engine (IDs correspond to visible inputs)
  window.formRegistry['llc-formation-validation-engine'] = {
    requiredFields: [
      { id: 'tracking_number', errId: 'err_tracking_number', msg: 'Please provide a tracking number.' },
      { id: 'first_name', errId: 'err_first_name', msg: 'First name required.' },
      { id: 'last_name', errId: 'err_last_name', msg: 'Last name required.' },
      { id: 'email_address', errId: 'err_email_address', msg: 'Email address required.' },
      { id: 'phone_number', errId: 'err_phone_number', msg: 'Phone number required.' },
      { id: 'selected_plan', errId: 'err_selected_plan', msg: 'Please select a plan.' },
      { id: 'selected_service', errId: 'err_selected_service', msg: 'Please select a service.' }
    ],

    setupLiveInputFilters: function () {
      ['zip_code', 'agent_zip_code'].forEach(id => {
        const node = document.getElementById(id);
        if (node) node.addEventListener('input', function(){ this.value = this.value.replace(/\D/g, ''); });
      });
    },

    validate: function () {
      let isValid = true;
      const errors = [];
      const markInvalid = (el, errEl, msg) => {
        if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
        if (el) el.style.borderColor = '#ef4444';
        isValid = false; if (!errors.includes(msg)) errors.push(msg);
      };
      const markValid = (el, errEl) => {
        if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
        if (el) el.style.borderColor = '#cbd5e1';
      };

      this.requiredFields.forEach(f => {
        const inputEl = document.getElementById(f.id);
        const errorEl = document.getElementById(f.errId);
        if (!inputEl || inputEl.offsetParent === null) return;
        if (!String(inputEl.value || '').trim()) markInvalid(inputEl, errorEl, f.msg);
        else markValid(inputEl, errorEl);
      });

      // Agent conditional validation
      const agentChoiceNode = document.getElementById('registered_agent_option');
      if (agentChoiceNode && agentChoiceNode.value === 'individual') {
        const agentFields = [
          { id: 'agent_name', err: 'err_agent_name', m: 'Registered individual agent name is required.' },
          { id: 'agent_street', err: 'err_agent_street', m: 'Statutory agent street location is required.' },
          { id: 'agent_city', err: 'err_agent_city', m: 'Statutory agent city location is required.' },
          { id: 'agent_state', err: 'err_agent_state', m: 'Please select a statutory agent state designation.' },
          { id: 'agent_zip_code', err: 'err_agent_zip_code', m: 'Statutory agent zip tracking reference is required.' }
        ];
        agentFields.forEach(f => {
          const inputEl = document.getElementById(f.id);
          const errorEl = document.getElementById(f.err);
          if (inputEl) {
            if (!String(inputEl.value || '').trim()) markInvalid(inputEl, errorEl, f.m);
            else markValid(inputEl, errorEl);
          }
        });
        const azipNode = document.getElementById('agent_zip_code');
        if (azipNode && azipNode.value.trim() && !/^\d{5}$/.test(azipNode.value.trim())) {
          markInvalid(azipNode, document.getElementById('err_agent_zip_code'), 'Registered agent zip code must be exactly 5 digits.');
        }
      }

      // Professional description conditional
      const serviceNode = document.getElementById('selected_service');
      const specWrapper = document.getElementById('professional_desc_wrapper');
      const specField = document.getElementById('professional_desc');
      if (serviceNode && serviceNode.value === 'professional' && specWrapper && specWrapper.style.display !== 'none') {
        if (!specField || !specField.value.trim()) markInvalid(specField, document.getElementById('err_professional_desc'), 'Professional practice licensing description required.');
        else markValid(specField, document.getElementById('err_professional_desc'));
      }

      // Zip format
      const zip = document.getElementById('zip_code');
      if (zip && zip.offsetParent !== null && zip.value.trim() && !/^\d{5}$/.test(zip.value.trim())) {
        markInvalid(zip, document.getElementById('err_zip_code'), 'Zip code must be exactly 5 digits.');
      }

      // Email format + lowercase
      const email = document.getElementById('email_address');
      if (email && email.offsetParent !== null && email.value.trim()) {
        const val = email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          markInvalid(email, document.getElementById('err_email_address'), 'Enter a valid email address.');
        } else {
          email.value = val.toLowerCase();
          markValid(email, document.getElementById('err_email_address'));
        }
      }

      // Phone length
      const phone = document.getElementById('phone_number');
      if (phone && phone.offsetParent !== null && phone.value.trim()) {
        if (phone.value.replace(/\D/g, '').length < 10) {
          markInvalid(phone, document.getElementById('err_phone_number'), 'Phone must contain at least 10 digits.');
        }
      }

      return { isValid, errors };
    }
  };

  // Part 1 layout (IDs match table column-friendly names)
  window.formRegistry['llc-formation-part1-layout'] = function (stateDropdownOptionsHtml = '') {
    return `
      <div style="grid-column: span 2; background: rgba(10,31,68,0.03); border-left:4px solid var(--navy); padding:14px; border-radius:0 8px 8px 0; margin-bottom:8px;">
        <strong style="color:var(--navy); display:block; margin-bottom:4px;">LLC Corporate Formation Structural Intake Blueprint</strong>
        Filing Articles of Organization constructs a permanent statutory asset layer protecting personal holdings from operational risk exposures. Please confirm tracking fields match registry parameters.
      </div>

      <div style="grid-column: span 2; border-bottom:1px solid var(--border); padding-bottom:8px; margin-top:16px;">
        <h3 style="color:var(--navy); font-size:1.1rem; font-weight:800;">1. Proposed Limited Liability Company Name</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="company_name">Desired LLC Name *</label>
        <input type="text" id="company_name" required class="wizard-input-field" placeholder="Enter your business name choice">
        <div id="err_company_name" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="selected_plan">Legal Suffix / Plan *</label>
        <select id="selected_plan" required class="wizard-input-field">
          <option value="" disabled>Select...</option>
          <option value="Standard LLC Plan">Standard LLC Plan</option>
          <option value="Professional LLC">Professional LLC</option>
        </select>
        <div id="err_selected_plan" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="selected_service">Primary Business Purpose & Scope *</label>
        <select id="selected_service" required class="wizard-input-field" onchange="toggleProfessionalDesc(this.value)">
          <option value="general">General Commercial Operations</option>
          <option value="real_estate">Real Estate Holdings</option>
          <option value="professional">Professional Services</option>
          <option value="freight_logistics">Freight & Logistics</option>
        </select>
        <div id="err_selected_service" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div id="professional_desc_wrapper" style="grid-column: span 2; display:none;">
        <label for="professional_desc">If professional, specify credentials *</label>
        <input type="text" id="professional_desc" class="wizard-input-field" placeholder="e.g., Medical, Legal, Accounting">
        <div id="err_professional_desc" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div style="grid-column: span 2; border-bottom:1px solid var(--border); padding-bottom:8px; margin-top:16px;">
        <h3 style="color:var(--navy); font-size:1.1rem; font-weight:800;">2. Corporate Headquarters (Principal Physical Location)</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="street_address">Street Address (P.O. Boxes Prohibited) *</label>
        <input type="text" id="street_address" required class="wizard-input-field" placeholder="Enter HQ street address">
        <div id="err_street_address" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px;">
          <div>
            <label for="city">City *</label>
            <input type="text" id="city" required class="wizard-input-field">
            <div id="err_city" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
          </div>
          <div>
            <label for="state">State *</label>
            <select id="state" required class="wizard-input-field">${stateDropdownOptionsHtml}</select>
            <div id="err_state" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
          </div>
          <div>
            <label for="zip_code">Zip Code *</label>
            <input type="text" id="zip_code" required class="wizard-input-field">
            <div id="err_zip_code" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
          </div>
        </div>
      </div>
    `;
  };

  // Part 2 layout (management & agent) + contact fields + nav buttons appended in master
  window.formRegistry['llc-formation-part2-layout'] = function (stateDropdownOptionsHtml = '') {
    return `
      <div style="grid-column: span 2; border-bottom:1px solid var(--border); padding-bottom:8px; margin-top:16px;">
        <h3 style="color:var(--navy); font-size:1.1rem; font-weight:800;">3. Management Governance Matrix</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="mgmt_type">Management Structure *</label>
        <select id="mgmt_type" required class="wizard-input-field">
          <option value="member">Member-Managed</option>
          <option value="manager">Manager-Managed</option>
        </select>
        <div id="err_mgmt_type" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label for="registered_agent_option">Registered Agent Option *</label>
        <select id="registered_agent_option" required class="wizard-input-field" onchange="toggleAgentDetails(this.value)">
          <option value="standard">Utilize Premium Corporate Statutory Agent Service</option>
          <option value="individual">Assign Custom Individual Statutory Agent</option>
        </select>
        <div id="err_registered_agent_option" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div id="agent_details_wrapper" style="grid-column: span 2; display:none; flex-direction:column; gap:16px;">
        <div style="border-top:1px dashed var(--border); padding-top:16px;">
          <h4 style="color:var(--navy); font-size:0.95rem; font-weight:700;">Custom Registered Agent Profile</h4>
        </div>

        <div style="grid-column: span 2;">
          <label for="agent_name">Agent Full Name / Entity *</label>
          <input type="text" id="agent_name" class="wizard-input-field">
          <div id="err_agent_name" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
        </div>

        <div style="grid-column: span 2;">
          <label for="agent_street">Agent Physical Statutory Address (P.O. Boxes Prohibited) *</label>
          <input type="text" id="agent_street" class="wizard-input-field">
          <div id="err_agent_street" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
        </div>

        <div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px; grid-column: span 2;">
          <div>
            <label for="agent_city">City *</label>
            <input type="text" id="agent_city" class="wizard-input-field">
            <div id="err_agent_city" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
          </div>
          <div>
            <label for="agent_state">State *</label>
            <select id="agent_state" class="wizard-input-field">${stateDropdownOptionsHtml}</select>
            <div id="err_agent_state" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
          </div>
          <div>
            <label for="agent_zip_code">Zip *</label>
            <input type="text" id="agent_zip_code" class="wizard-input-field">
            <div id="err_agent_zip_code" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
          </div>
        </div>
      </div>

      <div style="grid-column: span 2; border-bottom:1px solid var(--border); padding-bottom:8px; margin-top:16px;">
        <h3 style="color:var(--navy); font-size:1.1rem; font-weight:800;">4. Primary Communications Contact Person</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <label for="first_name">Contact First Name *</label>
        <input type="text" id="first_name" required class="wizard-input-field">
        <div id="err_first_name" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div style="grid-column: span 1;">
        <label for="last_name">Contact Last Name *</label>
        <input type="text" id="last_name" required class="wizard-input-field">
        <div id="err_last_name" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div style="grid-column: span 1;">
        <label for="phone_number">Phone Number *</label>
        <input type="tel" id="phone_number" required class="wizard-input-field">
        <div id="err_phone_number" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>

      <div style="grid-column: span 1;">
        <label for="email_address">Email Address *</label>
        <input type="email" id="email_address" required class="wizard-input-field">
        <div id="err_email_address" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>
    `;
  };

  // Part 3 layout (supplemental)
  window.formRegistry['llc-formation-part3-layout'] = function () {
    return `
      <div style="grid-column: span 2; border-bottom:1px solid var(--border); padding-bottom:8px; margin-top:16px;">
        <h3 style="color:var(--navy); font-size:1.1rem; font-weight:800;">5. Custom Special Provisions</h3>
      </div>

      <div style="grid-column: span 2;">
        <label for="selected_upsells">Supplemental Operating Guidelines or Background Provisions</label>
        <textarea id="selected_upsells" class="wizard-input-field" style="width:100%; min-height:90px;"></textarea>
        <div id="err_selected_upsells" class="wizard-error-message" style="display:none;color:#ef4444;"></div>
      </div>
    `;
  };

  // Toggle helpers adapted to new IDs
  window.toggleProfessionalDesc = function (value) {
    const wrapper = document.getElementById('professional_desc_wrapper');
    const input = document.getElementById('professional_desc');
    if (!wrapper) return;
    if (value === 'professional') { wrapper.style.display = 'block'; if (input) input.setAttribute('required','required'); }
    else { wrapper.style.display = 'none'; if (input) { input.removeAttribute('required'); input.value=''; input.style.borderColor='#cbd5e1'; } }
  };

  window.toggleAgentDetails = function (value) {
    const wrapper = document.getElementById('agent_details_wrapper');
    if (!wrapper) return;
    const inputs = wrapper.querySelectorAll('input, select');
    if (value === 'individual') { wrapper.style.display = 'flex'; inputs.forEach(i => i.setAttribute('required','required')); }
    else { wrapper.style.display = 'none'; inputs.forEach(i => { i.removeAttribute('required'); i.value=''; i.style.borderColor='#cbd5e1'; }); }
  };

  // Master renderer with Back/Continue buttons (IDs preserved from screenshot pattern)
  window.formRegistry['llc-formation-form-master'] = function (stateDropdownOptionsHtml = '') {
    const part1 = window.formRegistry['llc-formation-part1-layout'] ? window.formRegistry['llc-formation-part1-layout'](stateDropdownOptionsHtml) : '';
    const part2 = window.formRegistry['llc-formation-part2-layout'] ? window.formRegistry['llc-formation-part2-layout'](stateDropdownOptionsHtml) : '';
    const part3 = window.formRegistry['llc-formation-part3-layout'] ? window.formRegistry['llc-formation-part3-layout']() : '';

    const navHtml = `
     
    `;

    // Attach listeners after DOM is inserted (microtask)
    setTimeout(() => {
      const back = document.getElementById('llc_nav_back');
      const next = document.getElementById('llc_nav_next');
      if (back) back.addEventListener('click', () => window.dispatchEvent(new CustomEvent('wizard:prev')));
      if (next) next.addEventListener('click', () => window.dispatchEvent(new CustomEvent('wizard:next')));
    }, 0);

    return part1 + part2 + part3 + navHtml;
  };

  // Payload builder: returns objects matching your tables
  window.buildPayloadsForSupabase = function (opts = {}) {
    const { userId = null } = opts;

    // Read DOM values
    const tracking_number = truncate(document.getElementById('tracking_number')?.value || genUUID(), MAX.TRACKING);

    const first_name = truncate(document.getElementById('first_name')?.value || 'Not Specified', MAX.NAME);
    const last_name = truncate(document.getElementById('last_name')?.value || 'Not Specified', MAX.NAME);
    const email_address = truncate(lower(document.getElementById('email_address')?.value || ''), MAX.EMAIL);
    const phone_number = truncate(document.getElementById('phone_number')?.value || '', MAX.PHONE_ORDERS);

    const company_name = truncate(document.getElementById('company_name')?.value || 'Not Specified', MAX.COMPANY_NAME);
    const street_address = document.getElementById('street_address')?.value || null;
    const city = truncate(document.getElementById('city')?.value || null, MAX.CITY);
    const state = truncate(document.getElementById('state')?.value || null, MAX.STATE);
    const zip_code = truncate(document.getElementById('zip_code')?.value || null, MAX.ZIP);

    const selected_plan = truncate(document.getElementById('selected_plan')?.value || 'Standard LLC Plan', MAX.COMPANY_NAME);
    const selected_service = truncate(document.getElementById('selected_service')?.value || 'Not Specified', MAX.COMPANY_NAME);
    const selected_upsells = truncate(document.getElementById('selected_upsells')?.value || null, MAX.UPS);

    const total_paid_amount = parseAmount(document.getElementById('total_paid_amount')?.value || 0.00);
    const stripe_payment_id = truncate(document.getElementById('stripe_payment_id')?.value || null, MAX.STRIPE_ID);
    const poa_signature = truncate(document.getElementById('poa_signature')?.value || null, MAX.POA_SIG);

    // Agent data if individual
    const agent_choice = document.getElementById('registered_agent_option')?.value || 'standard';
    let agent_data = null;
    if (agent_choice === 'individual') {
      agent_data = {
        agent_name: document.getElementById('agent_name')?.value || null,
        agent_street: document.getElementById('agent_street')?.value || null,
        agent_city: document.getElementById('agent_city')?.value || null,
        agent_state: document.getElementById('agent_state')?.value || null,
        agent_zip: document.getElementById('agent_zip_code')?.value || null
      };
    }

    // Build payload objects (flat keys matching your DDL)
    const orders = {
      tracking_number,
      first_name,
      last_name,
      email_address,
      phone_number,
      company_name,
      street_address,
      city,
      state,
      zip_code,
      selected_plan,
      selected_upsells: selected_upsells || (agent_data ? JSON.stringify(agent_data) : null),
      total_paid_amount,
      stripe_payment_id,
      poa_signature,
      account_created: false,
      selected_service
    };

    const client_profiles = {
      ...(userId ? { id: userId } : {}),
      email_address,
      first_name,
      last_name,
      phone_number: truncate(document.getElementById('phone_number')?.value || '', MAX.PHONE_PROFILES),
      street_address,
      city,
      state,
      zip_code,
      tracking_number
    };

    // Validation errors using plain variable names (no orders.<prop>)
    const errors = [];
    if (!tracking_number) errors.push('tracking_number is required');
    if (!first_name) errors.push('first_name is required');
    if (!last_name) errors.push('last_name is required');
    if (!email_address) errors.push('email_address is required');
    if (!phone_number) errors.push('phone_number is required');
    if (!selected_plan) errors.push('selected_plan is required');
    if (!selected_service) errors.push('selected_service is required');
    if (!client_profiles.email_address) errors.push('client_profiles.email_address is required');

    return { orders, client_profiles, errors };
  };

  // Initialize live filters
  window.formRegistry['llc-formation-validation-engine'].setupLiveInputFilters();
})();