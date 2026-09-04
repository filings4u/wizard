(function(){
"use strict";
window.renderWizardStep8=function(){
 const host=document.getElementById("step-8-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,verified=w.state.verifiedPayment;
 if(!verified){host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 8 · Success & Account Setup</span><h2>Payment verification required</h2><p>This screen is available only after the production payment controller supplies a verified paid result.</p></div></section>`;return;}
 host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 8 · Success</span><h2>Payment received</h2><p>Your order was received and payment was verified.</p></div><div class="wizard-runtime-note">Tracking: ${w.esc(verified.tracking_number||"Pending")} · Order: ${w.esc(verified.order_id||"Recorded")}</div><div style="margin-top:18px"><a class="btn-wizard-main" href="wizard-success.html">Open Receipt & Account Setup</a></div></section>`;
};
window.setVerifiedPaymentResultForWizard=function(result){const status=String(result?.payment_status||result?.status||"").toLowerCase();if(!["paid","succeeded","complete","completed"].includes(status))return false;window.F4UWizard.state.verifiedPayment={...result};sessionStorage.setItem("f4u_verified_payment_result",JSON.stringify(result));window.F4UWizard.go(8);return true;};
})();

document.addEventListener("DOMContentLoaded",function(){
  const root=document.getElementById("success-root");
  if(!root) return;
  let result=null;
  try{result=JSON.parse(sessionStorage.getItem("f4u_verified_payment_result")||"null");}catch(_){}
  if(!result){
    root.innerHTML='<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 8 · Success</span><h2>Payment verification required</h2><p>No verified payment result is available in this browser session.</p></div></section>';
    return;
  }
  root.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 8 · Success</span><h2>Payment received</h2><p>Your order has been received and payment was verified.</p></div><div class="wizard-runtime-note"><strong>Tracking:</strong> ${String(result.tracking_number||"Pending")}<br><strong>Order:</strong> ${String(result.order_id||"Recorded")}</div><div style="margin-top:18px"><a class="btn-wizard-main" href="customer-login.html">Client Portal</a></div></section>`;
},{once:true});
