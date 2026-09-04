
(function(){
  "use strict";

  function isGovernmentFlow(){
    const params = new URLSearchParams(location.search);
    const serviceKey = String(params.get("service") || "").toLowerCase();
    const service = (window.CENTRAL_SERVICE_PLAN_DB || {})[serviceKey];
    return !!(service && (service.requiresJurisdiction === false || service.serviceType === "government"));
  }

  function visualStepForInternal(internalStep){
    const n = Number.isFinite(Number(internalStep)) ? Number(internalStep) : 0;
    if (n <= 0) return 1;
    if (n >= 7) return 8;
    return n + 1;
  }

  function getSteps(){
    const government = isGovernmentFlow();
    return [
      {
        step:1,
        title:government ? "Government Service" : "Jurisdiction",
        desc:government ? "Confirm selected filing" : "Select filing state"
      },
      {step:2,title:"Package Review",desc:"Review package and inclusions"},
      {step:3,title:"Business Information",desc:"Business and contact details"},
      {step:4,title:"Add-ons",desc:"Optional compliance services"},
      {step:5,title:"Authorization",desc:"Review and authorize filing"},
      {step:6,title:"Review",desc:"Confirm order details"},
      {step:7,title:"Secure Checkout",desc:"Encrypted Stripe payment"},
      {step:8,title:"Success & Account Setup",desc:"Receipt and client account"}
    ];
  }

  window.renderDynamicWizardApplicationMap = function(){
    const root = document.getElementById("wizard-sidebar-application-map-target");
    if (!root) return;

    const currentVisual = visualStepForInternal(window.currentWizardActiveStep || 0);
    const steps = getSteps();

    root.innerHTML = `
      <div class="floating-map-card">
        <div class="floating-map-card__head">
          <div>
            <span>Filing progress</span>
            <h3>Application Map</h3>
          </div>
          <button type="button" id="f4u-floating-map-close" aria-label="Close application map">×</button>
        </div>

        <div class="floating-map-card__steps">
          ${steps.map(item => `
            <div class="floating-map-step ${item.step < currentVisual ? "is-complete" : ""} ${item.step === currentVisual ? "is-active" : ""}" data-visual-step="${item.step}">
              <span class="floating-map-step__number">${item.step < currentVisual ? "✓" : item.step}</span>
              <span class="floating-map-step__copy">
                <strong>${item.title}</strong>
                <small>${item.desc}</small>
              </span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    const close = document.getElementById("f4u-floating-map-close");
    if (close) {
      close.addEventListener("click", function(){
        if (typeof window.closeFloatingApplicationMap === "function") {
          window.closeFloatingApplicationMap();
        }
      });
    }
  };

  window.updateApplicationMapTimelineBubbles = function(internalStep){
    const visual = visualStepForInternal(internalStep);
    document.querySelectorAll(".floating-map-step").forEach(row => {
      const step = parseInt(row.dataset.visualStep || "0", 10);
      row.classList.toggle("is-active", step === visual);
      row.classList.toggle("is-complete", step < visual);
      const number = row.querySelector(".floating-map-step__number");
      if (number) number.textContent = step < visual ? "✓" : String(step);
    });
  };

  window.f4uVisualStepForInternal = visualStepForInternal;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.renderDynamicWizardApplicationMap);
  } else {
    window.renderDynamicWizardApplicationMap();
  }
})();
