// ============================================================================ //
// ðŸ“‹ DUAL-COLUMN REFACTOR: STEPS 1 AND 2 SUB-GRIDS (PART 1 OF 2)               //
// ============================================================================ //
window.formRegistry = window.formRegistry || {};

// Step 1: Owner Demographics Form Panel with Side-by-Side Field Positioning
window.formRegistry['new-entrant-audit-part1-layout'] = function() {
  return `
    <div id="nea_panel_part1" style="width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box;">
      <h3 style="grid-column: span 2; color: var(--navy, #0a1f44); margin: 0; font-size: 1.1rem; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">1. Company Owner Profile</h3>
      
      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">OWNER FIRST NAME *</label>
        <input type="text" id="nea_owner_first_name" required placeholder="First Name" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        <div id="err_nea_owner_first_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">OWNER LAST NAME *</label>
        <input type="text" id="nea_owner_last_name" required placeholder="Last Name" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        <div id="err_nea_owner_last_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">EMAIL ADDRESS *</label>
        <input type="email" id="nea_owner_email" required placeholder="email@company.com" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        <div id="err_nea_owner_email" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">DIRECT PHONE NUMBER *</label>
        <input type="tel" id="nea_owner_phone" required placeholder="512-555-0199" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        <div id="err_nea_owner_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;
};

// Step 2: Core FMCSA Registry Identifiers with Balanced Side-by-Side Drops
window.formRegistry['new-entrant-audit-part2-layout'] = function() {
  return `
    <div id="nea_panel_part2" style="width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box; margin-top: 10px;">
      <h3 style="grid-column: span 2; color: var(--navy, #0a1f44); margin: 0; font-size: 1.1rem; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">2. Motor Carrier Operational Parameters</h3>
      
      <div class="wizard-input-group" style="grid-column: span 2;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">OFFICIAL MOTOR CARRIER NAME *</label>
        <input type="text" id="nea_legal_name" required placeholder="Exact name matching USDOT registry" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        <div id="err_nea_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">USDOT NUMBER *</label>
        <input type="text" id="nea_usdot_number" required placeholder="e.g., 1234567" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
        <div id="err_nea_usdot_number" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">MC / MX NUMBER</label>
        <input type="text" id="nea_mc_number" placeholder="e.g., 123456" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">PRIMARY OPERATIONAL CLASSIFICATION *</label>
        <select id="nea_operation_class" required class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #fff; box-sizing: border-box;">
          <option value="" disabled selected>Select Classification...</option>
          <option value="interstate-for-hire">Interstate Authorized Common/Contract Carrier</option>
          <option value="interstate-private">Interstate Private Motor Carrier</option>
          <option value="intrastate-for-hire">Intrastate For-Hire Operations Only</option>
          <option value="intrastate-private">Intrastate Private Operations Only</option>
        </select>
        <div id="err_nea_operation_class" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">FMCSA AUDIT NOTICE STATUS *</label>
        <select id="nea_audit_trigger_status" required class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #fff; box-sizing: border-box;" onchange="
          var wrapper = document.getElementById('nea_letter_deadline_wrapper');
          var input = document.getElementById('nea_audit_deadline');
          if (this.value === 'letter-received') {
            if (wrapper) wrapper.style.display = 'block';
            if (input) input.required = true;
          } else {
            if (wrapper) wrapper.style.display = 'none';
            if (input) { input.required = false; input.value = ''; }
          }
        ">
          <option value="preemptive" selected>Preemptive System Alignment (Proactive setup before notice)</option>
          <option value="letter-received">Official Audit Notification Letter Received</option>
        </select>
        <div id="err_nea_audit_trigger_status" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div id="nea_letter_deadline_wrapper" class="wizard-input-group" style="grid-column: span 2; display: none;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">MANDATORY SUBMISSION DEADLINE DATE *</label>
        <input type="date" id="nea_audit_deadline" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;">
        <div id="err_nea_audit_deadline" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;
};


// ============================================================================ //
// ðŸ“‹ STEP 3 LAYOUT: PREMIUM COMPLIANCE VAULT & UPSELL MATRIX PANEL             //
// ============================================================================ //

// Step 3: Expanded Folder Packages featuring Select-All and Top Dismissal Controls
window.formRegistry['new-entrant-audit-part3-layout'] = function() {
  return `
    <div id="nea_panel_addons" style="position: relative; background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; width: 100%; box-sizing: border-box; margin-top: 10px;">
      
      <!-- TOP DISMISS X BUTTON LINK -->
      <button type="button" onclick="if(typeof window.dismissNewEntrantUpsellCard==='function'){window.dismissNewEntrantUpsellCard();}" style="position: absolute; top: 12px; right: 12px; background: transparent; border: none; font-size: 1.25rem; font-weight: 700; color: #94a3b8; cursor: pointer; outline: none;">âœ•</button>

      <h3 style="color: var(--navy, #0a1f44); margin: 0 24px 0 0; font-size: 1.1rem; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">3. Certified Audit Support & Compliance Vault</h3>
      <p style="color: #64748b; font-size: 0.8rem; margin: 6px 0 12px 0;">Select premium filing options to pass your audit. Selections stream straight to Step 5.</p>

      <!-- PROGRAMMATIC MASTER TOGGLE FRAME -->
      <div style="display: flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.06); padding: 12px; border-radius: 6px; border: 1px dashed #10b981; margin-bottom: 16px; width: 100%; box-sizing: border-box;">
        <input type="checkbox" id="nea_select_all_upsells" style="cursor: pointer; width: 16px; height: 16px;" onchange="if(typeof window.toggleAllNewEntrantUpsellNodes==='function'){window.toggleAllNewEntrantUpsellNodes(this.checked);}">
        <label for="nea_select_all_upsells" style="font-size: 0.85rem; font-weight: 800; color: #065f46; cursor: pointer;">OPT-IN TO FULL COMPREHENSIVE AUDIT SUITE (SELECT ALL)</label>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; box-sizing: border-box;">
        
        <!-- ITEM 1: DQF ASSEMBLY -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px;">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <input type="checkbox" id="nea_service_dqf" value="79.00" data-price="79.00" data-name="Driver Qualifications Folder (DQF Assembly)" class="nea-addon-checkbox" style="margin-top: 3px;" onchange="if(typeof window.syncNewEntrantUpsellsToSummary==='function'){window.syncNewEntrantUpsellsToSummary();}">
            <div>
              <label for="nea_service_dqf" style="font-size: 0.85rem; font-weight: 700; color: #0a1f44; cursor: pointer;">Driver Qualifications Folder (DQF) Assembly</label>
              <span style="display: block; font-size: 0.75rem; color: #64748b; margin-top: 2px;">Compiles mandatory driver files, medical certificates, background logs, and dynamic records.</span>
            </div>
          </div>
          <strong style="color: #10b981; font-family: monospace; font-size: 0.85rem; white-space: nowrap; padding-left: 10px;">+$79.00</strong>
        </div>

        <!-- ITEM 2: DOT TESTING DRUG POOL CONSORTIUM -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px;">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <input type="checkbox" id="nea_service_consortium" value="149.00" data-price="149.00" data-name="DOT Drug & Alcohol Consortium Enrollment" class="nea-addon-checkbox" style="margin-top: 3px;" onchange="if(typeof window.syncNewEntrantUpsellsToSummary==='function'){window.syncNewEntrantUpsellsToSummary();}">
            <div>
              <label for="nea_service_consortium" style="font-size: 0.85rem; font-weight: 700; color: #0a1f44; cursor: pointer;">DOT Drug &amp; Alcohol Consortium Enrollment</label>
              <span style="display: block; font-size: 0.75rem; color: #64748b; margin-top: 2px;">Secures required testing certificates and active randomly drawn pool matching parameters.</span>
            </div>
          </div>
          <strong style="color: #10b981; font-family: monospace; font-size: 0.85rem; white-space: nowrap; padding-left: 10px;">+$149.00</strong>
        </div>

        <!-- ITEM 3: HOS DATA LOG REVIEW -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px;">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <input type="checkbox" id="nea_service_hos" value="195.00" data-price="195.00" data-name="Record-Keeping Practices (HOS Log Audit)" class="nea-addon-checkbox" style="margin-top: 3px;" onchange="if(typeof window.syncNewEntrantUpsellsToSummary==='function'){window.syncNewEntrantUpsellsToSummary();}">
            <div>
              <label for="nea_service_hos" style="font-size: 0.85rem; font-weight: 700; color: #0a1f44; cursor: pointer;">Hours of Service (HOS) Log Audit Pre-Review</label>
              <span style="display: block; font-size: 0.75rem; color: #64748b; margin-top: 2px;">Examines ELD graph tracking telemetry logs to resolve layout parsing exceptions.</span>
            </div>
          </div>
          <strong style="color: #10b981; font-family: monospace; font-size: 0.85rem; white-space: nowrap; padding-left: 10px;">+$195.00</strong>
        </div>

        <!-- ITEM 4: MAINTENANCE RECORD FOLDER SET -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px;">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <input type="checkbox" id="nea_service_maintenance" value="85.00" data-price="85.00" data-name="Vehicle Maintenance Records Folder" class="nea-addon-checkbox" style="margin-top: 3px;" onchange="if(typeof window.syncNewEntrantUpsellsToSummary==='function'){window.syncNewEntrantUpsellsToSummary();}">
            <div>
              <label for="nea_service_maintenance" style="font-size: 0.85rem; font-weight: 700; color: #0a1f44; cursor: pointer;">Vehicle Maintenance Records &amp; Inspection Files</label>
              <span style="display: block; font-size: 0.75rem; color: #64748b; margin-top: 2px;">Compiles Part 396 annual verification sheets, inspection logs, and DVIR trackers.</span>
            </div>
          </div>
          <strong style="color: #10b981; font-family: monospace; font-size: 0.85rem; white-space: nowrap; padding-left: 10px;">+$85.00</strong>
        </div>

        <!-- ITEM 5: STRATEGIC MOCK AUDIT PRE-CONSULTATION -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; background: rgba(10, 31, 68, 0.02); border: 1px dashed #10b981; padding: 12px; border-radius: 6px;">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <input type="checkbox" id="nea_service_consultation" value="250.00" data-price="250.00" data-name="Independent Mock Pre-Audit Package" class="nea-addon-checkbox" style="margin-top: 3px;" onchange="if(typeof window.syncNewEntrantUpsellsToSummary==='function'){window.syncNewEntrantUpsellsToSummary();}">
            <div>
              <label for="nea_service_consultation" style="font-size: 0.85rem; font-weight: 700; color: #0a1f44; cursor: pointer;">Safety Management Plan Consultation</label>
              <span style="display: block; font-size: 0.75rem; color: #64748b; margin-top: 2px;">Provides a private 1-on-1 dossier mock review session with a senior specialist.</span>
            </div>
          </div>
          <strong style="color: #10b981; font-family: monospace; font-size: 0.85rem; white-space: nowrap; padding-left: 10px;">+$250.00</strong>
        </div>

        <div id="err_nea_services_matrix" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;
};

// ============================================================================ //
// ðŸ“‹ DUAL-COLUMN REFACTOR: STEP 4 FLEET SUB-GRID (PART 2 OF 2)                 //
// ============================================================================ //

// Step 4: Fleet Volumetrics Inventory with Side-by-Side Positioning
window.formRegistry['new-entrant-audit-part4-layout'] = function() {
  return `
    <div id="nea_panel_equipment" style="width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; box-sizing: border-box; margin-top: 10px;">
      <h3 style="grid-column: span 2; color: var(--navy, #0a1f44); margin: 0; font-size: 1.1rem; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">4. Fleet Volumetrics &amp; Equipment Inventory</h3>
      <p style="grid-column: span 2; color: #64748b; font-size: 0.8rem; margin: 0 0 4px 0;">Declare the total active power units, operators, and trailering assets in your fleet profile:</p>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">TOTAL POWER UNITS / TRUCKS *</label>
        <input type="number" id="nea_trucks_count" required min="1" placeholder="e.g., 5" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" oninput="this.value = this.value.replace(/\\D/g, '')">
        <div id="err_nea_trucks_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 1;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">TOTAL COMMERCIAL DRIVERS *</label>
        <input type="number" id="nea_drivers_count" required min="1" placeholder="e.g., 4" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" oninput="this.value = this.value.replace(/\\D/g, '')">
        <div id="err_nea_drivers_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>

      <div class="wizard-input-group" style="grid-column: span 2;">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy); display: block; margin-bottom: 6px;">TOTAL TRAILING EQUIPMENT / TRAILERS *</label>
        <input type="number" id="nea_trailers_count" required min="0" placeholder="e.g., 6 (Enter 0 if none)" class="wizard-input-field" style="width: 100%; min-height: 44px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" oninput="this.value = this.value.replace(/\\D/g, '')">
        <div id="err_nea_trailers_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      </div>
    </div>
  `;
};

console.log("[Grid Refactor Fix] Side-by-side positioning matrices applied cleanly for desktop structures.");


// Step 5: Special Handling Remarks & Form Compilation Hooks
window.formRegistry['new-entrant-audit-part5-layout'] = function() {
  return `
    <div id="nea_panel_part3_step" style="width: 100%; display: flex; flex-direction: column; gap: 15px; margin-top: 10px;">
      <h3 style="color: var(--navy, #0a1f44); margin: 0; font-size: 1.1rem; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">5. Special Handling Instructions</h3>
      
      <div class="wizard-input-group">
        <label style="font-weight: 700; font-size: 0.85rem; color: var(--navy);">SPECIAL AUDIT INSTRUCTIONS</label>
        <textarea id="nea_provisions" placeholder="Detail any safety write-ups, custom ELD platforms, operational route exceptions, or temporary state enforcement extensions relevant to your safety audit dossier..." class="wizard-input-field" style="width: 100%; min-height: 100px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-weight: 600; box-sizing: border-box; outline: none; resize: vertical; display: block;"></textarea>
      </div>
    </div>
  `;
};

// ============================================================================ //
// âš™ï¸ RUNTIME PLATFORM CONTROLLERS & DATA TOTALIZERS                           //
// ============================================================================ //

window.syncNewEntrantUpsellsToSummary = function() {
  const summaryRoot = document.getElementById("nea_summary_addons_ledger_root") || document.getElementById("wizard_cart_addons_summary");
  if (!summaryRoot) return;

  let totalAddonPrice = 0;
  let summaryHtml = "";
  const checkboxes = document.querySelectorAll(".nea-addon-checkbox");
  
  checkboxes.forEach(box => {
    if (box.checked) {
      const name = box.getAttribute("data-name") || "Compliance Package Addon";
      const price = parseFloat(box.getAttribute("data-price") || "0");
      totalAddonPrice += price;
      
      summaryHtml += `
        <div class="summary-addon-row" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; width: 100%; box-sizing: border-box;">
          <span style="font-size: 0.85rem; font-weight: 600; color: #0a1f44;"><i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 6px;"></i> \${name}</span>
          <span style="font-family: monospace; font-weight: 700; color: #10b981; font-size: 0.85rem;">+\$\${price.toFixed(2)}</span>
        </div>
      `;
    }
  });

  summaryRoot.innerHTML = summaryHtml || `
    <p style="margin: 0; color: #94a3b8; font-size: 0.85rem; font-style: italic;">No additional compliance folder optimization selections active.</p>
  `;

  if (typeof window.globalOrchestratedCartRefreshSync === "function") {
    window.globalOrchestratedCartRefreshSync(totalAddonPrice);
  }
};

window.toggleAllNewEntrantUpsellNodes = function(shouldCheckAll) {
  const checkboxes = document.querySelectorAll(".nea-addon-checkbox");
  checkboxes.forEach(box => {
    box.checked = shouldCheckAll;
  });
  window.syncNewEntrantUpsellsToSummary();
};

window.dismissNewEntrantUpsellCard = function() {
  window.toggleAllNewEntrantUpsellNodes(false);
  const panel = document.getElementById("nea_panel_addons");
  if (panel) {
    panel.style.setProperty("display", "none", "important");
  }
};

console.log("[Pipeline Success] Lightweight structural setup complete. Shard loops aligned sequentially.");

// ============================================================================ //
// ðŸ› ï¸ NEW ENTRANT AUDIT SERVICE: FIELD SCANCE ENGINE (PART 1 OF 2)               //
// ============================================================================ //

/**
 * ðŸŸ¢ STEP 1 EXPLICIT SCANNER: Validates Owner Demographics only.
 * Bound to the first transition checkpoint explicitly to clear step 1 advancement.
 */
window.validateNewEntrantAuditFormPart1 = function() {
  let isValid = true;

  const markInvalid = (id, msg) => {
    const el = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (err) { err.textContent = msg; err.style.setProperty("display", "block", "important"); }
    if (el) el.style.setProperty("border-color", "#ef4444", "important");
    isValid = false;
  };

  const markValid = (id) => {
    const el = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (err) { err.style.setProperty("display", "none", "important"); err.textContent = ""; }
    if (el) el.style.setProperty("border-color", "#cbd5e1", "important");
  };

  const fName = document.getElementById('nea_owner_first_name');
  if (fName) { if (!fName.value.trim()) markInvalid('nea_owner_first_name', "Owner first name is required."); else markValid('nea_owner_first_name'); }

  const lName = document.getElementById('nea_owner_last_name');
  if (lName) { if (!lName.value.trim()) markInvalid('nea_owner_last_name', "Owner last name is required."); else markValid('nea_owner_last_name'); }

  const phone = document.getElementById('nea_owner_phone');
  if (phone) { if (!phone.value.trim()) markInvalid('nea_owner_phone', "Owner contact phone number is required."); else markValid('nea_owner_phone'); }

  const email = document.getElementById('nea_owner_email');
  if (email) {
    const emailVal = email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) markInvalid('nea_owner_email', "Contact profile email address is required.");
    else if (!regex.test(emailVal)) markInvalid('nea_owner_email', "Please enter a valid business email layout format.");
    else markValid('nea_owner_email');
  }

  return isValid;
};

/**
 * ðŸŸ¢ STEP 2 EXPLICIT SCANNER: Validates Motor Carrier IDs only.
 * Bound to the second transition checkpoint explicitly to clear step 2 advancement.
 */
window.validateNewEntrantAuditFormPart2 = function() {
  let isValid = true;

  const markInvalid = (id, msg) => {
    const el = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (err) { err.textContent = msg; err.style.setProperty("display", "block", "important"); }
    if (el) el.style.setProperty("border-color", "#ef4444", "important");
    isValid = false;
  };

  const markValid = (id) => {
    const el = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (err) { err.style.setProperty("display", "none", "important"); err.textContent = ""; }
    if (el) el.style.setProperty("border-color", "#cbd5e1", "important");
  };

  const legal = document.getElementById('nea_legal_name');
  if (legal) { if (!legal.value.trim()) markInvalid('nea_legal_name', "Official motor carrier name matching state registration is required."); else markValid('nea_legal_name'); }

  const usdot = document.getElementById('nea_usdot_number');
  if (usdot) { if (!usdot.value.trim()) markInvalid('nea_usdot_number', "Active 7-digit USDOT tracking sequence is required."); else markValid('nea_usdot_number'); }

  const opClass = document.getElementById('nea_operation_class');
  if (opClass) { if (!opClass.value || opClass.value.startsWith("--")) markInvalid('nea_operation_class', "Primary business operational class selection is required."); else markValid('nea_operation_class'); }

  const trigger = document.getElementById('nea_audit_trigger_status');
  if (trigger) { if (!trigger.value || trigger.value.startsWith("--")) markInvalid('nea_audit_trigger_status', "Please confirm your current safety audit notice status."); else markValid('nea_audit_trigger_status'); }

  const deadline = document.getElementById('nea_audit_deadline');
  if (trigger && trigger.value === 'letter-received' && deadline) {
    if (!deadline.value) markInvalid('nea_audit_deadline', "Submission deadline date is required for received letters.");
    else markValid('nea_audit_deadline');
  }

  return isValid;
};

// ============================================================================ //
// ðŸ› ï¸ NEW ENTRANT AUDIT SERVICE: FIELD SCANCE ENGINE (PART 2 OF 2)               //
// ============================================================================ //

/**
 * ðŸŸ¢ STEP 3 EXPLICIT SCANNER: Validates Premium Addons / Upsells Package folder matrix.
 * Bound to the third transition checkpoint explicitly to clear step 3 advancement.
 */
window.validateNewEntrantAuditFormPart3 = function() {
  // Returns true as selecting addon compliance folders is completely optional
  return true;
};

/**
 * ðŸŸ¢ STEP 4 EXPLICIT SCANNER: Validates Fleet Volumetrics / Equipment Inventory.
 * Bound to the fourth transition checkpoint explicitly to clear step 4 advancement.
 */
window.validateNewEntrantAuditFormPart4 = function() {
  let isValid = true;

  const markInvalid = (id, msg) => {
    const el = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (err) { err.textContent = msg; err.style.setProperty("display", "block", "important"); }
    if (el) el.style.setProperty("border-color", "#ef4444", "important");
    isValid = false;
  };

  const markValid = (id) => {
    const el = document.getElementById(id);
    const err = document.getElementById("err_" + id);
    if (err) { err.style.setProperty("display", "none", "important"); err.textContent = ""; }
    if (el) el.style.setProperty("border-color", "#cbd5e1", "important");
  };

  const metrics = ['nea_trucks_count', 'nea_drivers_count', 'nea_trailers_count'];
  metrics.forEach(id => {
    const el = document.getElementById(id);
    if (el && document.body.contains(el)) {
      const parsedVal = parseInt(el.value, 10);
      if (isNaN(parsedVal) || parsedVal < 0 || (id !== 'nea_trailers_count' && parsedVal < 1)) {
        markInvalid(id, "Please provide a valid whole integer count metric.");
      } else {
        markValid(id);
      }
    }
  });

  return isValid;
};

/**
 * ðŸŸ¢ STEP 5 EXPLICIT SCANNER: Validates Special Audit Memo Field parameters.
 * Bound to the fifth transition checkpoint explicitly to clear step 5 advancement.
 */
window.validateNewEntrantAuditFormPart5 = function() {
  // Returns true as text entry inside the instructions area is entirely optional
  return true;
};

/**
 * MASTER ROUTER INTERLOC SYSTEM SWEAPER BINDINGS MAP
 * Re-routes the framework registry's main check loops to query your stepped validation functions.
 */
window.validateEntireNewEntrantWizard = function() {
  // Checks active DOM sections cleanly depending on which part template is rendered on the viewport canvas
  if (document.getElementById('nea_owner_first_name')) {
    return window.validateNewEntrantAuditFormPart1();
  }
  if (document.getElementById('nea_legal_name')) {
    return window.validateNewEntrantAuditFormPart2();
  }
  if (document.getElementById('nea_panel_addons')) {
    return window.validateNewEntrantAuditFormPart3();
  }
  if (document.getElementById('nea_panel_equipment')) {
    return window.validateNewEntrantAuditFormPart4();
  }
  if (document.getElementById('nea_provisions')) {
    return window.validateNewEntrantAuditFormPart5();
  }
  return true;
};

// Rebind verified master check loops directly back onto global form framework objects
window.formRegistry = window.formRegistry || {};
if (window.formRegistry["new-entrant-audit"]) {
  window.formRegistry["new-entrant-audit"].isValid = function() {
    return window.validateEntireNewEntrantWizard();
  };
}

console.log("[Pipeline Verified] Multi-part tracking step validators mapped independently and connected to the registry.");




// ============================================================================ //
// ðŸ“¦ MASTER SYSTEM ROUTER COMPILER ASSEMBLY HOOK                               //
// ============================================================================ //

/**
 * Programmatic fallback loader layout constructor for single-card themes.
 */
window.buildNewEntrantAuditForm = function(stateDropdownOptionsHtml = "") {
  const s1 = typeof window.formRegistry['new-entrant-audit-part1-layout'] === "function" ? window.formRegistry['new-entrant-audit-part1-layout'](stateDropdownOptionsHtml) : "";
  const s2 = typeof window.formRegistry['new-entrant-audit-part2-layout'] === "function" ? window.formRegistry['new-entrant-audit-part2-layout']() : "";
  const s3 = typeof window.formRegistry['new-entrant-audit-part3-layout'] === "function" ? window.formRegistry['new-entrant-audit-part3-layout']() : "";
  const s4 = typeof window.formRegistry['new-entrant-audit-part4-layout'] === "function" ? window.formRegistry['new-entrant-audit-part4-layout']() : "";
  const s5 = typeof window.formRegistry['new-entrant-audit-part5-layout'] === "function" ? window.formRegistry['new-entrant-audit-part5-layout']() : "";

  return `
    <div class="new-entrant-audit-master-container" style="grid-column: span 2 !important; width: 100% !important; display: flex !important; flex-direction: column !important; gap: 24px !important; box-sizing: border-box !important;">
      <div class="nea-card-row">${s1}</div>
      <div class="nea-card-row">${s2}</div>
      <div class="nea-card-row">${s3}</div>
      <div class="nea-card-row">${s4}</div>
      <div class="nea-card-row">${s5}</div>
    </div>
  `;
};

// Map structural framework pointers across active global registries safely
window.formRegistry = window.formRegistry || {};
window.formRegistry['new-entrant-audit-form-master'] = function(stateDropdownOptionsHtml = "") {
  return window.buildNewEntrantAuditForm(stateDropdownOptionsHtml);
};

// Mirror alias pass to preserve dynamic step validation sweeps
window.formRegistry['new-entrant-safety-audit-form-master'] = window.formRegistry['new-entrant-audit-form-master'];

console.log("[Master Closure] Complete New Entrant pipeline assembled and closed successfully.");

