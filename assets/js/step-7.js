(function(){
"use strict";

const CHECKOUT_URL="https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-checkout";
const STATUS_URL="https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-order-status";

function clean(v){return String(v??"").trim();}
function getContact(w){
 const s=w.state||{}, answers=s.answers||{}, auth=s.authorization||{};
 const pick=(...keys)=>{
   for(const key of keys){
     const candidates=[s[key],answers[key],localStorage.getItem(key)];
     for(const v of candidates) if(clean(v)) return clean(v);
   }
   return "";
 };
 return {
   first_name:pick("first_name","contact_first_name","authorized_first_name")||clean(auth.first_name),
   last_name:pick("last_name","contact_last_name","authorized_last_name")||clean(auth.last_name),
   email_address:pick("email_address","email","contact_email"),
   phone_number:pick("phone_number","phone","contact_phone"),
   company_name:pick("company_name","business_name","legal_business_name","llc_desired_name","corp_proposed_name","clia_lab_name")||"Not Specified"
 };
}
function getUpsells(w){
 const raw=w.state?.selectedUpsells||w.state?.upsells||[];
 if(Array.isArray(raw)) return raw.map(x=>typeof x==="string"?x:(x?.slug||x?.upsell_slug)).filter(Boolean);
 if(raw&&typeof raw==="object") return Object.entries(raw).filter(([,v])=>!!v).map(([k])=>k);
 return [];
}
function checkoutState(){
 const q=new URLSearchParams(location.search);
 return {mode:q.get("checkout"),orderId:q.get("order_id"),tracking:q.get("tracking")};
}
function clearCheckoutParams(){
 const u=new URL(location.href);
 ["checkout","order_id","tracking"].forEach(k=>u.searchParams.delete(k));
 history.replaceState(null,"",u.pathname+(u.searchParams.toString()?`?${u.searchParams}`:"")+u.hash);
}
async function verifyReturnedOrder(w,orderId,tracking){
 const r=await fetch(STATUS_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:orderId,tracking_number:tracking})});
 const data=await r.json().catch(()=>({}));
 if(!r.ok) throw new Error(data.error||"We could not verify the payment status.");
 if(String(data.order?.payment_status||"").toLowerCase()==="paid"){
   w.state.verifiedPayment=data.order;
   sessionStorage.setItem("f4u_verified_payment_result",JSON.stringify(data.order));
   w.persist?.();
   clearCheckoutParams();
   w.go(8);
   return true;
 }
 return false;
}

window.renderWizardStep7=async function(){
 const host=document.getElementById("step-7-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute(),contact=getContact(w);
 const localTotal=Number(window.currentOrderCorePayload?.total_amount||window.wizardCalculatedFinalTotalAmount||0);
 const returned=checkoutState();

 host.innerHTML=`<section class="f4u-entry-layout f4u-checkout-shell">
   <div class="f4u-entry-copy">
     <span class="f4u-entry-kicker">Step 7 · Secure Checkout</span>
     <h2>Secure Checkout</h2>
     <p>Review the amount due, then continue to Stripe's encrypted checkout to complete payment.</p>
   </div>
   <div class="f4u-checkout-total-card">
     <div><span>Total due</span><strong>${w.money(localTotal)}</strong></div>
     <small>The final amount is recalculated on our secure server from the selected service, package, add-ons, and applicable government filing fee before Stripe opens.</small>
   </div>
   <div id="f4u-checkout-status" class="f4u-checkout-status" aria-live="polite"></div>
   <div class="f4u-checkout-security">
     <strong>Secure payment</strong>
     <span>Payment information is entered directly on Stripe's secure checkout. filings4u does not store your card number.</span>
   </div>
   <div class="wizard-action-footer f4u-checkout-actions">
     <button id="step7-back" type="button" class="btn-wizard-secondary">← Back to Review</button>
     <button id="step7-pay" type="button" class="btn-wizard-main">Continue to Secure Payment</button>
   </div>
 </section>`;

 const status=document.getElementById("f4u-checkout-status");
 const pay=document.getElementById("step7-pay");

 document.getElementById("step7-back")?.addEventListener("click",()=>w.go(6));

 if(returned.mode==="cancelled"){
   status.className="f4u-checkout-status is-warning";
   status.innerHTML="<strong>Payment was not completed.</strong><span>Your application is still here. You can return to secure payment whenever you are ready.</span>";
   clearCheckoutParams();
 }
 if(returned.mode==="success"&&returned.orderId){
   pay.disabled=true;
   status.className="f4u-checkout-status is-loading";
   status.innerHTML="<strong>Confirming payment…</strong><span>Please keep this page open while Stripe confirmation is verified.</span>";
   try{
     for(let i=0;i<8;i++){
       if(await verifyReturnedOrder(w,returned.orderId,returned.tracking)) return;
       await new Promise(res=>setTimeout(res,750));
     }
     throw new Error("Stripe is still confirming this payment. Please wait a moment and try again.");
   }catch(err){
     pay.disabled=false;
     status.className="f4u-checkout-status is-error";
     status.innerHTML=`<strong>Payment confirmation is still processing.</strong><span>${w.esc(err.message||err)}</span>`;
   }
 }

 pay?.addEventListener("click",async()=>{
   if(pay.disabled)return;
   if(!contact.email_address){
     w.notify("Email required","Enter your email in the application before continuing to payment.","error");
     return;
   }
   pay.disabled=true;
   pay.textContent="Preparing secure payment…";
   status.className="f4u-checkout-status is-loading";
   status.innerHTML="<strong>Preparing secure payment…</strong><span>We are verifying the order total before opening Stripe.</span>";
   try{
     const sessionToken=sessionStorage.getItem("f4u_wizard_session_token")||localStorage.getItem("f4u_wizard_session_token")||crypto.randomUUID();
     sessionStorage.setItem("f4u_wizard_session_token",sessionToken);
     const payload={
       service_key:r.serviceKey,
       plan_tier:r.planKey,
       jurisdiction_state:r.government?"":r.jurisdiction,
       upsells:getUpsells(w),
       session_token:sessionToken,
       ...contact,
       form_payload:w.state?.answers||{}
     };
     const response=await fetch(CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
     const data=await response.json().catch(()=>({}));
     if(!response.ok||!data.checkout_url) throw new Error(data.error||"Secure checkout could not be started.");
     w.state.checkout={order_id:data.order_id,tracking_number:data.tracking_number,pricing:data.pricing,created_at:new Date().toISOString()};
     w.persist?.();
     location.assign(data.checkout_url);
   }catch(err){
     pay.disabled=false;
     pay.textContent="Continue to Secure Payment";
     status.className="f4u-checkout-status is-error";
     status.innerHTML=`<strong>Checkout could not be started.</strong><span>${w.esc(err.message||err)}</span>`;
   }
 });
};

document.addEventListener("DOMContentLoaded",()=>{
 const q=new URLSearchParams(location.search);
 if(q.get("checkout")==="success"||q.get("checkout")==="cancelled"){
   const tryOpen=()=>window.F4UWizard?.go?window.F4UWizard.go(7):setTimeout(tryOpen,50);
   tryOpen();
 }
},{once:true});
})();