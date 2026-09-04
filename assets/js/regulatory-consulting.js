// ============================================================================
// filings4u — REGULATORY COMPLIANCE CONSULTING INTAKE
// Canonical Step 2 service module
//
// This is a consulting intake, not a government filing.
// It gathers the factual compliance context needed to identify agencies,
// registrations, notices, deadlines, and recommended next actions.
// ============================================================================

(function () {
  "use strict";

  const SERVICE_KEY = "regulatory-consulting";
  window.formRegistry = window.formRegistry || {};

  const val = id => String(document.getElementById(id)?.value || "").trim();

  function input(id, name, label, required = false, type = "text") {
    return `<div class="wizard-input-group">
      <label for="${id}">${label}${required ? " *" : ""}</label>
      <input type="${type}" id="${id}" name="${name}" class="wizard-input-field"${required ? " required" : ""}>
      <div id="err_${id}" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
    </div>`;
  }

  function select(id, name, label, options, required = false) {
    return `<div class="wizard-input-group">
      <label for="${id}">${label}${required ? " *" : ""}</label>
      <select id="${id}" name="${name}" class="wizard-input-field"${required ? " required" : ""}>
        <option value="">Select…</option>${options}
      </select>
      <div id="err_${id}" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
    </div>`;
  }

  function setError(id, msg) {
    const el = document.getElementById(id);
    const node = document.getElementById("err_" + id);
    if (el) el.style.borderColor = "#b91c1c";
    if (node) {
      node.textContent = msg;
      node.style.display = "block";
    }
    return msg;
  }

  function clearErrors() {
    document.querySelectorAll(".wizard-error-message").forEach(node => {
      node.textContent = "";
      node.style.display = "none";
    });
    document.querySelectorAll(".wizard-input-field").forEach(el => {
      el.style.removeProperty("border-color");
    });
  }

  window.formRegistry["regulatory-consulting-form-master"] = function (stateOptionsHtml = "") {
    return `<section class="service-form-part-segment regulatory-consulting-form"
      data-service="regulatory-consulting"
      style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;width:100%;">

      <div style="grid-column:span 2;background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;padding:14px;border-radius:8px;">
        <strong style="display:block;color:#14532d;">Regulatory Compliance Consultation Intake</strong>
        <span style="color:#166534;font-size:.86rem;">This is a consulting intake, not a government filing form. It helps identify the agencies, registrations, notices, deadlines, and compliance actions that need review.</span>
      </div>

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
        <h3 style="margin:0;color:#0a1f44;">1. Business Profile</h3>
      </div>

      ${input("rc_legal_name","legal_business_name","Business Legal Name",true)}
      ${select("rc_entity_type","entity_type","Entity Type",`
        <option value="sole_proprietor">Sole proprietor</option>
        <option value="llc">LLC</option>
        <option value="corporation">Corporation</option>
        <option value="partnership">Partnership</option>
        <option value="nonprofit">Nonprofit</option>
        <option value="other">Other</option>`,true)}

      <div class="wizard-input-group">
        <label for="rc_state">Primary State *</label>
        <select id="rc_state" name="primary_state" class="wizard-input-field" required>
          <option value="">Select…</option>${stateOptionsHtml}
        </select>
        <div id="err_rc_state" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
      </div>

      ${input("rc_industry","industry","Industry / Business Activity",true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">2. Existing Registrations & Identifiers</h3>
      </div>

      ${input("rc_ein","ein","EIN, if applicable")}
      ${input("rc_usdot","usdot_number","USDOT Number, if applicable")}
      ${input("rc_mc","mc_mx_ff_number","MC / MX / FF Number, if applicable")}
      ${input("rc_cage","cage_code","CAGE Code, if applicable")}
      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="rc_other_ids">Other Registrations / Identifiers</label>
        <textarea id="rc_other_ids" name="other_identifiers" class="wizard-input-field" rows="3"
          placeholder="State tax IDs, permits, licenses, UCR, IFTA, SCAC, CLIA, SAM, etc."></textarea>
      </div>

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">3. Agencies & Compliance Areas</h3>
      </div>

      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="rc_agencies">Known Agencies Involved</label>
        <textarea id="rc_agencies" name="agencies_involved" class="wizard-input-field" rows="3"
          placeholder="IRS, FMCSA, DOT, Secretary of State, state revenue, licensing boards, local agencies, etc."></textarea>
      </div>

      ${select("rc_compliance_area","primary_compliance_area","Primary Compliance Area",`
        <option value="business_entity">Business entity / Secretary of State</option>
        <option value="tax">Federal or state tax</option>
        <option value="transportation">Transportation / FMCSA / DOT</option>
        <option value="licensing">Licensing / permits</option>
        <option value="employment">Employment / payroll</option>
        <option value="health_safety">Health / safety / regulated operations</option>
        <option value="government_contracting">Government contracting / registrations</option>
        <option value="multiple">Multiple areas</option>
        <option value="unknown">Not sure</option>`,true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">4. Notices, Deadlines & Current Status</h3>
      </div>

      ${select("rc_notice_received","notice_received","Have You Received a Government or Agency Notice?",`
        <option value="no">No</option>
        <option value="yes">Yes</option>`,true)}

      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="rc_deadlines">Known Deadlines / Notice Details</label>
        <textarea id="rc_deadlines" name="deadlines_or_notices" class="wizard-input-field" rows="3"
          placeholder="Due dates, notice numbers, audit dates, renewal deadlines, suspension dates, response deadlines, etc."></textarea>
      </div>

      ${select("rc_business_status","business_compliance_status","Current Compliance Status, if known",`
        <option value="good_standing">Appears current / in good standing</option>
        <option value="delinquent">Delinquent / past due</option>
        <option value="suspended">Suspended / inactive / revoked</option>
        <option value="under_review">Audit / review / investigation</option>
        <option value="unknown">Unknown</option>`,true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">5. Consultation Objective</h3>
      </div>

      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="rc_issue">Describe the Compliance Issue or Objective *</label>
        <textarea id="rc_issue" name="consulting_objective" class="wizard-input-field" rows="5" required
          placeholder="Describe what needs to be corrected, registered, renewed, reviewed, or planned."></textarea>
        <div id="err_rc_issue" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="rc_desired_outcome">Desired Outcome</label>
        <textarea id="rc_desired_outcome" name="desired_outcome" class="wizard-input-field" rows="3"></textarea>
      </div>

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">6. Primary Contact</h3>
      </div>

      ${input("rc_contact_name","contact_full_name","Contact Full Name",true)}
      ${input("rc_contact_phone","contact_phone","Phone",true,"tel")}
      ${input("rc_contact_email","contact_email","Email",true,"email")}

      <div style="grid-column:span 2;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;color:#475569;font-size:.84rem;">
        This intake does not create or submit a filing, determine legal eligibility, or guarantee a compliance outcome. Any agency-specific forms, deadlines, evidence requests, fees, and remediation steps should be identified during the consulting review.
      </div>
    </section>`;
  };

  window.formRegistry["regulatory-consulting-validation-engine"] = {
    validate() {
      clearErrors();
      const errors = [];
      const root = document.querySelector('[data-service="regulatory-consulting"]');
      if (!root) return { isValid: true, errors: [] };

      root.querySelectorAll("[required]").forEach(el => {
        if (!String(el.value || "").trim()) {
          errors.push(setError(el.id, "This field is required."));
        }
      });

      if (val("rc_ein") && val("rc_ein").replace(/\D/g, "").length !== 9) {
        errors.push(setError("rc_ein", "Enter a valid 9-digit EIN or leave blank."));
      }

      if (val("rc_usdot") && !/^\d+$/.test(val("rc_usdot"))) {
        errors.push(setError("rc_usdot", "USDOT number must contain digits only."));
      }

      if (val("rc_contact_email") &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("rc_contact_email"))) {
        errors.push(setError("rc_contact_email", "Enter a valid email address."));
      }

      if (val("rc_contact_phone").replace(/\D/g, "").length < 10) {
        errors.push(setError("rc_contact_phone", "Phone number must contain at least 10 digits."));
      }

      return { isValid: errors.length === 0, errors };
    }
  };

  window.initRegulatoryConsultingService = function () {};

  window.buildPayloadsForSupabase = function () {
    const root = document.querySelector('[data-service="regulatory-consulting"]') || document;
    const answers = {};

    root.querySelectorAll("input,select,textarea").forEach(el => {
      if (el.disabled || el.type === "file") return;
      const key = el.name || el.id;
      if (!key) return;

      if (el.type === "radio") {
        if (el.checked) answers[key] = el.value;
      } else if (el.type === "checkbox") {
        answers[key] = !!el.checked;
      } else {
        answers[key] = el.value;
      }
    });

    return {
      form_payload: {
        schema_version: "2026-09-04.regulatory-consulting.v2",
        service_key: SERVICE_KEY,
        jurisdiction_state: null,
        answers
      },
      errors: []
    };
  };
})();
