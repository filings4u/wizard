/**
 * Filings4U Platform Architecture
 * Module: trucker-insurance-quote.js
 * Part 1: Core Form Initialization & Part 1 Risk Assessment Layout
 */
function initTruckerInsuranceQuoteServices() {
    window.formRegistry = window.formRegistry || {};

    // --- PART 1 LAYOUT: CARRIER RISK ASSESSMENT IDENTITY PROFILE ---
    window.formRegistry['trucker-insurance-quote-part1-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
            <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: TRUCKER INSURANCE CLEARINGHOUSE -->
            <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
                <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Commercial Motor Carrier Insurance Lead Clearinghouse</strong>
                Fulfilling public liability coverage requirements is a federal pre-requisite under FMCSA rules to activate your interstate Operating Authority (Form BMC-91 or BMC-91X). 
                <span style="font-weight: 700; color: var(--primary);">âš  Crucial Disclosing Provision:</span> Filings4u is a specialized commercial document filing service organization. We are not a licensed insurance agency, brokerage, or underwriter, and we do not sell insurance policies directly. All risk profile metrics submitted here are securely routed to our premium licensed insurance entity partners to compile and issue a competitive, non-binding quote tailored to your fleet.
            </div>

            <!-- SECTION 1: CARRIER RISK ASSESSMENT PROFILE -->
            <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
                <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Risk Assessment Identity Profile</h3>
            </div>

            <!-- FIELD 1: OFFICIAL BUSINESS ENTITY NAME -->
            <div class="wizard-input-group" style="grid-column: span 2;">
                <label for="ins_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Business Entity Name <span style="color: #ef4444;">*</span></label>
                <input type="text" id="ins_legal_name" required placeholder="Enter name exactly as registered on your corporate state records or USDOT profile" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
            </div>

            <!-- FIELD 2: USDOT NUMBER (OPTIONAL) -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_usdot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">USDOT Number (If Issued)</label>
                <input type="text" id="ins_usdot_number" placeholder="e.g., 1234567 (Leave blank if pending authority setup)" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
            </div>

            <!-- FIELD 3: GARAGING BASE STATE -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_operation_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Garaging Base State <span style="color: #ef4444;">*</span></label>
                <select id="ins_operation_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                    <option value="" disabled selected>Select Primary State...</option>
                    ${stateDropdownOptionsHtml}
                </select>
            </div>

            <!-- SECTION 2: LIABILITY TARGET THRESHOLDS -->
            <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
                <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Primary Auto Liability Target Thresholds</h3>
            </div>

            <!-- FIELD 4: COMBINED SINGLE LIMIT LIABILITY DROPDOWN -->
            <div class="wizard-input-group" style="grid-column: span 2;">
                <label for="ins_liability_limit" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Combined Single Limit (CSL) Auto Liability Request <span style="color: #ef4444;">*</span></label>
                <select id="ins_liability_limit" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                    <option value="" disabled selected>Select Primary Liability Limit...</option>
                    <option value="750k">$750,000 Combined Single Limit (Standard FMCSA minimum framework for non-hazardous general freight)</option>
                    <option value="1m" selected>$1,000,000 Combined Single Limit (Highly recommended tier required by most freight brokers, shippers, and logistics platforms)</option>
                    <option value="2m">$2,000,000 Combined Single Limit (Extended tier required for specialized contracts or oversize cargo loads)</option>
                    <option value="5m">$5,000,000 Combined Single Limit (Statutory federal minimum requirement for certain hazardous material placard categories)</option>
                </select>
            </div>
        `;
    };
    // --- PART 2 LAYOUT: MOTOR TRUCK CARGO & FLEET RISK PROFILE ---
    window.formRegistry['trucker-insurance-quote-part2-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
            <!-- SECTION 3: CARGO & PHYSICAL DAMAGE THRESHOLDS -->
            <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
                <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Motor Truck Cargo & Physical Damage Limits</h3>
                <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Detail your requested cargo asset coverage parameters to match vendor onboarding verification standards.</p>
            </div>

            <!-- FIELD 1: CARGO LIMIT DROPDOWN -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_cargo_limit" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Motor Truck Cargo Limit <span style="color: #ef4444;">*</span></label>
                <select id="ins_cargo_limit" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                    <option value="" disabled selected>Select Cargo Limit...</option>
                    <option value="50k">$50,000 Cargo Limit (Low-tier local hauling matrix)</option>
                    <option value="100k" selected>$100,000 Cargo Limit (Standard broker contract minimum baseline for dry van / reefer)</option>
                    <option value="250k">$250,000 Cargo Limit (High-value equipment or machinery loads)</option>
                    <option value="500k">$500,000+ Cargo Limit (Specialized electronic or premium pharmaceutical electronics)</option>
                </select>
            </div>

            <!-- FIELD 2: PHYSICAL DAMAGE DROPDOWN -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_physical_damage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Physical Damage Coverage Request? <span style="color: #ef4444;">*</span></label>
                <select id="ins_physical_damage" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                    <option value="yes" selected>Yes, quote Physical Damage (Comprehensive & Collision tracking based on equipment value)</option>
                    <option value="no">No, exclude physical damage (Liability and Cargo parameters only)</option>
                </select>
            </div>

            <!-- SECTION 4: FLEET UNIT & OPERATOR RISK METRICS -->
            <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
                <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Fleet & Driver Underwriting Metrics</h3>
                <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">These structural vehicle metrics allow partners to compute accurate exposure and allocation scores.</p>
            </div>

            <!-- FIELD 3: POWER UNITS NUMERIC FIELD -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_truck_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Number of Power Units (Tractors/Trucks) <span style="color: #ef4444;">*</span></label>
                <input type="number" id="ins_truck_count" required placeholder="1" min="1" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
            </div>

            <!-- FIELD 4: TRAILERS NUMERIC FIELD -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_trailer_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Number of Trailers <span style="color: #ef4444;">*</span></label>
                <input type="number" id="ins_trailer_count" required placeholder="1" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
            </div>

            <!-- FIELD 5: OPERATING RADIUS DROPDOWN -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_operating_radius" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Operating Radius <span style="color: #ef4444;">*</span></label>
                <select id="ins_operating_radius" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                    <option value="local">Local (Under 100 Miles radius from home base)</option>
                    <option value="regional">Regional (100 to 500 Miles radius footprint)</option>
                    <option value="long-haul" selected>Long-Haul / Over-the-Road (OTR - Exceeds 500 Miles nationally)</option>
                </select>
            </div>

            <!-- FIELD 6: MINIMUM DRIVER AGE DROPDOWN -->
            <div class="wizard-input-group" style="grid-column: span 1;">
                <label for="ins_driver_min_age" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Age of Youngest Driver in Fleet <span style="color: #ef4444;">*</span></label>
                <select id="ins_driver_min_age" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                    <option value="under_23">Under 23 Years Old (High exposure tier status)</option>
                    <option value="23_25" selected>23 to 25 Years Old</option>
                    <option value="over_25">Over 25 Years Old (Standard industry preferred tier)</option>
                </select>
            </div>
        `;
    };

    // --- PART 3 LAYOUT: ADDITIONAL PROVISIONS & HISTORY NOTES ---
    window.formRegistry['trucker-insurance-quote-part3-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
            <!-- SECTION 5: ADDITIONAL PROVISIONS & REQUEST SPECIFICS -->
            <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
                <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Handling Directives & Coverage History</h3>
            </div>

            <!-- FIELD 7: OPTIONAL MEMO TEXTAREA -->
            <div class="wizard-input-group" style="grid-column: span 2;">
                <label for="ins_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Quote Instructions, Target Commodities, or Loss History Notes</label>
                <textarea id="ins_provisions" placeholder="Detail any specific equipment makes/models, trailer types (Flatbed, Reefer, Stepdeck), target commodities to haul, prior commercial insurance policy history, or urgent deadline dates for broker onboarding verification..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
            </div>
        `;
    };
    // --- PART 1 VALIDATION MATRIX ENGINE ---
    window.formRegistry['trucker-insurance-quote-part1-validation'] = {
        requiredFields: [
            { id: 'ins_legal_name', msg: 'Official business entity name is required.' },
            { id: 'ins_operation_state', msg: 'Please pick your primary garaging base state.' },
            { id: 'ins_liability_limit', msg: 'Please choose a combined single limit auto liability request tier.' }
        ],
        validate: function() {
            let isValid = true;
            let errors = [];

            const setError = (el, msg) => {
                if (el) el.style.borderColor = "#ef4444";
                isValid = false;
                if (!errors.includes(msg)) errors.push(msg);
            };

            const clearError = (el) => {
                if (el) el.style.borderColor = "#cbd5e1";
            };

            // Process core presence loop validation
            this.requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el) {
                    if (!el.value.trim()) setError(el, field.msg);
                    else clearError(el);
                }
            });

            // Enforce purely numeric evaluation on optional USDOT inputs
            const dotField = document.getElementById('ins_usdot_number');
            if (dotField && dotField.value.trim()) {
                if (!/^\d+$/.test(dotField.value.trim())) {
                    setError(dotField, "USDOT parameter entries must contain numbers only.");
                } else {
                    clearError(dotField);
                }
            }

            return { isValid, errors };
        }
    };

    // --- PARTS 2 AND 3 VALIDATION MATRIX ENGINE ---
    window.formRegistry['trucker-insurance-quote-part2-validation'] = {
        requiredFields: [
            { id: 'ins_cargo_limit', msg: 'Please pick a requested motor truck cargo insurance limit.' },
            { id: 'ins_physical_damage', msg: 'Please specify if you require a physical damage coverage quote.' },
            { id: 'ins_operating_radius', msg: 'Please choose your primary operational hauling radius.' },
            { id: 'ins_driver_min_age', msg: 'Please select the younger fleet driver age benchmark.' }
        ],
        validate: function() {
            let isValid = true;
            let errors = [];

            const setError = (el, msg) => {
                if (el) el.style.borderColor = "#ef4444";
                isValid = false;
                if (!errors.includes(msg)) errors.push(msg);
            };

            const clearError = (el) => {
                if (el) el.style.borderColor = "#cbd5e1";
            };

            // Check standard required items presence profiles
            this.requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el) {
                    if (!el.value.trim()) setError(el, field.msg);
                    else clearError(el);
                }
            });

            // Enforce integer range validation checks on Power Units
            const truckField = document.getElementById('ins_truck_count');
            if (truckField) {
                const val = parseInt(truckField.value, 10);
                if (isNaN(val) || val < 1) {
                    setError(truckField, "Underwriting assessment requires declaring a minimum of 1 truck.");
                } else {
                    clearError(truckField);
                }
            }

            // Enforce integer range validation checks on Fleet Trailers
            const trailerField = document.getElementById('ins_trailer_count');
            if (trailerField) {
                const val = parseInt(trailerField.value, 10);
                if (isNaN(val) || val < 0) {
                    setError(trailerField, "Please enter a valid trailer allocation count (0 or greater).");
                } else {
                    clearError(trailerField);
                }
            }

            return { isValid, errors };
        }
    };

    // Dummy tracking layer to avoid breaking sequential layout execution workflows
    window.formRegistry['trucker-insurance-quote-part3-validation'] = {
        validate: function() { return { isValid: true, errors: [] }; }
    };

    // ============================================================================ //
    // ðŸ“¦ MASTER TRUCKER INSURANCE LEAD APPLICATION ASSEMBLY HOOK
    // ============================================================================ //
    window.formRegistry['trucker-insurance-quote-form-master'] = function(stateDropdownOptionsHtml = "") {
        return window.formRegistry['trucker-insurance-quote-part1-layout'](stateDropdownOptionsHtml) +
               window.formRegistry['trucker-insurance-quote-part2-layout'](stateDropdownOptionsHtml) +
               window.formRegistry['trucker-insurance-quote-part3-layout'](stateDropdownOptionsHtml);
    };

    // Backward compliance compatibility functions for legacy execution routing paths
    window.validateTruckerInsuranceFormPart1 = function() {
        return window.formRegistry['trucker-insurance-quote-part1-validation'].validate().isValid;
    };

    window.validateTruckerInsuranceFormParts2And3 = function() {
        return window.formRegistry['trucker-insurance-quote-part2-validation'].validate().isValid;
    };

    window.validateEntireTruckerInsuranceWizard = function() {
        const p1 = window.validateTruckerInsuranceQuoteFormPart1();
        const p2 = window.validateTruckerInsuranceQuoteFormParts2And3();
        return (p1 && p2);
    };
}

// Global invocation setup initialization engine context
initTruckerInsuranceQuoteServices();

