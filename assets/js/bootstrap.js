import {bootstrapService,mintHandoff,consumeHandoff,resumeSession,saveStep,createQuote,createPaymentIntent,getPaymentStatus,completeOrder,getSessionToken,clearSessionToken} from "./wizard-api.js";
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

const STATE_NAMES=Object.freeze({"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","DC":"District of Columbia"});
const STATE_CODES=Object.freeze(Object.keys(STATE_NAMES));



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
  const svc=state.bootstrap?.service||{};
  return {
    jurisdiction:!!svc.requires_jurisdiction,
    authorization:!!svc.requires_authorization
  };
}

function buildSteps(){
  const behavior=serviceBehavior();
  const steps=[];
  const addonCount=Array.isArray(state.bootstrap?.addons)?state.bootstrap.addons.length:0;

  if(behavior.jurisdiction && !state.jurisdiction){
    steps.push({key:"jurisdiction",title:"Jurisdiction"});
  }

  steps.push({key:"application",title:"Application"});

  if(addonCount>0){
    steps.push({key:"addons",title:"Add-ons"});
  }

  if(behavior.authorization){
    steps.push({key:"authorization",title:"Authorization"});
  }

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

  const jurisdictionName=state.jurisdiction?(STATE_NAMES[state.jurisdiction]||state.jurisdiction):"";
  document.querySelectorAll("[data-f4u-jurisdiction-context]").forEach(node=>{
    node.hidden=!jurisdictionName;
    node.innerHTML=jurisdictionName
      ? `<span class="f4u-jurisdiction-context__dot" aria-hidden="true"></span><span>Filing in <strong>${esc(jurisdictionName)}</strong></span>`
      : "";
  });

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


let stripeInstance=null;
let stripeElements=null;
let paymentInitializing=false;
function loadStripeJs(){
  if(window.Stripe)return Promise.resolve(window.Stripe);
  return new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-f4u-stripe-js]');
    if(existing){existing.addEventListener("load",()=>resolve(window.Stripe),{once:true});existing.addEventListener("error",()=>reject(new Error("stripe_js_failed")),{once:true});return}
    const script=document.createElement("script");script.src="https://js.stripe.com/v3/";script.async=true;script.dataset.f4uStripeJs="1";
    script.onload=()=>resolve(window.Stripe);script.onerror=()=>reject(new Error("stripe_js_failed"));document.head.appendChild(script);
  });
}
async function renderPayment(){
  const total=Number(state.quote?.total_amount||0);
  root.innerHTML=`<section class="f4u-panel">
    <div class="f4u-panel__heading"><span class="f4u-kicker">${esc(state.serviceTitle)} · ${esc(state.planTitle||"Selected package")}</span><h1>Secure checkout</h1>
    <p>Your final amount was calculated by the filings4u server. Payment details are entered directly into Stripe's secure Payment Element.</p></div>
    <div class="f4u-payment-summary"><span>Amount due</span><strong>${money(total)}</strong></div>
    <div id="f4u-payment-message" class="f4u-payment-message" aria-live="polite">Preparing secure payment…</div>
    <form id="f4u-payment-form" class="f4u-payment-form" hidden><div id="f4u-payment-element"></div>
    <button class="f4u-primary f4u-pay-button" type="submit" id="f4u-pay-button">Pay ${money(total)}</button>
    <p class="f4u-payment-legal">Your payment is processed by Stripe. filings4u does not store your full card number.</p></form>
    <div class="f4u-actions"><button class="f4u-secondary" type="button" id="f4u-payment-back">Back</button></div></section>`;
  document.getElementById("f4u-payment-back")?.addEventListener("click",prevStep);
  if(total<=0){document.getElementById("f4u-payment-message").textContent="No payment is required for this order.";return}
  if(paymentInitializing)return;paymentInitializing=true;
  try{
    const StripeCtor=await loadStripeJs();
    const intent=await createPaymentIntent(state.quote.id);
    if(!intent?.payment?.client_secret)throw new Error("payment_client_secret_missing");
    const key=window.F4U_WIZARD_CONFIG?.stripePublishableKey;if(!key)throw new Error("stripe_publishable_key_missing");
    stripeInstance=StripeCtor(key);stripeElements=stripeInstance.elements({clientSecret:intent.payment.client_secret,appearance:{theme:"stripe",variables:{colorPrimary:"#10b981",colorText:"#0a1f44",borderRadius:"10px",fontFamily:"DM Sans, system-ui, sans-serif"}}});
    stripeElements.create("payment",{layout:"tabs"}).mount("#f4u-payment-element");
    const message=document.getElementById("f4u-payment-message"),form=document.getElementById("f4u-payment-form");message.textContent="Choose a payment method below.";form.hidden=false;
    form.addEventListener("submit",async e=>{e.preventDefault();const button=document.getElementById("f4u-pay-button");button.disabled=true;button.textContent="Processing…";message.textContent="Confirming your payment securely…";
      const {error}=await stripeInstance.confirmPayment({elements:stripeElements,confirmParams:{return_url:`${location.origin}${location.pathname}?payment_return=1`},redirect:"if_required"});
      if(error){message.textContent=error.message||"Payment could not be completed.";button.disabled=false;button.textContent=`Pay ${money(total)}`;return}
      message.textContent="Payment submitted. Waiting for secure confirmation…";await pollPaymentStatus(message,button,total);
    });
  }catch(error){console.error(error);document.getElementById("f4u-payment-message").textContent=error.message==="stripe_publishable_key_missing"?"Stripe checkout is connected on the server, but the browser publishable key still needs to be added to Wizard v2 config.":"We couldn't prepare secure payment. Please try again."}
  finally{paymentInitializing=false}
}
function escComplete(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function renderCompletion(result){const order=result?.order||{};const account=result?.account||{};const shell=document.querySelector(".f4u-payment-shell")||document.querySelector("[data-payment-shell]")||document.querySelector("main");if(!shell)return;const total=Number(order.total||0).toLocaleString("en-US",{style:"currency",currency:order.currency||"USD"});const returning=account.mode==="returning_customer";shell.innerHTML=`<section class="f4u-completion-card"><div class="f4u-completion-check">✓</div><span class="f4u-completion-kicker">Order complete</span><h2>Thank you. Your order is confirmed.</h2><p>Your payment has been securely confirmed and your filings4u workspace has been prepared.</p><div class="f4u-completion-grid"><div><small>Tracking number</small><strong>${escComplete(order.tracking_number||"—")}</strong></div><div><small>Total paid</small><strong>${escComplete(total)}</strong></div></div><div class="f4u-completion-account"><strong>${returning?"Existing client account found":"Secure client account created"}</strong><span>${returning?"This order has been linked to your existing filings4u account.":"Check your email for your secure account invitation and password setup link."}</span></div><a class="f4u-completion-button" href="https://portal.filings4u.com/client-login.html">${returning?"Open Client Portal":"Go to Client Login"}</a></section>`;document.body.classList.add("f4u-order-complete");}

async function pollPaymentStatus(message,button,total){
  for(let i=0;i<20;i++){await new Promise(r=>setTimeout(r,1500));try{const result=await getPaymentStatus(),status=result?.payment?.status;
    if(status==="succeeded"){message.innerHTML="<strong>Payment confirmed.</strong> Finalizing your order…";button.textContent="Finalizing order…";button.disabled=true;try{const completed=await completeOrder();renderCompletion(completed);return}catch(error){console.error("Wizard v2 completion failed",error);message.innerHTML=`<strong>Payment confirmed.</strong> We received your payment, but order setup needs another moment. <button type="button" id="f4uRetryFinalize" class="f4u-inline-retry">Finish order setup</button>`;button.textContent="Payment confirmed";document.getElementById("f4uRetryFinalize")?.addEventListener("click",async()=>{try{renderCompletion(await completeOrder())}catch(e){console.error(e)}});return}}
    if(status==="failed"||status==="cancelled"){message.textContent=result?.payment?.failure_message||"Payment was not completed. You can try another payment method.";button.disabled=false;button.textContent=`Pay ${money(total)}`;return}
  }catch(error){console.warn("Payment status check failed",error)}}
  message.textContent="Your payment was submitted and is still being confirmed. Do not submit another payment.";button.disabled=true;
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
    renderPayment().catch(console.error);
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


const SERVICE_MODULE_PROMISES=new Map();

function registryRecordForService(){
  const list=window.__F4U_REGISTRY__?.services||[];
  return list.find(item=>item.key===state.serviceKey)||null;
}

function serviceModulePath(){
  const record=registryRecordForService();
  return record?.form_module || `assets/js/${state.serviceKey}.js`;
}

function loadServiceModule(){
  const key=state.serviceKey;
  if(!key) return Promise.reject(new Error("service_key_missing"));
  if(window.formRegistry?.[`${key}-form-master`]) return Promise.resolve();

  if(SERVICE_MODULE_PROMISES.has(key)) return SERVICE_MODULE_PROMISES.get(key);

  const promise=new Promise((resolve,reject)=>{
    const script=document.createElement("script");
    script.src=serviceModulePath();
    script.async=true;
    script.dataset.f4uServiceModule=key;
    script.onload=()=>{
      if(window.formRegistry?.[`${key}-form-master`]) resolve();
      else reject(new Error(`service_renderer_not_registered:${key}`));
    };
    script.onerror=()=>reject(new Error(`service_module_not_found:${key}`));
    document.head.appendChild(script);
  });

  SERVICE_MODULE_PROMISES.set(key,promise);
  return promise;
}

function serviceFormRoot(){
  return document.querySelector(`[data-service-form="${CSS.escape(state.serviceKey)}"]`)
    || document.getElementById("step-2-onboarding-fields-canvas");
}

function serializeServiceForm(){
  const formRoot=serviceFormRoot();
  const answers={};
  if(!formRoot) return answers;

  formRoot.querySelectorAll("input,select,textarea").forEach(field=>{
    if(field.disabled||field.type==="file") return;
    const key=field.name||field.id;
    if(!key) return;

    if(field.type==="radio"){
      if(field.checked) answers[key]=field.value;
    }else if(field.type==="checkbox"){
      answers[key]=!!field.checked;
    }else if(field.multiple){
      answers[key]=[...field.selectedOptions].map(option=>option.value);
    }else{
      answers[key]=field.value;
    }
  });
  return answers;
}

function contactFromAnswers(answers){
  const firstKeys=["first_name","contact_first_name","owner_first_name","applicant_first_name"];
  const lastKeys=["last_name","contact_last_name","owner_last_name","applicant_last_name"];
  const emailKeys=["email_address","contact_email","email","business_email"];
  const phoneKeys=["phone_number","contact_phone","phone","business_phone"];

  const first=(keys)=>{for(const key of keys){if(String(answers?.[key]||"").trim()) return String(answers[key]).trim();}return "";};

  return {
    first_name:first(firstKeys),
    last_name:first(lastKeys),
    email:first(emailKeys).toLowerCase(),
    phone:first(phoneKeys)
  };
}

function normalizedApplicationPayload(){
  let formPayload=null;
  if(typeof window.buildPayloadsForSupabase==="function"){
    try{
      const built=window.buildPayloadsForSupabase()||{};
      if(built.form_payload && built.form_payload.service_key===state.serviceKey) formPayload=built.form_payload;
    }catch(error){
      console.warn("Service payload builder failed; using generic serializer.",error);
    }
  }

  const answers=formPayload?.answers||serializeServiceForm();
  if(!formPayload){
    formPayload={
      schema_version:"2026-09-08.service.v2",
      service_key:state.serviceKey,
      jurisdiction_state:state.jurisdiction||null,
      answers
    };
  }

  const contact=contactFromAnswers(answers);
  return {
    schema_version:formPayload.schema_version||"2026-09-08.service.v2",
    service_key:state.serviceKey,
    jurisdiction_state:state.jurisdiction||null,
    form_payload:formPayload,
    answers,
    ...contact
  };
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
async function renderApplication(){
  window.__F4U_WIZARD_JURISDICTION__=state.jurisdiction||"";
  window.F4UWizard=window.F4UWizard||{};
  window.F4UWizard.state=window.F4UWizard.state||{};
  window.F4UWizard.state.route={
    service:state.serviceKey,
    plan:state.planKey,
    jurisdiction:state.jurisdiction||""
  };

  const saved=state.answers.application||{};

  root.innerHTML=`
    <section class="f4u-panel">
      <div class="f4u-panel__heading">
        <span class="f4u-kicker">${esc(state.serviceTitle)} · ${esc(state.planTitle||"Selected package")}</span>
        <h1>Complete your ${esc(state.serviceTitle)} application.</h1>
        <p>Your service, package${state.jurisdiction?", and filing state":""} were selected before this step. Complete the service-specific intake below.</p>
      </div>
      <div id="step-2-onboarding-fields-canvas">
        <div class="f4u-loading">Loading ${esc(state.serviceTitle)} application…</div>
      </div>
      <div class="f4u-actions">
        <span class="f4u-actions__note" id="f4u-save-note">Your answers are saved to your secure Wizard v2 session.</span>
        <button class="f4u-primary" type="button" id="f4u-next" disabled>Save &amp; continue</button>
      </div>
    </section>`;

  try{
    await loadServiceModule();

    if(currentStep().key!=="application") return;

    const renderer=window.formRegistry?.[`${state.serviceKey}-form-master`];
    if(typeof renderer!=="function") throw new Error(`service_renderer_not_registered:${state.serviceKey}`);

    const statesHtml=STATE_CODES.map(code=>`<option value="${code}">${STATE_NAMES[code]||code}</option>`).join("");
    const canvas=document.getElementById("step-2-onboarding-fields-canvas");
    canvas.innerHTML=renderer(statesHtml,{
      service:state.serviceKey,
      plan:state.planKey,
      state:state.jurisdiction||"",
      entry:state.entryMode
    });

    restoreFormAnswers(
      serviceFormRoot(),
      saved.form_payload?.answers||saved.answers||{}
    );

    const btn=document.getElementById("f4u-next");
    btn.disabled=false;

    btn.addEventListener("click",async()=>{
      const validator=window.formRegistry?.[`${state.serviceKey}-validation-engine`];
      const validation=validator?.validate?.()||{isValid:true,errors:[]};
      if(!validation.isValid) return;

      const payload=normalizedApplicationPayload();

      btn.disabled=true;
      btn.textContent="Saving…";
      try{
        await saveStep("application",payload);
        state.answers.application=payload;
        nextStep();
      }catch(error){
        console.error(error);
        btn.disabled=false;
        btn.textContent="Save & continue";
        document.getElementById("f4u-save-note").textContent="We couldn't save your application. Please try again.";
      }
    });
  }catch(error){
    console.error(error);
    const canvas=document.getElementById("step-2-onboarding-fields-canvas");
    if(canvas){
      canvas.innerHTML=`
        <div class="f4u-empty">
          <strong>${esc(state.serviceTitle)} form could not be loaded.</strong>
          <p>The service route is valid, but its application module is unavailable. No other service form will be substituted.</p>
        </div>`;
    }
    document.getElementById("f4u-save-note").textContent="This service module must be available before the application can continue.";
  }
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

  if(savedIndex>=0){
    state.activeStep=savedIndex;
  }else if(savedStep==="addons"){
    const authIndex=state.steps.findIndex(step=>step.key==="authorization");
    const reviewIndex=state.steps.findIndex(step=>step.key==="review");
    state.activeStep=authIndex>=0?authIndex:(reviewIndex>=0?reviewIndex:0);
  }

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
