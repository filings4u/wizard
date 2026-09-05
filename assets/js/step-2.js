(function(){
"use strict";

function asArray(value){
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function unique(items){
  const seen=new Set();
  return items.filter(item=>{
    const key=String(item||"").trim().toLowerCase();
    if(!key||seen.has(key))return false;
    seen.add(key);
    return true;
  });
}

/**
 * Resolve the selected package directly from state-pricing.js /
 * government-pricing.js.
 *
 * Supported registry shapes:
 *   bullets: { starter:[], compliance:[], enterprise:[] }
 *   features: { starter:[], compliance:[], enterprise:[] }
 *   starterFeatures / complianceFeatures / enterpriseFeatures
 *   bullets: []    (legacy/single-list services)
 *
 * Compliance and Enterprise packages frequently say "Everything in Starter"
 * or "Everything in Compliance". We expand those inheritance markers into the
 * actual lower-tier bullets so Step 2 shows the customer every included item.
 */
function resolvePackageFeatures(service,planKey){
  if(!service)return[];

  const getTier=(tier)=>{
    if(service.bullets && !Array.isArray(service.bullets)){
      const list=asArray(service.bullets[tier]);
      if(list.length)return list;
    }
    if(service.features && !Array.isArray(service.features)){
      const list=asArray(service.features[tier]);
      if(list.length)return list;
    }
    const legacy=asArray(service[`${tier}Features`]);
    if(legacy.length)return legacy;
    return[];
  };

  const flatBullets=asArray(service.bullets);
  const flatFeatures=asArray(service.features);
  if(flatBullets.length && !getTier(planKey).length)return unique(flatBullets);
  if(flatFeatures.length && !getTier(planKey).length)return unique(flatFeatures);

  const starter=getTier("starter");
  const compliance=getTier("compliance");
  const enterprise=getTier("enterprise");

  const isInheritanceMarker=(text)=>/^\s*everything\s+in\s+(starter|compliance)/i.test(String(text||""));

  if(planKey==="starter"){
    return unique(starter);
  }

  if(planKey==="compliance"){
    return unique([
      ...starter,
      ...compliance.filter(item=>!isInheritanceMarker(item))
    ]);
  }

  if(planKey==="enterprise"){
    return unique([
      ...starter,
      ...compliance.filter(item=>!isInheritanceMarker(item)),
      ...enterprise.filter(item=>!isInheritanceMarker(item))
    ]);
  }

  return unique(getTier(planKey));
}

window.renderWizardStep2=function(){
  const host=document.getElementById("step-2-injection-placeholder");
  if(!host)return;

  const w=window.F4UWizard;
  const r=w.refreshRoute();

  if(!r.service)return w.go(1);
  if(!r.government&&!r.jurisdiction)return w.go(1);

  const price=Number(r.service[r.planKey]||0);
  const plan=w.title(r.planKey);
  const features=resolvePackageFeatures(r.service,r.planKey);

  const sourceLabel=r.government
    ?"Government service package"
    :"State filing package";

  host.innerHTML=`
    <section class="f4u-entry-layout f4u-package-review">
      <div class="f4u-entry-copy">
        <span class="f4u-entry-kicker">Step 2 · Package Review</span>
        <h2>${w.esc(r.service.name||w.title(r.serviceKey))}</h2>
        <p>Review everything included with the package you selected before continuing to the service application.</p>
      </div>

      <div class="f4u-selection-summary">
        <span>Selected package</span>
        <div>
          <strong>${w.esc(plan)}</strong>
          <strong class="f4u-package-price">${w.money(price)}</strong>
        </div>
      </div>

      <div class="f4u-review-meta">
        <span>
          <small>Service type</small>
          <strong>${w.esc(sourceLabel)}</strong>
        </span>
        <span>
          <small>${r.government?"Jurisdiction":"Filing jurisdiction"}</small>
          <strong>${r.government?"Federal / Government":w.esc(r.jurisdiction)}</strong>
        </span>
      </div>

      <div class="f4u-review-features">
        <div class="f4u-review-features__head">
          <div>
            <span class="f4u-review-label">What comes with this package</span>
            <p>All inclusions below are loaded from the pricing configuration for your selected ${w.esc(plan)} package.</p>
          </div>
          <span class="f4u-feature-count">${features.length} included</span>
        </div>

        ${features.length
          ? `<ul class="f4u-package-feature-list">
              ${features.map((item,index)=>`
                <li>
                  <i aria-hidden="true">✓</i>
                  <span>
                    <small>Included ${index+1}</small>
                    <strong>${w.esc(item)}</strong>
                  </span>
                </li>`).join("")}
            </ul>`
          : `<div class="f4u-package-feature-empty">
               <strong>Package details are not configured.</strong>
               <p>No inclusions were found for this package in the pricing registry.</p>
             </div>`
        }
      </div>

      <div class="f4u-review-pricing">
        <div class="f4u-review-fee-row">
          <span>filings4u service fee</span>
          <strong>${w.money(price)}</strong>
        </div>
        ${!r.government?`
          <div class="f4u-review-fee-note">
            Government filing fees are calculated from the selected state and shown separately in your order summary.
          </div>`:""}
      </div>

      <div class="wizard-action-footer">
        <button id="step2-back" type="button" class="btn-wizard-secondary">← Back</button>
        <button id="step2-next" type="button" class="btn-wizard-main">Continue to Service Form</button>
      </div>
    </section>`;

  document.getElementById("step2-back")?.addEventListener("click",()=>w.go(1));
  document.getElementById("step2-next")?.addEventListener("click",()=>w.go(3));
};

window.F4UResolvePackageFeatures=resolvePackageFeatures;
})();
