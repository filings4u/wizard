(function(){
"use strict";
const CATALOG={
 "llc-formation":[["ein-service","Employer Identification Number (EIN)",75,"Federal tax ID application support."],["registered-agent","Registered Agent Service",75,"Registered agent coverage for your new LLC."],["operating-agreement","Operating Agreement",89,"Customized internal governance document."],["annual-compliance","Annual Compliance Monitoring",99,"Annual report and compliance reminder support."],["good-standing","Certificate of Good Standing",45,"Certificate procurement when available."]],
 "corporations":[["ein-service","Employer Identification Number (EIN)",75,"Federal tax ID application support."],["registered-agent","Registered Agent Service",75,"Registered agent coverage for your corporation."],["annual-compliance","Annual Compliance Monitoring",99,"Corporate compliance reminder support."],["good-standing","Certificate of Good Standing",45,"Certificate procurement when available."]],
 "series-llc":[["ein-service","Employer Identification Number (EIN)",75,"Federal tax ID support."],["registered-agent","Registered Agent Service",75,"Registered agent coverage."],["operating-agreement","Series Operating Agreement",89,"Governance framework for the master LLC and series."],["annual-compliance","Annual Compliance Monitoring",99,"Ongoing compliance reminders."]],
 "nonprofits":[["ein-service","Employer Identification Number (EIN)",75,"Federal tax ID support."],["registered-agent","Registered Agent Service",75,"Registered agent coverage."],["annual-compliance","Annual Compliance Monitoring",99,"State compliance reminders."],["good-standing","Certificate of Good Standing",45,"Certificate procurement when available."]],
 "trucker-authority":[["boc3-filing","BOC-3 Process Agent Filing",75,"Process-agent designation filing support."],["safety-audit-prep","New Entrant Safety Audit Preparation",149,"Prepare for new entrant safety review."],["carrier-liability-quote","Motor Carrier Liability Quote",0,"Request an insurance quote; no charge today."],["cargo-insurance-quote","Cargo Insurance Quote",0,"Request a cargo coverage quote; no charge today."]],
 "broker-authority":[["boc3-filing","BOC-3 Process Agent Filing",75,"Process-agent designation filing support."],["broker-financial-responsibility","Broker Financial Responsibility Review",0,"Request bond/trust guidance; no charge today."],["broker-liability-quote","Broker Insurance Quote",0,"Request a broker insurance quote; no charge today."]],
 "ucr-registration":[["boc3-filing","BOC-3 Process Agent Filing",75,"Add process-agent filing support."],["annual-compliance","Annual Compliance Monitoring",99,"Renewal and compliance reminders."]],
 "employer-id-ein":[["operating-agreement","Operating Agreement",89,"Add an operating agreement for an LLC."],["annual-compliance","Annual Compliance Monitoring",99,"Ongoing filing reminders."],["good-standing","Certificate of Good Standing",45,"Certificate procurement when available."]],
 "registered-agent":[["annual-compliance","Annual Compliance Monitoring",99,"Ongoing annual compliance reminders."],["good-standing","Certificate of Good Standing",45,"Certificate procurement when available."]],
 "annual-reports":[["registered-agent","Registered Agent Service",75,"Add registered agent coverage."],["good-standing","Certificate of Good Standing",45,"Certificate procurement when available."]],
 "business-licenses":[["ein-service","Employer Identification Number (EIN)",75,"Federal tax ID support."],["annual-compliance","Annual Compliance Monitoring",99,"Ongoing compliance reminders."]]
};
const FALLBACK={
 formation:[["ein-service","Employer Identification Number (EIN)",75,"Federal tax ID support."],["registered-agent","Registered Agent Service",75,"Registered agent coverage."],["annual-compliance","Annual Compliance Monitoring",99,"Ongoing compliance reminders."]],
 carrier:[["boc3-filing","BOC-3 Process Agent Filing",75,"Process-agent filing support."],["safety-audit-prep","Safety Audit Preparation",149,"Prepare your compliance file."],["carrier-liability-quote","Insurance Quote",0,"Request a quote; no charge today."]],
 general:[["annual-compliance","Annual Compliance Monitoring",99,"Ongoing compliance reminders."],["good-standing","Certificate of Good Standing",45,"Certificate procurement when available."]]
};
function itemsFor(r){
 if(CATALOG[r.serviceKey]) return CATALOG[r.serviceKey];
 if(["llc-reinstatement","dba-registration","sole-proprietorship","foreign-qualification","dissolution","certificate-of-good-standing","operating-agreement"].includes(r.serviceKey)) return FALLBACK.formation;
 if(["owner-operators","scac-code","dot-consortium","driver-file","process-agents-boc-3","trucker-insurance-quote","hazmat-registration","new-entrant-audit","mcs-150-update","boc-3-amendment","dot-permits","ifta-registration","ifta-quarterly-returns","heavy-use-tax-2290"].includes(r.serviceKey)) return FALLBACK.carrier;
 return FALLBACK.general;
}
window.F4U_ADDON_PRICE_MAP={"registered-agent":75,"annual-compliance":99,"operating-agreement":89,"ein-service":75,"good-standing":45,"boc3-filing":75,"safety-audit-prep":149};
window.F4U_ADDON_CATALOG={};
[...Object.values(CATALOG),...Object.values(FALLBACK)].flat().forEach(([id,name,price,desc])=>{window.F4U_ADDON_CATALOG[id]={id,name,price:Number(price||0),description:desc};if(!(id in window.F4U_ADDON_PRICE_MAP))window.F4U_ADDON_PRICE_MAP[id]=Number(price||0);});

window.renderWizardStep4=function(){
 const host=document.getElementById("step-4-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute(),items=itemsFor(r),serviceFee=Number(r.service?.[r.planKey]||0);
 host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 4 · Recommended Services</span><h2>Recommended Services</h2><p>These recommendations are based on the service you selected. Nothing is added unless you choose it.</p></div><div class="f4u-upsell-grid">${items.map(([id,name,price,desc])=>`<label class="f4u-upsell-card"><span class="f4u-upsell-card__copy"><strong>${w.esc(name)}</strong><small>${w.esc(desc)}</small><b>${price?w.money(price):"Quote request · $0 today"}</b></span><span class="f4u-upsell-card__control"><input type="checkbox" class="f4u-addon-check" value="${id}" ${w.state.addons.includes(id)?"checked":""}><i></i></span></label>`).join("")}</div><div class="f4u-upsell-live-total"><div class="f4u-upsell-live-total__row"><span>${w.esc(r.service?.name||w.title(r.serviceKey))} — ${w.esc(w.title(r.planKey))}</span><strong>${w.money(serviceFee)}</strong></div><div class="f4u-upsell-live-total__row"><span>Selected add-ons</span><strong id="step4-addons-total">${w.money(0)}</strong></div><div class="f4u-upsell-live-total__row is-total"><span>Current order total</span><strong id="step4-order-total">${w.money(serviceFee)}</strong></div></div><div class="wizard-action-footer"><button id="step4-back" type="button" class="btn-wizard-secondary">← Back to Application</button><button id="step4-next" type="button" class="btn-wizard-main">Continue to Power of Attorney</button></div></section>`;
 function recalc(){
   w.state.addons=[...document.querySelectorAll(".f4u-addon-check:checked")].map(x=>x.value);
   const addons=w.state.addons.reduce((sum,id)=>sum+Number(window.F4U_ADDON_PRICE_MAP[id]||0),0);
   const total=serviceFee+addons;
   const a=document.getElementById("step4-addons-total"),t=document.getElementById("step4-order-total");
   if(a)a.textContent=w.money(addons); if(t)t.textContent=w.money(total);
   w.persist();
 }
 document.querySelectorAll(".f4u-addon-check").forEach(b=>b.addEventListener("change",recalc));
 recalc();
 document.getElementById("step4-back")?.addEventListener("click",()=>w.go(3));
 document.getElementById("step4-next")?.addEventListener("click",()=>w.go(5));
};
})();
