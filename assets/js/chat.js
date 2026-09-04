/**
 * filings4u wizard chat compatibility loader
 * Loads the existing branded wizard chat widget without blocking wizard boot.
 */
(function () {
  "use strict";

  if (document.querySelector('script[data-f4u-chat-widget]')) return;

  const script = document.createElement("script");
  script.src = "assets/js/wizard-chat-widget.js";
  script.async = true;
  script.dataset.f4uChatWidget = "1";
  script.onerror = function () {
    console.warn("[filings4u] Chat widget did not load; wizard remains available.");
  };
  document.head.appendChild(script);
})();
