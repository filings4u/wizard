(function(){
"use strict";
window.renderWizardStep2=function(){
 const host=document.getElementById("step-2-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute();if(!r.service)return w.go(1);if(!r.government&&!r.jurisdiction)return w.go(1);
 const price=Number(r.service[r.planKey]||0),plan=w.title(r.planKey);
 const features=Array.isArray(r.service.features?.[r.planKey])?r.service.features[r.planKey]:Array.isArray(r.service[`${r.planKey}Features`])?r.service[`${r.planKey}Features`]:[];
 host.innerHTML=`<section class="f4u-entry-layout f4u-package-review"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 2 · Package Review</span><h2>${w.esc(r.service.name||w.title(r.serviceKey))}</h2><p>Confirm the package selected on the service page before continuing to the service-specific application.</p></div><div class="f4u-selection-summary"><span>Selected package</span><div><strong>${w.esc(plan)}</strong><strong style="color:#0e9f6e">${w.money(price)}</strong></div></div><div class="f4u-review-meta"><span>Filing jurisdiction</span><strong>${r.government?"Government service":w.esc(r.jurisdiction)}</strong></div><div class="f4u-review-features"><span class="f4u-review-label">What comes with this package</span>${features.length?`<ul>${features.map(x=>`<li><i>✓</i><span>${w.esc(x)}</span></li>`).join("")}</ul>`:`<p>Package features are shown on the selected service page.</p>`}</div><div class="f4u-review-pricing"><div class="f4u-review-fee-row"><span>filings4u service fee</span><strong>${w.money(price)}</strong></div></div><div class="wizard-action-footer"><button id="step2-back" type="button" class="btn-wizard-secondary">← Back</button><button id="step2-next" type="button" class="btn-wizard-main">Continue to Service Form</button></div></section>`;
 document.getElementById("step2-back")?.addEventListener("click",()=>w.go(1));
 document.getElementById("step2-next")?.addEventListener("click",()=>w.go(3));
};
})();