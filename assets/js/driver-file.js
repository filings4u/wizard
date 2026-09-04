/**
 * Filings4U Platform Architecture
 * Module: driver-file.js (Part 1 of 4)
 * Standalone Namespace Init & Part 1 Layout Setup
 */
window.formRegistry = window.formRegistry || {};

// --- PART 1 LAYOUT: MOTOR CARRIER PROFILE FRAMEWORK ---
window.formRegistry['driver-file-part1-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- COMPLIANCE BANNER: FORCED TO SPAN FULL ROW WIDTH -->
        <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> FMCSR Part 391 Driver Qualification (DQ) Mandates</strong>
            Under Federal Motor Carrier Safety Administration (FMCSA) regulations Part 391, every motor carrier must maintain a comprehensive Driver Qualification File (DQF) for each commercial motor vehicle driver they employ. This mandate applies to all operators of vehicles over 10,001 lbs, vehicles designed to carry 8+ passengers, or placardable hazmat shipments. Failing to maintain current DQ records results in immediate safety audit failures and severe regulatory fines.
        </div>

        <!-- SECTION 1 HEADER WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Motor Carrier Profile</h3>
        </div>

        <!-- FIELD 1: OFFICIAL MOTOR CARRIER NAME -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
            <label for="dqf_carrier_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Motor Carrier Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="dqf_carrier_name" required placeholder="Enter company name exactly as registered on your USDOT portal" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_dqf_carrier_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 2 & FIELD 3 SUB-GRID (SPAN 1 EACH TO SIT BALANCED) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_usdot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">USDOT Number <span style="color: #ef4444;">*</span></label>
            <input type="text" id="dqf_usdot_number" required placeholder="e.g. 1234567" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_dqf_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_file_purpose" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">File Procurement Scope <span style="color: #ef4444;">*</span></label>
            <select id="dqf_file_purpose" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onchange="window.toggleDqfFleetQuantityVisibility(this.value)">
                <option value="owner-operator" selected>Owner-Operator Setup (Single file tracking for company principal)</option>
                <option value="fleet-addition">Fleet Operator (Procuring new hire files for multiple drivers)</option>
            </select>
            <div class="wizard-error-message" id="err_dqf_file_purpose" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- BATCH FILES QUANTITY WRAPPER -->
        <div id="dqf_fleet_count_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none; margin-top: 16px;">
            <label for="dqf_total_files_needed" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Total Number of Driver Files Needed <span style="color: #ef4444;">*</span></label>
            <input type="number" id="dqf_total_files_needed" value="1" min="1" max="100" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-weight: 600;">
            <div class="wizard-error-message" id="err_dqf_total_files_needed" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: driver-file.js (Part 2 of 4)
 * Standalone Section 2 Driver Identity & Licensure Components
 */
window.formRegistry = window.formRegistry || {};

// --- PART 2 LAYOUT: PRIMARY DRIVER REGISTRY MATRIX ---
window.formRegistry['driver-file-part2-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 2: PRIMARY DRIVER REGISTRY MATRIX -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Primary Driver Registry &amp; Licensure Records</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide detailed identification history. FMCSR Part 391 requires verifiable multi-year history tracking for auditing validation.</p>
        </div>

        <!-- FIELD 1: DRIVER NAME -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
            <label for="dqf_driver_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Driver Full Legal Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="dqf_driver_name" required placeholder="First, Middle, and Last Name exactly as shown on license" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_dqf_driver_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 2 & 3: BIRTH DATE & CDL NUMBER ROW -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_driver_dob" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Date of Birth <span style="color: #ef4444;">*</span></label>
            <input type="date" id="dqf_driver_dob" required class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_dqf_driver_dob" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_license_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Commercial Driver's License (CDL) Number <span style="color: #ef4444;">*</span></label>
            <input type="text" id="dqf_license_number" required placeholder="Enter License Number" style="font-family: monospace; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" class="wizard-input-field">
            <div class="wizard-error-message" id="err_dqf_license_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 4 & 5: ISSUING JURISDICTION & MEDICAL CARD EXPIRY ROW -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_license_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Issuing State / Jurisdiction <span style="color: #ef4444;">*</span></label>
            <select id="dqf_license_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
                <option value="" disabled selected>Select State...</option>
                ${stateDropdownOptionsHtml}
            </select>
            <div class="wizard-error-message" id="err_dqf_license_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_med_card_expiry" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">DOT Medical Card Expiration Date <span style="color: #ef4444;">*</span></label>
            <input type="date" id="dqf_med_card_expiry" required class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_dqf_med_card_expiry" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 6 & 7: MVR CHOICE & EMPLOYMENT HIRE DATE ROW -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_mvr_required" style="font-size: 0.825rem; font-weight: 700; color: var(--navy); display: block; margin-bottom: 4px;">Request 3-Year Motor Vehicle Record (MVR)? <span style="color: #ef4444;">*</span></label>
            <select id="dqf_mvr_required" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
                <option value="yes" selected>Yes, include certified state MVR procurement and annual review data logs</option>
                <option value="no">No, we maintain independent state MVR registry pulls internally</option>
            </select>
            <div class="wizard-error-message" id="err_dqf_mvr_required" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="dqf_hire_date" style="font-size: 0.825rem; font-weight: 700; color: var(--navy); display: block; margin-bottom: 4px;">Driver Hire Date <span style="color: #ef4444;">*</span></label>
            <input type="date" id="dqf_hire_date" required class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
            <div class="wizard-error-message" id="err_dqf_hire_date" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: driver-file.js (Part 3 of 4)
 * Standalone Section 3 Layout Definition
 */
window.formRegistry = window.formRegistry || {};

// --- PART 3 LAYOUT: SPECIAL COMPLIANCE MEMO NOTES ---
window.formRegistry['driver-file-part3-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 3 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Special Compliance Notes &amp; Directives</h3>
        </div>

        <!-- SPECIAL HANDLING TEXTAREA (FULL WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
            <label for="dqf_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Special File Setup Instructions or Prior Employment Variances</label>
            <textarea id="dqf_provisions" placeholder="Detail any past safety violations disclosures, multi-state commercial license history, exemptions for seasonal agricultural operations, or specific fleet audit urgency tracking constraints..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: driver-file.js (Part 4 of 4)
 * Central Form Validation & Render Connections
 */
window.formRegistry = window.formRegistry || {};

// --- PART 1 VALIDATION MATRIX ENGINE ---
window.formRegistry['driver-file-part1-validation'] = {
    validate: function() {
        let isValid = true;
        const markInvalid = (inputEl, errorEl, msg) => {
            if (!errorEl) return;
            errorEl.textContent = msg;
            errorEl.style.setProperty("display", "block", "important");
            if (inputEl) inputEl.style.setProperty("border-color", "#ef4444", "important");
            isValid = false;
        };
        const markValid = (inputEl, errorEl) => {
            if (!errorEl) return;
            errorEl.style.setProperty("display", "none", "important");
            if (inputEl) inputEl.style.setProperty("border-color", "#cbd5e1", "important");
        };

        const carrierField = document.getElementById('dqf_carrier_name');
        const carrierErr = document.getElementById('err_dqf_carrier_name');
        if (carrierField && (carrierField.offsetWidth > 0 || carrierField.offsetHeight > 0)) {
            if (!carrierField.value.trim()) markInvalid(carrierField, carrierErr, "Official motor carrier name is required.");
            else markValid(carrierField, carrierErr);
        }

        const dotField = document.getElementById('dqf_usdot_number');
        const dotErr = document.getElementById('err_dqf_usdot_number');
        if (dotField && dotErr && (dotField.offsetWidth > 0 || dotField.offsetHeight > 0)) {
            const rawDot = dotField.value.trim();
            if (!rawDot) markInvalid(dotField, dotErr, "USDOT number is required.");
            else if (!/^\d+$/.test(rawDot)) markInvalid(dotField, dotErr, "USDOT parameters must contain numbers only.");
            else markValid(dotField, dotErr);
        }

        const purposeField = document.getElementById('dqf_file_purpose');
        const purposeErr = document.getElementById('err_dqf_file_purpose');
        if (purposeField && (purposeField.offsetWidth > 0 || purposeField.offsetHeight > 0)) {
            if (!purposeField.value) markInvalid(purposeField, purposeErr, "Please specify your driver file procurement scope.");
            else markValid(purposeField, purposeErr);
        }

        const countField = document.getElementById('dqf_total_files_needed');
        const countErr = document.getElementById('err_dqf_total_files_needed');
        if (purposeField && purposeField.value === "fleet-addition") {
            if (countField && countErr) {
                const val = parseInt(countField.value, 10);
                if (isNaN(val) || val < 1) markInvalid(countField, countErr, "Please declare a valid number of driver files needed (minimum of 1).");
                else if (val > 100) markInvalid(countField, countErr, "Single batch procurement operations are capped at a maximum of 100 driver files.");
                else markValid(countField, countErr);
            }
        } else {
            if (countField && countErr) markValid(countField, countErr);
        }
        return { isValid };
    }
};

// --- PARTS 2 AND 3 VALIDATION MATRIX ENGINE ---
window.formRegistry['driver-file-parts2-and-3-validation'] = {
    validate: function() {
        let isValid = true;
        const markInvalid = (inputEl, errorEl, msg) => {
            if (!errorEl) return;
            errorEl.textContent = msg;
            errorEl.style.setProperty("display", "block", "important");
            if (inputEl) inputEl.style.setProperty("border-color", "#ef4444", "important");
            isValid = false;
        };
        const markValid = (inputEl, errorEl) => {
            if (!errorEl) return;
            errorEl.style.setProperty("display", "none", "important");
            if (inputEl) inputEl.style.setProperty("border-color", "#cbd5e1", "important");
        };

        const nameField = document.getElementById('dqf_driver_name');
        const nameErr = document.getElementById('err_dqf_driver_name');
        if (nameField && (nameField.offsetWidth > 0 || nameField.offsetHeight > 0)) {
            if (!nameField.value.trim()) markInvalid(nameField, nameErr, "Driver's full legal name is required.");
            else markValid(nameField, nameErr);
        }

        const dobField = document.getElementById('dqf_driver_dob');
        const dobErr = document.getElementById('err_dqf_driver_dob');
        if (dobField && dobErr && (dobField.offsetWidth > 0 || dobField.offsetHeight > 0)) {
            if (dobField.value) {
                const dob = new Date(dobField.value);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                if (age < 18) markInvalid(dobField, dobErr, `Driver must be at least 18 to operate a commercial vehicle. (Current age: ${age})`);
                else if (age < 21) markInvalid(dobField, dobErr, `FMCSR regulations mandate a minimum age of 21 for interstate transit files. (Current age: ${age})`);
                else markValid(dobField, dobErr);
            } else {
                markInvalid(dobField, dobErr, "Driver date of birth is required.");
            }
        }

        const licenseField = document.getElementById('dqf_license_number');
        const licenseErr = document.getElementById('err_dqf_license_number');
        if (licenseField && (licenseField.offsetWidth > 0 || licenseField.offsetHeight > 0)) {
            if (!licenseField.value.trim()) markInvalid(licenseField, licenseErr, "Commercial driver's license number is required.");
            else markValid(licenseField, licenseErr);
        }

        const stateField = document.getElementById('dqf_license_state');
        const stateErr = document.getElementById('err_dqf_license_state');
        if (stateField && (stateField.offsetWidth > 0 || stateField.offsetHeight > 0)) {
            if (!stateField.value) markInvalid(stateField, stateErr, "Please select the driver's license state jurisdiction.");
            else markValid(stateField, stateErr);
        }

        const medField = document.getElementById('dqf_med_card_expiry');
        const medErr = document.getElementById('err_dqf_med_card_expiry');
        if (medField && medErr && (medField.offsetWidth > 0 || medField.offsetHeight > 0)) {
            if (medField.value) {
                const expiryDate = new Date(medField.value);
                const today = new Date(); today.setHours(0,0,0,0);
                if (expiryDate < today) markInvalid(medField, medErr, "A driver cannot remain active on public highways with an expired DOT medical card.");
                else markValid(medField, medErr);
            } else {
                markInvalid(medField, medErr, "DOT medical card expiration date is required.");
            }
        }

        const mvrField = document.getElementById('dqf_mvr_required');
        const mvrErr = document.getElementById('err_dqf_mvr_required');
        if (mvrField && (mvrField.offsetWidth > 0 || mvrField.offsetHeight > 0)) {
            if (!mvrField.value) markInvalid(mvrField, mvrErr, "Please clarify your 3-year MVR procurement preference.");
            else markValid(mvrField, mvrErr);
        }

        const hireField = document.getElementById('dqf_hire_date');
        const hireErr = document.getElementById('err_dqf_hire_date');
        if (hireField && (hireField.offsetWidth > 0 || hireField.offsetHeight > 0)) {
            if (!hireField.value) markInvalid(hireField, hireErr, "Driver company hire date is required.");
            else markValid(hireField, hireErr);
        }
        return isValid;
    }
};

// Workflow switching logic based on file purpose selection
window.toggleDqfFleetQuantityVisibility = function(selectedValue) {
    const fleetWrapper = document.getElementById("dqf_fleet_count_wrapper");
    const countInput = document.getElementById("dqf_total_files_needed");
    if (!fleetWrapper) return;
    if (selectedValue === "fleet-addition") {
        fleetWrapper.style.setProperty("display", "block", "important");
        if (countInput) countInput.setAttribute("required", "required");
    } else {
        fleetWrapper.style.setProperty("display", "none", "important");
        if (countInput) { countInput.removeAttribute("required"); countInput.value = "1"; }
    }
};

// Legacy interface footprint exposure bridges
window.validateDriverQualificationFileFormPart1 = function() {
    return window.formRegistry['driver-file-part1-validation'].validate().isValid;
};
window.validateDriverQualificationFileFormParts2And3 = function() {
    return window.formRegistry['driver-file-parts2-and-3-validation'].validate();
};
window.validateEntireDriverQualificationWizard = function() {
    const p1 = window.validateDriverQualificationFileFormPart1();
    const p2 = window.validateDriverQualificationFileFormParts2And3();
    return (p1 && p2);
};

// ============================================================================ //
// ðŸ“¦ MASTER RENDER SYSTEM ALLOCATION
// ============================================================================ //
window.formRegistry['cage-code-form-master'] = function(stateDropdownOptionsHtml = "") {
    return window.formRegistry['driver-file-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['driver-file-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['driver-file-part3-layout'](stateDropdownOptionsHtml);
};

