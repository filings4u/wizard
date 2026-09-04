// ============================================================================ //
// ðŸ“ DUNS NUMBER WIZARD ENGINE REGISTER                                       //
// ============================================================================ //
function initDunsNumberService() {
    window.formRegistry = window.formRegistry || {};

    // ------------------------------------------------------------------------
    // MODULE 1: PART 1 VALIDATION REGISTER
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-part1-validation'] = {
        validate: function() {
            let isValid = true;

            const markInvalid = (inputEl, errorEl, msg) => {
                errorEl.textContent = msg;
                errorEl.style.display = "block";
                inputEl.style.border = "1px solid #ef4444";
                isValid = false;
            };

            const markValid = (inputEl, errorEl) => {
                errorEl.style.display = "none";
                inputEl.style.border = "";
            };

            // 1. Validate Legal Business Name
            const nameField = document.getElementById('duns_legal_name');
            const nameErr = document.getElementById('err_duns_legal_name');
            if (!nameField || !nameField.value.trim()) {
                markInvalid(nameField, nameErr, "Official business name is required.");
            } else {
                markValid(nameField, nameErr);
            }

            // 2. Validate Federal EIN (Standard 9-Digit Numeric Extraction)
            const einField = document.getElementById('duns_federal_ein');
            const einErr = document.getElementById('err_duns_federal_ein');
            if (einField && einErr) {
                const rawEin = einField.value.replace(/\D/g, "");
                if (rawEin.length !== 9) {
                    markInvalid(einField, einErr, "A standard 9-digit EIN is required (e.g., 12-3456789).");
                } else {
                    markValid(einField, einErr);
                }
            }

            // 3. Validate Physical Address & Enforce D&B "No P.O. Box" Rule
            const streetField = document.getElementById('duns_physical_street');
            const streetErr = document.getElementById('err_duns_physical_street');
            if (streetField && streetErr) {
                const val = streetField.value.trim();
                const poBoxRegex = /\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i;
                if (!val) {
                    markInvalid(streetField, streetErr, "Physical operations street address is required.");
                } else if (poBoxRegex.test(val)) {
                    markInvalid(streetField, streetErr, "Dun & Bradstreet protocols prohibit P.O. Boxes for physical headquarters profile listings.");
                } else {
                    markValid(streetField, streetErr);
                }
            }

            // 4. Validate City
            const cityField = document.getElementById('duns_physical_city');
            const cityErr = document.getElementById('err_duns_physical_city');
            if (!cityField || !cityField.value.trim()) {
                markInvalid(cityField, cityErr, "City coordinate is required.");
            } else {
                markValid(cityField, cityErr);
            }

            // 5. Validate State Dropdown Selection
            const stateField = document.getElementById('duns_physical_state');
            const stateErr = document.getElementById('err_duns_physical_state');
            if (!stateField || !stateField.value) {
                markInvalid(stateField, stateErr, "Please pick your physical operations state.");
            } else {
                markValid(stateField, stateErr);
            }

            // 6. Validate Zip Code
            const zipField = document.getElementById('duns_physical_zip');
            const zipErr = document.getElementById('err_duns_physical_zip');
            if (!zipField || !zipField.value.trim()) {
                markInvalid(zipField, zipErr, "Zip Code is required.");
            } else {
                markValid(zipField, zipErr);
            }

            // 7. Validate Legal Structure Dropdown Selection
            const structureField = document.getElementById('duns_legal_structure');
            const structureErr = document.getElementById('err_duns_legal_structure');
            if (!structureField || !structureField.value) {
                markInvalid(structureField, structureErr, "Please select a legal structure classification.");
            } else {
                markValid(structureField, structureErr);
            }

            return isValid;
        }
    };


    // ------------------------------------------------------------------------
    // MODULE 2: PART 1 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-part1-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS A DUNS NUMBER? -->
        <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Global Business Identity Standards</strong>
            The Data Universal Numbering System (DUNS) Number is a unique nine-digit global identifier developed by Dun & Bradstreet (D&B). It establishes your commercial business credit profile and serves as a vital verification link for international vendor onboarding, corporate credit tracking, and global supply chain compliance matching networks.
        </div>

        <!-- SECTION 1: COMPANY IDENTIFICATION PROFILE -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Legal Entity Identification</h3>
        </div>

        <!-- FIELD 1: OFFICIAL BUSINESS NAME -->
        <div class="wizard-input-group" style="grid-column: span 2;">
            <label for="duns_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Business Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="duns_legal_name" required placeholder="Enter exact legal name matching state incorporation records" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
            <div class="wizard-error-message" id="err_duns_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 2: DBA / TRADE NAME -->
        <div class="wizard-input-group" style="grid-column: span 1;">
            <label for="duns_trade_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">DBA / Trade Name (If Applicable)</label>
            <input type="text" id="duns_trade_name" placeholder="Assumed name under which you conduct business" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <!-- FIELD 3: FEDERAL EMPLOYER ID (EIN) -->
        <div class="wizard-input-group" style="grid-column: span 1;">
            <label for="duns_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Employer ID (EIN) <span style="color: #ef4444;">*</span></label>
            <input type="text" id="duns_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
            <div class="wizard-error-message" id="err_duns_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 4: PHYSICAL STREET ADDRESS -->
        <div class="wizard-input-group" style="grid-column: span 2;">
            <label for="duns_physical_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Physical Operations Street Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="duns_physical_street" required placeholder="Physical Location Address, Suite, Unit (No P.O. Boxes allowed by D&B)" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'duns_physical')">
            <div class="wizard-error-message" id="err_duns_physical_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- PHYSICAL LOCATION METRICS CONTAINER -->
        <div class="wizard-input-group" style="grid-column: span 2;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
                <div>
                    <label for="duns_physical_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="duns_physical_city" required placeholder="City" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
                    <div class="wizard-error-message" id="err_duns_physical_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="duns_physical_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
                    <select id="duns_physical_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                        <option value="" disabled selected>Select State...</option>
                        \${stateDropdownOptionsHtml}
                    </select>
                    <div class="wizard-error-message" id="err_duns_physical_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="duns_physical_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="duns_physical_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" class="wizard-input-field">
                    <div class="wizard-error-message" id="err_duns_physical_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
            </div>
        </div>

        <!-- SECTION 2: CORPORATE STRUCTURE BREAKDOWN -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Entity Classification</h3>
        </div>

        <!-- FIELD 5: LEGAL STRUCTURE CLASSIFICATION -->
        <div class="wizard-input-group" style="grid-column: span 2;">
            <label for="duns_legal_structure" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Legal Structure Classification <span style="color: #ef4444;">*</span></label>
            <select id="duns_legal_structure" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                <option value="" disabled selected>Select Legal Structure...</option>
                <option value="llc">Limited Liability Company (LLC)</option>
                <option value="corporation">Corporation (Inc. / Corp.)</option>
                <option value="partnership">General or Limited Partnership</option>
                <option value="sole_prop">Sole Proprietorship / Individual Operator</option>
            </select>
            <div class="wizard-error-message" id="err_duns_legal_structure" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        `;
    };

    // ------------------------------------------------------------------------
    // MODULE 3: PART 2 VALIDATION REGISTER
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-part2-validation'] = {
        validate: function() {
            let isValid = true;

            const markInvalid = (inputEl, errorEl, msg) => {
                errorEl.textContent = msg;
                errorEl.style.display = "block";
                inputEl.style.border = "1px solid #ef4444";
                isValid = false;
            };

            const markValid = (inputEl, errorEl) => {
                errorEl.style.display = "none";
                inputEl.style.border = "";
            };

            // 1. Validate Total Employee Count (Must be an integer >= 1)
            const empField = document.getElementById('duns_employee_count');
            const empErr = document.getElementById('err_duns_employee_count');
            if (empField && empErr) {
                const val = parseInt(empField.value, 10);
                if (isNaN(val) || val < 1) {
                    markInvalid(empField, empErr, "Please declare a valid total employee count (minimum of 1).");
                } else {
                    markValid(empField, empErr);
                }
            }

            // 2. Validate Revenue Bracket Dropdown Selection
            const revField = document.getElementById('duns_annual_revenue_bracket');
            const revErr = document.getElementById('err_duns_annual_revenue_bracket');
            if (!revField || !revField.value) {
                markInvalid(revField, revErr, "Please pick an estimated annual gross revenue bracket.");
            } else {
                markValid(revField, revErr);
            }

            // 3. Validate Operational Relationship Hierarchy Dropdown Selection
            const hierarchyField = document.getElementById('duns_hierarchy_type');
            const hierarchyErr = document.getElementById('err_duns_hierarchy_type');
            if (!hierarchyField || !hierarchyField.value) {
                markInvalid(hierarchyField, hierarchyErr, "Please select an operational relationship hierarchy.");
            } else {
                markValid(hierarchyField, hierarchyErr);
            }

            // 4. Conditional Hierarchy Validation (Triggered on 'branch' or 'subsidiary')
            const parentWrapper = document.getElementById('duns_parent_wrapper');
            const parentNameField = document.getElementById('duns_parent_legal_name');
            const parentNameErr = document.getElementById('err_duns_parent_legal_name');
            const parentCountryField = document.getElementById('duns_parent_country');
            const parentCountryErr = document.getElementById('err_duns_parent_country');
            const isHierarchical = hierarchyField && (hierarchyField.value === "branch" || hierarchyField.value === "subsidiary");

            if (parentWrapper && (parentWrapper.style.display === "grid" || parentWrapper.style.display === "block" || isHierarchical)) {
                // Validate Parent Legal Name
                if (!parentNameField || !parentNameField.value.trim()) {
                    markInvalid(parentNameField, parentNameErr, "Ultimate parent company name is required for relational office profiles.");
                } else {
                    markValid(parentNameField, parentNameErr);
                }
                // Validate Parent Country
                if (!parentCountryField || !parentCountryField.value.trim()) {
                    markInvalid(parentCountryField, parentCountryErr, "Ultimate parent headquarter country is required.");
                } else {
                    markValid(parentCountryField, parentCountryErr);
                }
            } else {
                if (parentNameField && parentNameErr) markValid(parentNameField, parentNameErr);
                if (parentCountryField && parentCountryErr) markValid(parentCountryField, parentCountryErr);
            }

            return isValid;
        }
    };

    // ------------------------------------------------------------------------
    // MODULE 4: PART 3 VALIDATION REGISTER
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-part3-validation'] = {
        validate: function() {
            let isValid = true;

            const markInvalid = (inputEl, errorEl, msg) => {
                errorEl.textContent = msg;
                errorEl.style.display = "block";
                inputEl.style.border = "1px solid #ef4444";
                isValid = false;
            };

            const markValid = (inputEl, errorEl) => {
                errorEl.style.display = "none";
                inputEl.style.border = "";
            };

            // 5. Validate Executive Officer Name
            const execNameField = document.getElementById('duns_executive_name');
            const execNameErr = document.getElementById('err_duns_executive_name');
            if (!execNameField || !execNameField.value.trim()) {
                markInvalid(execNameField, execNameErr, "Executive officer full legal name is required.");
            } else {
                markValid(execNameField, execNameErr);
            }

            // 6. Validate Executive Title
            const execTitleField = document.getElementById('duns_executive_title');
            const execTitleErr = document.getElementById('err_duns_executive_title');
            if (!execTitleField || !execTitleField.value.trim()) {
                markInvalid(execTitleField, execTitleErr, "Executive official title or role is required.");
            } else {
                markValid(execTitleField, execTitleErr);
            }

            // 7. Validate Executive Phone
            const execPhoneField = document.getElementById('duns_executive_phone');
            const execPhoneErr = document.getElementById('err_duns_executive_phone');
            if (!execPhoneField || !execPhoneField.value.trim()) {
                markInvalid(execPhoneField, execPhoneErr, "Primary contact phone number is required.");
            } else {
                markValid(execPhoneField, execPhoneErr);
            }

            return isValid;
        }
    };


    // ------------------------------------------------------------------------
    // MODULE 5: PART 2 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-part2-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 3: OPERATIONAL SCALE PARAMETERS -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Operational Metrics & Scale</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Dun & Bradstreet builds credit metrics using basic employee and location parameters.</p>
        </div>

        <!-- FIELD 1: EMPLOYEE COUNT -->
        <div class="wizard-input-group" style="grid-column: span 1;">
            <label for="duns_employee_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Total Employees (Including Owners) <span style="color: #ef4444;">*</span></label>
            <input type="number" id="duns_employee_count" required placeholder="1" min="1" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
            <div class="wizard-error-message" id="err_duns_employee_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 2: REVENUE BRACKET -->
        <div class="wizard-input-group" style="grid-column: span 1;">
            <label for="duns_annual_revenue_bracket" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Estimated Annual Gross Revenue ($) <span style="color: #ef4444;">*</span></label>
            <select id="duns_annual_revenue_bracket" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                <option value="under_50k" selected>Under $50,000</option>
                <option value="50k_250k">$50,000 - $250,000</option>
                <option value="250k_1m">$250,000 - $1,000,000</option>
                <option value="over_1m">Over $1,000,000</option>
            </select>
            <div class="wizard-error-message" id="err_duns_annual_revenue_bracket" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- SECTION 4: CORPORATE HIERARCHY MAPPINGS -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Corporate Relationship Hierarchy</h3>
        </div>

        <!-- FIELD 3: HIERARCHY TYPE -->
        <div class="wizard-input-group" style="grid-column: span 2;">
            <label for="duns_hierarchy_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Location Operational Relationship <span style="color: #ef4444;">*</span></label>
            <select id="duns_hierarchy_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;" onchange="toggleDunsParentCompanyVisibility(this.value)">
                <option value="standalone" selected>Standalone Location (Single entity with no subsidiary links)</option>
                <option value="branch">Branch Office (Parent organization holds alternative primary DUNS identifier)</option>
                <option value="subsidiary">Subsidiary Operation (Separate corporate entity controlled by a parent group)</option>
            </select>
            <div class="wizard-error-message" id="err_duns_hierarchy_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- Hidden Conditional Container: Parent Corporate Records Registry -->
        <div id="duns_parent_wrapper" style="grid-column: span 2; display: none; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; grid-template-columns: 2fr 1fr; gap: 16px;">
            <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Ultimate Parent Organization Record Parameters</span>
            
            <!-- CONDITIONAL FIELD: PARENT LEGAL NAME -->
            <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 4px;">
                <label for="duns_parent_legal_name" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Parent Company Legal Name <span style="color: #ef4444;">*</span></label>
                <input type="text" id="duns_parent_legal_name" placeholder="Official Corporation or Holding Title" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
                <div class="wizard-error-message" id="err_duns_parent_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>

            <!-- CONDITIONAL FIELD: PARENT COUNTRY -->
            <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 4px;">
                <label for="duns_parent_country" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Parent Headquarter Country <span style="color: #ef4444;">*</span></label>
                <input type="text" id="duns_parent_country" placeholder="e.g. United States" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
                <div class="wizard-error-message" id="err_duns_parent_country" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
            </div>
        </div>
        `;
    };


    // ------------------------------------------------------------------------
    // MODULE 6: PART 3 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-part3-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 5: PRINCIPAL EXECUTIVE CONTACT -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Principal Executive Officer</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Dun & Bradstreet lists a primary executive (Owner, President, or Managing Member) to verify corporate operational accountability.</p>
        </div>

        <!-- FIELD 4: EXECUTIVE NAME -->
        <div class="wizard-input-group" style="grid-column: span 2;">
            <label for="duns_executive_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Executive Officer Full Legal Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="duns_executive_name" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
            <div class="wizard-error-message" id="err_duns_executive_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 5: EXECUTIVE TITLE -->
        <div class="wizard-input-group" style="grid-column: span 1;">
            <label for="duns_executive_title" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Executive Title / Role <span style="color: #ef4444;">*</span></label>
            <input type="text" id="duns_executive_title" required placeholder="e.g., Managing Member, President, CEO, Owner" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
            <div class="wizard-error-message" id="err_duns_executive_title" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 6: CONTACT PHONE -->
        <div class="wizard-input-group" style="grid-column: span 1;">
            <label for="duns_executive_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Contact Phone <span style="color: #ef4444;">*</span></label>
            <input type="tel" id="duns_executive_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
            <div class="wizard-error-message" id="err_duns_executive_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- SECTION 6: ADDITIONAL PROVISIONS -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Special Filing Clauses</h3>
        </div>

        <!-- FIELD 7: OPTIONAL TEXTAREA -->
        <div class="wizard-input-group" style="grid-column: span 2;">
            <label for="duns_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Instructions or Credit Match Notes</label>
            <textarea id="duns_provisions" placeholder="Detail any explicit credit tracking priorities, specialized trade vendor onboarding deadlines, or proxy filing parameters required for your Dun & Bradstreet company profile setup..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
        </div>
        `;
    };

    // ------------------------------------------------------------------------
    // MODULE 7: FALLBACK SLOTS (PART 4 & PART 5 RUNTIME SAFETY LAYOUTS)
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-part4-layout'] = function(stateDropdownOptionsHtml = "") {
        return `<!-- Fallback step context for Step 4 operational scopes -->`;
    };

    window.formRegistry['duns-number-part5-layout'] = function(stateDropdownOptionsHtml = "") {
        return `<!-- Fallback step context for Step 5 summary confirmations -->`;
    };

    // ------------------------------------------------------------------------
    // SYSTEM INTEGRATION: MASTER SYSTEM RENDER ENGINE & LISTENERS
    // ------------------------------------------------------------------------
    window.formRegistry['duns-number-form-master'] = function(stateDropdownOptionsHtml = "") {
        
        // Combines all structural sub-sections cleanly using setup parameters
        const combinedHtml = window.formRegistry['duns-number-part1-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['duns-number-part2-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['duns-number-part3-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['duns-number-part4-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['duns-number-part5-layout'](stateDropdownOptionsHtml);

        // Global DOM change monitoring microtask
        setTimeout(() => {
            // Evaluates step parameters and hooks active conditional fields safely
            if (typeof toggleDunsParentCompanyVisibility !== 'function') {
                window.toggleDunsParentCompanyVisibility = function(selectedValue) {
                    const parentWrapper = document.getElementById('duns_parent_wrapper');
                    const parentNameField = document.getElementById('duns_parent_legal_name');
                    const parentCountryField = document.getElementById('duns_parent_country');
                    if (!parentWrapper) return;
                    
                    if (selectedValue === 'branch' || selectedValue === 'subsidiary') {
                        parentWrapper.style.display = 'grid';
                        if (parentNameField) parentNameField.setAttribute('required', 'true');
                        if (parentCountryField) parentCountryField.setAttribute('required', 'true');
                    } else {
                        parentWrapper.style.display = 'none';
                        if (parentNameField) { parentNameField.removeAttribute('required'); parentNameField.value = ''; }
                        if (parentCountryField) { parentCountryField.removeAttribute('required'); parentCountryField.value = ''; }
                    }
                };
            }
        }, 0);

        return combinedHtml;
    };
}
// End of initDunsNumberService() closure wrapper

