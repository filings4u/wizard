function validatePayrollTaxFormPart1() {
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

  // 1. Validate Company Legal Name
  const nameField = document.getElementById('pr_legal_name');
  const nameErr = document.getElementById('err_pr_legal_name');
  if (!nameField || !nameField.value.trim()) {
    markInvalid(nameField, nameErr, "Official company name is required.");
  } else {
    markValid(nameField, nameErr);
  }

  // 2. Validate Federal EIN (Strip and verify exactly 9 digits)
  const einField = document.getElementById('pr_federal_ein');
  const einErr = document.getElementById('err_pr_federal_ein');
  if (einField && einErr) {
    const rawEin = einField.value.replace(/\D/g, "");
    if (rawEin.length !== 9) {
      markInvalid(einField, einErr, "A standard 9-digit EIN is required (e.g., 12-3456789).");
    } else {
      markValid(einField, einErr);
    }
  }

  // 3. Validate Employment State Selection
  const stateField = document.getElementById('pr_primary_state');
  const stateErr = document.getElementById('err_pr_primary_state');
  if (!stateField || !stateField.value) {
    markInvalid(stateField, stateErr, "Please select the primary employment state.");
  } else {
    markValid(stateField, stateErr);
  }

  // 4. Validate First Wage Distribution Date
  const dateField = document.getElementById('pr_first_wage_date');
  const dateErr = document.getElementById('err_pr_first_wage_date');
  if (!dateField || !dateField.value) {
    markInvalid(dateField, dateErr, "Please provide the date first wages were paid or are expected.");
  } else {
    markValid(dateField, dateErr);
  }

  // 5. Validate Federal Reporting Cycle Dropdown
  const cycleField = document.getElementById('pr_filing_cycle');
  const cycleErr = document.getElementById('err_pr_filing_cycle');
  if (!cycleField || !cycleField.value) {
    markInvalid(cycleField, cycleErr, "Please select a federal reporting cycle designation.");
  } else {
    markValid(cycleField, cycleErr);
  }

  return isValid;
}

// FAMILY 19A: PAYROLL TAX REGISTRATION LAYOUT MATRIX (PART 1 OF 3)
function buildPayrollTaxFormPart1(stateDropdownOptionsHtml = "") {
 return `
 <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: PAYROLL TAX REGISTRATION -->
 <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
   <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> Employer Payroll Tax Registration Compliance</strong> 
   Hiring operational employees mandates immediate tax accounts registration across federal and state levels. Federal responsibilities require filing Form 941 (Quarterly Employer Return for Social Security and Medicare withholdings) or Form 944 (Annual), alongside Form 940 (Annual Federal Unemployment Tax Act - FUTA). State-level compliance requires establishing separate State Unemployment Tax Act (SUTA) and State Income Tax Withholding accounts to ensure operational standing.
 </div>

 <!-- SECTION 1: EMPLOYER BASELINE PROFILE -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Employer Baseline Identification Profile</h3>
 </div>

 <!-- FIELD 1: OFFICIAL COMPANY NAME -->
 <div class="wizard-input-group" style="grid-column: span 2;">
   <label for="pr_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Company Name <span style="color: #ef4444;">*</span></label>
   <input type="text" id="pr_legal_name" required placeholder="Enter company name exactly as registered with the IRS / State" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_pr_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- FIELD 2: FEDERAL EMPLOYER ID (EIN) -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="pr_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Employer ID (EIN) <span style="color: #ef4444;">*</span></label>
   <input type="text" id="pr_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_pr_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- FIELD 3: PRIMARY EMPLOYMENT STATE -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="pr_primary_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Employment State <span style="color: #ef4444;">*</span></label>
   <select id="pr_primary_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
     <option value="" disabled selected>Select State...</option>
     ${stateDropdownOptionsHtml}
   </select>
   <div class="wizard-error-message" id="err_pr_primary_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- SECTION 2: FILING FREQUENCY PARAMETERS -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Operational Forecast & Filing Frequency</h3>
 </div>

 <!-- FIELD 4: DATE FIRST WAGES PAID -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="pr_first_wage_date" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Date First Wages Paid / Expected <span style="color: #ef4444;">*</span></label>
   <input type="date" id="pr_first_wage_date" required class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_pr_first_wage_date" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- FIELD 5: FEDERAL REPORTING CYCLE DESIGNATION -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="pr_filing_cycle" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Reporting Cycle Designation <span style="color: #ef4444;">*</span></label>
   <select id="pr_filing_cycle" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
     <option value="941" selected>Form 941 (Standard Quarterly Return - Threshold passes $1,000 annual liability)</option>
     <option value="944">Form 944 (Annual Return Option - Small employers with under $1,000 expected liability)</option>
   </select>
   <div class="wizard-error-message" id="err_pr_filing_cycle" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>
 `;
}

function validatePayrollTaxFormParts2And3() {
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

  // 1. Validate Active W-2 Employee Count (Min 1 as defined by input element attributes)
  const empCountField = document.getElementById('pr_employee_count');
  const empCountErr = document.getElementById('err_pr_employee_count');
  if (empCountField && empCountErr) {
    const val = parseInt(empCountField.value, 10);
    if (isNaN(val) || val < 1) {
      markInvalid(empCountField, empCountErr, "An active business must declare at least 1 employee to register.");
    } else {
      markValid(empCountField, empCountErr);
    }
  }

  // 2. Validate Estimated Total Quarterly Gross Wages ($)
  const wagesField = document.getElementById('pr_estimated_quarterly_wages');
  const wagesErr = document.getElementById('err_pr_estimated_quarterly_wages');
  if (wagesField && wagesErr) {
    const val = parseFloat(wagesField.value);
    if (isNaN(val) || val < 0) {
      markInvalid(wagesField, wagesErr, "Quarterly gross wages value must be 0 or greater.");
    } else {
      markValid(wagesField, wagesErr);
    }
  }

  // 3. Validate SUTA Account Setup Dropdown Status
  const sutaStatusField = document.getElementById('pr_suta_status');
  const sutaStatusErr = document.getElementById('err_pr_suta_status');
  if (!sutaStatusField || !sutaStatusField.value) {
    markInvalid(sutaStatusField, sutaStatusErr, "Please specify your current state SUTA status.");
  } else {
    markValid(sutaStatusField, sutaStatusErr);
  }

  // 4. Conditional Validation for Existing State SUTA IDs
  const sutaWrapper = document.getElementById('pr_existing_suta_wrapper');
  const sutaIdField = document.getElementById('pr_existing_suta_id');
  const sutaIdErr = document.getElementById('err_pr_existing_suta_id');
  const withholdingIdField = document.getElementById('pr_existing_withholding_id');
  const withholdingIdErr = document.getElementById('err_pr_existing_withholding_id');

  // Verify elements only if wrapper panel is actively visible to user
  if (sutaWrapper && (sutaWrapper.style.display === "grid" || sutaWrapper.style.display === "block" || (sutaStatusField && sutaStatusField.value === "existing"))) {
    // Validate State SUTA ID
    if (!sutaIdField || !sutaIdField.value.trim()) {
      markInvalid(sutaIdField, sutaIdErr, "Your active State SUTA ID number is required.");
    } else {
      markValid(sutaIdField, sutaIdErr);
    }
    // Validate State Withholding ID
    if (!withholdingIdField || !withholdingIdField.value.trim()) {
      markInvalid(withholdingIdField, withholdingIdErr, "Your active State Income Tax Withholding ID number is required.");
    } else {
      markValid(withholdingIdField, withholdingIdErr);
    }
  } else {
    if (sutaIdField && sutaIdErr) markValid(sutaIdField, sutaIdErr);
    if (withholdingIdField && withholdingIdErr) markValid(withholdingIdField, withholdingIdErr);
  }

  return isValid;
}

// FAMILY 19A: PAYROLL TAX REGISTRATION LAYOUT MATRIX (PART 2 OF 3)
function buildPayrollTaxFormPart2(stateDropdownOptionsHtml = "") {
 return `
 <!-- SECTION 3: STAFFING VOLUME & ESTIMATED PAY-SCALE -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Payroll Scaling & Staff Configuration</h3>
   <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide immediate employment metrics to establish your state-level quarterly deposit assignment frequencies.</p>
 </div>

 <!-- FIELD 1: W-2 EMPLOYEE COUNT -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="pr_employee_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Active W-2 Employees Currently Hired <span style="color: #ef4444;">*</span></label>
   <input type="number" id="pr_employee_count" required placeholder="0" min="1" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_pr_employee_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- FIELD 2: ESTIMATED QUARTERLY WAGES -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="pr_estimated_quarterly_wages" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Estimated Total Quarterly Gross Wages ($) <span style="color: #ef4444;">*</span></label>
   <input type="number" id="pr_estimated_quarterly_wages" required placeholder="0.00" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_pr_estimated_quarterly_wages" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- SECTION 4: SUTA STATE ACCOUNTABILITY MAPPINGS -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. SUTA State Unemployment Account Status</h3>
   <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">State compliance requires linking existing reference IDs or directing Filings4u to construct new revenue accounts.</p>
 </div>

 <!-- FIELD 3: SUTA STATUS SELECTION -->
 <div class="wizard-input-group" style="grid-column: span 2;">
   <label for="pr_suta_status" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Do you have existing State SUTA / UI accounts? <span style="color: #ef4444;">*</span></label>
   <select id="pr_suta_status" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;" onchange="togglePayrollTaxSutaFieldsVisibility(this.value)">
     <option value="new" selected>No, I need Filings4u to process and register new SUTA & State Withholding Tax accounts</option>
     <option value="existing">Yes, I already hold active state employer payroll tax account numbers</option>
   </select>
   <div class="wizard-error-message" id="err_pr_suta_status" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- Hidden Conditional Container: Existing SUTA Identifiers -->
 <div id="pr_existing_suta_wrapper" style="grid-column: span 2; display: none; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; grid-template-columns: 1fr 1fr; gap: 16px;">
   <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">State Employer ID Verification</span>
   
   <!-- CONDITIONAL FIELD: EXISTING SUTA ACCOUNT ID -->
   <div class="wizard-input-group" style="margin: 0; grid-column: span 1;">
     <label for="pr_existing_suta_id" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">State Unemployment Insurance (SUTA) ID <span style="color: #ef4444;">*</span></label>
     <input type="text" id="pr_existing_suta_id" placeholder="Enter State SUTA Account Number" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
     <div class="wizard-error-message" id="err_pr_existing_suta_id" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
   </div>
   
   <!-- CONDITIONAL FIELD: EXISTING WITHHOLDING ACCOUNT ID -->
   <div class="wizard-input-group" style="margin: 0; grid-column: span 1;">
     <label for="pr_existing_withholding_id" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">State Income Tax Withholding ID <span style="color: #ef4444;">*</span></label>
     <input type="text" id="pr_existing_withholding_id" placeholder="Enter State Withholding Account Number" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
     <div class="wizard-error-message" id="err_pr_existing_withholding_id" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
   </div>
 </div>
 `;
}

// FAMILY 19A: PAYROLL TAX REGISTRATION LAYOUT MATRIX (PART 3 OF 3)
function buildPayrollTaxFormPart3(stateDropdownOptionsHtml = "") {
 return `
 <!-- SECTION 5: ADDITIONAL PROVISIONS & DISCLOSURES -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Instructions & Disclosures</h3>
 </div>

 <!-- FIELD 1: OPTIONAL ADDITIONAL NOTES TEXTAREA -->
 <div class="wizard-input-group" style="grid-column: span 2;">
   <label for="pr_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Payroll Handling Notes or Multi-State Operations Details</label>
   <textarea id="pr_provisions" placeholder="Detail any specialized officer salary preferences, multi-state payroll distribution splits, non-resident remote employee parameters, or target accounting software sync paths..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
 </div>
 `;
}

// ðŸ“¦ MASTER PAYROLL TAX REGISTRATION APPLICATION ASSEMBLY HOOK
function buildPayrollTaxForm(stateDropdownOptionsHtml = "") {
 return buildPayrollTaxFormPart1(stateDropdownOptionsHtml) + 
        buildPayrollTaxFormPart2(stateDropdownOptionsHtml) + 
        buildPayrollTaxFormPart3(stateDropdownOptionsHtml);
}


/**
 * Scans all field parameters inside the Payroll Tax Wizard.
 * Updates UI layout parameters with error cues and reports structural status.
 * @returns {boolean} Outcome indicating global form validation success.
 */
function validateEntirePayrollTaxWizard() {
  const isPart1Valid = typeof validatePayrollTaxFormPart1 === 'function' ? validatePayrollTaxFormPart1() : true;
  const isPart23Valid = validatePayrollTaxFormParts2And3();

  return (isPart1Valid && isPart23Valid);
}


