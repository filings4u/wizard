// ============================================================================ //
// ðŸ› ï¸ IFTA REPLACEMENTS SERVICE: VALIDATION MATRIX ENGINE                     //
// ============================================================================ //
function initIftaReplacementsService() {
  window.formRegistry = window.formRegistry || {};

  const part1Fields = [
    { id: 'ifta_rep_legal_name', msg: 'Official business name is required.' },
    { id: 'ifta_rep_license_num', msg: 'Active IFTA License Number is required.' },
    { id: 'ifta_rep_usdot_number', msg: 'USDOT number is required.' },
    { id: 'ifta_rep_reason', msg: 'Please select a specific reason for the replacement request.' }
  ];

  window.formRegistry['ifta-replacements-part1-validation'] = {
    requiredFields: part1Fields,
    validate: function() {
      let isValid = true;
      let errors = [];

      const setError = (el, msg) => {
        if (!el) return;
        isValid = false;
        el.style.setProperty("border-color", "#ef4444", "important");
        if (!errors.includes(msg)) errors.push(msg);
        
        const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.textContent = msg;
          errorMsgNode.style.setProperty("display", "block", "important");
        }
      };

      const clearError = (el) => {
        if (!el) return;
        el.style.removeProperty("border-color");
        
        const errorMsgNode = document.getElementById("err_" + el.id) || el.parentElement?.querySelector(".wizard-error-message");
        if (errorMsgNode) {
          errorMsgNode.style.setProperty("display", "none", "important");
          errorMsgNode.textContent = "";
        }
      };

      const existsInActiveDom = (el) => el && document.body.contains(el);

      part1Fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (existsInActiveDom(el)) {
          const val = el.value ? String(el.value).trim() : "";
          const isPlaceholderSelected = val === "" || val.startsWith("--");
          if (isPlaceholderSelected) setError(el, field.msg);
          else clearError(el);
        }
      });

      return { isValid, errors };
    }
  };
}
window.initIftaReplacementsService = initIftaReplacementsService;

// ============================================================================ //
// ðŸ“Š FAMILY 32A: IFTA REPLACEMENTS LAYOUT MATRIX (PART 1)                     //
// ============================================================================ //
window.buildIftaReplacementsFormPart1 = function(stateDropdownOptionsHtml = "") {
  return `
    <div class="ifta-replacement-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
        <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> IFTA Replacement License &amp; Decal Directives</strong>
        Use this section to request replacement fuel decals or duplicate physical carrier licenses if your original credentials have been lost, stolen, destroyed, or damaged. State regulations mandate filing explicit replacement declarations to sustain compliance standing.
      </div>

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Carrier Identity &amp; Active License</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="ifta_rep_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Official Business Name <span style="color: #ef4444;">*</span></label>
        <input type="text" id="ifta_rep_legal_name" required placeholder="Enter exact business name matching state records" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
        <div class="wizard-error-message" id="err_ifta_rep_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box; margin-top: 16px;">
        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_rep_license_num" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">IFTA License Number <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ifta_rep_license_num" required placeholder="Enter Active IFTA Account ID" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; font-family: monospace; min-height: 44px;">
          <div class="wizard-error-message" id="err_ifta_rep_license_num" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <div class="wizard-input-group" style="margin: 0;">
          <label for="ifta_rep_usdot_number" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">USDOT Number <span style="color: #ef4444;">*</span></label>
          <input type="text" id="ifta_rep_usdot_number" required placeholder="Enter USDOT Number" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
          <div class="wizard-error-message" id="err_ifta_rep_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
      </div>

    </div>
  `;
};

// ============================================================================ //
// ðŸ“Š FAMILY 32A: IFTA REPLACEMENTS LAYOUT MATRIX (PART 2)                     //
// ============================================================================ //
window.buildIftaReplacementsFormPart2 = function(stateDropdownOptionsHtml = "") {
  return `
    <div class="ifta-replacement-grid-segment" style="grid-column: span 2 !important; width: 100% !important; display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box !important;">

      <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px;">
        <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Replacement Volumetrics &amp; Disclosures</h3>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
        <label for="ifta_rep_reason" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Reason for Replacement Request <span style="color: #ef4444;">*</span></label>
        <select id="ifta_rep_reason" required class="wizard-input-field" style="font-weight: 600; width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px; background-color: #ffffff;" onchange="
          const textBlock = document.getElementById('ifta_rep_explanation_wrapper');
          if (textBlock) { textBlock.style.setProperty('display', this.value === 'Other' ? 'block' : 'none', 'important'); }
        ">
          <option value="" disabled selected>-- Select Replacement Reason --</option>
          <option value="Lost">Original credentials lost in transit or misplaced</option>
          <option value="Stolen">Credentials stolen from equipment unit</option>
          <option value="Destroyed">Destroyed during vehicle washing or maintenance accidents</option>
          <option value="Damaged">Damaged/Mutilated tracking parameters (Legibility issue)</option>
          <option value="Other">Other Non-Standard Exception (Specify below)</option>
        </select>
        <div class="wizard-error-message" id="err_ifta_rep_reason" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" id="ifta_rep_explanation_wrapper" style="grid-column: span 2; margin-top: 12px; display: none;">
        <label for="ifta_rep_explanation" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Detailed Explanation Statement</label>
        <textarea id="ifta_rep_explanation" placeholder="Provide specific operational details regarding your unique replacement circumstances..." class="wizard-input-field" style="width: 100%; min-height: 60px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px;">
        <label for="ifta_rep_decal_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 4px;">Quantity of Replacement Decal Sets Needed <span style="color: #ef4444;">*</span></label>
        <input type="number" id="ifta_rep_decal_count" required value="1" min="1" max="50" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }">
      </div>

    </div>
  `;
};

// ============================================================================ //
// ðŸ“¦ MASTER IFTA REPLACEMENTS APPLICATION ASSEMBLY HOOK                         //
// ============================================================================ //
window.buildIftaReplacementsFormMaster = function(stateDropdownOptionsHtml = "") {
  const p1 = typeof window.buildIftaReplacementsFormPart1 === "function" ? window.buildIftaReplacementsFormPart1(stateDropdownOptionsHtml) : "";
  const p2 = typeof window.buildIftaReplacementsFormPart2 === "function" ? window.buildIftaReplacementsFormPart2(stateDropdownOptionsHtml) : "";

  return `
    <div class="ifta-replacements-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div id="ifta_rep_panel_part1" class="ifta-replacement-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p1}</div>
      <div id="ifta_rep_panel_part2" class="ifta-replacement-layout-card" style="display: block; width: 100%; box-sizing: border-box;">${p2}</div>
    </div>
  `;
};

window.validateEntireIftaReplacementsWizard = function() {
  const isPart1Valid = typeof window.formRegistry?.['ifta-replacements-part1-validation']?.validate === 'function' ? window.formRegistry['ifta-replacements-part1-validation'].validate().isValid : true;
  return isPart1Valid;
};

window.formRegistry = window.formRegistry || {};
window.formRegistry['ifta-replacements-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildIftaReplacementsFormMaster(stateDropdownOptionsHtml);
};

