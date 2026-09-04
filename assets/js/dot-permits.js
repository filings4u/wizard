/**
 * Filings4U Platform Architecture
 * Module: dot-permits-fresh.js
 * Part 1: Grid Override Styles, Framework Init, & Single-Column Layouts
 */
function initDotPermitsService() {
    window.formRegistry = window.formRegistry || {};

    window.formRegistry['dot-permits-part1-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
            <style>
                /* Completely breaks out of the squashed parent grid to force a clean full-width column stack */
                .wizard-form-fullwidth-force-wrapper {
                    grid-column: span 2 !important;
                    width: 100% !important;
                    display: block !important;
                    box-sizing: border-box !important;
                    clear: both !important;
                }
                .prm-fresh-row {
                    width: 100% !important;
                    box-sizing: border-box;
                    margin-bottom: 20px;
                }
                .prm-fresh-flex-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 16px;
                    width: 100%;
                    box-sizing: border-box;
                    margin-top: 14px;
                }
            </style>
            
            <div class="wizard-form-fullwidth-force-wrapper">
                <div class="prm-fresh-row" style="background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 16px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate);">
                    <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-shield-halved"></i> DOT Multi-State Permitting &amp; Regulatory Verification Portal</strong>
                    Interstate motor carriers must secure active operating permits matching their freight classification. Operating oversized loads or driving through non-IFTA jurisdictions without valid credentials results in safety fines.
                </div>
                
                <div class="prm-fresh-row" style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
                    <h3 style="color: var(--navy); font-size: 1.15rem; font-weight: 800; margin: 0;">1. Carrier Identity &amp; Operating Credentials</h3>
                </div>

                <div class="wizard-input-group prm-fresh-row" style="margin-top: 14px;">
                    <label for="prm_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Official Carrier Legal Name <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="prm_legal_name" required placeholder="Enter exact legal name matching state registration and USDOT profile" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-weight: 600;">
                    <div class="wizard-error-message" id="err_prm_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>

                <div class="prm-fresh-row prm-fresh-flex-grid">
                    <div class="wizard-input-group" style="margin: 0;">
                        <label for="prm_usdot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">USDOT Number <span style="color: #ef4444;">*</span></label>
                        <input type="text" id="prm_usdot_number" required placeholder="e.g. 1234567" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-weight: 600;">
                        <div class="wizard-error-message" id="err_prm_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                    </div>
                    <div class="wizard-input-group" style="margin: 0;">
                        <label for="prm_tax_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Federal Tax ID (EIN) <span style="color: #ef4444;">*</span></label>
                        <input type="text" id="prm_tax_ein" required placeholder="e.g. 12-3456789" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-weight: 600;">
                        <div class="wizard-error-message" id="err_prm_tax_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                    </div>
                    <div class="wizard-input-group" style="margin: 0;">
                        <label for="prm_base_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Corporate Home Base State <span style="color: #ef4444;">*</span></label>
                        <select id="prm_base_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; height: 40px;">
                            <option value="" disabled selected>Select Base State...</option>
                            ${stateDropdownOptionsHtml}
                        </select>
                        <div class="wizard-error-message" id="err_prm_base_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                    </div>
                </div>
            </div>
        `;
    };

    window.formRegistry['dot-permits-part2-layout'] = function() {
        return `
            <div class="wizard-form-fullwidth-force-wrapper">
                <div class="prm-fresh-row" style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
                    <h3 style="color: var(--navy); font-size: 1.15rem; font-weight: 800; margin: 0;">2. Permit Framework Selection</h3>
                </div>
                <div class="prm-fresh-row prm-fresh-flex-grid" style="background: #ffffff; border: 1px solid var(--border, #cbd5e1); padding: 18px; border-radius: 8px; margin-top: 14px;">
                    <div style="display: flex; align-items: flex-start; gap: 10px; width: 100%;">
                        <input type="checkbox" id="prm_check_ucr" name="prm_type_selection" value="ucr" style="margin-top: 3px; cursor: pointer;">
                        <label for="prm_check_ucr" style="font-size: 0.85rem; color: var(--navy); font-weight: 600; cursor: pointer;">UCR Registration compliance verification.</label>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 10px; width: 100%;">
                        <input type="checkbox" id="prm_check_trip" name="prm_type_selection" value="trip" style="margin-top: 3px; cursor: pointer;">
                        <label for="prm_check_trip" style="font-size: 0.85rem; color: var(--navy); font-weight: 600; cursor: pointer;">Single-Trip Permit temporary cross-border authorization.</label>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 10px; width: 100%;">
                        <input type="checkbox" id="prm_check_osow" name="prm_type_selection" value="osow" style="margin-top: 3px; cursor: pointer;" onchange="window.toggleDotPermitOversizeFields(this.checked)">
                        <label for="prm_check_osow" style="font-size: 0.85rem; color: var(--navy); font-weight: 600; cursor: pointer;">Oversize/Overweight triggers dimensional input fields.</label>
                    </div>
                    <div class="wizard-error-message" id="err_prm_type_matrix" style="color: #ef4444; font-size: 0.75rem; grid-column: span 2; margin-top: 4px; display: none; width: 100%;"></div>
                </div>
            </div>
        `;
    };
    window.formRegistry['dot-permits-part3-layout'] = function() {
        return `
            <div class="wizard-form-fullwidth-force-wrapper">
                <div class="prm-fresh-row" style="border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
                    <h3 style="color: var(--navy); font-size: 1.15rem; font-weight: 800; margin: 0;">3. Asset Mapping &amp; Route Metrics</h3>
                </div>

                <div class="prm-fresh-row prm-fresh-flex-grid">
                    <div class="wizard-input-group" style="margin: 0;">
                        <label for="prm_vin_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">17-Digit Asset VIN <span style="color: #ef4444;">*</span></label>
                        <input type="text" id="prm_vin_number" required placeholder="Enter Asset VIN" maxlength="17" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-family: monospace; text-transform: uppercase; font-weight: 600;">
                        <div class="wizard-error-message" id="err_prm_vin_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                    </div>
                    <div class="wizard-input-group" style="margin: 0;">
                        <label for="prm_route_origin" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Route Origin (City, State) <span style="color: #ef4444;">*</span></label>
                        <input type="text" id="prm_route_origin" required placeholder="e.g. Houston, TX" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-weight: 600;">
                        <div class="wizard-error-message" id="err_prm_route_origin" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                    </div>
                    <div class="wizard-input-group" style="margin: 0;">
                        <label for="prm_route_destination" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Route Destination (City, State) <span style="color: #ef4444;">*</span></label>
                        <input type="text" id="prm_route_destination" required placeholder="e.g. Chicago, IL" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-weight: 600;">
                        <div class="wizard-error-message" id="err_prm_route_destination" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                    </div>
                </div>

                <!-- DYNAMIC OS/OW CONTAINER -->
                <div id="prm_dimensional_load_wrapper" style="display: none; flex-direction: column; gap: 16px; margin-top: 16px; width: 100%;">
                    <div style="border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; width: 100%;">
                        <h4 style="color: var(--navy); font-size: 1rem; font-weight: 700; margin: 0;">Oversize / Overweight Configurations</h4>
                    </div>
                    <div class="prm-fresh-flex-grid" style="margin: 0;">
                        <div class="wizard-input-group" style="margin: 0;">
                            <label for="prm_gross_weight" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 6px;">Gross Weight (lbs) <span style="color: #ef4444;">*</span></label>
                            <input type="number" id="prm_gross_weight" placeholder="e.g. 95000" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box;">
                            <div class="wizard-error-message" id="err_prm_gross_weight" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                        </div>
                        <div class="wizard-input-group" style="margin: 0;">
                            <label for="prm_total_width" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 6px;">Total Width <span style="color: #ef4444;">*</span></label>
                            <input type="text" id="prm_total_width" placeholder="e.g. 12ft 6in" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box;">
                            <div class="wizard-error-message" id="err_prm_total_width" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    window.toggleDotPermitOversizeFields = function(isChecked) {
        const wrap = document.getElementById("prm_dimensional_load_wrapper");
        const wInput = document.getElementById("prm_gross_weight");
        const xInput = document.getElementById("prm_total_width");
        if (!wrap) return;
        if (isChecked) {
            wrap.style.setProperty("display", "flex", "important");
            if (wInput) wInput.setAttribute("required", "required");
            if (xInput) xInput.setAttribute("required", "required");
        } else {
            wrap.style.setProperty("display", "none", "important");
            if (wInput) { wInput.removeAttribute("required"); wInput.value = ""; }
            if (xInput) { xInput.removeAttribute("required"); xInput.value = ""; }
        }
    };

    window.formRegistry['dot-permits-form-master'] = function(stateDropdownOptionsHtml = "") {
        return window.formRegistry['dot-permits-part1-layout'](stateDropdownOptionsHtml) +
               window.formRegistry['dot-permits-part2-layout']() +
               window.formRegistry['dot-permits-part3-layout']();
    };

    window.formRegistry['dot-permits-validation'] = {
        requiredFields: [
            { id: 'prm_legal_name', msg: 'Official Carrier Legal Name is required.' },
            { id: 'prm_usdot_number', msg: 'A valid USDOT Number is mandatory.' },
            { id: 'prm_tax_ein', msg: 'Federal Tax ID (EIN) is required.' },
            { id: 'prm_base_state', msg: 'Please select a base state.' },
            { id: 'prm_vin_number', msg: '17-Character Asset VIN is required.' },
            { id: 'prm_route_origin', msg: 'Route Origin city is required.' },
            { id: 'prm_route_destination', msg: 'Route Destination city is required.' }
        ],
        validate: function() {
            let isValid = true;
            let errors = [];
            const setError = (el, msg) => {
                if (!el) return; isValid = false; if (!errors.includes(msg)) errors.push(msg);
                el.style.borderColor = "#ef4444";
                const errNode = document.getElementById("err_" + el.id);
                if (errNode) { errNode.textContent = msg; errNode.style.display = "block"; }
            };
            const clearError = (el) => {
                if (el) { el.style.borderColor = "#cbd5e1"; const errNode = document.getElementById("err_" + el.id); if (errNode) errNode.style.display = "none"; }
            };

            this.requiredFields.forEach(f => {
                const el = document.getElementById(f.id);
                if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
                    if (!el.value.trim()) setError(el, f.msg); else clearError(el);
                }
            });

            const vinEl = document.getElementById("prm_vin_number");
            if (vinEl && vinEl.value.trim().length !== 17) setError(vinEl, "VIN must be exactly 17 characters.");

            const osowBox = document.getElementById("prm_check_osow");
            if (osowBox && osowBox.checked) {
                const w = document.getElementById("prm_gross_weight");
                const x = document.getElementById("prm_total_width");
                if (w && !w.value.trim()) setError(w, "Gross weight is mandatory."); else clearError(w);
                if (x && !x.value.trim()) setError(x, "Total configuration load width is required."); else clearError(x);
            }
            return { isValid, errors };
        }
    };

    window.validateDotPermitsFormMaster = function() {
        return window.formRegistry['dot-permits-validation'].validate().isValid;
    };
}
initDotPermitsService();

