(function(){
"use strict";
window.renderWizardStep3=async function(){
 const host=document.getElementById("step-3-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute();if(!r.service)return w.go(1);if(!r.government&&!r.jurisdiction)return w.go(1);
 host.innerHTML=`<section class="step-panel-form-card f4u-service-application"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 3 · Business Information</span><h2>${w.esc(r.service.name||w.title(r.serviceKey))}</h2><p>Complete the information required for this filing. Questions below change based on the selected service and jurisdiction.</p></div><div class="context-jurisdiction-tooltip-banner"><p style="margin:0">${r.government?`Government service: <strong>${w.esc(r.service.name||w.title(r.serviceKey))}</strong>`:`Filing jurisdiction: <strong>${w.esc(r.jurisdiction)}</strong> · Service: <strong>${w.esc(r.service.name||w.title(r.serviceKey))}</strong>`}</p></div><div id="step-3-onboarding-fields-canvas" style="margin-top:20px"></div><div class="wizard-footer-action-row"><button id="step3-back" type="button" class="btn-wizard-nav-back">← Back to Package Review</button><button id="step3-next" type="button" class="btn-wizard-main btn-wizard-nav-next">Continue to Add-ons</button></div></section>`;
 const canvas=document.getElementById("step-3-onboarding-fields-canvas");
 const renderer=w.currentServiceRenderer();
 if(typeof renderer!=="function"){canvas.innerHTML=`<div class="wizard-runtime-error"><strong>Service form unavailable.</strong><div style="margin-top:6px">No renderer is registered for ${w.esc(r.serviceKey)}.</div></div>`;return;}
 try{
   const html=await Promise.resolve(renderer(r.government?"":w.stateOptions(r.jurisdiction),{serviceKey:r.serviceKey,state:r.jurisdiction,isGovernment:r.government}));
   if(typeof html!=="string") throw new Error("The service renderer did not return HTML.");
   canvas.innerHTML=html;
   w.restoreAnswers(canvas);
   canvas.addEventListener("input",()=>w.captureAnswers(canvas));
   canvas.addEventListener("change",()=>w.captureAnswers(canvas));
 }catch(error){
   console.error("[filings4u] Business Information render failed:",error);
   canvas.innerHTML=`<div class="wizard-runtime-error"><strong>We could not render this service application.</strong><div style="margin-top:6px">${w.esc(error.message||error)}</div></div>`;
 }
 document.getElementById("step3-back")?.addEventListener("click",()=>w.go(2));
 document.getElementById("step3-next")?.addEventListener("click",()=>{
   if(!w.validateRequired(canvas))return;
   const validator=w.currentServiceValidator();
   if(validator&&typeof validator.validate==="function"){const result=validator.validate();if(result===false||result?.isValid===false)return;}
   w.captureAnswers(canvas);w.go(4);
 });
};
})();