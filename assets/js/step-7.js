(function(){
"use strict";
window.renderWizardStep7=function(){
 const host=document.getElementById("step-7-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,total=Number(window.currentOrderCorePayload?.total_amount||0);
 host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 7 · Secure Checkout</span><h2>Secure Checkout</h2><p>Complete payment through the production payment service.</p></div><div class="f4u-selection-summary"><span>Total due</span><div><strong>${w.money(total)}</strong></div></div><div id="stripe-payment-element-mount-point" style="margin-top:18px;min-height:150px;border:1px solid #e2e8f0;border-radius:10px;padding:16px"><div class="wizard-runtime-note">Payment backend connection is not enabled in this package because the current server endpoint accepts a browser-provided amount. The frontend is stable; checkout must be connected to a server-authoritative amount before live payment.</div></div><div class="wizard-action-footer"><button id="step7-back" type="button" class="btn-wizard-secondary">← Back to Review</button></div></section>`;
 document.getElementById("step7-back")?.addEventListener("click",()=>w.go(6));
};
})();