(function(){
"use strict";

const CHECKOUT_URL="https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-checkout";
const STATUS_URL="https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-order-status";
let stripeInstance=null,elementsInstance=null,paymentElement=null,activeMountKey="";

function clean(v){return String(v??"").trim();}
function errorText(err){
 if(!err)return "Payment could not be prepared.";
 if(typeof err==="string")return err;
 if(typeof err.message==="string")return err.message;
 if(typeof err.error==="string")return err.error;
 if(err.error?.message)return String(err.error.message);
 try{return JSON.stringify(err);}catch(_){return "Payment could not be prepared.";}
}
function getContact(w){
 const s=w.state||{},a=s.answers||{},auth=s.authorization||{};
 const pick=(...keys)=>{for(const k of keys){for(const v of [s[k],a[k],localStorage.getItem(k)])if(clean(v))return clean(v);}return "";};
 return {
  first_name:pick("first_name","contact_first_name","authorized_first_name")||clean(auth.first_name),
  last_name:pick("last_name","contact_last_name","authorized_last_name")||clean(auth.last_name),
  email_address:pick("email_address","email","contact_email"),
  phone_number:pick("phone_number","phone","contact_phone"),
  company_name:pick("company_name","business_name","legal_business_name","llc_desired_name","corp_proposed_name","clia_lab_name","sp_proposed_name")||"Not Specified"
 };
}
function getUpsells(w){
 const raw=w.state?.addons||w.state?.selectedUpsells||w.state?.upsells||[];
 if(Array.isArray(raw))return [...new Set(raw.map(x=>typeof x==="string"?x:(x?.slug||x?.upsell_slug)).filter(Boolean))];
 if(raw&&typeof raw==="object")return Object.entries(raw).filter(([,v])=>!!v).map(([k])=>k);
 return [];
}
function sessionToken(){
 let t=sessionStorage.getItem("f4u_wizard_session_token");
 if(!t){t=crypto.randomUUID();sessionStorage.setItem("f4u_wizard_session_token",t);}return t;
}
function loadStripeJs(){
 if(window.Stripe)return Promise.resolve(window.Stripe);
 if(window.__F4U_STRIPE_LOADER)return window.__F4U_STRIPE_LOADER;
 window.__F4U_STRIPE_LOADER=new Promise((resolve,reject)=>{
  const existing=document.querySelector('script[src="https://js.stripe.com/v3/"]');
  if(existing){existing.addEventListener("load",()=>resolve(window.Stripe),{once:true});existing.addEventListener("error",()=>reject(new Error("Stripe.js could not load.")),{once:true});return;}
  const s=document.createElement("script");s.src="https://js.stripe.com/v3/";s.async=true;s.onload=()=>resolve(window.Stripe);s.onerror=()=>reject(new Error("Stripe.js could not load."));document.head.appendChild(s);
 });
 return window.__F4U_STRIPE_LOADER;
}
async function orderStatus(orderId,tracking){
 const r=await fetch(STATUS_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:orderId,tracking_number:tracking})});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(errorText(d));return d.order||null;
}
async function preparePayment(w,r,status,mount,payButton){
 const contact=getContact(w);
 if(!contact.email_address)throw new Error("A customer email address is required before payment.");
 status.className="f4u-stripe-status is-loading";
 status.innerHTML='<span class="f4u-stripe-spinner" aria-hidden="true"></span><span>Loading secure payment form…</span>';
 const payload={service_key:r.serviceKey,plan_tier:r.planKey,jurisdiction_state:r.jurisdiction,upsells:getUpsells(w),session_token:sessionToken(),...contact,form_payload:window.currentOrderCorePayload?.form_payload||{service_answers:w.state?.answers||{},authorization:w.state?.authorization||{}}};
 const [stripeCtor,response]=await Promise.all([
  loadStripeJs(),
  fetch(CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
 ]);
 const data=await response.json().catch(()=>({}));
 if(!response.ok||!data.client_secret)throw new Error(errorText(data));
 const publishableKey=data.publishable_key||window.FILINGS4U_ENV?.STRIPE_PUBLISHABLE_KEY||window.stripePublicKey||"";
 if(!publishableKey)throw new Error("Stripe publishable key is not configured for the wizard.");
 const mountKey=`${data.payment_intent_id||""}:${data.client_secret}`;
 if(paymentElement&&activeMountKey!==mountKey){try{paymentElement.destroy();}catch(_){} paymentElement=null;elementsInstance=null;stripeInstance=null;}
 stripeInstance=stripeCtor(publishableKey);
 elementsInstance=stripeInstance.elements({clientSecret:data.client_secret,appearance:{theme:"stripe",variables:{colorPrimary:"#10b981",colorText:"#0a1f44",colorDanger:"#dc2626",borderRadius:"8px",fontFamily:'"DM Sans", system-ui, sans-serif'}}});
 paymentElement=elementsInstance.create("payment",{layout:{type:"tabs",defaultCollapsed:false}});
 mount.innerHTML="";paymentElement.mount(mount);activeMountKey=mountKey;
 w.state.checkout={order_id:data.order_id,tracking_number:data.tracking_number,payment_intent_id:data.payment_intent_id,pricing:data.pricing,created_at:new Date().toISOString()};w.persist?.();
 status.className="f4u-stripe-status";status.innerHTML="";payButton.disabled=false;
}
async function finalizePaidOrder(w,checkout,status,payButton){
 const order=await orderStatus(checkout.order_id,checkout.tracking_number);
 if(order&&String(order.payment_status||"").toLowerCase()==="paid"){
  w.state.verifiedPayment=order;sessionStorage.setItem("f4u_verified_payment_result",JSON.stringify(order));w.persist?.();renderPaidSummary(w,order);return true;
 }
 status.className="f4u-stripe-status is-loading";status.innerHTML='<span class="f4u-stripe-spinner" aria-hidden="true"></span><span>Payment received. Finalizing your order…</span>';
 payButton.disabled=true;
 // This is not an artificial transition delay: the webhook is the payment authority.
 // Recheck on animation frames / network completion instead of a long fixed timer.
 for(let i=0;i<30;i++){
  await new Promise(requestAnimationFrame);
  const current=await orderStatus(checkout.order_id,checkout.tracking_number).catch(()=>null);
  if(current&&String(current.payment_status||"").toLowerCase()==="paid"){
   w.state.verifiedPayment=current;sessionStorage.setItem("f4u_verified_payment_result",JSON.stringify(current));w.persist?.();renderPaidSummary(w,current);return true;
  }
 }
 status.className="f4u-stripe-status is-warning";status.innerHTML="<strong>Payment received.</strong><span>Your order is still being finalized. Click below to check again.</span>";
 payButton.disabled=false;payButton.textContent="Check Payment Status";return false;
}


function printableWindow(title,body){
 const root=document.createElement("section");
 root.id="f4u-print-root";
 root.innerHTML=`<style>#f4u-print-root{font-family:Arial,sans-serif;color:#0a1f44;background:#fff;padding:32px;max-width:900px;margin:0 auto}#f4u-print-root img{width:135px;height:auto}#f4u-print-root .head{border-bottom:3px solid #10b981;padding-bottom:18px;margin-bottom:24px}#f4u-print-root .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}#f4u-print-root .box{border:1px solid #cbd5e1;padding:20px}#f4u-print-root .row{display:flex;justify-content:space-between;gap:24px;padding:12px 0;border-bottom:1px solid #e2e8f0}#f4u-print-root .total{font-weight:800;font-size:18px;border-top:2px solid #0a1f44;margin-top:4px}#f4u-print-root .poa{font-family:Georgia,serif;line-height:1.7;color:#172033}#f4u-print-root .sig{margin-top:28px;border-top:1px solid #94a3b8;padding-top:14px}@media print{#f4u-print-root{padding:0;max-width:none}}</style>${body}`;
 document.body.appendChild(root);
 document.body.classList.add("f4u-print-document");
 const cleanup=()=>{document.body.classList.remove("f4u-print-document");root.remove();};
 const after=()=>setTimeout(cleanup,150);
 window.addEventListener("afterprint",cleanup,{once:true});
 requestAnimationFrame(()=>requestAnimationFrame(()=>{window.print();after();}));
}

function paidLineItems(w,order){
 const r=w.refreshRoute(),items=[];
 items.push({name:`${r.service?.name||w.title(r.serviceKey)} — ${w.title(r.planKey)}`,price:Number(order.service_fee||0)});
 const ups=Array.isArray(order.upsells_payload)?order.upsells_payload:[];
 ups.forEach(x=>items.push({name:x.upsell_name||x.name||x.upsell_slug||"Additional service",price:Number(x.price||0)}));
 if(Number(order.government_fee||0)>0)items.push({name:`${r.jurisdiction||order.jurisdiction_state||"Government"} government filing fee`,price:Number(order.government_fee||0)});
 return items;
}
function renderPaidSummary(w,order){
 const host=document.getElementById("step-7-injection-placeholder");if(!host)return;
 const r=w.refreshRoute(),a=w.state.authorization||order.form_payload?.authorization||{},items=paidLineItems(w,order);
 const paid=Number(order.total_paid_amount||order.total_amount||0),signed=a.executed_at||order.poa_execution_stamp||order.paid_at||"";
 const portal=order.account_setup_mode==="returning_customer";
 const rows=items.map(x=>`<div class="f4u-invoice-row"><span class="f4u-invoice-description">${w.esc(x.name)}</span><strong class="f4u-invoice-amount">${w.money(x.price)}</strong></div>`).join("");
 const poaDoc=a.document_html||`<p><strong>LIMITED POWER OF ATTORNEY & CORPORATE AGENCY AGREEMENT</strong></p><p>The undersigned Principal authorizes filings4u, LLC to perform the limited administrative, regulatory, filing, registration, compliance, document-preparation and document-transmission activities reasonably necessary to complete ${w.esc(r.service?.name||w.title(r.serviceKey))}${r.jurisdiction?` in ${w.esc(r.jurisdiction)}`:""}.</p><p>This authorization is limited to the service purchased and does not create an attorney-client relationship.</p>`;
 host.innerHTML=`<section class="f4u-entry-layout f4u-paid-confirmation"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 7 · Order Complete</span><h2>Payment received</h2><p>Your payment was verified. Your complete order confirmation and signed authorization are below.</p></div>
 <div class="f4u-success-banner"><strong>Order successfully received</strong><span>Keep your order and tracking numbers for your records.</span></div>
 <div class="f4u-summary-grid"><article><span>Order number</span><strong>${w.esc(order.id||"Recorded")}</strong></article><article><span>Tracking number</span><strong>${w.esc(order.tracking_number||"Pending")}</strong></article><article><span>Payment</span><strong>${w.money(paid)}</strong><small>Paid ${w.esc(order.paid_at?new Date(order.paid_at).toLocaleString():"")}</small></article><article><span>Order status</span><strong>${w.esc(w.title(order.order_status||"processing"))}</strong></article></div>
 <div id="f4u-final-receipt" class="f4u-price-summary f4u-invoice"><div class="f4u-invoice-header"><div><span class="f4u-invoice-eyebrow">PAID RECEIPT</span><strong>Itemized order</strong></div><span class="f4u-invoice-currency">USD</span></div><div class="f4u-invoice-columns"><span>Description</span><span>Amount</span></div>${rows}<div class="f4u-invoice-total"><span>Total paid</span><strong>${w.money(paid)}</strong></div></div>
 <article id="f4u-final-poa" class="f4u-final-poa"><div class="f4u-final-poa-head"><img src="images/logo.png" alt="filings4u"><div><span>Signed authorization</span><strong>Limited Power of Attorney & Corporate Agency Agreement</strong></div></div><div class="f4u-final-poa-paper">${poaDoc}</div><div class="f4u-final-signature"><span>Electronically signed by</span><strong>${w.esc(a.signer_name||a.signature||`${a.first_name||""} ${a.last_name||""}`.trim()||"Authorized signer")}</strong><small>${signed?`Executed ${w.esc(new Date(signed).toLocaleString())}`:"Execution time recorded with order"}</small><small>Order ${w.esc(order.id||"")} · Tracking ${w.esc(order.tracking_number||"")}</small></div></article>
 <div class="f4u-final-actions"><button id="f4u-print-receipt" type="button" class="btn-wizard-secondary">Print Receipt</button><button id="f4u-print-poa" type="button" class="btn-wizard-secondary">Print Power of Attorney</button>${portal?'<a class="btn-wizard-main" href="https://portal.filings4u.com/client-login.html">Access Client Portal</a>':'<span class="f4u-account-invite-note">A separate account activation email will be sent to the email used for this order. Portal access appears after your account is activated.</span>'}</div></section>`;
 document.getElementById("f4u-print-receipt")?.addEventListener("click",()=>printableWindow("filings4u Receipt",`<div class="head"><img src="${location.origin}/images/logo.png"><h1>Paid Receipt</h1></div><div class="meta"><div><b>Order number</b><br>${w.esc(order.id||"")}</div><div><b>Tracking number</b><br>${w.esc(order.tracking_number||"")}</div></div><div class="box">${items.map(x=>`<div class="row"><span>${w.esc(x.name)}</span><b>${w.money(x.price)}</b></div>`).join("")}<div class="row total"><span>Total paid</span><b>${w.money(paid)}</b></div></div>`));
 document.getElementById("f4u-print-poa")?.addEventListener("click",()=>printableWindow("Signed Power of Attorney",`<div class="head"><img src="${location.origin}/images/logo.png"><h1>Limited Power of Attorney & Corporate Agency Agreement</h1></div><div class="poa">${poaDoc}</div><div class="sig"><b>Electronically signed by:</b> ${w.esc(a.signer_name||a.signature||"")}<br><b>Executed:</b> ${signed?w.esc(new Date(signed).toLocaleString()):"Recorded with order"}<br><b>Order:</b> ${w.esc(order.id||"")}<br><b>Tracking:</b> ${w.esc(order.tracking_number||"")}</div>`));
 if(!w.state.__completionLifecycleDone){
  w.state.__completionLifecycleDone=true;
  w.persist?.();
  window.endFilings4uWizardSession?.("purchase_complete",{signOut:true,clearState:false});
  try{sessionStorage.setItem("f4u_wizard_completed_at",String(Date.now()));}catch(_){}
 }
 window.currentWizardActiveStep=7;
 w.updateProgress?.(7);
 document.dispatchEvent(new CustomEvent("f4u:wizard-step-change",{detail:{step:7,complete:true}}));
 window.scrollTo({top:0,behavior:"instant"});
}

window.renderWizardStep7=async function(){
 const host=document.getElementById("step-7-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute();
 if(w.state?.verifiedPayment&&String(w.state.verifiedPayment.payment_status||"").toLowerCase()==="paid"){renderPaidSummary(w,w.state.verifiedPayment);return;}
 host.innerHTML=`<section class="f4u-entry-layout f4u-stripe-checkout-shell">
   <div class="f4u-entry-copy f4u-stripe-heading"><span class="f4u-entry-kicker">Step 7 · Secure Checkout</span><h2>Secure Checkout</h2><p>Enter your payment information below to complete your order.</p></div>
   <div class="f4u-stripe-frame">
     <div id="f4u-stripe-status" class="f4u-stripe-status" aria-live="polite"></div>
     <div id="stripe-payment-element-mount-point" class="f4u-stripe-payment-mount"></div>
   </div>
   <div class="wizard-action-footer f4u-stripe-actions"><button id="step7-back" type="button" class="btn-wizard-secondary">← Back to Review</button><button id="step7-pay" type="button" class="btn-wizard-main" disabled>Pay Securely</button></div>
   <p class="f4u-stripe-footnote">Payment details are securely handled by Stripe. filings4u does not store your card number.</p>
 </section>`;
 const status=document.getElementById("f4u-stripe-status"),mount=document.getElementById("stripe-payment-element-mount-point"),pay=document.getElementById("step7-pay");
 document.getElementById("step7-back")?.addEventListener("click",()=>w.go(6));
 try{await preparePayment(w,r,status,mount,pay);}catch(err){status.className="f4u-stripe-status is-error";status.innerHTML=`<strong>Payment form could not load.</strong><span>${w.esc(errorText(err))}</span>`;pay.disabled=true;return;}
 pay.addEventListener("click",async()=>{
  if(!stripeInstance||!elementsInstance)return;
  if(pay.textContent==="Check Payment Status"){await finalizePaidOrder(w,w.state.checkout,status,pay);return;}
  pay.disabled=true;pay.textContent="Processing…";status.className="f4u-stripe-status is-loading";status.innerHTML='<span class="f4u-stripe-spinner" aria-hidden="true"></span><span>Processing payment…</span>';
  const result=await stripeInstance.confirmPayment({elements:elementsInstance,redirect:"if_required",confirmParams:{return_url:location.href}});
  if(result.error){status.className="f4u-stripe-status is-error";status.innerHTML=`<strong>Payment was not completed.</strong><span>${w.esc(result.error.message||"Please review your payment information and try again.")}</span>`;pay.disabled=false;pay.textContent="Pay Securely";return;}
  if(result.paymentIntent?.status==="succeeded"||result.paymentIntent?.status==="processing"||result.paymentIntent?.status==="requires_capture"){
    await finalizePaidOrder(w,w.state.checkout,status,pay);return;
  }
  status.className="f4u-stripe-status is-warning";status.innerHTML="<strong>Payment needs additional action.</strong><span>Please complete the Stripe instructions above.</span>";pay.disabled=false;pay.textContent="Pay Securely";
 });
};
})();