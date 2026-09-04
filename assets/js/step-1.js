(function(){
"use strict";
window.renderWizardStep1=function(){
 const host=document.getElementById("step-1-injection-placeholder"); if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute();
 if(r.government){
  host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 1 · Government Service</span><h2>${w.esc(r.service.name||w.title(r.serviceKey))}</h2><p>Confirm the selected government service before continuing.</p></div><div class="f4u-selection-summary"><span>Selected service</span><div><strong>${w.esc(r.service.name||w.title(r.serviceKey))}</strong></div></div><div class="wizard-action-footer" style="display:flex;justify-content:flex-end"><button id="step1-next" type="button" class="btn-wizard-main">Continue to Package Review</button></div></section>`;
  document.getElementById("step1-next")?.addEventListener("click",()=>w.go(2)); return;
 }
 const opts=w.stateOptions(r.jurisdiction);
 host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 1 · Jurisdiction</span><h2>Choose Filing Jurisdiction</h2><p>Select the state where this filing will be submitted.</p></div><div class="wizard-input-group"><label for="wizard_state_select">Filing state *</label><select id="wizard_state_select" class="wizard-input-field"><option value="">Select a state…</option>${opts}</select></div><div class="wizard-action-footer" style="display:flex;justify-content:flex-end"><button id="step1-next" type="button" class="btn-wizard-main">Continue to Package Review</button></div></section>`;
 document.getElementById("step1-next")?.addEventListener("click",()=>{const s=document.getElementById("wizard_state_select")?.value;if(!w.setJurisdiction(s)){document.getElementById("wizard_state_select")?.focus();return;}w.go(2);});
};
})();