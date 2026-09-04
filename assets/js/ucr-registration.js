// filings4u — UCR REGISTRATION | Canonical Step 2 service module
(function(){"use strict";
const K="ucr-registration";window.formRegistry=window.formRegistry||{};const v=id=>String(document.getElementById(id)?.value||"").trim();
const states=["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(x=>`<option value="${x}">${x}</option>`).join("");
function i(id,name,label,req=false,type="text",extra=""){return `<div class="wizard-input-group"><label for="${id}">${label}${req?" *":""}</label><input id="${id}" name="${name}" type="${type}" class="wizard-input-field"${req?" required":""} ${extra}><div id="err_${id}" class="wizard-error-message" style="display:none;color:#b91c1c"></div></div>`}
function s(id,name,label,o,req=false){return `<div class="wizard-input-group"><label for="${id}">${label}${req?" *":""}</label><select id="${id}" name="${name}" class="wizard-input-field"${req?" required":""}><option value="">Select…</option>${o}</select><div id="err_${id}" class="wizard-error-message" style="display:none;color:#b91c1c"></div></div>`}
function a(id,name,label,ph=""){return `<div class="wizard-input-group" style="grid-column:span 2"><label for="${id}">${label}</label><textarea id="${id}" name="${name}" class="wizard-input-field" rows="4" placeholder="${ph}"></textarea></div>`}
function er(id,msg){const x=document.getElementById(id),n=document.getElementById("err_"+id);if(x)x.style.borderColor="#b91c1c";if(n){n.textContent=msg;n.style.display="block"}return msg}

window.formRegistry["ucr-registration-form-master"]=()=>`<section data-service="${K}" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;width:100%">
<div style="grid-column:span 2;background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #10b981;padding:14px;border-radius:8px"><strong style="color:#14532d">Unified Carrier Registration Intake</strong><div style="color:#166534;font-size:.86rem">Provide registrant, fleet, and operating facts for UCR review. The fulfillment workflow determines UCR applicability, the correct registrant category, fleet bracket, base-state treatment, current-year fee, and any exemptions or special handling.</div></div>

<div style="grid-column:span 2;border-bottom:1px solid #e2e8f0"><h3>1. Registrant Profile</h3></div>
${i("ucr_legal_name","legal_business_name","Legal Business Name",true)}
${i("ucr_dba","dba_name","DBA / Trade Name")}
${i("ucr_usdot","usdot_number","USDOT Number, if assigned")}
${i("ucr_mc","operating_authority_number","MC / MX / FF Number, if assigned")}
${s("ucr_type","registrant_type","Registrant Type",`<option value="motor_carrier">Motor carrier</option><option value="motor_private_carrier">Motor private carrier</option><option value="freight_forwarder">Freight forwarder</option><option value="broker">Broker</option><option value="leasing_company">Leasing company</option><option value="multiple">Multiple categories</option><option value="other">Other</option><option value="unknown">Not sure</option>`,true)}
${s("ucr_state","principal_state","Principal State / Base State",states,true)}

<div style="grid-column:span 2;border-bottom:1px solid #e2e8f0"><h3>2. Registration Request</h3></div>
${i("ucr_year","registration_year","Registration Year",true,"number",'min="2005" step="1"')}
${s("ucr_request_type","request_type","Request Type",`<option value="new">New registration</option><option value="renewal">Annual renewal</option><option value="amendment">Amendment / correction</option><option value="status_review">Status / applicability review</option><option value="late">Late / past-due registration review</option><option value="unknown">Not sure</option>`,true)}
${s("ucr_existing_status","existing_ucr_status","Existing UCR Status",`<option value="none">No current registration</option><option value="active">Active / believed current</option><option value="expired">Expired / prior-year only</option><option value="issue">Issue / discrepancy</option><option value="unknown">Not sure</option>`)}

<div style="grid-column:span 2;border-bottom:1px solid #e2e8f0"><h3>3. Fleet &amp; Operations</h3></div>
${i("ucr_fleet","commercial_motor_vehicle_count","Commercial Motor Vehicles Owned / Operated, if applicable",false,"number",'min="0" step="1"')}
${s("ucr_interstate","interstate_operations_status","Interstate / International Operations Status",`<option value="yes">Yes</option><option value="no">No</option><option value="planned">Planned</option><option value="unknown">Not sure</option>`,true)}
${s("ucr_for_hire","for_hire_status","For-Hire Operations?",`<option value="yes">Yes</option><option value="no">No</option><option value="not_applicable">Not applicable</option><option value="unknown">Not sure</option>`)}
${s("ucr_passenger","passenger_operations","Passenger Operations?",`<option value="yes">Yes</option><option value="no">No</option><option value="unknown">Not sure</option>`)}
${s("ucr_hazmat","hazmat_operations","Hazardous Materials Operations?",`<option value="yes">Yes</option><option value="no">No</option><option value="unknown">Not sure</option>`)}
${a("ucr_fleet_notes","fleet_and_operation_notes","Fleet / Operation Notes","Describe fleet composition, leased vehicles, broker-only activity, freight-forwarder activity, changes from prior registration, or anything that may affect the registration category or fleet count.")}

<div style="grid-column:span 2;border-bottom:1px solid #e2e8f0"><h3>4. Contact &amp; Existing Issues</h3></div>
${i("ucr_contact_name","contact_name","Contact Name",true)}
${i("ucr_contact_phone","contact_phone","Phone",true,"tel")}
${i("ucr_contact_email","contact_email","Email",true,"email")}
${a("ucr_notice","ucr_notices_or_issues","UCR Notices / Existing Issues","Describe notices, prior registration errors, enforcement correspondence, fee disputes, state questions, or registration deadlines.")}
${a("ucr_additional","additional_instructions","Additional Instructions")}

<div style="grid-column:span 2;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;color:#475569;font-size:.84rem">The customer is not required to certify UCR applicability in Step 2. Applicability and the current fee bracket should be determined from the registrant type, operations, fleet count, and current UCR rules during fulfillment.</div>
</section>`;

window.formRegistry["ucr-registration-validation-engine"]={validate(){const root=document.querySelector(`[data-service="${K}"]`);if(!root)return{isValid:true,errors:[]};root.querySelectorAll(".wizard-error-message").forEach(n=>{n.textContent="";n.style.display="none"});root.querySelectorAll(".wizard-input-field").forEach(n=>n.style.removeProperty("border-color"));const e=[];root.querySelectorAll("[required]").forEach(x=>{if(!v(x.id))e.push(er(x.id,"This field is required."))});const dot=v("ucr_usdot").replace(/\D/g,"");if(v("ucr_usdot")&&!dot)e.push(er("ucr_usdot","If provided, enter a valid USDOT number."));const docket=v("ucr_mc").toUpperCase();if(docket&&!/^(MC|MX|FF)?-?\d+$/.test(docket))e.push(er("ucr_mc","If provided, enter a valid MC, MX, or FF number format."));const yr=Number(v("ucr_year"));if(!Number.isInteger(yr)||yr<2005||yr>new Date().getFullYear()+1)e.push(er("ucr_year","Enter a valid UCR registration year."));const fleet=v("ucr_fleet");if(fleet!==""&&(!Number.isInteger(Number(fleet))||Number(fleet)<0))e.push(er("ucr_fleet","Enter zero or a positive whole-number fleet count."));if(v("ucr_contact_email")&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("ucr_contact_email")))e.push(er("ucr_contact_email","Enter a valid email address."));if(v("ucr_contact_phone").replace(/\D/g,"").length<10)e.push(er("ucr_contact_phone","Phone number must contain at least 10 digits."));return{isValid:!e.length,errors:e}}};

window.validateUcrRegistrationForm=()=>window.formRegistry["ucr-registration-validation-engine"].validate().isValid;
window.initUcrRegistrationService=function(){};
window.buildPayloadsForSupabase=function(){const root=document.querySelector(`[data-service="${K}"]`)||document,answers={};root.querySelectorAll("input,select,textarea").forEach(x=>{if(x.disabled||x.type==="file")return;const key=x.name||x.id;if(!key)return;if(x.type==="checkbox"){answers[key]??=[];if(x.checked)answers[key].push(x.value||true)}else if(x.type==="radio"){if(x.checked)answers[key]=x.value}else answers[key]=x.value});return{form_payload:{schema_version:"2026-09-04.ucr-registration.v2",service_key:K,jurisdiction_state:null,answers},errors:[]}};
})();