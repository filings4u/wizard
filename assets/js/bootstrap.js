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
  const cfg=state.bootstrap?.wizard_config||{};
  return {
    jurisdiction:!!svc.requires_jurisdiction,
    authorization:!!svc.requires_authorization,
    showAddons:cfg.show_addons!==false,
    showSummary:cfg.show_summary!==false,
    checkoutEnabled:cfg.checkout_enabled!==false
  };
}

const DEFAULT_FLOW_STEPS=Object.freeze([
  {key:"jurisdiction",label:"Jurisdiction",sort_order:20,enabled:true},
  {key:"application",label:"Application",sort_order:30,enabled:true},
  {key:"addons",label:"Add-ons",sort_order:40,enabled:true},
  {key:"authorization",label:"Authorization",sort_order:50,enabled:true},
  {key:"summary",label:"Summary",sort_order:60,enabled:true},
  {key:"payment",label:"Payment",sort_order:70,enabled:true}
]);

function runtimeKey(key){
  const clean=String(key||"").trim().toLowerCase();
  if(clean==="summary") return "review";
  if(clean==="service") return "service";
  return clean;
}

function getByPath(source,path){
  return String(path||"").split(".").filter(Boolean).reduce((value,key)=>value==null?undefined:value[key],source);
}

function flowContext(){
  const svc=state.bootstrap?.service||{};
  return {
    service:state.serviceKey,service_key:state.serviceKey,
    service_type:svc.service_type||"",category:svc.category||"",
    plan:state.planKey,plan_key:state.planKey,
    state:state.jurisdiction,jurisdiction:state.jurisdiction,
    entry:state.entryMode,entry_mode:state.entryMode,
    has_addons:(state.bootstrap?.addons||[]).length>0,
    requires_jurisdiction:!!svc.requires_jurisdiction,
    requires_authorization:!!svc.requires_authorization,
    answers:state.answers||{}
  };
}

function comparable(value){
  if(Array.isArray(value)) return value.map(comparable);
  if(typeof value==="string") return value.trim().toLowerCase();
  return value;
}

function evaluateFlowCondition(condition){
  if(!condition||typeof condition!=="object"||!condition.field) return true;
  const actual=getByPath(flowContext(),condition.field);
  const expected=condition.value;
  const op=String(condition.operator||"equals").toLowerCase();
  const a=comparable(actual), e=comparable(expected);
  const list=Array.isArray(e)?e:String(e??"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
  if(op==="exists") return actual!==undefined&&actual!==null&&actual!=="";
  if(op==="not_exists") return actual===undefined||actual===null||actual==="";
  if(op==="truthy") return !!actual;
  if(op==="falsy") return !actual;
  if(op==="not_equals") return a!==e;
  if(op==="contains") return Array.isArray(a)?a.includes(e):String(a??"").includes(String(e??""));
  if(op==="not_contains") return Array.isArray(a)?!a.includes(e):!String(a??"").includes(String(e??""));
  if(op==="in") return list.includes(String(a??"").toLowerCase());
  if(op==="not_in") return !list.includes(String(a??"").toLowerCase());
  return a===e;
}

function configuredFlow(){
  const cfg=state.bootstrap?.wizard_config||{};
  const configured=cfg.config?.flow?.steps;
  return Array.isArray(configured)&&configured.length?configured:DEFAULT_FLOW_STEPS;
}

function buildSteps(options={}){
  const behavior=serviceBehavior();
  const addonCount=Array.isArray(state.bootstrap?.addons)?state.bootstrap.addons.length:0;
  const previousKey=options.preserveKey||currentStep()?.key||null;
  const cfg=state.bootstrap?.wizard_config||{};
  const labels={
    application:cfg.application_label||"Application",
    addons:cfg.addons_label||"Add-ons",
    authorization:cfg.authorization_label||"Authorization",
    review:cfg.summary_label||"Summary",
    payment:cfg.checkout_label||"Payment",
    jurisdiction:"Jurisdiction"
  };
  const seen=new Set();
  const steps=[];

  [...configuredFlow()]
    .sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0))
    .forEach(item=>{
      const key=runtimeKey(item.key);
      if(!key||key==="service"||seen.has(key)||item.enabled===false) return;
      if(!evaluateFlowCondition(item.condition)) return;
      if(key==="jurisdiction"&&(!behavior.jurisdiction||!!state.jurisdiction)) return;
      if(key==="addons"&&(!behavior.showAddons||addonCount===0)) return;
      if(key==="authorization"&&!behavior.authorization) return;
      if(key==="review"&&!behavior.showSummary) return;
      if(key==="payment"&&!behavior.checkoutEnabled) return;
      seen.add(key);
      steps.push({key,title:String(item.label||labels[key]||key)});
    });

  if(!seen.has("application")){
    const paymentIndex=steps.findIndex(x=>x.key==="payment");
    const application={key:"application",title:labels.application};
    if(paymentIndex>=0) steps.splice(paymentIndex,0,application); else steps.unshift(application);
  }
  if(!steps.length) steps.push({key:"application",title:labels.application});

  state.steps=steps;
  if(previousKey){
    const index=steps.findIndex(x=>x.key===previousKey);
    if(index>=0) state.activeStep=index;
    else state.activeStep=Math.min(state.activeStep,steps.length-1);
  }else{
    state.activeStep=Math.min(state.activeStep,steps.length-1);
  }
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
function moneyComplete(v,c="USD"){return Number(v||0).toLocaleString("en-US",{style:"currency",currency:c||"USD"})}
function receiptDocument(order){const p=order.pricing||{};return `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${escComplete(order.tracking_number)}</title><style>body{font-family:Arial,sans-serif;color:#0a1f44;margin:40px}h1{margin-bottom:4px}.muted{color:#64748b}.box{border:1px solid #dbe4ec;border-radius:12px;padding:20px;margin:22px 0}table{width:100%;border-collapse:collapse}td{padding:9px;border-bottom:1px solid #edf2f7}td:last-child{text-align:right;font-weight:700}.total td{font-size:18px;border-top:2px solid #0a1f44}.brand{font-weight:900;font-size:24px}.green{color:#10b981}</style></head><body><div class="brand">filings<span class="green">4u</span></div><p class="muted">filings4u, LLC · A Subsidiary of Roseland Companies, LLC</p><h1>Payment Receipt</h1><p class="muted">Tracking ${escComplete(order.tracking_number)}</p><div class="box"><strong>${escComplete(order.customer?.first_name)} ${escComplete(order.customer?.last_name)}</strong><br>${escComplete(order.customer?.company_name||"")}<br>${escComplete(order.customer?.email||"")}<br>${escComplete(order.customer?.phone||"")}</div><table><tr><td>Service</td><td>${escComplete(order.service)}</td></tr><tr><td>Plan</td><td>${escComplete(order.plan)}</td></tr><tr><td>Jurisdiction</td><td>${escComplete(order.jurisdiction||"—")}</td></tr><tr><td>Service fee</td><td>${moneyComplete(p.service_fee,p.currency)}</td></tr><tr><td>Government fees</td><td>${moneyComplete(p.government_fee,p.currency)}</td></tr><tr><td>Add-ons</td><td>${moneyComplete(p.addons_total,p.currency)}</td></tr><tr class="total"><td>Total paid</td><td>${moneyComplete(p.total,p.currency)}</td></tr></table><p class="muted">Paid ${escComplete(order.paid_at?new Date(order.paid_at).toLocaleString():"")}</p></body></html>`}
function downloadReceipt(order){const blob=new Blob([receiptDocument(order)],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`filings4u-receipt-${order.tracking_number||"order"}.html`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function poaHtml(order){const p=order.poa||{},signed=p.signature||[p.first_name,p.last_name].filter(Boolean).join(" ")||"—",when=p.executed_at?new Date(p.executed_at).toLocaleString():"—",jur=order.jurisdiction?` in <strong>${escComplete(order.jurisdiction)}</strong>`:"";return `<article class="f4u-final-poa"><div class="f4u-final-poa__head"><div><strong>filings4u, LLC</strong><span>A Subsidiary of Roseland Companies, LLC</span></div><div><b>Limited Power of Attorney</b><span>${escComplete(order.service)}</span></div></div><h3>Limited Power of Attorney & Corporate Agency Agreement</h3><p><strong>WHEREAS,</strong> the undersigned Principal appoints and authorizes <strong>filings4u, LLC</strong>, an Illinois limited liability company and a subsidiary of <strong>Roseland Companies, LLC</strong>, together with its authorized operational agents, officers, employees, and designees, to act as the Principal's limited Attorney-in-Fact and Corporate Agent solely under the terms and limitations stated in this Agreement.</p><h4>1. Express Limited Scope of Appointment</h4><p>This appointment is limited to administrative, regulatory, filing, registration, compliance, document-preparation, document-transmission, and related ministerial activities reasonably necessary to perform the service purchased by the Principal through the filings4u digital filing wizard.</p><p>For this order, the authorization applies specifically to <strong>${escComplete(order.service)}</strong>${jur}. The Attorney-in-Fact may prepare, complete, sign where permitted and authorized, correct, amend, transmit, submit, receive, and process applications, registrations, forms, renewals, supporting documents, and related correspondence necessary to complete that service.</p><h4>2. Grant of Operational Powers</h4><p>The Principal authorizes filings4u, LLC to communicate with applicable state filing offices, federal agencies, regulatory bodies, registries, tax authorities, licensing agencies, and other governmental or administrative entities as reasonably necessary to carry out the selected service.</p><p>This limited authorization may include responding to routine filing deficiencies, correcting clerical or formatting issues, transmitting customer-approved information, receiving filing confirmations, and taking other administrative actions reasonably required to complete the order.</p><h4>3. Customer Information & Accuracy</h4><p>The Principal certifies that the information submitted through the filings4u wizard is complete and accurate to the best of the Principal's knowledge and that the Principal has authority to act for the applicant, business, organization, carrier, or other entity identified in this order.</p><p>filings4u, LLC may rely on the information supplied by the Principal and is not responsible for inaccuracies, omissions, or delays caused by information supplied by the Principal or by government agency requirements outside filings4u's reasonable control.</p><h4>4. Electronic Signatures & Intent</h4><p>The Principal agrees to conduct this transaction electronically and expressly intends the typed first and last name entered below, together with the associated electronic record and execution timestamp, to serve as the Principal's electronic signature for this authorization.</p><p>The Principal acknowledges that electronic signatures and electronic records may be used in accordance with applicable federal and state electronic-transactions law, including the federal Electronic Signatures in Global and National Commerce Act (ESIGN) and applicable enactments of the Uniform Electronic Transactions Act (UETA), where those laws apply.</p><h4>5. No Attorney-Client Relationship</h4><p>This authorization does not create an attorney-client relationship and does not appoint filings4u, LLC as an attorney-at-law. filings4u, LLC provides filing, registration, compliance, document preparation, and administrative support services and does not provide legal, tax, accounting, or other professional advice.</p><h4>6. Ratification, Revocation & Duration</h4><p>The Principal ratifies lawful administrative acts performed by filings4u, LLC within the scope of this authorization. This authorization becomes effective when electronically executed and remains effective only for the selected order and reasonably related filing communications unless earlier revoked in writing or as otherwise required by applicable law.</p><p>Revocation does not affect actions already taken in reasonable reliance on this authorization before filings4u receives and can reasonably process the revocation. A revocation request may be submitted through an available verified client portal workflow or by contacting filings4u support.</p><h4>7. Corporate Entity Information</h4><p><strong>filings4u, LLC</strong><br>A Subsidiary of Roseland Companies, LLC<br>State of Illinois<br>Support: support@filings4u.com</p><div class="f4u-final-signature"><small>Electronically signed by</small><strong>${escComplete(signed)}</strong><span>${escComplete(p.capacity||"")}</span><b>Signed electronically · ${escComplete(when)}</b><em>Authorization version ${escComplete(p.version||"F4U-POA-2026-09-v1")}</em></div></article>`}
function renderCompletion(result){const order=result?.order||{},account=result?.account||{},p=order.pricing||{},c=order.customer||{},shell=document.querySelector(".f4u-payment-shell")||document.querySelector("[data-payment-shell]")||document.querySelector("main");if(!shell)return;const returning=account.mode==="returning_customer";shell.innerHTML=`<section class="f4u-completion-card f4u-completion-card--wide"><div class="f4u-completion-check">✓</div><span class="f4u-completion-kicker">Order complete</span><h2>Thank you. Your order is confirmed.</h2><p>Your payment has been securely confirmed and your filings4u workspace has been prepared.</p><div class="f4u-completion-grid"><div><small>Tracking number</small><strong>${escComplete(order.tracking_number||"—")}</strong></div><div><small>Total paid</small><strong>${moneyComplete(p.total??order.total,p.currency||order.currency)}</strong></div></div><section class="f4u-final-section"><h3>Account & order details</h3><div class="f4u-final-detail-grid"><div><small>Customer</small><strong>${escComplete([c.first_name,c.last_name].filter(Boolean).join(" "))}</strong></div><div><small>Email</small><strong>${escComplete(c.email)}</strong></div><div><small>Phone</small><strong>${escComplete(c.phone)}</strong></div><div><small>Company</small><strong>${escComplete(c.company_name)}</strong></div><div><small>Service</small><strong>${escComplete(order.service)}</strong></div><div><small>Plan</small><strong>${escComplete(order.plan)}</strong></div><div><small>Jurisdiction</small><strong>${escComplete(order.jurisdiction||"—")}</strong></div><div><small>Payment status</small><strong>Paid</strong></div></div></section><section class="f4u-final-section"><div class="f4u-final-section__title"><h3>Payment receipt</h3><button id="f4uDownloadReceipt" type="button">Download receipt</button></div><div class="f4u-final-totals"><span>Service fee <b>${moneyComplete(p.service_fee,p.currency)}</b></span><span>Government fees <b>${moneyComplete(p.government_fee,p.currency)}</b></span><span>Add-ons <b>${moneyComplete(p.addons_total,p.currency)}</b></span><strong>Total paid <b>${moneyComplete(p.total,p.currency)}</b></strong></div></section>${poaHtml(order)}<div class="f4u-completion-account"><strong>${returning?"Order linked to your existing account":"Secure client account created"}</strong><span>${returning?"You can use your existing filings4u credentials when you are ready.":"Check your email and use the Create your password link. You must create your password before signing in to your client account."}</span></div>${returning?`<p class="f4u-returning-note">Your existing account remains available. No additional password setup is required.</p>`:`<p class="f4u-email-next"><strong>Next step:</strong> Check your email and create your password. There is no Client Portal login action on this page until account setup is complete.</p>`}</section>`;document.getElementById("f4uDownloadReceipt")?.addEventListener("click",()=>downloadReceipt(order));document.body.classList.add("f4u-order-complete")}

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
  const completedKey=currentStep().key;
  const oldSteps=state.steps.slice();
  const oldIndex=oldSteps.findIndex(x=>x.key===completedKey);
  buildSteps({preserveKey:completedKey});
  let currentIndex=state.steps.findIndex(x=>x.key===completedKey);
  if(currentIndex<0){
    const later=oldSteps.slice(Math.max(oldIndex+1,0)).map(x=>x.key);
    currentIndex=later.map(key=>state.steps.findIndex(x=>x.key===key)).find(index=>index>=0);
    if(currentIndex===undefined) currentIndex=Math.min(state.activeStep,state.steps.length-1);
    state.activeStep=Math.max(0,currentIndex);
  }else if(currentIndex<state.steps.length-1){
    state.activeStep=currentIndex+1;
  }
  renderCurrentStep();
  window.scrollTo({top:0,behavior:"smooth"});
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
    state.answers.jurisdiction={state:state.jurisdiction};
    saveStep("jurisdiction",state.answers.jurisdiction).catch(console.error);
    nextStep();
  });
}


const SERVICE_MODULE_PROMISES=new Map();
const PUBLISHED_FORM_PROMISES=new Map();
const WIZARD_FORM_SCHEMA_URL="https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-form-schema";

function registryRecordForService(){
  const list=window.__F4U_REGISTRY__?.services||[];
  return list.find(item=>item.key===state.serviceKey)||null;
}

function serviceModulePath(){
  const record=registryRecordForService();
  return record?.form_module || `assets/js/${state.serviceKey}.js`;
}

function loadLegacyServiceModule(){
  const key=state.serviceKey;
  if(!key) return Promise.reject(new Error("service_key_missing"));
  if(window.formRegistry?.[`${key}-form-master`]) return Promise.resolve({source:"legacy"});

  if(SERVICE_MODULE_PROMISES.has(key)) return SERVICE_MODULE_PROMISES.get(key);

  const promise=new Promise((resolve,reject)=>{
    const script=document.createElement("script");
    script.src=serviceModulePath();
    script.async=true;
    script.dataset.f4uServiceModule=key;
    script.onload=()=>{
      if(window.formRegistry?.[`${key}-form-master`]) resolve({source:"legacy"});
      else reject(new Error(`service_renderer_not_registered:${key}`));
    };
    script.onerror=()=>reject(new Error(`service_module_not_found:${key}`));
    document.head.appendChild(script);
  });

  SERVICE_MODULE_PROMISES.set(key,promise);
  return promise;
}

function normalizePublishedField(field,index){
  const id=String(field?.id||field?.key||`field_${index+1}`).trim();
  const options=Array.isArray(field?.options)
    ? field.options.map(option=>{
        if(Array.isArray(option)) return option;
        if(option && typeof option==="object") return [String(option.value??option.label??""),String(option.label??option.value??"")];
        return [String(option??""),String(option??"")];
      })
    : [];

  const condition=field?.showWhen || (
    field?.condition?.field
      ? {
          field:field.condition.field,
          ...(field.condition.operator==="not_equals"
            ? {notEquals:field.condition.value}
            : {equals:field.condition.value})
        }
      : null
  );

  const typeMap={
    "checkbox-group":"checkbox-group",
    currency:"number",
    phone:"tel",
    signature:"text",
    state:"select"
  };

  return {
    ...field,
    id,
    type:typeMap[field?.type]||field?.type||"text",
    label:String(field?.label||id),
    span:field?.span || (field?.width==="full"?"full":"half"),
    help:field?.help ?? field?.help_text ?? "",
    showWhen:condition,
    options:field?.type==="state" ? "__STATES__" : options,
    format:field?.format || (field?.type==="phone"?"phone":field?.format),
    original_type:field?.type||"text"
  };
}

function normalizePublishedSchema(pack){
  const raw=pack?.schema||{};
  return {
    title:String(raw.title||pack?.definition?.form_title||state.serviceTitle||"Service Application"),
    subtitle:String(raw.subtitle||pack?.definition?.description||"Complete the filing information below."),
    authority:String(raw.authority||"Applicable filing authority"),
    tooltip:String(raw.tooltip||""),
    notice:String(raw.notice||""),
    settings:raw.settings&&typeof raw.settings==="object"?raw.settings:{},
    rules:Array.isArray(raw.rules)?raw.rules:[],
    sections:(Array.isArray(raw.sections)?raw.sections:[]).map((section,sectionIndex)=>({
      ...section,
      key:String(section?.key||`section_${sectionIndex+1}`),
      title:String(section?.title||`Section ${sectionIndex+1}`),
      description:String(section?.description||""),
      showWhen:section?.showWhen||null,
      fields:(Array.isArray(section?.fields)?section.fields:[]).map(normalizePublishedField)
    }))
  };
}

function installPublishedPayloadBuilder(pack){
  const version=pack?.version||{};
  window.__F4U_ACTIVE_FORM_VERSION__={
    id:version.id||null,
    version_number:version.version_number||null,
    service_key:state.serviceKey
  };

  window.buildPayloadsForSupabase=function(){
    const answers=serializeServiceForm();
    return {
      form_payload:{
        schema_version:version.version_number||1,
        form_version_id:version.id||null,
        service_key:state.serviceKey,
        jurisdiction_state:state.jurisdiction||null,
        answers
      },
      errors:[]
    };
  };
}

async function loadPublishedServiceForm(){
  const key=state.serviceKey;
  if(!key) throw new Error("service_key_missing");

  if(PUBLISHED_FORM_PROMISES.has(key)) return PUBLISHED_FORM_PROMISES.get(key);

  const promise=(async()=>{
    const url=`${WIZARD_FORM_SCHEMA_URL}?service_key=${encodeURIComponent(key)}`;
    const response=await fetch(url,{method:"GET",mode:"cors",cache:"no-store"});

    if(response.status===404){
      const missing=await response.json().catch(()=>({}));
      const error=new Error(missing.error||"published_form_not_found");
      error.code="published_form_not_found";
      throw error;
    }

    const pack=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(pack.error||`wizard_form_schema_${response.status}`);

    if(!window.F4UServiceForms?.register){
      throw new Error("service_form_engine_unavailable");
    }

    const config=normalizePublishedSchema(pack);
    window.F4UServiceForms.register(key,config);
    installPublishedPayloadBuilder(pack);
    console.info("[Wizard Forms] Database form loaded",{
      service_key:key,
      version:pack?.version?.version_number||null,
      form_version_id:pack?.version?.id||null,
      sections:config.sections.length,
      fields:config.sections.reduce((n,s)=>n+(s.fields||[]).length,0)
    });

    if(typeof window.formRegistry?.[`${key}-form-master`]!=="function"){
      throw new Error(`published_renderer_not_registered:${key}`);
    }

    return {source:"database",pack};
  })();

  PUBLISHED_FORM_PROMISES.set(key,promise);

  try{
    return await promise;
  }catch(error){
    PUBLISHED_FORM_PROMISES.delete(key);
    throw error;
  }
}

async function loadServiceFormRuntime(){
  // Database-published Wizard Forms are authoritative when available.
  // During rollout only, a missing/unpublished schema falls back to the
  // existing per-service module so the live wizard remains operational.
  try{
    return await loadPublishedServiceForm();
  }catch(error){
    if(error?.code!=="published_form_not_found"){
      console.warn(`[Wizard Forms] Published form load failed for ${state.serviceKey}; using legacy fallback.`,error);
    }
    console.info("[Wizard Forms] Using legacy service module fallback",{service_key:state.serviceKey});
    return loadLegacyServiceModule();
  }
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
        <h3 class="f4u-application-title">Complete your ${esc(state.serviceTitle)} application.</h3>
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
    const formRuntime=await loadServiceFormRuntime();

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
    canvas.dataset.formSource=formRuntime?.source||"unknown";
    if(formRuntime?.source==="database"){
      canvas.dataset.formVersion=String(formRuntime.pack?.version?.version_number||"");
      canvas.dataset.formVersionId=String(formRuntime.pack?.version?.id||"");
    }

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
      if(formRuntime?.source==="database"){
        payload.form_source="wizard_form_builder";
        payload.form_version_id=formRuntime.pack?.version?.id||payload.form_payload?.form_version_id||null;
        payload.form_version_number=formRuntime.pack?.version?.version_number||payload.form_payload?.schema_version||null;
      }else{
        payload.form_source="legacy_service_module";
      }

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
          <p>The service route is valid, but neither its published Wizard Form nor its temporary legacy form module could be loaded.</p>
        </div>`;
    }
    document.getElementById("f4u-save-note").textContent="A published Wizard Form or temporary legacy form must be available before the application can continue.";
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
    state.answers.addons={selected_addons:state.selectedAddons};
    await saveStep("addons",state.answers.addons);
    nextStep();
  });
}

function authorizationSignerDefaults(){
  const saved=state.answers.authorization||{};
  const app=state.answers.application||{};
  const formAnswers=app.form_payload?.answers||app.answers||{};
  const first=saved.first_name||saved.signer_first_name||app.first_name||formAnswers.contact_first_name||"";
  const last=saved.last_name||saved.signer_last_name||app.last_name||formAnswers.contact_last_name||"";
  return {
    first_name:first,
    last_name:last,
    signature:saved.signature||saved.signer_name||saved.signature_text||[first,last].filter(Boolean).join(" "),
    consent:!!(saved.consent||saved.esign_consent),
    document_reviewed:!!saved.document_reviewed,
    document_reviewed_at:saved.document_reviewed_at||null,
    executed_at:saved.executed_at||null
  };
}

function renderAuthorization(){
  const a=authorizationSignerDefaults();
  const serviceName=state.serviceTitle||state.serviceKey||"Selected filing service";
  const jurisdiction=state.jurisdiction||"";
  const stepNumber=state.activeStep+1;

  root.innerHTML=`
    <section class="f4u-panel f4u-poa-step">
      <div class="f4u-entry-copy">
        <span class="f4u-entry-kicker">Step ${stepNumber} · Power of Attorney</span>
        <h1>Power of Attorney &amp; Digital Execution</h1>
        <p>Review and electronically sign the limited authorization that allows filings4u, LLC to prepare, process, and submit documents for this order.</p>
      </div>

      <div id="poa-dynamic-state-tooltip" class="f4u-poa-status ${a.document_reviewed?"is-complete":""}" role="status" aria-live="polite">
        <span id="poa-tooltip-icon" class="f4u-poa-status__icon" aria-hidden="true">${a.document_reviewed?"✓":"!"}</span>
        <span id="poa-tooltip-text">
          ${a.document_reviewed
            ? `Document reviewed. You may now enter your legal name and complete the electronic signature.`
            : `Scroll through the entire authorization agreement to the bottom before signing. Your signature fields will unlock when the review is complete.`}
        </span>
      </div>

      <article class="f4u-poa-document" id="f4u-poa-document">
        <div class="f4u-document-brand">
          <img src="images/logo.png" alt="filings4u">
          <div>
            <strong>filings4u, LLC</strong>
            <span>A Subsidiary of Roseland Companies, LLC</span>
          </div>
        </div>

        <div class="f4u-poa-document__meta">
          <span>Limited Power of Attorney</span>
          <span>${esc(serviceName)}</span>
          ${jurisdiction?`<span>${esc(jurisdiction)}</span>`:""}
        </div>

        <h3>Limited Power of Attorney &amp; Corporate Agency Agreement</h3>

        <div id="poa-scroll-box" class="f4u-poa-scroll" tabindex="0" aria-label="Limited Power of Attorney document">
          <p><strong>LIMITED POWER OF ATTORNEY &amp; CORPORATE AGENCY AGREEMENT</strong></p>

          <p>
            <strong>WHEREAS,</strong> the undersigned Principal appoints and authorizes
            <strong>filings4u, LLC</strong>, an Illinois limited liability company and a subsidiary of
            <strong>Roseland Companies, LLC</strong>, together with its authorized operational agents, officers,
            employees, and designees, to act as the Principal's limited Attorney-in-Fact and Corporate Agent
            solely under the terms and limitations stated in this Agreement.
          </p>

          <h4>1. Express Limited Scope of Appointment</h4>
          <p>
            This appointment is limited to administrative, regulatory, filing, registration, compliance,
            document-preparation, document-transmission, and related ministerial activities reasonably necessary
            to perform the service purchased by the Principal through the filings4u digital filing wizard.
          </p>
          <p>
            For this order, the authorization applies specifically to
            <strong>${esc(serviceName)}</strong>${jurisdiction?` in <strong>${esc(jurisdiction)}</strong>`:""}.
            The Attorney-in-Fact may prepare, complete, sign where permitted and authorized, correct, amend,
            transmit, submit, receive, and process applications, registrations, forms, renewals, supporting
            documents, and related correspondence necessary to complete that service.
          </p>

          <h4>2. Grant of Operational Powers</h4>
          <p>
            The Principal authorizes filings4u, LLC to communicate with applicable state filing offices,
            federal agencies, regulatory bodies, registries, tax authorities, licensing agencies, and other
            governmental or administrative entities as reasonably necessary to carry out the selected service.
          </p>
          <p>
            This limited authorization may include responding to routine filing deficiencies, correcting
            clerical or formatting issues, transmitting customer-approved information, receiving filing
            confirmations, and taking other administrative actions reasonably required to complete the order.
          </p>

          <h4>3. Customer Information &amp; Accuracy</h4>
          <p>
            The Principal certifies that the information submitted through the filings4u wizard is complete and
            accurate to the best of the Principal's knowledge and that the Principal has authority to act for
            the applicant, business, organization, carrier, or other entity identified in this order.
          </p>
          <p>
            filings4u, LLC may rely on the information supplied by the Principal and is not responsible for
            inaccuracies, omissions, or delays caused by information supplied by the Principal or by government
            agency requirements outside filings4u's reasonable control.
          </p>

          <h4>4. Electronic Signatures &amp; Intent</h4>
          <p>
            The Principal agrees to conduct this transaction electronically and expressly intends the typed
            first and last name entered below, together with the associated electronic record and execution
            timestamp, to serve as the Principal's electronic signature for this authorization.
          </p>
          <p>
            The Principal acknowledges that electronic signatures and electronic records may be used in
            accordance with applicable federal and state electronic-transactions law, including the federal
            Electronic Signatures in Global and National Commerce Act (ESIGN) and applicable enactments of the
            Uniform Electronic Transactions Act (UETA), where those laws apply.
          </p>

          <h4>5. No Attorney-Client Relationship</h4>
          <p>
            This authorization does not create an attorney-client relationship and does not appoint filings4u,
            LLC as an attorney-at-law. filings4u, LLC provides filing, registration, compliance, document
            preparation, and administrative support services and does not provide legal, tax, accounting, or
            other professional advice.
          </p>

          <h4>6. Ratification, Revocation &amp; Duration</h4>
          <p>
            The Principal ratifies lawful administrative acts performed by filings4u, LLC within the scope of
            this authorization. This authorization becomes effective when electronically executed and remains
            effective only for the selected order and reasonably related filing communications unless earlier
            revoked in writing or as otherwise required by applicable law.
          </p>
          <p>
            Revocation does not affect actions already taken in reasonable reliance on this authorization before
            filings4u receives and can reasonably process the revocation. A revocation request may be submitted
            through an available verified client portal workflow or by contacting filings4u support.
          </p>

          <h4>7. Corporate Entity Information</h4>
          <p>
            <strong>filings4u, LLC</strong><br>
            A Subsidiary of Roseland Companies, LLC<br>
            State of Illinois<br>
            Support: <a href="mailto:support@filings4u.com">support@filings4u.com</a>
          </p>

          <div class="f4u-poa-scroll-end" aria-hidden="true">
            End of authorization document
          </div>
        </div>

        <div id="poa_input_wrapper" class="f4u-poa-signature-fields ${a.document_reviewed?"is-unlocked":""}">
          <div class="f4u-poa-sign-grid">
            <div class="f4u-form-field">
              <label for="poa_first_name">First name <span aria-hidden="true">*</span></label>
              <input id="poa_first_name" class="wizard-input-field" autocomplete="given-name"
                value="${esc(a.first_name||"")}" ${a.document_reviewed?"":"disabled"} required>
            </div>
            <div class="f4u-form-field">
              <label for="poa_last_name">Last name <span aria-hidden="true">*</span></label>
              <input id="poa_last_name" class="wizard-input-field" autocomplete="family-name"
                value="${esc(a.last_name||"")}" ${a.document_reviewed?"":"disabled"} required>
            </div>
          </div>
        </div>

        <div class="f4u-signature-viewport ${a.document_reviewed?"is-unlocked":""}">
          <span>Legal electronic signature preview</span>
          <strong id="poa_signature_preview">${esc([a.first_name,a.last_name].filter(Boolean).join(" ")||"Your signature appears here")}</strong>
          <small id="poa-signature-time">
            ${esc(a.executed_at?`Signed electronically · ${new Date(a.executed_at).toLocaleString()}`:"Date and time are recorded when you sign and continue.")}
          </small>
        </div>

        <div id="poa_consent_wrapper" class="f4u-poa-consent-wrap ${a.document_reviewed?"is-unlocked":""}">
          <label class="f4u-consent-row">
            <input type="checkbox" id="poa_consent_checkbox" ${a.consent?"checked":""} ${a.document_reviewed?"":"disabled"}>
            <span>
              I have reviewed this Limited Power of Attorney and consent to electronic execution. I intend my typed
              first and last name to serve as my electronic signature. I certify that I am authorized to act
              for the applicant or business identified in this order.
            </span>
          </label>
        </div>
      </article>

      <div class="f4u-actions">
        <button class="f4u-secondary" type="button" id="f4u-prev">Back</button>
        <span class="f4u-actions__note" id="f4u-auth-note">${a.document_reviewed?"Document reviewed. Complete your signature to continue.":"Scroll to the bottom of the POA to unlock the signature fields."}</span>
        <button class="f4u-primary" type="button" id="f4u-next">Authorize &amp; continue</button>
      </div>
    </section>`;

  const scrollBox=document.getElementById("poa-scroll-box");
  const status=document.getElementById("poa-dynamic-state-tooltip");
  const statusIcon=document.getElementById("poa-tooltip-icon");
  const statusText=document.getElementById("poa-tooltip-text");
  const fields=document.getElementById("poa_input_wrapper");
  const consentWrap=document.getElementById("poa_consent_wrapper");
  const signatureView=root.querySelector(".f4u-signature-viewport");
  const first=document.getElementById("poa_first_name");
  const last=document.getElementById("poa_last_name");
  const consent=document.getElementById("poa_consent_checkbox");
  const preview=document.getElementById("poa_signature_preview");
  const time=document.getElementById("poa-signature-time");
  const note=document.getElementById("f4u-auth-note");
  let reviewed=!!a.document_reviewed;
  let reviewedAt=a.document_reviewed_at||null;

  function unlockSignature(){
    if(reviewed)return;
    reviewed=true;
    reviewedAt=new Date().toISOString();
    [first,last,consent].forEach(el=>{if(el)el.disabled=false;});
    fields?.classList.add("is-unlocked");
    consentWrap?.classList.add("is-unlocked");
    signatureView?.classList.add("is-unlocked");
    status?.classList.add("is-complete");
    if(statusIcon)statusIcon.textContent="✓";
    if(statusText)statusText.textContent="Document reviewed. You may now enter your legal name and complete the electronic signature.";
    if(note)note.textContent="Document reviewed. Complete your signature to continue.";
  }

  function checkScroll(){
    if(!scrollBox||reviewed)return;
    const threshold=12;
    if(scrollBox.scrollTop+scrollBox.clientHeight>=scrollBox.scrollHeight-threshold){
      unlockSignature();
    }
  }

  scrollBox?.addEventListener("scroll",checkScroll,{passive:true});
  requestAnimationFrame(()=>{
    if(scrollBox && scrollBox.scrollHeight<=scrollBox.clientHeight+12)unlockSignature();
  });

  function updateSignature(){
    const name=[first?.value.trim(),last?.value.trim()].filter(Boolean).join(" ");
    if(preview)preview.textContent=name||"Your signature appears here";
  }
  first?.addEventListener("input",updateSignature);
  last?.addEventListener("input",updateSignature);
  updateSignature();

  document.getElementById("f4u-prev").addEventListener("click",prevStep);

  document.getElementById("f4u-next").addEventListener("click",async()=>{
    if(!reviewed){
      if(note)note.textContent="Scroll to the bottom of the Power of Attorney before signing.";
      scrollBox?.focus();
      scrollBox?.scrollIntoView({behavior:"smooth",block:"center"});
      return;
    }

    const f=String(first?.value||"").trim();
    const l=String(last?.value||"").trim();
    const hasConsent=!!consent?.checked;

    if(!f||!l){
      if(note)note.textContent="Enter both the first and last name of the authorized signer.";
      (!f?first:last)?.focus();
      return;
    }

    if(!hasConsent){
      if(note)note.textContent="Check the authorization consent box before continuing.";
      consent?.focus();
      return;
    }

    const executedAt=new Date().toISOString();
    const signerName=`${f} ${l}`;
    const values={
      first_name:f,
      last_name:l,
      signer_name:signerName,
      signature:signerName,
      consent:true,
      document_reviewed:true,
      document_reviewed_at:reviewedAt||executedAt,
      executed_at:executedAt,
      service_key:state.serviceKey,
      service_name:serviceName,
      jurisdiction:state.jurisdiction||null,
      document_title:"Limited Power of Attorney & Corporate Agency Agreement",
      document_version:"F4U-POA-2026-09-v1",
      principal_acknowledgment:true,
      electronic_signature_intent:true,
      parent_company:"Roseland Companies, LLC",

      // Compatibility fields used by the existing completion/order pipeline.
      signer_first_name:f,
      signer_last_name:l,
      signature_text:signerName,
      esign_consent:true,
      authority_confirmed:true,
      accuracy_confirmed:true,
      limited_poa_confirmed:true,
      authorization_version:"F4U-POA-2026-09-v1",
      authorization_scope:"this_order_and_related_filing_communications"
    };

    if(preview)preview.textContent=signerName;
    if(time)time.textContent=`Signed electronically · ${new Date(executedAt).toLocaleString()}`;

    const btn=document.getElementById("f4u-next");
    btn.disabled=true;
    btn.textContent="Saving authorization…";
    try{
      await saveStep("authorization",values);
      state.answers.authorization=values;
      nextStep();
    }catch(e){
      console.error(e);
      btn.disabled=false;
      btn.textContent="Authorize & continue";
      if(note)note.textContent="We couldn't save the authorization. Please try again.";
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
  const savedStep=runtimeKey(sessionResult.session.current_step_key);
  const savedIndex=state.steps.findIndex(step=>step.key===savedStep);
  if(savedIndex>=0){
    state.activeStep=savedIndex;
  }else{
    const fallbackOrder=["jurisdiction","application","addons","authorization","review","payment"];
    const oldPosition=fallbackOrder.indexOf(savedStep);
    const candidates=(oldPosition>=0?fallbackOrder.slice(oldPosition+1):fallbackOrder);
    const nextIndex=candidates.map(key=>state.steps.findIndex(step=>step.key===key)).find(index=>index>=0);
    state.activeStep=nextIndex===undefined?0:nextIndex;
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
