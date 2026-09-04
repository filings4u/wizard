/**
 * Filings4U Platform Architecture
 * Module: trucker-authority.js (Part 1 of 4)
 * Standalone Namespace Init & Part 1 Layout Setup
 */
window.formRegistry = window.formRegistry || {};

// --- PART 1 LAYOUT: MOTOR CARRIER PROFILE FRAMEWORK ---
window.formRegistry['trucker-authority-part1-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- COMPLIANCE BANNER: FORCED TO SPAN FULL ROW WIDTH -->
        <div style="grid-column: span 2; background: rgba(10, 31, 68, 0.03); border-left: 4px solid var(--navy); padding: 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; line-height: 1.4; color: var(--slate); box-sizing: border-box; margin-bottom: 8px;">
            <strong style="color: var(--navy); display: block; margin-bottom: 4px;"><i class="fa-solid fa-circle-info"></i> FMCSA Operating Authority (MC & USDOT Number) Mandates</strong>
            To operate as a for-hire interstate motor carrier transporting regulated commodities or passengers within the United States, you must obtain active Operating Authority from the Federal Motor Carrier Safety Administration (FMCSA). This application initiates the registration for your USDOT number, MC number, and sets up your mandatory 21-day federal protest period tracking.
        </div>

        <!-- SECTION 1 HEADER WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 16px;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">1. Motor Carrier Profile</h3>
        </div>

        <!-- FIELD 1: LEGAL BUSINESS NAME (FULL ROW WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 12px;">
            <label for="ta_legal_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Legal Business Name / Sole Proprietor Full Title <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ta_legal_name" required placeholder="Enter exact name registered with corporate state records or IRS files" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
            <div class="wizard-error-message" id="err_ta_legal_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 2 & FIELD 3: EIN AND BASE STATE (SPAN 1 EACH TO SIT BALANCED) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="ta_federal_ein" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Employer Identification Number (EIN) <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ta_federal_ein" required placeholder="00-0000000" pattern="[0-9]{2}-[0-9]{7}" title="Standard 9-digit EIN required (XX-XXXXXXX)" class="wizard-input-field" style="font-family: monospace; width: 100%; box-sizing: border-box;">
            <div class="wizard-error-message" id="err_ta_federal_ein" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px;">
            <label for="ta_base_state" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Base State of Operations <span style="color: #ef4444;">*</span></label>
            <select id="ta_base_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                <option value="" disabled selected>Select Base State...</option>
                ${stateDropdownOptionsHtml}
            </select>
            <div class="wizard-error-message" id="err_ta_base_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- FIELD 4: PRINCIPAL PLACE OF BUSINESS STREET Address (FULL ROW WIDTH) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px;">
            <label for="ta_physical_street" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Principal Place of Business Address <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ta_physical_street" required placeholder="Physical Address (FMCSA regulations strictly prohibit P.O. Boxes)" class="wizard-input-field" style="width: 100%; box-sizing: border-box;" onfocus="attachGooglePlacesAutocompleteToNode(this, 'ta_physical')">
            <div class="wizard-error-message" id="err_ta_physical_street" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- GEOGRAPHIC CITY/STATE/ZIP CONTAINER SUBGRID ROW (FULL ROW WIDTH) -->
        <div style="grid-column: span 2; margin-top: 16px; width: 100%; box-sizing: border-box;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; width: 100%; box-sizing: border-box;">
                <div>
                    <label for="ta_physical_city" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">City <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="ta_physical_city" required placeholder="City" class="wizard-input-field" style="width: 100%; box-sizing: border-box;">
                    <div class="wizard-error-message" id="err_ta_physical_city" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="ta_physical_state" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">State <span style="color: #ef4444;">*</span></label>
                    <select id="ta_physical_state" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box;">
                        <option value="" disabled selected>Select State...</option>
                        ${stateDropdownOptionsHtml}
                    </select>
                    <div class="wizard-error-message" id="err_ta_physical_state" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
                <div>
                    <label for="ta_physical_zip" style="font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; display: block; margin-bottom: 4px;">Zip Code <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="ta_physical_zip" required placeholder="Zip Code" style="font-family: monospace; width: 100%; box-sizing: border-box;" class="wizard-input-field">
                    <div class="wizard-error-message" id="err_ta_physical_zip" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
                </div>
            </div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: trucker-authority.js (Block 2 of 5)
 * Standalone Section 2 Layout Part A
 */
/**
 * Filings4U Platform Architecture
 * Module: trucker-authority-part2-layout (Re-engineered Select Heights - Part A)
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['trucker-authority-part2-layout'] = function() {
    return `
        <!-- SECTION 2 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">2. Operation Classification & Power Unit Fleet Scaling</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Provide precise operational parameters for FMCSA bracket indexing.</p>
        </div>

        <!-- OPERATION CLASSIFICATION (ADDED TEXT WRAPPING STYLES TO STOP CLIPPING) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_operation_type" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Operation Classification <span style="color: #ef4444;">*</span></label>
            <select id="ta_operation_type" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; min-height: 44px; height: auto; white-space: normal; overflow: visible; padding: 10px 30px 10px 12px; line-height: 1.3;">
                <option value="" disabled selected>Select Operation Type...</option>
                <option value="auth-property">Authorized For-Hire Motor Carrier of Property (Except Household Goods)</option>
                <option value="auth-household">Authorized For-Hire Motor Carrier of Household Goods (Moving Services)</option>
                <option value="private-carrier">Private Motor Carrier (Transporting proprietary commercial asset inventory)</option>
                <option value="exempt-for-hire">Exempt For-Hire Motor Carrier (Transporting specific un-regulated raw commodities)</option>
            </select>
            <div class="wizard-error-message" id="err_ta_operation_type" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- GEOGRAPHICAL SCOPE (ADDED TEXT WRAPPING STYLES TO STOP CLIPPING) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_operation_scope" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Geographical Scope of Operation <span style="color: #ef4444;">*</span></label>
            <select id="ta_operation_scope" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; min-height: 44px; height: auto; white-space: normal; overflow: visible; padding: 10px 30px 10px 12px; line-height: 1.3;">
                <option value="interstate" selected>Interstate Commerce (Crossing state lines, international borders, or hauling point-to-point transit links)</option>
                <option value="intrastate">Intrastate Commerce Only (Operating strictly within boundaries of base state selection)</option>
            </select>
            <div class="wizard-error-message" id="err_ta_operation_scope" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: trucker-authority-part2-layout (Re-engineered Select Heights - Part B)
 */
window.formRegistry = window.formRegistry || {};

// Extend the layout registry to append fleet scale counts and driver qualification options
const baseLayoutPartA = window.formRegistry['trucker-authority-part2-layout'];
window.formRegistry['trucker-authority-part2-layout'] = function() {
    return baseLayoutPartA() + `
        <!-- POWER UNITS (TRUCKS COUNT) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_power_units" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Number of Power Units (Trucks) <span style="color: #ef4444;">*</span></label>
            <input type="number" id="ta_power_units" required placeholder="1" min="1" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;" onchange="if(typeof updateWizardFinalTotalAmountMatrix === 'function') { updateWizardFinalTotalAmountMatrix(); }">
            <div class="wizard-error-message" id="err_ta_power_units" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- TOTAL DRIVERS -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_drivers_count" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Total Number of Drivers <span style="color: #ef4444;">*</span></label>
            <input type="number" id="ta_drivers_count" required placeholder="1" min="1" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
            <div class="wizard-error-message" id="err_ta_drivers_count" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- CDL HOLDERS (ADDED TEXT WRAPPING STYLES TO PREVENT INDICATOR CUT-OFF) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_interstate_wages" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Are drivers CDL holders? <span style="color: #ef4444;">*</span></label>
            <select id="ta_interstate_wages" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; min-height: 44px; height: auto; white-space: normal; overflow: visible; padding: 10px 30px 10px 12px; line-height: 1.3;">
                <option value="yes" selected>Yes, drivers operate commercial vehicles requiring a valid Class A/B CDL</option>
                <option value="no">No, fleet units fall completely under Non-CDL weight metrics (Under 26,001 lbs)</option>
            </select>
            <div class="wizard-error-message" id="err_ta_interstate_wages" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- HAZMAT PLACEMENTS (ADDED TEXT WRAPPING STYLES TO PREVENT INDICATOR CUT-OFF) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_hazmat_intent" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy);">Will fleet transport Hazardous Materials? <span style="color: #ef4444;">*</span></label>
            <select id="ta_hazmat_intent" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; min-height: 44px; height: auto; white-space: normal; overflow: visible; padding: 10px 30px 10px 12px; line-height: 1.3;">
                <option value="no" selected>No, explicitly zero hazardous cargo placements will be handled</option>
                <option value="yes">Yes, fleet transports placardable quantities of hazardous chemicals/materials</option>
            </select>
            <div class="wizard-error-message" id="err_ta_hazmat_intent" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
    `;
};


/**
 * Filings4U Platform Architecture
 * Module: trucker-authority.js (Block 3 of 5)
 * Standalone Section 2 Layout Part B: Cargo Spectrum Matrix Elements
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['trucker-authority-part3-layout'] = function() {
    return `
        <!-- SECTION 3 CARGO SPECTRUM ROW HEADERS (FULL WIDTH ROW) -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; margin-bottom: 8px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">3. Regulated Cargo Spectrum Matrix</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">Check every type of cargo classification your equipment profiles plan to haul or distribute (Check all that apply):</p>
        </div>

        <!-- REGULATED CARGO SELECTION BOX GRID (SPAN 2 INSIDE MASTER FOR BALANCED VIEW) -->
        <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid var(--border); padding: 16px; border-radius: 8px; box-sizing: border-box; width: 100%;">
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_1" value="general_freight" style="margin-top: 3px;">
                <label for="ta_cargo_1" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">General Freight / Dry Van Logistics</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_2" value="refrigerated" style="margin-top: 3px;">
                <label for="ta_cargo_2" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Refrigerated Food / Cold Chain Produce (Reefer)</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_3" value="intermodal" style="margin-top: 3px;">
                <label for="ta_cargo_3" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Intermodal Containers / Ocean Port Chassis</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_4" value="motor_vehicles" style="margin-top: 3px;">
                <label for="ta_cargo_4" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Motor Vehicles Hauling / Auto Transport Car Carriers</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_5" value="machinery" style="margin-top: 3px;">
                <label for="ta_cargo_5" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Large Machinery / Flatbed Construction Equipment</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_6" value="building_materials" style="margin-top: 3px;">
                <label for="ta_cargo_6" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Building Materials / Lumber / Steel Coils</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_7" value="liquids_gases" style="margin-top: 3px;">
                <label for="ta_cargo_7" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Liquids / Gases (Tanker Truck Operations)</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_8" value="livestock" style="margin-top: 3px;">
                <label for="ta_cargo_8" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Livestock / Live Animal Transportation</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_9" value="grain_feed" style="margin-top: 3px;">
                <label for="ta_cargo_9" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Grain, Feed, or Agricultural Bulk Commodities</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_10" value="chemicals" style="margin-top: 3px;">
                <label for="ta_cargo_10" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Non-Hazardous Chemicals or Industrial Fluids</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_11" value="garbage_refuse" style="margin-top: 3px;">
                <label for="ta_cargo_11" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Garbage, Refuse, or Commercial Waste Scraps</label>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <input type="checkbox" id="ta_cargo_12" value="household_goods" style="margin-top: 3px;">
                <label for="ta_cargo_12" style="font-size: 0.825rem; color: var(--navy); font-weight: 600;">Household Goods (Moving Services / Networks)</label>
            </div>
            <div class="wizard-error-message" id="err_ta_cargo_matrix" style="color: #ef4444; font-size: 0.75rem; grid-column: span 2; margin-top: 4px; display: none; width: 100%;"></div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: trucker-authority-part4-layout (Re-engineered Select Heights - Part A)
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['trucker-authority-part4-layout'] = function(stateDropdownOptionsHtml = "") {
    return `
        <!-- SECTION 4: SAFETY ATTESTATION DETAILS (FULL WIDTH WRAPPER) -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">4. Safety Certification &amp; Compliance Attestation</h3>
            <p style="color: var(--slate); font-size: 0.8rem; margin: 4px 0 0 0;">The FMCSA mandates that carriers certify their explicit knowledge of Federal Motor Carrier Safety Regulations (FMCSRs).</p>
        </div>

        <!-- ATTESTATION DROPDOWN (ADDED TEXT WRAPPING & REMOVED RIGID HEIGHT CAPS) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px;">
            <label for="ta_safety_knowledge" style="font-weight: 700; font-size: 0.65rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Do you certify that you have access to and system knowledge of the FMCSRs? <span style="color: #ef4444;">*</span></label>
            <select id="ta_safety_knowledge" required class="wizard-input-field" style="font-weight: 600; width: 100%; box-sizing: border-box; min-height: 44px; height: auto; white-space: normal; overflow: visible; padding: 10px 30px 10px 12px; line-height: 1.3;">
                <option value="" disabled selected>Select Attestation Option...</option>
                <option value="yes">Yes, I certify that I am familiar with the federal safety regulations and will maintain mandatory safety protocols</option>
                <option value="no">No, I require Filings4u to provide an orientation packet and compliance workbook package</option>
            </select>
            <div class="wizard-error-message" id="err_ta_safety_knowledge" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
    `;
};
/**
 * Filings4U Platform Architecture
 * Module: trucker-authority-part4-layout (Re-engineered Select Heights - Part B)
 */
window.formRegistry = window.formRegistry || {};

// Extend the layout registry to append safety contact fields and special instructions
const baseLayoutPart4A = window.formRegistry['trucker-authority-part4-layout'];
window.formRegistry['trucker-authority-part4-layout'] = function(stateDropdownOptionsHtml = "") {
    return baseLayoutPart4A(stateDropdownOptionsHtml) + `
        <!-- SAFETY OFFICER NAME & PHONE FIELDS (SPAN 1 EACH TO SIT BALANCED) -->
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_safety_contact_name" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Authorized Safety Official Name <span style="color: #ef4444;">*</span></label>
            <input type="text" id="ta_safety_contact_name" required placeholder="First and Last Name of Authorized Officer" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
            <div class="wizard-error-message" id="err_ta_safety_contact_name" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        <div class="wizard-input-group" style="grid-column: span 1; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_safety_contact_phone" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Official Contact Phone Number <span style="color: #ef4444;">*</span></label>
            <input type="tel" id="ta_safety_contact_phone" required placeholder="(512) 555-0199" class="wizard-input-field" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; box-sizing: border-box; outline: none; min-height: 44px;">
            <div class="wizard-error-message" id="err_ta_safety_contact_phone" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>

        <!-- SECTION 5 FULL ROW WRAPPER -->
        <div style="grid-column: span 2; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 24px; width: 100%;">
            <h3 style="color: var(--navy); font-size: 1.1rem; font-weight: 800; margin: 0;">5. Special Handling Directives &amp; Operational Notes</h3>
        </div>

        <!-- ADDITIONAL PROVISIONS TEXTAREA (FULL WIDTH ROW) -->
        <div class="wizard-input-group" style="grid-column: span 2; margin-top: 16px; box-sizing: border-box;">
            <label for="ta_provisions" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--navy); display: block; margin-bottom: 6px;">Special Carrier Instructions or Fleet Notes</label>
            <textarea id="ta_provisions" placeholder="Detail any specific filing timelines, vehicle leasing arrangements, multi-state base plates, or custom proxy handling directives relative to your FMCSA operating authority dossier..." class="wizard-input-field" style="width: 100%; min-height: 80px; box-sizing: border-box; padding: 12px; font-family: inherit; resize: vertical; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-weight: 600; outline: none;"></textarea>
        </div>
    `;
};

/**
 * Filings4U Platform Architecture
 * Module: trucker-authority.js (Block 5 of 6)
 * Central Form Validation Logic Matrices
 */
window.formRegistry = window.formRegistry || {};

window.formRegistry['trucker-authority-validation'] = {
    validatePart1: function() {
        let isValid = true;
        const markInvalid = (inputEl, errorEl, msg) => {
            if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
            if (inputEl) inputEl.style.border = "1px solid #ef4444";
            isValid = false;
        };
        const markValid = (inputEl, errorEl) => {
            if (errorEl) errorEl.style.display = "none";
            if (inputEl) inputEl.style.border = "";
        };

        const nameField = document.getElementById('ta_legal_name');
        const nameErr = document.getElementById('err_ta_legal_name');
        if (!nameField || !nameField.value.trim()) {
            markInvalid(nameField, nameErr, "Legal business name or sole proprietor title is required.");
        } else {
            markValid(nameField, nameErr);
        }

        const einField = document.getElementById('ta_federal_ein');
        const einErr = document.getElementById('err_ta_federal_ein');
        if (einField && einErr) {
            const rawEin = einField.value.replace(/\D/g, "");
            if (rawEin.length !== 9) {
                markInvalid(einField, einErr, "A standard 9-digit EIN is required (e.g., 12-3456789).");
            } else {
                markValid(einField, einErr);
            }
        }

        const baseStateField = document.getElementById('ta_base_state');
        const baseStateErr = document.getElementById('err_ta_base_state');
        if (!baseStateField || !baseStateField.value) {
            markInvalid(baseStateField, baseStateErr, "Please select your base state of operations.");
        } else {
            markValid(baseStateField, baseStateErr);
        }

        const streetField = document.getElementById('ta_physical_street');
        const streetErr = document.getElementById('err_ta_physical_street');
        if (streetField && streetErr) {
            const val = streetField.value.trim();
            const poBoxRegex = /\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i;
            if (!val) {
                markInvalid(streetField, streetErr, "Principal place of business address is required.");
            } else if (poBoxRegex.test(val)) {
                markInvalid(streetField, streetErr, "FMCSA federal safety regulations strictly prohibit P.O. Box locations for motor carriers.");
            } else {
                markValid(streetField, streetErr);
            }
        }

        const cityField = document.getElementById('ta_physical_city');
        const cityErr = document.getElementById('err_ta_physical_city');
        if (!cityField || !cityField.value.trim()) {
            markInvalid(cityField, cityErr, "City location parameter is required.");
        } else {
            markValid(cityField, cityErr);
        }

        const stateField = document.getElementById('ta_physical_state');
        const stateErr = document.getElementById('err_ta_physical_state');
        if (!stateField || !stateField.value) {
            markInvalid(stateField, stateErr, "Please choose your business state coordinate.");
        } else {
            markValid(stateField, stateErr);
        }

        const zipField = document.getElementById('ta_physical_zip');
        const zipErr = document.getElementById('err_ta_physical_zip');
        if (!zipField || !zipField.value.trim()) {
            markInvalid(zipField, zipErr, "Zip Code is required.");
        } else {
            markValid(zipField, zipErr);
        }

        return isValid;
    },
    validatePart2: function() {
        let isValid = true;
        const markInvalid = (inputEl, errorEl, msg) => {
            if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
            if (inputEl) inputEl.style.border = "1px solid #ef4444";
            isValid = false;
        };
        const markValid = (inputEl, errorEl) => {
            if (errorEl) errorEl.style.display = "none";
            if (inputEl) inputEl.style.border = "";
        };

        const typeField = document.getElementById('ta_operation_type');
        const typeErr = document.getElementById('err_ta_operation_type');
        if (!typeField || !typeField.value) {
            markInvalid(typeField, typeErr, "Please specify an operational classification profile.");
        } else {
            markValid(typeField, typeErr);
        }

        const scopeField = document.getElementById('ta_operation_scope');
        const scopeErr = document.getElementById('err_ta_operation_scope');
        if (!scopeField || !scopeField.value) {
            markInvalid(scopeField, scopeErr, "Please pick a geographical scope of operation.");
        } else {
            markValid(scopeField, scopeErr);
        }

        const powerField = document.getElementById('ta_power_units');
        const powerErr = document.getElementById('err_ta_power_units');
        if (powerField && powerErr) {
            const val = parseInt(powerField.value, 10);
            if (isNaN(val) || val < 1) {
                markInvalid(powerField, powerErr, "Fleet scaling parameters require a minimum of 1 operational truck.");
            } else {
                markValid(powerField, powerErr);
            }
        }

        const driversField = document.getElementById('ta_drivers_count');
        const driversErr = document.getElementById('err_ta_drivers_count');
        if (driversField && driversErr) {
            const val = parseInt(driversField.value, 10);
            if (isNaN(val) || val < 1) {
                markInvalid(driversField, driversErr, "Fleet logistics profiles require at least 1 designated driver.");
            } else {
                markValid(driversField, driversErr);
            }
        }

        const wagesField = document.getElementById('ta_interstate_wages');
        const wagesErr = document.getElementById('err_ta_interstate_wages');
        if (!wagesField || !wagesField.value) {
            markInvalid(wagesField, wagesErr, "Please clarify if your operators possess commercial driver licenses (CDL).");
        } else {
            markValid(wagesField, wagesErr);
        }

        const hazmatField = document.getElementById('ta_hazmat_intent');
        const hazmatErr = document.getElementById('err_ta_hazmat_intent');
        if (!hazmatField || !hazmatField.value) {
            markInvalid(hazmatField, hazmatErr, "Please specify your fleet hazardous materials cargo status.");
        } else {
            markValid(hazmatField, hazmatErr);
        }

        let cargoCheckedCount = 0;
        for (let idx = 1; idx <= 12; idx++) {
            const box = document.getElementById(`ta_cargo_${idx}`);
            if (box && box.checked) cargoCheckedCount++;
        }
        const matrixContainer = document.getElementById('err_ta_cargo_matrix');
        if (matrixContainer) {
            if (cargoCheckedCount === 0) {
                matrixContainer.textContent = "FMCSA security rules require you to check at least 1 type of commercial cargo classification you plan to haul.";
                matrixContainer.style.display = "block";
                isValid = false;
            } else {
                matrixContainer.style.display = "none";
            }
        }

        return isValid;
    }
};
/**
 * Filings4U Platform Architecture
 * Module: trucker-authority.js (Block 6 of 6)
 * Part 3 Safety Validation, Legacy Mapping Bridges, & Master System Allocation Hook
 */
window.formRegistry = window.formRegistry || {};

// Extend the existing validation object with Part 3 validation rules
window.formRegistry['trucker-authority-validation'].validatePart3 = function() {
    let isValid = true;
    const markInvalid = (inputEl, errorEl, msg) => {
        if (errorEl) { errorEl.textContent = msg; errorEl.style.display = "block"; }
        if (inputEl) inputEl.style.border = "1px solid #ef4444";
        isValid = false;
    };
    const markValid = (inputEl, errorEl) => {
        if (errorEl) errorEl.style.display = "none";
        if (inputEl) inputEl.style.border = "";
    };

    const safetyField = document.getElementById('ta_safety_knowledge');
    const safetyErr = document.getElementById('err_ta_safety_knowledge');
    if (!safetyField || !safetyField.value) {
        markInvalid(safetyField, safetyErr, "Please pick an active safety compliance attestation choice.");
    } else {
        markValid(safetyField, safetyErr);
    }

    const nameField = document.getElementById('ta_safety_contact_name');
    const nameErr = document.getElementById('err_ta_safety_contact_name');
    if (!nameField || !nameField.value.trim()) {
        markInvalid(nameField, nameErr, "Authorized safety official name is required.");
    } else {
        markValid(nameField, nameErr);
    }

    const phoneField = document.getElementById('ta_safety_contact_phone');
    const phoneErr = document.getElementById('err_ta_safety_contact_phone');
    if (!phoneField || !phoneField.value.trim()) {
        markInvalid(phoneField, phoneErr, "An official contact phone number is required.");
    } else {
        markValid(phoneField, phoneErr);
    }

    return isValid;
};

// Backward legacy interface compatibility bridges matching execution paths
window.validateTruckerAuthorityFormPart1 = function() {
    return window.formRegistry['trucker-authority-validation'].validatePart1();
};

window.validateTruckerAuthorityFormPart2 = function() {
    return window.formRegistry['trucker-authority-validation'].validatePart2();
};

window.validateTruckerAuthorityFormPart3 = function() {
    return window.formRegistry['trucker-authority-validation'].validatePart3();
};
window.validateTruckerAuthorityFormPart4 = function() {
    return window.formRegistry['trucker-authority-validation'].validatePart4();
};

window.validateEntireTruckerAuthorityWizard = function() {
    const p1 = window.validateTruckerAuthorityFormPart1();
    const p2 = window.validateTruckerAuthorityFormPart2();
    const p3 = window.validateTruckerAuthorityFormPart3();
    const p4 = window.validateTruckerAuthorityFormPart4();
    return (p1 && p2 && p3 && p4);
};

// ============================================================================ //
// ðŸ“¦ MASTER RENDER SYSTEM ALLOCATION
// ============================================================================ //
window.formRegistry['trucker-authority-form-master'] = function(stateDropdownOptionsHtml = "") {
    return window.formRegistry['trucker-authority-part1-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['trucker-authority-part2-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['trucker-authority-part3-layout'](stateDropdownOptionsHtml) + 
           window.formRegistry['trucker-authority-part4-layout'](stateDropdownOptionsHtml);
};

