/**
 * filings4u — LLC Formation Application
 * Clean customer-facing intake for Articles of Organization.
 * Route owns the service/package/jurisdiction; this form only asks filing data.
 */
(function () {
  "use strict";

  window.formRegistry = window.formRegistry || {};

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));

  const q = (id) => document.getElementById(id);
  const val = (id) => String(q(id)?.value || "").trim();

  const FIELD = (id, label, type = "text", attrs = "") => `
    <div class="f4u-form-field">
      <label for="${id}">${label}</label>
      <input id="${id}" name="${id}" type="${type}" class="wizard-input-field" ${attrs}>
      <div id="err_${id}" class="wizard-error-message" aria-live="polite"></div>
    </div>`;

  const SELECT = (id, label, options, attrs = "") => `
    <div class="f4u-form-field">
      <label for="${id}">${label}</label>
      <select id="${id}" name="${id}" class="wizard-input-field" ${attrs}>${options}</select>
      <div id="err_${id}" class="wizard-error-message" aria-live="polite"></div>
    </div>`;

  const stateOptions = (optionsHtml, includeBlank = true) => {
    if (!optionsHtml) return includeBlank ? '<option value="">Select state</option>' : "";
    const hasBlank = /value=["']["']/.test(optionsHtml);
    return includeBlank && !hasBlank ? '<option value="">Select state</option>' + optionsHtml : optionsHtml;
  };

  function section(number, title, description, body) {
    return `
      <section class="f4u-form-section">
        <div class="f4u-form-section__head">
          <span class="f4u-form-section__number">${number}</span>
          <div>
            <h3>${title}</h3>
            ${description ? `<p>${description}</p>` : ""}
          </div>
        </div>
        <div class="f4u-form-section__body">${body}</div>
      </section>`;
  }

  window.formRegistry["llc-formation-form-master"] = function (stateDropdownOptionsHtml = "", context = {}) {
    const filingState = context.state || window.F4UWizard?.state?.route?.jurisdiction || "";
    const states = stateOptions(stateDropdownOptionsHtml);

    return `
      <div class="f4u-service-form" data-service-form="llc-formation">
        <div class="f4u-service-form__notice">
          <div class="f4u-service-form__notice-icon" aria-hidden="true">✓</div>
          <div>
            <strong>LLC Articles of Organization</strong>
            <p>Provide the information that will be used to prepare your ${filingState ? `${esc(filingState)} ` : ""}LLC filing. Your package selection is already saved, so you will not be asked to select it again.</p>
          </div>
        </div>

        ${section("1", "LLC name", "Tell us the legal name you want to register.", `
          <div class="f4u-field-grid f4u-field-grid--2">
            ${FIELD("company_name", "Proposed LLC name *", "text", 'required autocomplete="organization" placeholder="Example: Northstar Logistics"')}
            ${SELECT("llc_designator", "Legal designator *", `
              <option value="LLC">LLC</option>
              <option value="L.L.C.">L.L.C.</option>
              <option value="Limited Liability Company">Limited Liability Company</option>
            `, "required")}
          </div>
          <div class="f4u-field-grid">
            ${FIELD("alternate_company_name", "Alternate name (optional)", "text", 'placeholder="Second choice if the first name is unavailable"')}
          </div>
          <label class="f4u-choice-row">
            <input type="checkbox" id="name_search_acknowledged">
            <span><strong>Name availability</strong><small>I understand final name availability is determined by the filing office.</small></span>
          </label>
        `)}

        ${section("2", "Principal business address", "Enter the primary physical address for the LLC.", `
          <div class="f4u-field-grid">
            ${FIELD("street_address", "Street address *", "text", 'required autocomplete="address-line1" placeholder="Street address — no P.O. box if prohibited by your state"')}
            ${FIELD("address_line_2", "Suite / unit (optional)", "text", 'autocomplete="address-line2" placeholder="Suite, unit, floor, etc."')}
          </div>
          <div class="f4u-field-grid f4u-field-grid--3">
            ${FIELD("city", "City *", "text", 'required autocomplete="address-level2"')}
            ${SELECT("state", "State *", states, 'required autocomplete="address-level1"')}
            ${FIELD("zip_code", "ZIP code *", "text", 'required inputmode="numeric" autocomplete="postal-code" maxlength="10"')}
          </div>
          <label class="f4u-choice-row">
            <input type="checkbox" id="mailing_same_as_principal" checked>
            <span><strong>Mailing address is the same</strong><small>Uncheck this if your mailing address is different.</small></span>
          </label>
          <div id="llc-mailing-fields" class="f4u-conditional-card" hidden>
            <div class="f4u-field-grid">
              ${FIELD("mailing_street_address", "Mailing street address *", "text", 'autocomplete="address-line1"')}
              ${FIELD("mailing_address_line_2", "Mailing suite / unit (optional)", "text", 'autocomplete="address-line2"')}
            </div>
            <div class="f4u-field-grid f4u-field-grid--3">
              ${FIELD("mailing_city", "Mailing city *")}
              ${SELECT("mailing_state", "Mailing state *", states)}
              ${FIELD("mailing_zip_code", "Mailing ZIP code *", "text", 'inputmode="numeric" maxlength="10"')}
            </div>
          </div>
        `)}

        ${section("3", "Registered agent", "Every LLC must maintain a registered agent in its filing state.", `
          <div class="f4u-option-cards" role="radiogroup" aria-label="Registered agent selection">
            <label class="f4u-option-card">
              <input type="radio" name="registered_agent_option" value="filings4u" checked>
              <span>
                <strong>Use filings4u Registered Agent service</strong>
                <small>Choose this if you want registered agent service added to your order when available.</small>
              </span>
            </label>
            <label class="f4u-option-card">
              <input type="radio" name="registered_agent_option" value="custom">
              <span>
                <strong>I already have a registered agent</strong>
                <small>Provide the individual or company that will accept service of process.</small>
              </span>
            </label>
          </div>

          <div id="agent_details_wrapper" class="f4u-conditional-card" hidden>
            <div class="f4u-field-grid f4u-field-grid--2">
              ${SELECT("agent_type", "Agent type *", `
                <option value="">Select type</option>
                <option value="individual">Individual</option>
                <option value="entity">Company / registered agent provider</option>
              `)}
              ${FIELD("agent_name", "Registered agent name *", "text", 'placeholder="Full legal name or company name"')}
            </div>
            <div class="f4u-field-grid">
              ${FIELD("agent_street", "Registered office street address *", "text", 'placeholder="Physical address in the filing state"')}
              ${FIELD("agent_address_line_2", "Suite / unit (optional)")}
            </div>
            <div class="f4u-field-grid f4u-field-grid--3">
              ${FIELD("agent_city", "City *")}
              ${SELECT("agent_state", "State *", states)}
              ${FIELD("agent_zip_code", "ZIP code *", "text", 'inputmode="numeric" maxlength="10"')}
            </div>
            <label class="f4u-choice-row">
              <input type="checkbox" id="agent_consent_confirmed">
              <span><strong>Agent consent confirmed *</strong><small>I confirm this registered agent has agreed to serve in this role.</small></span>
            </label>
          </div>
        `)}

        ${section("4", "Management & ownership", "Tell us how the LLC will be managed and who should appear on the filing when required.", `
          <div class="f4u-field-grid f4u-field-grid--2">
            ${SELECT("mgmt_type", "Management structure *", `
              <option value="">Select management structure</option>
              <option value="member">Member-managed</option>
              <option value="manager">Manager-managed</option>
            `, "required")}
            ${SELECT("owner_count", "Number of initial owners / members *", `
              <option value="">Select</option>
              ${Array.from({length: 10}, (_, i) => `<option value="${i+1}">${i+1}${i === 9 ? "+" : ""}</option>`).join("")}
            `, "required")}
          </div>
          <div class="f4u-field-grid">
            ${FIELD("authorized_person_name", "Primary member / manager full legal name *", "text", 'required autocomplete="name"')}
            ${FIELD("authorized_person_title", "Title / capacity *", "text", 'required placeholder="Member, Manager, Managing Member, etc."')}
          </div>
          <label class="f4u-choice-row">
            <input type="checkbox" id="additional_owners_exist">
            <span><strong>Add additional members or managers</strong><small>Turn this on if there are additional people we should collect for your filing record.</small></span>
          </label>
          <div id="additional-owner-fields" class="f4u-conditional-card" hidden>
            <div class="f4u-field-grid f4u-field-grid--2">
              ${FIELD("additional_owner_1_name", "Additional member / manager name")}
              ${FIELD("additional_owner_1_title", "Title / capacity")}
            </div>
            <div class="f4u-field-grid f4u-field-grid--2">
              ${FIELD("additional_owner_2_name", "Additional member / manager name")}
              ${FIELD("additional_owner_2_title", "Title / capacity")}
            </div>
          </div>
        `)}

        ${section("5", "Business details", "A few details help us prepare the filing correctly.", `
          <div class="f4u-field-grid f4u-field-grid--2">
            ${SELECT("business_purpose_type", "Business purpose *", `
              <option value="general">Any lawful business purpose permitted by law</option>
              <option value="custom">Use a specific business purpose</option>
            `, "required")}
            ${SELECT("duration_type", "Duration *", `
              <option value="perpetual">Perpetual</option>
              <option value="fixed">Ends on a specific date</option>
            `, "required")}
          </div>
          <div id="custom-purpose-wrapper" class="f4u-conditional-card" hidden>
            <div class="f4u-form-field">
              <label for="business_purpose">Specific business purpose *</label>
              <textarea id="business_purpose" class="wizard-input-field" placeholder="Describe the primary business activity"></textarea>
              <div id="err_business_purpose" class="wizard-error-message" aria-live="polite"></div>
            </div>
          </div>
          <div id="duration-date-wrapper" class="f4u-conditional-card" hidden>
            ${FIELD("duration_end_date", "End date *", "date")}
          </div>
          <div class="f4u-field-grid f4u-field-grid--2">
            ${SELECT("effective_date_type", "When should the LLC become effective? *", `
              <option value="filing">When accepted by the state</option>
              <option value="future">On a future date</option>
            `, "required")}
            <div id="future-effective-date-wrapper" hidden>
              ${FIELD("future_effective_date", "Future effective date *", "date")}
            </div>
          </div>
        `)}

        ${section("6", "Primary contact", "We use this information for filing questions and order updates.", `
          <div class="f4u-field-grid f4u-field-grid--2">
            ${FIELD("first_name", "First name *", "text", 'required autocomplete="given-name"')}
            ${FIELD("last_name", "Last name *", "text", 'required autocomplete="family-name"')}
          </div>
          <div class="f4u-field-grid f4u-field-grid--2">
            ${FIELD("email_address", "Email address *", "email", 'required autocomplete="email" inputmode="email"')}
            ${FIELD("phone_number", "Phone number *", "tel", 'required autocomplete="tel" inputmode="tel"')}
          </div>
        `)}

        ${section("7", "Additional filing instructions", "Optional. Add only information you want our filing team to review.", `
          <div class="f4u-form-field">
            <label for="special_provisions">Special instructions or provisions (optional)</label>
            <textarea id="special_provisions" class="wizard-input-field" placeholder="Example: preferred effective date wording, internal reference notes, or other filing instructions"></textarea>
            <div id="err_special_provisions" class="wizard-error-message" aria-live="polite"></div>
          </div>
        `)}
      </div>`;
  };

  function setRequired(container, required) {
    if (!container) return;
    container.querySelectorAll("input, select, textarea").forEach((el) => {
      if (required) el.setAttribute("required", "required");
      else el.removeAttribute("required");
    });
  }

  function toggleBlock(id, show, requireFields = false) {
    const el = q(id);
    if (!el) return;
    el.hidden = !show;
    el.style.display = show ? "" : "none";
    setRequired(el, show && requireFields);
  }

  function syncConditionalFields() {
    const mailingSame = q("mailing_same_as_principal")?.checked !== false;
    toggleBlock("llc-mailing-fields", !mailingSame, true);

    const agentChoice = document.querySelector('input[name="registered_agent_option"]:checked')?.value || "filings4u";
    toggleBlock("agent_details_wrapper", agentChoice === "custom", agentChoice === "custom");

    toggleBlock("additional-owner-fields", !!q("additional_owners_exist")?.checked, false);
    toggleBlock("custom-purpose-wrapper", val("business_purpose_type") === "custom", val("business_purpose_type") === "custom");
    toggleBlock("duration-date-wrapper", val("duration_type") === "fixed", val("duration_type") === "fixed");
    toggleBlock("future-effective-date-wrapper", val("effective_date_type") === "future", val("effective_date_type") === "future");
  }

  document.addEventListener("change", (event) => {
    if (!event.target.closest?.('[data-service-form="llc-formation"]')) return;
    syncConditionalFields();
  });

  document.addEventListener("input", (event) => {
    if (!event.target.closest?.('[data-service-form="llc-formation"]')) return;
    if (event.target.id === "zip_code" || event.target.id === "agent_zip_code" || event.target.id === "mailing_zip_code") {
      event.target.value = event.target.value.replace(/[^\d-]/g, "").slice(0, 10);
    }
  });

  window.formRegistry["llc-formation-validation-engine"] = {
    validate() {
      syncConditionalFields();
      const root = document.querySelector('[data-service-form="llc-formation"]');
      if (!root) return { isValid: false, errors: ["LLC form is not available."] };

      let firstInvalid = null;
      const errors = [];

      root.querySelectorAll("[required]").forEach((field) => {
        if (field.closest("[hidden]")) return;
        let valid = true;
        if (field.type === "checkbox") valid = field.checked;
        else if (field.type === "radio") {
          valid = !!root.querySelector(`input[name="${CSS.escape(field.name)}"]:checked`);
        } else valid = !!String(field.value || "").trim();

        const err = q(`err_${field.id}`);
        if (!valid) {
          field.setAttribute("aria-invalid", "true");
          if (err) {
            err.textContent = "Please complete this required field.";
            err.style.display = "block";
          }
          firstInvalid ||= field;
          errors.push(field.id || field.name);
        } else {
          field.removeAttribute("aria-invalid");
          if (err) {
            err.textContent = "";
            err.style.display = "none";
          }
        }
      });

      const email = q("email_address");
      if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        q("err_email_address").textContent = "Enter a valid email address.";
        q("err_email_address").style.display = "block";
        email.setAttribute("aria-invalid", "true");
        firstInvalid ||= email;
        errors.push("email_address");
      }

      const phone = q("phone_number");
      if (phone?.value && phone.value.replace(/\D/g, "").length < 10) {
        q("err_phone_number").textContent = "Enter a valid phone number with at least 10 digits.";
        q("err_phone_number").style.display = "block";
        phone.setAttribute("aria-invalid", "true");
        firstInvalid ||= phone;
        errors.push("phone_number");
      }

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return { isValid: errors.length === 0, errors };
    }
  };

  // Preserve compatibility with existing payload builders / order code.
  window.buildPayloadsForSupabase = function (opts = {}) {
    const get = (id) => q(id)?.type === "checkbox" ? !!q(id)?.checked : (q(id)?.value || null);
    const agentChoice = document.querySelector('input[name="registered_agent_option"]:checked')?.value || "filings4u";
    const route = window.F4UWizard?.refreshRoute?.() || {};
    const formData = {
      entity_name: get("company_name"),
      legal_designator: get("llc_designator"),
      alternate_name: get("alternate_company_name"),
      principal_address: {
        street: get("street_address"), line2: get("address_line_2"), city: get("city"),
        state: get("state"), zip: get("zip_code")
      },
      mailing_same_as_principal: get("mailing_same_as_principal"),
      mailing_address: get("mailing_same_as_principal") ? null : {
        street: get("mailing_street_address"), line2: get("mailing_address_line_2"), city: get("mailing_city"),
        state: get("mailing_state"), zip: get("mailing_zip_code")
      },
      registered_agent: agentChoice === "filings4u" ? { option: "filings4u" } : {
        option: "custom", type: get("agent_type"), name: get("agent_name"), street: get("agent_street"),
        line2: get("agent_address_line_2"), city: get("agent_city"), state: get("agent_state"),
        zip: get("agent_zip_code"), consent_confirmed: get("agent_consent_confirmed")
      },
      management_structure: get("mgmt_type"),
      owner_count: get("owner_count"),
      primary_authorized_person: { name: get("authorized_person_name"), title: get("authorized_person_title") },
      additional_owners_exist: get("additional_owners_exist"),
      additional_people: [
        { name: get("additional_owner_1_name"), title: get("additional_owner_1_title") },
        { name: get("additional_owner_2_name"), title: get("additional_owner_2_title") }
      ].filter(x => x.name || x.title),
      business_purpose_type: get("business_purpose_type"),
      business_purpose: get("business_purpose"),
      duration_type: get("duration_type"),
      duration_end_date: get("duration_end_date"),
      effective_date_type: get("effective_date_type"),
      future_effective_date: get("future_effective_date"),
      contact: {
        first_name: get("first_name"), last_name: get("last_name"),
        email: get("email_address"), phone: get("phone_number")
      },
      special_provisions: get("special_provisions")
    };

    return {
      orders: {
        first_name: get("first_name") || "",
        last_name: get("last_name") || "",
        email_address: String(get("email_address") || "").toLowerCase(),
        phone_number: get("phone_number") || "",
        company_name: [get("company_name"), get("llc_designator")].filter(Boolean).join(" "),
        street_address: get("street_address"),
        city: get("city"),
        state: get("state"),
        zip_code: get("zip_code"),
        selected_plan: route.planTier || null,
        selected_service: route.serviceKey || "llc-formation"
      },
      client_profiles: {
        ...(opts.userId ? { id: opts.userId } : {}),
        first_name: get("first_name"),
        last_name: get("last_name"),
        email_address: String(get("email_address") || "").toLowerCase(),
        phone_number: get("phone_number"),
        street_address: get("street_address"),
        city: get("city"),
        state: get("state"),
        zip_code: get("zip_code")
      },
      form_payload: formData,
      errors: []
    };
  };

  // Render-time conditional state. Step 3 injects the HTML asynchronously.
  const observer = new MutationObserver(() => {
    if (document.querySelector('[data-service-form="llc-formation"]')) syncConditionalFields();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
