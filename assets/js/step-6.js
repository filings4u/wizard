(function(){
"use strict";
const FEE_FIELD={"llc-formation":"llc","series-llc":"series_llc","corporations":"c_corp","corporation":"c_corp","nonprofits":"non_profit","nonprofit-organization":"non_profit"};
function governmentFeeFor(w,r){
 if(r.government||!r.jurisdiction)return 0;
 const field=FEE_FIELD[r.serviceKey];if(!field)return 0;
 const code=w.stateCode(r.jurisdiction);const row=(window.STATE_FILING_FEES||{})[code];
 return Number(row?.[field]||0);
}
window.renderWizardStep6=function(){
 const host=document.getElementById("step-6-injection-placeholder");if(!host)return;
 const w=window.F4UWizard,r=w.refreshRoute(),serviceFee=Number(r.service?.[r.planKey]||0),priceMap=window.F4U_ADDON_PRICE_MAP||{},addonCatalog=window.F4U_ADDON_CATALOG||{};
 const validAddons=[...new Set((w.state.addons||[]).filter(id=>Object.prototype.hasOwnProperty.call(addonCatalog,id)))];
 w.state.addons=validAddons;w.persist();
 const addonsTotal=validAddons.reduce((s,id)=>s+Number(addonCatalog[id]?.price??priceMap[id]??0),0);
 const governmentFee=governmentFeeFor(w,r);
 const total=serviceFee+addonsTotal+governmentFee,a=w.state.authorization||{};
 window.currentOrderCorePayload=Object.assign(window.currentOrderCorePayload||{},{service_key:r.serviceKey,plan_tier:r.planKey,jurisdiction_state:r.government?null:(w.stateCode(r.jurisdiction)||null),jurisdiction_name:r.jurisdiction||null,service_fee:serviceFee,government_fee:governmentFee,addons_total:addonsTotal,total_amount:total,currency:"USD",upsells:[...validAddons],form_payload:{...(window.currentOrderCorePayload?.form_payload||{}),service_answers:{...w.state.answers},authorization:{...a}}});
 const answerCount=Object.values(w.state.answers||{}).filter(v=>v!==""&&v!==false&&v!=null).length;
 const addonRows=validAddons.map(id=>{const item=addonCatalog[id]||{name:w.title(id),price:Number(priceMap[id]||0)};return `<div class="f4u-summary-line"><span>${w.esc(item.name)}</span><strong>${w.money(Number(item.price||0))}</strong></div>`}).join("");
 host.innerHTML=`<section class="f4u-entry-layout"><div class="f4u-entry-copy"><span class="f4u-entry-kicker">Step 6 · Application Summary</span><h2>Review & Confirm</h2><p>Confirm the filing, authorization, and complete estimated amount before secure checkout.</p></div><div class="f4u-summary-grid"><article><span>Service</span><strong>${w.esc(r.service?.name||w.title(r.serviceKey))}</strong><small>${w.esc(w.title(r.planKey))} package</small></article><article><span>${r.government?"Filing authority":"Jurisdiction"}</span><strong>${r.government?"Federal / Government":w.esc(r.jurisdiction)}</strong><small>${r.government?"No state jurisdiction step required":"Selected filing state"}</small></article><article><span>Application</span><strong>${answerCount} responses</strong><small>Service-specific intake captured</small></article><article><span>Power of Attorney</span><strong>${w.esc(a.signer_name||"Not signed")}</strong><small>${a.executed_at?`Signed ${w.esc(new Date(a.executed_at).toLocaleString())}`:"Signature required"}</small></article></div><div class="f4u-price-summary"><div><span>${w.esc(r.service?.name||w.title(r.serviceKey))} — ${w.esc(w.title(r.planKey))}</span><strong>${w.money(serviceFee)}</strong></div>${addonRows}${governmentFee>0?`<div class="f4u-summary-line"><span>${w.esc(r.jurisdiction)} government filing fee</span><strong>${w.money(governmentFee)}</strong></div>`:""}<div class="f4u-invoice-total"><span>Total price</span><strong>${w.money(total)}</strong></div><small>${r.government?"Any agency fee not configured in the pricing registry is validated before payment.":governmentFee>0?"The applicable state filing fee shown above is included in this estimate and is revalidated by secure checkout.":"If this service requires a government fee that is not configured in the pricing registry, secure checkout validates it before payment."}</small></div><div class="wizard-action-footer"><button id="step6-back" type="button" class="btn-wizard-secondary">← Back to Power of Attorney</button><button id="step6-next" type="button" class="btn-wizard-main">Continue to Secure Checkout</button></div></section>`;
 document.getElementById("step6-back")?.addEventListener("click",()=>w.go(5));document.getElementById("step6-next")?.addEventListener("click",()=>w.go(7));
};
})();
