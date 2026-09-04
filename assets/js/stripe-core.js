(function() { 
"use strict"; 

const urlParamsMatrix = new URLSearchParams(window.location.search); 

// Isolate and control Stripe context parameters globally 
window.stripePublicKey = window.stripePublicKey || urlParamsMatrix.get('pk') || null; 
window.stripeClientSecret = window.stripeClientSecret || null; 
window.stripeElementsContainer = window.stripeElementsContainer || null; 
window.stripePaymentElementInstance = window.stripePaymentElementInstance || null; 

// Safe session storage tracking framework for Stripe metadata parsing 
try { 
    const storedState = JSON.parse(localStorage.getItem("f4u_wizard_onboarding_state") || "{}"); 
    let cachedSecret = storedState.stripeClientSecret || storedState.clientSecret || null; 

    if (cachedSecret && typeof cachedSecret === 'string') { 
        cachedSecret = cachedSecret.trim().replace(/"/g, ""); 
        
        // ðŸš€ THE CRITICAL PARSER PATATION LAYER: 
        // Wipes out corrupted trailing string loops inherited from old sandbox sessions 
        if (cachedSecret.startsWith('cs_test_') || cachedSecret.startsWith('cs_live_')) { 
            const parts = cachedSecret.split('_secret_'); 
            if (parts.length > 2) { 
                cachedSecret = `${parts[0]}_secret_${parts[1]}`; 
            } 
        } 
        window.stripeClientSecret = cachedSecret; 
        console.log("âœ… [Stripe Matrix Core] Cleaned authorization state restored from caches."); 
    } 

    // ðŸŽ¯ THE PIPELINE HANDSHAKE FIX: Force sync straight into exact public.orders table keys
    if (storedState.first_name) { 
        localStorage.setItem("first_name", storedState.first_name); 
    } 
    if (storedState.last_name) { 
        localStorage.setItem("last_name", storedState.last_name); 
    } 
    if (storedState.email_address) { 
        localStorage.setItem("email_address", storedState.email_address); 
    }
    if (storedState.phone_number) { 
        localStorage.setItem("phone_number", storedState.phone_number); 
    } 
} catch (paymentCacheErr) { 
    console.warn("[Stripe Matrix Core] Local storage state reading restricted:", paymentCacheErr); 
} 
})();


(function() { 
"use strict"; 

function handleStripeSessionRecovery() { 
    console.log("[Stripe Recovery Channel] Synchronizing active dashboard session back to Step 6 payment gateway viewports."); 

    if (typeof window.forceStep6StripePaymentGatewayRefreshPass === "function") { 
        window.forceStep6StripePaymentGatewayRefreshPass(window.stripeClientSecret); 
    } else if (typeof window.initializeFlatStripeCheckoutElement === "function") { 
        // FIX: Replaced parameter injection with clean parameterless execution to prevent compiler thread breaks
        window.initializeFlatStripeCheckoutElement(); 
    } else { 
        console.warn("[Stripe Recovery Channel] Checkout layout initialization modules are unpopulated."); 
    } 
} 

window.onStripeSessionRecoveryTrigger = handleStripeSessionRecovery; 
})();


(function() { 
"use strict"; 

function verifyLayoutRewritePermissions(flagKey) { 
    const currentActiveWizardStep = parseInt(window.currentWizardActiveStep, 10) || 0; 
    const step6Panel = document.getElementById('step-panel-6'); 
    const isStep6Visible = step6Panel && (step6Panel.classList.contains('active') || step6Panel.style.display !== 'none'); 

    // Check if the Stripe iframe form has actually mounted to the DOM yet
    const stripeElementIsMounted = !!document.getElementById("stripe-payment-element-mount-point")?.querySelector('iframe');

    // FIX: Only suppress rewrites if we are on Step 6 AND Stripe has already finished rendering its form.
    // This allows the initial layout assembler to safely draw your wizard buttons.
    if ((currentActiveWizardStep === 6 || isStep6Visible) && stripeElementIsMounted) { 
        console.log(`[Stripe Shield] Suppressed compilation DOM rewrite for flag "${flagKey}" on payment canvas to protect Stripe Elements.`); 
        return true; 
    } 

    return false; 
} 

window.shouldSuppressCompilationLayoutRewrites = verifyLayoutRewritePermissions; 
})();


(function() { 
"use strict"; 

function isStripeFieldInstance(element) { 
    if (!element) return false; 

    const elementId = element.id || ""; 
    
    // Check for explicit card or payment element IDs matching Stripe's infrastructure
    const hasStripeId = /card-element|payment-element/i.test(elementId); 

    // FIX: Removed the broad '[class*="Stripe"]' wildcard string lookup constraint.
    // This allows custom form containers to execute normal input lookups and click loops cleanly.
    return !!( 
        element.closest('.StripeElement') || 
        element.closest('.__PrivateStripeElement') || 
        element.classList.contains('StripeElement') || 
        hasStripeId
    ); 
} 

window.checkIsProtectedExternalField = isStripeFieldInstance; 
})();

// ============================================================================
// FILE: stripe-core.js - HANDSHAKE ORCHESTRATION PIPELINE (REPAIRED)
// MODULE: SUPABASE EDGE FUNCTION DYNAMIC INTERLOCK GATEWAY
// ============================================================================
(function() {
  "use strict";

  async function processCheckoutHandshake() {
    // FIXED EXPRESSION COUPLING: Safely extract the calculated runtime grand totals cleanly
    var computedTotalAmount = window.wizardCalculatedFinalTotalAmount || window.computedWizardGrandTotalAmount || 0;
    var targetAmountNum = parseFloat(computedTotalAmount) || 0;
    
    if (targetAmountNum <= 0) {
      targetAmountNum = 194.00; // Development sandbox baseline package cost safety fallback
    }

    const URLParamsTracker = new URLSearchParams(window.location.search);
    var uniqueTrackingToken = URLParamsTracker.get("token") || localStorage.getItem("tracking_number") || "";
    
    var dynamicCompanySelector = [
      "#ar_business_name", "#boc_legal_name", "#ba_legal_name", "#bins_legal_name", "#bl_applicant_name",
      "#cage_legal_name", "#cgs_company_name", "#clia_lab_name", "#corp_proposed_name", "#dba_proposed_name",
      "#dbe_legal_name", "#dot_con_legal_name", "#prm_legal_name", "#dqf_carrier_name", "#duns_legal_name",
      "#ein_applicant_name", "#fed_tax_legal_name", "#fq_proposed_name", "#fran_tax_legal_name", "#haz_legal_name",
      "#hut_legal_name", "#ifta_legal_name", "#ifta_rep_legal_name", "#llc_desired_name", "#rein_original_name",
      "#mcs_legal_name", "#mbe_legal_name", "#nea_legal_name", "#np_proposed_name", "#oa_company_name",
      "#pr_legal_name", "#ra_client_name", "#st_legal_name", "#scac_legal_name", "#sllc_proposed_name",
      "#sm_proposed_name", "#sp_proposed_name", "#ta_legal_name", "#ins_legal_name", "#wbe_legal_name"
    ].join(",");

    var companyNameInput = document.querySelector(dynamicCompanySelector);
    var companyName = (window.currentOrderCorePayload && window.currentOrderCorePayload.company_name) || localStorage.getItem("company_name") || (companyNameInput ? companyNameInput.value.trim() : "") || "Not Specified";
    
    var firstName = localStorage.getItem("first_name") || "";
    var lastName = localStorage.getItem("last_name") || "";
    var emailAddress = localStorage.getItem("email_address") || "";
    var phoneNumber = localStorage.getItem("phone_number") || "";
    var selectedPlan = localStorage.getItem("selected_plan") || "Standard Plan";
    var poaSignature = localStorage.getItem("poa_signature") || "";
    
    let flatUpsellsString = "None Selected";
    const cachedUpsells = localStorage.getItem("selected_upsells");
    
    if (cachedUpsells) {
      try {
        if (cachedUpsells.trim().startsWith("[")) {
          flatUpsellsString = JSON.parse(cachedUpsells).join(", ");
        } else {
          flatUpsellsString = cachedUpsells;
        }
      } catch (e) {
        flatUpsellsString = cachedUpsells;
      }
    }

    if (!companyName || companyName.trim() === "") {
      companyName = "Not Specified";
    }
    localStorage.setItem("company_name", companyName.trim());

    // 1. DYNAMIC API REQUEST ENVELOPE
    var edgeFunctionPayload = {
      tracking_number: uniqueTrackingToken.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email_address: emailAddress.trim().toLowerCase(),
      phone_number: phoneNumber.trim(),
      service_title: selectedPlan.trim(),
      selected_plan: selectedPlan.trim(),
      selected_upsells: flatUpsellsString,
      total_fee: targetAmountNum, // ✅ FIXED ENVELOPE PROPERTY VALUE NOMENCLATURE FOR INTEGRATION
      total_paid_amount: targetAmountNum,
      poa_signature: poaSignature.trim(),
      poa_execution_stamp: new Date().toISOString(),
      company_name: companyName.trim(),
      action_intent: "initialize_payment_intent",
      status: "initiated"
    };

    console.log("Dispatching secure operational payload to live Edge Function...");

    try {
      var responseStream = await fetch("https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/stripe-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(edgeFunctionPayload)
      });

      if (!responseStream.ok) {
        var serverFailureMessage = await responseStream.text();
        throw new Error("Supabase Edge Function Rejected Request: " + serverFailureMessage);
      }

      var transactionTokenPayload = await responseStream.json();
      var receivedSecretToken = transactionTokenPayload.clientSecret || transactionTokenPayload.client_secret;

      if (!receivedSecretToken) {
        throw new Error("Payload mapping error: clientSecret key is missing from Supabase response.");
      }

      var pristineSecret = String(receivedSecretToken).trim().replace(/"/g, "");
      window.stripeClientSecret = pristineSecret;
      window.stripePaymentIntentId = transactionTokenPayload.paymentIntentId || transactionTokenPayload.id;

      window.currentOrderCorePayload = {
        tracking_number: uniqueTrackingToken.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email_address: emailAddress.trim().toLowerCase(),
        phone_number: phoneNumber.trim(),
        selected_plan: selectedPlan.trim(),
        selected_upsells: flatUpsellsString,
        total_paid_amount: targetAmountNum,
        poa_signature: poaSignature.trim(),
        poa_execution_stamp: edgeFunctionPayload.poa_execution_stamp,
        company_name: companyName.trim(),
        stripe_payment_id: window.stripePaymentIntentId
      };

      var activeOnboardingState = JSON.parse(localStorage.getItem("f4u_wizard_onboarding_state") || "{}");
      activeOnboardingState.stripeClientSecret = pristineSecret;
      localStorage.setItem("f4u_wizard_onboarding_state", JSON.stringify(activeOnboardingState));
      
      console.log("[Handshake Envelope] Pristine Checkout Session token cached cleanly.");

      if (typeof window.initializeFlatStripeCheckoutElement === "function") {
        window.initializeFlatStripeCheckoutElement();
      }

      return transactionTokenPayload;
    } catch (handshakeFault) {
      console.error("[Handshake Fault]: ", handshakeFault.message);
      const errorBanner = document.getElementById("step6-error-banner-target");
      if (errorBanner) {
        errorBanner.style.display = "block";
        errorBanner.innerHTML = "Handshake Link Error: " + handshakeFault.message;
      }
      throw handshakeFault;
    }
  }

  window.executeStabaseCheckoutTransactionHandshake = processCheckoutHandshake;
})();



// ============================================================================
// FILE: stripe-core.js - VIEWPORT BREAKOUT REFLOW ADJUSTER (REPAIRED)
// MODULE: DYNAMIC LAYOUT SIZE MUTATION SETUPS
// ============================================================================
(function() {
  "use strict";

  function applyStep6DisplayReflowAdjustments(panelNode, targetStepInt) {
    if (!panelNode || targetStepInt !== 6) return;

    // Force layout container back to standard display block model
    panelNode.style.setProperty("display", "block", "important");
    panelNode.style.setProperty("opacity", "1", "important");
    panelNode.style.setProperty("visibility", "visible", "important");

    // ✅ FIXED: Removed the breaking intermediate semicolon here to repair the frame callback hook loop!
    requestAnimationFrame(function() {
      var forcedLayoutReflowMarker = panelNode.offsetHeight;
      console.log("[Stripe Core Reflow] Layout queue flushed for Step 6 iframe container nodes.");
    });
  }

  window.executeExternalVisibilityAdjustments = applyStep6DisplayReflowAdjustments;
})();


(function() { 
"use strict"; 

function handleStripeLifecycleHandoff() { 
    const stripePanelContainer = document.getElementById("step-panel-6"); 
    if (!stripePanelContainer) return; 

    stripePanelContainer.style.setProperty("display", "block", "important"); 
    stripePanelContainer.style.setProperty("opacity", "1", "important"); 
    stripePanelContainer.style.setProperty("visibility", "visible", "important"); 
    stripePanelContainer.classList.add("active"); 

    let initializationAttempts = 0; 
    const MAX_POLLING_ATTEMPTS = 20; 

    function attemptSecureIframeMount() { 
        if (typeof window.initializeFlatStripeCheckoutElement === "function") { 
            // FIX: Replaced deep nested loops with a clean single execution pass 
            requestAnimationFrame(() => { 
                console.log("âœ… [Stripe Core Shield] Viewport skinning verified. Mounting secure checkout iframe..."); 
                
                // FIX: Removed parameter injection inside the function execution line.
                // The step-6 orchestrator automatically scans memory tokens internally without parameter args.
                window.initializeFlatStripeCheckoutElement(); 
            }); 
        } else if (initializationAttempts < MAX_POLLING_ATTEMPTS) { 
            initializationAttempts++; 
            console.log(`ðŸ“¡ [Stripe Core Deferral] Core method unassigned. Scheduling initialization poll context: [Attempt ${initializationAttempts}/${MAX_POLLING_ATTEMPTS}]`); 
            setTimeout(attemptSecureIframeMount, 100); 
        } else { 
            console.error("âœ• [Stripe Lifecycle Interlock Error] Fatal: initializeFlatStripeCheckoutElement from step-6.js failed to resolve inside window context bounds."); 
        } 
    } 
    attemptSecureIframeMount(); 
} 

window.executeStripeLifecycleHandoffGate = handleStripeLifecycleHandoff; 
})();

(function() { 
"use strict"; 

function handleStripeDisplayRecovery(stepToLoad) { 
    if (stepToLoad !== 6) return; 

    const paymentPanel = document.getElementById("step-panel-6"); 
    if (paymentPanel) { 
        paymentPanel.style.setProperty("display", "block", "important"); 
        paymentPanel.style.setProperty("opacity", "1", "important"); 
        paymentPanel.style.setProperty("visibility", "visible", "important"); 
        paymentPanel.classList.add("active"); 
        
        console.log("[Stripe Core Gate] Secure checkout panel unhidden for active frame recovery pass."); 
    } 
} 

window.executeStripeDisplayRecoveryOverride = handleStripeDisplayRecovery; 
})();

(function() { 
"use strict"; 

function handleStripeBootOverride(activeStepIndex) { 
    if (activeStepIndex !== 6) return; 

    const paymentPanelNode = document.getElementById("step-panel-6"); 
    if (paymentPanelNode) { 
        paymentPanelNode.style.setProperty("display", "block", "important"); 
        paymentPanelNode.style.setProperty("opacity", "1", "important"); 
        paymentPanelNode.style.setProperty("visibility", "visible", "important"); 
        paymentPanelNode.classList.add("active"); 
        
        console.log("[Stripe Core Boot Guard] Pre-emptively adjusted layout variables for Step 6 container nodes."); 

        // FIX: Pre-emptively invoke your lifecycle gate to mount Stripe inputs on boot recovery 
        if (typeof window.executeStripeLifecycleHandoffGate === "function") { 
            window.executeStripeLifecycleHandoffGate(); 
        } 
    } 
} 

window.executeStripeBootOverrideGuard = handleStripeBootOverride; 
})();

