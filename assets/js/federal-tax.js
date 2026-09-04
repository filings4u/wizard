// ============================================================================ //
// ðŸ“ FEDERAL INCOME TAX WIZARD ENGINE REGISTER                                //
// ============================================================================ //
function initFederalTaxService() {
    window.formRegistry = window.formRegistry || {};

    // ------------------------------------------------------------------------
    // MODULE 1: PART 1 VALIDATION REGISTER
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part1-validation'] = {
        requiredFields: [
            { id: 'fed_tax_legal_name', msg: 'Official Business Name is required.' },
            { id: 'fed_tax_ein', msg: 'Employer Identification Number (EIN) is required.' },
            { id: 'fed_tax_classification', msg: 'Federal Tax Classification selection is required.' },
            { id: 'fed_tax_principal_street', msg: 'Principal Business Address Street is required.' },
            { id: 'fed_tax_principal_city', msg: 'Principal Business Address City is required.' },
            { id: 'fed_tax_principal_state', msg: 'Principal Business Address State selection is required.' },
            { id: 'fed_tax_principal_zip', msg: 'Principal Business Address Zip Code is required.' }
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

            // 1. Process basic mandatory fields presence checks
            this.requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el) {
                    if (!el.value.trim()) setError(el, field.msg);
                    else clearError(el);
                }
            });

            // 2. Validate Federal EIN 9-Digit Numeric Mask Format
            const einEl = document.getElementById("fed_tax_ein");
            if (einEl && einEl.value.trim()) {
                const pureDigits = einEl.value.replace(/\D/g, "");
                if (pureDigits.length !== 9) {
                    setError(einEl, "Employer Identification Number (EIN) must consist of exactly 9 digits (XX-XXXXXXX).");
                }
            }

            // 3. Validate Principal Business Address Zip Code Format
            const zipEl = document.getElementById("fed_tax_principal_zip");
            if (zipEl && zipEl.value.trim() && !/^\d{5}$/.test(zipEl.value.trim())) {
                setError(zipEl, 'Principal Business Address Zip Code must consist of exactly 5 numbers.');
            }

            return isValid;
        }
    };


    // ------------------------------------------------------------------------
    // MODULE 2: PART 1 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part1-layout'] = function(stateDropdownOptionsHtml = "") {
        // Fallback string handling protects the template layout if global variables load late
        var optionsList = stateDropdownOptionsHtml || window.globalStateDropdownOptionsHtml || '<option value="" disabled>-- No States Loaded --</option>';
        
        return `
        <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: FEDERAL INCOME TAX FILING -->
        <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Federal Corporate Tax Filing Compliance</strong>
            All registered business entities must file an annual federal income tax return with the Internal Revenue Service (IRS), regardless of whether the business generated active revenue. The specific return layout and filing milestones depend directly on your formal IRS tax classification (e.g., Form 1065 for partnerships, Form 1120 for C-corporations, or Form 1120-S for S-corporations).
        </div>

        <!-- SECTION 1: COMPANY TAX ID PROFILE -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Company Tax ID Profile</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Business Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="fed_tax_legal_name" required placeholder="Enter company name exactly as registered with the IRS / State" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Employer Identification Number (EIN) <span style="color: #ef4444;">*</span></label>
            <input type="text" id="fed_tax_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Please provide a valid 9-digit format (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_classification" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Tax Classification <span style="color: #ef4444;">*</span></label>
            <select id="fed_tax_classification" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                <option value="" disabled selected>Select IRS Return Profile...</option>
                <option value="sole_prop_1040">Sole Proprietorship / Single-Member LLC (Schedule C / Form 1040)</option>
                <option value="partnership_1065">Partnership / Multi-Member LLC (Form 1065)</option>
                <option value="s_corp_1120s">S-Corporation Election (Form 1120-S)</option>
                <option value="c_corp_1120">C-Corporation (Form 1120)</option>
            </select>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_principal_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Business Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="fed_tax_principal_street" required placeholder="Street address, suite, unit (No P.O. Boxes)" pattern="[A-Za-z0-9\\\\s#\\\\-\\\\.,]+" title="Please provide a valid address layout." class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'fed_tax_principal')">
        </div>

        <div class="wizard-input-group" style="grid-column: span 2;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
                <div>
                    <label for="fed_tax_principal_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="fed_tax_principal_city" required placeholder="City" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
                </div>
                <div>
                    <label for="fed_tax_principal_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
                    <select id="fed_tax_principal_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                        <option value="" disabled selected>Select...</option>
                        ${optionsList}
                    </select>
                </div>
                <div>
                    <label for="fed_tax_principal_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="fed_tax_principal_zip" required placeholder="Zip" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" class="wizard-input-field">
                </div>
            </div>
        </div>
        `;
    };


    // ------------------------------------------------------------------------
    // MODULE 3: PART 2 VALIDATION REGISTER
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part2-validation'] = {
        requiredFields: [
            { id: 'fed_tax_gross_receipts', msg: 'Gross Receipts / Total Sales estimation is required.' },
            { id: 'fed_tax_gross_expenses', msg: 'Total Deductible Expenses estimation is required.' },
            { id: 'fed_tax_accounting_method', msg: 'Accounting Method selection is required.' }
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

            this.requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el) {
                    if (!el.value.trim()) setError(el, field.msg);
                    else clearError(el);
                }
            });

            const grossEl = document.getElementById("fed_tax_gross_receipts");
            if (grossEl && grossEl.value.trim() && parseFloat(grossEl.value) < 0) {
                setError(grossEl, "Gross Receipts / Total Sales cannot be a negative value.");
            }

            const expEl = document.getElementById("fed_tax_gross_expenses");
            if (expEl && expEl.value.trim() && parseFloat(expEl.value) < 0) {
                setError(expEl, "Total Deductible Expenses cannot be a negative value.");
            }

            return isValid;
        }
    };

    // ------------------------------------------------------------------------
    // MODULE 4: PART 3 VALIDATION REGISTER
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part3-validation'] = {
        requiredFields: [
            { id: 'fed_tax_has_extension', msg: 'IRS Extension Form 7004 declaration status is required.' },
            { id: 'fed_tax_has_inventory', msg: 'Physical Inventory tracking declaration choice is required.' }
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

            this.requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el) {
                    if (!el.value.trim()) setError(el, field.msg);
                    else clearError(el);
                }
            });

            const inventoryChoice = document.getElementById("fed_tax_has_inventory");
            if (inventoryChoice && inventoryChoice.value === "yes") {
                const cogsEl = document.getElementById("fed_tax_cogs_value");
                if (cogsEl) {
                    if (!cogsEl.value.trim()) {
                        setError(cogsEl, "Approximate Cost of Goods Sold ($) is required under inventory classifications.");
                    } else if (parseFloat(cogsEl.value) < 0) {
                        setError(cogsEl, "Cost of Goods Sold value cannot be a negative number.");
                    } else {
                        clearError(cogsEl);
                    }
                }
            }

            return isValid;
        }
    };

    // ------------------------------------------------------------------------
    // MODULE 5: PART 4 & PART 5 VALIDATION REGISTERS
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part4-validation'] = {
        requiredFields: [
            { id: 'fed_tax_foreign_accounts', msg: 'International accounts interest response selection is required.' }
        ],
        validate: function() {
            let isValid = true;
            this.requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el && !el.value.trim()) {
                    el.style.borderColor = "#ef4444";
                    isValid = false;
                } else if (el) {
                    el.style.borderColor = "#cbd5e1";
                }
            });
            return isValid;
        }
    };

    window.formRegistry['federal-tax-part5-validation'] = {
        requiredFields: [
            { id: 'fed_tax_file_pnl', msg: 'Profit & Loss Statement (P&L) document upload file is required.' },
            { id: 'fed_tax_file_balance_sheet', msg: 'Year-End Balance Sheet document upload file is required.' }
        ],
        validate: function() {
            let isValid = true;
            this.requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el && !el.value.trim()) {
                    el.style.borderColor = "#ef4444";
                    isValid = false;
                } else if (el) {
                    el.style.borderColor = "#cbd5e1";
                }
            });
            return isValid;
        }
    };


    // ------------------------------------------------------------------------
    // MODULE 6: PART 2 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part2-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 2: FINANCIAL LEDGER DATA -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Gross Financial Ledger Estimates</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide baseline financial estimates for the targeted fiscal tax year to assign your audit scope mapping metrics.</p>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_gross_receipts" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Gross Receipts / Total Sales ($) <span style="color: #ef4444;">*</span></label>
            <input type="number" id="fed_tax_gross_receipts" required placeholder="0.00" min="0" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_gross_expenses" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Total Deductible Expenses ($) <span style="color: #ef4444;">*</span></label>
            <input type="number" id="fed_tax_gross_expenses" required placeholder="0.00" min="0" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <!-- SECTION 3: ACCOUNTING METHODOLOGY -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Accounting Methodology &amp; Target Parameters</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_accounting_method" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Accounting Method <span style="color: #ef4444;">*</span></label>
            <select id="fed_tax_accounting_method" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                <option value="cash" selected>Cash Method (Recognize income when received, expenses when paid)</option>
                <option value="accrual">Accrual Method (Recognize transactions when they occur regardless of payment)</option>
            </select>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_has_extension" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Is an IRS Extension Form 7004 in Effect? <span style="color: #ef4444;">*</span></label>
            <select id="fed_tax_has_extension" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                <option value="no" selected>No, standard statutory filing deadline parameters apply</option>
                <option value="yes">Yes, a valid extension has been filed and processed by the IRS</option>
            </select>
        </div>
        `;
    };


    // ------------------------------------------------------------------------
    // MODULE 7: PART 3 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part3-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 4: ASSETS & INVENTORY SCHEDULE -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Assets &amp; Inventory Schedule</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_has_inventory" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Does Business Maintain Physical Inventory? <span style="color: #ef4444;">*</span></label>
            <select id="fed_tax_has_inventory" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;" onchange="toggleFederalTaxInventoryCostVisibility(this.value)">
                <option value="no" selected>No physical inventory tracking required (Service oriented business)</option>
                <option value="yes">Yes, inventory values are maintained (Requires Cost of Goods Sold calculations)</option>
            </select>
        </div>

        <!-- Hidden Conditional Container: Inventory Accounting Details -->
        <div id="fed_tax_inventory_wrapper" class="wizard-input-group" style="grid-column: span 1; display: none; flex-direction: column; gap: 4px;">
            <label for="fed_tax_cogs_value" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Approximate Cost of Goods Sold ($) <span style="color: #ef4444;">*</span></label>
            <input type="number" id="fed_tax_cogs_value" placeholder="0.00" min="0" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <!-- SECTION 5: INTERNATIONAL OPERATIONS CHECK -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. International Accounts &amp; Foreign Transactions</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_foreign_accounts" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Did this entity hold any interest in foreign financial accounts or assets? <span style="color: #ef4444;">*</span></label>
            <select id="fed_tax_foreign_accounts" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                <option value="no" selected>No foreign transaction layers, overseas bank accounts, or asset registries</option>
                <option value="yes">Yes, foreign financial assets or accounts exist (Requires FBAR / Form 8938 tracking)</option>
            </select>
        </div>
        `;
    };


    // ------------------------------------------------------------------------
    // MODULE 8: PART 4 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part4-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 6: MANDATORY FINANCIAL STATEMENT UPLOADS -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Financial Documentation &amp; Reconciliation Packets</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Please attach your complete bookkeeping data nodes below to authorize CPA preparation and verification routines:</p>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_file_pnl" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Profit &amp; Loss Statement (P&amp;L) <span style="color: #ef4444;">*</span></label>
            <input type="file" id="fed_tax_file_pnl" required class="wizard-input-field" accept=".pdf,.xls,.xlsx,.csv,image/*" style="width: 100%; padding: 8px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px; background: #ffffff;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_file_balance_sheet" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Year-End Balance Sheet <span style="color: #ef4444;">*</span></label>
            <input type="file" id="fed_tax_file_balance_sheet" required class="wizard-input-field" accept=".pdf,.xls,.xlsx,.csv,image/*" style="width: 100%; padding: 8px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px; background: #ffffff;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_file_prior_return" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Copy of Prior Year Federal Tax Return (If Applicable)</label>
            <input type="file" id="fed_tax_file_prior_return" class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; padding: 8px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px; background: #ffffff;">
        </div>
        `;
    };

    // ------------------------------------------------------------------------
    // MODULE 9: PART 5 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-part5-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 7: ADDITIONAL PROVISIONS & DIRECTIVES -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">7. Special Directives &amp; Disclosures</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="fed_tax_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Tax Instructions or Disclosure Notes</label>
            <textarea id="fed_tax_provisions" placeholder="Detail any unique transaction layers, asset depreciations (Section 179), state tax bridge connections, or specific CPA handling directives..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
        </div>
        `;
    };

    // ------------------------------------------------------------------------
    // SYSTEM INTEGRATION: MASTER SYSTEM RENDER ENGINE & LIFECYCLE LISTENERS
    // ------------------------------------------------------------------------
    window.formRegistry['federal-tax-form-master'] = function(stateDropdownOptionsHtml = "") {
        
        // Combines all structural step views back-to-back using parameters cleanly
        const combinedHtml = window.formRegistry['federal-tax-part1-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['federal-tax-part2-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['federal-tax-part3-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['federal-tax-part4-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['federal-tax-part5-layout'](stateDropdownOptionsHtml);

        // Microtask queue lifecycle attachment
        setTimeout(() => {
            // Evaluates parameter nodes and hooks active physical inventory value wrappers safely
            if (typeof toggleFederalTaxInventoryCostVisibility !== 'function') {
                window.toggleFederalTaxInventoryCostVisibility = function(value) {
                    const inventoryWrapper = document.getElementById("fed_tax_inventory_wrapper");
                    const cogsInput = document.getElementById("fed_tax_cogs_value");
                    if (!inventoryWrapper) return;
                    
                    if (value === "yes") {
                        inventoryWrapper.style.setProperty("display", "block", "important");
                        if (cogsInput) cogsInput.setAttribute("required", "required");
                    } else {
                        inventoryWrapper.style.setProperty("display", "none", "important");
                        if (cogsInput) {
                            cogsInput.removeAttribute("required");
                            cogsInput.value = "";
                        }
                    }
                };
            }
        }, 0);

        return combinedHtml;
    };
}

