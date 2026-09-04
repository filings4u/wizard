// ============================================================================ //
// ðŸ“¡ CENTRALIZED SUPABASE CONNECTION & INTERACTIVE FORM VAULT ENGINE          //
// ============================================================================ //
;(function() {
  "use strict";
  const URL_VAULT_ROUTER = window.ENV_SUPABASE_URL || "";
  const ACCESS_TOKEN_VAULT = window.ENV_SUPABASE_ANON_KEY || "";
  if (typeof supabase !== "undefined" && URL_VAULT_ROUTER && ACCESS_TOKEN_VAULT) {
    window.supabaseClientInstance = supabase.createClient(URL_VAULT_ROUTER, ACCESS_TOKEN_VAULT);
    console.log("[Supabase Sync] Secure database connection pipeline initialized.");
  }
})();

/**
 * Programmatically assembles and injects the Save Progress Modal UI directly into the DOM.
 */
function displaySaveProgressModalInterface() {
  if (document.getElementById("f4u-save-progress-modal-root")) return;

  // Append responsive media styles dynamically to document head
  if (!document.getElementById("f4u-modal-responsive-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "f4u-modal-responsive-styles";
    styleSheet.innerText = `
      @media (max-width: 576px) {
        .f4u-modal-card { width: 90% !important; padding: 24px !important; margin: 16px; }
        .f4u-grid-split { grid-template-columns: 1fr !important; gap: 16px !important; }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  const modalOverlayOverlay = document.createElement("div");
  modalOverlayOverlay.id = "f4u-save-progress-modal-root";
  modalOverlayOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(10, 31, 68, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 99999; box-sizing: border-box;";
  
  modalOverlayOverlay.innerHTML = `
    <div class="f4u-modal-card" style="background: #ffffff; width: 100%; max-width: 500px; padding: 35px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; box-sizing: border-box; font-family: sans-serif; text-align: left; max-height: 90vh; overflow-y: auto;">
      
      <!-- Close Form Button with SVG Fallback X Cross -->
      <button type="button" onclick="window.dismissSaveProgressModalInterface()" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 1.25rem; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://w3.org" style="stroke: currentColor; stroke-width: 2; stroke-linecap: round;"><path d="M1 1L13 13M1 13L13 1"></path></svg>
      </button>

      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0; color: #0a1f44; font-size: 1.35rem; font-weight: 800;">Save Your Progress</h3>
        <p style="margin: 6px 0 0 0; color: #64748b; font-size: 0.875rem;">Enter your contact information below to secure your application details and resume from any device.</p>
      </div>

      <!-- App Status Response Notification Center Container -->
      <div id="f4u-modal-alert-status-container" style="display: none; margin-bottom: 16px; padding: 12px 16px; border-radius: 6px; font-size: 0.875rem; font-weight: 500; line-height: 1.4;"></div>

      <form id="f4u-save-progress-vault-form" onsubmit="window.processSaveProgressSubmissionPass(event)" style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Responsive Name Form Split -->
        <div class="f4u-grid-split" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-weight: 700; font-size: 0.8rem; color: #0a1f44;">First Name *</label>
            <input type="text" id="vault_client_first_name" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 0.9rem;">
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-weight: 700; font-size: 0.8rem; color: #0a1f44;">Last Name *</label>
            <input type="text" id="vault_client_last_name" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 0.9rem;">
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-weight: 700; font-size: 0.8rem; color: #0a1f44;">Email Address *</label>
          <input type="email" id="vault_client_email" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 0.9rem;">
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-weight: 700; font-size: 0.8rem; color: #0a1f44;">Phone Number *</label>
          <input type="tel" id="vault_client_phone" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 0.9rem;">
        </div>

        <button type="submit" id="vault-save-submit-btn" style="width: 100%; padding: 14px; background: #0a1f44; color: #ffffff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem; transition: background 0.2s;">
          <span>Secure Progress Data</span>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modalOverlayOverlay);
}

window.dismissSaveProgressModalInterface = function() {
  const targetModal = document.getElementById("f4u-save-progress-modal-root");
  if (targetModal) targetModal.remove();
};

/**
 * Transmits lead information straight to the custom wizard_abandoned_leads schema table and issues Auth Magic Links.
 */
window.processSaveProgressSubmissionPass = async function(event) {
  if (event && event.preventDefault) event.preventDefault();
  
  const db = window.supabaseClientInstance || window.getSuccessPageSupabaseClient?.() || window.supabaseClient;
  const submitBtn = document.getElementById("vault-save-submit-btn");
  const alertContainer = document.getElementById("f4u-modal-alert-status-container");

  if (!db) {
    displayModalMessage("Configuration Error: Connection to database vault is uninitialized.", "error");
    return;
  }

  const firstName = document.getElementById("vault_client_first_name")?.value.trim();
  const lastName = document.getElementById("vault_client_last_name")?.value.trim();
  const email = document.getElementById("vault_client_email")?.value.trim().toLowerCase();
  const phone = document.getElementById("vault_client_phone")?.value.trim();

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Synchronizing Records...';
  }
  
  if (alertContainer) alertContainer.style.display = "none";

  // ðŸŸ¢ TARGETING PRODUCTION SCHEMA: Maps elements perfectly to your column structures
  const leadPayload = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    current_step: parseInt(window.currentWizardActiveStep, 10) || 1
  };

  try {
    // 1. Upsert data to the abandoned leads table
    const { error: transactionError } = await db
      .from('wizard_abandoned_leads')
      .upsert(leadPayload, { onConflict: 'email' });

    if (transactionError) throw transactionError;

    // 2. Dispatch the Magic Link dynamic secure login invitation
    const { error: authError } = await db.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.href // Redirect back to current session setup
      }
    });

    if (authError) throw authError;

    // Persist tracking parameters locally so Step 6 processing functions can evaluate states
    localStorage.setItem("f4u_is_returning_customer", "true");
    localStorage.setItem("f4u_saved_progress_email", email);

    // Display inline Success Layout
    displayModalMessage("âœ“ Success! Your application data has been securely saved. A login magic link has been sent to your email to resume later.", "success");
    
    // Hide form elements so users focus on the confirmation alert banner
    document.getElementById("f4u-save-progress-vault-form").style.display = "none";

    // Auto-dismiss the interface after a slight delay to allow confirmation readability
    setTimeout(() => {
      window.dismissSaveProgressModalInterface();
    }, 4500);

  } catch (err) {
    console.error("[Abandoned Lead Write Error]", err);
    displayModalMessage(`Database Transaction Rejected: ${err.message}`, "error");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Secure Progress Data';
    }
  }
};

/**
 * Renders cleanly styles status warnings into the modal card view
 */
function displayModalMessage(message, type) {
  const alertContainer = document.getElementById("f4u-modal-alert-status-container");
  if (!alertContainer) return;

  alertContainer.innerText = message;
  alertContainer.style.display = "block";

  if (type === "success") {
    alertContainer.style.background = "#e6f4ea";
    alertContainer.style.color = "#137333";
    alertContainer.style.border = "1px solid #dadce0";
  } else {
    alertContainer.style.background = "#fce8e6";
    alertContainer.style.color = "#c5221f";
    alertContainer.style.border = "1px solid #dadce0";
  }
}

window.displaySaveProgressModalInterface = displaySaveProgressModalInterface;

document.addEventListener("DOMContentLoaded", () => {
  const saveProgressBtn = document.getElementById("sidebarFallbackLogoutBtn");
  if (saveProgressBtn) {
saveProgressBtn.removeAttribute("onclick");saveProgressBtn.addEventListener("click", window.displaySaveProgressModalInterface);}});
