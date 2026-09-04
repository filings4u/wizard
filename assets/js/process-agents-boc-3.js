/**
 * Filings4U Platform Architecture
 * Module: process-agents.boc-3.js (Part 1 of 4)
 * Standalone Section 1 Layout Definition
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['process-agents-boc-3-part1-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- FORCE TOOLTIP TO SPAN FULL ROW WIDTH -->
        <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 20px; width: 100%;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Statutory Process Agent (BOC-3) Mandates</strong>
            The FMCSA strictly mandates that all interstate motor carriers, freight forwarders, and property brokers maintain a valid Form BOC-3 (Designation of Process Agents) on file. This establishes a legal blanket agent network across all 50 states who are authorized to receive legal service of process documents on behalf of your entity. Operating authority remains suspended or inactive until this filing is transmitted electronically.
        </div>

        <!-- SECTION 1 HEADER WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Regulatory Profile Identity</h3>
        </div>

        <!-- FIELD 1: OFFICIAL BUSINESS NAME -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="boc_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Official Legal Company Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="boc_legal_name" required placeholder="Enter exact name registered with the FMCSA or corporate state records" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_boc_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 2: BUNDLE CHECK DROPDOWN -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="boc_bundle_check" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Filing Bundle Association <span style="color: #ef4444;">*</span></label>
            <select id="boc_bundle_check" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none; height: 40px;" onchange="window.toggleBoc3AuthorityIdentifiersVisibility(this.value)">
                <option value="bundled" selected>Bundled Request (Processing with my Trucker/Broker Authority)</option>
                <option value="independent">Independent Order (I already have an active/pending USDOT or MC number)</option>
            </select>
            <div class="wizard-error-message" id="err_boc_bundle_check" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- HIDDEN SUB-GRID FOR INDEPENDENT PROFILE OPTIONS -->
        <div id="boc_authority_nums_wrapper" style="grid-column: span 1; display: none; grid-template-columns: 1fr 1fr; gap: 16px; box-sizing: border-box; margin-top: 16px;">
            <div class="wizard-input-group" style="margin: 0;">
                <label for="boc_usdot_number" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">USDOT Number <span style="color: #ef4444;">*</span></label>
                <input type="text" id="boc_usdot_number" placeholder="Enter USDOT #" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none;">
                <div class="wizard-error-message" id="err_boc_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
            <div class="wizard-input-group" style="margin: 0;">
                <label for="boc_mc_number" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">MC / FF Number <span style="color: #ef4444;">*</span></label>
                <input type="text" id="boc_mc_number" placeholder="e.g. 000000" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none;">
                <div class="wizard-error-message" id="err_boc_mc_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: process-agents.boc-3.js (Part 2 of 4)
 * Standalone Section 2 Layout Definition
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['process-agents-boc-3-part2-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 2 HEADER WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Filing Intent Classification</h3>
        </div>

        <!-- SCOPE OF PROCESS AGENT DESIGNATION DROPDOWN -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="boc_filing_intent" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Scope of Process Agent Designation <span style="color: #ef4444;">*</span></label>
            <select id="boc_filing_intent" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none; height: 40px;">
                <option value="new-blanket" selected>New Blanket Agent Designation (Establish comprehensive 50-state blanket process agent coverage)</option>
                <option value="amendment">Amending an Existing Profile (Update officer addresses or modify previous state-specific agents)</option>
            </select>
            <div class="wizard-error-message" id="err_boc_filing_intent" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- SECTION 3 HEADER WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Principal Place of Business Address</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The FMCSA requires the physical headquarters address where legal notices can be routed.</p>
        </div>

        <!-- HEADQUARTERS STREET ADDRESS INPUT -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="boc_physical_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Headquarters Street Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="boc_physical_street" required placeholder="Street address, suite, unit (FMCSA rules strictly prohibit P.O. Boxes)" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'boc_physical')">
            <div class="wizard-error-message" id="err_boc_physical_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- CITY/STATE/ZIP DATA MATRIX GRID -->
        <div style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
                <div>
                    <label for="boc_physical_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="boc_physical_city" required placeholder="City" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none;">
                    <div class="wizard-error-message" id="err_boc_physical_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="boc_physical_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
                    <select id="boc_physical_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none; height: 40px;">
                        <option value="" disabled selected>Select State...</option>
                        ${stateDropdownOptionsHtml}
                    </select>
                    <div class="wizard-error-message" id="err_boc_physical_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="boc_physical_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="boc_physical_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; outline: none;" class="wizard-input-field">
                    <div class="wizard-error-message" id="err_boc_physical_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
            </div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: process-agents.boc-3.js (Part 3 of 4)
 * Standalone Section 3 Layout Definition
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['process-agents-boc-3-part3-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 4 HEADER WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Authorized Communications Contact</h3>
        </div>

        <!-- CONTACT PERSON NAME INPUT -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="boc_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Contact Person Full Legal Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="boc_contact_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_boc_contact_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- CONTACT PHONE & EMAIL ROWS -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="boc_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Contact Phone Number <span style="color: #ef4444;">*</span></label>
            <input type="tel" id="boc_contact_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_boc_contact_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="boc_contact_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Contact Email Address <span style="color: #ef4444;">*</span></label>
            <input type="email" id="boc_contact_email" required placeholder="compliance@carrier.com" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_boc_contact_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- SECTION 5 HEADER WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Filing Clauses &amp; Attestation</h3>
        </div>

        <!-- MEMO REMARKS TEXTAREA -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <label for="boc_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Special Filing Instructions or Notes</label>
            <textarea id="boc_provisions" placeholder="Detail any immediate operating deadlines, expedited certificate processing needs, cross-border trucking nuances, or custom proxy handling directives..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: process-agents.boc-3.js (Part 4 of 4)
 * Central Form Validation & Render Connections
 */
window.formRegistry = window.formRegistry || {};

// --- COMPONENT MATRIX VALIDATION LAYER ---
window.formRegistry['process-agents-boc-3-validation'] = {
    requiredFields: [
        { id: 'boc_legal_name', msg: 'Official legal company name is required.' },
        { id: 'boc_bundle_check', msg: 'Please select a filing bundle association.' },
        { id: 'boc_filing_intent', msg: 'Please pick a process agent designation filing intent scope.' },
        { id: 'boc_physical_street', msg: 'Headquarters physical street address is required.' },
        { id: 'boc_physical_city', msg: 'City coordinate parameter is required.' },
        { id: 'boc_physical_state', msg: 'Please pick your business headquarters state location.' },
        { id: 'boc_physical_zip', msg: 'Zip Code is required.' },
        { id: 'boc_contact_name', msg: 'Contact person full legal name is required.' },
        { id: 'boc_contact_phone', msg: 'Contact phone number is required.' },
        { id: 'boc_contact_email', msg: 'Contact email address is required.' }
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

        // 1. Process basic presence validation loops
        this.requiredFields.forEach(f => {
            const el = document.getElementById(f.id);
            if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
                if (!el.value.trim()) setError(el, f.msg); else clearError(el);
            }
        });

        // 2. Validate Headquarters Address (Prohibit P.O. Boxes)
        const streetField = document.getElementById('boc_physical_street');
        if (streetField && streetField.value.trim()) {
            const val = streetField.value.trim();
            const poBoxRegex = /\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i;
            if (poBoxRegex.test(val)) {
                setError(streetField, "FMCSA commercial network guidelines prohibit P.O. Boxes for process agent assignments.");
            }
        }

        // 3. Conditional Independent Authority Numbers Validation
        const bundleField = document.getElementById('boc_bundle_check');
        if (bundleField && bundleField.value === "independent") {
            const dotField = document.getElementById('boc_usdot_number');
            const mcField = document.getElementById('boc_mc_number');

            if (dotField) {
                if (!dotField.value.trim()) setError(dotField, "USDOT number is required for standalone processing.");
                else if (!/^\d+$/.test(dotField.value.trim())) setError(dotField, "USDOT parameters must contain numbers only.");
                else clearError(dotField);
            }

            if (mcField) {
                if (!mcField.value.trim()) setError(mcField, "MC or FF operating identifier number is required.");
                else if (!/^\d+$/.test(mcField.value.trim())) setError(mcField, "Operating numbers must contain numeric digits only.");
                else clearError(mcField);
            }
        }

        // 4. Validate Contact Email Pattern Matcher
        const emailField = document.getElementById('boc_contact_email');
        if (emailField && emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
            setError(emailField, "Please supply a valid administrative contact email pattern.");
        }

        return { isValid, errors };
    }
};

// Runtime controller function to handle visibility toggles seamlessly
window.toggleBoc3AuthorityIdentifiersVisibility = function(value) {
    const wrapper = document.getElementById("boc_authority_nums_wrapper");
    const dotField = document.getElementById("boc_usdot_number");
    const mcField = document.getElementById("boc_mc_number");
    if (!wrapper) return;

    if (value === "independent") {
        wrapper.style.setProperty("display", "grid", "important");
        if (dotField) dotField.setAttribute("required", "required");
        if (mcField) mcField.setAttribute("required", "required");
    } else {
        wrapper.style.setProperty("display", "none", "important");
        if (dotField) { dotField.removeAttribute("required"); dotField.value = ""; dotField.style.border = ""; }
        if (mcField) { mcField.removeAttribute("required"); mcField.value = ""; mcField.style.border = ""; }
    }
};

// Backward legacy interface compatibility bridges matching execution paths
window.validateProcessAgentBoc3FormPart1 = function() {
    return window.formRegistry['process-agents-boc-3-validation'].validate().isValid;
};

window.validateProcessAgentBoc3FormParts2And3 = function() {
    return window.formRegistry['process-agents-boc-3-validation'].validate().isValid;
};

window.validateEntireProcessAgentWizard = function() {
    return window.formRegistry['process-agents-boc-3-validation'].validate().isValid;
};

// ============================================================================ //
// ðŸ“¦ MASTER RENDER SYSTEM ALLOCATION
// ============================================================================ //
window.formRegistry['cage-code-form-master'] = function(stateDropdownOptionsHtml = "") {
    return window.formRegistry['process-agents-boc-3-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['process-agents-boc-3-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['process-agents-boc-3-part3-layout'](stateDropdownOptionsHtml);
};

