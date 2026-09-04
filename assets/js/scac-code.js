/**
 * Filings4U Platform Architecture
 * Module: scac-code.js (Restructured Grid Configuration - Part 1)
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['scac-code-banner-snippet'] = function() {
    return `
        <!-- FORCE TOOLTIP TO SPAN FULL ROW WIDTH -->
        <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 20px; width: 100%;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> National Motor Freight Traffic Association SCAC Backplane</strong>
            A Standard Carrier Alpha Code (SCAC) is a unique, mandatory two-to-four-letter code used to identify transportation companies across computerized tracking networks. It is required for border crossing systems (ACE/ACI), processing container interchanges, and integrating EDI channels.
        </div>
    `;
};

window.formRegistry['scac-code-part1-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 1 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Carrier Identity Profile</h3>
        </div>

        <!-- OFFICIAL BUSINESS NAME INPUT (SPAN 2 MAKES IT FULL WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="scac_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Official Business Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="scac_legal_name" required placeholder="Enter exact legal name matching your USDOT profile and state files" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_scac_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- USDOT & AUTHORITY IDS (SPAN 1 EACH TO REMAIN SIDE-BY-SIDE EQUALLY) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="scac_usdot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">USDOT Number <span style="color: #ef4444;">*</span></label>
            <input type="text" id="scac_usdot_number" required placeholder="Enter USDOT Number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_scac_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="scac_mc_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">MC / MX Number (If Applicable)</label>
            <input type="text" id="scac_mc_number" placeholder="e.g., MC-123456" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_scac_mc_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- HEADQUARTER ADDRESS FIELD (FULL WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; box-sizing: border-box;">
            <label for="scac_physical_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Corporate Headquarter Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="scac_physical_street" required placeholder="Street Address, Suite, Unit" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'scac_physical')">
            <div class="wizard-error-message" id="err_scac_physical_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- GEOGRAPHIC CITY/STATE/ZIP CONTAINER SUBGRID (FULL WIDTH ROW WRAPPER) -->
        <div style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
                <div>
                    <label for="scac_physical_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="scac_physical_city" required placeholder="City" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none;">
                    <div class="wizard-error-message" id="err_scac_physical_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="scac_physical_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
                    <select id="scac_physical_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none; height: 40px;">
                        <option value="" disabled selected>Select...</option>
                        ${stateDropdownOptionsHtml}
                    </select>
                    <div class="wizard-error-message" id="err_scac_physical_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="scac_physical_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="scac_physical_zip" required placeholder="Zip" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none;" class="wizard-input-field">
                    <div class="wizard-error-message" id="err_scac_physical_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
            </div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: scac-code.js (Restructured Grid Configuration - Part 2)
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['scac-code-part2-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 2 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Logistics Classification</h3>
        </div>

        <!-- FLEET ASSET OPERATIONAL MODE INPUT (FULL WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="scac_carrier_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Fleet Asset Operational Mode <span style="color: #ef4444;">*</span></label>
            <select id="scac_carrier_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none; height: 40px;">
                <option value="" disabled selected>Select Operational Mode...</option>
                <option value="motor-freight">Motor Common/Contract Carrier (Standard General Freight / Truckload)</option>
                <option value="intermodal">Intermodal Equipment Provider (Chassis / Container interchanges at rail/ocean hubs)</option>
                <option value="broker">Freight Forwarder / Property Brokerage Network</option>
                <option value="broker-carrier">Dual Mode (Operating equipment coupled with separate asset brokerage lines)</option>
            </select>
            <div class="wizard-error-message" id="err_scac_carrier_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- SECTION 3 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Code Prefixes &amp; Integration Channels</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The NMFTA regulates code assignments. Input your primary software integration goals or preferred alpha character paths below.</p>
        </div>

        <!-- ALPHA PREFIX & INTEGRATION CHANNELS (SPAN 1 EACH TO SIT SIDE-BY-SIDE EQUALLY) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="scac_preferred_letters" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Preferred 2-4 Letter Alpha Code Prefix</label>
            <input type="text" id="scac_preferred_letters" placeholder="e.g., ABCD" minlength="2" maxlength="4" style="font-family: monospace; text-transform: uppercase; width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none;" class="wizard-input-field">
            <div class="wizard-error-message" id="err_scac_preferred_letters" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="scac_integration_need" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Primary System Integration Channel <span style="color: #ef4444;">*</span></label>
            <select id="scac_integration_need" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none; height: 40px;">
                <option value="customs" selected>U.S. Customs Border Protection / ACE Portal Manifests</option>
                <option value="rail-ocean">Railroad / Ocean Port Intermodal Container Interchanges (UIIA)</option>
                <option value="government">Military Freight / Defense Logistics Agency (DLA) Billing Mappings</option>
                <option value="edi-commercial">Commercial EDI / Automated Shipper TMS Integration Layouts</option>
            </select>
            <div class="wizard-error-message" id="err_scac_integration_need" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: scac-code.js (Restructured Grid Configuration - Part 3)
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['scac-code-part3-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 4 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Authorized Communications Contact</h3>
        </div>

        <!-- CONTACT PERSON FULL LEGAL NAME (FULL WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="scac_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Contact Person Full Legal Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="scac_contact_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_scac_contact_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- CONTACT PHONE & EMAIL (SPAN 1 EACH TO REMAIN SIDE-BY-SIDE EQUALLY) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="scac_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Contact Phone Number <span style="color: #ef4444;">*</span></label>
            <input type="tel" id="scac_contact_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_scac_contact_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="scac_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Contact Email Address <span style="color: #ef4444;">*</span></label>
            <input type="email" id="scac_contact_email" required placeholder="safety@carriername.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_scac_contact_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- SECTION 5 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Registration Directives</h3>
        </div>

        <!-- SPECIAL HANDLING TEXTAREA (FULL WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="scac_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Special Handling Notes or Integration Instructions</label>
            <textarea id="scac_provisions" placeholder="Detail any specific UIIA requirements, expedited customs deadlines, immediate carrier onboarding codes, or custom proxy handling directives relative to your NMFTA SCAC registration dossier..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
        </div>
    `;
};

// --- CENTRAL SCAC CODE VALIDATION ENGINE MODULE ---
window.formRegistry['scac-code-validation'] = {
    requiredFields: [
        { id: 'scac_legal_name', msg: 'Official business name is required.' },
        { id: 'scac_usdot_number', msg: 'USDOT number is required.' },
        { id: 'scac_physical_street', msg: 'Corporate headquarter address is required.' },
        { id: 'scac_physical_city', msg: 'City detail is required.' },
        { id: 'scac_physical_state', msg: 'Please pick your corporate headquarters state.' },
        { id: 'scac_physical_zip', msg: 'Zip Code is required.' },
        { id: 'scac_carrier_type', msg: 'Please specify an asset operational mode profile.' },
        { id: 'scac_integration_need', msg: 'Please choose a primary system integration channel.' },
        { id: 'scac_contact_name', msg: 'Contact person full legal name is required.' },
        { id: 'scac_contact_phone', msg: 'Contact phone number is required.' },
        { id: 'scac_contact_email', msg: 'Contact email address is required.' }
    ],
    validate: function() {
        let isValid = true;
        let errors = [];

        const setError = (el, msg) => {
            if (!el) return; isValid = false; if (!errors.includes(msg)) errors.push(msg);
            el.style.border = "1px solid #ef4444";
            const errNode = document.getElementById("err_" + el.id);
            if (errNode) { errNode.textContent = msg; errNode.style.display = "block"; }
        };

        const clearError = (el) => {
            if (el) { el.style.border = ""; const errNode = document.getElementById("err_" + el.id); if (errNode) errNode.style.display = "none"; }
        };

        this.requiredFields.forEach(f => {
            const el = document.getElementById(f.id);
            if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
                if (!el.value.trim()) setError(el, f.msg); else clearError(el);
            }
        });

        const dotField = document.getElementById('scac_usdot_number');
        if (dotField && dotField.value.trim() && !/^\d+$/.test(dotField.value.trim())) {
            setError(dotField, "USDOT parameters must contain numbers only.");
        }

        const mcField = document.getElementById('scac_mc_number');
        if (mcField && mcField.value.trim() && !/^(MC|MX)?-?\d+$/.test(mcField.value.trim().toUpperCase())) {
            setError(mcField, "Please provide a valid MC designation layout (e.g., MC-123456).");
        }

        const lettersField = document.getElementById('scac_preferred_letters');
        if (lettersField && lettersField.value.trim() && !/^[A-Z]{2,4}$/.test(lettersField.value.trim().toUpperCase())) {
            setError(lettersField, "Preferred prefixes must consist of exactly 2 to 4 alphabetic characters only.");
        }

        const emailField = document.getElementById('scac_contact_email');
        if (emailField && emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
            setError(emailField, "Please supply a valid communication contact email pattern.");
        }

        return { isValid, errors };
    }
};

// Backward legacy interface compatibility bridges matching execution paths
window.validateScacCodeRegistrationFormPart1 = function() {
    return window.formRegistry['scac-code-validation'].validate().isValid;
};

window.validateScacCodeRegistrationFormParts2And3 = function() {
    return window.formRegistry['scac-code-validation'].validate().isValid;
};

window.validateEntireScacCodeWizard = function() {
    return window.formRegistry['scac-code-validation'].validate().isValid;
};

// ============================================================================ //
// ðŸ“¦ MASTER RENDER SYSTEM ALLOCATION
// ============================================================================ //
window.formRegistry['scac-code-form-master'] = function(stateDropdownOptionsHtml = "") {
    return window.formRegistry['scac-code-banner-snippet']() +
           window.formRegistry['scac-code-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['scac-code-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['scac-code-part3-layout'](stateDropdownOptionsHtml);
};

