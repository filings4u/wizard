/**
 * filings4u wizard UI compatibility layer
 * The active shell is already rendered by wizard.html.
 * This file intentionally stays lightweight and never replaces that shell.
 */
(function () {
  "use strict";

  document.addEventListener("f4u:wizard-step-change", function (event) {
    const step = Number(event.detail?.step || 1);

    document.querySelectorAll("[data-map-step], .toc-step").forEach((node, index) => {
      const nodeStep = Number(node.dataset?.mapStep || index + 1);
      node.classList.toggle("active", nodeStep === step);
      node.classList.toggle("complete", nodeStep < step);
    });
  });
})();
