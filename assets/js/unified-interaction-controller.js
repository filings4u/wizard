// ============================================================================ 
// FILE: assets/js/unified-interaction-controller.js (PART 1 OF 3)
// MODULE: POST-PURCHASE SCOPED HARVESTER & HARDWARE STYLE INJECTOR
// ============================================================================ 
(function() { 
    "use strict"; 

    // 1️⃣ HARDWARE-ACCELERATED SHAKE STYLE INJECTOR 
    (function injectUnifiedValidationStyles() { 
        if (document.getElementById("f4u-validation-shake-keyframes")) return; 
        const styleTag = document.createElement("style"); 
        styleTag.id = "f4u-validation-shake-keyframes"; 
        styleTag.textContent = ` 
            @keyframes f4uFieldValidationErrorShakePass { 
                0%, 100% { transform: translateX(0); } 
                20%, 60% { transform: translateX(-6px); } 
                40%, 80% { transform: translateX(6px); } 
            } 
            .field-error-shake { 
                animation: f4uFieldValidationErrorShakePass 0.35s ease-in-out !important; 
                border: 1px solid #ef4444 !important; 
                background-color: #fef2f2 !important; 
            } 
        `; 
        document.head.appendChild(styleTag); 
    })(); 

    // 2️⃣ DYNAMIC ACCURATE VIEWPORT SCOPED SCRAPER FIELD HARVESTER 
    window.processUniversalWizardPurchaseFulfillment = async function(checkoutDetails) { 
        console.log("[Inbound Ingestion] Processing form extraction pass across active service layout fields..."); 
        
        var activeStepIdx = "6";
        if (window.f4uMasterInstanceApp && window.f4uMasterInstanceApp.currentStep) {
            activeStepIdx = String(window.f4uMasterInstanceApp.currentStep);
        } else if (window.currentWizardActiveStep) {
            activeStepIdx = String(window.currentWizardActiveStep);
        } else if (localStorage.getItem("f4u_active_wizard_step_index")) {
            activeStepIdx = String(localStorage.getItem("f4u_active_wizard_step_index"));
        }

        const txRecord = checkoutDetails || {}; 
        const orderId = txRecord.orderId || txRecord.id || localStorage.getItem("tracking_number") || "F4U-" + Date.now(); 
        const checkoutTotal = parseFloat(txRecord.total || txRecord.amount || localStorage.getItem("f4u_running_total") || 0).toFixed(2); 
        
        const clientEmail = txRecord.email || document.getElementById("email")?.value || document.getElementById("portal_user_email_input")?.value || ""; 
        const clientPhone = txRecord.phone || document.getElementById("phone_number")?.value || document.getElementById("portal_user_phone")?.value || ""; 
        const serviceIdentifier = window.routeActiveServiceKey || document.querySelector("input[name='service_key_id']")?.value || "unknown-service-line"; 
        const entityTargetName = document.getElementById("company_name")?.value || document.getElementById("portal_user_company_name")?.value || "N/A"; 
        
        const harvestedPayload = { 
            tracking_number: orderId, 
            email_address: clientEmail, 
            phone_number: clientPhone, 
            company_name: entityTargetName, 
            selected_plan: serviceIdentifier, 
            total_fee: checkoutTotal 
        }; 

        const activePanelContainer = document.getElementById("step-panel-" + activeStepIdx) || document.getElementById("step-panel-6") || document.body; 
        const allWizardInputs = activePanelContainer.querySelectorAll("input, select, textarea"); 

        allWizardInputs.forEach(input => { 
            if (input.id && input.type !== "button" && input.type !== "submit") { 
                let valStr = ""; 
                if (input.type === "checkbox") { 
                    harvestedPayload[input.id] = input.checked; 
                    localStorage.setItem("wizard_field_" + input.id, input.checked ? "true" : "false"); 
                } else if (input.type === "radio") { 
                    if (input.checked) { 
                        valStr = input.value.trim(); 
                        harvestedPayload[input.name || input.id] = valStr; 
                        localStorage.setItem(input.name || input.id, valStr); 
                    } 
                } else { 
                    valStr = input.value.trim(); 
                    if (valStr !== "") { 
                        harvestedPayload[input.id] = valStr; 
                        localStorage.setItem("wizard_field_" + input.id, valStr); 
                        if (input.id !== "state" && input.id !== "email") {
                            localStorage.setItem(input.id, valStr); 
                        }
                    } 
                } 
            } 
        });
        // 3️⃣ BUILD DATA MODEL SCHEMA MAPPED PRECISELY TO YOUR BACKEND COLUMNS 
        const activeFirst = document.getElementById("first_name")?.value?.trim() || document.getElementById("portal_user_first_name")?.value?.trim() || localStorage.getItem("wizard_field_first_name") || "";
        const activeLast = document.getElementById("last_name")?.value?.trim() || document.getElementById("portal_user_last_name")?.value?.trim() || localStorage.getItem("wizard_field_last_name") || "";
        const activePhone = document.getElementById("phone_number")?.value?.trim() || document.getElementById("portal_user_phone")?.value?.trim() || localStorage.getItem("wizard_field_phone_number") || "";
        const activeStreet = document.getElementById("street_address")?.value?.trim() || document.getElementById("portal_user_street")?.value?.trim() || localStorage.getItem("wizard_field_street_address") || "";
        const activeCity = document.getElementById("city")?.value?.trim() || document.getElementById("portal_user_city")?.value?.trim() || localStorage.getItem("wizard_field_city") || "";
        const activeZip = document.getElementById("zip_code")?.value?.trim() || document.getElementById("portal_user_zip")?.value?.trim() || localStorage.getItem("wizard_field_zip_code") || "";

        const submissionRecord = { 
            tracking_number: orderId, 
            first_name: activeFirst || "Valued",
            last_name: activeLast || "Customer",
            email_address: clientEmail.trim().toLowerCase(), 
            phone_number: activePhone || "Not Provided", 
            company_name: entityTargetName, 
            street_address: activeStreet || "Not Provided",
            city: activeCity || "Not Provided",
            state: harvestedPayload.state || localStorage.getItem("schema_orders_principal_state") || "IL",
            zip_code: activeZip || "00000",
            selected_plan: serviceIdentifier, 
            total_paid_amount: parseFloat(checkoutTotal) || 0.00,
            account_created: false
        }; 

        const SUPABASE_URL = window.FILINGS4U_SUPABASE_URL || "https://lrbimrlbskjweynxlgas.supabase.co"; 
        const SUPABASE_ANON_KEY = window.FILINGS4U_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmltcmxic2tqd2V5bnhsZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjQ0NTYsImV4cCI6MjA5NDEwMDQ1Nn0.I8fQ6ZjA9oaTqJCF-7Z7vUboXC8zv2cogBv4PC_1ihU"; 

        try { 
            const targetEndpointUrl = SUPABASE_URL + "/rest/v1/orders"; 
            const response = await fetch(targetEndpointUrl, { 
                method: "POST", 
                headers: { 
                    "Content-Type": "application/json", 
                    "apikey": SUPABASE_ANON_KEY, 
                    "Authorization": "Bearer " + SUPABASE_ANON_KEY, 
                    "Prefer": "return=representation" 
                }, 
                body: JSON.stringify(submissionRecord) 
            }); 

            if (!response.ok) {
                const errText = await response.text();
                throw new Error("Database REST Ingestion Error [" + response.status + "]: " + errText); 
            }

            const successPageReceiptManifest = { 
                tracking_number: orderId, 
                customer_email: clientEmail, 
                financials_subtotal_amount: checkoutTotal, 
                financials_grand_total_charge: checkoutTotal, 
                selected_package_title: serviceIdentifier || "Compliance Registration Order", 
                filing_state: submissionRecord.state
            }; 
            sessionStorage.setItem("f4u_finalized_checkout_receipt_manifest", JSON.stringify(successPageReceiptManifest)); 
            console.log("✅ Success manifest securely written to sessionStorage. Unblocking step 8 itemizers."); 
            
            return harvestedPayload; 
        } catch (error) { 
            console.error("[Inbound Ingestion] Ingestion failure. Activating safety shield recovery...", error); 
            localStorage.setItem("backup_order_recovery_" + orderId, JSON.stringify(submissionRecord)); 
            
            const fallbackManifest = { 
                tracking_number: orderId, 
                customer_email: clientEmail, 
                financials_subtotal_amount: checkoutTotal, 
                financials_grand_total_charge: checkoutTotal, 
                selected_package_title: serviceIdentifier || "Compliance Registration Order",
                filing_state: localStorage.getItem("schema_orders_principal_state") || "IL"
            }; 
            sessionStorage.setItem("f4u_finalized_checkout_receipt_manifest", JSON.stringify(fallbackManifest)); 
            
            return harvestedPayload; 
        } 
    };
    // 4️⃣ UNIFIED PROFILE FIELD VALIDATOR ENGINE (REAL PRODUCTION IDS) 
    window.validateBaseProfileMatrix = function() { 
        let textFieldsValid = true; 
        const inputs = ["first_name", "last_name", "email", "phone_number"]; 
        const stripeBox = document.getElementById("stripe-payment-element-mount-point"); 
        
        if (stripeBox) stripeBox.classList.remove("field-error-shake"); 
        inputs.forEach(id => { 
            const node = document.getElementById(id); 
            if (node) node.classList.remove("field-error-shake"); 
        }); 
        
        void document.body.offsetWidth; 
        
        inputs.forEach(id => { 
            const field = document.getElementById(id); 
            if (field) { 
                const fieldVal = field.value ? field.value.trim() : ""; 
                if (!fieldVal || (field.required && !field.checkValidity())) { 
                    field.classList.add("field-error-shake"); 
                    textFieldsValid = false; 
                } 
            } 
        }); 
        
        if (!textFieldsValid && stripeBox) stripeBox.classList.add("field-error-shake"); 
        return textFieldsValid; 
    }; 

    // 5️⃣ TRANSACTION PROCESS CONTROLLER EVENT SUBMISSION 
    window.attachSubmitButtonController = function() { 
        const cleanBtn = document.getElementById("wizardSubmitBtnElement") || document.getElementById("f4u-submit-profile-btn"); 
        if (!cleanBtn) return; 

        window.f4u_active_submit_handler = async (clickEvent) => { 
            if (clickEvent) { 
                clickEvent.preventDefault(); 
                clickEvent.stopPropagation(); 
            } 

            const errorBanner = document.getElementById("step6-error-banner-target") || document.getElementById("err_profile_email"); 
            if (errorBanner) errorBanner.style.display = "none"; 

            if (typeof window.validateBaseProfileMatrix === "function" && !window.validateBaseProfileMatrix()) { 
                console.warn("[Submit Validation] Pipeline aborted. Fields missing."); 
                if (errorBanner) { 
                    errorBanner.innerText = "Please complete all required contact fields before processing payment."; 
                    errorBanner.style.display = "block"; 
                } 
                return false; 
            } 

            cleanBtn.disabled = true; 
            cleanBtn.style.opacity = "0.6"; 
            cleanBtn.innerHTML = "Processing Transaction <i class='fa-solid fa-spinner fa-spin' style='margin-left: 6px;'></i>"; 

            try { 
                const resolvedFinalTotal = parseFloat( 
                    window.computedWizardGrandTotalAmount || window.wizardCalculatedFinalTotalAmount || localStorage.getItem("f4u_running_total") || 0 
                ); 
                const activeCartMetadata = localStorage.getItem("f4u_active_cart_itemized_rows") || "[]"; 

                if (window.currentOrderCorePayload) { 
                    window.currentOrderCorePayload.email = document.getElementById("email")?.value.trim() || ""; 
                    window.currentOrderCorePayload.total_fee = resolvedFinalTotal; 
                    window.currentOrderCorePayload.collected_payload_metadata = { 
                        first_name: document.getElementById("first_name")?.value.trim() || "", 
                        last_name: document.getElementById("last_name")?.value.trim() || "", 
                        phone: document.getElementById("phone_number")?.value.trim() || "", 
                        wizard_step_checkpoint: 6, 
                        itemized_receipt_rows: JSON.parse(activeCartMetadata), 
                        timestamp_capture: new Date().toISOString() 
                    }; 
                } 

                if (typeof window.executeOnboardingTransactionPayloadSubmitVanilla === "function") { 
                    console.log("[Stripe Pipeline] Running vanilla payload submit..."); 
                    await window.executeOnboardingTransactionPayloadSubmitVanilla(clickEvent); 
                } else if (typeof window.executeSecurePaymentConfirmationPipeline === "function") { 
                    console.log("[Stripe Pipeline] Running secure confirmation pipeline..."); 
                    await window.executeSecurePaymentConfirmationPipeline(resolvedFinalTotal, cleanBtn); 
                } else { 
                    const extracted = await window.processUniversalWizardPurchaseFulfillment(); 
                    if (extracted) { 
                        window.onbeforeunload = null; 

                        if (window.f4uMasterInstanceApp) { 
                            window.f4uMasterInstanceApp.currentStep = 7; 
                        } else { 
                            window.currentWizardActiveStep = 7; 
                            localStorage.setItem("f4u_active_wizard_step_index", "7"); 
                            
                            if (typeof window.executeStepTransitionIndex7 === "function") { 
                                window.executeStepTransitionIndex7(); 
                            } else { 
                                document.querySelectorAll("[id^='step-panel-']").forEach(panel => panel.style.display = "none"); 
                                const step7Panel = document.getElementById("step-panel-7") || document.getElementById("step-7-injection-placeholder"); 
                                if (step7Panel) { 
                                    step7Panel.style.display = "block"; 
                                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                                    if (typeof window.initializeStep7AccountCreation === "function") { 
                                        window.initializeStep7AccountCreation(); 
                                    } 
                                } 
                            } 
                        } 
                    } else { 
                        throw new Error("Database fulfillment submission rejected data packet."); 
                    } 
                } 
            } catch (pipelineException) { 
                console.error("[Stripe Runtime Pipeline Error]", pipelineException); 
                if (errorBanner) { 
                    errorBanner.innerText = pipelineException.message || "An unexpected processing error occurred."; 
                    errorBanner.style.display = "block"; 
                } 
                cleanBtn.disabled = false; 
                cleanBtn.style.opacity = "1"; 
                cleanBtn.innerHTML = "Secure Payment <i class='fa-solid fa-credit-card' style='margin-left: 6px;'></i>"; 
            } 
            return false; 
        }; 
        cleanBtn.addEventListener("click", window.f4u_active_submit_handler); 
        console.log("Base layout controller attached."); 
    }; 

    // 6️⃣ MASTER CORE INITIALIZATION GATEWAY 
    window.bootloaderRuntimeGate = function() { 
        const currentStep = (typeof window.currentWizardActiveStep === "number") ? window.currentWizardActiveStep : parseInt(localStorage.getItem("f4u_active_wizard_step_index") || "0", 10); 
        if (currentStep !== 6 && currentStep !== 7) return; 
        setTimeout(() => { 
            if (typeof window.initializeFlatStripeCheckoutElement === "function") { 
                window.initializeFlatStripeCheckoutElement(); 
                setTimeout(window.attachSubmitButtonController, 60); 
            } else { 
                window.attachSubmitButtonController(); 
            } 
        }, 100); 
    }; 

    if (document.readyState === "loading") { 
        document.addEventListener("DOMContentLoaded", window.bootloaderRuntimeGate); 
    } else { 
        window.bootloaderRuntimeGate(); 
    } 
})();
