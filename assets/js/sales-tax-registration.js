function validateSalesTaxRegistrationFormPart1() {
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

  // 1. Validate Target State Dropdown
  const stateField = document.getElementById('st_target_state');
  const stateErr = document.getElementById('err_st_target_state');
  if (!stateField || !stateField.value) {
    markInvalid(stateField, stateErr, "Please select a target permit state.");
  } else {
    markValid(stateField, stateErr);
  }

  // 2. Validate Federal EIN (Enforce 9-digit format)
  const einField = document.getElementById('st_federal_ein');
  const einErr = document.getElementById('err_st_federal_ein');
  if (einField && einErr) {
    const rawEin = einField.value.replace(/\D/g, ""); // Keep digits only
    if (rawEin.length !== 9) {
      markInvalid(einField, einErr, "A standard 9-digit EIN is required (e.g., 12-3456789).");
    } else {
      markValid(einField, einErr);
    }
  }

  // 3. Validate Official Business Entity Name
  const nameField = document.getElementById('st_legal_name');
  const nameErr = document.getElementById('err_st_legal_name');
  if (!nameField || !nameField.value.trim()) {
    markInvalid(nameField, nameErr, "Official business entity name is required.");
  } else {
    markValid(nameField, nameErr);
  }

  return isValid;
}


// FAMILY 18A: SALES TAX REGISTRATION LAYOUT MATRIX (PART 1 OF 5)
function buildSalesTaxRegistrationFormPart1(stateDropdownOptionsHtml = "") {
 return `
 <!-- DYNAMIC SYSTEM COMPLIANCE TOOLTIP: SALES TAX REGISTRATION -->
 <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
   <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> State Sales & Use Tax Permit Standards</strong> 
   A Sales Tax Permit (or Seller's Permit) is a legal authorization issued by state revenue agencies granting your business the right to collect and remit sales tax on taxable retail products or services. Engaging in commercial distribution paths without establishing an active state permit can invoke retroactive penalties and immediate statutory audit reviews.
 </div>

 <!-- SECTION 1: ESTABLISHMENT JURISDICTION PROFILE -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Nexus State Jurisdiction Profile</h3>
 </div>

 <!-- FIELD 1: TARGET PERMIT STATE -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="st_target_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Target Permit State <span style="color: #ef4444;">*</span></label>
   <select id="st_target_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
     <option value="" disabled selected>Select State...</option>
     ${stateDropdownOptionsHtml}
   </select>
   <div class="wizard-error-message" id="err_st_target_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- FIELD 2: FEDERAL EMPLOYER ID (EIN) -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="st_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Federal Employer ID (EIN) <span style="color: #ef4444;">*</span></label>
   <input type="text" id="st_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_st_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- FIELD 3: OFFICIAL BUSINESS ENTITY NAME -->
 <div class="wizard-input-group" style="grid-column: span 2;">
   <label for="st_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Official Business Entity Name <span style="color: #ef4444;">*</span></label>
   <input type="text" id="st_legal_name" required placeholder="Enter Official Business Entity Name..." class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_st_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>
 `;
}

function validateSalesTaxRegistrationFormPart2() {
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

  // 1. Validate Primary Nexus Trigger
  const nexusTypeField = document.getElementById('st_nexus_type');
  const nexusTypeErr = document.getElementById('err_st_nexus_type');
  if (!nexusTypeField || !nexusTypeField.value) {
    markInvalid(nexusTypeField, nexusTypeErr, "Please select a primary nexus connection trigger.");
  } else {
    markValid(nexusTypeField, nexusTypeErr);
  }

  // 2. Validate Estimated Monthly Taxable Sales
  const estSalesField = document.getElementById('st_estimated_taxable_sales');
  const estSalesErr = document.getElementById('err_st_estimated_taxable_sales');
  if (!estSalesField || estSalesField.value === "" || parseFloat(estSalesField.value) < 0) {
    markInvalid(estSalesField, estSalesErr, "Please enter a valid estimated monthly sales value (0 or greater).");
  } else {
    markValid(estSalesField, estSalesErr);
  }

  // 3. Conditional Physical Nexus Fields
  const physicalWrapper = document.getElementById('st_physical_nexus_wrapper');
  const invField = document.getElementById('st_inventory_location');
  const invErr = document.getElementById('err_st_inventory_location');
  const empField = document.getElementById('st_in_state_employees');
  const empErr = document.getElementById('err_st_in_state_employees');

  if (physicalWrapper && (physicalWrapper.style.display === "grid" || physicalWrapper.style.display === "block" || nexusTypeField.value === "physical" || nexusTypeField.value === "both")) {
    // Inventory Location validation
    if (!invField || !invField.value.trim()) {
      markInvalid(invField, invErr, "Inventory/Warehouse location is required for physical nexus.");
    } else {
      markValid(invField, invErr);
    }
    // Employee Count validation
    if (!empField || empField.value === "" || parseInt(empField.value, 10) < 0) {
      markInvalid(empField, empErr, "Please enter a valid number of in-state agents/staff (0 or greater).");
    } else {
      markValid(empField, empErr);
    }
  } else {
    if (invField && invErr) markValid(invField, invErr);
    if (empField && empErr) markValid(empField, empErr);
  }

  // 4. Conditional Economic Nexus Fields
  const economicWrapper = document.getElementById('st_economic_nexus_wrapper');
  const grossField = document.getElementById('st_prior_year_gross');
  const grossErr = document.getElementById('err_st_prior_year_gross');
  const transField = document.getElementById('st_prior_year_transactions');
  const transErr = document.getElementById('err_st_prior_year_transactions');

  if (economicWrapper && (economicWrapper.style.display === "grid" || economicWrapper.style.display === "block" || nexusTypeField.value === "economic" || nexusTypeField.value === "both")) {
    // Gross Sales validation
    if (!grossField || grossField.value === "" || parseFloat(grossField.value) < 0) {
      markInvalid(grossField, grossErr, "Prior year gross sales value is required (0 or greater).");
    } else {
      markValid(grossField, grossErr);
    }
    // Transaction Count validation
    if (!transField || transField.value === "" || parseInt(transField.value, 10) < 0) {
      markInvalid(transField, transErr, "Prior year local transaction count is required (0 or greater).");
    } else {
      markValid(transField, transErr);
    }
  } else {
    if (grossField && grossErr) markValid(grossField, grossErr);
    if (transField && transErr) markValid(transField, transErr);
  }

  return isValid;
}

// FAMILY 18A: SALES TAX REGISTRATION LAYOUT MATRIX (PART 2 OF 5)
function buildSalesTaxRegistrationFormPart2(stateDropdownOptionsHtml = "") {
 return `
 <!-- SECTION 2: NEXUS FOOTPRINT TRACKER -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Sales Tax Nexus Baseline Mapping</h3>
   <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">State tax departments evaluate whether your entity possesses physical or economic nexus triggers under modern commerce rules.</p>
 </div>

 <!-- FIELD 1: NEXUS CONNECTION TRIGGER -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="st_nexus_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary Nexus Connection Trigger <span style="color: #ef4444;">*</span></label>
   <select id="st_nexus_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;" onchange="toggleSalesTaxNexusSubInputs(this.value)">
     <option value="" disabled selected>Select Trigger Type...</option>
     <option value="physical">Physical Nexus (In-state office, warehouse inventory, remote employee footprint)</option>
     <option value="economic">Economic Nexus (Passed gross revenue or transaction thresholds independently)</option>
     <option value="both">Both Structural Footprints (Physical operations coupled with targeted trade volumes)</option>
   </select>
   <div class="wizard-error-message" id="err_st_nexus_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- FIELD 2: ESTIMATED MONTHLY TAXABLE SALES -->
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="st_estimated_taxable_sales" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Estimated Monthly Taxable Sales ($) <span style="color: #ef4444;">*</span></label>
   <input type="number" id="st_estimated_taxable_sales" required placeholder="0.00" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_st_estimated_taxable_sales" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <!-- Hidden Conditional Container: Physical Nexus Attributes -->
 <div id="st_physical_nexus_wrapper" style="grid-column: span 2; display: none; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; grid-template-columns: 1fr 1fr; gap: 16px;">
   <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Physical Asset/Footprint Attributes</span>
   
   <div class="wizard-input-group" style="margin: 0; grid-column: span 1;">
     <label for="st_inventory_location" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Inventory/Warehouse Location</label>
     <input type="text" id="st_inventory_location" placeholder="e.g., Fulfillment Center / Storage Depot Address" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
     <div class="wizard-error-message" id="err_st_inventory_location" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
   </div>
   
   <div class="wizard-input-group" style="margin: 0; grid-column: span 1;">
     <label for="st_in_state_employees" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Number of In-State Agents/Staff</label>
     <input type="number" id="st_in_state_employees" placeholder="0" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
     <div class="wizard-error-message" id="err_st_in_state_employees" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
   </div>
 </div>

 <!-- Hidden Conditional Container: Economic Nexus Threshold Metrics -->
 <div id="st_economic_nexus_wrapper" style="grid-column: span 2; display: none; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; grid-template-columns: 1fr 1fr; gap: 16px;">
   <span style="font-weight: 800; font-size: 0.75rem; color: var(--primary); text-transform: uppercase; grid-column: span 2;">Economic Threshold Verification</span>
   
   <div class="wizard-input-group" style="margin: 0; grid-column: span 1;">
     <label for="st_prior_year_gross" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Prior Year Gross Sales in State ($) <span style="color: #ef4444;">*</span></label>
     <input type="number" id="st_prior_year_gross" placeholder="0.00" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
     <div class="wizard-error-message" id="err_st_prior_year_gross" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
   </div>
   
   <div class="wizard-input-group" style="margin: 0; grid-column: span 1;">
     <label for="st_prior_year_transactions" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase;">Prior Year Local Transaction Count <span style="color: #ef4444;">*</span></label>
     <input type="number" id="st_prior_year_transactions" placeholder="e.g. 200" min="0" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
     <div class="wizard-error-message" id="err_st_prior_year_transactions" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
   </div>
 </div>
 `;
}

function validateSalesTaxRegistrationFormParts3To5() {
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

  // 1. Part 3: Validate Product Sourcing Dropdown
  const sourceField = document.getElementById('st_product_source');
  const sourceErr = document.getElementById('err_st_product_source');
  if (!sourceField || !sourceField.value) {
    markInvalid(sourceField, sourceErr, "Please pick a product sourcing type.");
  } else {
    markValid(sourceField, sourceErr);
  }

  // 2. Part 3: Validate Resale Exemption Dropdown
  const exemptionField = document.getElementById('st_request_exemption_cert');
  const exemptionErr = document.getElementById('err_st_request_exemption_cert');
  if (!exemptionField || !exemptionField.value) {
    markInvalid(exemptionField, exemptionErr, "Please specify a resale certificate choice.");
  } else {
    markValid(exemptionField, exemptionErr);
  }

  // 3. Part 4: Validate Street Address
  const streetField = document.getElementById('st_location_street');
  const streetErr = document.getElementById('err_st_location_street');
  if (!streetField || !streetField.value.trim()) {
    markInvalid(streetField, streetErr, "Street location metrics are required.");
  } else {
    markValid(streetField, streetErr);
  }

  // 4. Part 4: Validate City
  const cityField = document.getElementById('st_location_city');
  const cityErr = document.getElementById('err_st_location_city');
  if (!cityField || !cityField.value.trim()) {
    markInvalid(cityField, cityErr, "City location detail is required.");
  } else {
    markValid(cityField, cityErr);
  }

  // 5. Part 4: Validate State Dropdown
  const stateLocField = document.getElementById('st_location_state');
  const stateLocErr = document.getElementById('err_st_location_state');
  if (!stateLocField || !stateLocField.value) {
    markInvalid(stateLocField, stateLocErr, "Please select an address state.");
  } else {
    markValid(stateLocField, stateLocErr);
  }

  // 6. Part 4: Validate Zip Code
  const zipField = document.getElementById('st_location_zip');
  const zipErr = document.getElementById('err_st_location_zip');
  if (!zipField || !zipField.value.trim()) {
    markInvalid(zipField, zipErr, "Zip Code is required.");
  } else {
    markValid(zipField, zipErr);
  }

  // 7. Part 4: Validate Required Identification File Upload
  const fileField = document.getElementById('st_file_owner_id');
  const fileErr = document.getElementById('err_st_file_owner_id');
  if (fileField && fileErr) {
    if (!fileField.files || fileField.files.length === 0) {
      markInvalid(fileField, fileErr, "Valid owner or officer identification document is required.");
    } else {
      markValid(fileField, fileErr);
    }
  }

  return isValid;
}

/**
 * Scans all field parameters inside the Sales Tax Registration Wizard.
 * Updates UI layout parameters with error cues and reports structural status.
 * @returns {boolean} Outcome indicating global form validation success.
 */
function validateEntireSalesTaxWizard() {
  const isPart1Valid = typeof validateSalesTaxRegistrationFormPart1 === 'function' ? validateSalesTaxRegistrationFormPart1() : true;
  const isPart2Valid = typeof validateSalesTaxRegistrationFormPart2 === 'function' ? validateSalesTaxRegistrationFormPart2() : true;
  const isPart345Valid = validateSalesTaxRegistrationFormParts3To5();

  return (isPart1Valid && isPart2Valid && isPart345Valid);
}



// FAMILY 18A: SALES TAX REGISTRATION LAYOUT MATRIX (PART 3 OF 5)
function buildSalesTaxRegistrationFormPart3(stateDropdownOptionsHtml = "") {
 return `
 <!-- SECTION 3: PRODUCT SOURCING & RESALE CERTIFICATES -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Business Model Sourcing & Exemption Choices</h3>
 </div>
 
 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="st_product_source" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary E-Commerce Platform Sourcing <span style="color: #ef4444;">*</span></label>
   <select id="st_product_source" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
     <option value="direct" selected>Direct Sales via Custom Website (Shopify, WooCommerce, Custom App)</option>
     <option value="marketplace">Marketplace Only Facilitator (Amazon, eBay, Etsy, Walmart)</option>
     <option value="hybrid">Hybrid Approach (Both direct website checkouts and marketplace lines)</option>
     <option value="wholesale">Wholesale / B2B Commercial Contracts Profile</option>
   </select>
   <div class="wizard-error-message" id="err_st_product_source" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <div class="wizard-input-group" style="grid-column: span 1;">
   <label for="st_request_exemption_cert" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Request Resale Exemption Certificate? <span style="color: #ef4444;">*</span></label>
   <select id="st_request_exemption_cert" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
     <option value="no" selected>No, I am only registering to collect and remit retail consumer taxes</option>
     <option value="yes">Yes, include Filings4u Resale Exemption Certificate Procurement â€” $45.00</option>
   </select>
   <div class="wizard-error-message" id="err_st_request_exemption_cert" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>
 `;
}

// FAMILY 18A: SALES TAX REGISTRATION LAYOUT MATRIX (PART 4 OF 5)
function buildSalesTaxRegistrationFormPart4(stateDropdownOptionsHtml = "") {
 return `
 <!-- SECTION 4: LOCATION DETAILS & DATA PACKETS -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Physical Presence Verification</h3>
   <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Please supply your primary matching location street metrics and identification verification elements below:</p>
 </div>

 <div class="wizard-input-group" style="grid-column: span 2;">
   <label for="st_location_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Primary In-State Business Address <span style="color: #ef4444;">*</span></label>
   <input type="text" id="st_location_street" required placeholder="Street address, suite, unit (Can match principal address if in-state)" class="wizard-input-field" style="width: 100%; box-sizing: border-box;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'st_location')">
   <div class="wizard-error-message" id="err_st_location_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>

 <div class="wizard-input-group" style="grid-column: span 2;">
   <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
     <div>
       <label for="st_location_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
       <input type="text" id="st_location_city" required placeholder="City" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
       <div class="wizard-error-message" id="err_st_location_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
     </div>
     <div>
       <label for="st_location_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
       <select id="st_location_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
         <option value="" disabled selected>Select State...</option>
         ${stateDropdownOptionsHtml}
       </select>
       <div class="wizard-error-message" id="err_st_location_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
     </div>
     <div>
       <label for="st_location_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
       <input type="text" id="st_location_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; box-sizing: border-box;" class="wizard-input-field">
       <div class="wizard-error-message" id="err_st_location_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
     </div>
   </div>
 </div>

 <div class="wizard-input-group" style="grid-column: span 2;">
   <label for="st_file_owner_id" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Copy of Valid Owner / Officer Identification (Driver's License or Passport) <span style="color: #ef4444;">*</span></label>
   <input type="file" id="st_file_owner_id" required class="wizard-input-field" accept="image/*,.pdf" style="padding: 8px; background: #ffffff; width: 100%; box-sizing: border-box;">
   <div class="wizard-error-message" id="err_st_file_owner_id" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
 </div>
 `;
}

// FAMILY 18A: SALES TAX REGISTRATION LAYOUT MATRIX (PART 5 OF 5)
function buildSalesTaxRegistrationFormPart5(stateDropdownOptionsHtml = "") {
 return `
 <!-- SECTION 5: ADDITIONAL PROVISIONS & DISCLOSURES -->
 <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
   <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Instructions & Disclosures</h3>
 </div>

 <div class="wizard-input-group" style="grid-column: span 2;">
   <label for="st_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Special Sales Tax Instructions or Local Ordinance Disclosures</label>
   <textarea id="st_provisions" placeholder="Detail any seasonal selling periods, localized marketplace accounts, specific product exemption classifications, or custom setup requests..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border); border-radius: 6px; font-weight: 600;"></textarea>
 </div>
 `;
}

// ðŸ“¦ MASTER SALES TAX REGISTRATION APPLICATION ASSEMBLY HOOK
function buildSalesTaxRegistrationForm(stateDropdownOptionsHtml = "") {
 return buildSalesTaxRegistrationFormPart1(stateDropdownOptionsHtml) + 
        buildSalesTaxRegistrationFormPart2(stateDropdownOptionsHtml) + 
        buildSalesTaxRegistrationFormPart3(stateDropdownOptionsHtml) + 
        buildSalesTaxRegistrationFormPart4(stateDropdownOptionsHtml) + 
        buildSalesTaxRegistrationFormPart5(stateDropdownOptionsHtml);
}

