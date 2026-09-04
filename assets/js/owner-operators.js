// ============================================================================
// filings4u — OWNER-OPERATOR FMCSA REGISTRATION INTAKE
// Canonical Step 2 service module
//
// This intake collects the motor carrier/business facts needed to determine the
// proper FMCSA registration and operating-authority path. It does not itself
// determine whether authority, UCR, BOC-3, insurance, Clearinghouse/C/TPA, or
// other registrations are required.
// ============================================================================

(function () {
  "use strict";

  const SERVICE_KEY = "owner-operators";
  window.formRegistry = window.formRegistry || {};

  const val = id => String(document.getElementById(id)?.value || "").trim();

  function input(id, name, label, required=false, type="text") {
    return `<div class="wizard-input-group">
      <label for="${id}">${label}${required ? " *" : ""}</label>
      <input type="${type}" id="${id}" name="${name}" class="wizard-input-field"${required ? " required" : ""}>
      <div id="err_${id}" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
    </div>`;
  }

  function select(id, name, label, options, required=false) {
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

  window.formRegistry["owner-operators-form-master"] = function (stateOptionsHtml = "") {
    return `<section class="service-form-part-segment owner-operators-form"
      data-service="${SERVICE_KEY}"
      style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;width:100%;">

      <div style="grid-column:span 2;background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;padding:14px;border-radius:8px;">
        <strong style="display:block;color:#14532d;">Owner-Operator FMCSA Registration Intake</strong>
        <span style="color:#166534;font-size:.86rem;">Provide the business, vehicle, driver, cargo, and operating facts needed to determine the appropriate FMCSA registration path.</span>
      </div>

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
        <h3 style="margin:0;color:#0a1f44;">1. Business Identity</h3>
      </div>

      ${input("oo_legal_name","legal_business_name","Legal Business Name",true)}
      ${input("oo_dba","dba_name","DBA / Trade Name")}
      ${select("oo_entity_type","entity_type","Entity Type",`
        <option value="sole_proprietor">Sole proprietor</option>
        <option value="llc">LLC</option>
        <option value="corporation">Corporation</option>
        <option value="partnership">Partnership</option>
        <option value="other">Other</option>`,true)}
      ${input("oo_ein","federal_ein","EIN, if assigned")}

      ${input("oo_usdot","usdot_number","Existing USDOT Number, if assigned")}
      ${input("oo_docket","mc_mx_ff_number","Existing MC / MX / FF Number, if assigned")}

      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="oo_address">Principal Street Address *</label>
        <input id="oo_address" name="principal_address" class="wizard-input-field" required>
        <div id="err_oo_address" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
      </div>

      ${input("oo_city","principal_city","City",true)}
      <div class="wizard-input-group">
        <label for="oo_state">State *</label>
        <select id="oo_state" name="principal_state" class="wizard-input-field" required>
          <option value="">Select…</option>${stateOptionsHtml}
        </select>
        <div id="err_oo_state" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
      </div>
      ${input("oo_zip","principal_postal_code","ZIP / Postal Code",true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">2. Operations</h3>
      </div>

      ${select("oo_operation","operation_scope","Operation Scope",`
        <option value="interstate">Interstate</option>
        <option value="intrastate">Intrastate</option>
        <option value="both">Both interstate and intrastate</option>
        <option value="unknown">Not sure</option>`,true)}

      ${select("oo_carrier_type","carrier_type","Primary Operation Type",`
        <option value="for_hire_property">For-hire property carrier</option>
        <option value="private_property">Private property carrier</option>
        <option value="passenger">Passenger carrier</option>
        <option value="household_goods">Household goods carrier</option>
        <option value="broker">Broker</option>
        <option value="freight_forwarder">Freight forwarder</option>
        <option value="other">Other</option>
        <option value="unknown">Not sure</option>`,true)}

      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="oo_cargo">Cargo / Commodities Transported *</label>
        <textarea id="oo_cargo" name="cargo_types" class="wizard-input-field" rows="3" required></textarea>
        <div id="err_oo_cargo" class="wizard-error-message" style="display:none;color:#b91c1c;"></div>
      </div>

      ${select("oo_hazmat","hazardous_materials","Will You Transport Hazardous Materials?",`
        <option value="no">No</option>
        <option value="yes">Yes</option>
        <option value="unknown">Not sure</option>`,true)}

      ${select("oo_passengers","passenger_operations","Will You Transport Passengers?",`
        <option value="no">No</option>
        <option value="yes">Yes</option>`,true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">3. Vehicles & Drivers</h3>
      </div>

      ${input("oo_power_units","power_units","Number of Power Units",true,"number")}
      ${input("oo_cdl_drivers","cdl_drivers","Number of CDL Drivers",true,"number")}
      ${input("oo_noncdl_drivers","non_cdl_drivers","Number of Non-CDL Drivers",false,"number")}

      ${select("oo_vehicle_weight","vehicle_weight_class","Typical Vehicle / Combination Weight",`
        <option value="under_10001">10,000 lbs or less</option>
        <option value="10001_26000">10,001–26,000 lbs</option>
        <option value="over_26000">Over 26,000 lbs</option>
        <option value="mixed">Mixed fleet</option>
        <option value="unknown">Not sure</option>`,true)}

      ${select("oo_ownership","vehicle_ownership","Equipment Ownership",`
        <option value="owned">Owned</option>
        <option value="leased">Leased</option>
        <option value="mixed">Owned and leased</option>`,true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">4. Registration & Authority Status</h3>
      </div>

      ${select("oo_registration_status","fmcsa_registration_status","FMCSA Registration Status",`
        <option value="new">New registration / no USDOT yet</option>
        <option value="existing">Existing USDOT registration</option>
        <option value="pending">Application pending</option>
        <option value="inactive">Inactive / revoked / out of service</option>
        <option value="unknown">Not sure</option>`,true)}

      ${select("oo_authority","authority_requested","Operating Authority Need",`
        <option value="determine">Not sure — determine from operations</option>
        <option value="motor_carrier_property">Motor carrier of property</option>
        <option value="passenger_carrier">Passenger carrier</option>
        <option value="broker">Broker</option>
        <option value="freight_forwarder">Freight forwarder</option>
        <option value="none">Do not believe operating authority is needed</option>`,true)}

      ${select("oo_boc3_status","boc3_status","BOC-3 Status",`
        <option value="not_filed">Not filed</option>
        <option value="filed">Already filed</option>
        <option value="pending">Pending</option>
        <option value="unknown">Not sure</option>`,true)}

      ${select("oo_insurance_status","insurance_filing_status","FMCSA Insurance Filing Status",`
        <option value="not_arranged">Not arranged</option>
        <option value="arranged">Insurance arranged / filer identified</option>
        <option value="filed">Insurance filing appears submitted</option>
        <option value="unknown">Not sure</option>`,true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">5. Drug & Alcohol / Clearinghouse</h3>
      </div>

      ${select("oo_cdl_operation","cdl_operation_subject","Will the Operation Use CDL Drivers Subject to DOT Drug/Alcohol Testing?",`
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="unknown">Not sure</option>`,true)}

      ${select("oo_ctpa_status","ctpa_status","C/TPA / Consortium Status",`
        <option value="already_designated">Already enrolled / designated</option>
        <option value="needs_help">Need enrollment / designation guidance</option>
        <option value="not_applicable">Believe not applicable</option>
        <option value="unknown">Not sure</option>`,true)}

      <div style="grid-column:span 2;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin-top:8px;">
        <h3 style="margin:0;color:#0a1f44;">6. Contact & Additional Details</h3>
      </div>

      ${input("oo_contact_name","contact_full_name","Primary Contact",true)}
      ${input("oo_contact_phone","contact_phone","Phone",true,"tel")}
      ${input("oo_contact_email","contact_email","Email",true,"email")}

      <div class="wizard-input-group" style="grid-column:span 2;">
        <label for="oo_notes">Additional Operating / Registration Details</label>
        <textarea id="oo_notes" name="additional_instructions" class="wizard-input-field" rows="4"></textarea>
      </div>

      <div style="grid-column:span 2;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;color:#475569;font-size:.84rem;">
        This intake does not automatically determine USDOT eligibility, operating-authority class, insurance limits, BOC-3 requirements, UCR obligations, hazardous-materials registration, or Clearinghouse/C/TPA requirements. Those determinations belong to the applicable FMCSA/DOT rules and fulfillment workflow.
      </div>
    </section>`;
  };

  window.formRegistry["owner-operators-validation-engine"] = {
    validate() {
      clearErrors();
      const errors = [];
      const root = document.querySelector('[data-service="owner-operators"]');
      if (!root) return { isValid:true, errors:[] };

      root.querySelectorAll("[required]").forEach(el => {
        if (!el.disabled && !String(el.value || "").trim()) {
          errors.push(setError(el.id, "This field is required."));
        }
      });

      if (val("oo_ein") && val("oo_ein").replace(/\D/g,"").length !== 9) {
        errors.push(setError("oo_ein","Enter a valid 9-digit EIN or leave blank."));
      }

      if (val("oo_usdot") && !/^\d+$/.test(val("oo_usdot"))) {
        errors.push(setError("oo_usdot","USDOT number must contain digits only."));
      }

      if (val("oo_docket") &&
          !/^(?:(?:MC|MX|FF)\s*-?\s*)?\d+$/i.test(val("oo_docket"))) {
        errors.push(setError("oo_docket","Enter a valid MC, MX, FF, or numeric authority identifier."));
      }

      ["oo_power_units","oo_cdl_drivers","oo_noncdl_drivers"].forEach(id => {
        if (val(id) && Number(val(id)) < 0) {
          errors.push(setError(id,"Enter zero or a positive value."));
        }
      });

      if (val("oo_contact_email") &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("oo_contact_email"))) {
        errors.push(setError("oo_contact_email","Enter a valid email address."));
      }

      if (val("oo_contact_phone").replace(/\D/g,"").length < 10) {
        errors.push(setError("oo_contact_phone","Phone number must contain at least 10 digits."));
      }

      return { isValid:errors.length===0, errors };
    }
  };

  window.initOwnerOperatorsService = function () {};

  window.buildPayloadsForSupabase = function () {
    const root = document.querySelector('[data-service="owner-operators"]') || document;
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
        schema_version:"2026-09-04.owner-operators.v2",
        service_key:SERVICE_KEY,
        jurisdiction_state:null,
        answers
      },
      errors:[]
    };
  };
})();
