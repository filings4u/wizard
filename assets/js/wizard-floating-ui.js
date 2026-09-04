
(function(){
  "use strict";

  const stepTitles = {
    1:"Getting started",
    2:"Package Review",
    3:"Business Information",
    4:"Add-ons",
    5:"Authorization",
    6:"Review",
    7:"Secure Checkout",
    8:"Success & Account Setup"
  };

  function visualStep(){
    if (typeof window.f4uVisualStepForInternal === "function") {
      return window.f4uVisualStepForInternal(window.currentWizardActiveStep || 0);
    }
    const internal = parseInt(window.currentWizardActiveStep || 0,10);
    if (internal <= 0) return 1;
    if (internal >= 7) return 8;
    return internal + 1;
  }

  function updateProgress(){
    const step = visualStep();
    const percent = Math.round((step / 8) * 100);

    const stepText = document.getElementById("wizard-progress-step-text");
    const title = document.getElementById("wizard-progress-title");
    const pct = document.getElementById("wizard-progress-percent");
    const meter = document.getElementById("wizard-progress-meter");
    const floatingLabel = document.getElementById("wizard-floating-step-label");

    if (stepText) stepText.textContent = `Step ${step} of 8`;
    if (title) title.textContent = stepTitles[step] || "Filing application";
    if (pct) pct.textContent = `${percent}%`;
    if (meter) meter.style.width = `${percent}%`;
    if (floatingLabel) floatingLabel.textContent = `Step ${step} of 8`;

    if (typeof window.updateApplicationMapTimelineBubbles === "function") {
      window.updateApplicationMapTimelineBubbles(window.currentWizardActiveStep || 0);
    }
  }

  window.openFloatingApplicationMap = function(){
    const panel = document.getElementById("f4u-floating-map-panel");
    const btn = document.getElementById("f4u-application-map-toggle");
    if (!panel) return;
    if (typeof window.renderDynamicWizardApplicationMap === "function") {
      window.renderDynamicWizardApplicationMap();
    }
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden","false");
    if (btn) btn.setAttribute("aria-expanded","true");
  };

  window.closeFloatingApplicationMap = function(){
    const panel = document.getElementById("f4u-floating-map-panel");
    const btn = document.getElementById("f4u-application-map-toggle");
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden","true");
    if (btn) btn.setAttribute("aria-expanded","false");
  };

  function toggleMap(){
    const panel = document.getElementById("f4u-floating-map-panel");
    if (!panel) return;
    if (panel.classList.contains("is-open")) {
      window.closeFloatingApplicationMap();
    } else {
      window.openFloatingApplicationMap();
    }
  }

  function renumberVisibleHeadings(){
    const internal = parseInt(window.currentWizardActiveStep || 0,10);
    const visual = visualStep();
    const active = document.querySelector(".wizard-panel.active");
    if (!active) return;

    const headings = active.querySelectorAll("h1,h2,h3");
    headings.forEach((heading, index) => {
      if (index > 1) return;
      const text = (heading.textContent || "").trim();
      if (!text) return;

      // Replace only a leading step number when one exists.
      if (/^\d+\./.test(text)) {
        heading.textContent = text.replace(/^\d+\./, visual + ".");
      }
    });

    // The static package panel used to say "1. Your Selection Overview".
    if (internal === 1) {
      const h = active.querySelector(".step-main-title");
      if (h) h.textContent = "2. Package Review";
      const p = active.querySelector(".step-subtitle");
      if (p) p.textContent = "Review your selected package, service level, and included features.";
    }
  }

  // Wrap the existing view switch without touching its business logic.
  const originalSwitch = window.switchWizardActiveViewLayout;
  if (typeof originalSwitch === "function") {
    window.switchWizardActiveViewLayout = function(target){
      const result = originalSwitch.apply(this, arguments);
      setTimeout(function(){
        updateProgress();
        renumberVisibleHeadings();
        if (typeof window.renderDynamicWizardApplicationMap === "function") {
          window.renderDynamicWizardApplicationMap();
        }
        window.scrollTo({top:0,behavior:"smooth"});
      }, 40);
      return result;
    };
  }

  document.addEventListener("DOMContentLoaded", function(){
    const mapButton = document.getElementById("f4u-application-map-toggle");
    if (mapButton) mapButton.addEventListener("click", toggleMap);

    // Save Progress is intentionally a guest tool, not a logout/sign-out action.
    const saveButton = document.getElementById("sidebarFallbackLogoutBtn");
    if (saveButton && typeof window.displaySaveProgressModalInterface === "function") {
      saveButton.addEventListener("click", window.displaySaveProgressModalInterface);
    }

    // Back button should return to the selected service page where possible.
    const params = new URLSearchParams(location.search);
    const service = String(params.get("service") || "").toLowerCase();
    const back = document.querySelector(".wizard-shell-topbar__back");
    if (back && service) {
      back.href = `${service}.html#pricing`;
      back.textContent = "← Back to service";
    }

    updateProgress();
    renumberVisibleHeadings();

    // Keep Package Review hidden while the entry gate is visible.
    const panel0 = document.getElementById("step-panel-0");
    const panel1 = document.getElementById("step-panel-1");
    if (panel0 && panel0.style.display !== "none" && panel1) {
      panel1.classList.remove("active");
      panel1.style.setProperty("display","none","important");
    }

    document.addEventListener("click", function(event){
      const panel = document.getElementById("f4u-floating-map-panel");
      const button = document.getElementById("f4u-application-map-toggle");
      if (!panel || !panel.classList.contains("is-open")) return;
      if (panel.contains(event.target) || (button && button.contains(event.target))) return;
      window.closeFloatingApplicationMap();
    });
  });

  // Dynamic step scripts inject headings after load; keep their visible numbers aligned.
  const mutation = new MutationObserver(function(){
    renumberVisibleHeadings();
  });

  if (document.body) {
    mutation.observe(document.body,{childList:true,subtree:true});
  }
})();
