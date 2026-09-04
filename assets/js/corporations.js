/** * SYSTEM COMPLIANCE SERVICE: CORPORATE FORMATION ENGINE * Step 1: Initialize Unified Form Registries & Core Input Filtering Rules */ 
function initCorporateFormationServices() { 
    window.formRegistry = window.formRegistry || {}; 
    
    // ---------------------------------------------------------------------------- // 
    // SECTION A: PART 1 VALIDATION MATRIX ENGINE // ---------------------------------------------------------------------------- // 
    window.formRegistry['corporations-part1-validation'] = { 
        requiredFields: [ 
            { id: 'corp_proposed_name', errId: 'err_corp_proposed_name', msg: 'Proposed corporation legal name is required.' }, 
            { id: 'corp_business_purpose', errId: 'err_corp_business_purpose', msg: 'Corporate operational intent description is required.' }, 
            { id: 'corp_ra_choice', errId: 'err_corp_ra_choice', msg: 'Please specify your registered agent choice selection.' } 
        ], 
        validate: function() { 
            let isValid = true; 
            let errors = []; 
            
            const markInvalid = (iEl, eEl, msg) => { 
                if (!iEl || !eEl) return; 
                eEl.textContent = msg; 
                eEl.style.setProperty("display", "block", "important"); 
                iEl.style.setProperty("border-color", "#ef4444", "important"); 
                isValid = false; 
                if (!errors.includes(msg)) errors.push(msg); 
            }; 
            
            const markValid = (iEl, eEl) => { 
                if (!iEl || !eEl) return; 
                eEl.textContent = ""; 
                eEl.style.setProperty("display", "none", "important"); 
                iEl.style.setProperty("border-color", "#cbd5e1", "important"); 
            }; 
            
            const isVis = (el) => el && (el.offsetWidth > 0 || el.offsetHeight > 0); 
            
            // Validate base required items 
            this.requiredFields.forEach(f => { 
                const fieldEl = document.getElementById(f.id); 
                const errEl = document.getElementById(f.errId); 
                if (isVis(fieldEl) && errEl) { 
                    (!fieldEl.value.trim()) ? markInvalid(fieldEl, errEl, f.msg) : markValid(fieldEl, errEl); 
                } 
            }); 
            
            // Refactored to separate conditional check from general rules pass
            const nameField = document.getElementById('corp_proposed_name'); 
            const nameErr = document.getElementById('err_corp_proposed_name'); 
            if (isVis(nameField) && nameErr) { 
                const nameValue = nameField.value.trim();
                if (!nameValue) {
                    markInvalid(nameField, nameErr, "Proposed corporation legal name is required.");
                } else if (!/\b(inc(orporated)?|corp(oration)?|co(mpany)?|ltd|limited)\b\.?$/i.test(nameValue)) { 
                    markInvalid(nameField, nameErr, "Corporate names must terminate with a legal suffix designator (e.g., Inc., Corp., Co., Ltd.)."); 
                } 
            }
            // Conditional Custom Registered Agent Fields Verification 
            const raField = document.getElementById('corp_ra_choice'); 
            const wrapper = document.getElementById('corp_custom_ra_wrapper'); 
            const isCustomRASelected = raField && ['custom', 'independent', 'external', 'third_party'].includes(raField.value.toLowerCase()); 
            
            if (wrapper && (wrapper.style.display === "grid" || wrapper.style.display === "block" || isCustomRASelected)) { 
                const fields = [ 
                    { id: 'corp_ra_custom_name', err: 'err_corp_ra_custom_name', msg: "Independent agent name is required." }, 
                    { id: 'corp_ra_custom_street', err: 'err_corp_ra_custom_street', msg: "Agent street physical address is required." }, 
                    { id: 'corp_ra_custom_city', err: 'err_corp_ra_custom_city', msg: "Agent city coordinate parameter is required." }, 
                    { id: 'corp_ra_custom_state', err: 'err_corp_ra_custom_state', msg: "Agent state selection parameter is required." }, 
                    { id: 'corp_ra_custom_zip', err: 'err_corp_ra_custom_zip', msg: "Agent Zip Code is required." } 
                ]; 
                
                fields.forEach(f => { 
                    const el = document.getElementById(f.id); 
                    const err = document.getElementById(f.err); 
                    if (el && err && isVis(el)) { 
                        (!el.value.trim()) ? markInvalid(el, err, f.msg) : markValid(el, err); 
                    } 
                }); 
                
                const agentStreet = document.getElementById('corp_ra_custom_street'); 
                const agentStreetErr = document.getElementById('err_corp_ra_custom_street'); 
                if (agentStreet && isVis(agentStreet) && agentStreet.value.trim() && agentStreetErr) { 
                    if (/\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i.test(agentStreet.value.trim())) { 
                        markInvalid(agentStreet, agentStreetErr, "Statutory rules reject P.O. Box listings for registered offices. Provide a physical street address."); 
                    } 
                } 
                
                const agentZip = document.getElementById('corp_ra_custom_zip'); 
                const agentZipErr = document.getElementById('err_corp_ra_custom_zip'); 
                if (agentZip && isVis(agentZip) && agentZip.value.trim() && agentZipErr && !/^\d{5}$/.test(agentZip.value.trim())) { 
                    markInvalid(agentZip, agentZipErr, "Registered agent zip code must be exactly 5 digits."); 
                } 
            } 
            
            // Dynamic Node Scanner loops over all active shareholder card entries dynamically 
            document.querySelectorAll("input[id^='shareholder_first_name_']").forEach(inputEl => { 
                if (isVis(inputEl)) { 
                    const idx = inputEl.id.replace("shareholder_first_name_", ""); 
                    const errNode = document.getElementById("err_shareholder_first_name_" + idx); 
                    if (errNode) { 
                        (!inputEl.value.trim()) ? markInvalid(inputEl, errNode, `Shareholder first name is required.`) : markValid(inputEl, errNode); 
                    } 
                } 
            }); 
            
            document.querySelectorAll("input[id^='shareholder_last_name_']").forEach(inputEl => { 
                if (isVis(inputEl)) { 
                    const idx = inputEl.id.replace("shareholder_last_name_", ""); 
                    const errNode = document.getElementById("err_shareholder_last_name_" + idx); 
                    if (errNode) { 
                        (!inputEl.value.trim()) ? markInvalid(inputEl, errNode, `Shareholder last name is required.`) : markValid(inputEl, errNode); 
                    } 
                } 
            }); 
            
            return { isValid, errors }; 
        } 
    };


// ---------------------------------------------------------------------------- // 
// SECTION B: PART 1 LAYOUT ENGINE MATRIX 
// ---------------------------------------------------------------------------- // 
window.formRegistry['corporations-part1-layout'] = function(stateDropdownOptionsHtml = "") { 
    const centralRegistrySource = window.CENTRAL_ADDON_DB || window.UPSELL_ADDON_REGISTRY || {}; 
    const agentMetaRecord = centralRegistrySource["customSelectedRegisteredAgentServiceActive"] || {}; 
    const liveAgentFee = parseFloat(agentMetaRecord.price || 75.00).toFixed(2); 
    const blankStatesHtml = stateDropdownOptionsHtml || '<option value="" disabled selected>-- Select State --</option><option value="WY">Wyoming</option><option value="DE">Delaware</option><option value="NV">Nevada</option>'; 
    
    return ` 
    <!-- CONTEXT-AWARE INTRODUCTORY TOOLTIP BANNER --> 
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 12px;"> 
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Corporation Formation?</strong> Incorporating sets up a distinct legal personhood asset envelope. This structure separates corporate assets from personal assets, shields equity positions, and establishes a rigid authorized share tracking matrix natively. 
    </div> 
    
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 12px;"> 
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Corporate Business Information</h3> </div> 
        
    <!-- FIELD 1: PROPOSED NAME --> 
    <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="corp_proposed_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Proposed Corporation Name <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="corp_proposed_name" required placeholder="Example Enterprises Inc." class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_corp_proposed_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        <span style="font-size: 0.7rem; color: var(--slate, #64748b); font-weight: 500; padding-left: 2px;">Must include an official corporate ending designator (e.g. Inc., Corp., Co., Ltd.).</span> 
    </div> 
    
    <!-- FIELD 2: CORPORATE BUSINESS PURPOSE --> 
    <div class="wizard-input-group" style="grid-column: span 1;"> 
        <label for="corp_business_purpose" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Corporate Business Purpose <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="corp_business_purpose" required placeholder="Brief description of operations..." class="wizard-input-field" style="width: 100%; box-sizing: border-box;"> 
        <div class="wizard-error-message" id="err_corp_business_purpose" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        <span style="font-size: 0.7rem; color: var(--slate, #64748b); font-weight: 500; padding-left: 2px;">A brief description of your planned industry or trade activities.</span> 
    </div> 
    
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Registered Agent Information</h3> 
    </div>
    <!-- CONTEXT-AWARE AGENT TOOLTIP BANNER --> 
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 4px;"> 
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Registered Agent?</strong> States require corporations to designate a local physical location receiver. This person or service must stay open during regular business hours to accept legal notices, Service of Process (SOP), and state updates. 
    </div> 
    
    <!-- FIELD 3: REGISTERED AGENT PROVISION DROPDOWN --> 
    <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;"> 
        <label for="corp_ra_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Select Registered Agent Provision <span style="color: #ef4444;">*</span></label> 
        <select id="corp_ra_choice" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2; vertical-align: middle;"> 
            <option value="" disabled>Choose...</option> 
            <option value="filings4u" selected>Utilize Filings4u Protected Agent Shield Service â€” $${liveAgentFee} / Year</option> 
            <option value="custom">Maintain External Independent Third-Party Registered Agent</option> 
        </select> 
        <div class="wizard-error-message" id="err_corp_ra_choice" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div> 
    
    <!-- REFACTORED HIDDEN WORKSPACE: INDEPENDENT THIRD-PARTY AGENT PROFILES --> 
    <div id="corp_custom_ra_wrapper" style="grid-column: span 2; display: none; grid-template-columns: repeat(2, 1fr); gap: 20px; background: rgba(10, 31, 68, 0.01); padding: 20px; border-radius: 8px; border: 1px solid var(--border, #e2e8f0); box-sizing: border-box; width: 100%;"> 
        <div class="wizard-input-group" style="grid-column: span 2; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
            <label for="corp_ra_custom_name" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Registered Agent Name *</label> 
            <input type="text" id="corp_ra_custom_name" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
            <div class="wizard-error-message" id="err_corp_ra_custom_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        </div> 
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
            <label for="corp_ra_custom_street" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Address (P.O. Boxes Prohibited) *</label> 
            <input type="text" id="corp_ra_custom_street" class="wizard-input-field" onfocus="if(typeof attachGooglePlacesAutocompleteToNode==='function'){attachGooglePlacesAutocompleteToNode(this,'corp_custom_ra')}" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
            <div class="wizard-error-message" id="err_corp_ra_custom_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        </div> 
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
            <label for="corp_ra_custom_unit" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Suite / Building / Apt</label> 
            <input type="text" id="corp_ra_custom_unit" placeholder="e.g., Suite 100" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
        </div> 
        <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
            <label for="corp_ra_custom_city" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">City *</label> 
            <input type="text" id="corp_ra_custom_city" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
            <div class="wizard-error-message" id="err_corp_ra_custom_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
        </div> 
        <div class="wizard-input-group" style="grid-column: span 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0;"> 
            <div style="display: flex; flex-direction: column; gap: 6px;"> 
                <label for="corp_ra_custom_state" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">State *</label> 
                <select id="corp_ra_custom_state" class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">${blankStatesHtml}</select> 
                <div class="wizard-error-message" id="err_corp_ra_custom_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
            </div> 
            <div style="display: flex; flex-direction: column; gap: 6px;"> 
                <label for="corp_ra_custom_zip" style="font-weight:700; font-size:0.8rem; color:var(--navy, #0a1f44);">Zip Code *</label> 
                <input type="text" id="corp_ra_custom_zip" maxlength="5" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
                <div class="wizard-error-message" id="err_corp_ra_custom_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
            </div> 
        </div> 
    </div> `; 
};

// ---------------------------------------------------------------------------- // 
// SECTION B: PART 1 LAYOUT ENGINE MATRIX (DYNAMIC SHAREHOLDER COLLECTION TRACK) // 
// ---------------------------------------------------------------------------- // 
window.formRegistry['corporations-shareholder-layout'] = function() { 
    return ` 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Shareholder Registry</h3> 
    </div> 
    
    <!-- CONTEXT-AWARE SHAREHOLDER TOOLTIP BANNER --> 
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 12px;"> 
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Shareholder?</strong> A shareholder is an individual or entity that owns stock units inside a corporation. State statutes mandate cataloging initial owners to accurately allocate initial corporate asset boundaries on public records. 
    </div> 
    
    <!-- DYNAMIC SHAREHOLDER DATA COLLECTION TRACK NODE --> 
    <div class="wizard-input-group" style="grid-column: span 2; margin-bottom: 0;"> 
        <div id="corp_shareholders_container" style="display: flex; flex-direction: column; gap: 20px; width: 100%;"> 
            <!-- DEFAULT CARD 1 BASE REFUGE --> 
            <div class="member-record-card" id="shareholder_card_1" style="background: #ffffff; border: 1px solid var(--border, #e2e8f0); padding: 16px; border-radius: 8px; width: 100%; box-sizing: border-box;"> 
                <span style="font-weight: 800; font-size: 0.75rem; color: #10b981; text-transform: uppercase;">Shareholder #1 Records</span> 
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 12px;"> 
                    <!-- SPLIT NAME FIELD MATRICES --> 
                    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
                        <label for="shareholder_first_name_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">First Name *</label> 
                        <input type="text" id="shareholder_first_name_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
                        <div class="wizard-error-message" id="err_shareholder_first_name_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
                    </div> 
                    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
                        <label for="shareholder_last_name_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Last Name *</label> 
                        <input type="text" id="shareholder_last_name_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
                        <div class="wizard-error-message" id="err_shareholder_last_name_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
                    </div>
                    <!-- SPLIT STREET AND UNIT MATRICES --> 
                    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
                        <label for="shareholder_street_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Street Address *</label> 
                        <input type="text" id="shareholder_street_1" required placeholder="e.g. 123 Main St" class="wizard-input-field" onfocus="if(typeof attachGooglePlacesAutocompleteToNode==='function'){attachGooglePlacesAutocompleteToNode(this,'shareholder_1')}" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
                        <div class="wizard-error-message" id="err_shareholder_street_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
                    </div> 
                    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
                        <label for="shareholder_unit_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Suite / Building / Apt</label> 
                        <input type="text" id="shareholder_unit_1" placeholder="e.g. Suite 400" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> </div> 
                    <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;"> 
                        <label for="shareholder_city_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">City *</label> 
                        <input type="text" id="shareholder_city_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
                        <div class="wizard-error-message" id="err_shareholder_city_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
                    </div> 
                    <!-- STATE AND ZIP GRID ROW LAYER --> 
                    <div class="wizard-input-group" style="grid-column: span 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0;"> 
                        <div style="display: flex; flex-direction: column; gap: 6px;"> 
                            <label for="shareholder_state_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">State *</label> 
                            <select id="shareholder_state_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; height: 38px; font-weight: 600; background-color: #ffffff; padding: 0 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> ${typeof window.buildGlobalUsaStateDropdownOptionsHtml === 'function' ? window.buildGlobalUsaStateDropdownOptionsHtml("") : '<option value="" disabled selected>-- Select State --</option><option value="WY">Wyoming</option>'} </select> 
                            <div class="wizard-error-message" id="err_shareholder_state_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
                        </div> 
                        <div style="display: flex; flex-direction: column; gap: 6px;"> 
                            <label for="shareholder_zip_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Zip *</label> 
                            <input type="text" id="shareholder_zip_1" required maxlength="5" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
                            <div class="wizard-error-message" id="err_shareholder_zip_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
                        </div> 
                    </div> 
                </div> 
            </div> 
        </div> 
    </div> 
    
    <div style="grid-column: span 2; margin-top: 12px; margin-bottom: 20px;"> 
        <button type="button" id="btn_add_shareholder" class="wizard-button-secondary" style="font-weight:700; cursor: pointer; padding: 10px 20px; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px;"> <i class="fa-solid fa-plus" style="color: var(--primary, #10b981);"></i> + Add Additional Shareholder </button> 
    </div> `; 
};

// ---------------------------------------------------------------------------- // 
// SECTION C: PART 2 LAYOUT ENGINE MATRIX (STOCK UNITS & TAX CHOICES) 
// ---------------------------------------------------------------------------- // 
window.formRegistry['corporations-part2-layout'] = function(stateDropdownOptionsHtml = "") { 
    const centralRegistrySource = window.CENTRAL_ADDON_DB || window.UPSELL_ADDON_REGISTRY || {}; 
    const scorpMetaRecord = centralRegistrySource["customSelectedScorpElectionActive"] || {}; 
    const liveScorpFee = parseFloat(scorpMetaRecord.price || 79.00).toFixed(2); 
    
    return ` 
    <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;"> 
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Stock &amp; Tax Status Elections</h3> 
    </div> 
    
    <!-- CONTEXT-AWARE STOCK TOOLTIP BANNER --> 
    <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 12px;"> 
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is Authorized Stock and Par Value?</strong> Authorized shares represent the max units a corporation can legally issue. Par value is an arbitrary baseline dollar value assigned to each stock piece for internal structural equity calculations (standard baseline is 0.0001). 
    </div> 
    
    <!-- FIELD 1: AUTHORIZED SHARES COUNT --> 
    <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"> 
        <label for="corp_shares_authorized" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Total Shares Authorized <span style="color: #ef4444;">*</span></label> 
        <input type="number" id="corp_shares_authorized" required placeholder="10000" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
        <div class="wizard-error-message" id="err_corp_shares_authorized" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div>
    <!-- FIELD 2: PAR VALUE ENTRY --> 
    <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"> 
        <label for="corp_shares_par_value" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Par Value Per Share <span style="color: #ef4444;">*</span></label> 
        <input type="text" id="corp_shares_par_value" required placeholder="0.0001" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
        <div class="wizard-error-message" id="err_corp_shares_par_value" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div> 
    
    <!-- FIELD 3: S-CORP ELECTION DROPDOWN --> 
    <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 6px;"> 
        <label for="corp_scorp_elect" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Do you wish to elect IRS S-Corporation status? <span style="color: #ef4444;">*</span></label> 
        <select id="corp_scorp_elect" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;" onchange="if(typeof window.toggleScorpElectionWorkflow === 'function') { window.toggleScorpElectionWorkflow(this.value); }"> 
            <option value="no" selected>No, maintain standard C-Corporation structure</option> 
            <option value="yes">Yes, elect IRS Subchapter S-Corporation tax status</option> 
        </select> 
        <div class="wizard-error-message" id="err_corp_scorp_elect" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div> 
    
    <!-- HIDDEN CONDITIONAL CONTAINER: S-CORP FORM 2553 PREMIUM ADDON HOOK --> 
    <div id="corp_scorp_service_wrapper" style="grid-column: span 2; display: none; background: rgba(10, 31, 68, 0.01); padding: 20px; border-radius: 8px; border: 1px dashed #cbd5e1; flex-direction: column; gap: 14px; box-sizing: border-box; width: 100%;"> 
        <label for="corp_scorp_procure" style="font-weight: 700; font-size: 0.82rem; color: var(--navy, #0a1f44);">Add IRS Form 2553 Filing Preparation Service? ($${liveScorpFee})</label> 
        <select id="corp_scorp_procure" class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;" onchange="if(typeof window.toggleScorpFilingPricingHook === 'function') { window.toggleScorpFilingPricingHook(this.value); }"> 
            <option value="no-decline">No, I will file Form 2553 independently</option> 
            <option value="yes-buy">Yes, add Form 2553 Preparation â€” $${liveScorpFee}</option> 
        </select> 
        <div class="wizard-error-message" id="err_corp_scorp_procure" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
    </div> `; 
};


/** * ðŸ”Œ CONTROLLER 1: REGISTERED AGENT DISPLAY INTERLOCK * Handles visibility and strict layout constraints for the custom agent form workspace. */ 
window.toggleCorporateRegisteredAgentConditionalFields = function(value) { 
    const wrapper = document.getElementById("corp_custom_ra_wrapper"); 
    if (!wrapper) return; 
    
    // Normalize string value inputs to verify custom registration selections cleanly
    const isCustom = ['custom', 'independent', 'external', 'third_party'].includes(String(value).toLowerCase());
    
    if (isCustom) { 
        // Reveal the panel cleanly as a responsive grid canvas 
        wrapper.style.setProperty("display", "grid", "important"); 
        // Dynamically mark all nested inputs as strictly mandatory 
        wrapper.querySelectorAll("input, select").forEach(el => { 
            if (el.id !== "corp_ra_custom_unit") {
                el.setAttribute("required", "required"); 
            }
        }); 
        console.log("[Agent Controller] Custom agent layout activated. Mandatory validation rules armed."); 
    } else { 
        // Hide the panel instantly out of view 
        wrapper.style.setProperty("display", "none", "important"); 
        // Wipe entries and remove required rules so the validation engine skips them safely 
        wrapper.querySelectorAll("input, select").forEach(el => { 
            el.removeAttribute("required"); 
            el.value = ""; 
            el.style.borderColor = "#cbd5e1"; 
            // Hide any lingering error alert popups 
            const errorMsgNode = document.getElementById("err_" + el.id); 
            if (errorMsgNode) errorMsgNode.style.display = "none"; 
        }); 
    } 
}; 

// Active Event Listener Bridge for Registered Agent Dropdown Interaction
document.addEventListener("change", function(e) {
    if (e.target && e.target.id === "corp_ra_choice") {
        window.toggleCorporateRegisteredAgentConditionalFields(e.target.value);
    }
});

window.toggleScorpElectionWorkflow = function(selectedValue) { 
    const serviceWrapper = document.getElementById("corp_scorp_service_wrapper"); 
    if (!serviceWrapper) return; 
    const isScorpElected = selectedValue === "yes"; 
    serviceWrapper.style.setProperty("display", isScorpElected ? "grid" : "none", "important"); 
    
    if (!isScorpElected) { 
        const procureDropdown = document.getElementById("corp_scorp_procure"); 
        if (procureDropdown) { 
            procureDropdown.value = "no-decline"; 
            procureDropdown.style.borderColor = "#cbd5e1"; 
        } 
        window.customSelectedScorpElectionActive = false; 
        if (window.currentCartState) window.currentCartState.customSelectedScorpElectionActive = false; 
        if (typeof window.updateDynamicPricingMatrixVanilla === "function") window.updateDynamicPricingMatrixVanilla(); 
        if (typeof window.updateWizardFinalTotalAmountMatrix === "function") window.updateWizardFinalTotalAmountMatrix(); 
    } 
}; 

window.toggleScorpFilingPricingHook = function(selectedValue) { 
    const isAddonActivated = selectedValue === "yes-buy"; 
    window.customSelectedScorpElectionActive = isAddonActivated; 
    if (window.currentCartState) window.currentCartState.customSelectedScorpElectionActive = isAddonActivated; 
    console.log(`[Corporate Router] S-Corp Form 2553 selection state written: ${isAddonActivated}`); 
    if (typeof window.updateDynamicPricingMatrixVanilla === "function") { 
        window.updateDynamicPricingMatrixVanilla(); 
    } 
    if (typeof window.updateWizardFinalTotalAmountMatrix === "function") { 
        window.updateWizardFinalTotalAmountMatrix(); 
    } 
}; 

// ============================================================================ // 
// 5. MASTER CORPORATIONS RENDER SYSTEM ALLOCATION 
// ============================================================================ // 
window.formRegistry['corporations-form-master'] = function(stateDropdownOptionsHtml = "") { 
    const layer1 = window.formRegistry['corporations-part1-layout'] ? window.formRegistry['corporations-part1-layout'](stateDropdownOptionsHtml) : ''; 
    const layer2 = window.formRegistry['corporations-shareholder-layout'] ? window.formRegistry['corporations-shareholder-layout']() : ''; 
    const layer3 = window.formRegistry['corporations-part2-layout'] ? window.formRegistry['corporations-part2-layout'](stateDropdownOptionsHtml) : ''; 
    return layer1 + layer2 + layer3; 
};
/** * ðŸ“¦ DYNAMIC SHAREHOLDER REGISTRY MANAGER * Handles instant node instantiations and appends functional remove click listeners. */ 
// Global Removals Handler Matrix Node Hook up
window.removeShareholderCardNode = function(cardIndex) {
    const targetCard = document.getElementById(`shareholder_card_${cardIndex}`);
    if (targetCard) {
        targetCard.remove();
        console.log(`[Shareholder Tracker] Card index handle #${cardIndex} cleanly purged from DOM memory.`);
    }
};

// Refactored Global Document Event Delegation Engine - Stops timeout race conditions
document.addEventListener("click", function(e) {
    // Traverse up to look for the shareholder add action button cleanly
    const appendBtn = e.target.closest("#btn_add_shareholder");
    if (!appendBtn) return;
    
    const parentContainer = document.getElementById("corp_shareholders_container"); 
    if (!parentContainer) return; 
    
    // Generate unique index tracking counters based on live child nodes count 
    const cardIndex = parentContainer.querySelectorAll(".member-record-card").length + 1; 
    const stateOptions = typeof window.buildGlobalUsaStateDropdownOptionsHtml === 'function' ? window.buildGlobalUsaStateDropdownOptionsHtml("") : '<option value="" disabled selected>-- Select State --</option><option value="WY">Wyoming</option>'; 
    
    const cardNode = document.createElement("div"); 
    cardNode.className = "member-record-card"; 
    cardNode.id = `shareholder_card_${cardIndex}`; 
    cardNode.style.cssText = "background: #ffffff; border: 1px solid var(--border, #e2e8f0); padding: 20px; border-radius: 8px; width: 100%; box-sizing: border-box; margin-top: 12px; clear: both;"; 
    
    // Inject data tracking templates matching your exact parameters layout specifications
    cardNode.innerHTML = ` 
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 12px;"> 
        <span style="font-weight: 800; font-size: 0.75rem; color: #10b981; text-transform: uppercase;">Shareholder #${cardIndex} Records</span> 
        <button type="button" class="btn-remove-shareholder" onclick="window.removeShareholderCardNode(${cardIndex})" style="background: transparent; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-trash-can"></i> Remove Shareholder</button> 
    </div> 
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;"> 
        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"><label for="shareholder_first_name_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">First Name *</label><input type="text" id="shareholder_first_name_${cardIndex}" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"><div class="wizard-error-message" id="err_shareholder_first_name_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div></div> 
        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"><label for="shareholder_last_name_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Last Name *</label><input type="text" id="shareholder_last_name_${cardIndex}" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"><div class="wizard-error-message" id="err_shareholder_last_name_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div></div> 
        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"><label for="shareholder_street_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Street Address *</label><input type="text" id="shareholder_street_${cardIndex}" required placeholder="e.g. 123 Main St" class="wizard-input-field" onfocus="if(typeof attachGooglePlacesAutocompleteToNode==='function'){attachGooglePlacesAutocompleteToNode(this,'shareholder_${cardIndex}')}" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"><div class="wizard-error-message" id="err_shareholder_street_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div></div> 
        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"><label for="shareholder_unit_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Suite / Building / Apt</label><input type="text" id="shareholder_unit_${cardIndex}" placeholder="e.g. Suite 400" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"></div> 
        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;"><label for="shareholder_city_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">City *</label><input type="text" id="shareholder_city_${cardIndex}" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"><div class="wizard-error-message" id="err_shareholder_city_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div></div> 
        <div class="wizard-input-group" style="grid-column: span 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0;"> 
            <div style="display: flex; flex-direction: column; gap: 6px;"> 
                <label for="shareholder_state_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">State *</label> 
                <select id="shareholder_state_${cardIndex}" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">${stateOptions}</select> 
                <div class="wizard-error-message" id="err_shareholder_state_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
            </div> 
            <div style="display: flex; flex-direction: column; gap: 6px;"> 
                <label for="shareholder_zip_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Zip *</label> 
                <input type="text" id="shareholder_zip_${cardIndex}" required maxlength="5" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;"> 
                <div class="wizard-error-message" id="err_shareholder_zip_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div> 
            </div> 
        </div> 
    </div> `; 
    
    parentContainer.appendChild(cardNode); 
    
    // Bind numerical input restriction layer to the newly injected dynamically built zip input node 
    const newZipInput = document.getElementById(`shareholder_zip_${cardIndex}`); 
    if (newZipInput) { 
        newZipInput.addEventListener('input', function() { 
            this.value = this.value.replace(/\D/g, ''); 
        }); 
    } 
});

// End structural closure block matching initCorporateFormationServices container safely 
} 

// Master Ignition Run Trigger Execution Pass 
initCorporateFormationServices();


/** * ðŸ—‘ï¸ DYNAMIC NODE REMOVAL ENGINE * Safely removes a shareholder card container and re-indexes the layout stack. * @param {number} cardIdIndex The numeric identifier suffix of the target element. */ 
window.removeShareholderCardNode = function(cardIdIndex) { 
    const targetCard = document.getElementById(`shareholder_card_${cardIdIndex}`); 
    const parentContainer = document.getElementById("corp_shareholders_container"); 
    if (!targetCard || !parentContainer) { 
        console.warn(`[Shareholder Registry] Target card element sequence #${cardIdIndex} missing.`); 
        return; 
    } 
    
    // 1. Instantly delete the target entry node out of the DOM view 
    targetCard.remove(); 
    console.log(`[Shareholder Registry] Removed Shareholder card node #${cardIdIndex}.`); 
    
    // 2. STABILITY PASS: Dynamically re-index remaining custom cards to keep arrays aligned 
    const remainingCards = parentContainer.querySelectorAll(".member-record-card"); 
    remainingCards.forEach((card, loopIndex) => { 
        const operationalNewIndex = loopIndex + 1; 
        
        // Retain Card #1's hardcoded default state layout intact but ensure it matches index 1
        if (card.id === "shareholder_card_1" && operationalNewIndex === 1) return; 
        
        card.id = `shareholder_card_${operationalNewIndex}`; 
        
        // Update the visual numbering subtitle string 
        const subtitleHeader = card.querySelector("span"); 
        if (subtitleHeader) { 
            subtitleHeader.textContent = `Shareholder #${operationalNewIndex} Records`; 
        } 
        
        // Update deep nested input attributes so your form submission parameters stay accurate
        const trackingFields = ['first_name', 'last_name', 'street', 'unit', 'city', 'state', 'zip'];
        trackingFields.forEach(field => {
            const inputEl = card.querySelector(`[id^="shareholder_${field}_"]`);
            const labelEl = card.querySelector(`[for^="shareholder_${field}_"]`);
            const errorEl = card.querySelector(`[id^="err_shareholder_${field}_"]`);
            
            if (inputEl) inputEl.id = `shareholder_first_name_${operationalNewIndex}`;
            if (labelEl) labelEl.setAttribute("for", `shareholder_${field}_${operationalNewIndex}`);
            if (errorEl) errorEl.id = `err_shareholder_${field}_${operationalNewIndex}`;
        });
        
        // Update the functional remove button tracking argument parameters 
        const trashButton = card.querySelector(".btn-remove-shareholder"); 
        if (trashButton) { 
            trashButton.setAttribute("onclick", `window.removeShareholderCardNode(${operationalNewIndex})`); 
        } 
    }); 
}; 

/** * ðŸŒŸ DYNAMIC DUAL PASS NODE SCANNER * Reusable compilation module to check dynamic fields inside the form engine runtime. */
window.validateDynamicShareholders = function(markInvalid, markValid, isVis) {
    let internalStatus = true;
    
    document.querySelectorAll("input[id^='shareholder_first_name_']").forEach(inputEl => { 
        if (isVis(inputEl)) { 
            const idx = inputEl.id.replace("shareholder_first_name_", ""); 
            const errNode = document.getElementById("err_shareholder_first_name_" + idx) || inputEl.parentElement?.querySelector(".wizard-error-message"); 
            if (!inputEl.value.trim()) {
                markInvalid(inputEl, errNode, `Shareholder first name is required.`); 
                internalStatus = false;
            } else {
                markValid(inputEl, errNode); 
            }
        } 
    }); 
    
    document.querySelectorAll("input[id^='shareholder_last_name_']").forEach(inputEl => { 
        if (isVis(inputEl)) { 
            const idx = inputEl.id.replace("shareholder_last_name_", ""); 
            const errNode = document.getElementById("err_shareholder_last_name_" + idx) || inputEl.parentElement?.querySelector(".wizard-error-message"); 
            if (!inputEl.value.trim()) {
                markInvalid(inputEl, errNode, `Shareholder last name is required.`); 
                internalStatus = false;
            } else {
                markValid(inputEl, errNode); 
            }
        } 
    }); 
    
    document.querySelectorAll("input[id^='shareholder_street_']").forEach(inputEl => { 
        if (isVis(inputEl)) { 
            const idx = inputEl.id.replace("shareholder_street_", ""); 
            const errNode = document.getElementById("err_shareholder_street_" + idx) || inputEl.parentElement?.querySelector(".wizard-error-message"); 
            if (!inputEl.value.trim()) {
                markInvalid(inputEl, errNode, `Shareholder street address is required.`); 
                internalStatus = false;
            } else {
                markValid(inputEl, errNode); 
            }
        } 
    }); 
    
    document.querySelectorAll("input[id^='shareholder_city_']").forEach(inputEl => { 
        if (isVis(inputEl)) { 
            const idx = inputEl.id.replace("shareholder_city_", ""); 
            const errNode = document.getElementById("err_shareholder_city_" + idx) || inputEl.parentElement?.querySelector(".wizard-error-message"); 
            if (!inputEl.value.trim()) {
                markInvalid(inputEl, errNode, `Shareholder city is required.`); 
                internalStatus = false;
            } else {
                markValid(inputEl, errNode); 
            }
        } 
    }); 
    
    document.querySelectorAll("select[id^='shareholder_state_']").forEach(selectEl => { 
        if (isVis(selectEl)) { 
            const idx = selectEl.id.replace("shareholder_state_", ""); 
            const errNode = document.getElementById("err_shareholder_state_" + idx) || selectEl.parentElement?.querySelector(".wizard-error-message"); 
            if (!selectEl.value.trim()) {
                markInvalid(selectEl, errNode, `Please select a state.`); 
                internalStatus = false;
            } else {
                markValid(selectEl, errNode); 
            }
        } 
    }); 
    
    document.querySelectorAll("input[id^='shareholder_zip_']").forEach(inputEl => { 
        if (isVis(inputEl)) { 
            const idx = inputEl.id.replace("shareholder_zip_", ""); 
            const errNode = document.getElementById("err_shareholder_zip_" + idx) || inputEl.parentElement?.querySelector(".wizard-error-message"); 
            if (!inputEl.value.trim()) { 
                markInvalid(inputEl, errNode, `Shareholder zip code is required.`); 
                internalStatus = false;
            } else if (!/^\d{5}$/.test(inputEl.value.trim())) { 
                markInvalid(inputEl, errNode, `Shareholder zip code must be exactly 5 digits.`); 
                internalStatus = false;
            } else { 
                markValid(inputEl, errNode); 
            } 
        } 
    });
    
    return internalStatus;
};

