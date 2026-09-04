
(function(){
  "use strict";

  const params = new URLSearchParams(location.search);
  const serviceKey = String(params.get("service") || "").toLowerCase();
  const planKey = String(params.get("plan") || "").toLowerCase();
  const registry = window.CENTRAL_SERVICE_PLAN_DB || {};
  const service = registry[serviceKey];
  if (!service) return;

  const government = service.requiresJurisdiction === false || service.serviceType === "government";
  const price = Number(service[planKey] || 0);
  const planName = planKey ? planKey.charAt(0).toUpperCase()+planKey.slice(1) : "";

  const context = document.createElement("div");
  context.className = "wizard-order-context";
  context.innerHTML = `
    <div>
      <span>Current filing</span>
      <strong>${service.name}</strong>
    </div>
    <div>
      <span>Package</span>
      <strong>${planName} · $${price.toFixed(2)}</strong>
    </div>
    <a href="${serviceKey}.html#pricing">Change package</a>
  `;

  const wrapper = document.querySelector(".wizard-container-wrapper");
  if (wrapper) wrapper.insertBefore(context, wrapper.firstChild);

  function updateMap(){
    const titles = Array.from(document.querySelectorAll(".toc-step-title"));
    const descriptions = Array.from(document.querySelectorAll(".toc-step-desc"));
    if (!titles.length) return;

    if (government) {
      titles[0].textContent = "Government Service";
      if (descriptions[0]) descriptions[0].textContent = service.name;
    } else {
      titles[0].textContent = "Jurisdiction";
      if (descriptions[0]) descriptions[0].textContent = "Select filing state";
    }

    const desired = [
      null,
      "Package Review",
      "Business Information",
      "Add-ons",
      "Authorization",
      "Review",
      "Secure Checkout",
      "Success & Account Setup"
    ];
    desired.forEach((label, i) => {
      if (label && titles[i]) titles[i].textContent = label;
    });
  }

  updateMap();
  const observer = new MutationObserver(updateMap);
  observer.observe(document.body,{childList:true,subtree:true});

  // The legal footer should not float in the working canvas.
  const footer = document.getElementById("wizard-footer-injection-target");
  if (footer) footer.style.display = "none";
})();
