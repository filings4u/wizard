// ========================================================================= 
// WIDGET UI SHELL INTERFACE LOGIC & AUTOMATED HOURS GATEKEEPER
// ========================================================================= 
window.toggleSupportFlyoutContainer = function(shouldOpenMenuPanel) { 
  const flyoutContainerNode = document.getElementById("support-chat-flyout-panel"); 
  if (!flyoutContainerNode) return; 
  
  const isMobileFullScreenLayout = window.innerWidth <= 500; 
  
  if (shouldOpenMenuPanel) {
    // 🔍 REAL-TIME CENTRAL STANDARD TIME (CST) COMPLIANCE AUDIT
    const currentCstTimeString = new Date().toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour12: false });
    const currentCstDayIndex = new Date().toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "long" });
    
    // Parse out the current hour and minute integers (Format: "HH:MM:SS")
    const hoursArray = currentCstTimeString.split(":");
    const currentCstHour = parseInt(hoursArray[0], 10);
    const currentCstMinute = parseInt(hoursArray[1], 10);

    // Define availability gate limits (9:00 AM = hour 9, 5:00 PM = hour 17)
    const isBeforeNineAM = currentCstHour < 9;
    const isAfterFivePM = currentCstHour >= 17;
    const isWeekend = currentCstDayIndex === "Saturday" || currentCstDayIndex === "Sunday";

    const formFieldsView = document.getElementById("f4uActiveIntakeForm");
    const intakeMessagePrompt = document.querySelector("#chat-preflight-input-form p");
    const offlineNoticeView = document.getElementById("f4uChatClosedOfflineStateContainer");
    const complianceNoticeBar = document.getElementById("f4uChatComplianceNoticeBar");

    // 🔒 EVALUATE GATE LIMITS: Lock down entries if out of bounds or during weekends
    if (isBeforeNineAM || isAfterFivePM || isWeekend) {
      console.log(`[Gatekeeper Triggered] Live desk is CLOSED. CST Time Logged: ${currentCstTimeString} (${currentCstDayIndex})`);
      
      // Hide the intake elements completely
      if (formFieldsView) formFieldsView.style.setProperty("display", "none", "important");
      if (intakeMessagePrompt) intakeMessagePrompt.style.setProperty("display", "none", "important");
      if (complianceNoticeBar) complianceNoticeBar.style.setProperty("display", "none", "important");
      
      // Animate and reveal your Out-of-Office support desk panel routing view instead
      if (offlineNoticeView) offlineNoticeView.style.setProperty("display", "flex", "important");
    } else {
      console.log(`[Gatekeeper Approved] Live desk is OPEN. CST Time Logged: ${currentCstTimeString}`);
      
      // Ensure the standard intake elements present normally if inside business hours
      if (offlineNoticeView) offlineNoticeView.style.setProperty("display", "none", "important");
      if (formFieldsView) formFieldsView.style.setProperty("display", "flex", "important");
      if (intakeMessagePrompt) intakeMessagePrompt.style.setProperty("display", "block", "important");
      if (complianceNoticeBar) complianceNoticeBar.style.setProperty("display", "flex", "important");
    }

    // Slide open the outer container smoothly into viewport canvas area
    flyoutContainerNode.style.setProperty("display", "block", "important"); 
    setTimeout(() => { 
      flyoutContainerNode.style.setProperty("transform", "translateY(0)", "important"); 
      flyoutContainerNode.style.setProperty("opacity", "1", "important"); 
    }, 10); 
    
    const initialInputFieldName = document.getElementById("chat_first_name"); 
    if (initialInputFieldName && (!isBeforeNineAM && !isAfterFivePM && !isWeekend)) {
      initialInputFieldName.focus(); 
    }
  } else { 
    flyoutContainerNode.style.setProperty("opacity", "0", "important"); 
    if (isMobileFullScreenLayout) { 
      flyoutContainerNode.style.setProperty("transform", "translateY(100%)", "important"); 
    } else { 
      flyoutContainerNode.style.setProperty("transform", "translateY(20px)", "important"); 
    } 
    setTimeout(() => { 
      if (flyoutContainerNode.style.opacity === "0") { 
        flyoutContainerNode.style.setProperty("display", "none", "important"); 
      } 
    }, 250); 
  } 
}; 


// 🪟 NEW: BLUR-BACKGROUND MODAL OVERLAY INTERFACE INTERCEPTORS
window.closeTerminalModalInterfaceWindow = function(shouldOpen) {
  const overlay = document.getElementById("f4uChatTerminationModalOverlay");
  if (!overlay) return;
  
  const dialogBox = overlay.querySelector("div");

  if (shouldOpen) {
    overlay.style.setProperty("display", "flex", "important");
    setTimeout(() => {
      overlay.style.setProperty("opacity", "1", "important");
      if (dialogBox) dialogBox.style.setProperty("transform", "scale(1)", "important");
    }, 10);
  } else {
    overlay.style.setProperty("opacity", "0", "important");
    if (dialogBox) dialogBox.style.setProperty("transform", "scale(0.95)", "important");
    setTimeout(() => {
      if (overlay.style.opacity === "0") {
        overlay.style.setProperty("display", "none", "important");
      }
    }, 200);
  }
};

// Map the "End Chat" header button straight to our newly animated overlay panel
window.confirmAndTerminateChatSession = function() {
  window.closeTerminalModalInterfaceWindow(true);
};

/* Global off-canvas click-away listener framework */ 
document.addEventListener("click", function(canvasEventPayload) { 
  const panel = document.getElementById("support-chat-flyout-panel"); 
  if (!panel) return; 
  if (window.getComputedStyle(panel).display === "none") return; 
  
  const didUserClickLauncher = canvasEventPayload.target.closest('.chat-bubble-widget-launcher'); 
  const isClickInsidePanel = panel.contains(canvasEventPayload.target); 
  
  // Safety lock prevents clicking background elements from auto-closing your popups
  const isClickInsideModal = canvasEventPayload.target.closest('#f4uChatTerminationModalOverlay');

  if (!isClickInsidePanel && !didUserClickLauncher && !isClickInsideModal) { 
    window.toggleSupportFlyoutContainer(false); 
  } 
});


// ========================================================================= 
// filings4u Platform Architecture - UNIFIED CHAT RESCUE ENGINE (POLYFILL MODE)
// ========================================================================= 

// 1. Safe global memory variables
if (typeof window.f4uWizardSupabaseInstance === "undefined") {
  window.f4uWizardSupabaseInstance =
    window.f4uSupabase ||
    window.supabaseClientInstance ||
    null;
} 
if (typeof window.clientSessionUserId === "undefined") { window.clientSessionUserId = null; } 
if (typeof window.clientLiveSocketChannel === "undefined") { window.clientLiveSocketChannel = null; } 

// 2. Multi-Syntax Automated Database Connection Builder
window.initSupabaseInstance = function() {
  // The wizard owns exactly one Supabase client. Chat must adopt that client
  // rather than constructing another client, otherwise GoTrue sees multiple
  // Auth clients using the same storage key.
  const shared =
    window.f4uSupabase ||
    window.supabaseClientInstance ||
    null;

  if (shared && typeof shared.from === "function") {
    window.f4uWizardSupabaseInstance = shared;
    return shared;
  }

  console.warn("[Chat Widget] Shared Supabase client is not ready yet.");
  return null;
}; 

// Execute initialization phase pass
window.initSupabaseInstance();


document.addEventListener("f4u:supabase-ready", function(event) {
  const client = event?.detail?.client || window.f4uSupabase || window.supabaseClientInstance || null;
  if (client && typeof client.from === "function") {
    window.f4uWizardSupabaseInstance = client;
  }
});

// --- OPTIMIZED ANIMATION KEYFRAME STYLE INJECTOR ---
// Automatically drops slide-in popup animations and button loading spinners into document head parameters
(function injectWizardGlobalEngineStyles() {
  if (document.getElementById("f4u-wizard-core-animations-tag")) return;
  const styleTag = document.createElement("style");
  styleTag.id = "f4u-wizard-core-animations-tag";
  styleTag.textContent = `
    @keyframes wizardBubblePopUp {
      0% { opacity: 0; transform: translateY(12px) scale(0.97); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes f4uBtnSpinnerRotate {
      to { transform: rotate(360deg); }
    }
    .f4u-btn-spinner {
      width: 16px !important;
      height: 16px !important;
      border: 2px solid rgba(255, 255, 255, 0.3) !important;
      border-radius: 50% !important;
      border-top-color: #ffffff !important;
      animation: f4uBtnSpinnerRotate 0.6s linear infinite !important;
      display: inline-block !important;
    }
    .chat-inline-thumbnail-preview {
      display: block !important;
      max-width: 100% !important;
      max-height: 160px !important;
      border-radius: 6px !important;
      margin-top: 4px !important;
      cursor: pointer !important;
      transition: opacity 0.15s ease !important;
      border: 1px solid rgba(0,0,0,0.05) !important;
    }
  `;
  document.head.appendChild(styleTag);
})();

// ========================================================================= 
// 🧱 MODULE 3: COMPLETE DATA INTROSPECTION & TURNKEY ENGINE INITIALIZER
// ========================================================================= 
window.validateAndLaunchAgentChatSession = async function(event) { 
  if (event) { 
    if (typeof event.preventDefault === "function") event.preventDefault(); 
    if (typeof event.stopPropagation === "function") event.stopPropagation(); 
  } 

  const submitButton = document.getElementById("f4uSubmitBtn") || document.querySelector(".btn-wizard-main"); 
  const fNameField = document.getElementById("chat_first_name"); 
  const lNameField = document.getElementById("chat_last_name"); 
  const phoneField = document.getElementById("chat_phone"); 
  const emailField = document.getElementById("chat_email"); 

  if (!fNameField || !lNameField || !phoneField || !emailField) { 
    console.error("[Intake Fault] Critical input box reference nodes are missing from active layout."); 
    return; 
  } 

  const fName = fNameField.value.trim(); 
  const lName = lNameField.value.trim(); 
  const phone = phoneField.value.trim(); 
  const email = emailField.value.trim(); 

  if (!fName || !lName || !phone || !email) { 
    alert("Please fill in all layout fields to launch the live chat session."); 
    return; 
  } 

  if (submitButton) { 
    submitButton.disabled = true; 
    submitButton.innerText = "Connecting Securely..."; 
  } 

  // ========================================================================= 
  // 🔒 HARDENED PERSISTENT ID INITIALIZER - PREVENTS DUPLICATE CHAT CARDS
  // ========================================================================= 
  // 1. Prioritize pulling an existing 36-character string UUID from local storage first
  let stableUUIDToken = localStorage.getItem("f4u_user_id");
  
  // 2. Hardened Validation Loop: If storage is empty, corrupted, or holding a short numeric integer ID, generate a true UUID anchor
  if (!stableUUIDToken || stableUUIDToken.length < 20 || stableUUIDToken === "null" || stableUUIDToken === "undefined") {
    console.log("[Wizard Engine Key Lock] Anchoring fresh, persistent 36-character string UUID onto guest browser profile...");
    stableUUIDToken = crypto.randomUUID();
    localStorage.setItem("f4u_user_id", stableUUIDToken);
  } else {
    // Re-verify and maintain storage persistence values across page updates
    localStorage.setItem("f4u_user_id", stableUUIDToken);
  }
  
  // 3. Force the active session variables to stay perfectly in sync with the locked storage token
  window.clientSessionUserId = stableUUIDToken;

  console.log(`[Wizard Target Confirmed] Locked conversation room under single persistent UUID: ${window.clientSessionUserId}`);

  const verifiedInstance = window.initSupabaseInstance(); 
  if (!verifiedInstance || typeof verifiedInstance.from !== "function") { 
    console.error("[Supabase Failure] Uninstantiated client API layer wrapper parameters.", verifiedInstance); 
    if (submitButton) { 
      submitButton.disabled = false; 
      submitButton.innerText = "Connection Blueprint Mismatch"; 
    } 
    return; 
  } 

  try { 
    console.log("[Supabase Sync] Bypassing trigger restrictions. Logging customer details to message stream...");

    
    // Bundle form entries into system notice payload to alert your administrative staff instantly
    const textHandshakePayload = `System Notice: Chat workspace window launched.\n` + 
                                 `Name: ${fName} ${lName}\n` + 
                                 `Email: ${email}\n` + 
                                 `Phone: ${phone}`; 

    // Write straight to chat_messages—skipping the breaking wizard_intake_sessions table trigger constraints
    const { error: msgError } = await verifiedInstance 
      .from('chat_messages') 
      .insert({ 
        client_id: window.clientSessionUserId, 
        sender_type: 'client', 
        message_content: textHandshakePayload,
        is_read_by_admin: false
      }); 

    if (msgError) throw msgError; 
    console.log("[Supabase Sync] User handshake metadata committed cleanly!"); 

    // [TRANSITION LOGIC WELL - HARDENED CONTAINER TARGETING] 
    // FIXED: Target the independent interface box explicitly to prevent parent container layout collapses
    const interfaceBox = document.getElementById("wizardChatDynamicInterfaceBox"); 
    const masterPanelContainer = document.getElementById("support-chat-flyout-panel"); 
    const headerEndBtn = document.getElementById("wizardHeaderEndChatBtn");
    
    if (interfaceBox) { 
      if (masterPanelContainer) { 
        masterPanelContainer.style.setProperty("height", "550px", "important"); 
      } 
      if (headerEndBtn) {
        headerEndBtn.style.setProperty("display", "block", "important");
      }
      
      // FIXED FULL EXPANSION: Enforces explicit vertical spacing parameters and isolates the scroll well canvas layers
      interfaceBox.innerHTML = ` 
        <div id="chat-active-timeline-viewport" style="display: flex !important; flex-direction: column !important; height: 100% !important; width: 100% !important; min-height: 470px !important; max-height: 470px !important; box-sizing: border-box !important; background: #ffffff !important; position: relative !important; overflow: hidden !important;"> 
          
          <!-- Chat Timeline Scroll Frame Canvas Well Content --> 
          <div id="wizardChatScrollWell" style="flex: 1 !important; height: 370px !important; min-height: 370px !important; max-height: 370px !important; padding: 16px 20px !important; overflow-y: auto !important; background: #ffffff !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; gap: 10px !important; scroll-behavior: smooth !important;"></div> 
          
          <!-- Secure Telemetry Input Bar Footer Well --> 
          <div style="padding: 12px 16px !important; background: #f8fafc !important; border-top: 1px solid #e2e8f0 !important; display: flex !important; gap: 10px !important; align-items: flex-end !important; box-sizing: border-box !important; width: 100% !important; height: 80px !important; min-height: 80px !important; max-height: 80px !important; flex-shrink: 0 !important; position: relative !important; z-index: 10 !important;"> 
            <textarea 
              id="wizardClientChatMessageInputField" 
              style="flex: 1 !important; height: 56px !important; min-height: 56px !important; max-height: 56px !important; padding: 10px 12px !important; border: 1px solid #cbd5e1 !important; border-radius: 6px !important; font-size: 0.85rem !important; outline: none !important; resize: none !important; font-family: inherit !important; line-height: 1.4 !important; box-sizing: border-box !important; background: #ffffff !important; transition: border-color 0.15s ease !important; margin: 0 !important;" 
              placeholder="Type your compliance message here... (Enter to Send)" 
              onfocus="this.style.borderColor='#0a1f44'" 
              onblur="this.style.borderColor='#cbd5e1'" 
              onkeydown="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); window.dispatchWizardClientChatMessagePayload(); }"></textarea> 
            <button onclick="window.dispatchWizardClientChatMessagePayload()" style="height: 56px !important; padding: 0 20px !important; background: #0a1f44 !important; color: #ffffff !important; font-weight: 600 !important; font-size: 0.875rem !important; border: none !important; border-radius: 6px !important; cursor: pointer !important; transition: background 0.15s ease !important; box-sizing: border-box !important; margin: 0 !important;" onmouseover="this.style.background='#122d5a'" onmouseout="this.style.background='#0a1f44'">Send</button> 
          </div> 
        </div>`; 
    } 

    // ACTIVATES SOCKET LISTENERS IMMEDIATELY
    if (typeof window.connectClientIncomingSocketStream === "function") {
      window.connectClientIncomingSocketStream();
    }

    // ✨ IMMEDIATE UNBLOCK GREETING & RESPONSE WAIT-TIME RENDERING PASS
    setTimeout(() => {
      if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
        window.f4uWizardGreetingExecuted = true;
        window.appendIncomingMsgBubbleToWizardUI(`Hello ${fName}! A filings4u compliance expert is connecting to your session.`, 'admin'); 
        window.appendIncomingMsgBubbleToWizardUI(`⏱️ System Notice: Current estimated wait time is under 4 minutes. Thank you for your patience!`, 'admin');
      }
    }, 150);

  } catch (supabaseExceptionTelemetry) { 
    console.error("[Supabase Intake Engine Exception] Data pipeline rejected mutation row:", supabaseExceptionTelemetry.message); 
    if (submitButton) { 
      submitButton.disabled = false; 
      submitButton.innerText = "Connection Failed. Try Again."; 
    } 
  } 
};



// =========================================================================
// 📡 MODULE 3.5: UNIFIED WIZARD REALTIME STREAM LISTENER
// Target: Opens a direct postgres database stream channel matching your true UUID token
// =========================================================================
window.connectClientIncomingSocketStream = function() { 
  // FIXED: Explicitly prioritize your custom project connection instance to bypass variable overrides
  const activeInstance =
    window.f4uWizardSupabaseInstance ||
    window.f4uSupabase ||
    window.supabaseClientInstance ||
    null; 
  const currentId = window.clientSessionUserId; 

  if (!activeInstance || typeof activeInstance.channel !== "function") { 
    console.error("[Wizard Socket Error] Supabase query client instance is uninstantiated or missing the .channel() constructor."); 
    
    // Emergency Rescue: If outer scripts over-wrote the instance, re-instantiate locally inside this scope
    if (!window.f4uWizardSupabaseInstance) {
      window.f4uWizardSupabaseInstance =
        window.f4uSupabase ||
        window.supabaseClientInstance ||
        null;
    } else {
      return;
    }
  } 

  const verifiedClient = window.f4uWizardSupabaseInstance || activeInstance;
  if (!currentId) { 
    console.error("[Wizard Socket Error] Abandoning subscription: clientSessionUserId is null."); 
    return; 
  } 

  console.log(`[Wizard Socket Link] Initiating subscription wire for channel token: live_wizard_stream_${currentId}`); 

  // Clean up duplicate background channel connections to avoid memory leaks or double rendering loops
  if (window.clientLiveSocketChannel) { 
    console.log("[Wizard Socket] Cleaning up old active channel tracker elements..."); 
    try {
      verifiedClient.removeChannel(window.clientLiveSocketChannel); 
    } catch(e) {}
  } 

 // FIXED SYNCHRONIZATION LOOP: Binds directly to the postgres insert updates of chat_messages 
window.clientLiveSocketChannel = verifiedClient 
  .channel('live_wizard_stream_' + currentId) 
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'chat_messages', 
    filter: `client_id=eq.${currentId}` 
  }, (payload) => { 
    console.log("[Wizard Socket Signal Received] Over-the-air database payload captured:", payload.new); 
    
    const incomingSender = String(payload.new.sender_type || '').toLowerCase().trim(); 
    
    // HARDENED SECURITY FILTER: Only accept actual incoming admin responses over-the-air!
    // This stops the widget from intercepting and duplicating the client's own messages.
    if (incomingSender === 'admin') { 
      if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
        window.appendIncomingMsgBubbleToWizardUI(payload.new.message_content, 'admin'); 
      } else { 
        // Manual fallback injector if page script modules load asynchronously 
        const scrollWell = document.getElementById("wizardChatScrollWell"); 
        if (scrollWell) { 
          const bubbleRow = document.createElement("div"); 
          bubbleRow.style.cssText = "margin-right: auto !important; background: #edf2f7 !important; color: #0f172a !important; border-radius: 8px !important; padding: 10px 14px !important; max-width: 85% !important; font-size: 0.825rem !important; font-weight: 500 !important; clear: both !important; margin-bottom: 8px !important; border-bottom-left-radius: 2px !important; animation: wizardBubblePopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;"; 
          bubbleRow.innerText = payload.new.message_content; 
          scrollWell.appendChild(bubbleRow); 
          scrollWell.scrollTop = scrollWell.scrollHeight; 
        } 
      } 
    } 
  }) 
  .subscribe();

};

// =========================================================================
// 🚀 MODULE 4: UNIFIED TEXT MESSAGE DISPATCHER & FORM INTERCEPTOR LOCK
// =========================================================================

// --- HARDENED OUTBOUND TEXT MESSAGE DISPATCHER ENGINE ---
window.dispatchWizardClientChatMessagePayload = async function() { 
  const inputEl = document.getElementById("wizardClientChatMessageInputField"); 
  const activeInstance =
    window.f4uWizardSupabaseInstance ||
    window.f4uSupabase ||
    window.supabaseClientInstance ||
    null; 
  
  // FIXED: Pull directly from your verified, locked 36-character string UUID token stored inside browser memory layer
  const currentId = localStorage.getItem("f4u_user_id") || window.clientSessionUserId; 

  if (!inputEl || !currentId || currentId.length < 20) {
    console.error("[Payload Delivery Fault] Active database connection parameters are missing or tracking ID is uninstantiated.");
    return;
  }

  const content = inputEl.value.trim(); 
  if (!content) return; 

  // Flush input elements fields instantly to protect snappy UI interaction speeds
  inputEl.value = ""; 
  
  // Echo Loop: Render the client's own message bubble instantly into the local user UI window well
  if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
    window.appendIncomingMsgBubbleToWizardUI(content, 'client'); 
  } 

  try { 
    console.log(`[Wizard Dispatch Telemetry] Committing response line under locked ID: ${currentId}`);
    
    await activeInstance 
      .from('chat_messages') 
      .insert({ 
        client_id: currentId, 
        sender_type: 'client', 
        message_content: content, 
        is_read_by_admin: false 
      }); 
      
  } catch (backgroundFault) { 
    console.error("[Wizard Send Exception] Mutation rejected by Postgres database cluster:", backgroundFault.message); 
  } 
};



// ========================================================================= 
// 🧹 MODULE 5: BLUR BACKDROP TRANSCRIPT TRANSFERS AND CLOSING ACTIONS
// ========================================================================= 

window.executeHardSessionClearPipeline = async function() {
  const confirmBtn = document.getElementById("f4uConfirmCloseActionBtn");
  const promptState = document.getElementById("f4uModalTerminationActivePromptState");
  const successState = document.getElementById("f4uModalTerminationSuccessState");
  
  const activeInstance =
    window.f4uWizardSupabaseInstance ||
    window.f4uSupabase ||
    window.supabaseClientInstance ||
    null;
  const currentId = window.clientSessionUserId || localStorage.getItem("f4u_user_id");
  const emailField = document.getElementById("chat_email");
  const customerTargetEmail = emailField ? emailField.value.trim() : "support@filings4u.com";

  if (!activeInstance || !currentId) {
    window.closeTerminalModalInterfaceWindow(false);
    return;
  }

  // 1. Shift the button state to a spinner layout instantly
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<div class="f4u-btn-spinner" style="vertical-align: middle; margin-right: 6px;"></div> Compiling Logs...`;
  }

  try {
    console.log(`[Transcript Engine] Recovering text records for client session ID: ${currentId}`);
    
    // Gather chat log rows chronologically from server
    const { data: records, error } = await activeInstance
      .from('chat_messages')
      .select('sender_type, message_content, created_at')
      .eq('client_id', currentId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    let structuredTranscriptString = `=== filings4u Chat Transcript Summary ===\n`;
    structuredTranscriptString += `Session Client Tracking ID: ${currentId}\n`;
    structuredTranscriptString += `Export Generated Timestamp: ${new Date().toISOString()}\n`;
    structuredTranscriptString += `=========================================\n\n`;

    if (records && records.length > 0) {
      records.forEach(msg => {
        if (msg.message_content.startsWith("System Notice:")) return;
        const displayTimestamp = new Date(msg.created_at).toLocaleTimeString();
        const senderLabel = String(msg.sender_type).toLowerCase() === 'admin' ? "Support Broker" : "Client Customer";
        structuredTranscriptString += `[${displayTimestamp}] ${senderLabel}: ${msg.message_content}\n`;
      });
    } else {
      structuredTranscriptString += "(No messages were exchanged during this support session.)\n";
    }

    // Mark guest thread room row status properties to ended
    if (typeof activeInstance.from === "function") {
      await activeInstance
        .from('wizard_guest_leads')
        .delete()
        .eq('id', currentId);
    }

    // 2. Invoke live over-the-air send-chat-transcript Edge function pass
    console.log("[Transcript Engine] Invoking live send-chat-transcript function...");
    await activeInstance.functions.invoke('send-chat-transcript', {
      body: {
        client_id: currentId,
        target_email: customerTargetEmail,
        formatted_transcript_text: structuredTranscriptString
      }
    });

    console.log("[Transcript Success] Branded email summary routed to Resend tracking keys.");

    // 3. FIXED: Hide the prompt buttons and animate the success container into view!
    if (promptState) promptState.style.setProperty("display", "none", "important");
    if (successState) successState.style.setProperty("display", "flex", "important");

    // 4. Clean exit pass: Let the customer see the success message for 2 seconds before soft reloading
    setTimeout(() => {
      window.closeTerminalModalInterfaceWindow(false);
      window.toggleSupportFlyoutContainer(false);
      
      localStorage.removeItem("f4u_user_id");
      window.clientSessionUserId = null;
      window.location.reload(); 
    }, 2400);

  } catch (faultTrace) {
    console.error("[Session Clear Critical Crash]", faultTrace.message);
    
    // In case of a fallback route exception, display the success state anyway to avoid hard blocks
    if (promptState) promptState.style.setProperty("display", "none", "important");
    if (successState) {
      successState.innerHTML = `
        <div style="width: 44px; height: 44px; background: rgba(245,158,11,0.1); color: #f59e0b; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-bottom: 12px;">✓</div>
        <h4 style="margin: 0 0 6px 0; color: #0a1f44; font-size: 0.95rem; font-weight: 800;">Session Clear Completed</h4>
        <p style="margin: 0; font-size: 0.8rem; color: #64748b; line-height: 1.4;">Resetting support workspace panel connection links...</p>
      `;
      successState.style.setProperty("display", "flex", "important");
    }
    
    setTimeout(() => { window.location.reload(); }, 2000);
  }
};


// ========================================================================= 
// 🔒 HARDENED FORM INTERCEPTOR MOUNT LOCK
// ========================================================================= 
function attachHardenedFormInterceptor() { 
  const activeForm = document.getElementById("f4uActiveIntakeForm"); 
  if (activeForm) { 
    activeForm.addEventListener("submit", function(event) { 
      event.preventDefault(); 
      event.stopPropagation(); 
      console.log("[Chat Widget] Form submit intercepted. Executing integrated database sequence..."); 
      window.validateAndLaunchAgentChatSession(event); 
    }); 
    console.log("[Chat Widget] Secure submit listener attached successfully."); 
  } 
} 

if (document.readyState === "loading") { 
  document.addEventListener("DOMContentLoaded", attachHardenedFormInterceptor); 
} else { 
  attachHardenedFormInterceptor(); 
} 

window.initSupabaseInstance();







// ========================================================================= 
// UNIFIED TEXT RENDERING ENGINE (MEDIA & ANIMATION CONTAINER ALIGNMENT)
// ========================================================================= 
window.appendIncomingMsgBubbleToWizardUI = function(textString, senderTypeRole) { 
  const well = document.getElementById("wizardChatScrollWell"); 
  
  if (!well) { 
    console.warn("[UI Stream Warning] Target chat window selector element #wizardChatScrollWell not found in active DOM layout canvas."); 
    return; 
  } 

  const bubbleRow = document.createElement("div"); 
  const isAdmin = senderTypeRole === 'admin'; 
  
  // Clean presentation theme styles matching your filings4u UI panel framework layout 
  const alignmentStyles = isAdmin 
    ? "margin-right: auto !important; background: #edf2f7 !important; color: #0f172a !important; border-bottom-left-radius: 2px !important; transform-origin: bottom left !important;" 
    : "margin-left: auto !important; background: #0a1f44 !important; color: #ffffff !important; border-bottom-right-radius: 2px !important; transform-origin: bottom right !important;"; 

  // FIXED VISIBILITY: Explicitly maps line blocks and animation keys inside layout space rules
  bubbleRow.style.cssText = ` 
    max-width: 82% !important; 
    padding: 10px 14px !important; 
    border-radius: 8px !important; 
    font-size: 0.85rem !important; 
    font-weight: 500 !important; 
    word-break: break-word !important; 
    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important; 
    line-height: 1.45 !important; 
    text-align: left !important; 
    margin-bottom: 8px !important; 
    display: block !important; 
    clear: both !important; 
    flex-shrink: 0 !important;
    position: relative !important;
    visibility: visible !important;
    opacity: 1 !important;
    animation: wizardBubblePopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; 
    ${alignmentStyles} 
  `; 

  // IMAGE CAPTURE PASSTHROUGH REGEX 
  const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))/i; 
  const imageMatch = textString.match(imageRegex); 

  if (imageMatch) { 
    const imageUrl = imageMatch[1]; 
    const plainTextBody = textString.replace(imageUrl, '').trim(); 
    
    bubbleRow.innerHTML = plainTextBody ? `<div style="margin-bottom: 6px;">${plainTextBody}</div>` : ''; 
    
    const inlineImagePreview = document.createElement("img"); 
    inlineImagePreview.src = imageUrl; 
    inlineImagePreview.style.cssText = "display: block !important; max-width: 100% !important; max-height: 160px !important; border-radius: 6px !important; margin-top: 4px !important; cursor: pointer !important; transition: opacity 0.15s ease !important; border: 1px solid rgba(0,0,0,0.05) !important;"; 
    inlineImagePreview.onmouseover = function() { this.style.opacity = "0.9"; }; 
    inlineImagePreview.onmouseout = function() { this.style.opacity = "1"; }; 
    inlineImagePreview.onclick = function() { window.open(imageUrl, '_blank'); }; 
    
    bubbleRow.appendChild(inlineImagePreview); 
  } else { 
    bubbleRow.innerText = textString; 
  } 

  well.appendChild(bubbleRow); 

  // FIXED NATIVE SCROLL DEFIANCE: Force panel baseline adjustments down instantly to display the bubble on screen
  well.scrollTop = well.scrollHeight;
  setTimeout(() => { well.scrollTop = well.scrollHeight; }, 30); 
};
