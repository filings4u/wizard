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
 const payload={service_key:r.serviceKey,plan_tier:r.planKey,jurisdiction_state:r.government?"":r.jurisdiction,upsells:getUpsells(w),session_token:sessionToken(),...contact,form_payload:w.state?.answers||{}};
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
  w.state.verifiedPayment=order;sessionStorage.setItem("f4u_verified_payment_result",JSON.stringify(order));w.persist?.();w.go(8);return true;
 }
 status.className="f4u-stripe-status is-loading";status.innerHTML='<span class="f4u-stripe-spinner" aria-hidden="true"></span><span>Payment received. Finalizing your order…</span>';
 payButton.disabled=true;
 // This is not an artificial transition delay: the webhook is the payment authority.
 // Recheck on animation frames / network completion instead of a long fixed timer.
 for(let i=0;i<30;i++){
  await new Promise(requestAnimationFrame);
  const current=await orderStatus(checkout.order_id,checkout.tracking_number).catch(()=>null);
  if(current&&String(current.payment_status||"").toLowerCase()==="paid"){
   w.state.verifiedPayment=current;sessionStorage.setItem("f4u_verified_payment_result",JSON.stringify(current));w.persist?.();w.go(8);return true;
  }
 }
 status.className="f4u-stripe-status is-warning";status.innerHTML="<strong>Payment received.</strong><span>Your order is still being finalized. Click below to check again.</span>";
 payButton.disabled=false;payButton.textContent="Check Payment Status";return false;
}

window.renderWizardStep7=async function(){
 const host=document.getElementById("step-7-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute();
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