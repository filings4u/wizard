// ============================================================================
// filings4u — LLC FORMATION SERVICE MODULE
// Canonical Step 2 service file
//
// Architecture:
// - Step 0 owns jurisdiction.
// - Step 1 owns package selection.
// - Step 2 collects filing/application facts only.
// - Browser code does NOT create tracking numbers, payment status, Stripe IDs,
//   order IDs, user IDs, authoritative totals, or government-fee values.
// - Service-specific answers are serialized under form_payload.answers.
// ============================================================================

(function () {
  "use strict";

  const SERVICE_KEY = "llc-formation";

  window.formRegistry = window.formRegistry || {};

  // --------------------------------------------------------------------------
  // STATE-AWARE RULES
  // Only rules verified from current official sources are hard-coded here.
  // Other states use the neutral baseline and may receive more exact rules
  // through the central jurisdiction-requirements registry later.
  // --------------------------------------------------------------------------
  const VERIFIED_STATE_RULES = {
    TX: {
      label: "Texas",
      registeredAgentMustBeInState: true,
      registeredOfficeMustBePhysical: true,
      registeredAgentConsentRequired: true,
      governingAuthorityRequired: true,
      organizerRequired: true,
      delayedEffectiveDateSupported: true,
      delayedEffectiveDaysMax: 90,
      notes: [
        "Texas requires a registered agent and registered office.",
        "The registered office must be a physical street address where service can be made.",
        "The filing identifies the initial governing authority and an organizer."
      ]
    },
    CA: {
      label: "California",
      registeredAgentMustBeInState: true,
      registeredOfficeMustBePhysical: true,
      organizerRequired: true,
      notes: [
        "California LLC formation is filed through Articles of Organization.",
        "California also requires an operating agreement to be maintained by the LLC; it is not filed with the Secretary of State."
      ]
    },
    DE: {
      label: "Delaware",
      registeredAgentMustBeInState: true,
      registeredOfficeMustBePhysical: true,
      notes: [
        "Delaware requires every business entity to maintain a registered agent in Delaware with a physical street address."
      ]
    }
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  function getContext() {
    const params = new URLSearchParams(window.location.search);
    const jurisdiction = String(
      params.get("state") ||
      window.__F4U_WIZARD_JURISDICTION__ ||
      window.selectedJurisdiction ||
      window.selectedFormationStateCode ||
      localStorage.getItem("wizard_selected_state") ||
      ""
    ).trim().toUpperCase();

    return {
      serviceKey: SERVICE_KEY,
      jurisdiction: /^[A-Z]{2}$/.test(jurisdiction) ? jurisdiction : "",
      stateRules: VERIFIED_STATE_RULES[jurisdiction] || null
    };
  }

  function getStateName(code) {
    const feeRow = (window.STATE_FILING_FEES || {})[code];
    if (feeRow && feeRow.name) return String(feeRow.name);

    const names = {
      AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
      CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District of Columbia",
      FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",
      IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",
      MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",
      MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",
      NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",
      OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
      SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",
      WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"
    };
    return names[code] || code;
  }

  function stateOptions(selected) {
    const codes = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
    return codes.map(function (code) {
      return `<option value="${esc(code)}"${code === selected ? " selected" : ""}>${esc(getStateName(code))}</option>`;
    }).join("");
  }

  function fieldError(id, message) {
    const field = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (field) {
      field.classList.add("wizard-input-field-error-state");
      field.style.borderColor = "#b91c1c";
    }
    if (err) {
      err.textContent = message;
      err.style.display = "block";
    }
    return message;
  }

  function clearFieldError(id) {
    const field = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (field) {
      field.classList.remove("wizard-input-field-error-state");
      field.style.removeProperty("border-color");
    }
    if (err) {
      err.textContent = "";
      err.style.display = "none";
    }
  }

  function value(id) {
    return String(document.getElementById(id)?.value || "").trim();
  }

  function isVisible(id) {
    const node = document.getElementById(id);
    return !!(node && !node.disabled && node.offsetParent !== null);
  }

  // --------------------------------------------------------------------------
  // DYNAMIC PERSON ROWS
  // --------------------------------------------------------------------------
  function personCard(index, roleLabel) {
    const stateHtml = stateOptions("");
    return `
      <div class="member-record-card llc-governing-person-card" data-person-index="${index}"
        style="grid-column:span 2;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-top:10px;">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px;">
          <strong style="color:var(--navy,#0a1f44);">${esc(roleLabel)} ${index}</strong>
          ${index > 1 ? `<button type="button" class="llc-remove-person" data-remove-index="${index}"
            style="border:0;background:transparent;color:#b91c1c;font-weight:700;cursor:pointer;">Remove</button>` : ""}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div class="wizard-input-group">
            <label for="llc_person_name_${index}">Full Legal Name / Entity Name *</label>
            <input type="text" id="llc_person_name_${index}" name="governing_person_${index}_name"
              class="wizard-input-field" required>
            <div id="err_llc_person_name_${index}" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
          </div>

          <div class="wizard-input-group">
            <label for="llc_person_type_${index}">Person Type *</label>
            <select id="llc_person_type_${index}" name="governing_person_${index}_type"
              class="wizard-input-field" required>
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          <div class="wizard-input-group" style="grid-column:span 2;">
            <label for="llc_person_street_${index}">Street or Mailing Address *</label>
            <input type="text" id="llc_person_street_${index}" name="governing_person_${index}_street"
              class="wizard-input-field" required>
          </div>

          <div class="wizard-input-group">
            <label for="llc_person_city_${index}">City *</label>
            <input type="text" id="llc_person_city_${index}" name="governing_person_${index}_city"
              class="wizard-input-field" required>
          </div>

          <div class="wizard-input-group">
            <label for="llc_person_state_${index}">State *</label>
            <select id="llc_person_state_${index}" name="governing_person_${index}_state"
              class="wizard-input-field" required>
              <option value="">Select state…</option>
              ${stateHtml}
            </select>
          </div>

          <div class="wizard-input-group">
            <label for="llc_person_zip_${index}">ZIP Code *</label>
            <input type="text" id="llc_person_zip_${index}" name="governing_person_${index}_zip"
              class="wizard-input-field" inputmode="numeric" maxlength="10" required>
          </div>
        </div>
      </div>`;
  }

  function syncPersonLabels() {
    const structure = value("llc_management_structure");
    const label = structure === "manager" ? "Initial Manager" : "Initial Member";
    document.querySelectorAll(".llc-governing-person-card").forEach(function (card, i) {
      const strong = card.querySelector("strong");
      if (strong) strong.textContent = `${label} ${i + 1}`;
    });
  }

  function addPerson() {
    const root = document.getElementById("llc_governing_people_root");
    if (!root) return;
    const next = root.querySelectorAll(".llc-governing-person-card").length + 1;
    const label = value("llc_management_structure") === "manager" ? "Initial Manager" : "Initial Member";
    root.insertAdjacentHTML("beforeend", personCard(next, label));
  }

  // --------------------------------------------------------------------------
  // LAYOUT
  // --------------------------------------------------------------------------
  window.formRegistry["llc-formation-form-master"] = function () {
    const ctx = getContext();
    const stateName = getStateName(ctx.jurisdiction);
    const selectedStateOptions = stateOptions(ctx.jurisdiction);
    const ruleNotes = ctx.stateRules?.notes || [];

    return `
      <div class="wizard-grid-container llc-formation-form"
        style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;width:100%;box-sizing:border-box;">

        <div style="grid-column:span 2;background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;padding:14px;border-radius:8px;">
          <strong style="display:block;color:#14532d;margin-bottom:4px;">LLC Formation · ${esc(stateName || "Selected Jurisdiction")}</strong>
          <span style="color:#166534;font-size:.86rem;line-height:1.45;">
            Complete the formation information below. Your filing jurisdiction was selected before this step and cannot be changed here.
          </span>
        </div>

        ${ruleNotes.length ? `
          <div style="grid-column:span 2;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">
            <strong style="display:block;color:#0a1f44;margin-bottom:6px;">Jurisdiction notes</strong>
            <ul style="margin:0;padding-left:20px;color:#475569;font-size:.84rem;line-height:1.5;">
              ${ruleNotes.map(note => `<li>${esc(note)}</li>`).join("")}
            </ul>
          </div>` : ""}

        <input type="hidden" id="llc_filing_jurisdiction" name="filing_jurisdiction" value="${esc(ctx.jurisdiction)}">

        <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
          <h3 style="margin:0;color:#0a1f44;">1. LLC Name & Purpose</h3>
        </div>

        <div class="wizard-input-group">
          <label for="llc_company_name">Proposed LLC Legal Name *</label>
          <input type="text" id="llc_company_name" name="company_name" class="wizard-input-field"
            placeholder="Example Holdings LLC" required>
          <div id="err_llc_company_name" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_professional_practice">Licensed Professional Practice? *</label>
          <select id="llc_professional_practice" name="professional_practice" class="wizard-input-field" required>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          <small style="color:#64748b;">Professional-entity availability and naming rules vary by state.</small>
        </div>

        <div class="wizard-input-group" style="grid-column:span 2;">
          <label for="llc_business_purpose">Business Purpose *</label>
          <textarea id="llc_business_purpose" name="business_purpose" class="wizard-input-field"
            rows="3" placeholder="Describe the lawful business activities of the LLC." required></textarea>
          <div id="err_llc_business_purpose" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div id="llc_professional_details_wrapper" class="wizard-input-group"
          style="grid-column:span 2;display:none;">
          <label for="llc_professional_details">Professional Field / License Details *</label>
          <input type="text" id="llc_professional_details" name="professional_details"
            class="wizard-input-field" placeholder="e.g., architecture, medicine, accounting">
          <div id="err_llc_professional_details" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:10px;">
          <h3 style="margin:0;color:#0a1f44;">2. Principal Office</h3>
        </div>

        <div class="wizard-input-group" style="grid-column:span 2;">
          <label for="llc_principal_street">Principal Office Street Address *</label>
          <input type="text" id="llc_principal_street" name="principal_street"
            class="wizard-input-field" required>
          <div id="err_llc_principal_street" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_principal_city">City *</label>
          <input type="text" id="llc_principal_city" name="principal_city" class="wizard-input-field" required>
          <div id="err_llc_principal_city" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_principal_state">State *</label>
          <select id="llc_principal_state" name="principal_state" class="wizard-input-field" required>
            <option value="">Select state…</option>
            ${selectedStateOptions}
          </select>
          <div id="err_llc_principal_state" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_principal_zip">ZIP Code *</label>
          <input type="text" id="llc_principal_zip" name="principal_zip"
            class="wizard-input-field" inputmode="numeric" maxlength="10" required>
          <div id="err_llc_principal_zip" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:10px;">
          <h3 style="margin:0;color:#0a1f44;">3. Registered Agent</h3>
        </div>

        <div class="wizard-input-group" style="grid-column:span 2;">
          <label for="llc_registered_agent_option">Registered Agent Choice *</label>
          <select id="llc_registered_agent_option" name="registered_agent_option"
            class="wizard-input-field" required>
            <option value="">Select…</option>
            <option value="filings4u">Use filings4u registered-agent service where available</option>
            <option value="custom">I will provide another registered agent</option>
          </select>
          <div id="err_llc_registered_agent_option" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div id="llc_custom_agent_wrapper"
          style="grid-column:span 2;display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
          <div class="wizard-input-group">
            <label for="llc_agent_name">Registered Agent Name *</label>
            <input type="text" id="llc_agent_name" name="registered_agent_name" class="wizard-input-field">
            <div id="err_llc_agent_name" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
          </div>

          <div class="wizard-input-group">
            <label for="llc_agent_type">Agent Type *</label>
            <select id="llc_agent_type" name="registered_agent_type" class="wizard-input-field">
              <option value="individual">Individual</option>
              <option value="entity">Business Entity</option>
            </select>
          </div>

          <div class="wizard-input-group" style="grid-column:span 2;">
            <label for="llc_agent_street">Registered Office Street Address *</label>
            <input type="text" id="llc_agent_street" name="registered_agent_street" class="wizard-input-field">
            <div id="err_llc_agent_street" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
          </div>

          <div class="wizard-input-group">
            <label for="llc_agent_city">City *</label>
            <input type="text" id="llc_agent_city" name="registered_agent_city" class="wizard-input-field">
            <div id="err_llc_agent_city" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
          </div>

          <div class="wizard-input-group">
            <label for="llc_agent_state">State *</label>
            <select id="llc_agent_state" name="registered_agent_state" class="wizard-input-field">
              <option value="">Select state…</option>
              ${stateOptions(ctx.jurisdiction)}
            </select>
            <div id="err_llc_agent_state" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
          </div>

          <div class="wizard-input-group">
            <label for="llc_agent_zip">ZIP Code *</label>
            <input type="text" id="llc_agent_zip" name="registered_agent_zip"
              class="wizard-input-field" inputmode="numeric" maxlength="10">
            <div id="err_llc_agent_zip" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
          </div>

          <label style="grid-column:span 2;display:flex;gap:10px;align-items:flex-start;font-size:.86rem;color:#334155;">
            <input type="checkbox" id="llc_agent_consent" name="registered_agent_consent" value="yes">
            <span>I confirm the person or entity named above has agreed to serve as registered agent where consent is required.</span>
          </label>
          <div id="err_llc_agent_consent" class="wizard-error-message" style="grid-column:span 2;display:none;color:#b91c1c;"></div>
        </div>

        <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:10px;">
          <h3 style="margin:0;color:#0a1f44;">4. Management & Initial Governing Persons</h3>
        </div>

        <div class="wizard-input-group" style="grid-column:span 2;">
          <label for="llc_management_structure">Management Structure *</label>
          <select id="llc_management_structure" name="management_structure" class="wizard-input-field" required>
            <option value="member">Member-Managed</option>
            <option value="manager">Manager-Managed</option>
          </select>
          <div id="err_llc_management_structure" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div id="llc_governing_people_root" style="grid-column:span 2;">
          ${personCard(1, "Initial Member")}
        </div>

        <div style="grid-column:span 2;">
          <button type="button" id="llc_add_person_btn"
            style="border:1px solid #cbd5e1;background:#fff;color:#0a1f44;padding:9px 14px;border-radius:6px;font-weight:700;cursor:pointer;">
            + Add Governing Person
          </button>
        </div>

        <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:10px;">
          <h3 style="margin:0;color:#0a1f44;">5. Organizer & Filing Effectiveness</h3>
        </div>

        <div class="wizard-input-group">
          <label for="llc_organizer_name">Organizer Name *</label>
          <input type="text" id="llc_organizer_name" name="organizer_name" class="wizard-input-field" required>
          <div id="err_llc_organizer_name" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_organizer_type">Organizer Type *</label>
          <select id="llc_organizer_type" name="organizer_type" class="wizard-input-field" required>
            <option value="individual">Individual</option>
            <option value="organization">Organization</option>
          </select>
        </div>

        <div class="wizard-input-group">
          <label for="llc_effective_choice">When should the filing take effect? *</label>
          <select id="llc_effective_choice" name="effective_choice" class="wizard-input-field" required>
            <option value="upon_filing">When accepted/filed by the state</option>
            <option value="delayed_date">Requested later effective date, if permitted</option>
          </select>
        </div>

        <div id="llc_effective_date_wrapper" class="wizard-input-group" style="display:none;">
          <label for="llc_effective_date">Requested Effective Date *</label>
          <input type="date" id="llc_effective_date" name="effective_date" class="wizard-input-field">
          <div id="err_llc_effective_date" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
          <small style="color:#64748b;">Permitted delayed-effective-date rules vary by jurisdiction.</small>
        </div>

        <div class="wizard-input-group" style="grid-column:span 2;">
          <label for="llc_special_provisions">Supplemental / Special Provisions</label>
          <textarea id="llc_special_provisions" name="special_provisions"
            class="wizard-input-field" rows="4"
            placeholder="Optional provisions or instructions that may need to be included in the formation filing."></textarea>
        </div>

        <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:10px;">
          <h3 style="margin:0;color:#0a1f44;">6. Primary Contact</h3>
        </div>

        <div class="wizard-input-group">
          <label for="llc_contact_first_name">First Name *</label>
          <input type="text" id="llc_contact_first_name" name="contact_first_name" class="wizard-input-field" required>
          <div id="err_llc_contact_first_name" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_contact_last_name">Last Name *</label>
          <input type="text" id="llc_contact_last_name" name="contact_last_name" class="wizard-input-field" required>
          <div id="err_llc_contact_last_name" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_contact_email">Email *</label>
          <input type="email" id="llc_contact_email" name="contact_email" class="wizard-input-field" required>
          <div id="err_llc_contact_email" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>

        <div class="wizard-input-group">
          <label for="llc_contact_phone">Phone *</label>
          <input type="tel" id="llc_contact_phone" name="contact_phone" class="wizard-input-field" required>
          <div id="err_llc_contact_phone" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
        </div>
      </div>`;
  };

  // --------------------------------------------------------------------------
  // POST-RENDER INITIALIZATION
  // --------------------------------------------------------------------------
  function initializeRenderedForm() {
    const ctx = getContext();

    const professional = document.getElementById("llc_professional_practice");
    const professionalWrap = document.getElementById("llc_professional_details_wrapper");
    const professionalDetails = document.getElementById("llc_professional_details");

    function syncProfessional() {
      const show = professional?.value === "yes";
      if (professionalWrap) professionalWrap.style.display = show ? "block" : "none";
      if (professionalDetails) {
        professionalDetails.disabled = !show;
        professionalDetails.required = show;
        if (!show) professionalDetails.value = "";
      }
    }

    const agentChoice = document.getElementById("llc_registered_agent_option");
    const agentWrap = document.getElementById("llc_custom_agent_wrapper");

    function syncAgent() {
      const show = agentChoice?.value === "custom";
      if (agentWrap) agentWrap.style.display = show ? "grid" : "none";
      agentWrap?.querySelectorAll("input, select").forEach(function (field) {
        if (field.id === "llc_agent_consent") {
          field.disabled = !show;
          return;
        }
        field.disabled = !show;
        if (show && ["llc_agent_name","llc_agent_street","llc_agent_city","llc_agent_state","llc_agent_zip"].includes(field.id)) {
          field.required = true;
        } else if (!show) {
          field.required = false;
        }
      });
      if (show && ctx.stateRules?.registeredAgentMustBeInState && ctx.jurisdiction) {
        const state = document.getElementById("llc_agent_state");
        if (state) state.value = ctx.jurisdiction;
      }
    }

    const effectiveChoice = document.getElementById("llc_effective_choice");
    const effectiveWrap = document.getElementById("llc_effective_date_wrapper");
    const effectiveDate = document.getElementById("llc_effective_date");

    function syncEffectiveDate() {
      const show = effectiveChoice?.value === "delayed_date";
      if (effectiveWrap) effectiveWrap.style.display = show ? "block" : "none";
      if (effectiveDate) {
        effectiveDate.disabled = !show;
        effectiveDate.required = show;
        if (!show) effectiveDate.value = "";
      }
    }

    professional?.addEventListener("change", syncProfessional);
    agentChoice?.addEventListener("change", syncAgent);
    effectiveChoice?.addEventListener("change", syncEffectiveDate);
    document.getElementById("llc_management_structure")?.addEventListener("change", syncPersonLabels);
    document.getElementById("llc_add_person_btn")?.addEventListener("click", addPerson);

    document.getElementById("llc_governing_people_root")?.addEventListener("click", function (event) {
      const btn = event.target.closest(".llc-remove-person");
      if (!btn) return;
      btn.closest(".llc-governing-person-card")?.remove();
      document.querySelectorAll(".llc-governing-person-card").forEach(function (card, index) {
        card.dataset.personIndex = String(index + 1);
      });
      syncPersonLabels();
    });

    syncProfessional();
    syncAgent();
    syncEffectiveDate();
    syncPersonLabels();
  }

  // Wrap renderer so listeners are attached after insertion.
  const baseRenderer = window.formRegistry["llc-formation-form-master"];
  window.formRegistry["llc-formation-form-master"] = function () {
    const html = baseRenderer();
    setTimeout(initializeRenderedForm, 0);
    return html;
  };

  // --------------------------------------------------------------------------
  // VALIDATION
  // --------------------------------------------------------------------------
  window.formRegistry["llc-formation-validation-engine"] = {
    validate: function () {
      const ctx = getContext();
      const errors = [];

      document.querySelectorAll(".wizard-input-field-error-state").forEach(function (el) {
        el.classList.remove("wizard-input-field-error-state");
        el.style.removeProperty("border-color");
      });
      document.querySelectorAll(".wizard-error-message").forEach(function (el) {
        el.textContent = "";
        el.style.display = "none";
      });

      const required = [
        ["llc_company_name", "Proposed LLC legal name is required."],
        ["llc_business_purpose", "Business purpose is required."],
        ["llc_principal_street", "Principal office street address is required."],
        ["llc_principal_city", "Principal office city is required."],
        ["llc_principal_state", "Principal office state is required."],
        ["llc_principal_zip", "Principal office ZIP code is required."],
        ["llc_registered_agent_option", "Registered-agent choice is required."],
        ["llc_management_structure", "Management structure is required."],
        ["llc_organizer_name", "Organizer name is required."],
        ["llc_organizer_type", "Organizer type is required."],
        ["llc_effective_choice", "Filing-effectiveness choice is required."],
        ["llc_contact_first_name", "Primary contact first name is required."],
        ["llc_contact_last_name", "Primary contact last name is required."],
        ["llc_contact_email", "Primary contact email is required."],
        ["llc_contact_phone", "Primary contact phone is required."]
      ];

      required.forEach(function ([id, msg]) {
        if (isVisible(id) && !value(id)) errors.push(fieldError(id, msg));
        else clearFieldError(id);
      });

      if (value("llc_professional_practice") === "yes" && !value("llc_professional_details")) {
        errors.push(fieldError("llc_professional_details", "Professional field or license details are required."));
      }

      const zip = value("llc_principal_zip");
      if (zip && !/^\d{5}(?:-\d{4})?$/.test(zip)) {
        errors.push(fieldError("llc_principal_zip", "Enter a valid 5-digit ZIP code or ZIP+4."));
      }

      const email = value("llc_contact_email");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push(fieldError("llc_contact_email", "Enter a valid email address."));
      }

      const phoneDigits = value("llc_contact_phone").replace(/\D/g, "");
      if (phoneDigits && phoneDigits.length < 10) {
        errors.push(fieldError("llc_contact_phone", "Phone number must contain at least 10 digits."));
      }

      if (value("llc_registered_agent_option") === "custom") {
        [
          ["llc_agent_name", "Registered agent name is required."],
          ["llc_agent_street", "Registered office street address is required."],
          ["llc_agent_city", "Registered office city is required."],
          ["llc_agent_state", "Registered office state is required."],
          ["llc_agent_zip", "Registered office ZIP code is required."]
        ].forEach(function ([id, msg]) {
          if (!value(id)) errors.push(fieldError(id, msg));
        });

        const agentStreet = value("llc_agent_street");
        if (ctx.stateRules?.registeredOfficeMustBePhysical &&
            /\b(p\.?\s*o\.?\s*box|post\s+office\s+box|private\s+mailbox|pmb)\b/i.test(agentStreet)) {
          errors.push(fieldError("llc_agent_street", "This jurisdiction requires a physical registered-office street address."));
        }

        if (ctx.stateRules?.registeredAgentMustBeInState &&
            value("llc_agent_state") &&
            value("llc_agent_state") !== ctx.jurisdiction) {
          errors.push(fieldError("llc_agent_state", `Registered-agent state must be ${ctx.jurisdiction}.`));
        }

        if (ctx.stateRules?.registeredAgentConsentRequired &&
            !document.getElementById("llc_agent_consent")?.checked) {
          errors.push(fieldError("llc_agent_consent", "Confirm the registered agent has consented to serve."));
        }
      }

      const personCards = document.querySelectorAll(".llc-governing-person-card");
      if (!personCards.length) {
        errors.push("At least one initial member or manager is required for this intake.");
      } else {
        personCards.forEach(function (card, index) {
          const n = index + 1;
          const fields = [
            [`llc_person_name_${n}`, `Governing person ${n} name is required.`],
            [`llc_person_street_${n}`, `Governing person ${n} address is required.`],
            [`llc_person_city_${n}`, `Governing person ${n} city is required.`],
            [`llc_person_state_${n}`, `Governing person ${n} state is required.`],
            [`llc_person_zip_${n}`, `Governing person ${n} ZIP code is required.`]
          ];
          fields.forEach(function ([id, msg]) {
            if (!value(id)) errors.push(fieldError(id, msg));
          });
        });
      }

      if (value("llc_effective_choice") === "delayed_date") {
        const requested = value("llc_effective_date");
        if (!requested) {
          errors.push(fieldError("llc_effective_date", "Requested effective date is required."));
        } else if (ctx.stateRules?.delayedEffectiveDaysMax) {
          const date = new Date(requested + "T00:00:00");
          const max = new Date();
          max.setHours(0,0,0,0);
          max.setDate(max.getDate() + ctx.stateRules.delayedEffectiveDaysMax);
          if (date > max) {
            errors.push(fieldError(
              "llc_effective_date",
              `For ${ctx.stateRules.label}, the requested delayed effective date cannot exceed ${ctx.stateRules.delayedEffectiveDaysMax} days.`
            ));
          }
        }
      }

      return { isValid: errors.length === 0, errors: errors };
    }
  };

  // --------------------------------------------------------------------------
  // SAFE PAYLOAD BUILDER
  // Compatibility helper for code that still calls buildPayloadsForSupabase().
  // It intentionally returns filing intake only.
  // --------------------------------------------------------------------------
  window.buildPayloadsForSupabase = function () {
    const ctx = getContext();
    const root = document.getElementById("step-2-onboarding-fields-canvas") || document;
    const answers = {};

    root.querySelectorAll("input, select, textarea").forEach(function (field) {
      if (!field || field.disabled || field.type === "file") return;
      const key = field.name || field.id;
      if (!key) return;

      if (field.type === "radio") {
        if (field.checked) answers[key] = field.value;
      } else if (field.type === "checkbox") {
        answers[key] = !!field.checked;
      } else {
        answers[key] = field.value;
      }
    });

    return {
      form_payload: {
        schema_version: "2026-09-04.llc.v2",
        service_key: SERVICE_KEY,
        jurisdiction_state: ctx.jurisdiction || null,
        answers: answers
      },
      errors: []
    };
  };

  window.LLC_FORMATION_VERIFIED_STATE_RULES = VERIFIED_STATE_RULES;
})();
