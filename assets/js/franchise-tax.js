// ============================================================================ //
// ðŸ“Š FRANCHISE TAX REGISTRATION LAYOUT MATRIX (PART 1)                         //
// ============================================================================ //
window.buildFranchiseTaxFormPart1 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED WRAPPER TO PREVENT ONE-SIDE COLLAPSE AND FORCE FULL WIDTH -->
    <div class="franchise-tax-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 1: JURISDICTION IDENTITY PROFILE -->
      <div style="border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Corporate Filing Jurisdiction & Identity</h3>
      </div>

      <!-- FIELD 1: FILING JURISDICTION STATE -->
      <div class="wizard-input-group" style="margin-top: 12px;">
        <label for="fran_tax_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;">Filing Jurisdiction State <span style="color: #ef4444;">*</span></label>
        <select id="fran_tax_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onchange="if(typeof window.executeFranchiseTaxStateParsingWorkflow==='function'){window.executeFranchiseTaxStateParsingWorkflow(this.value)}">
          <option value="" disabled selected>-- Select Filing State --</option>
          ${stateDropdownOptionsHtml}
        </select>
        <div class="wizard-error-message" id="err_fran_tax_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 2: OFFICIAL BUSINESS LEGAL NAME -->
      <div class="wizard-input-group" style="margin-top: 16px;">
        <label for="fran_tax_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Business Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fran_tax_legal_name" required placeholder="Enter exact legal business name as registered with corporate records" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
        <div class="wizard-error-message" id="err_fran_tax_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- FIELD 3: STATE CHARTER NUMBER / FILING NUMBER -->
      <div class="wizard-input-group" style="margin-top: 16px;">
        <label for="fran_tax_charter_num" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">State Entity Filing / Charter Number <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fran_tax_charter_num" required placeholder="Enter State Filing or Charter ID Number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
        <div class="wizard-error-message" id="err_fran_tax_charter_num" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};


// ============================================================================ //
// ðŸ“Š FRANCHISE TAX REGISTRATION LAYOUT MATRIX (PART 2)                         //
// ============================================================================ //
window.buildFranchiseTaxFormPart2 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED WRAPPER TO PREVENT ONE-SIDE COLLAPSE AND FORCE FULL WIDTH -->
    <div class="franchise-tax-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 16px; box-sizing: border-box !important;">

      <!-- SECTION 2: FILING METHOD BASIS CATEGORY -->
      <div style="border-bottom: 1px solid var(--border, #cbd5e1); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Franchise Tax Calculation Method Basis</h3>
      </div>

      <!-- FIELD 1: FILING METHOD TYPE DROPDOWN -->
      <div class="wizard-input-group" style="margin-top: 12px;">
        <label for="fran_tax_method_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;">Filing Category Basis <span style="color: #ef4444;">*</span></label>
        <select id="fran_tax_method_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;" onchange="
          const assetWrapper = document.getElementById('conditional_asset_block_wrapper');
          if (assetWrapper) {
            assetWrapper.style.setProperty('display', this.value === 'margin-or-stock' ? 'grid' : 'none', 'important');
          }
          if(typeof updateWizardFinalTotalAmountMatrix === 'function') {
            updateWizardFinalTotalAmountMatrix();
          }
        ">
          <option value="" disabled selected>-- Select Calculation Basis --</option>
          <option value="standard-minimum">Standard No-Tax Due or Flat Minimum Filing Basis</option>
          <option value="margin-or-stock">Margin-Based / Capital Stock Asset & Share Share Basis</option>
        </select>
        <div class="wizard-error-message" id="err_fran_tax_method_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <!-- REPAIRED CONDITIONAL SUB-GRID: ACCEPTS ASSET DATA PATHS SIDE-BY-SIDE -->
      <div id="conditional_asset_block_wrapper" style="display: none; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
        
        <!-- FIELD 2: TOTAL GROSS BUSINESS ASSETS -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="fran_tax_total_assets" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;">Total Gross Business Assets <span style="color: #ef4444;">*</span></label>
          <input type="number" id="fran_tax_total_assets" min="0" step="0.01" placeholder="0.00" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <div class="wizard-error-message" id="err_fran_tax_total_assets" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 3: TOTAL AUTHORIZED/ISSUED SHARES -->
        <div class="wizard-input-group" style="margin: 0;">
          <label for="fran_tax_issued_shares" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;">Total Authorized / Issued Shares</label>
          <input type="number" id="fran_tax_issued_shares" min="0" step="1" placeholder="Enter whole number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none;">
          <div class="wizard-error-message" id="err_fran_tax_issued_shares" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

      </div>

    </div>
  `;
};



// ============================================================================ //
// ðŸ“Š ARCHITECTURE SEGMENT 1: FRANCHISE TAX REGISTRATION LAYOUT PART 1          //
// ============================================================================ //
window.buildFranchiseTaxFormPart1 = function(stateDropdownOptionsHtml = "") {
  const blankStatesHtml = stateDropdownOptionsHtml || `
    <option value="" disabled selected>-- Select State --</option>
    <option value="WY">Wyoming</option>
    <option value="DE">Delaware</option>
    <option value="NV">Nevada</option>
  `;

  return `
    <!-- UNIFIED FULL-WIDTH WRAPPER BLOCK PREVENTS ONE-SIDE COLLAPSE -->
    <div class="franchise-tax-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">
      
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 12px;">
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> What is a Franchise Tax Filing?</strong>
        Franchise tax is a fee charged by states for the privilege of incorporating or doing business within their borders. Unlike income tax, it is often calculated based on capital stock values, gross margins, or flat baseline minimums, and frequently mandates the simultaneously filed execution of a Public Information Report (PIR) to sustain entity standing.
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 12px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Franchise Jurisdiction Profile</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="fran_tax_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Filing Jurisdiction State <span style="color: #ef4444;">*</span></label>
        <select id="fran_tax_state" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px;" onchange="if(typeof window.executeFranchiseTaxStateParsingWorkflow==='function'){window.executeFranchiseTaxStateParsingWorkflow(this.value)}">
          ${blankStatesHtml}
        </select>
        <div class="wizard-error-message" id="err_fran_tax_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px;">
        <label for="fran_tax_charter_num" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">State Entity Filing/Charter Number <span style="color: #ef4444;">*</span></label>
        <input type="text" id="fran_tax_charter_num" required placeholder="Enter State Charter / Filing ID" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 44px;">
        <div class="wizard-error-message" id="err_fran_tax_charter_num" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px; display: flex; flex-direction: column; gap: 6px;">
        <label for="fran_tax_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Official Business Name <span style="color: #ef4444;">*</span></label>
        <!-- ðŸŸ¢ FIXED FIELD ID ATTRIBUTE FROM haz_legal_name TO fran_tax_legal_name TO MATCH PART 1 VALIDATION MATRIX -->
        <input type="text" id="fran_tax_legal_name" required placeholder="Enter legal company name exactly as registered with the Secretary of State" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 44px;">
        <div class="wizard-error-message" id="err_fran_tax_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

    </div>
  `;
};
// Bind to legacy object structures to prevent orchestrator injection drops
window.formRegistry['franchise-tax-part1-layout'] = window.buildFranchiseTaxFormPart1;



// ============================================================================ //
// ðŸ“Š ARCHITECTURE SEGMENT 2: FRANCHISE TAX REGISTRATION LAYOUT PART 2          //
// ============================================================================ //
window.buildFranchiseTaxFormPart2 = function(stateDropdownOptionsHtml = "") {
  return `
    <!-- UNIFIED FULL-WIDTH WRAPPER BLOCK PREVENTS ONE-SIDE COLLAPSE -->
    <div class="franchise-tax-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">
      
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">2. State Threshold Selection</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Filing options adapt to your target state. Select your structural allocation threshold framework:</p>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px; display: flex; flex-direction: column; gap: 6px;">
        <label for="fran_tax_method_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Filing Category Basis <span style="color: #ef4444;">*</span></label>
        <!-- ðŸŸ¢ FIXED DYNAMIC DROPDOWN INTERLOCK ONCHANGE: UPDATES VISIBILITY VIA CLASSIFIED WRAPPER OBJECT DISPLAY PROPERTIES AND MAPS THE ERROR MATRIX CLEANUP AND TOTAL AMOUNT CALCULATOR -->
        <select id="fran_tax_method_type" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;" onchange="
          const calcWrapper = document.getElementById('fran_tax_calculation_wrapper');
          if (calcWrapper) {
            calcWrapper.style.setProperty('display', this.value === 'margin-or-stock' ? 'grid' : 'none', 'important');
          }
          if (typeof window.toggleFranchiseTaxThresholdInputFieldsVisibility === 'function') { 
            window.toggleFranchiseTaxThresholdInputFieldsVisibility(this.value); 
          }
          if (typeof window.updateWizardFinalTotalAmountMatrix === 'function') {
            window.updateWizardFinalTotalAmountMatrix();
          }
        ">
          <option value="flat" selected>Fixed Minimum / Flat Fee Filing Matrix (e.g. Delaware baseline or low-revenue entities)</option>
          <option value="informational">No-Tax Threshold Declaration (e.g. Texas Public Information Report with zero balance liability)</option>
          <option value="margin-or-stock">Calculated Margin / Asset Share Basis (Requires explicit asset capitalization numbers)</option>
        </select>
        <div class="wizard-error-message" id="err_fran_tax_method_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div id="fran_tax_state_notification_banner" style="grid-column: span 2; display: none; background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 6px; box-sizing: border-box; margin-top: 12px;">
        <p id="fran_tax_state_banner_text" style="color: #b45309; font-size: 0.8rem; margin: 0; font-weight: 600; line-height: 1.4;"></p>
      </div>

      <!-- CONDITIONAL ASSET TRACKS MATRIX INTERLOCK -->
      <div id="fran_tax_calculation_wrapper" style="grid-column: span 2; display: none; background: rgba(10, 31, 68, 0.01); padding: 20px; border-radius: 8px; border: 1px solid var(--border, #e2e8f0); grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box; width: 100%; margin-top: 16px;">
        
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px;">
          <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Asset Capitalization Profile</h3>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px; margin: 0;">
          <label for="fran_tax_total_assets" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase;">Total Gross Business Assets ($) <span style="color: #ef4444;">*</span></label>
          <input type="number" id="fran_tax_total_assets" placeholder="0.00" min="0" step="0.01" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fran_tax_total_assets" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <div class="wizard-input-group" style="grid-column: span 1; display: flex; flex-direction: column; gap: 6px; margin: 0;">
          <label for="fran_tax_issued_shares" style="font-size: 0.75rem; font-weight: 700; color: var(--slate, #64748b); text-transform: uppercase;">Total Authorized / Issued Shares</label>
          <input type="number" id="fran_tax_issued_shares" placeholder="e.g. 1500" min="0" step="1" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fran_tax_issued_shares" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

      </div>

    </div>
  `;
};
// Bind to legacy object structures to prevent orchestrator injection drops
window.formRegistry['franchise-tax-part2-layout'] = window.buildFranchiseTaxFormPart2;




 // ---------------------------------------------------------------------------- //
// SECTION E: INTERACTIVE LAYOUT INTERLOCK CONTROLLERS (FIXED)                 //
// ---------------------------------------------------------------------------- //
window.toggleFranchiseTaxThresholdInputFieldsVisibility = function(value) {
  const calculationWrapper = document.getElementById("fran_tax_calculation_wrapper");
  const assetInput = document.getElementById("fran_tax_total_assets");
  
  if (!calculationWrapper) return;
  
  if (value === "margin-or-stock") {
    // ðŸŸ¢ FIXED: Preserves the internal grid columns of your Section D templates seamlessly
    calculationWrapper.style.setProperty("display", "grid", "important");
    if (assetInput) {
      assetInput.setAttribute("required", "required");
    }
    console.log("[Franchise Controller] Capitalization matrix activated. Required validation rules armed.");
  } else {
    calculationWrapper.style.setProperty("display", "none", "important");
    if (assetInput) {
      assetInput.removeAttribute("required");
    }
    
    // ðŸŸ¢ FIXED: Flush out variables securely and dispatch events to update your tracking data store
    calculationWrapper.querySelectorAll("input").forEach(el => {
      el.value = "";
      el.style.borderColor = "#cbd5e1";
      
      const errorMsgNode = document.getElementById("err_" + el.id) || el.closest('.wizard-input-group')?.querySelector(".wizard-error-message");
      if (errorMsgNode) {
        errorMsgNode.style.setProperty("display", "none", "important");
        errorMsgNode.textContent = "";
      }
      
      // Force compliance state variables to recognize the cleared field data
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
};


window.executeFranchiseTaxStateParsingWorkflow = function(stateValue) { 
  const bannerNode = document.getElementById("fran_tax_state_notification_banner"); 
  const bannerTextNode = document.getElementById("fran_tax_state_banner_text"); 
  if (!bannerNode || !bannerTextNode) return; 
  
  const upperState = stateValue ? stateValue.toUpperCase() : ""; 
  if (upperState === "DE") { 
    bannerNode.style.setProperty("display", "block", "important"); 
    bannerTextNode.innerHTML = "ðŸ’¡ <b>Delaware Notice:</b> Entities using Authorized Shares can alternate between the Minimum Recorded $175.00 Flat Method and the Assumed Par Value Capital Method during formal auditing."; 
  } else if (upperState === "TX") { 
    bannerNode.style.setProperty("display", "block", "important"); 
    bannerTextNode.innerHTML = "ðŸ’¡ <b>Texas Notice:</b> No Franchise Tax is due if total annualized revenue drops below the statutory threshold limit, but a Public Information Report (PIR) remains mandatory."; 
  } else { 
    bannerNode.style.setProperty("display", "none", "important"); 
    bannerTextNode.innerText = ""; 
  } 
}; 

// ðŸŸ¢ FIXED: Replaced loose document-wide listeners with localized element listener registration hooks 
window.bindLocalizedFranchiseTaxEventHandlers = function(rootContainerElement) { 
  const parentCanvas = rootContainerElement || document.getElementById("step-2-onboarding-fields-canvas") || document.getElementById("step-2-injection-placeholder") || document.querySelector(".franchise-tax-grid-segment")?.parentElement; 
  if (!parentCanvas) return; 
  
  // 1. Setup threshold selection logic toggle execution hooks 
  const thresholdSelector = parentCanvas.querySelector("#fran_tax_method_type"); 
  if (thresholdSelector) { 
    thresholdSelector.removeEventListener("change", window._handleThresholdChange); 
    window._handleThresholdChange = function(e) { 
      window.toggleFranchiseTaxThresholdInputFieldsVisibility(e.target.value); 
      if (typeof window.updateWizardFinalTotalAmountMatrix === 'function') {
        window.updateWizardFinalTotalAmountMatrix();
      }
    }; 
    thresholdSelector.addEventListener("change", window._handleThresholdChange); 
  } 
  
  // 2. Setup state selection validation parsing execution hooks 
  const stateSelector = parentCanvas.querySelector("#fran_tax_state"); 
  if (stateSelector) { 
    stateSelector.removeEventListener("change", window._handleStateWorkflowChange); 
    window._handleStateWorkflowChange = function(e) { 
      window.executeFranchiseTaxStateParsingWorkflow(e.target.value); 
    }; 
    stateSelector.addEventListener("change", window._handleStateWorkflowChange); 
  } 
}; 

// Auto-wire tracking if the panel elements exist in active viewport paths 
if (document.getElementById("step-2-onboarding-fields-canvas")) { 
  window.bindLocalizedFranchiseTaxEventHandlers(); 
}


// ---------------------------------------------------------------------------- //
// SECTION F: PART 3 LAYOUT ENGINE MATRIX (OFFICER REGISTRY) [FIXED]            //
// ---------------------------------------------------------------------------- //
window.formRegistry['franchise-tax-part3-layout'] = function(stateDropdownOptionsHtml = "") {
  const sanitizedDropdownPayload = typeof stateDropdownOptionsHtml === "string" && stateDropdownOptionsHtml.trim().length > 0 
    ? stateDropdownOptionsHtml.trim() 
    : `<option value="" disabled selected>-- Select State --</option>
       <option value="WY">Wyoming</option>
       <option value="DE">Delaware</option>
       <option value="NV">Nevada</option>`;

  // ðŸŸ¢ FIXED: Removed outer native columns to integrate smoothly with full-width master streams
  return `
    <div class="franchise-tax-part3-inner-grid" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; box-sizing: border-box !important;">
      
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Public Information Report Officer Registry</h3>
      </div>
      
      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy, #0a1f44); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate, #64748b); box-sizing: border-box; margin-bottom: 4px;">
        <strong style="color: var(--navy, #0a1f44); display: block; margin-bottom: 4px;">
          <i class="fa-solid fa-circle-info"></i> What is a Public Information Report Officer?
        </strong>
        State compliance offices require updated records of active officers, directors, managers, or managing members. This structural registry catalogs corporate personnel to ensure public records boundaries stay transparent natively.
      </div>
      
      <div class="wizard-input-group" style="grid-column: span 2; margin-bottom: 0;">
        <div id="fran_officers_container" style="display: flex; flex-direction: column; gap: 20px; width: 100%;">
          
          <!-- DEFAULT CARD 1 BASE REFUGE -->
          <div class="member-record-card" data-officer-index="1" id="fran_officer_card_1" style="background: #ffffff; border: 1px solid var(--border, #e2e8f0); padding: 16px; border-radius: 8px; width: 100%; box-sizing: border-box;">
            <span style="font-weight: 800; font-size: 0.75rem; color: #10b981; text-transform: uppercase;">Officer #1 Records</span>
            
            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 12px; width: 100%; box-sizing: border-box;">
              
              <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
                <label for="fran_officer_name_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Full Legal Name *</label>
                <input type="text" id="fran_officer_name_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 44px;">
                <div class="wizard-error-message" id="err_fran_officer_name_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
              </div>
              
              <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
                <label for="fran_officer_title_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Official Corporate Title *</label>
                <select id="fran_officer_title_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
                  <option value="" disabled selected>Select Title...</option>
                  <option value="President">President / CEO</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer / CFO</option>
                  <option value="Manager">Manager / Managing Member</option>
                  <option value="Director">Director</option>
                </select>
                <div class="wizard-error-message" id="err_fran_officer_title_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
              </div>
              
              <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
                <label for="fran_officer_street_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Street Address *</label>
                <input type="text" id="fran_officer_street_1" required placeholder="e.g. 123 Main St" class="wizard-input-field" data-autocomplete-hook="places-input" data-autocomplete-prefix="fran_officer_1" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 44px;">
                <div class="wizard-error-message" id="err_fran_officer_street_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
              </div>
              
              <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
                <label for="fran_officer_unit_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Suite / Building / Apt</label>
                <input type="text" id="fran_officer_unit_1" placeholder="e.g. Suite 400" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 44px;">
              </div>
              
              <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
                <label for="fran_officer_city_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">City *</label>
                <input type="text" id="fran_officer_city_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 44px;">
                <div class="wizard-error-message" id="err_fran_officer_city_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
              </div>
              
              <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <label for="fran_officer_state_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">State *</label>
                  <select id="fran_officer_state_1" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
                    ${sanitizedDropdownPayload}
                  </select>
                  <div class="wizard-error-message" id="err_fran_officer_state_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <label for="fran_officer_zip_1" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Zip *</label>
                  <input type="text" id="fran_officer_zip_1" required maxlength="5" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 44px;">
                  <div class="wizard-error-message" id="err_fran_officer_zip_1" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
      
      <div style="grid-column: span 2; margin-top: 4px; margin-bottom: 20px;">
        <button type="button" id="btn_add_fran_officer" class="wizard-button-secondary" style="font-weight:700; cursor: pointer; padding: 10px 20px; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; min-height: 44px;">
          <i class="fa-solid fa-plus" style="color: var(--primary, #10b981);"></i> Add Additional Officer / Member
        </button>
      </div>
      
    </div>
  `;
};
// Alias binding to stay uniform across architecture execution pipelines
window.buildFranchiseTaxFormPart3 = window.formRegistry['franchise-tax-part3-layout'];


// ---------------------------------------------------------------------------- //
// SECTION G: PART 3 VALIDATION MATRIX ENGINE (DYNAMIC OFFICER SCANNERS) [FIXED] //
// ---------------------------------------------------------------------------- //
window.validateFranchiseTaxFormPart3 = function() {
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

  // ðŸŸ¢ FIXED: Check DOM attachment state instead of rendering layout metrics
  const existsInActiveDom = (el) => el && document.body.contains(el);

  // ðŸŸ¢ FIXED: Isolated error node matching targeting unique parent wrappers
  const getFieldErrorMessageNode = (fieldEl, specificErrId) => {
    if (!fieldEl) return null;
    const explicitNode = document.getElementById(specificErrId);
    if (explicitNode) return explicitNode;
    const localizedWrapper = fieldEl.closest('.wizard-input-group, div');
    return localizedWrapper ? localizedWrapper.querySelector(".wizard-error-message") : null;
  };

  const container = document.getElementById('fran_officers_container');
  if (!container) return { isValid, errors };

  const cards = container.querySelectorAll('.member-record-card');
  cards.forEach(card => {
    // ðŸŸ¢ FIXED: Use explicit data attributes to protect structural evaluation loops
    const index = card.getAttribute('data-officer-index') || card.id.replace('fran_officer_card_', '');
    if (!index) return;

    // 1. Validate Officer Full Legal Name
    const nameField = document.getElementById(`fran_officer_name_${index}`);
    const nameErr = getFieldErrorMessageNode(nameField, `err_fran_officer_name_${index}`);
    if (existsInActiveDom(nameField) && nameErr) {
      (!nameField.value.trim()) ? markInvalid(nameField, nameErr, "Officer full legal name is required.") : markValid(nameField, nameErr);
    }

    // 2. Validate Officer Corporate Title Selection
    const titleField = document.getElementById(`fran_officer_title_${index}`);
    const titleErr = getFieldErrorMessageNode(titleField, `err_fran_officer_title_${index}`);
    if (existsInActiveDom(titleField) && titleErr) {
      const titleVal = titleField.value ? titleField.value.trim() : "";
      const isTitlePlaceholder = titleVal === "" || titleVal.toLowerCase().includes("select");
      isTitlePlaceholder ? markInvalid(titleField, titleErr, "Please select an official corporate title.") : markValid(titleField, titleErr);
    }

    // 3. Validate Officer Street Physical Address with P.O. Box Restrictions Enforced
    const streetField = document.getElementById(`fran_officer_street_${index}`);
    const streetErr = getFieldErrorMessageNode(streetField, `err_fran_officer_street_${index}`);
    if (existsInActiveDom(streetField) && streetErr) {
      const streetVal = streetField.value.trim();
      if (!streetVal) {
        markInvalid(streetField, streetErr, "Officer street physical address is required.");
      } else if (/\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i.test(streetVal)) {
        markInvalid(streetField, streetErr, "Statutory rules reject P.O. Box listings for registered office reports. Provide a physical street address.");
      } else {
        markValid(streetField, streetErr);
      }
    }

    // 4. Validate Officer City Parameters
    const cityField = document.getElementById(`fran_officer_city_${index}`);
    const cityErr = getFieldErrorMessageNode(cityField, `err_fran_officer_city_${index}`);
    if (existsInActiveDom(cityField) && cityErr) {
      (!cityField.value.trim()) ? markInvalid(cityField, cityErr, "Officer city parameter is required.") : markValid(cityField, cityErr);
    }

    // 5. Validate Officer State Selections
    const stateField = document.getElementById(`fran_officer_state_${index}`);
    const stateErr = getFieldErrorMessageNode(stateField, `err_fran_officer_state_${index}`);
    if (existsInActiveDom(stateField) && stateErr) {
      const stateVal = stateField.value ? stateField.value.trim() : "";
      const isStatePlaceholder = stateVal === "" || stateVal.startsWith("--");
      isStatePlaceholder ? markInvalid(stateField, stateErr, "Please select an officer state choice.") : markValid(stateField, stateErr);
    }

    // 6. Validate Officer ZIP Codes (Strict 5-Digit Pattern Verification)
    const zipField = document.getElementById(`fran_officer_zip_${index}`);
    const zipErr = getFieldErrorMessageNode(zipField, `err_fran_officer_zip_${index}`);
    if (existsInActiveDom(zipField) && zipErr) {
      const zipVal = zipField.value.trim();
      if (!zipVal) {
        markInvalid(zipField, zipErr, "Officer zip code parameter is required.");
      } else if (!/^\d{5}$/.test(zipVal)) {
        markInvalid(zipField, zipErr, "Officer zip code parameter format must be exactly 5 digits.");
      } else {
        markValid(zipField, zipErr);
      }
    }
  });

  return { isValid, errors };
};



// ---------------------------------------------------------------------------- //
// SECTION H: PARTS 4 & 5 LAYOUT ENGINE MATRIX [FIXED]                          //
// ---------------------------------------------------------------------------- //
window.formRegistry['franchise-tax-part4-layout'] = function(stateDropdownOptionsHtml = "") {
  // ðŸŸ¢ FIXED: Kept full-width layout wrapper, ensuring the outer grid tracks expand across 100% of workspace
  return `
    <div class="franchise-tax-part4-inner-grid" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; box-sizing: border-box !important;">
      
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">Required Franchise Verification Packets</h3>
        <p style="color: var(--slate, #64748b); font-size: 0.8rem; margin: 4px 0 0 0;">Please attach your state margin summaries, asset balancing metrics, or capitalization ledgers below:</p>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
        <label for="fran_file_ledger_summary" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">
          Capital Stock / Gross Margin Ledger Summary <span style="color: #ef4444;">*</span>
        </label>
        <input type="file" id="fran_file_ledger_summary" required class="wizard-input-field" accept=".pdf,.xls,.xlsx,.csv,image/*" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; background: #ffffff; min-height: 44px;">
        <div class="wizard-error-message" id="err_fran_file_ledger_summary" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1; margin: 0; display: flex; flex-direction: column; gap: 6px;">
        <label for="fran_file_prior_franchise" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">
          Copy of Prior Franchise Tax Filing (If Applicable)
        </label>
        <input type="file" id="fran_file_prior_franchise" class="wizard-input-field" accept=".pdf,image/*" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; background: #ffffff; min-height: 44px;">
      </div>

    </div>
  `;
};

window.formRegistry['franchise-tax-part5-layout'] = function(stateDropdownOptionsHtml = "") {
  // ðŸŸ¢ FIXED: Ensured part 5 uses matching grid parameters to stay centered and wide without collapsing
  return `
    <div class="franchise-tax-part5-inner-grid" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; box-sizing: border-box !important;">
      
      <div style="grid-column: span 2; border-bottom: 1px solid var(--border, #e2e8f0); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy, #0a1f44); font-size: 1.1rem; font-weight: 800; margin: 0;">Special State Instructions &amp; Disclosures</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 4px; display: flex; flex-direction: column; gap: 6px;">
        <label for="fran_tax_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy, #0a1f44);">Special Franchise Filing Notes or Instructions</label>
        <textarea id="fran_tax_provisions" placeholder="Detail any tier modifications, specialized ownership structures, zero-sole-prop exemptions, or custom processing notes relevant to your state franchise profile..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; outline: none;"></textarea>
      </div>

    </div>
  `;
};

// Aliases mapped safely to global namespace streams to accommodate master flow assembly loops
window.buildFranchiseTaxFormPart4 = window.formRegistry['franchise-tax-part4-layout'];
window.buildFranchiseTaxFormPart5 = window.formRegistry['franchise-tax-part5-layout'];


// ---------------------------------------------------------------------------- //
// SECTION I: PARTS 4 & 5 VALIDATION MATRIX ENGINE [FIXED]                      //
// ---------------------------------------------------------------------------- //
window.formRegistry['franchise-tax-parts4and5-validation'] = {
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

    // ðŸŸ¢ FIXED: Safe DOM-attachment presence assertion
    const existsInActiveDom = (el) => el && document.body.contains(el);

    const fileField = document.getElementById('fran_file_ledger_summary');
    const fileErr = document.getElementById('err_fran_file_ledger_summary');

    if (existsInActiveDom(fileField) && fileErr) {
      // ðŸŸ¢ FIXED: Safe array boundary check for document upload fields
      const isFileEmpty = !fileField.files || fileField.files.length === 0;
      if (isFileEmpty) {
        markInvalid(fileField, fileErr, "Please upload your capital stock or gross margin ledger summary.");
      } else {
        markValid(fileField, fileErr);
      }
    }

    return { isValid, errors };
  }
};

window.buildFranchiseTaxFilingForm = function(stateDropdownOptionsHtml = "") {
  const p1 = typeof window.formRegistry['franchise-tax-part1-layout'] === "function" ? window.formRegistry['franchise-tax-part1-layout'](stateDropdownOptionsHtml) : "";
  const p2 = typeof window.formRegistry['franchise-tax-part2-layout'] === "function" ? window.formRegistry['franchise-tax-part2-layout'](stateDropdownOptionsHtml) : "";
  const p3 = typeof window.formRegistry['franchise-tax-part3-layout'] === "function" ? window.formRegistry['franchise-tax-part3-layout'](stateDropdownOptionsHtml) : "";
  const p4 = typeof window.formRegistry['franchise-tax-part4-layout'] === "function" ? window.formRegistry['franchise-tax-part4-layout'](stateDropdownOptionsHtml) : "";
  const p5 = typeof window.formRegistry['franchise-tax-part5-layout'] === "function" ? window.formRegistry['franchise-tax-part5-layout'](stateDropdownOptionsHtml) : "";

  // ðŸŸ¢ SOLUTION: Set wrappers to display: block layout tracks since the inner layouts now
  // generate and sustain their own exact grid column measurements flawlessly.
  return `
    <div class="franchise-tax-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="fran_panel_part1" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="fran_panel_part2" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
      <div id="fran_panel_part3" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p3}</div>
      <div id="fran_panel_part4" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p4}</div>
      <div id="fran_panel_part5" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p5}</div>
    </div>
  `;
};





// ---------------------------------------------------------------------------- //
// SECTION K: ðŸ—‘ï¸ DYNAMIC NODE REMOVAL ENGINE (OFFICER RECORDS SYSTEM) [FIXED] //
// ---------------------------------------------------------------------------- //
window.removeFranchiseOfficerCardNode = function(cardIndex) {
  const parentContainer = document.getElementById("fran_officers_container");
  if (!parentContainer) return;

  // ðŸŸ¢ FIXED: Locate the target container strictly by its immutable data attribute index
  const targetCard = parentContainer.querySelector(`.member-record-card[data-officer-index="${cardIndex}"]`);
  if (!targetCard) return;

  // Tear down third-party background autocomplete modules attached to this card context first
  const autocompleteInputs = targetCard.querySelectorAll('[data-autocomplete-hook="places-input"]');
  autocompleteInputs.forEach(input => {
    if (typeof window.destroyGooglePlacesAutocompleteOnNode === "function") {
      window.destroyGooglePlacesAutocompleteOnNode(input);
    }
  });

  // Cleanly delete the card node block out of the active DOM tree
  targetCard.remove();

  // Re-index remaining records smoothly without destructive string rewrites
  const remainingCards = parentContainer.querySelectorAll(".member-record-card");
  remainingCards.forEach((card, loopIndex) => {
    const operationalNewIndex = loopIndex + 1;

    // Update the card tracking data layers seamlessly
    card.setAttribute('data-officer-index', operationalNewIndex);
    card.id = `fran_officer_card_${operationalNewIndex}`;

    const subtitleHeader = card.querySelector("span");
    if (subtitleHeader) {
      subtitleHeader.textContent = `Officer #${operationalNewIndex} Records`;
    }

    const trackingFields = ['name', 'title', 'street', 'unit', 'city', 'state', 'zip'];
    trackingFields.forEach(field => {
      // ðŸŸ¢ FIXED: Target unique inputs cleanly using exact substring formatting rather than broad prefixes
      const inputEl = card.querySelector(`input[id*="_officer_${field}_"], select[id*="_officer_${field}_"]`);
      const labelEl = card.querySelector(`label[for*="_officer_${field}_"]`);
      const errorEl = card.querySelector(`.wizard-error-message[id*="_officer_${field}_"]`);

      if (inputEl) inputEl.id = `fran_officer_${field}_${operationalNewIndex}`;
      if (labelEl) labelEl.setAttribute("for", `fran_officer_${field}_${operationalNewIndex}`);
      if (errorEl) errorEl.id = `err_fran_officer_${field}_${operationalNewIndex}`;

      // Re-sync autocomplete reference prefixes for the address fields securely
      if (inputEl && inputEl.hasAttribute('data-autocomplete-prefix')) {
        inputEl.setAttribute('data-autocomplete-prefix', `fran_officer_${operationalNewIndex}`);
      }
    });

    // ðŸŸ¢ FIXED: Swap out fragile inline onclick hooks for modern data-attribute targets
    const trashButton = card.querySelector(".btn-remove-officer");
    if (trashButton) {
      trashButton.setAttribute("data-target-index", operationalNewIndex);
    }
  });

  console.log(`[Officer Registry Controller] Card removal completed. Normalization pass updated ${remainingCards.length} profile contexts.`);
};



// ---------------------------------------------------------------------------- //
// SECTION L: ðŸ“¦ DYNAMIC OFFICER REGISTRY ROW APPENDER LISTENERS                //
// ---------------------------------------------------------------------------- //
if (!window.hasFranchiseOfficerListenerAttached) {
  document.addEventListener("click", function(e) {
    const appendBtn = e.target.closest("#btn_add_fran_officer");
    if (!appendBtn) return;
    
    const parentContainer = document.getElementById("fran_officers_container");
    if (!parentContainer) return;
    
    const cardIndex = parentContainer.querySelectorAll(".member-record-card").length + 1;
    const stateOptions = typeof window.buildGlobalUsaStateDropdownOptionsHtml === 'function' 
      ? window.buildGlobalUsaStateDropdownOptionsHtml("") 
      : '<option value="" disabled selected>-- Select State --</option><option value="WY">Wyoming</option>';
      
    const cardNode = document.createElement("div");
    cardNode.className = "member-record-card";
    cardNode.id = `fran_officer_card_${cardIndex}`;
    // ðŸŸ¢ FIXED: Injected immutable structural indexing data attribute layer for Section K engine matching alignment
    cardNode.setAttribute('data-officer-index', cardIndex);
    cardNode.style.cssText = "background: #ffffff; border: 1px solid var(--border, #e2e8f0); padding: 16px; border-radius: 8px; width: 100%; box-sizing: border-box; margin-top: 12px; clear: both;";
    
    // BALANCED SUB-GRID HOOK: Ensures dynamic columns match the layout constraints precisely without bleeding
    cardNode.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 12px;">
        <span style="font-weight: 800; font-size: 0.75rem; color: #10b981; text-transform: uppercase;">Officer #${cardIndex} Records</span>
        <button type="button" class="btn-remove-officer" data-target-index="${cardIndex}" onclick="window.removeFranchiseOfficerCardNode(${cardIndex})" style="background: transparent; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
          <i class="fa-solid fa-trash-can"></i> Remove Officer
        </button>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; box-sizing: border-box;">
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fran_officer_name_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Full Legal Name *</label>
          <input type="text" id="fran_officer_name_${cardIndex}" required placeholder="First and Last Legal Name" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fran_officer_name_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fran_officer_title_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Official Corporate Title *</label>
          <select id="fran_officer_title_${cardIndex}" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">
            <option value="" disabled selected>Select Title...</option>
            <option value="President">President / CEO</option>
            <option value="Secretary">Secretary</option>
            <option value="Treasurer">Treasurer / CFO</option>
            <option value="Manager">Manager / Managing Member</option>
            <option value="Director">Director</option>
          </select>
          <div class="wizard-error-message" id="err_fran_officer_title_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fran_officer_street_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Street Address *</label>
          <input type="text" id="fran_officer_street_${cardIndex}" required placeholder="e.g. 123 Main St" class="wizard-input-field" data-autocomplete-hook="places-input" data-autocomplete-prefix="fran_officer_${cardIndex}" onfocus="if(typeof attachGooglePlacesAutocompleteToNode==='function'){attachGooglePlacesAutocompleteToNode(this,'fran_officer_${cardIndex}')}" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fran_officer_street_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fran_officer_unit_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Suite / Building / Apt</label>
          <input type="text" id="fran_officer_unit_${cardIndex}" placeholder="e.g. Suite 400" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
        </div>
        <div class="wizard-input-group" style="margin: 0; display: flex; flex-direction: column; gap: 6px;">
          <label for="fran_officer_city_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">City *</label>
          <input type="text" id="fran_officer_city_${cardIndex}" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
          <div class="wizard-error-message" id="err_fran_officer_city_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="fran_officer_state_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">State *</label>
            <select id="fran_officer_state_${cardIndex}" required class="wizard-input-field" style="width: 100%; box-sizing: border-box; min-height: 44px; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.2;">${stateOptions}</select>
            <div class="wizard-error-message" id="err_fran_officer_state_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label for="fran_officer_zip_${cardIndex}" style="font-size:0.75rem; font-weight:700; color:var(--slate, #64748b);">Zip *</label>
            <input type="text" id="fran_officer_zip_${cardIndex}" required maxlength="5" class="wizard-input-field" style="width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <div class="wizard-error-message" id="err_fran_officer_zip_${cardIndex}" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
          </div>
        </div>
      </div>
    `;
    
    parentContainer.appendChild(cardNode);
    
    const newZipInput = document.getElementById(`fran_officer_zip_${cardIndex}`);
    if (newZipInput) {
      newZipInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
      });
    }
  });
  window.hasFranchiseOfficerListenerAttached = true;
}

const defaultZipInput = document.getElementById('fran_officer_zip_1');
if (defaultZipInput) {
  defaultZipInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
  });
}


// ---------------------------------------------------------------------------- //
// SECTION M: MASTER APPLICATION SCAN VALUATION SYSTEM [FIXED]                  //
// ---------------------------------------------------------------------------- //
window.buildFranchiseTaxFilingForm = function(stateDropdownOptionsHtml = "") {
  // 1. Gather all individual layout string segments from the form registry maps
  const p1 = typeof window.formRegistry['franchise-tax-part1-layout'] === "function" ? window.formRegistry['franchise-tax-part1-layout'](stateDropdownOptionsHtml) : "";
  const p2 = typeof window.formRegistry['franchise-tax-part2-layout'] === "function" ? window.formRegistry['franchise-tax-part2-layout'](stateDropdownOptionsHtml) : "";
  const p3 = typeof window.formRegistry['franchise-tax-part3-layout'] === "function" ? window.formRegistry['franchise-tax-part3-layout'](stateDropdownOptionsHtml) : "";
  const p4 = typeof window.formRegistry['franchise-tax-part4-layout'] === "function" ? window.formRegistry['franchise-tax-part4-layout'](stateDropdownOptionsHtml) : "";
  const p5 = typeof window.formRegistry['franchise-tax-part5-layout'] === "function" ? window.formRegistry['franchise-tax-part5-layout'](stateDropdownOptionsHtml) : "";

  // 2. UNIFIED FULL-WIDTH RECEPTACLE WRAPPER (TOP & BOTTOM)
  // Forces all parts to span the entire card landscape without splitting columns or collapsing to one side
  return `
    <div class="franchise-tax-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="fran_panel_part1" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="fran_panel_part2" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
      <div id="fran_panel_part3" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p3}</div>
      <div id="fran_panel_part4" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p4}</div>
      <div id="fran_panel_part5" class="franchise-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p5}</div>
    </div>
  `;
};

/**
 * Scans all field parameters inside the Franchise Tax Registration Wizard.
 * Updates UI layout parameters with error cues and reports structural status.
 * @returns {boolean} Outcome indicating global form validation success.
 */
window.validateEntireFranchiseTaxWizard = function() {
  const isPart1Valid = typeof window.formRegistry['franchise-tax-part1-validation']?.validate === 'function' ? window.formRegistry['franchise-tax-part1-validation'].validate().isValid : true;
  const isPart2Valid = typeof window.formRegistry['franchise-tax-part2-validation']?.validate === 'function' ? window.formRegistry['franchise-tax-part2-validation'].validate().isValid : true;
  const isPart3Valid = typeof window.validateFranchiseTaxFormPart3 === 'function' ? window.validateFranchiseTaxFormPart3().isValid : true;
  const isPart45Valid = typeof window.formRegistry['franchise-tax-parts4and5-validation']?.validate === 'function' ? window.formRegistry['franchise-tax-parts4and5-validation'].validate().isValid : true;
  
  return (isPart1Valid && isPart2Valid && isPart3Valid && isPart45Valid);
};

// Update master framework registry mappings configuration hooks
window.formRegistry = window.formRegistry || {};
window.formRegistry['franchise-tax-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildFranchiseTaxFilingForm(stateDropdownOptionsHtml);
};

