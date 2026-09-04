// ============================================================================ // 
// ðŸ“ EMPLOYER ID (EIN) WIZARD ENGINE REGISTER                                  // 
// ============================================================================ // 
function initEmployerIdEinService() { 
    // BREAK THE INFINITE LOOP: If this module's validation layout has already been registered, exit immediately 
    if (window.formRegistry && window.formRegistry['employer-id-ein-part1-validation']) { 
        return; 
    } 

    window.formRegistry = window.formRegistry || {}; 

    // ------------------------------------------------------------------------ // 
    // MODULE 1: PART 1 VALIDATION REGISTER                                     // 
    // ------------------------------------------------------------------------ // 
    window.formRegistry['employer-id-ein-part1-validation'] = { 
        requiredFields: [ 
            { id: 'ein_applicant_name', msg: 'Full Name or Business Name is required.' }, 
            { id: 'ein_business_structure', msg: 'Please select a Business Structure.' }, 
            { id: 'ein_business_street', msg: 'Business Physical Address Street is required.' }, 
            { id: 'ein_business_city', msg: 'Business Physical Address City is required.' }, 
            { id: 'ein_business_state', msg: 'Business Physical Address State selection is required.' }, 
            { id: 'ein_business_zip', msg: 'Business Physical Address Zip Code is required.' }, 
            { id: 'ein_mailing_choice', msg: 'Mailing Address Selection is required.' } 
        ], 
        validate: function() { 
            let isValid = true; 
            let errors = []; 
            
            // FIXED: setError now captures the exact fieldId so errors map perfectly
            const setError = (el, msg, fieldId) => { 
                if (el) el.style.borderColor = "#ef4444"; 
                isValid = false; 
                
                // Avoid duplicating the exact error tracking payload
                if (!errors.some(err => err.id === fieldId)) {
                    errors.push({ id: fieldId, msg: msg }); 
                }
            }; 
            const clearError = (el) => { 
                if (el) el.style.borderColor = "#cbd5e1"; 
            }; 

            // 1. Process standard mandatory fields presence checks 
            this.requiredFields.forEach(field => { 
                const el = document.getElementById(field.id); 
                if (el) { 
                    if (!el.value.trim()) {
                        setError(el, field.msg, field.id); 
                    } else {
                        clearError(el); 
                    }
                } 
            }); 

            // 2. Validate Baseline Physical Business ZIP Formatting 
            const zipEl = document.getElementById("ein_business_zip"); 
            if (zipEl && zipEl.value.trim()) {
                if (!/^\d{5}$/.test(zipEl.value.trim())) {
                    setError(zipEl, 'Business Physical Address Zip Code must consist of exactly 5 numbers.', 'ein_business_zip'); 
                } else {
                    clearError(zipEl);
                }
            } 

            // 3. Conditional Check: Validate Custom Structure Textbox if choice equals OTHER 
            const structureChoice = document.getElementById("ein_business_structure"); 
            if (structureChoice && structureChoice.value === "other") { 
                const otherTextEl = document.getElementById("ein_structure_other_text"); 
                if (otherTextEl) {
                    if (!otherTextEl.value.trim()) { 
                        setError(otherTextEl, "Please specify your structural entity classification.", "ein_structure_other_text"); 
                    } else { 
                        clearError(otherTextEl); 
                    } 
                }
            } 

            // 4. Conditional Check: Validate Alternate Mailing records if choice equals DIFFERENT 
            const mailingChoice = document.getElementById("ein_mailing_choice"); 
            if (mailingChoice && mailingChoice.value === "different") { 
                const alternateMailingFields = [ 
                    { id: 'ein_mailing_street', msg: 'Alternate Mailing Street Address is required.' }, 
                    { id: 'ein_mailing_city', msg: 'Alternate Mailing City is required.' }, 
                    { id: 'ein_mailing_state', msg: 'Alternate Mailing State selection is required.' }, 
                    { id: 'ein_mailing_zip', msg: 'Alternate Mailing Zip Code is required.' } 
                ]; 
                alternateMailingFields.forEach(field => { 
                    const el = document.getElementById(field.id); 
                    if (el) { 
                        const val = el.value.trim(); 
                        let isFieldValid = !!val; 
                        
                        if (field.id === 'ein_mailing_zip' && val && !/^\d{5}$/.test(val)) { 
                            isFieldValid = false; 
                            setError(el, 'Alternate Mailing Zip Code must consist of exactly 5 numbers.', field.id); 
                        } 
                        
                        if (!isFieldValid) { 
                            setError(el, field.msg, field.id); 
                        } else if (field.id !== 'ein_mailing_zip' || /^\d{5}$/.test(val)) { 
                            clearError(el); 
                        } 
                    } 
                }); 
            } 

            // FIXED: Return structured object payload matching global advancement criteria
            return { isValid: isValid, errors: errors }; 
        } 
    }; 
}



// ------------------------------------------------------------------------
    // MODULE 2: PART 1 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['employer-id-ein-part1-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: WHAT IS AN EIN? -->
        <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Federal Tax Identification Standards</strong>
            An Employer Identification Number (EIN), also recognized as a Federal Tax Identification Number, is a unique nine-digit numerical identifier assigned by the Internal Revenue Service (IRS). It is a structural mandate for establishing commercial banking facilities, hiring payroll personnel, maintaining clear corporate transparency shields, and filing corporate tax returns.
        </div>

        <!-- SECTION 1: APPLICANT INFORMATION -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Applicant Information</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_applicant_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Full Name or Business Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ein_applicant_name" required placeholder="Individual primary registrant full name or legal corporate title" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_business_structure" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Structure <span style="color: #ef4444;">*</span></label>
            <select id="ein_business_structure" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;" onchange="toggleEinStructureSpecificationVisibility(this.value)">
                <option value="" disabled selected>Select Structure...</option>
                <option value="sole_prop">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC (Limited Liability Company)</option>
                <option value="other">Other Structural Entity</option>
            </select>
        </div>

        <!-- Hidden Conditional Container: Other Structure Specification -->
        <div id="ein_structure_other_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; flex-direction: column; gap: 4px;">
            <label for="ein_structure_other_text" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify structure: <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ein_structure_other_text" placeholder="e.g., Non-Profit Corporation, Estate, Personal Trust, S-Corp Choice..." class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_business_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Business Physical Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ein_business_street" required placeholder="Physical Location Street Address (No P.O. Boxes)" pattern="[A-Za-z0-9\\\\s\\\\#\\\\-\\\\.\\\\,\\\\s]+" title="Please provide a valid address layout." class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ein_business')">
        </div>

        <div class="wizard-input-group" style="grid-column: span 2;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
                <div>
                    <label for="ein_business_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="ein_business_city" required placeholder="City" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
                </div>
                <div>
                    <label for="ein_business_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
                    <select id="ein_business_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                        ${stateDropdownOptionsHtml}
                    </select>
                </div>
                <div>
                    <label for="ein_business_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="ein_business_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" class="wizard-input-field">
                </div>
            </div>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_mailing_choice" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Mailing Address Selection <span style="color: #ef4444;">*</span></label>
            <select id="ein_mailing_choice" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;" onchange="toggleEinMailingVisibility(this.value)">
                <option value="same" selected>Mailing Address is identical to Business Address</option>
                <option value="different">Mailing Address is different</option>
            </select>
        </div>

        <!-- Hidden Conditional Container: Alternate Mailing Address Records -->
        <div id="ein_mailing_wrapper" style="grid-column: span 2; display: none; flex-direction: column; gap: 16px;">
            <div style="background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Alternate Mailing Address Records</span>
                
                <div class="wizard-input-group" style="grid-column: span 2; margin: 0; display: flex; flex-direction: column; gap: 4px;">
                    <label for="ein_mailing_street" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Mailing Street Address <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="ein_mailing_street" placeholder="Mailing Street Name and Number, P.O. Box, or Suite" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ein_mailing')">
                </div> <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; box-sizing: border-box;">
                    <div>
                       
                        <label for="ein_mailing_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
                        <input type="text" id="ein_mailing_city" placeholder="City" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
                    </div>
                    <div>
                        <label for="ein_mailing_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
                        <select id="ein_mailing_state" class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; background-color: #ffffff; color: var(--slate); box-sizing: border-box; height: 42px;">
                            ${stateDropdownOptionsHtml}
                        </select>
                    </div>
                    <div>
                        <label for="ein_mailing_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
                        <input type="text" id="ein_mailing_zip" placeholder="Zip Code" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;" class="wizard-input-field">
                    </div>
                </div>
            </div>
        </div>
        `;
    };

// ------------------------------------------------------------------------ // 
// MODULE 3: PART 2 VALIDATION REGISTER (FORM ISOLATED FIX)                 // 
// ------------------------------------------------------------------------ // 
window.formRegistry['employer-id-ein-part2-validation'] = { 
    requiredFields: [ 
        { id: 'ein_applicant_phone', msg: 'Applicant Contact Phone Number is required.' }, 
        { id: 'ein_applicant_email', msg: 'Applicant Contact Email Address is required.' } 
    ], 
    validate: function() { 
        if (!document.getElementById('ein_applicant_phone')) {
            return { isValid: true, errors: [] }; 
        }

        let isValid = true; 
        let errors = []; 
        
        const setError = (el, msg, fieldId) => { 
            if (el) el.style.borderColor = "#ef4444"; 
            isValid = false; 
            // FIXED: Explicitly attach the precise EIN ID so the master gate doesn't guess
            if (!errors.some(e => e.id === fieldId)) {
                errors.push({ id: fieldId, msg: msg }); 
            }
        }; 
        const clearError = (el) => { 
            if (el) el.style.borderColor = "#cbd5e1"; 
        }; 

        // 1. Process explicit presence checks
        this.requiredFields.forEach(field => { 
            const el = document.getElementById(field.id); 
            if (el) { 
                if (!el.value.trim()) {
                    setError(el, field.msg, field.id); 
                } else {
                    clearError(el); 
                }
            } 
        }); 

        // 2. Validate Contact Email Layout String Formatting 
        const emailEl = document.getElementById("ein_applicant_email"); 
        if (emailEl && emailEl.value.trim()) {
            const cleanEmail = emailEl.value.trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
                setError(emailEl, "Please provide a valid applicant email address.", "ein_applicant_email"); 
            } else {
                clearError(emailEl);
            }
        } 

        // 3. Validate Phone Number Characters Array Length 
        const phoneEl = document.getElementById("ein_applicant_phone"); 
        if (phoneEl && phoneEl.value.trim()) { 
            const cleanDigits = phoneEl.value.replace(/\D/g, ""); 
            if (cleanDigits.length < 10) {
                setError(phoneEl, "Applicant Phone Number must contain at least 10 digits.", "ein_applicant_phone"); 
            } else {
                clearError(phoneEl);
            }
        } 

        // 4. Validate Checkbox Group 
        let baselineReasonChecked = false; 
        for (let i = 1; i <= 5; i++) { 
            const reasonBox = document.getElementById(`ein_reason_${i}`); 
            if (reasonBox && reasonBox.checked) { 
                baselineReasonChecked = true; 
                break; 
            } 
        } 
        if (!baselineReasonChecked) { 
            isValid = false; 
            errors.push({ id: "ein_reason_1", msg: "Please select at least one reason for applying to obtain an EIN." }); 
        } 

        // 5. Conditional Check: Validate custom reason text box if checkbox #5 is active 
        const otherReasonBox = document.getElementById("ein_reason_5"); 
        if (otherReasonBox && otherReasonBox.checked) { 
            const customTextEl = document.getElementById("ein_reason_other_text"); 
            if (customTextEl && !customTextEl.value.trim()) { 
                setError(customTextEl, "Please specify your unique parameter reasons for obtaining an EIN.", "ein_reason_other_text"); 
            } else if (customTextEl) { 
                clearError(customTextEl); 
            } 
        } 

        return { isValid: isValid, errors: errors }; 
    } 
};



    // ------------------------------------------------------------------------
    // MODULE 4: PART 2 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['employer-id-ein-part2-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 2: APPLICANT CONTACT INFORMATION -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Applicant Contact Information</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_applicant_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Phone Number <span style="color: #ef4444;">*</span></label>
            <input type="tel" id="ein_applicant_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_applicant_email" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Email Address <span style="color: #ef4444;">*</span></label>
            <input type="email" id="ein_applicant_email" required placeholder="email@example.com" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <!-- SECTION 3: REASON FOR APPLYING -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px; margin-bottom: 8px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Reason for Applying</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Select the primary reasons for applying for this Employer Identification Number (Check all that apply):</p>
        </div>

        <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box;">
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ein_reason_1" value="started_new_business" style="margin-top: 3px;">
                <label for="ein_reason_1" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Starting a new business entity</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ein_reason_2" value="hiring_employees" style="margin-top: 3px;">
                <label for="ein_reason_2" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Hiring operational employees / payroll setup</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ein_reason_3" value="banking_purposes" style="margin-top: 3px;">
                <label for="ein_reason_3" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Banking purposes (Opening a business checking account)</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ein_reason_4" value="federal_tax_compliance" style="margin-top: 3px;">
                <label for="ein_reason_4" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Compliance with statutory federal tax laws</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px; grid-column: span 2;">
                <input type="checkbox" id="ein_reason_5" value="other" style="margin-top: 3px;" onchange="toggleEinReasonSpecificationVisibility(this.checked)">
                <label for="ein_reason_5" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Other unique parameter reasons (Specify below)</label>
            </div>
        </div>

        <!-- Hidden Conditional Container: Other Reason Specification -->
        <div id="ein_reason_other_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_reason_other_text" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Please specify reason: <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ein_reason_other_text" placeholder="e.g., Changed business structure configuration type, purchasing an existing business asset..." class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>
        `;
    };


   // ------------------------------------------------------------------------ // 
// MODULE 5: PART 3 VALIDATION REGISTER                                     // 
// ------------------------------------------------------------------------ // 
window.formRegistry['employer-id-ein-part3-validation'] = { 
    requiredFields: [ 
        { id: 'ein_activities_desc', msg: 'Description of Business Activities is required.' }, 
        { id: 'ein_employee_count', msg: 'Expected employee headcount projection metric is required.' } 
    ], 
    validate: function() { 
        // FIXED STEP GUARD: If the activities description box isn't in the DOM yet, pass safely!
        if (!document.getElementById('ein_activities_desc')) {
            return true; 
        }

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

        // 1. Process validation checks for active step fields 
        this.requiredFields.forEach(field => { 
            const el = document.getElementById(field.id); 
            if (el) { 
                if (!el.value.trim()) setError(el, field.msg); 
                else clearError(el); 
            } 
        }); 

        // 2. Validate Headcount Range Logic 
        const countEl = document.getElementById("ein_employee_count"); 
        if (countEl && countEl.value.trim()) { 
            const parsedVal = parseInt(countEl.value, 10); 
            if (isNaN(parsedVal) || parsedVal < 0) { 
                setError(countEl, "Expected headcount must be a valid positive integer choice."); 
            } 
        } 
        return isValid; 
    } 
};


 // ------------------------------------------------------------------------ // 
// MODULE 6: PART 4 VALIDATION REGISTER                                     // 
// ------------------------------------------------------------------------ // 
window.formRegistry['employer-id-ein-part4-validation'] = { 
    requiredFields: [ 
        { id: 'ein_responsible_name', msg: 'Name of the Responsible Party is required.' }, 
        { id: 'ein_responsible_id', msg: 'Responsible Party Social Security Number (SSN) or ITIN is required.' } 
    ], 
    validate: function() { 
        // FIXED STEP GUARD: If the fields aren't even on the page, don't block the wizard!
        if (!document.getElementById('ein_responsible_name')) {
            return true; 
        }

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

        const ssnEl = document.getElementById("ein_responsible_id"); 
        if (ssnEl && ssnEl.value.trim()) { 
            const pureSsn = ssnEl.value.replace(/\D/g, ""); 
            if (pureSsn.length !== 9) { 
                setError(ssnEl, "Responsible Party Identification must consist of exactly 9 digits (XXX-XX-XXXX)."); 
            } 
        } 
        return isValid; 
    } 
}; 

// ------------------------------------------------------------------------ // 
// MODULE 7: PART 5 VALIDATION REGISTER                                     // 
// ------------------------------------------------------------------------ // 
window.formRegistry['employer-id-ein-part5-validation'] = { 
    requiredFields: [ 
        { id: 'ein_start_date', msg: 'Date Business Started is required.' } 
    ], 
    validate: function() { 
        // FIXED STEP GUARD: If the start date field isn't on the page, bypass quietly
        if (!document.getElementById('ein_start_date')) {
            return true; 
        }

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

        const pastEinEl = document.getElementById("ein_existing_number"); 
        if (pastEinEl && pastEinEl.value.trim()) { 
            const purePast = pastEinEl.value.replace(/\D/g, ""); 
            if (purePast.length !== 9) { 
                setError(pastEinEl, "Optional existing EIN must consist of exactly 9 digits (XX-XXXXXXX)."); 
            } 
        } 
        return isValid; 
    } 
};



    // ------------------------------------------------------------------------
    // MODULE 8: PART 3 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['employer-id-ein-part3-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 4: BUSINESS ACTIVITIES -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Business Activities</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_activities_desc" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Description of Business Activities <span style="color: #ef4444;">*</span></label>
            <textarea id="ein_activities_desc" required placeholder="Briefly describe what your business will do (e.g., Retail sales of apparel, logistics and commercial transport, consulting, software engineering)..." class="wizard-input-field" style="width: 100%; min-height: 70px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_employee_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Number of Employees Expected Next 12 Months <span style="color: #ef4444;">*</span></label>
            <input type="number" id="ein_employee_count" required placeholder="Enter 0 if none currently expected" min="0" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>
        `;
    };


    // ------------------------------------------------------------------------
    // MODULE 9: PART 4 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['employer-id-ein-part4-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 5: RESPONSIBLE PARTY -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Responsible Party</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The IRS requires the true principal officer, general partner, or owner to be designated as the responsible party.</p>
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_responsible_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Name of the Responsible Party <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ein_responsible_name" required placeholder="First and Last Legal Name of Individual" class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_responsible_id" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Social Security Number (SSN) or Individual Taxpayer Identification Number (ITIN) <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ein_responsible_id" required placeholder="000-00-0000" pattern="[0-9]{3}\\\\-[0-9]{2}\\\\-[0-9]{4}" title="Please provide a valid 9-digit layout (XXX-XX-XXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>
        `;
    };


    // ------------------------------------------------------------------------
    // MODULE 10: PART 5 LAYOUT REGISTER (ROUNDED FIELDS)
    // ------------------------------------------------------------------------
    window.formRegistry['employer-id-ein-part5-layout'] = function(stateDropdownOptionsHtml = "") {
        return `
        <!-- SECTION 6: ADDITIONAL INFORMATION -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">6. Additional Information</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_start_date" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Date Business Started <span style="color: #ef4444;">*</span></label>
            <input type="date" id="ein_start_date" required class="wizard-input-field" style="width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 4px;">
            <label for="ein_existing_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Existing EIN (If Applicable)</label>
            <input type="text" id="ein_existing_number" placeholder="00-0000000" pattern="[0-9]{2}\\\\-[0-9]{7}" title="Please provide a valid 9-digit format (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; height: 42px;">
        </div>
        `;
    };

    // ------------------------------------------------------------------------
    // SYSTEM INTEGRATION: MASTER SYSTEM RENDER ENGINE & TIMEOUT HOOKS
    // ------------------------------------------------------------------------
    window.formRegistry['employer-id-ein-form-master'] = function(stateDropdownOptionsHtml = "") {
        
        // Combines all structural step views back-to-back using parameters cleanly
        const combinedHtml = window.formRegistry['employer-id-ein-part1-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['employer-id-ein-part2-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['employer-id-ein-part3-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['employer-id-ein-part4-layout'](stateDropdownOptionsHtml) + 
                             window.formRegistry['employer-id-ein-part5-layout'](stateDropdownOptionsHtml);

        // Microtask queue lifecycle attachment
        setTimeout(() => {
            // Evaluates parameter nodes and hooks active dynamic structure toggles safely
            if (typeof toggleEinStructureSpecificationVisibility !== 'function') {
                window.toggleEinStructureSpecificationVisibility = function(value) {
                    const otherWrapper = document.getElementById("ein_structure_other_wrapper");
                    const otherInput = document.getElementById("ein_structure_other_text");
                    if (!otherWrapper) return;
                    if (value === "other") {
                        otherWrapper.style.setProperty("display", "block", "important");
                        if (otherInput) otherInput.setAttribute("required", "required");
                    } else {
                        otherWrapper.style.setProperty("display", "none", "important");
                        if (otherInput) { otherInput.removeAttribute("required"); otherInput.value = ""; }
                    }
                };
            }

            // Evaluates parameter nodes and hooks active mailing address profile triggers safely
            if (typeof toggleEinMailingVisibility !== 'function') {
                window.toggleEinMailingVisibility = function(value) {
                    const mailingWrapper = document.getElementById("ein_mailing_wrapper");
                    if (!mailingWrapper) return;
                    const inputs = mailingWrapper.querySelectorAll("input, select");
                    if (value === "different") {
                        mailingWrapper.style.setProperty("display", "flex", "important");
                        inputs.forEach(el => el.setAttribute("required", "required"));
                    } else {
                        mailingWrapper.style.setProperty("display", "none", "important");
                        inputs.forEach(el => { el.removeAttribute("required"); el.value = ""; });
                    }
                };
            }

            // Evaluates parameter nodes and hooks active custom checkboxes reason wrappers safely
            if (typeof toggleEinReasonSpecificationVisibility !== 'function') {
                window.toggleEinReasonSpecificationVisibility = function(isChecked) {
                    const otherReasonWrapper = document.getElementById("ein_reason_other_wrapper");
                    const otherReasonInput = document.getElementById("ein_reason_other_text");
                    if (!otherReasonWrapper) return;
                    if (isChecked) {
                        otherReasonWrapper.style.setProperty("display", "block", "important");
                        if (otherReasonInput) otherReasonInput.setAttribute("required", "required");
                    } else {
                        otherReasonWrapper.style.setProperty("display", "none", "important");
                        if (otherReasonInput) { otherReasonInput.removeAttribute("required"); otherReasonInput.value = ""; }
                    }
                };
            }
        }, 0);

        return combinedHtml;
    };


