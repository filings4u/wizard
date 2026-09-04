// ============================================================================ // 
// ðŸ“Š 1. GLOBAL RUNTIME INITIALIZATION MATRIX (ISOLATED ORCHESTRATOR)           // 
// ============================================================================ // 
;(function() { 
"use strict"; 

const urlParamsMatrix = new URLSearchParams(window.location.search); 

// Ingest core route targets from address parameters cleanly 
window.currentServiceKey = urlParamsMatrix.get('service') || null; 
window.currentServicePathKey = window.currentServiceKey; 
window.currentPlanKey = urlParamsMatrix.get('plan') || null; 
window.currentServiceTier = window.currentPlanKey; 

// Extract jurisdiction code directly from parameters or state selectors 
let resolvedJurisdictionValue = urlParamsMatrix.get('state') || urlParamsMatrix.get('stateCode') || null; 
if (!resolvedJurisdictionValue) { 
    let stateDropdown = document.getElementById("wizard_gate_state_select") || document.getElementById("wizard_state_select") || document.getElementById("state_select"); 
    if (stateDropdown && stateDropdown.value && stateDropdown.value !== "") { 
        resolvedJurisdictionValue = stateDropdown.value; 
    } 
} 

// UNIVERSAL RUNTIME INTERLOCK FUNCTIONS 
window.checkIsFederalRouteTrackProgrammatic = function() { 
    const serviceKeyCheck = String(window.currentServiceKey || "").toLowerCase().trim(); 
    const federalPricingMatrixRegistry = window.FILINGS4U_GOVERNMENT_PRICING || {}; 
    return Object.prototype.hasOwnProperty.call(federalPricingMatrixRegistry, serviceKeyCheck) && serviceKeyCheck !== "llc-formation" && serviceKeyCheck !== "corporations"; 
}; 

if (window.checkIsFederalRouteTrackProgrammatic()) { 
    resolvedJurisdictionValue = null; 
} 

window.selectedJurisdiction = resolvedJurisdictionValue; 
window.dynamicAssetUrlPath = ""; 
window.collectedFormMetadata = {}; 
window.wizardCalculatedFinalTotalAmount = window.wizardCalculatedFinalTotalAmount || 0; 

// ===================================================================== // 
// ðŸ§¬ CENTRAL ADDON DB INTERCEPTOR ENGINE                                 // 
// ===================================================================== // 
let internalCatalogReference = null; 
Object.defineProperty(window, 'CENTRAL_ADDON_DB', { 
    get() { return internalCatalogReference; }, 
    set(newDatabasePayload) { 
        // Guard loop check to prevent deep recursive execution freezes 
        if (internalCatalogReference === newDatabasePayload) return; 
        internalCatalogReference = newDatabasePayload; 
        
        // Regenerate auxiliary array keys dynamically upon database updates 
        if (newDatabasePayload && typeof newDatabasePayload === 'object') { 
            window.auxiliaryAddonsArray = Object.keys(newDatabasePayload); 
        } else { 
            window.auxiliaryAddonsArray = []; 
        } 
        
        // Route template processing safely downstream 
        if (typeof window.executeStepThreeUpsellStreaming === "function") { 
            console.log("[Master Core] Asynchronous addon database arrived. Executing targeted marketplace stream pass..."); 
            window.executeStepThreeUpsellStreaming(); 
        } else if (typeof window.renderTargetUpsellsListPanel === "function") { 
            const marketplaceTarget = document.getElementById('wizard-dynamic-upsells-render-target') || document.getElementById('marketplace-upsells-target') || document.querySelector('.marketplace-panel-wrapper'); 
            if (marketplaceTarget && newDatabasePayload) { 
                window.renderTargetUpsellsListPanel(newDatabasePayload, marketplaceTarget); 
            } 
        } else { 
            console.log("[Data Matrix Delay] Addon payload cached. Standing by for step view layout activation."); 
        } 
    }, 
    configurable: true, 
    enumerable: true 
}); 

// Fallback initial evaluation check 
window.auxiliaryAddonsArray = window.CENTRAL_ADDON_DB && typeof window.CENTRAL_ADDON_DB === 'object' ? Object.keys(window.CENTRAL_ADDON_DB) : []; 
})();


// ============================================================================ //
// 📄 FILE: wizard-core.js                                                      //
// 🧲 MODULE: RUNTIME SESSION ISOLATION ENGINE & URL SANITIZER                  //
// ============================================================================ //
;(function() {
  "use strict";
  const cacheKeyNamespace = "f4u_wizard_onboarding_state";
  const urlParams = new URLSearchParams(window.location.search);

  // STEP 1: INSTANT SYNCHRONOUS MEMORY HYDRATION (REPAIRED: Safe LocalStorage fallback binding)
  const activeStepTracker = parseInt(window.currentWizardActiveStep || localStorage.getItem("f4u_active_wizard_step_index"), 10);
  const isActivelyProgressingInWizard = !isNaN(activeStepTracker) && activeStepTracker > 0;

  // Grab cached data keys instantly before running background network promises
  const cachedStateJurisdiction = localStorage.getItem('wizard_selected_state') || urlParams.get('state') || urlParams.get('stateCode') || null;
  if (isActivelyProgressingInWizard || cachedStateJurisdiction) {
    window.selectedJurisdiction = window.selectedJurisdiction || cachedStateJurisdiction;
  }

  // STEP 2: ASYNC DATABASE AUTHENTICATION RUNNER
  async function evaluateSupabaseAuthorizationGateway() {
    const supabase = window.supabaseClientInstance || (window.supabase ? window.supabase : null);
    let isAuthenticatedUserSession = false;
    
    if (supabase && typeof supabase.auth === "object") {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) isAuthenticatedUserSession = true;
      } catch(e) {
        isAuthenticatedUserSession = false;
      }
    }

    if (!isAuthenticatedUserSession) {
      if (!isActivelyProgressingInWizard) {
        console.log("[Session Engine] Public Guest Session Landing: Purging residual caching allocations.");
        localStorage.clear();
        sessionStorage.clear();
        if (window.collectedFormMetadata) {
          window.collectedFormMetadata = {};
        }
        window.selectedJurisdiction = null;
        localStorage.removeItem('wizard_selected_state');
        if (urlParams.has('state')) {
          urlParams.delete('state');
          const cleanUrlPath = `${window.location.pathname}?${urlParams.toString()}`;
          window.history.replaceState({ path: cleanUrlPath }, '', cleanUrlPath);
        }
      } else {
        console.log(`[Session Engine Guard] Active guest step context detected (Step ${activeStepTracker}). Retaining data keys.`);
        window.selectedJurisdiction = window.selectedJurisdiction || localStorage.getItem('wizard_selected_state') || urlParams.get('state') || null;
      }
    } else {
      console.log("[Session Engine] Persistent Authenticated Dashboard Vault Connection Active.");
      window.selectedJurisdiction = localStorage.getItem('wizard_selected_state') || urlParams.get('state') || null;

      // ===================================================================== //
      // DECOUPLED STRIPE RECOVERY HOOK INTERLOCK                              //
      // ===================================================================== //
      if (activeStepTracker === 6 && typeof window.onStripeSessionRecoveryTrigger === "function") {
        console.log("[Session Engine] Forwarding authenticated state data parameters to Stripe Core router...");
        window.onStripeSessionRecoveryTrigger();
      }
    }
  }

  // Execute background validation non-destructively
  evaluateSupabaseAuthorizationGateway();
})();


// ============================================================================ // 
// âš™ï¸ SYSTEM STATE FLOW & NAVIGATION TRACKING REGISTRY                           // 
// ============================================================================ // 
;(function initializeActiveStepState() { 
    const urlParamsMatrix = new URLSearchParams(window.location.search); 
    const activeStepParam = parseInt(urlParamsMatrix.get('step'), 10); 
    let resolvedStepValue = parseInt(window.currentWizardActiveStep, 10); 
    if (isNaN(resolvedStepValue)) { 
        resolvedStepValue = !isNaN(activeStepParam) ? activeStepParam : 0; 
    } 
    window.currentWizardActiveStep = resolvedStepValue; 
    window.totalWizardExpectedSteps = 8; 
    window.totalWizardSteps = 8; 
})(); 

// ============================================================================ // 
// ðŸ”Œ ACTIVE ADD-ON SERVICE STATE FLAGS (DECOUPLED AND SANITIZED)               // 
// ============================================================================ // 
;(function initializeDynamicStateFlags() { 
"use strict"; 

// Safeguard flag to prevent infinite loops inside your pricing compilation matrix 
let isProcessingCompilationLoop = false; 

// Helper to bind reactive property tracks to window keys dynamically 
function createReactiveFlag(flagKey) { 
    if (Object.getOwnPropertyDescriptor(window, flagKey)) return; 
    
    let internalStateValue = false; 
    Object.defineProperty(window, flagKey, { 
        get() { 
            const storageVal = localStorage.getItem(`wizard_field_${flagKey}`); 
            if (storageVal !== null) { 
                return storageVal === "true" || storageVal === "yes" || storageVal === true; 
            } 
            return internalStateValue; 
        }, 
        set(newBooleanState) { 
            const normalizedState = newBooleanState === true || newBooleanState === "yes" || String(newBooleanState) === "true"; 
            
            // Guard block: Only update and trigger calculator loops if the status is actually shifting 
            if (internalStateValue === normalizedState && localStorage.getItem(`wizard_field_${flagKey}`) === (normalizedState ? "true" : "false")) { 
                return; 
            } 
            internalStateValue = normalizedState; 
            localStorage.setItem(`wizard_field_${flagKey}`, normalizedState ? "true" : "false"); 
            
            // =====================================================================
            // DECOUPLED MOUNTING CONSTRAINTS PASS
            // =====================================================================
            // Checks external bridge function rules to ensure flag updates do not run 
            // layout alterations while sensitive canvases are mounting.
            if (typeof window.shouldSuppressCompilationLayoutRewrites === "function" && 
                window.shouldSuppressCompilationLayoutRewrites(flagKey)) { 
                return; 
            } 
            
            // Auto-trigger your calculator loop safely while blocking recursion loops for standard steps 
            if (typeof window.executeDynamicAddonCompilation === "function" && !isProcessingCompilationLoop) { 
                try { 
                    isProcessingCompilationLoop = true; 
                    window.executeDynamicAddonCompilation(); 
                } catch (err) { 
                    console.error("[Compilation Lock Failure] Failed to compile totals safely:", err); 
                } finally { 
                    isProcessingCompilationLoop = false; 
                } 
            } 
        }, 
        configurable: true, 
        enumerable: true 
    }); 
} 

/** 
 * ENTERPRISE INTERCEPT FIX: Define the map property with an active setter descriptor. 
 */ 
let internalPropertyMapPayload = window.UPSELLS_GLOBAL_STATE_PROPERTY_MAP || {}; 
Object.defineProperty(window, 'UPSELLS_GLOBAL_STATE_PROPERTY_MAP', { 
    get() { return internalPropertyMapPayload; }, 
    set(newMapData) { 
        if (newMapData && typeof newMapData === 'object') { 
            // Merge the configurations safely into our active instance tracker 
            Object.assign(internalPropertyMapPayload, newMapData); 
            // Loop and register all unique keys instantly upon asset file arrival 
            Object.values(newMapData).forEach(stateFlagKey => { 
                createReactiveFlag(stateFlagKey); 
            }); 
            console.log("[State Registry Success] Late-binding enterprise tracking tokens initialized successfully."); 
        } 
    }, 
    configurable: true, 
    enumerable: true 
}); 

// Automatically process baseline values in case object data mounted prematurely 
if (window.UPSELLS_GLOBAL_STATE_PROPERTY_MAP) { 
    Object.values(window.UPSELLS_GLOBAL_STATE_PROPERTY_MAP).forEach(stateFlagKey => { 
        createReactiveFlag(stateFlagKey); 
    }); 
} 

// Secondary specialized fallbacks 
const additionalCoreFlags = [ 
    "customSelectedRegisteredAgentServiceActive", 
    "customSelectedEinProcurementServiceActive", 
    "customSelectedScorpElectionServiceActive", 
    "customSelectedSolePropLicenseAuditServiceActive", 
    "customSelectedDbaLicenseAuditServiceActive", 
    "customSelectedNonprofitLicenseCheckActive", 
    "customSelectedDbaSearchServiceActive", 
    "customSelectedForeignQualLicenseSuiteActive", 
    "customSelectedExpeditedFilingServiceActive", 
    "customSelectedApostilleAuthenticationServiceActive", 
    "customSelectedGoodStandingCertificateServiceActive" 
]; 

additionalCoreFlags.forEach(fallbackFlagKey => { 
    createReactiveFlag(fallbackFlagKey); 
}); 

console.log("[State Registry] Global compliance tracking tokens dynamically initialized successfully via loop iteration."); 
})();


// ============================================================================ // 
// ðŸ—ƒï¸ MASTER STATE PROPERTY MAPPING & LEGACY REFERENCE DICTIONARIES            // 
// ============================================================================ // 

// --- BACKWARDS COMPATIBLE STEP 2 HARDCODED UPSELL RECORDS --- 
window.STEP_2_UPSELLS_REFERENCE = { 
    "assemble-dqf": { name: "Assemble Driver Qualification Files (DQF)", price: 79.00 }, 
    "drug-consortium": { name: "DOT Drug & Alcohol Consortium Enrollment", price: 149.00 }, 
    "hos-review": { name: "Hours of Service (HOS) Log Audit Pre-Review", price: 195.00 }, 
    "maintenance-ledger": { name: "Vehicle Maintenance Ledger & Inspection Set", price: 85.00 }, 
    "expert-consultation": { name: "Independent Pre-Audit Consultation Package", price: 250.00 } 
}; 

// Global Configuration Property State Keys Registry Map 
const baselinePropertyMapPayload = { 
    // ðŸ¢ HARMONIZED STEP 2 TRACKING EXTENSIONS 
    "assemble-dqf": "customSelectedDqfServiceActive", 
    "drug-consortium": "customSelectedDrugConsortiumActive", 
    "hos-review": "customSelectedHosReviewActive", 
    "maintenance-ledger": "customSelectedMaintenanceActive", 
    "expert-consultation": "customSelectedExpertConsultationActive", 
    
    // Standard Compliance & Layout Map Flags 
    "corporate-veil-lock": "customSelectedCorporateVeilLockActive", 
    "hazmat-liability-shield": "customSelectedHazmatLiabilityShieldActive", 
    "cargo-indemnity-audit": "customSelectedCargoIndemnityAuditActive", 
    "regulatory-defense-retainer": "customSelectedRegulatoryDefenseRetainerActive", 
    "unified-carrier-reg-shield": "customSelectedUcrShieldActive", 
    "biennial-update-lock": "customSelectedBiennialLockActive", 
    "driver-monitoring-feed": "customSelectedMvrMonitoringActive", 
    "process-agent-boc3": "customSelectedBoc3Active", 
    "scac-alpha-code": "customSelectedScacActive", 
    "ifr-tax-account-setup": "customSelectedIftaActive", 
    "kyu-weight-distance": "customSelectedKyuActive", 
    "ny-hut-permit": "customSelectedHutActive", 
    "nm-wdt-permit": "customSelectedWdtActive", 
    "or-weight-receipt": "customSelectedOregonActive", 
    "ein-tax-id-expedite": "customSelectedEinActive", 
    "llc-operating-agreement": "customSelectedOperatingAgreementActive", 
    "s-corp-election-filing": "customSelectedSCorpActive", 
    "corp-by-laws-package": "customSelectedByLawsActive", 
    "registered-agent-year": "customSelectedAgentActive", 
    "dun-bradstreet-setup": "customSelectedDnbActive", 
    "trademark-name-lock": "customSelectedTrademarkActive" 
}; 

// SAFE ASYNC ASSIGNMENT INTERLOCK: 
function processPayloadBinding() { 
    const descriptor = Object.getOwnPropertyDescriptor(window, 'UPSELLS_GLOBAL_STATE_PROPERTY_MAP'); 
    if (descriptor && typeof descriptor.set === 'function') { 
        console.log("[Data Map Asset] Core interceptor ready. Binding payload mapping properties to setup macros."); 
        window.UPSELLS_GLOBAL_STATE_PROPERTY_MAP = baselinePropertyMapPayload; 
    } else { 
        console.log("[Data Map Asset] Core interceptor uninstantiated. Delaying loop evaluation binding pass..."); 
        window.UPSELLS_GLOBAL_STATE_PROPERTY_MAP = Object.assign(window.UPSELLS_GLOBAL_STATE_PROPERTY_MAP || {}, baselinePropertyMapPayload); 
        
        // Polling retry check: If Block 4 comes in late, catch it when it attaches to the window scope 
        let retryCounter = 0; 
        const fallbackTrackingInterval = setInterval(() => { 
            retryCounter++; 
            const postDescriptor = Object.getOwnPropertyDescriptor(window, 'UPSELLS_GLOBAL_STATE_PROPERTY_MAP'); 
            if (postDescriptor && typeof postDescriptor.set === 'function') { 
                window.UPSELLS_GLOBAL_STATE_PROPERTY_MAP = baselinePropertyMapPayload; 
                clearInterval(fallbackTrackingInterval); 
            } 
            if (retryCounter >= 20) clearInterval(fallbackTrackingInterval); // Cap search cycle at 1 second 
        }, 50); 
    } 
} 
processPayloadBinding(); 

// ============================================================================ // 
// ðŸ—ƒï¸ USA STATES DICTIONARY CONFIGURATION ARRAY MATRIX                          // 
// ============================================================================ // 
window.USA_STATES_DICTIONARY = [ 
    { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" }, 
    { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" }, 
    { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" }, 
    { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" }, 
    { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" }, 
    { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" }, 
    { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" }, 
    { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" }, 
    { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" }, 
    { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" }, 
    { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" }, 
    { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" }, 
    { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" }, 
    { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" }, 
    { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" }, 
    { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" }, 
    { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" } 
];

// ============================================================================ // 
// ðŸ› ï¸ DYNAMIC MARKUP TEMPLATE UTILITIES (ZERO-HARDCODE SELECTION BUILDER)       // 
// ============================================================================ // 
/** 
 * Programmatically compiles drop-down list option rows from your dictionary arrays matrix. 
 * @param {string} selectedCode - Two-character state value parameter to mark as selected. 
 * @returns {string} Fully compiled inner HTML option block row text strings. 
 */ 
window.buildGlobalUsaStateDropdownOptionsHtml = function(selectedCode) { 
    let optionsHtml = '<option value="">-- Choose Option State --</option>'; 
    const activeMatchCode = String(selectedCode || "").toUpperCase().trim(); 
    window.USA_STATES_DICTIONARY.forEach(state => { 
        const isMatched = (state.code === activeMatchCode); 
        optionsHtml += `<option value="${state.code}" ${isMatched ? 'selected' : ''}>${state.name}</option>`; 
    }); 
    return optionsHtml; 
}; 

// Re-expose standard alias mapping keys to maximize cross-file layout compilation checks 
window.getUsaStatesHtml = window.buildGlobalUsaStateDropdownOptionsHtml; 
window.globalStateDropdownOptionsHtml = window.buildGlobalUsaStateDropdownOptionsHtml(""); 

// ============================================================================ //
// 📄 FILE: wizard-core.js                                                      //
// 🧲 MODULE: UNIVERSAL STEP VALIDATION MATRIX ENGINE                          //
// ============================================================================ //
/**
 * Universal dynamic validation engine (Decoupled & Protected).
 * Validates formatting parameters per step and manages browser native validation messages.
 */
function validateStepInputParametersVanilla(activeStep) {
  console.log(`[Validator Engine] Scanning inputs inside step panel ${activeStep}...`);

  const stepIdx = parseInt(activeStep, 10);

  // Hard bypass: Let the dedicated POA matrix handle Step 4 evaluation completely
  if (stepIdx === 4) {
    if (typeof window.evaluatePoaInputStateMatrix === "function") {
      return window.evaluatePoaInputStateMatrix();
    }
    return true;
  }

  // ✅ STEP 8 PASS-THROUGH GUARD: Dynamic receipt screen requires no form validation queries
  if (stepIdx === 8) {
    console.log("[Validator Engine] Step 8 is a final print confirmation screen view. Automatically approving pass.");
    return true;
  }

  var activePanel = document.getElementById("step-panel-" + stepIdx) || 
                    document.getElementById("step-" + stepIdx) || 
                    document.getElementById(`step-${stepIdx}-injection-placeholder`) || 
                    (stepIdx === 0 ? document.getElementById("step-0-injection-placeholder") : null);
                    
  if (!activePanel) {
    console.log(`[Validator Engine Warning] View container for step ${activeStep} not mounted. Bypassing check.`);
    return true;
  }

  // Clear all previous in-line error notifications before running a new sweep
  activePanel.querySelectorAll(".inline-error-message-node").forEach(node => node.remove());
  activePanel.querySelectorAll(".wizard-input-field-error-state").forEach(el => {
    el.classList.remove("wizard-input-field-error-state");
    el.style.borderColor = "";
  });

  var inputs = activePanel.querySelectorAll("input, select, textarea");
  var stepIsValid = true;
  var firstInvalidElement = null;
  var regexLetters = /^[\p{L}\s.'\-]+$/u;
  var regexNumbers = /^\d+$/;
  var regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  inputs.forEach(function(el) {
    if (el.type === "hidden" || el.disabled) return;

    // ===================================================================== //
    // DECOUPLED EXTERNAL FIELDS BYPASS INTEGRATION                          //
    // ===================================================================== //
    if (typeof window.checkIsProtectedExternalField === "function" && window.checkIsProtectedExternalField(el)) {
      return;
    }

    // Skip element if it is nested inside a hidden step placeholder
    const isHiddenContainer = el.closest('[style*="display: none"]') || el.closest('.wizard-panel:not(.active)');
    var bounds = el.getBoundingClientRect();
    if (isHiddenContainer || (bounds.width === 0 && bounds.height === 0)) {
      return;
    }

    // If we are validating Step 1, ignore inputs sitting inside future step placeholders
    if (stepIdx === 1) {
      if (el.closest('#step-2-injection-placeholder') || el.closest('#step-3-injection-placeholder')) {
        return;
      }
    }

    var val = el.value.trim();
    let isFieldInvalid = false;
    let validationErrorMessage = "";

    // 1. CHECK REQUIRED INPUT STATES
    if (el.hasAttribute("required") && val === "") {
      validationErrorMessage = "This field is required.";
      isFieldInvalid = true;
    }
    // 2. CHECK FORMAT STRINGS IF FIELD IS POPULATED
    else if (val !== "") {
      const lowerName = (el.name || "").toLowerCase();
      const lowerId = (el.id || "").toLowerCase();

      // Email Input Patterns
      if (el.type === "email" || el.classList.contains("validate-email") || lowerName.includes("email") || lowerId.includes("email")) {
        if (!regexEmail.test(val)) {
          validationErrorMessage = "Please enter a valid email address.";
          isFieldInvalid = true;
        }
      }
      // Person/City Name Patterns
      else if (el.classList.contains("validate-letters") || lowerName.includes("first_name") || lowerName.includes("last_name") || lowerName.includes("city")) {
        if (!regexLetters.test(val)) {
          validationErrorMessage = "This field can only contain letters, spaces, hyphens, or periods.";
          isFieldInvalid = true;
        }
      }
      // Numeric Input Patterns (ZIP, EIN, Phone, Numbers)
      else if (el.type === "number" || el.classList.contains("validate-numbers") || lowerName.includes("zip") || lowerName.includes("ein") || lowerName.includes("phone") || lowerName.includes("tel")) {
        const cleanNumericValue = val.replace(/[\s\-()]/g, "");
        if (!regexNumbers.test(cleanNumericValue)) {
          validationErrorMessage = "This field can only contain numeric digits.";
          isFieldInvalid = true;
        }
      }
    }

    // Dynamic In-Line Error Placement
    if (isFieldInvalid) {
      stepIsValid = false;
      if (!firstInvalidElement) firstInvalidElement = el;
      el.classList.add("wizard-input-field-error-state");
      el.style.borderColor = "#b91c1c";
      const inputParentWrapper = el.closest(".wizard-input-group") || el.closest(".form-group-wrapper") || el.parentElement;
      if (inputParentWrapper) {
        if (!inputParentWrapper.querySelector(".inline-error-message-node")) {
          const errorLabel = document.createElement("span");
          errorLabel.className = "inline-error-message-node";
          errorLabel.style.cssText = "color: #b91c1c; font-size: 0.78rem; font-weight: 600; display: block; margin-top: 4px; text-align: left; clear: both; width: 100%; animation: fadeIn 0.15s ease;";
          errorLabel.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i> ${validationErrorMessage}`;
          inputParentWrapper.appendChild(errorLabel);
        }
      }
    }
  });

  // Focus and scroll smoothly to the first field failure item
  if (!stepIsValid && firstInvalidElement) {
    try {
      firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidElement.focus();
    } catch (err) {
      console.warn("[Validator Engine] Prevented crash during focus shift:", err);
    }
  }
  return stepIsValid;
}

window.validateStepInputParametersVanilla = validateStepInputParametersVanilla;

// ============================================================================ //
// 📄 FILE: wizard-core.js                                                      //
// 🧲 MODULE: GLOBAL DYNAMIC FORM DISPATCHER CHECKING TOOL                      //
// ============================================================================ //
/**
 * Global dynamic form dispatcher checking tool.
 * Identifies the on-screen active step framework form state and triggers its matching validation sequence.
 */
async function runMasterActiveStepFormValidation() {
  const currentStep = (typeof window.currentWizardActiveStep === "number") ? window.currentWizardActiveStep : 0;
  console.log(`[Validation Dispatch] Intercepting form status check for step: ${currentStep}`);

  // Force evaluate basic required markup fields on the current step container FIRST
  if (typeof window.validateStepInputParametersVanilla === "function") {
    const isBaseStepValid = window.validateStepInputParametersVanilla(currentStep);
    if (!isBaseStepValid) {
      console.warn(`[Validation Dispatch Block] Step ${currentStep} failed primary field constraint validation.`);
      return false;
    }
  }

  // ========================================================================= //
  // 🗺️ STEP 7 TO STEP 8 NAVIGATION TRANSITION INTERLOCK
  // ========================================================================= //
  if (currentStep === 7) {
    console.log("[Validation Dispatch] Intercepting Step 7 form completion. Invoking secure profile synchronization handoff...");
    
    // Explicitly call the safe handoff engine we verified in step-7.js
    if (typeof window.bindFormSubmissionEvents === "function") {
      // If your form tracking requires manual invocation or is handled by submit events:
      const formElement = document.getElementById("f4u-client-profile-creation-form");
      if (formElement) {
        // Dispatches standard submit event to let step-7.js fire Supabase signup cleanly
        formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        return false; // Prevent default wizard navigation from hijacking the view transition prematurely
      }
    }
  }

  // ========================================================================= //
  // 💳 STEP 5 TO STEP 6 TRANSITION GATEWAY: SECURE INTENT EXTRACTION LAYER    //
  // ========================================================================= //
  if (currentStep === 5) {
    console.log("[Validation Dispatch] Step 5 baseline clear. Securing authorization token tracks...");
    var nextButton = document.getElementById("summary-submit-payment-intent-btn") || document.querySelector(".btn-wizard-nav-next");
    var fallbackText = "Secure Payment";
    
    if (nextButton) {
      fallbackText = nextButton.innerHTML;
      nextButton.disabled = true;
      nextButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 6px;"></i> Securing Authorization...';
    }
    
    try {
      if (typeof window.executeStabaseCheckoutTransactionHandshake === "function") {
        await window.executeStabaseCheckoutTransactionHandshake();
      } else {
        throw new Error("Stripe checkout initialization framework modules are unpopulated.");
      }
      var oldErrorBanner = document.getElementById("step5-matrix-error-banner");
      if (oldErrorBanner && oldErrorBanner.parentNode) {
        oldErrorBanner.parentNode.removeChild(oldErrorBanner);
      }
    } catch (apiNetworkException) {
      console.error("🚨 [Gateway Execution Failure]:", apiNetworkException.message);
      var step5Panel = document.getElementById("step-panel-5");
      var errorNodeTarget = document.getElementById("step5-matrix-error-banner");
      
      if (step5Panel && !errorNodeTarget) {
        errorNodeTarget = document.createElement("div");
        errorNodeTarget.id = "step5-matrix-error-banner";
        errorNodeTarget.style.cssText = "margin: 15px 0; padding: 12px; border: 1px solid #fee2e2; background: #fef2f2; color: #b91c1c; border-radius: 6px; font-size: 0.85rem; font-weight: 500; font-family: sans-serif; text-align: left;";
        step5Panel.appendChild(errorNodeTarget);
      }
      if (errorNodeTarget) {
        errorNodeTarget.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="margin-right: 6px;"></i> <strong>Critical Error:</strong> ' + apiNetworkException.message;
      }
      if (nextButton) {
        nextButton.disabled = false;
        nextButton.innerHTML = fallbackText;
      }
      return false;
    } finally {
      if (nextButton) {
        nextButton.disabled = false;
        nextButton.innerHTML = fallbackText;
      }
    }
  }

  // Strictly isolate billing steps (5 and 6) from onboarding checks
  if (currentStep === 5 || currentStep === 6) {
    console.log(`[Validation Dispatch] Step ${currentStep} is a checkout review/payment view layer. Bypassing fuzzy reflection validation.`);
    return true;
  }

  const currentServiceKey = window.routeActiveServiceKey || window.currentServiceKey || "";
  const cleanKey = String(currentServiceKey).toLowerCase().trim().replace(/[\s_]+/g, "-");
  if (!cleanKey) {
    console.log("[Validation Dispatch] No active service key registered. Proceeding with baseline status.");
    return true;
  }

  const primaryKeyWords = cleanKey.split('-');
  const globalContextKeys = Object.keys(window);
  const targetValidationMethodKey = globalContextKeys.find(key => {
    const kLower = key.toLowerCase();
    if (["validatestepinputparametersvanilla", "runmasteractivestepformvalidation", "validatestepinputparameters"].includes(kLower)) {
      return false;
    }
    const isValidationFunction = typeof window[key] === "function" && kLower.startsWith("validate");
    const matchesServiceKeyword = primaryKeyWords.some(word => word.length > 2 && kLower.includes(word));
    return isValidationFunction && matchesServiceKeyword;
  });

  if (targetValidationMethodKey) {
    console.log(`[Validation Dispatch Success] Auto-discovered supplementary validation logic: window.${targetValidationMethodKey}()`);
    try {
      const validationTargetCanvas = document.getElementById(`step-${currentStep}-onboarding-fields-canvas`) || document.getElementById(`step-panel-${currentStep}`) || document.body;
      const targetFunction = window[targetValidationMethodKey];
      let advancedValidationResult;
      
      if (targetFunction.length >= 2) {
        advancedValidationResult = targetFunction(validationTargetCanvas, currentStep);
      } else {
        advancedValidationResult = targetFunction(currentStep);
      }
      return advancedValidationResult !== false;
    } catch (err) {
      console.error(`[Validation Dispatch Failure] Runtime error executing window.${targetValidationMethodKey}:`, err);
      return false;
    }
  }

  if (typeof window.validateAlgorithmicFallbackFields === "function") {
    return !!window.validateAlgorithmicFallbackFields(currentStep);
  }

  return true;
}

window.runMasterActiveStepFormValidation = runMasterActiveStepFormValidation;

// ============================================================================ //
// 📄 FILE: wizard-core.js                                                      //
// 🧲 MODULE: MODULAR ATTACHMENT: VANILLA STATE SCRAPER FOR STEP HYDRATION       //
// ============================================================================ //
window.saveWizardFormStatesVanilla = function() {
  console.log("[State Engine] Triggering global form parameter data collection pass...");
  try {
    const currentStepNum = (typeof window.currentWizardActiveStep === "number") ? window.currentWizardActiveStep : 0;

    // ✅ REPAIRED STRATIFICATION PASS: Only skip steps 5, 6, and 8. Step 7 contains critical profile inputs.
    if (currentStepNum === 5 || currentStepNum === 6 || currentStepNum === 8) {
      console.log(`[State Engine Log] Step ${currentStepNum} is a strict billing/confirmation layout views context. Skipping serialization pass.`);
      return;
    }

    // Clean target containment boundary without hardcoded step fallbacks
    const currentActivePanel = document.getElementById(`step-panel-${currentStepNum}`) || document.getElementById(`step-${currentStepNum}-injection-placeholder`) || document.getElementById(`step-0-injection-placeholder`);
    if (!currentActivePanel) {
      console.warn(`[State Engine Abort] Canceled scraping pass: Panel context for step ${currentStepNum} not mounted in DOM tree yet.`);
      return;
    }
    
    console.log(`[State Engine] Actively serializing elements for Step Panel ID: "${currentActivePanel.id || 'Dynamic Slot'}"`);

    // 1. Collect all standard alphanumeric fields, textareas, hidden items, and selectors
    const formFields = currentActivePanel.querySelectorAll("input:not([type='checkbox']):not([type='radio']), select, textarea");
    formFields.forEach(fieldItem => {
      const fieldIdentifier = fieldItem.id || fieldItem.name;
      if (fieldIdentifier) {
        const structuralValue = fieldItem.value ? fieldItem.value.trim() : "";
        localStorage.setItem(`wizard_field_${fieldIdentifier}`, structuralValue);

        // STATE RETENTION GUARD: Match specific distinct structural identity keys cleanly
        const cleanId = fieldIdentifier.toLowerCase();
        if ((cleanId === "state" || cleanId === "formation" || cleanId.includes("_state") || cleanId.includes("formation_")) && structuralValue !== "") {
          localStorage.setItem('wizard_selected_state', structuralValue.toUpperCase());
          window.selectedJurisdiction = structuralValue.toUpperCase();
        }
      }
    });

    // 2. Process all checkbox components cleanly using decoupled attribute classes
    const checkboxes = currentActivePanel.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function(boxItem) {
      const boxIdentifier = boxItem.id || boxItem.name;
      if (boxIdentifier) {
        if (boxItem.classList.contains("upsell-checkbox") || boxItem.closest(".upsell-market-card") || boxItem.hasAttribute("data-skip-serialize")) {
          return;
        }
        localStorage.setItem(`wizard_field_${boxIdentifier}`, boxItem.checked ? "true" : "false");
      }
    });

    // 3. Process radio inputs safely by only capturing the actively selected element in each group
    const radioButtons = currentActivePanel.querySelectorAll("input[type='radio']");
    const processedRadioNames = new Set();
    
    radioButtons.forEach(function(radioItem) {
      const radioIdentifier = radioItem.name || radioItem.id;
      if (!radioIdentifier || processedRadioNames.has(radioIdentifier)) {
        return;
      }

      // Query the specific checked element belonging to this radio group name context
      const selectedRadioInGroup = currentActivePanel.querySelector(`input[type='radio'][name='${radioItem.name}']:checked`) || (radioItem.checked ? radioItem : null);
      if (selectedRadioInGroup) {
        const radioCleanValue = selectedRadioInGroup.value ? selectedRadioInGroup.value.trim() : "";
        localStorage.setItem(`wizard_field_${radioIdentifier}`, radioCleanValue);

        const cleanRadioId = radioIdentifier.toLowerCase();
        const isPackageTierKey = cleanRadioId === "plan" || cleanRadioId === "tier" || cleanRadioId.endsWith("_plan") || cleanRadioId.endsWith("_tier");
        const isStateSelectionKey = cleanRadioId.includes("state") || cleanRadioId.includes("geo") || cleanRadioId.includes("jurisdiction") || cleanRadioId.includes("location");
        
        if (isPackageTierKey && !isStateSelectionKey) {
          window.currentPlanKey = radioCleanValue;
          window.currentServiceTier = radioCleanValue;
        }
      } else {
        localStorage.setItem(`wizard_field_${radioIdentifier}`, "");
      }

      if (radioItem.name) {
        processedRadioNames.add(radioItem.name);
      }
    });

    console.log("[State Engine] Active layout fields successfully serialized.");
  } catch (scrapingException) {
    console.warn("[State Engine Error] Failed to safely cache form elements:", scrapingException);
  }
};

// ============================================================================ //
// 📄 FILE: wizard-core.js                                                      //
// 🧲 MODULE: WIZARD NAVIGATION & TIMELINE PROGRESS LIGHTS (REPAIRED)           //
// ============================================================================ //

/**
 * Navigates to the next wizard step or a targeted step context securely.
 * Supports explicit parameters, click triggers, and standard form submissions safely.
 */
function goToNextWizardStep(targetStep, eventClickRef) {
  let explicitEvent = null;
  let resolvedTarget = undefined;

  if (targetStep && typeof targetStep === 'object' && typeof targetStep.preventDefault === 'function') {
    explicitEvent = targetStep;
  } else if (eventClickRef && typeof eventClickRef === 'object' && typeof eventClickRef.preventDefault === 'function') {
    explicitEvent = eventClickRef;
  } else if (window.event) {
    explicitEvent = window.event;
  }

  if (explicitEvent) {
    explicitEvent.preventDefault();
    explicitEvent.stopPropagation();
  }

  if (typeof targetStep === 'number' || (typeof targetStep === 'string' && !isNaN(parseInt(targetStep, 10)))) {
    resolvedTarget = parseInt(targetStep, 10);
  }

  let currentStep = typeof window.currentWizardActiveStep !== 'undefined' ? parseInt(window.currentWizardActiveStep, 10) : 0;
  if (isNaN(currentStep)) currentStep = 0;
  window.currentWizardActiveStep = currentStep;

  // ROUTE VALIDATION DIRECTLY THROUGH MASTER DISPATCHER
  if (typeof window.runMasterActiveStepFormValidation === "function") {
    if (!window.runMasterActiveStepFormValidation()) {
      console.warn(`[Navigation Gate] Validation failed for Step ${currentStep} via Master Dispatcher. Halt pipeline.`);
      return false;
    }
  } else if (typeof window.validateStepInputParametersVanilla === "function") {
    if (!window.validateStepInputParametersVanilla(currentStep)) {
      console.warn(`[Navigation Gate] Validation failed for Step ${currentStep}. Halt pipeline.`);
      return false;
    }
  }

  // CALLS THE ATTACHED DATA SCRAPER BEFORE PANEL ROTATION
  if (typeof window.saveWizardFormStatesVanilla === "function") {
    window.saveWizardFormStatesVanilla();
  }

  // Compute calculated target layout boundary index
  let nextStepIndex = currentStep + 1;
  if (typeof resolvedTarget === 'number') {
    nextStepIndex = resolvedTarget;
  }

  // ✅ FIXED: Funnel range expanded to 8 to clear a path for the receipt module
  if (nextStepIndex > 8) {
    console.log("[Navigation] End of master confirmation funnel reached. Submitting remaining updates...");
    return true;
  }

  switchWizardActiveViewLayout(nextStepIndex);
  return false;
}

function goToPreviousWizardStep() {
  let currentStep = typeof window.currentWizardActiveStep !== 'undefined' ? parseInt(window.currentWizardActiveStep, 10) : 0;
  if (isNaN(currentStep)) currentStep = 0;
  
  let previousStepIndex = currentStep - 1;
  if (previousStepIndex < 0) {
    console.log("[Navigation] Already at Step 0 entry frame.");
    return false;
  }

  switchWizardActiveViewLayout(previousStepIndex);
  return false;
}

// ============================================================================
// FILE: wizard-core.js - LIFECYCLE REPAIR EXTRACTION (RESTORES STEP 0 & STRIPE)
// MODULE: UNIFIED VIEW OVERRIDE & STEP GATE MASTER UTILITY
// ============================================================================

function switchWizardActiveViewLayout(activeStepTarget) {
  const targetStepInt = parseInt(activeStepTarget, 10);
  
  // ✅ FIXED BOOT ALIGNMENT: If the step is undefined or 0, guarantee it evaluates as 0 to unhide Step 0
  const verifiedActiveStepIndex = isNaN(targetStepInt) ? 0 : targetStepInt;
  console.log("Navigation Engine: Switching core wizard viewport layout to Step " + verifiedActiveStepIndex);

  window.currentWizardActiveStep = verifiedActiveStepIndex;
  window.lastInitiatedTargetStep = verifiedActiveStepIndex;

  const transitionRunner = typeof window.triggerWorkspaceTransitionSpinner === "function" ? window.triggerWorkspaceTransitionSpinner : function(cb) { cb(); };

  transitionRunner(function() {
    // Loop through all panels securely to map visibility states cleanly
    for (let i = 0; i <= 8; i++) {
      const panelNode = document.getElementById("step-panel-" + i) || document.getElementById("step-" + i + "-injection-placeholder");
      if (panelNode) {
        if (i === verifiedActiveStepIndex) {
          panelNode.classList.add("active");
          panelNode.style.setProperty("display", "block", "important");
          panelNode.setAttribute("tabindex", "-1");
          try { panelNode.focus(); } catch(e) {}
        } else {
          panelNode.classList.remove("active");
          panelNode.style.setProperty("display", "none", "important");
        }
      }
    }

    // ✅ FIXED STRIPE INITIALIZER CALL: Let the script run its local initialization loops when entering Step 6
    if (verifiedActiveStepIndex === 6) {
      console.log("Stripe Lifecycle Bridge: Step 6 visible. Allowing frontend scripts to initialize clientSecret...");
      if (typeof window.initializeFlatStripeCheckoutElement === "function") {
        window.initializeFlatStripeCheckoutElement();
      }
    }

    if (typeof window.executeStepLifecyclePipeline === "function") {
      window.executeStepLifecyclePipeline(verifiedActiveStepIndex);
    }
  });
}

// Expose the fixed, non-blocking navigation routine back up to the global scope
window.switchWizardActiveViewLayout = switchWizardActiveViewLayout;



// ============================================================================ //
// 📄 FILE: wizard-core.js                                                      //
// 🧲 MODULE: CORE STEP LIFECYCLE ROUTER AND PIPELINE EXECUTION ENGINE         //
// ============================================================================ //

/**
 * Core Step Lifecycle Router and Pipeline Execution Engine.
 * This handles dynamic element injection and mounts secure gateways after layout stability.
 * 
 * @param {number} targetStepInt The active targeted form step index.
 */
function executeStepLifecyclePipeline(targetStepInt) {
  targetStepInt = parseInt(targetStepInt, 10) || 0;

  // ===================================================================== //
  // STEP 2 DYNAMIC INJECTION CORRECTION                                   //
  // ===================================================================== //
  if (targetStepInt === 2) {
    const targetUrlParams = new URLSearchParams(window.location.search);
    const activeServiceKey = window.routeActiveServiceKey || String(targetUrlParams.get('service') || "").toLowerCase().trim();
    const innerPlaceholderCanvas = document.getElementById("step-2-injection-placeholder");
    
    if (innerPlaceholderCanvas) {
      innerPlaceholderCanvas.style.setProperty("display", "block", "important");
      innerPlaceholderCanvas.style.setProperty("opacity", "1", "important");
      innerPlaceholderCanvas.style.setProperty("visibility", "visible", "important");
    }
    
    if (typeof window.executeStepTwoDynamicFormInjection === "function") {
      try {
        window.executeStepTwoDynamicFormInjection(null, activeServiceKey);
      } catch (stepTwoError) {
        console.error("[CRITICAL FAILURE INSIDE STEP 2 SCRIPT]:", stepTwoError);
      }
    }
  }

  // ===================================================================== //
  // STEP 3 DYNAMIC MARKETPLACE PACKAGES INJECTION BRIDGE                  //
  // ===================================================================== //
  if (targetStepInt === 3) {
    console.log("[Navigation Router] Step 3 visibility confirmed. Triggering marketplace generation pass...");
    const marketplaceContainer = document.getElementById("step-panel-3") || document.getElementById("step-3-injection-placeholder");
    
    if (marketplaceContainer) {
      marketplaceContainer.style.setProperty("display", "block", "important");
    }
    
    if (typeof window.executeStepThreeUpsellStreaming === "function") {
      window.executeStepThreeUpsellStreaming();
    } else if (typeof window.autoInitializeStep3MarketplaceCatalog === "function") {
      window.autoInitializeStep3MarketplaceCatalog();
    }
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.currentWizardActiveStep !== 3) return;
        try {
          if (typeof window.cleanStep3MarketplaceDuplications === "function") {
            window.cleanStep3MarketplaceDuplications();
          }
          if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
            window.updateDynamicPricingMatrixVanilla();
          }
          if (typeof window.autoSkinSelectedUpsellCards === "function") {
            window.autoSkinSelectedUpsellCards();
          }
          if (typeof window.updateApplicationMapTimelineBubbles === "function") {
            window.updateApplicationMapTimelineBubbles(3);
          }
        } catch (lifecycleError) {
          console.error("[Navigation Router Timing Exception] Error in Step 3 rendering pipeline:", lifecycleError);
        }
      });
    });
  }

  // ===================================================================== //
  // LIFECYCLE REBOOT COOLDOWN PRESERVING STEP 0 & OTHER VIEWS             //
  // ===================================================================== //
  if ((targetStepInt === 0 || targetStepInt === 1) && typeof window.runUnifiedWizardBootEngine === "function") {
    try {
      window.runUnifiedWizardBootEngine();
    } catch (bootErr) {
      console.warn("[Navigation Engine] Unified boot engine fallback caught:", bootErr);
    }
  }

  // ===================================================================== //
  // DETACHED LIFECYCLE FOR STEPS 4, 5, 6, 7 (DECOUPLED HANDOFF CORES)     //
  // ===================================================================== //
  if (targetStepInt !== 3) {
    
    // DECOUPLED STRIPE LIFE-CYCLE TRIGGER INTERLOCK
    if (targetStepInt === 6 && typeof window.executeStripeLifecycleHandoffGate === "function") {
      window.executeStripeLifecycleHandoffGate();
    }

    // 🆕 NEW LAYER: STEP 7 ACCOUNT CREATION (POST-CHECKOUT USER REGISTRATION)
    if (targetStepInt === 7) {
      console.log("[Core Lifecycle] Step 7 panel activated. Awakening Account Creation engine...");
      const accountPanelContainer = document.getElementById("step-panel-7");
      
      if (accountPanelContainer) {
        accountPanelContainer.style.setProperty("display", "block", "important");
        accountPanelContainer.style.setProperty("opacity", "1", "important");
        accountPanelContainer.style.setProperty("visibility", "visible", "important");
        accountPanelContainer.classList.add("active");
        accountPanelContainer.offsetHeight; // Force DOM layout reflow
      }

      // Resilient Execution Loop for Account Creation Engine
      const runAccountCreationSetup = () => {
        if (typeof window.initializeStep7AccountCreation === "function") {
          window.initializeStep7AccountCreation();
        } else {
          console.warn("[Core Lifecycle Warning] step-7.js (Account Creation) unmapped. Micro-polling...");
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (typeof window.initializeStep7AccountCreation === "function") {
              window.initializeStep7AccountCreation();
              clearInterval(interval);
            } else if (attempts >= 20) {
              clearInterval(interval);
              console.error("[Core Lifecycle Error] Critical Failure: step-7.js failed to initialize.");
            }
          }, 100);
        }
      };
      runAccountCreationSetup();
    }

    // ➡️ MOVED LAYER: STEP 8 SUCCESS PANEL & SECURE HYDRATION
    if (targetStepInt === 8) {
      console.log("[Core Lifecycle] Step 8 panel activated. Awakening Success & Hydration engine...");
      const successPanelContainer = document.getElementById("step-panel-8") || document.getElementById("step-8-injection-placeholder");
      
      if (successPanelContainer) {
        successPanelContainer.style.setProperty("display", "block", "important");
        successPanelContainer.style.setProperty("opacity", "1", "important");
        successPanelContainer.style.setProperty("visibility", "visible", "important");
        successPanelContainer.classList.add("active");
        successPanelContainer.offsetHeight;
      }

      // Resilient Execution Loop for Success Hydration
      const runSuccessHydrationSetup = () => {
        if (typeof window.initializeSecureStep8AccountHydration === "function") {
          window.initializeSecureStep8AccountHydration();
        } else {
          console.warn("[Core Lifecycle Warning] step-8.js (Success) unmapped. Micro-polling...");
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (typeof window.initializeSecureStep8AccountHydration === "function") {
              window.initializeSecureStep8AccountHydration();
              clearInterval(interval);
            } else if (attempts >= 20) {
              clearInterval(interval);
              console.error("[Core Lifecycle Error] Critical Failure: step-8.js failed to initialize.");
            }
          }, 100);
        }
      };
      runSuccessHydrationSetup();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.currentWizardActiveStep !== targetStepInt) return;
        
        if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
          window.updateDynamicPricingMatrixVanilla();
        }
        if (typeof window.autoSkinSelectedUpsellCards === "function") {
          window.autoSkinSelectedUpsellCards();
        }
        if (typeof window.updateApplicationMapTimelineBubbles === "function") {
          window.updateApplicationMapTimelineBubbles(targetStepInt);
        }
        if (typeof window.executeMarketplaceSummaryRenderLoop === "function" && targetStepInt === 5) {
          window.executeMarketplaceSummaryRenderLoop();
        }
      });
    });
  }
}

// ✅ EXPOSE ROUTING TO WINDOW SPACE PRESERVING REPAIRED NAVIGATION RANGE EXTENSIONS
window.executeStepLifecyclePipeline = executeStepLifecyclePipeline;

// ============================================================================ //
// 📄 FILE: wizard-core.js                                                      //
// 🧲 MODULE: REFACTORED REFLECTIVE INFRASTRUCTURE HYDRATION LAYER & SHIELD      //
// ============================================================================ //
;(function() {
  "use strict";

  window.CENTRAL_SERVICE_PLAN_DB = window.CENTRAL_SERVICE_PLAN_DB || {};
  window.GLOBAL_COMPANY_PRICING = window.GLOBAL_COMPANY_PRICING || {};
  window.GLOBAL_COMPANY_PRICING.packages = window.GLOBAL_COMPANY_PRICING.packages || window.CENTRAL_SERVICE_PLAN_DB;
  
  if (!window.GLOBAL_COMPANY_PRICING.addons) {
    window.GLOBAL_COMPANY_PRICING.addons = {};
  }

  let internalServiceKey = null;
  let internalPlanKey = null;

  // REACTIVE SERVICE KEY TRACKER
  Object.defineProperty(window, 'routeActiveServiceKey', {
    get() {
      if (internalServiceKey) return internalServiceKey;
      const urlScanner = new URLSearchParams(window.location.search);
      const rawUrlService = urlScanner.get('service') || window.currentServiceKey || window.currentServicePathKey;
      let fallbackInitialKey = Object.keys(window.CENTRAL_SERVICE_PLAN_DB)[0] || "";
      let activeKeyToCommit = rawUrlService ? rawUrlService : fallbackInitialKey;
      
      if (typeof window.resolvePricingConfigurationDynamically === "function" && activeKeyToCommit) {
        const dynamicMatch = window.resolvePricingConfigurationDynamically(activeKeyToCommit);
        if (dynamicMatch && dynamicMatch.matchedKey) {
          activeKeyToCommit = dynamicMatch.matchedKey;
        }
      }
      
      if (!activeKeyToCommit) {
        activeKeyToCommit = "llc-formation";
      }
      return String(activeKeyToCommit).toLowerCase().trim();
    },
    set(newKey) {
      if (!newKey) return;
      const cleanKey = String(newKey).toLowerCase().trim();
      internalServiceKey = cleanKey;
      if (window.currentServiceKey !== cleanKey) window.currentServiceKey = cleanKey;
      if (window.currentServicePathKey !== cleanKey) window.currentServicePathKey = cleanKey;
    },
    configurable: true,
    enumerable: true
  });

  // REACTIVE PLAN KEY TRACKER
  Object.defineProperty(window, 'routeActivePlanKey', {
    get() {
      if (internalPlanKey) return internalPlanKey;
      const urlScanner = new URLSearchParams(window.location.search);
      return (urlScanner.get('plan') || 'compliance').toLowerCase().trim();
    },
    set(newPlan) {
      if (newPlan) {
        internalPlanKey = String(newPlan).toLowerCase().trim();
      }
    },
    configurable: true,
    enumerable: true
  });

  setTimeout(() => {
    console.log(`[Dynamic Boot] Active system paths verified. Selected node target: "${window.routeActiveServiceKey}"`);
  }, 1);
})();

// ============================================================================ //
// 🎛️ MODULAR HOOK: URL PARAMETER EXTRACTOR & DEFENSIVE BOOTSTRAPPER            //
// ============================================================================ //
/**
 * URL Parameter Extractor Hook
 * Automatically populates routing states from URL tracking if left unassigned
 */
function syncUrlStateToWizardEngine() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('service')) {
    const val = urlParams.get('service');
    if (val && window.routeActiveServiceKey !== val) {
      window.routeActiveServiceKey = val;
    }
  }
  
  if (urlParams.has('plan')) {
    const pVal = urlParams.get('plan');
    if (pVal && window.routeActivePlanKey !== pVal) {
      window.routeActivePlanKey = pVal;
    }
  }

  // ✅ FIXED: Standardized redirect parameters to safely land directly on Step 8 confirmation receipt screen view
  if (urlParams.get('step') === '7' || urlParams.get('step') === '8') {
    console.log("[State Registry] Stripe payment return detected. Enforcing manual view override to Step 8 Receipt Screen.");
    
    window.currentWizardActiveStep = 8;
    
    if (typeof window.switchWizardActiveViewLayout === "function") {
      window.switchWizardActiveViewLayout(8);
    } else {
      setTimeout(() => {
        if (typeof window.switchWizardActiveViewLayout === "function") {
          window.switchWizardActiveViewLayout(8);
        }
      }, 50);
    }
  }
}

// Expose extractor hook back to window scope
window.syncUrlStateToWizardEngine = syncUrlStateToWizardEngine;

// ============================================================================ //
// 🚀 UNIFIED SMOOTH-SCROLL VIEWPORT TRACKING ENGINE                            //
// ============================================================================ //
;(function() {
  "use strict";

  const masterLayoutPanels = document.querySelectorAll(".wizard-panel, [id^='step-panel-'], [id^='step-']");
  window.activePanelVisibilityObserversArray = [];
  window.lastConfirmedActiveStepId = null;
  
  let isStep3CatalogInitialized = false;

  masterLayoutPanels.forEach(function(panel) {
    const panelObserver = new MutationObserver(function(mutations) {
      const panelStepIdMatch = panel.id ? panel.id.match(/\d+$/) : null;
      const panelStepIndex = panelStepIdMatch ? parseInt(panelStepIdMatch[0], 10) : null;
      if (panelStepIndex === null) return;

      const isVisible = (panel.style.display === "block" || panel.classList.contains("active")) && panelStepIndex === window.currentWizardActiveStep;
      
      if (isVisible && window.lastConfirmedActiveStepId !== panel.id) {
        window.lastConfirmedActiveStepId = panel.id;
        console.log(`[Scroll Manager] Panel #${panel.id || 'wizard-step'} mounted active. Adjusting viewport anchors...`);

        // Use a hardware-safe double animation frame pass for checkout and receipt layers
        if (panelStepIndex === 6 || panelStepIndex === 7 || panelStepIndex === 8) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              try {
                window.scrollTo({ top: 0, behavior: "auto" });
              } catch(e) {}
            });
          });
        } else {
          try {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch(e) {}
        }

        if (panel.id === "step-panel-2" && typeof window.attachStepTwoNavigationTriggers === "function") {
          window.attachStepTwoNavigationTriggers();
        }

        if (panelStepIndex === 3) {
          if (!isStep3CatalogInitialized) {
            console.log("[Scroll Manager Interlock] Step 3 container live. Invoking streaming marketplace layout engine...");
            isStep3CatalogInitialized = true;
            if (typeof window.executeStepThreeUpsellStreaming === "function") {
              window.executeStepThreeUpsellStreaming();
            } else if (typeof window.autoInitializeStep3MarketplaceCatalog === "function") {
              window.autoInitializeStep3MarketplaceCatalog();
            }
          }
        } else {
          isStep3CatalogInitialized = false;
        }
      }
    });

    panelObserver.observe(panel, { attributes: true, attributeFilter: ["style", "class"] });
    
    // ✅ FIXED: Restored complete push expression and closed all dangling scopes neatly
    window.activePanelVisibilityObserversArray.push(panelObserver);
  });

  // Run the configuration parameter boot sync automatically on thread activation
  if (typeof syncUrlStateToWizardEngine === "function") {
    syncUrlStateToWizardEngine();
  }
})();


// ============================================================================ //
// 📄 FILE: wizard-core-viewport.js                                             //
// 🧲 MODULE: UNIVERSAL VIEWPORT DESIGN ENGINE & STATE DROPDOWN INJECTOR        //
// ============================================================================ //

/**
 * Monitors active layout dimensions to handle responsive stylesheet skinning
 * and prevent styling collisions on narrow smartphone viewports.
 */
function evaluateSystemViewportDesign() {
  const container = document.querySelector('.wizard-container') || 
                    document.querySelector('.wizard-container-wrapper') || 
                    (document.getElementById('step-panel-2')?.parentElement);
                    
  if (!container) {
    setTimeout(evaluateSystemViewportDesign, 50);
    return;
  }

  // Handle responsive view mutations via standard utility definitions
  const isMobileSize = window.innerWidth <= 991;
  const standardMobileClass = 'is-mobile-device';
  
  if (isMobileSize && !container.classList.contains(standardMobileClass)) {
    container.classList.add(standardMobileClass);
    console.log("[Viewport Engine] Mobile layout skinning parameters applied.");
  } else if (!isMobileSize && container.classList.contains(standardMobileClass)) {
    container.classList.remove(standardMobileClass);
  }

  // ✅ FIXED: Included Step 8 receipt panel IDs into the unified layout safety enforcement tracking loop
  const targetPanelIds = [
    "step-panel-2", "step-panel-3", "step-3", 
    "step-panel-5", "step-panel-6", 
    "step-panel-7", "step-7", 
    "step-panel-8", "step-8"
  ];
  
  targetPanelIds.forEach(id => {
    const activePanel = document.getElementById(id) || document.getElementById(`${id}-injection-placeholder`);
    if (activePanel && (activePanel.classList.contains("active") || activePanel.style.display === "block")) {
      
      // Read-before-write optimization rule for width matching
      if (activePanel.style.width !== "100%") {
        activePanel.style.setProperty("width", "100%", "important");
      }
      
      // Apply minimum height tracking constraints to avoid layout collapse across viewports
      if (activePanel.style.minHeight !== "400px") {
        activePanel.style.setProperty("min-height", "400px", "important");
      }
    }
  });
}

// Expose to global window context so switchWizardActiveViewLayout can invoke it on step switches
window.evaluateSystemViewportDesign = evaluateSystemViewportDesign;

// Optimized Debounce Wrapper to protect hardware threads during drag/resize events
let resizeDebounceTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeDebounceTimer);
  resizeDebounceTimer = setTimeout(evaluateSystemViewportDesign, 15);
});

// Run initial system initialization metrics safely
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", evaluateSystemViewportDesign);
} else {
  evaluateSystemViewportDesign();
}

// ============================================================================ //
// 🗺️ MODULE: UNIVERSAL SELF-HOOKING USA STATE DROPDOWN ENGINE                 //
// ============================================================================ //
;(function() {
  "use strict";

  // 1. The Single Immutable Source of Truth for USA State Options HTML
  window.globalStateDropdownOptionsHtml = '<option value="">-- Select State --</option>' + 
    '<option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option>' + 
    '<option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option>' + 
    '<option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District of Columbia</option>' + 
    '<option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option>' + 
    '<option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option>' + 
    '<option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option>' + 
    '<option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option>' + 
    '<option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option>' + 
    '<option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option>' + 
    '<option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option>' + 
    '<option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option>' + 
    '<option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option>' + 
    '<option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option>' + 
    '<option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option>' + 
    '<option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option>' + 
    '<option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option>' + 
    '<option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option>';

  // Legacy backwards-compatibility alias function mapping hooks for older files
  window.getUsaStatesHtml = function() { return window.globalStateDropdownOptionsHtml; };
  window.buildGlobalUsaStateDropdownOptionsHtml = function() { return window.globalStateDropdownOptionsHtml; };

  /**
   * Scans the active DOM playground for state select boxes and instantly attaches data.
   */
  function autoDiscoverAndHydrateStateDropdowns() {
    const stateSelectors = document.querySelectorAll(
      'select[id*="state"], select[name*="state"], select[id*="formation"], select[name*="formation"], .state-dropdown-select'
    );
    
    stateSelectors.forEach(dropdown => {
      if (!dropdown) return;

      // Element-level recursion guard instead of a fragile global lockout flag
      if (dropdown.children.length <= 1 && !dropdown.dataset.statesHydrated) {
        console.log(`[State Engine] Automatically injecting options into dropdown element: #${dropdown.id || dropdown.name}`);
        
        // Track current value configurations cleanly to preserve selections
        const currentSelectedValueBackup = dropdown.value || localStorage.getItem('wizard_selected_state') || "";
        dropdown.innerHTML = window.globalStateDropdownOptionsHtml || "";
        dropdown.dataset.statesHydrated = "true";

        // Restore previous choices seamlessly if a cache record exists
        if (currentSelectedValueBackup) {
          const normalizedStateCode = currentSelectedValueBackup.toUpperCase().trim();
          dropdown.value = normalizedStateCode;
          window.selectedJurisdiction = normalizedStateCode;
          localStorage.setItem('wizard_selected_state', normalizedStateCode);
        }
      }

      // Arm real-time change interceptors to save selections instantly
      if (!dropdown.dataset.stateChangeHooked) {
        dropdown.addEventListener("change", (e) => {
          if (window.isWizardCurrentlyRestoringStateVanilla) return;
          const chosenState = e.target.value;
          
          if (chosenState) {
            const sanitizedState = chosenState.toUpperCase().trim();
            window.selectedJurisdiction = sanitizedState;
            localStorage.setItem('wizard_selected_state', sanitizedState);
            localStorage.setItem(`wizard_field_${e.target.id || e.target.name}`, sanitizedState);
            
            console.log(`[State Engine] Selection shift captured: "${sanitizedState}". Scheduling matrix updates...`);
            
            // Use requestAnimationFrame to let DOM selections complete layout rendering before calculating prices
            requestAnimationFrame(() => {
              if (typeof window.executeMarketplaceSummaryRenderLoop === "function") {
                window.executeMarketplaceSummaryRenderLoop();
              } else if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
                window.updateDynamicPricingMatrixVanilla();
              }
            });
          }
        });
        dropdown.dataset.stateChangeHooked = "true";
      }
    });
  }

  window.autoDiscoverAndHydrateStateDropdowns = autoDiscoverAndHydrateStateDropdowns;
})();


// ============================================================================ // 
// ðŸ”„ AUTOMATED INTERLOCK: TARGETED CONTAINER DROPDOWN OBSERVATION CORES        // 
// ============================================================================ // 
;(function() { 
"use strict"; 

// Retain a persistent single instance context in a closure to avoid memory leaks 
let activeStateObserverInstance = null; 

function initializeDropdownObserver() { 
    // Fire an initial discovery pass cleanly to capture pre-rendered selections 
    if (typeof window.autoDiscoverAndHydrateStateDropdowns === "function") { 
        window.autoDiscoverAndHydrateStateDropdowns(); 
    } 
    const formRootNode = document.getElementById("dynamic-onboarding-fields-root") || document.getElementById("step-2-onboarding-fields-canvas") || document.querySelector(".portal-main") || document.getElementById("wizard-dynamic-form-target"); 
    if (formRootNode) { 
        // Disconnect previous observer instance securely if it exists to eliminate leaks 
        if (activeStateObserverInstance) { 
            activeStateObserverInstance.disconnect(); 
        } 
        activeStateObserverInstance = new MutationObserver(() => { 
            if (typeof window.autoDiscoverAndHydrateStateDropdowns === "function") { 
                window.autoDiscoverAndHydrateStateDropdowns(); 
            } 
        }); 
        activeStateObserverInstance.observe(formRootNode, { childList: true, subtree: true }); 
        console.log("[State Observer Success] Form layout subtree monitoring active cleanly."); 
    } 
} 

// Coordinate initialization startup execution paths cleanly 
if (document.readyState === "loading") { 
    document.addEventListener("DOMContentLoaded", initializeDropdownObserver); 
} else { 
    initializeDropdownObserver(); 
} 

// Export back up cleanly 
window.initializeDropdownObserver = initializeDropdownObserver; 
})(); 

// ============================================================================ // 
// ðŸ”µ CENTRALIZED NAVY BLUE TRANSITION SPINNER INTERCEPTOR                       // 
// ============================================================================ // 
;(function() { 
"use strict"; 

// Use a secure token reference to track overlapping animation passes 
let activeTransitionToken = 0; 

function triggerWorkspaceTransitionSpinner(callbackHandoffRoutine) { 
    // Increment token sequence instantly to invalidate older active timers 
    const currentPassToken = ++activeTransitionToken; 
    
    // 1. Build and style the hidden modal block overlay if missing from the viewport 
    let dynamicSpinnerOverlay = document.getElementById("f4u-global-transition-overlay"); 
    if (!dynamicSpinnerOverlay) { 
        dynamicSpinnerOverlay = document.createElement("div"); 
        dynamicSpinnerOverlay.id = "f4u-global-transition-overlay"; 
        dynamicSpinnerOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(248, 250, 252, 0.85); z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; opacity: 0; transition: opacity 0.2s ease; pointer-events: none; box-sizing: border-box;"; 
        
        if (!document.getElementById("f4u-spinner-global-keyframes")) { 
            const styleSheetNode = document.createElement("style"); 
            styleSheetNode.id = "f4u-spinner-global-keyframes"; 
            styleSheetNode.textContent = "@keyframes f4uPlatformCoreSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"; 
            document.head.appendChild(styleSheetNode); 
        } 
        
        dynamicSpinnerOverlay.innerHTML = ` 
            <div style="width: 50px; height: 50px; border: 4px solid #cbd5e1; border-top: 4px solid #0a1f44; border-radius: 50%; animation: f4uPlatformCoreSpin 0.8s linear infinite; box-sizing: border-box;"></div> 
            <span style="color: #0a1f44; font-weight: 700; font-size: 0.9rem; font-family: system-ui, sans-serif; letter-spacing: 0.5px; text-transform: uppercase;">Updating Compliance Workspace...</span> 
        `; 
        document.body.appendChild(dynamicSpinnerOverlay); 
    } 
    
    // 2. Fade spinner into active viewport space smoothly 
    dynamicSpinnerOverlay.style.display = "flex"; 
    // Forces browser rendering pass calculation frame layout prior to lifting opacity 
    void dynamicSpinnerOverlay.offsetWidth; 
    dynamicSpinnerOverlay.style.opacity = "1"; 
    dynamicSpinnerOverlay.style.pointerEvents = "auto"; 
    
    // 3. Coordinated structural execution pipeline 
    setTimeout(() => { 
        // Abort fade out cycle routines if an adjacent navigation transition has taken over 
        if (currentPassToken !== activeTransitionToken) return; 
        if (typeof callbackHandoffRoutine === "function") { 
            try { 
                callbackHandoffRoutine(); 
            } catch (err) { 
                console.error("[Spinner Engine Failure] Error during view handoff execution:", err); 
            } 
        } 
        
        // Allow layout paint adjustments to calculate and settle before dimming the loader wheel overlay 
        requestAnimationFrame(() => { 
            setTimeout(() => { 
                if (currentPassToken !== activeTransitionToken) return; 
                dynamicSpinnerOverlay.style.opacity = "0"; 
                dynamicSpinnerOverlay.style.pointerEvents = "none"; 
                
                setTimeout(() => { 
                    // Verify structural ownership states before flipping layouts off-screen 
                    if (currentPassToken === activeTransitionToken && dynamicSpinnerOverlay.style.opacity === "0") { 
                        dynamicSpinnerOverlay.style.display = "none"; 
                    } 
                }, 200); 
            }, 100); 
        }); 
    }, 180); 
} 

window.triggerWorkspaceTransitionSpinner = triggerWorkspaceTransitionSpinner; 
})();

// ============================================================================ //
// 📄 FILE: wizard-core-gate.js                                                 //
// 🧲 MODULE: STEP 0 JURISDICTION GATE ROUTER ENGINE (FEDERAL BYPASS)           //
// ============================================================================ //
;(function() {
  "use strict";

  // Persistent tracking reference to defuse rapid synchronous redirect cascades
  let isCurrentlyProcessingGateRoute = false;

  function enforceJurisdictionGateEvaluation() {
    if (isCurrentlyProcessingGateRoute) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const serviceSlug = String(urlParams.get('service') || window.routeActiveServiceKey || "").toLowerCase().trim();
    const stateParam = urlParams.get('state');

    // 1. PURE ZERO-HARDCODE FEDERAL TRACK BYPASS DETERMINATION
    const federalPricingDb = window.FILINGS4U_GOVERNMENT_PRICING || {};
    const isFederalFilingKey = Object.prototype.hasOwnProperty.call(federalPricingDb, serviceSlug) && serviceSlug !== "llc-formation" && serviceSlug !== "corporations";
    
    // Explicit keyword safety catch-all
    const isFederalKeyword = serviceSlug.includes("cage") || serviceSlug.includes("sam") || serviceSlug.includes("tax") || serviceSlug.includes("ein") || serviceSlug.includes("authority");

    if (isFederalFilingKey || isFederalKeyword) {
      console.log(`[Gate Engine] Federal Service path "${serviceSlug}" verified. Automatically bypassing Step 0 state selection.`);
      const gatePanel = document.getElementById("step-panel-0");
      if (gatePanel) gatePanel.style.setProperty("display", "none", "important");

      // Verify layout step alignment state before dispatching transitions
      if (window.currentWizardActiveStep !== 1 && typeof window.switchWizardActiveViewLayout === "function") {
        try {
          isCurrentlyProcessingGateRoute = true;
          window.switchWizardActiveViewLayout(1);
        } finally {
          isCurrentlyProcessingGateRoute = false;
        }
      }
      return;
    }

    // 2. Standard State-Level Formations Track Execution Parameters
    const statePricingRegistry = window.CENTRAL_SERVICE_PLAN_DB || {};
    const requiresStateSelection = Object.prototype.hasOwnProperty.call(statePricingRegistry, serviceSlug);

    if (requiresStateSelection && !stateParam) {
      console.log(`[Gate Engine] State Service "${serviceSlug}" requires jurisdiction. Mounting Step 0...`);
      
      // ✅ FIXED: Safely cleanses up to panel 8 without cutting structural elements off-screen
      for (let i = 1; i <= 8; i++) {
        const p = document.getElementById(`step-panel-${i}`) || document.getElementById(`step-${i}-injection-placeholder`);
        if (p) {
          p.classList.remove("active");
          p.style.setProperty("display", "none", "important");
        }
      }

      const gatePanel = document.getElementById("step-panel-0");
      if (gatePanel) {
        gatePanel.classList.add("active");
        gatePanel.style.setProperty("display", "block", "important");
      }
      if (window.currentWizardActiveStep !== 0) {
        window.currentWizardActiveStep = 0;
      }
      if (typeof window.autoDiscoverAndHydrateStateDropdowns === "function") {
        window.autoDiscoverAndHydrateStateDropdowns();
      }
    } else {
      const gatePanel = document.getElementById("step-panel-0");
      if (gatePanel) gatePanel.style.setProperty("display", "none", "important");

      if (typeof window.switchWizardActiveViewLayout === "function") {
        const savedStateCache = localStorage.getItem("f4u_wizard_onboarding_state");
        let stepToLoad = 1;

        try {
          const parsedState = savedStateCache ? JSON.parse(savedStateCache) : {};
          
          // ✅ FIXED: Guard condition prevents state overrides if an active Stripe redirect check has claimed the viewport
          const stripeStepTarget = urlParams.get('step');
          if (stripeStepTarget === '7' || stripeStepTarget === '8' || window.currentWizardActiveStep === 8) {
            stepToLoad = 8;
          } else if (stateParam && urlParams.has('service')) {
            stepToLoad = 1;
          } else {
            stepToLoad = parsedState.currentWizardActiveStep !== undefined ? parseInt(parsedState.currentWizardActiveStep, 10) : 1;
          }
        } catch(e) {
          stepToLoad = 1;
        }

        if (window.currentWizardActiveStep !== stepToLoad) {
          try {
            isCurrentlyProcessingGateRoute = true;
            
            // Calls external bridge logic to safely ready payment container properties if needed
            if (typeof window.executeStripeDisplayRecoveryOverride === "function") {
              window.executeStripeDisplayRecoveryOverride(stepToLoad);
            }
            window.switchWizardActiveViewLayout(stepToLoad);
          } finally {
            isCurrentlyProcessingGateRoute = false;
          }
        }
      }
    }
  }

  // Bind cleanly back into universal global window scope references safely
  window.enforceJurisdictionGateEvaluation = enforceJurisdictionGateEvaluation;
})();



/** 
 * Handles Step 0 submission click actions, appends values to the URL, and unlocks Step 1. 
 */ 
function processJurisdictionGateAdvancement() { 
    const stateSelectorNode = document.getElementById("wizard_gate_state_select"); 
    if (!stateSelectorNode || !stateSelectorNode.value) { 
        alert("Action Required: Please select your business registration state to proceed."); 
        return; 
    } 
    const chosenStateCode = stateSelectorNode.value.toUpperCase().trim(); 
    console.log(`[Gate Engine] Setting jurisdiction target state to: ${chosenStateCode}`); 
    
    // 1. APPEND THE CHOSEN STATE DIRECTLY TO THE URL WITHOUT REFRESHING THE PAGE 
    const urlParams = new URLSearchParams(window.location.search); 
    urlParams.set('state', chosenStateCode); 
    const upgradedAddressPath = `${window.location.pathname}?${urlParams.toString()}`; 
    window.history.replaceState({ path: upgradedAddressPath }, '', upgradedAddressPath); 
    
    // Write choice straight to tracking memory so other files read it instantly 
    window.selectedJurisdiction = chosenStateCode; 
    localStorage.setItem('wizard_selected_state', chosenStateCode); 
    
    // SILENT MARKUP VALUE SYNCHRONIZATION BACKUP TASK 
    const alternateSelectors = ["wizard_state_select", "state_select"]; 
    alternateSelectors.forEach(id => { 
        localStorage.setItem(`wizard_field_${id}`, chosenStateCode); 
        const alternateNode = document.getElementById(id); 
        if (alternateNode) { 
            alternateNode.value = chosenStateCode; 
            if (typeof window.toggleFederalTaxInventoryCostVisibility === "function") { 
                window.toggleFederalTaxInventoryCostVisibility(alternateNode, null, true); 
            } 
        } 
    }); 
    
    // Hide Step 0 overlay panel cleanly 
    const gatePanel = document.getElementById("step-panel-0"); 
    if (gatePanel) { 
        gatePanel.classList.remove("active"); 
        gatePanel.style.setProperty("display", "none", "important"); 
    } 
    
    // 2. COORDINATED ROUTING DISPATCH LIFECYCLE 
    requestAnimationFrame(() => { 
        if (typeof window.switchWizardActiveViewLayout === "function") { 
            console.log("[Gate Engine] Requirements cleared. Routing layout to Step 1 Overview."); 
            window.switchWizardActiveViewLayout(1); 
            
            // 3. EXECUTE CALCULATION & RENDERING LOOPS AFTER LAYOUT PANEL MOUNTS UNHIDDEN 
            setTimeout(() => { 
                // Enforce synchronization on alternate elements that might have just dynamic mounted 
                alternateSelectors.forEach(id => { 
                    const alternateNode = document.getElementById(id); 
                    if (alternateNode && alternateNode.value !== chosenStateCode) { 
                        alternateNode.value = chosenStateCode; 
                    } 
                }); 
                if (typeof window.processDynamicMarketingLayoutDecorations === "function") { 
                    window.processDynamicMarketingLayoutDecorations(); 
                } 
                if (typeof window.renderStep1CustomFeatureBullets === "function") { 
                    const cleanServiceKey = String(urlParams.get('service') || "").toLowerCase().trim(); 
                    window.renderStep1CustomFeatureBullets(cleanServiceKey); 
                } 
                // ONLY RUN PRICING MATRIX CRAWL PASSES IF AVAILABLE
                if (typeof window.runPricingMatrixDataCrawlPass === "function") { 
                    window.runPricingMatrixDataCrawlPass(); 
                } 
            }, 0); 
        } 
    }); 
} 

// Clean namespace global registration map blocks safely 
window.processJurisdictionGateAdvancement = processJurisdictionGateAdvancement; 

// Hook up pre-flight scanner directly to page initialization loops safely 
document.addEventListener("DOMContentLoaded", () => { 
    // Set brief macro delay to let reference database models compile first 
    setTimeout(() => { 
        if (typeof window.enforceJurisdictionGateEvaluation === "function") { 
            window.enforceJurisdictionGateEvaluation(); 
        } else { 
            console.log("[Gate Engine Discovery] enforceJurisdictionGateEvaluation method not loaded in scope yet."); 
        } 
    }, 60); 
});


// ============================================================================ //
// 📄 FILE: wizard-core-boot.js                                                 //
// 🧲 MODULE: CENTRAL EVENT LISTENER INTERCEPT APP LIFE-CYCLE                  //
// ============================================================================ //
;(function() {
  "use strict";

  // Encapsulate retry state outside the global scope to track boot attempts safely
  let platformLifecycleBootRetryCount = 0;
  const MAX_BOOT_RETRIES = 20; // Hard cutoff after 1 second (20 * 50ms) to prevent thread locking

  function runUnifiedPlatformLifecycleBoot() {
    console.log("[Lifecycle Engine] Triggering application operational boot sequence...");

    // RUNTIME PIPELINE GUARD: Verify configuration rules with absolute safety
    const isCoreDatabaseReady = typeof window.getPricingConfiguration === "function" || 
                                (typeof window.CENTRAL_SERVICE_PLAN_DB === "object" && window.CENTRAL_SERVICE_PLAN_DB !== null);
                                
    if (!isCoreDatabaseReady) {
      platformLifecycleBootRetryCount++;
      if (platformLifecycleBootRetryCount > MAX_BOOT_RETRIES) {
        console.error("[Lifecycle Engine Fatal] Core data configuration failed to initialize within safety timeout window. Aborting boot sequence.");
        return;
      }
      
      console.warn(`[Lifecycle Engine Guard] Core configuration not ready. Attempt ${platformLifecycleBootRetryCount}/${MAX_BOOT_RETRIES}. Retrying in 50ms...`);
      
      // ✅ FIXED: Removed the breaking intermediate semicolon here to repair the callback timer loop!
      setTimeout(function() {
        if (typeof window.runUnifiedPlatformLifecycleBoot === "function") {
          window.runUnifiedPlatformLifecycleBoot();
        }
      }, 50);
      return;
    }

    // Reset retry counter once verified successfully
    platformLifecycleBootRetryCount = 0;

    // Appends outer margins safely without forcing flex definitions that collapse step visibility tracks!
    const wizardContainerElement = document.querySelector(".wizard-container");
    if (wizardContainerElement) {
      wizardContainerElement.style.setProperty('margin', '50px auto 0 auto', 'important');
      wizardContainerElement.style.setProperty('max-width', '1450px', 'important');
      wizardContainerElement.style.setProperty('width', '100%', 'important');
    }

    // Clear out specific visibility properties safely without wiping external third-party classes/inline mutations
    const masterFormElement = document.getElementById("master-onboarding-form") || document.querySelector(".master-onboarding-form");
    if (masterFormElement && masterFormElement.style) {
      if (typeof masterFormElement.style.removeProperty === "function") {
        masterFormElement.style.removeProperty('display');
        masterFormElement.style.removeProperty('width');
        masterFormElement.style.removeProperty('max-width');
      } else {
        masterFormElement.style.display = "";
        masterFormElement.style.width = "";
        masterFormElement.style.maxWidth = "";
      }
    }

    if (typeof window.initializeDynamicChronometerWidget12Hr === "function") {
      window.initializeDynamicChronometerWidget12Hr();
    }
    if (typeof window.generateSecureRuntimeSessionTokenVanilla === "function") {
      window.generateSecureRuntimeSessionTokenVanilla();
    }

    // Initialize tracking layouts database safely
    if (typeof window.autoInjectMainWebsitePricingPlan === "function") {
      window.autoInjectMainWebsitePricingPlan();
    } else if (typeof window.initializeUrlParameterParserEngineVanilla === "function") {
      window.initializeUrlParameterParserEngineVanilla();
    }

    if (typeof window.initializeDigitalSignatureMirrorSync === "function") {
      window.initializeDigitalSignatureMirrorSync();
    }

    // ========================================================================= //
    // DEEP-LINK TIMELINE RESOLUTION GATEWAY (ZERO-HARDCODE REBOOT)              //
    // ========================================================================= //
    const urlParams = new URLSearchParams(window.location.search);
    const hasService = urlParams.get('service');
    const hasPlan = urlParams.get('plan');
    const hasState = urlParams.get('state') || urlParams.get('stateCode');
    const hasStepParam = urlParams.get('step');

    let currentActiveStepIndex = parseInt(window.currentWizardActiveStep, 10);

    // PROGRAMMATIC FEDERAL ROUTING VERIFICATION
    const serviceKeyCheck = String(hasService || window.routeActiveServiceKey || "").toLowerCase().trim();
    const federalPricingDb = window.FILINGS4U_GOVERNMENT_PRICING || {};
    const isFederalServicePath = Object.prototype.hasOwnProperty.call(federalPricingDb, serviceKeyCheck) && serviceKeyCheck !== "llc-formation" && serviceKeyCheck !== "corporations";

    // Determine deep-link eligibility dynamically without hardcoded text blocks
    const isDeepLinkValid = !!(hasService && hasPlan && (hasState || isFederalServicePath));

    // ✅ FIXED: Prioritize checking for active payment confirmations (Stripe return step parameters) before running baseline deep-link checks
    if (hasStepParam === '7' || hasStepParam === '8') {
      console.log("[Lifecycle Engine] Stripe processing success payload detected. Routing straight to Step 8 Receipt Panel.");
      currentActiveStepIndex = 8;
      window.currentWizardActiveStep = 8;
    } else if (isDeepLinkValid) {
      if (isNaN(currentActiveStepIndex) || currentActiveStepIndex <= 1) {
        console.log("[Lifecycle Engine Override] Deep link active. Syncing internal states cleanly to Step 2.");
        currentActiveStepIndex = 2;
        window.currentWizardActiveStep = 2;
      }
    } else if (isNaN(currentActiveStepIndex)) {
      currentActiveStepIndex = 0;
      window.currentWizardActiveStep = 0;
    }

    // Only restore cached form inputs directly here if the current active target view is an active form layer
    if (currentActiveStepIndex !== 2 && currentActiveStepIndex !== 8) {
      if (typeof window.cacheAndRestoreWizardFormStatesVanilla === "function") {
        window.cacheAndRestoreWizardFormStatesVanilla(true);
      }
    }

    if (typeof window.initializeFormDisplayLayoutSync === "function") {
      window.initializeFormDisplayLayoutSync();
    }
    if (typeof window.updateDynamicPricingMatrixVanilla === "function") {
      window.updateDynamicPricingMatrixVanilla();
    }

    // ========================================================================= //
    // VIEW PORT ROUTER TRANSITION DISPATCH (DECOUPLED OVERRIDES)                //
    // ========================================================================= //
    if (typeof window.switchWizardActiveViewLayout === "function") {
      console.log(`[Lifecycle Engine] Transferring runtime thread task to view layout switcher: Step ${currentActiveStepIndex}`);
      if (typeof window.executeStripeBootOverrideGuard === "function") {
        window.executeStripeBootOverrideGuard(currentActiveStepIndex);
      }
      window.switchWizardActiveViewLayout(currentActiveStepIndex);
    } else if (typeof window.renderActiveWizardStepUiLayout === "function") {
      window.renderActiveWizardStepUiLayout();
    } else {
      const fallbackTargetPanel = document.getElementById(`step-panel-${currentActiveStepIndex}`) || document.getElementById(`step-${currentActiveStepIndex}-injection-placeholder`);
      if (fallbackTargetPanel) {
        fallbackTargetPanel.style.setProperty("display", "block", "important");
        fallbackTargetPanel.classList.add("active");
      }
    }

    // Use requestAnimationFrame to ensure the DOM layout engine settles before confirming success
    requestAnimationFrame(() => {
      console.log("[Lifecycle Engine Success] All operational layers initialized safely and painted.");
    });
  }

  // Clean namespace registration map blocks safely
  window.runUnifiedPlatformLifecycleBoot = runUnifiedPlatformLifecycleBoot;
})();



// ============================================================================ //
// 📄 FILE: wizard-core-data.js                                                 //
// 🧲 MODULE: WIZARD MASTER CORE DATA ARCHITECTURE                              //
// ============================================================================ //
;(function() {
  "use strict";

  // ✅ FIXED: Expanded private data vault to natively contain step_8 fields
  const WIZARD_CENTRAL_VAULT = {
    step_0: {},
    step_1: {},
    step_2: { addons: [] },
    step_3: { packages: [], upsells: [] },
    step_4: {},
    step_5: {},
    step_6: {},
    step_7: {},
    step_8: {}
  };

  window.wizardCentralState = {
    updateStepData: function(stepNumber, key, value) {
      const stepKey = `step_${stepNumber}`;
      if (!WIZARD_CENTRAL_VAULT[stepKey]) return;
      WIZARD_CENTRAL_VAULT[stepKey][key] = value;
      this.syncCalculatedTotals();
    },
    getStepData: function(stepNumber, key) {
      const stepKey = `step_${stepNumber}`;
      if (!WIZARD_CENTRAL_VAULT[stepKey]) return null;
      return WIZARD_CENTRAL_VAULT[stepKey][key] || null;
    },
    syncCalculatedTotals: function() {
      let finalCalculatedSum = 0;

      // Extract validated step 2 addon pricing totals
      const step2Addons = WIZARD_CENTRAL_VAULT.step_2.addons || [];
      step2Addons.forEach(item => {
        finalCalculatedSum += (parseFloat(item.price) || 0);
      });

      // Extract validated step 3 upsell/package totals
      const step3Upsells = WIZARD_CENTRAL_VAULT.step_3.upsells || [];
      step3Upsells.forEach(item => {
        finalCalculatedSum += (parseFloat(item.price) || 0);
      });

      window.computedWizardGrandTotalAmount = finalCalculatedSum;
      window.wizardCalculatedFinalTotalAmount = finalCalculatedSum;

      if (typeof window.executeMarketplaceSummaryRenderLoop === "function") {
        window.executeMarketplaceSummaryRenderLoop();
      }
    }
  };
})();

// ============================================================================ //
// 🗺️ MODULE: MULTI-SIDEBAR TIMELINE NAV LIGHTS ENGINE                          //
// ============================================================================ //
function updateApplicationMapTimelineBubbles(currentStepIndex) {
  "use strict";

  let determinedActiveStepIndex = parseInt(currentStepIndex, 10);
  if (isNaN(determinedActiveStepIndex)) {
    determinedActiveStepIndex = 0;
  }

  const currentActivePanel = document.querySelector(".wizard-panel.active") || 
                             document.querySelector(".wizard-step-container-block.active") || 
                             document.querySelector("[id*='step-panel-'].active") || 
                             document.querySelector("[id*='step-'].active");
                             
  if (currentActivePanel && currentActivePanel.id) {
    const numericalMatch = currentActivePanel.id.match(/\d+/);
    if (numericalMatch) {
      determinedActiveStepIndex = parseInt(numericalMatch[0], 10);
    }
  }

  console.log(`[Multi-Sidebar Progress] Illuminating timeline nodes contextually for step: ${determinedActiveStepIndex}`);

  for (let i = 0; i <= 8; i++) {
    const rowNodes = document.querySelectorAll(`#timeline-row-${i}`);
    
    // ✅ FIXED: Safely bypass loops if the HTML structure doesn't define row nodes up to index 8
    if (!rowNodes || rowNodes.length === 0) continue;

    rowNodes.forEach(rowNode => {
      if (!rowNode) return;
      const dotNode = rowNode.querySelector(".toc-dot");
      const titleNode = rowNode.querySelector(".toc-step-title");

      if (dotNode) {
        dotNode.style.removeProperty("background-color");
        dotNode.style.removeProperty("border");
        dotNode.style.removeProperty("box-shadow");
      }
      if (titleNode) {
        titleNode.style.setProperty("color", "#64748b", "important");
        titleNode.style.setProperty("font-weight", "500", "important");
      }

      if (i === determinedActiveStepIndex) {
        if (dotNode) {
          dotNode.style.setProperty("background-color", "#10b981", "important");
          dotNode.style.setProperty("border", "3px solid #10b981", "important");
          dotNode.style.setProperty("box-shadow", "0 0 0 4px rgba(16, 185, 129, 0.25)", "important");
        }
        if (titleNode) {
          titleNode.style.setProperty("color", "#10b981", "important");
          titleNode.style.setProperty("font-weight", "800", "important");
        }
      } else if (i < determinedActiveStepIndex) {
        if (dotNode) {
          dotNode.style.setProperty("background-color", "#10b981", "important");
          dotNode.style.setProperty("border", "3px solid #10b981", "important");
        }
        if (titleNode) {
          titleNode.style.setProperty("color", "#0a1f44", "important");
          titleNode.style.setProperty("font-weight", "700", "important");
        }
      } else {
        if (dotNode) {
          dotNode.style.setProperty("background-color", "#e2e8f0", "important");
          dotNode.style.setProperty("border", "3px solid #e2e8f0", "important");
        }
      }
    });
  }
}

window.updateApplicationMapTimelineBubbles = updateApplicationMapTimelineBubbles;

// ============================================================================ //
// 🔒 MODULE: HARDENED CUSTOMER ACCOUNT VERIFICATION CORE                        //
// ============================================================================ //
/**
 * Validates step data and checks if a user profile already exists in Supabase.
 * @returns {Promise<{exists: boolean, email: string}>}
 */
async function verifyCustomerAndCheckAccount() {
  const emailInput = document.getElementById("lead_email")?.value || 
                     document.getElementById("portal_user_email")?.value || 
                     document.querySelector(".master-onboarding-form input[type='email']")?.value || 
                     document.querySelector("#wizard-account-generation-form input[type='email']")?.value || "";
                     
  const customerEmail = emailInput.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!customerEmail || !emailRegex.test(customerEmail)) {
    throw new Error("Invalid format parameters: Provide a functional email value.");
  }

  const supabaseClient = window.getSuccessPageSupabaseClient ? 
                         window.getSuccessPageSupabaseClient() : 
                         (window.supabaseClientInstance || window.supabase || window.supabaseClient || window.sb);
                         
  if (!supabaseClient) throw new Error("Database interface offline.");

  try {
    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('id, email')
      .eq('email', customerEmail)
      .maybeSingle();

    if (error) throw error;

    if (profile) {
      console.log("[Wizard Core Verification] Existing customer identified:", customerEmail);
      window.f4uIsReturningCustomer = true;
      window.f4uExistingUserId = profile.id;
      
      localStorage.setItem("f4u_is_returning_customer", "true");
      localStorage.setItem("f4u_returning_customer_email", customerEmail);
      return { exists: true, email: customerEmail };
    } else {
      console.log("[Wizard Core Verification] Unregistered guest user trajectory.");
      window.f4uIsReturningCustomer = false;
      window.f4uExistingUserId = null;
      
      localStorage.setItem("f4u_is_returning_customer", "false");
      localStorage.removeItem("f4u_returning_customer_email");
      // ✅ FIXED: Restored complete syntax object return and handled error exceptions safely
      return { exists: false, email: customerEmail };
    }
  } catch(dbError) {
    console.error("[Wizard Core Verification Error] Handled profile lookups loop exception safely:", dbError);
    return { exists: false, email: customerEmail };
  }
}

window.verifyCustomerAndCheckAccount = verifyCustomerAndCheckAccount;
