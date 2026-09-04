(function(){
"use strict";
window.renderWizardStep6=function(){
 const host=document.getElementById("step-6-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute(),serviceFee=Number(r.service?.[r.planKey]||0);
 const addonPrice={ "registered-agent":75,"annual-compliance":99,"operating-agreement":89,"ein-service":75,"good-standing":45,"boc3-filing":75,"safety-audit-prep":149 };
 const addonsTotal=w.state.addons.reduce((s,id)=>s+(addonPrice[id]||0),0),total=serviceFee+addonsTotal;
 window.currentOrderCorePayload=Object.assign(window.currentOrderCorePayload||{},{service_key:r.serviceKey,plan_tier:r.planKey,jurisdiction_state:r.jurisdiction||null,service_fee:serviceFee,addons_total:addonsTotal,total_amount:total,currency:"USD",form_payload:{...(window.currentOrderCorePayload?.form_payload||{}),authorization:w.state.authorization}});
 host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 6 · Review</span><h2>Review & Confirm</h2><p>Verify your order details before secure checkout.</p></div><div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden"><div style="display:flex;justify-content:space-between;padding:13px 16px;border-bottom:1px solid #eef2f7"><span>filings4u service fee</span><strong>${w.money(serviceFee)}</strong></div><div style="display:flex;justify-content:space-between;padding:13px 16px;border-bottom:1px solid #eef2f7"><span>Add-ons</span><strong>${w.money(addonsTotal)}</strong></div><div style="display:flex;justify-content:space-between;padding:16px;background:#f8fafc;font-weight:900"><span>Total due</span><strong style="color:#0e9f6e">${w.money(total)}</strong></div></div><div class="wizard-action-footer"><button id="step6-back" type="button" class="btn-wizard-secondary">← Back to Authorization</button><button id="step6-next" type="button" class="btn-wizard-main">Continue to Secure Checkout</button></div></section>`;
 document.getElementById("step6-back")?.addEventListener("click",()=>w.go(5));
 document.getElementById("step6-next")?.addEventListener("click",()=>w.go(7));
};
})();