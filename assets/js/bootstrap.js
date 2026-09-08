import {bootstrapService,mintHandoff,consumeHandoff,resumeSession,saveStep,createQuote,getSessionToken,clearSessionToken} from "./wizard-api.js";
const root=document.getElementById("f4u-wizard-root");
const orderPanel=document.getElementById("f4u-order-panel");
const orderBackdrop=document.getElementById("f4u-order-drawer-backdrop");
const orderToggle=document.getElementById("f4u-mobile-order-toggle");

const state={
  entryMode:"public",
  serviceKey:"",
  serviceTitle:"",
  planKey:"",
  planTitle:"",
  jurisdiction:"",
  activeStep:0,
  steps:[],
  session:null,
  bootstrap:null,
  answers:{},
  selectedAddons:[],
  quote:null
};

const PLAN_TITLES={
  starter:"Starter",
  compliance:"Compliance",
  enterprise:"Enterprise",
  launch:"Launch",
  business:"Business",
  growth:"Growth",
  essential:"Essential",
  brand:"Brand",
  signature:"Signature",
  "shipper-basic":"Shipper Basic",
  "shipper-pro":"Shipper Pro",
  "shipper-complete":"Shipper Complete",
  "carrier-basic":"Carrier Basic",
  "carrier-pro":"Carrier Pro",
  "carrier-complete":"Carrier Complete",
  "carrier-ready":"Carrier Ready",
  "fleet-ready":"Fleet Ready"
};

const SERVICE_BEHAVIOR={
  "llc-formation":{jurisdiction:true,authorization:true},
  "corporations":{jurisdiction:true,authorization:true},
  "nonprofits":{jurisdiction:true,authorization:true},
  "series-llc":{jurisdiction:true,authorization:true},
  "dba-registration":{jurisdiction:true,authorization:true},
  "sole-proprietorship":{jurisdiction:true,authorization:false},
  "foreign-qualification":{jurisdiction:true,authorization:true},
  "annual-reports":{jurisdiction:true,authorization:true},
  "registered-agent":{jurisdiction:true,authorization:true},
  "llc-reinstatement":{jurisdiction:true,authorization:true},
  "dissolution":{jurisdiction:true,authorization:true},
  "business-licenses":{jurisdiction:true,authorization:false},
  "state-tax":{jurisdiction:true,authorization:true},
  "franchise-tax":{jurisdiction:true,authorization:true},
  "sales-tax-registration":{jurisdiction:true,authorization:true},
  "web-design-packages":{jurisdiction:false,authorization:false},
  "logo-design-packages":{jurisdiction:false,authorization:false},
  "shipper-packages":{jurisdiction:false,authorization:false},
  "carrier-packages-brokers":{jurisdiction:false,authorization:false},
  "carrier-packages-truckers":{jurisdiction:false,authorization:false}
};

function esc(v){
  return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}

async function loadRegistry(){
  const res=await fetch("assets/js/service-registry.json",{cache:"no-store"});
  if(!res.ok) throw new Error("Service registry could not be loaded.");
  return res.json();
}

function normalizeEntry(value){
  value=String(value||"public").toLowerCase();
  return ["public","client","admin"].includes(value)?value:"public";
}

function planTitle(key){
  if(!key) return "";
  return PLAN_TITLES[key] || key.split("-").map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(" ");
}

function serviceBehavior(){
  if(state.bootstrap?.service){
    const serviceType=String(state.bootstrap.service.service_type||"").toLowerCase();
    return {
      jurisdiction:serviceType==="state" || state.bootstrap.service.requires_jurisdiction===true,
      authorization:!!state.bootstrap.service.requires_authorization
    };
  }
  const configured=SERVICE_BEHAVIOR[state.serviceKey];
  if(configured) return configured;
  const category=window.__F4U_SERVICE__?.category||"";
  const jurisdiction=/Business Formation|Compliance|Tax & Regulatory/.test(category);
  return {jurisdiction,authorization:false};
}

function buildSteps(){
  const behavior=serviceBehavior();
  const steps=[];
  if(behavior.jurisdiction && !state.jurisdiction) steps.push({key:"jurisdiction",title:"Jurisdiction"});
  steps.push({key:"application",title:"Application"});
  steps.push({key:"addons",title:"Add-ons"});
  if(behavior.authorization) steps.push({key:"authorization",title:"Authorization"});
  steps.push({key:"review",title:"Review"});
  steps.push({key:"payment",title:"Payment"});
  state.steps=steps;
  state.activeStep=Math.min(state.activeStep,Math.max(steps.length-1,0));
}

function currentStep(){
  return state.steps[state.activeStep]||{key:"application",title:"Application"};
}

function updateProgress(){
  const step=currentStep();
  const count=state.steps.length||1;
  const current=state.activeStep+1;

  document.getElementById("f4u-progress-label").textContent=step.title;
  document.getElementById("f4u-progress-count").textContent=`Step ${current} of ${count}`;
  document.getElementById("f4u-progress-bar").style.width=`${Math.round((current/count)*100)}%`;

  const holder=document.getElementById("f4u-progress-steps");
  holder.style.gridTemplateColumns=`repeat(${count},minmax(0,1fr))`;
  holder.innerHTML=state.steps.map((s,i)=>`
    <span class="f4u-progress-step ${i===state.activeStep?"is-active":i<state.activeStep?"is-complete":""}">
      ${esc(s.title)}
    </span>
  `).join("");
}

function updateShell(){
  const service=state.serviceTitle||"Service Application";
  const plan=state.planTitle||"Package selected on service page";

  document.getElementById("f4u-header-service").textContent=service;
  document.getElementById("f4u-order-service").textContent=service;
  document.getElementById("f4u-order-package").textContent=plan;
  document.getElementById("f4u-mobile-order-name").textContent=service;
  document.getElementById("f4u-order-entry").textContent=
    state.entryMode==="admin"?"Admin Assisted":state.entryMode==="client"?"Client Portal":"Website";

  updateProgress();
}

function openOrder(){
  orderPanel.classList.add("is-open");
  orderBackdrop.hidden=false;
  orderToggle?.setAttribute("aria-expanded","true");
  document.body.style.overflow="hidden";
}

function closeOrder(){
  orderPanel.classList.remove("is-open");
  orderBackdrop.hidden=true;
  orderToggle?.setAttribute("aria-expanded","false");
  document.body.style.overflow="";
}

orderToggle?.addEventListener("click",()=>orderPanel.classList.contains("is-open")?closeOrder():openOrder());
orderBackdrop?.addEventListener("click",closeOrder);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeOrder();});

function makeServiceUrl(serviceKey,planKey=""){
  const url=new URL(location.href);
  url.searchParams.set("service",serviceKey);
  if(planKey) url.searchParams.set("plan",planKey);
  return url;
}

function getRecord(registry,key){
  return (registry.services||[]).find(x=>x.key===key&&x.enabled!==false)||null;
}

function renderFallbackChooser(registry){
  state.steps=[{key:"service",title:"Service"}];
  state.activeStep=0;
  updateProgress();

  document.getElementById("f4u-order-service").textContent="Choose a service";
  document.getElementById("f4u-order-package").textContent="No package selected";
  document.getElementById("f4u-mobile-order-name").textContent="Choose a service";

  const grouped={};
  (registry.services||[]).filter(x=>x.enabled!==false).forEach(s=>{
    const category=s.category||"Other Services";
    (grouped[category] ||= []).push(s);
  });

  const order=["Business Formation","Compliance","Tax & Regulatory","Registrations & Certifications","DOT & Fleet","Specialty Services","Other Services"];

  root.innerHTML=`
    <section class="f4u-panel">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">${state.entryMode==="admin"?"Admin assisted order":state.entryMode==="client"?"Order another service":"Secure application"}</span>
        <h1>Choose a service to continue.</h1>
        <p>${state.entryMode==="public"
          ?"Normally customers reach this page after choosing a package on a filings4u service page. You can still choose a service here to continue."
          :state.entryMode==="client"
            ?"Select the service you want to order. Your account information can be reused once the database layer is connected."
            :"Select the service for this assisted order. The same application used by customers will be loaded here."}</p>
      </div>

      <div class="f4u-service-search">
        <input id="f4u-service-search-input" type="search" placeholder="Search services..." autocomplete="off">
      </div>

      <div id="f4u-service-groups">
        ${order.filter(c=>grouped[c]?.length).map(category=>`
          <section class="f4u-service-category">
            <div class="f4u-service-category__head">
              <h2>${esc(category)}</h2>
              <span>${grouped[category].length} services</span>
            </div>
            <div class="f4u-service-grid">
              ${grouped[category].sort((a,b)=>a.title.localeCompare(b.title)).map(service=>{
                const initials=service.title.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
                return `
                  <button class="f4u-service-card" type="button"
                    data-service="${esc(service.key)}"
                    data-search="${esc((service.title+" "+category).toLowerCase())}">
                    <span class="f4u-service-card__icon">${esc(initials)}</span>
                    <strong>${esc(service.title)}</strong>
                    <small>Select service →</small>
                  </button>
                `;
              }).join("")}
            </div>
          </section>
        `).join("")}
      </div>

      <div class="f4u-empty" id="f4u-service-empty" hidden>No services match your search.</div>
    </section>
  `;

  root.querySelectorAll("[data-service]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const service=btn.dataset.service;
      const record=getRecord(registry,service);
      const url=makeServiceUrl(service);
      history.pushState({service},"",url);
      startService(record,"");
    });
  });

  const input=document.getElementById("f4u-service-search-input");
  input?.addEventListener("input",()=>{
    const q=input.value.trim().toLowerCase();
    let total=0;
    root.querySelectorAll(".f4u-service-category").forEach(section=>{
      let visible=0;
      section.querySelectorAll(".f4u-service-card").forEach(card=>{
        const show=!q||card.dataset.search.includes(q);
        card.hidden=!show;
        if(show){visible++;total++;}
      });
      section.hidden=visible===0;
    });
    document.getElementById("f4u-service-empty").hidden=total!==0;
  });
}

function renderMissingPlan(){
  state.steps=[{key:"package",title:"Package"}];
  state.activeStep=0;
  updateProgress();

  root.innerHTML=`
    <section class="f4u-panel">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">${esc(state.serviceTitle)}</span>
        <h1>Select your package on the service page.</h1>
        <p>This wizard is designed for customers who already selected a pricing plan. Return to the service page, choose your package, and the wizard will open directly at the application.</p>
      </div>

      <div class="f4u-empty">
        <strong style="display:block;color:#0a1f44;margin-bottom:8px">${esc(state.serviceTitle)}</strong>
        Package information is required before the customer application begins.
      </div>

      <div class="f4u-actions">
        <span class="f4u-actions__note">The Admin and Client Portal entry modes can choose service/package inside their own order flow later.</span>
        <button class="f4u-primary" type="button" id="f4u-return-service">Return to service page</button>
      </div>
    </section>
  `;
  document.getElementById("f4u-return-service")?.addEventListener("click",()=>{
    location.href="https://filings4u.com/get-started.html";
  });
}

function startService(record,planKey){
  window.__F4U_SERVICE__=record;
  state.serviceKey=record.key;
  state.serviceTitle=record.title;
  state.planKey=planKey||"";
  state.planTitle=planTitle(planKey);
  state.activeStep=0;

  buildSteps();
  updateShell();

  if(state.entryMode==="public" && !state.planKey){
    renderMissingPlan();
    return;
  }

  renderCurrentStep();
}

function renderCurrentStep(){
  const step=currentStep();
  updateProgress();

  if(step.key==="jurisdiction"){
    renderJurisdiction();
  }else if(step.key==="application"){
    renderApplication();
  }else if(step.key==="addons"){
    renderAddons();
  }else if(step.key==="authorization"){
    renderAuthorization();
  }else if(step.key==="review"){
    renderReview();
  }else if(step.key==="payment"){
    renderPlaceholder("Secure checkout","Stripe Elements will be mounted here after the database and payment functions are built.");
  }
}

function nextStep(){
  if(state.activeStep<state.steps.length-1){
    state.activeStep++;
    renderCurrentStep();
    window.scrollTo({top:0,behavior:"smooth"});
  }
}

function prevStep(){
  if(state.activeStep>0){
    state.activeStep--;
    renderCurrentStep();
  }else{
    history.back();
  }
}

function renderJurisdiction(){
  root.innerHTML=`
    <section class="f4u-panel">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">${esc(state.serviceTitle)} · ${esc(state.planTitle)}</span>
        <h1>Where will this filing apply?</h1>
        <p>This is a state-priced service. Select the filing state before continuing. Government and specialty services skip this step entirely.</p>
      </div>

      <div class="f4u-form-grid">
        <div class="f4u-field f4u-field--full">
          <label for="f4u-jurisdiction">State or jurisdiction</label>
          <select id="f4u-jurisdiction">
            <option value="">Select a state</option>
            ${["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"].map(s=>`<option value="${s}" ${state.jurisdiction===s?"selected":""}>${s}</option>`).join("")}
          </select>
          <small>The selected state becomes part of the secure session and is used by the authoritative quote engine.</small>
        </div>
      </div>

      <div class="f4u-actions">
        <button class="f4u-secondary" type="button" id="f4u-prev">Back</button>
        <button class="f4u-primary" type="button" id="f4u-next">Continue</button>
      </div>
    </section>
  `;

  document.getElementById("f4u-prev").addEventListener("click",prevStep);
  document.getElementById("f4u-next").addEventListener("click",()=>{
    const select=document.getElementById("f4u-jurisdiction");
    if(!select.value){select.focus();return;}
    state.jurisdiction=select.value;
    saveStep("jurisdiction",{state:state.jurisdiction}).catch(console.error);
    buildSteps();
    state.activeStep=0;
    renderCurrentStep();
  });
}

function restoreFormAnswers(rootNode, answers){
  if(!rootNode || !answers) return;
  Object.entries(answers).forEach(([key,value])=>{
    const nodes=rootNode.querySelectorAll(`[name="${CSS.escape(key)}"],#${CSS.escape(key)}`);
    nodes.forEach(field=>{
      if(field.type==="checkbox") field.checked=!!value;
      else if(field.type==="radio") field.checked=field.value===String(value);
      else if(value!==null && value!==undefined) field.value=String(value);
      field.dispatchEvent(new Event("change",{bubbles:true}));
    });
  });
}
function renderApplication(){
  window.__F4U_WIZARD_JURISDICTION__=state.jurisdiction||"";
  const saved=state.answers.application||{};

  if(state.serviceKey==="llc-formation" && window.formRegistry?.["llc-formation-form-master"]){
    const formHtml=window.formRegistry["llc-formation-form-master"]();
    root.innerHTML=`
      <section class="f4u-panel">
        <div class="f4u-panel__heading">
          <span class="f4u-kicker">${esc(state.serviceTitle)} · ${esc(state.planTitle||"Selected package")}</span>
          <h1>Complete your LLC formation application.</h1>
          <p>Your filing state and package were selected before this step. This form collects only the facts needed to prepare the LLC filing.</p>
        </div>
        <div id="step-2-onboarding-fields-canvas">${formHtml}</div>
        <div class="f4u-actions">
          <span class="f4u-actions__note" id="f4u-save-note">Your answers are saved to your secure Wizard v2 session.</span>
          <button class="f4u-primary" type="button" id="f4u-next">Save &amp; continue</button>
        </div>
      </section>`;

    restoreFormAnswers(
      document.querySelector('[data-service-form="llc-formation"]'),
      saved.form_payload?.answers || saved.answers || {}
    );

    document.getElementById("f4u-next").addEventListener("click",async()=>{
      const validator=window.formRegistry?.["llc-formation-validation-engine"];
      const validation=validator?.validate?.()||{isValid:true,errors:[]};
      if(!validation.isValid) return;

      const built=window.buildPayloadsForSupabase?.()||{};
      const formPayload=built.form_payload||{};
      const answers=formPayload.answers||{};
      const payload={
        schema_version:formPayload.schema_version||"2026-09-04.llc.v2",
        service_key:"llc-formation",
        jurisdiction_state:state.jurisdiction||null,
        form_payload:formPayload,
        answers,
        first_name:String(answers.contact_first_name||""),
        last_name:String(answers.contact_last_name||""),
        email:String(answers.contact_email||"").toLowerCase(),
        phone:String(answers.contact_phone||"")
      };

      const btn=document.getElementById("f4u-next");
      btn.disabled=true;btn.textContent="Saving…";
      try{
        await saveStep("application",payload);
        state.answers.application=payload;
        nextStep();
      }catch(e){
        console.error(e);
        btn.disabled=false;btn.textContent="Save & continue";
        document.getElementById("f4u-save-note").textContent="We couldn't save your application. Please try again.";
      }
    });
    return;
  }

  const savedContact=saved||{};
  root.innerHTML=`
    <section class="f4u-panel">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">${esc(state.serviceTitle)} · ${esc(state.planTitle||"Selected package")}</span>
        <h1>Let's start your application.</h1>
        <p>The dedicated service form for ${esc(state.serviceTitle)} will plug into this area. LLC Formation is now fully connected as the first v2 service module.</p>
      </div>
      <div class="f4u-form-grid">
        <div class="f4u-field"><label for="preview-first">First name</label><input id="preview-first" value="${esc(savedContact.first_name||"")}" placeholder="First name"></div>
        <div class="f4u-field"><label for="preview-last">Last name</label><input id="preview-last" value="${esc(savedContact.last_name||"")}" placeholder="Last name"></div>
        <div class="f4u-field"><label for="preview-email">Email</label><input id="preview-email" type="email" value="${esc(savedContact.email||"")}" placeholder="name@example.com"></div>
        <div class="f4u-field"><label for="preview-phone">Phone</label><input id="preview-phone" type="tel" value="${esc(savedContact.phone||"")}" placeholder="(555) 555-5555"></div>
      </div>
      <div class="f4u-actions"><button class="f4u-primary" type="button" id="f4u-next">Save &amp; continue</button></div>
    </section>`;
  document.getElementById("f4u-next").addEventListener("click",async()=>{
    const payload={
      first_name:document.getElementById("preview-first").value.trim(),
      last_name:document.getElementById("preview-last").value.trim(),
      email:document.getElementById("preview-email").value.trim(),
      phone:document.getElementById("preview-phone").value.trim()
    };
    await saveStep("application",payload);state.answers.application=payload;nextStep();
  });
}

function money(v,currency="USD"){return new Intl.NumberFormat("en-US",{style:"currency",currency}).format(Number(v||0));}
function updateQuoteSummary(q){
  state.quote=q;
  document.getElementById("f4u-order-package-price").textContent=money(q.service_fee,q.currency);
  document.getElementById("f4u-order-government-fee").textContent=money(q.government_fee,q.currency);
  document.getElementById("f4u-order-addon-price").textContent=q.addons_total?money(q.addons_total,q.currency):"—";
  document.getElementById("f4u-order-total").textContent=money(q.total_amount,q.currency);
  document.getElementById("f4u-mobile-order-total").textContent=money(q.total_amount,q.currency);
}
function renderAddons(){
  const addons=state.bootstrap?.addons||[];
  root.innerHTML=`<section class="f4u-panel">
    <div class="f4u-panel__heading"><span class="f4u-kicker">${esc(state.serviceTitle)} · ${esc(state.planTitle)}</span><h1>Recommended add-ons</h1><p>Only add-ons authorized for this service can be selected. Prices shown here come from the Wizard v2 database.</p></div>
    ${addons.length?`<div class="f4u-addon-list">${addons.map(a=>`<label class="f4u-addon-option"><input type="checkbox" value="${esc(a.addon_key)}" ${state.selectedAddons.includes(a.addon_key)?"checked":""}><span><strong>${esc(a.addon_name)}</strong><small>${esc(a.description||"")}</small></span><b>${money(a.price,a.currency)}</b></label>`).join("")}</div>`:`<div class="f4u-empty"><strong>No optional add-ons are configured for this service.</strong></div>`}
    <div class="f4u-actions"><button class="f4u-secondary" type="button" id="f4u-prev">Back</button><button class="f4u-primary" type="button" id="f4u-next">Continue</button></div>
  </section>`;
  document.getElementById("f4u-prev").addEventListener("click",prevStep);
  document.getElementById("f4u-next").addEventListener("click",async()=>{
    state.selectedAddons=[...root.querySelectorAll('input[type="checkbox"]:checked')].map(x=>x.value);
    await saveStep("addons",{selected_addons:state.selectedAddons});
    nextStep();
  });
}

function authorizationSignerDefaults(){
  const saved=state.answers.authorization||{};
  const app=state.answers.application||{};
  const formAnswers=app.form_payload?.answers||app.answers||{};
  return {
    first_name:saved.signer_first_name||app.first_name||formAnswers.contact_first_name||"",
    last_name:saved.signer_last_name||app.last_name||formAnswers.contact_last_name||"",
    capacity:saved.signer_capacity||"",
    signature:saved.signature_text||[saved.signer_first_name||app.first_name||formAnswers.contact_first_name||"",saved.signer_last_name||app.last_name||formAnswers.contact_last_name||""].filter(Boolean).join(" "),
    authority_confirmed:!!saved.authority_confirmed,
    accuracy_confirmed:!!saved.accuracy_confirmed,
    limited_poa_confirmed:!!saved.limited_poa_confirmed,
    esign_consent:!!saved.esign_consent
  };
}

function renderAuthorization(){
  const saved=authorizationSignerDefaults();
  root.innerHTML=`
    <section class="f4u-panel f4u-authorization">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">${esc(state.serviceTitle)} · Authorization</span>
        <h1>Authorization &amp; Power of Attorney</h1>
        <p>Authorize filings4u to prepare and submit this filing using the information you provided. This authorization is limited to this order and related filing communications.</p>
      </div>

      <div class="f4u-authorization__notice">
        <strong>Limited filing authorization</strong>
        <p>By completing this step, you are not transferring ownership or management authority. You are authorizing filings4u, LLC and its filing agents/service providers to prepare, sign where legally permitted, submit, receive, and communicate about documents for this specific filing. A jurisdiction may require an additional state-specific form or wet signature.</p>
      </div>

      <div class="f4u-form-grid">
        <div class="f4u-field">
          <label for="poa-first">Signer first name *</label>
          <input id="poa-first" autocomplete="given-name" value="${esc(saved.first_name)}" placeholder="First name">
          <small class="f4u-field-error" id="err-poa-first"></small>
        </div>
        <div class="f4u-field">
          <label for="poa-last">Signer last name *</label>
          <input id="poa-last" autocomplete="family-name" value="${esc(saved.last_name)}" placeholder="Last name">
          <small class="f4u-field-error" id="err-poa-last"></small>
        </div>
        <div class="f4u-field f4u-field--full">
          <label for="poa-capacity">Capacity / title *</label>
          <select id="poa-capacity">
            <option value="">Select capacity</option>
            ${["Member","Manager","Organizer","Authorized Representative","Owner","Officer","Other"].map(v=>`<option value="${esc(v)}"${saved.capacity===v?" selected":""}>${esc(v)}</option>`).join("")}
          </select>
          <small class="f4u-field-error" id="err-poa-capacity"></small>
        </div>
      </div>

      <div class="f4u-authorization__statements">
        <label class="f4u-choice-row">
          <input type="checkbox" id="poa-authority"${saved.authority_confirmed?" checked":""}>
          <span><strong>I have authority to approve this filing.</strong><small>I am authorized to act for the business/applicant identified in this order.</small></span>
        </label>
        <label class="f4u-choice-row">
          <input type="checkbox" id="poa-accuracy"${saved.accuracy_confirmed?" checked":""}>
          <span><strong>I certify the information provided is accurate.</strong><small>filings4u may rely on the information I submitted to prepare the filing.</small></span>
        </label>
        <label class="f4u-choice-row">
          <input type="checkbox" id="poa-limited"${saved.limited_poa_confirmed?" checked":""}>
          <span><strong>I grant this limited filing Power of Attorney.</strong><small>This authorization is limited to preparing, submitting, receiving, and communicating about this order and does not grant general business authority.</small></span>
        </label>
        <label class="f4u-choice-row">
          <input type="checkbox" id="poa-esign"${saved.esign_consent?" checked":""}>
          <span><strong>I consent to use an electronic signature.</strong><small>Typing my name below is intended to serve as my signature for this authorization.</small></span>
        </label>
      </div>

      <div class="f4u-signature-card">
        <label for="poa-signature">Type your full legal name to sign *</label>
        <input id="poa-signature" value="${esc(saved.signature)}" autocomplete="name" placeholder="Full legal name">
        <div class="f4u-signature-preview" aria-live="polite">
          <span id="poa-signature-preview">${esc(saved.signature||"Your signature")}</span>
        </div>
        <small class="f4u-field-error" id="err-poa-signature"></small>
      </div>

      <div class="f4u-authorization__version">
        Authorization version: <strong>F4U-POA-2026-09-v1</strong>
      </div>

      <div class="f4u-actions">
        <button class="f4u-secondary" type="button" id="f4u-prev">Back</button>
        <span class="f4u-actions__note" id="f4u-auth-note">Your authorization will be stored with this secure wizard session.</span>
        <button class="f4u-primary" type="button" id="f4u-next">Authorize &amp; continue</button>
      </div>
    </section>`;

  const first=document.getElementById("poa-first");
  const last=document.getElementById("poa-last");
  const signature=document.getElementById("poa-signature");
  const preview=document.getElementById("poa-signature-preview");

  function syncSignature(){
    const auto=[first.value.trim(),last.value.trim()].filter(Boolean).join(" ");
    if(!signature.dataset.edited) signature.value=auto;
    preview.textContent=signature.value.trim()||"Your signature";
  }
  first.addEventListener("input",syncSignature);
  last.addEventListener("input",syncSignature);
  signature.addEventListener("input",()=>{signature.dataset.edited="1";preview.textContent=signature.value.trim()||"Your signature";});

  document.getElementById("f4u-prev").addEventListener("click",prevStep);
  document.getElementById("f4u-next").addEventListener("click",async()=>{
    const values={
      signer_first_name:first.value.trim(),
      signer_last_name:last.value.trim(),
      signer_capacity:document.getElementById("poa-capacity").value,
      signature_text:signature.value.trim(),
      authority_confirmed:document.getElementById("poa-authority").checked,
      accuracy_confirmed:document.getElementById("poa-accuracy").checked,
      limited_poa_confirmed:document.getElementById("poa-limited").checked,
      esign_consent:document.getElementById("poa-esign").checked,
      authorization_version:"F4U-POA-2026-09-v1",
      authorization_scope:"this_order_and_related_filing_communications"
    };

    root.querySelectorAll(".f4u-field-error").forEach(x=>x.textContent="");
    let invalid=null;
    const required=[
      ["poa-first","err-poa-first",values.signer_first_name,"Enter the signer’s first name."],
      ["poa-last","err-poa-last",values.signer_last_name,"Enter the signer’s last name."],
      ["poa-capacity","err-poa-capacity",values.signer_capacity,"Select the signer’s capacity."],
      ["poa-signature","err-poa-signature",values.signature_text,"Type the signer’s full legal name."]
    ];
    for(const [fieldId,errorId,value,message] of required){
      if(!value){
        document.getElementById(errorId).textContent=message;
        invalid ||= document.getElementById(fieldId);
      }
    }
    const expected=[values.signer_first_name,values.signer_last_name].filter(Boolean).join(" ").replace(/\s+/g," ").trim().toLowerCase();
    const typed=values.signature_text.replace(/\s+/g," ").trim().toLowerCase();
    if(values.signature_text && expected && typed!==expected){
      document.getElementById("err-poa-signature").textContent="The typed signature must match the signer’s first and last name.";
      invalid ||= signature;
    }

    const checks=[
      ["poa-authority",values.authority_confirmed],
      ["poa-accuracy",values.accuracy_confirmed],
      ["poa-limited",values.limited_poa_confirmed],
      ["poa-esign",values.esign_consent]
    ];
    if(checks.some(([,ok])=>!ok)){
      document.getElementById("f4u-auth-note").textContent="All authorization acknowledgments are required before continuing.";
      invalid ||= document.getElementById(checks.find(([,ok])=>!ok)[0]);
    }
    if(invalid){invalid.focus();invalid.scrollIntoView({behavior:"smooth",block:"center"});return;}

    const btn=document.getElementById("f4u-next");
    btn.disabled=true;btn.textContent="Saving authorization…";
    try{
      await saveStep("authorization",values);
      state.answers.authorization=values;
      nextStep();
    }catch(e){
      console.error(e);
      btn.disabled=false;btn.textContent="Authorize & continue";
      document.getElementById("f4u-auth-note").textContent="We couldn't save the authorization. Please try again.";
    }
  });
}

async function renderReview(){
  root.innerHTML=`<section class="f4u-panel"><div class="f4u-panel__heading"><span class="f4u-kicker">${esc(state.serviceTitle)}</span><h1>Verifying your order…</h1><p>Pricing is being recalculated securely from the database.</p></div><div class="f4u-loading">Creating authoritative quote…</div></section>`;
  try{
    const result=await createQuote(state.selectedAddons);
    updateQuoteSummary(result.quote);
    root.innerHTML=`<section class="f4u-panel">
      <div class="f4u-panel__heading"><span class="f4u-kicker">Quote ${esc(result.quote.quote_number||"")}</span><h1>Review your order.</h1><p>This total was calculated by the server. Browser values cannot override it.</p></div>
      <div class="f4u-review-lines">${result.quote.items.map(i=>`<div class="f4u-price-row"><span>${esc(i.item_name)}</span><strong>${money(i.line_total,result.quote.currency)}</strong></div>`).join("")}</div>
      <div class="f4u-order__total"><span><small>Total</small><strong>${money(result.quote.total_amount,result.quote.currency)}</strong></span><small>Quote expires ${new Date(result.quote.expires_at).toLocaleString()}.</small></div>
      <div class="f4u-actions"><button class="f4u-secondary" type="button" id="f4u-prev">Back</button><button class="f4u-primary" type="button" id="f4u-next">Continue to payment</button></div>
    </section>`;
    document.getElementById("f4u-prev").addEventListener("click",prevStep);
    document.getElementById("f4u-next").addEventListener("click",nextStep);
  }catch(e){
    console.error(e);
    root.innerHTML=`<section class="f4u-panel"><div class="f4u-panel__heading"><span class="f4u-kicker">Pricing verification</span><h1>We can't finalize this quote yet.</h1><p>${e.code==="government_fee_not_configured"?"The government fee for this service has not been configured in Wizard v2 yet. We stopped instead of estimating or charging the wrong amount.":"The secure quote could not be created. Please try again."}</p></div><div class="f4u-actions"><button class="f4u-secondary" type="button" id="f4u-prev">Back</button></div></section>`;
    document.getElementById("f4u-prev").addEventListener("click",prevStep);
  }
}

function renderPlaceholder(title,description){
  root.innerHTML=`
    <section class="f4u-panel">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">${esc(state.serviceTitle)} · ${esc(state.planTitle||"Selected package")}</span>
        <h1>${esc(title)}</h1>
        <p>${esc(description)}</p>
      </div>

      <div class="f4u-empty">
        <strong style="display:block;color:#0a1f44;margin-bottom:8px">Shell section ready.</strong>
        Database and business logic will be connected after this shell is approved.
      </div>

      <div class="f4u-actions">
        <button class="f4u-secondary" type="button" id="f4u-prev">Back</button>
        ${state.activeStep<state.steps.length-1?'<button class="f4u-primary" type="button" id="f4u-next">Continue</button>':""}
      </div>
    </section>
  `;
  document.getElementById("f4u-prev")?.addEventListener("click",prevStep);
  document.getElementById("f4u-next")?.addEventListener("click",nextStep);
}

function showSaveModal(){
  if(document.getElementById("f4u-save-modal")) return;
  const modal=document.createElement("div");
  modal.id="f4u-save-modal";
  modal.className="f4u-modal";
  modal.innerHTML=`
    <div class="f4u-modal__backdrop" data-close></div>
    <section class="f4u-modal__card" role="dialog" aria-modal="true" aria-labelledby="f4u-save-title">
      <button class="f4u-modal__close" type="button" data-close aria-label="Close">×</button>
      <span class="f4u-kicker">Save your application</span>
      <h2 id="f4u-save-title">Continue later from where you left off.</h2>
      <p>Your Wizard v2 session is already being saved securely. A continuation-email workflow will be added after the service forms are connected.</p>
      <button class="f4u-primary" type="button" data-close>Got it</button>
    </section>
  `;
  document.body.appendChild(modal);
  modal.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",()=>modal.remove()));
}

document.getElementById("f4u-save-button").addEventListener("click",showSaveModal);

function help(){
  location.href="https://filings4u.com/contact.html";
}
document.getElementById("f4u-help-button").addEventListener("click",help);
document.getElementById("f4u-order-help").addEventListener("click",help);

document.getElementById("f4u-back-button").addEventListener("click",prevStep);

async function hydrateSession(sessionResult,registry){
  state.session=sessionResult.session;
  state.entryMode=normalizeEntry(sessionResult.session.entry_mode);
  state.serviceKey=sessionResult.session.service_key;
  state.planKey=sessionResult.session.plan_key;
  state.jurisdiction=sessionResult.session.jurisdiction_state||"";
  for(const row of sessionResult.answers||[]) state.answers[row.step_key]=row.answers||{};
  state.selectedAddons=state.answers.addons?.selected_addons||[];
  const data=await bootstrapService(state.serviceKey);
  state.bootstrap=data;
  const record=getRecord(registry,state.serviceKey)||{key:state.serviceKey,title:data.service.service_title,category:data.service.category};
  state.serviceTitle=data.service.service_title||record.title;
  const plan=(data.plans||[]).find(p=>p.plan_key===state.planKey);
  state.planTitle=plan?.plan_name||planTitle(state.planKey);
  window.__F4U_SERVICE__=record;
  buildSteps();
  const savedStep=sessionResult.session.current_step_key;
  const savedIndex=state.steps.findIndex(step=>step.key===savedStep);
  if(savedIndex>=0) state.activeStep=savedIndex;
  updateShell();renderCurrentStep();clearTimeout(window.__F4U_BOOT_WATCHDOG__);
}
async function boot(){
  const registry=await loadRegistry(); window.__F4U_REGISTRY__=registry;
  const q=new URLSearchParams(location.search),handoff=q.get("handoff");
  if(handoff){
    root.innerHTML='<div class="f4u-loading">Opening your secure application…</div>';
    const consumed=await consumeHandoff(handoff);
    const clean=new URL(location.href);clean.searchParams.delete("handoff");history.replaceState({},"",clean);
    await hydrateSession({...consumed,answers:[]},registry);return;
  }
  if(getSessionToken()){
    try{await hydrateSession(await resumeSession(),registry);return;}catch(e){console.warn("Saved session unavailable",e);clearSessionToken();}
  }
  state.entryMode=normalizeEntry(q.get("entry"));state.serviceKey=(q.get("service")||"").trim().toLowerCase();state.planKey=(q.get("plan")||"").trim().toLowerCase();state.planTitle=planTitle(state.planKey);state.jurisdiction=(q.get("state")||"").trim().toUpperCase();
  const record=getRecord(registry,state.serviceKey);
  if(!record){renderFallbackChooser(registry);return;}
  if(state.entryMode==="public"&&!state.planKey){startService(record,"");return;}
  root.innerHTML='<div class="f4u-loading">Starting your secure application…</div>';
  const data=await bootstrapService(state.serviceKey);state.bootstrap=data;
  const minted=await mintHandoff({service:state.serviceKey,plan:state.planKey,state:state.jurisdiction,entry:state.entryMode,return_url:location.href});
  await hydrateSession({...await consumeHandoff(minted.token),answers:[]},registry);
}
window.addEventListener("popstate",()=>location.reload());

boot().catch(error=>{
  console.error(error);
  root.innerHTML=`
    <section class="f4u-panel">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">Secure application</span>
        <h1>We couldn't prepare your application.</h1>
        <p>Please refresh the page. If the problem continues, contact filings4u support.</p>
      </div>
    </section>
  `;
});
