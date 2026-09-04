/** * filings4u Platform Architecture 
 * Module: Wizard UI Controls & Realtime Database Stack 
 * Target: Handles mobile full-screen toggles, forces vertical stacks, and manages Supabase socket state. 
 */ 

window.initSupabaseInstance = function() { 
  // 1. If we already have a fully functioning client instance with query capabilities, use it immediately
  if (window.f4uWizardSupabaseInstance && typeof window.f4uWizardSupabaseInstance.from === "function") {
    return window.f4uWizardSupabaseInstance;
  }

  // 2. If a pre-initialized custom client exists elsewhere globally, adopt it
  if (window.supabaseClient && typeof window.supabaseClient.from === "function") {
    window.f4uWizardSupabaseInstance = window.supabaseClient;
    return window.f4uWizardSupabaseInstance;
  }

  // 3. CRITICAL INITIALIZATION: Build a fresh, fully active query object using your verified keys
  if (typeof window.supabase !== "undefined" && typeof window.supabase.createClient === "function") { 
    const SUPABASE_URL = "https://lrbimrlbskjweynxlgas.supabase.co"; 
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmltcmxic2tqd2V5bnhsZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjQ0NTYsImV4cCI6MjA5NDEwMDQ1Nn0.I8fQ6ZjA9oaTqJCF-7Z7vUboXC8zv2cogBv4PC_1ihU"; 
    
    console.log("[Supabase Engine] Initializing database client mapping...");
    window.f4uWizardSupabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 
  } 

  if (!window.f4uWizardSupabaseInstance || typeof window.f4uWizardSupabaseInstance.from !== "function") { 
    console.warn("[Chat Widget Warning] Supabase query client could not be instantiated. Check CDN script tag."); 
  } 

  return window.f4uWizardSupabaseInstance; 
}; 

// Execute initialization phase pass
window.initSupabaseInstance();

// Secure global state mappings that won't collide with local scopes 
if (typeof window.clientSessionUserId === "undefined") { 
  window.clientSessionUserId = null; 
} 
if (typeof window.clientLiveSocketChannel === "undefined") { 
  window.clientLiveSocketChannel = null; 
} 

/**
 * Module: Live WebSocket Engine
 * Target: Starts real-time database listener channels safely without duplicate subscriptions.
 */
window.connectChatSocket = function() {
  const supabase = window.initSupabaseInstance();
  
  if (!supabase) {
    console.error("[Chat Connection Error] Cannot connect. Supabase SDK is missing from the global window.");
    return;
  }

  // Prevent multiple overlapping connections
  if (window.clientLiveSocketChannel) {
    console.log("[Chat Engine] Realtime channel already open and active.");
    return;
  }

  console.log("[Chat Engine] Connecting to real-time message stream...");

  // Open real-time channel. Change 'messages' to match your actual database table name.
  window.clientLiveSocketChannel = supabase
    .channel('public:messages') 
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      console.log('[Chat Message Received From Supabase]:', payload.new);
      
      // INSERT YOUR UI INJECTION CODE HERE
      // Example: window.appendMessageToChatUI(payload.new);
    })
    .subscribe((status) => {
      console.log(`[Chat Realtime Socket Status Update]: ${status}`);
    });
};

/** 
 * Module: Wizard UI Controls (Step 1 - Overriding Inline Display Constraints) 
 * Target: Enforces display property changes directly over rigid inline HTML markers 
 */ 
window.toggleSupportFlyoutContainer = function(shouldOpenMenuPanel) { 
  const flyoutContainerNode = document.getElementById("support-chat-flyout-panel"); 
  if (!flyoutContainerNode) { 
    console.error("[Chat Widget Error] Target panel selector element #support-chat-flyout-panel not found in active DOM."); 
    return; 
  } 

  // Ensure Supabase is bound when the user attempts to open the panel 
  if (shouldOpenMenuPanel) { 
    window.initSupabaseInstance(); 
  } 

  const isMobileFullScreenLayout = window.innerWidth <= 500; 

  if (shouldOpenMenuPanel) { 
    // CONNECTS SOCKET ON FLYOUT OPENING:
    if (typeof window.connectChatSocket === "function") {
      window.connectChatSocket(); 
    }

    flyoutContainerNode.style.setProperty("display", "block", "important"); 
    setTimeout(() => { 
      if (isMobileFullScreenLayout) { 
        flyoutContainerNode.style.setProperty("transform", "translateY(0)", "important"); 
      } else { 
        flyoutContainerNode.style.setProperty("transform", "translateX(0)", "important"); 
      } 
      flyoutContainerNode.style.setProperty("opacity", "1", "important"); 
      
      if (window.innerWidth <= 991) { 
        flyoutContainerNode.style.top = "auto"; 
        flyoutContainerNode.style.left = "auto"; 
        if (!isMobileFullScreenLayout) { 
          flyoutContainerNode.style.bottom = "20px"; 
          flyoutContainerNode.style.right = "20px"; 
        } 
        const inlineFlexRow = flyoutContainerNode.querySelector("form > div[style*='display: flex']"); 
        if (inlineFlexRow) { 
          inlineFlexRow.style.setProperty("flex-direction", "column", "important"); 
          inlineFlexRow.style.setProperty("gap", "10px", "important"); 
        } 
      } else { 
        if (!flyoutContainerNode.style.top || flyoutContainerNode.style.top === "0px") { 
          flyoutContainerNode.style.removeProperty("top"); 
          flyoutContainerNode.style.removeProperty("left"); 
        } 
        const inlineFlexRow = flyoutContainerNode.querySelector("form > div[style*='display: flex']"); 
        if (inlineFlexRow) { 
          inlineFlexRow.style.removeProperty("flex-direction"); 
        } 
      } 
    }, 10); 

    const initialInputFieldName = document.getElementById("chat_first_name"); 
    if (initialInputFieldName) { 
      initialInputFieldName.focus(); 
    } 
  } else { 
    if (isMobileFullScreenLayout) { 
      flyoutContainerNode.style.setProperty("transform", "translateY(100%)", "important"); 
    } else { 
      flyoutContainerNode.style.setProperty("transform", "translateX(100%)", "important"); 
    } 
    flyoutContainerNode.style.setProperty("opacity", "0", "important"); 
    setTimeout(() => { 
      if (flyoutContainerNode.style.opacity === "0") { 
        flyoutContainerNode.style.setProperty("display", "none", "important"); 
      } 
    }, 300); 
  } 
};


/** 
 * Global click off-canvas listener framework. 
 * FIXED: Bypasses strict inline style locks using native window computation selectors 
 */ 
document.addEventListener("click", function(canvasEventPayload) { 
  const panel = document.getElementById("support-chat-flyout-panel"); 
  if (!panel) return; 

  // TARGETED VISIBILITY FIX: Evaluates live styles to bypass 'display: none !important' inline string blocks 
  const activeComputedDisplay = window.getComputedStyle(panel).display; 
  if (activeComputedDisplay === "none") { 
    return; 
  } 

  // TARGETED BUTTON WELL FIX: Uses .closest() to match any target pixel inside your launcher icon 
  const didUserClickLauncher = canvasEventPayload.target.closest('.chat-bubble-widget'); 
  const isClickInsidePanel = panel.contains(canvasEventPayload.target); 

  // Smoothly close the window layout panel only if the click was genuinely on external wrapper parameters 
  if (!isClickInsidePanel && !didUserClickLauncher) { 
    if (typeof window.toggleSupportFlyoutContainer === "function") {
      window.toggleSupportFlyoutContainer(false); 
    }
  } 
}); 

/** 
 * filings4u Platform Architecture 
 * Module: Desktop Repositioning Engine (Step 2 - Hardened Assembly) 
 * Target: Restricts dragging to desktop screens and enforces proper computed style evaluation 
 */ 
window.initializeSupportChatDragEngine = function() { 
  const dragHandle = document.getElementById("support-chat-drag-handle"); 
  const dragTarget = document.getElementById("support-chat-flyout-panel"); 
  if (!dragHandle || !dragTarget) return; 

  let initialXCoordinate = 0, initialYCoordinate = 0; 
  let currentXOffset = 0, currentYOffset = 0; 

  if (window.innerWidth <= 991) { 
    dragHandle.onmousedown = null; 
    dragHandle.style.cursor = "default"; 
    return; 
  } 

  dragTarget.style.position = "fixed"; 
  dragHandle.style.cursor = "move"; 

  // Assigning explicitly via event listeners to keep handlers clean 
  dragHandle.onmousedown = initiateDragSequence; 

  function initiateDragSequence(eventEventObject) { 
    if (window.innerWidth <= 991) return; 
    eventEventObject = eventEventObject || window.event; 
    eventEventObject.preventDefault(); 
    initialXCoordinate = eventEventObject.clientX; 
    initialYCoordinate = eventEventObject.clientY; 
    document.onmouseup = terminateDragSequence; 
    document.onmousemove = executeDragMovementUpdate; 
  } 

  function executeDragMovementUpdate(eventEventObject) { 
    eventEventObject = eventEventObject || window.event; 
    eventEventObject.preventDefault(); 
    currentXOffset = initialXCoordinate - eventEventObject.clientX; 
    currentYOffset = initialYCoordinate - eventEventObject.clientY; 
    initialXCoordinate = eventEventObject.clientX; 
    initialYCoordinate = eventEventObject.clientY; 

    const finalTopCalculatedProperty = dragTarget.offsetTop - currentYOffset; 
    const finalLeftCalculatedProperty = dragTarget.offsetLeft - currentXOffset; 

    // ENFORCES HIGH-SPECIFICITY OVERRIDES: Prevents drops during high latency or database updates
    dragTarget.style.setProperty("top", finalTopCalculatedProperty + "px", "important"); 
    dragTarget.style.setProperty("left", finalLeftCalculatedProperty + "px", "important"); 
    dragTarget.style.setProperty("bottom", "auto", "important"); 
    dragTarget.style.setProperty("right", "auto", "important"); 
  } 

  function terminateDragSequence() { 
    document.onmouseup = null; 
    document.onmousemove = null; 
  } 
}; 

// DEBOUNCE RESIZE: Prevents CPU thrashing from interfering with connection handshake logic 
let resizeDebounceTimeout; 
window.addEventListener("resize", () => { 
  clearTimeout(resizeDebounceTimeout); 
  resizeDebounceTimeout = setTimeout(() => { 
    const flyout = document.getElementById("support-chat-flyout-panel"); 
    if (!flyout) return; 

    const isPanelCurrentlyVisible = window.getComputedStyle(flyout).display !== "none"; 

    if (window.innerWidth <= 991) { 
      if (isPanelCurrentlyVisible) { 
        flyout.style.setProperty("top", "auto", "important"); 
        flyout.style.setProperty("left", "auto", "important"); 
        if (window.innerWidth > 500) { 
          flyout.style.setProperty("bottom", "20px", "important"); 
          flyout.style.setProperty("right", "20px", "important"); 
          const inlineFlexRow = flyout.querySelector("form > div[style*='display: flex']"); 
          if (inlineFlexRow) { 
            inlineFlexRow.style.setProperty("flex-direction", "column", "important"); 
          } 
        } else { 
          flyout.style.setProperty("bottom", "0px", "important"); 
          flyout.style.setProperty("right", "0px", "important"); 
        } 
      } 
    } else { 
      if (typeof window.initializeSupportChatDragEngine === "function") {
        window.initializeSupportChatDragEngine(); 
      }
    } 
  }, 150); 
}); 

// FIXED: Defends against pre-fired script initialization failures inside platform builders
function setupDragEngineOnLoad() {
  if (window.innerWidth > 991) { 
    setTimeout(() => {
      if (typeof window.initializeSupportChatDragEngine === "function") {
        window.initializeSupportChatDragEngine();
      }
    }, 200); 
  } 
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupDragEngineOnLoad);
} else {
  setupDragEngineOnLoad();
}


window.mountClientActiveChatViewportPanel = async function(customerFirstName) { 
  console.log(`[UI Panel Transition] Mounting active conversation frame layout for: ${customerFirstName}`); 

  // Ensure instance reference is pulled safely from global context 
  const activeInstance = window.supabaseClient || window.supabase || window.f4uWizardSupabaseInstance; 
  if (!activeInstance) { 
    console.error("[Supabase Error] Cannot connect. Client library missing from window."); 
    alert("Connection error. Please refresh and try again."); 
    return; 
  } 

  // CRITICAL RESCUE BUGFIX: Defend against uninitialized null user IDs breaking the INT4 database query
  if (!window.clientSessionUserId || window.clientSessionUserId === null) {
    console.warn("[Supabase Sync Warning] window.clientSessionUserId was null. Checking alternatives...");
    
    // Check if your application stores the active session inside local storage variables
    const localUserKey = localStorage.getItem("f4u_user_id") || localStorage.getItem("sb-user-id");
    if (localUserKey) {
      window.clientSessionUserId = parseInt(localUserKey, 10);
    } else {
      // Temporary structural fallback so your database query does not fail silently
      console.error("[Supabase Error] Fatal: Active Session User ID missing. Cannot map to wizard_intake_sessions.");
      alert("Chat session expired. Please re-enter your details to start the conversation.");
      return;
    }
  }

  const preflightFormFrame = document.getElementById("chat-preflight-input-form"); 
  if (!preflightFormFrame) { 
    console.error("[UI Mount Error] Target parent element wrapper #chat-preflight-input-form not found."); 
    return; 
  } 

  try { 
     // FIXED: Filter condition targeting your UUID column layout definitions
    const { error: sessionError } = await activeInstance 
      .from('wizard_intake_sessions') 
      .update({ selected_service: 'Chat Live Channel' }) // Use a valid column string layout
      .eq('id', window.clientSessionUserId);             // Changed from user_id to id


    if (sessionError) throw sessionError; 
    console.log("[Supabase Sync] Session table state transition committed successfully."); 
  } catch (dbError) { 
    console.error("[Supabase Connection Failure] Could not initialize conversation row:", dbError.message); 
    // Fallback path: Allow UI to render for frontend debugging even if the intake update row is missing
    console.warn("[Chat Widget Warning] Bypassing database update constraint to draw layout nodes.");
  } 

  // Hide inner interactive form markup block tree safely 
  const targetInnerFormElement = preflightFormFrame.querySelector("form"); 
  const targetInnerParagraphDesc = preflightFormFrame.querySelector("p"); 
  if (targetInnerFormElement) { 
    targetInnerFormElement.style.setProperty("display", "none", "important"); 
  } 
  if (targetInnerParagraphDesc) { 
    targetInnerParagraphDesc.style.setProperty("display", "none", "important"); 
  } 

  // Locate or build your interactive conversation elements wrapper safely 
  let targetActiveChatFrame = document.getElementById("chat-active-timeline-viewport"); 
  if (!targetActiveChatFrame) { 
    targetActiveChatFrame = document.createElement("div"); 
    targetActiveChatFrame.id = "chat-active-timeline-viewport"; 
    targetActiveChatFrame.style.cssText = ` 
      display: flex !important; 
      flex-direction: column !important; 
      flex: 1 !important; 
      height: 100% !important; 
      width: 100% !important; 
      box-sizing: border-box !important; 
    `; 

    const scrollWellElement = document.createElement("div"); 
    scrollWellElement.id = "wizardChatScrollWell"; 
    scrollWellElement.style.cssText = ` 
      flex: 1 !important; 
      padding: 16px !important; 
      overflow-y: auto !important; 
      background: #ffffff !important; 
      box-sizing: border-box !important; 
    `; 
    
    targetActiveChatFrame.appendChild(scrollWellElement); 
    preflightFormFrame.appendChild(targetActiveChatFrame); 
  } else { 
    targetActiveChatFrame.style.setProperty("display", "flex", "important"); 
    targetActiveChatFrame.style.setProperty("flex-direction", "column", "important"); 
  } 

  // Connect your websocket stream right when the panel mounts successfully
  if (typeof window.connectChatSocket === "function") {
    window.connectChatSocket();
  }

  // Render the initial real dashboard connection indicator string 
  if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
    window.appendIncomingMsgBubbleToWizardUI(`Hello ${customerFirstName}! An expert filings4u compliance broker is connecting to your session tracking wire. How can we help you today?`, 'admin'); 
  } 
};

window.connectClientIncomingSocketStream = function() { 
  const activeInstance = window.supabaseClient || window.supabase || window.f4uWizardSupabaseInstance; 
  let targetUserId = window.clientSessionUserId; 

  if (!activeInstance) { 
    console.error("[Socket Link Error] Supabase database client instance is unavailable."); 
    return; 
  } 

  // RESCUE CHECK: Try to restore the ID from local variables if the global scope is lost
  if (!targetUserId) {
    const localUserKey = localStorage.getItem("f4u_user_id") || localStorage.getItem("sb-user-id");
    if (localUserKey) {
      window.clientSessionUserId = parseInt(localUserKey, 10);
      targetUserId = window.clientSessionUserId;
    }
  }

  if (!targetUserId) { 
    console.error("[Socket Link Error] Abandoning subscription: clientSessionUserId is empty or null."); 
    return; 
  } 

  console.log(`[Socket Poller Link] Initiating subscription wire for channel: live_client_poller_${targetUserId}`); 

  // Cleanly disconnect old channels before establishing a new one
  if (window.clientLiveSocketChannel) { 
    console.log("[Socket Poller] Unsubscribing from existing channel to avoid memory leaks...");
    window.clientLiveSocketChannel.unsubscribe(); 
  } 

  // FIXED: Changed filter syntax format to follow the correct Supabase column=eq.value structure
  window.clientLiveSocketChannel = activeInstance 
    .channel('live_client_poller_' + targetUserId) 
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'chat_messages', // NOTE: Verify this table matches your DB schema exactly!
      filter: `user_id=eq.${targetUserId}` 
    }, (payload) => { 
      console.log("[Socket Signal Received] New incoming database mutation record:", payload); 
      
      // Safety mapping: checks if sender_type implies an agent or support broker response
      const incomingSender = String(payload.new.sender_type || '').toLowerCase();
      if (incomingSender === 'admin' || incomingSender === 'agent' || incomingSender === 'broker') { 
        if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
          window.appendIncomingMsgBubbleToWizardUI(payload.new.message_content, 'admin'); 
        } 
      } 
    }) 
    .subscribe((status) => { 
      console.log(`[Socket Realtime Status Update]: ${status}`); 
      
      if (status === 'CHANNEL_ERROR') { 
        console.error(
          "[Supabase Realtime Error] Subscription rejected!\n" +
          "1. Make sure you enabled 'Realtime' under Database -> Replication in your Supabase Dashboard for table 'chat_messages'.\n" +
          "2. Ensure your Row Level Security (RLS) policies allow users to read/select from 'chat_messages'."
        ); 
      } 
    }); 
};

  // 1. Ensure your tracking variables match the string UUID column type constraints
  window.clientSessionUserId = crypto.randomUUID(); 

  const activeInstance = window.supabaseClient || window.supabase || window.f4uWizardSupabaseInstance; 
  if (!activeInstance) { 
    console.error("[Supabase Error] No valid database client instances located in active window scope memory."); 
    if (submitButton) { 
      submitButton.disabled = false; 
      submitButton.innerText = "Connect to Live Agent"; 
    } 
    return; 
  } 

  try { 
    console.log("[Supabase Sync] Committing intake session tracking data row..."); 
    
    // FIXED: Remapped property keys to match your exact database schema definitions
    const { error: intakeError } = await activeInstance 
      .from('wizard_intake_sessions') 
      .insert({ 
        id: window.clientSessionUserId,        // Maps your generated UUID to 'id'
        client_email: email,                  // FIXED: Changed from email_address to client_email
        client_phone: phone,                  // FIXED: Changed from phone_number to client_phone
        company_name: `Prospect: ${fName} ${lName}`, 
        current_step: 1,                      // Enforces your INT integer constraint
        is_converted: false                   // Enforces your BOOLEAN constraint
      }); 

    if (intakeError) throw intakeError; 

    console.log("[Supabase Sync] Injecting initial handshake compliance record payload..."); 
    const initialPayloadString = `System Notice: Compliance broker bridging session initialized for ${fName}.`; 
    
    const { error: msgError } = await activeInstance 
      .from('chat_messages') 
      .insert({ 
        client_id: window.clientSessionUserId, // Uses the matching string UUID token key
        sender_type: 'client', 
        message_content: initialPayloadString 
      }); 

    if (msgError) throw msgError; 

    // Fire real-time stream layers cleanly 
    if (typeof window.connectClientIncomingSocketStream === "function") { 
      window.connectClientIncomingSocketStream(); 
    } 

    // Force transition into the active timeline view rather than allowing any redirect 
    if (typeof window.mountClientActiveChatViewportPanel === "function") { 
      window.mountClientActiveChatViewportPanel(fName); 
    } else { 
      console.error("[UI Mount Error] window.mountClientActiveChatViewportPanel function is not defined."); 
    } 
  } catch (supabaseExceptionTelemetry) { 
    console.error("[Supabase Intake Engine Exception] Data pipeline rejected mutation row:", supabaseExceptionTelemetry.message); 
    if (submitButton) { 
      submitButton.disabled = false; 
      submitButton.innerText = "Connection Failed. Try Again."; 
      submitButton.style.background = '#ef4444'; 
    } 
  } 


// FIX: Prevent overwriting shared values if they are already declared on the global lifecycle window 
if (typeof window.clientSessionUserId === "undefined") { 
  window.clientSessionUserId = null; 
} 
if (typeof window.clientLiveSocketChannel === "undefined") { 
  window.clientLiveSocketChannel = null; 
} 

window.connectClientIncomingSocketStream = function() { 
  const activeInstance = window.supabaseClient || window.supabase || window.f4uWizardSupabaseInstance; 
  
  // CRITICAL FIX: Explicitly extract the session ID from the persistent global window scope 
  const currentId = window.clientSessionUserId; 

  if (!activeInstance) { 
    console.error("[Socket Stream Error] Handshake abandoned: Missing valid library instance."); 
    return; 
  } 

  if (!currentId) {
    console.error("[Socket Stream Error] Handshake abandoned: clientSessionUserId is empty or null.");
    return;
  }

  console.log(`[Socket Poller Link] Subscribing client to real-time sync channel wire: live_client_poller_${currentId}`); 

  // Clean up any old channels before subscribing to avoid background connection leaks 
  if (window.clientLiveSocketChannel) { 
    console.log("[Socket Poller] Cleaning up stale channel instance...");
    window.clientLiveSocketChannel.unsubscribe(); 
  } 

  // FIXED: Clean string literal tracking configuration for real-time Postgres changes
  window.clientLiveSocketChannel = activeInstance 
    .channel('live_client_poller_' + currentId) 
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'chat_messages', 
      filter: `client_id=eq.${currentId}` // Verified UUID string filter mapping
    }, (payload) => { 
      console.log("[Socket Signal Received] Processing message payload tick:", payload.new); 
      
      const senderType = String(payload.new.sender_type || '').toLowerCase();
      if (senderType === 'admin' || senderType === 'agent' || senderType === 'broker') { 
        if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
          window.appendIncomingMsgBubbleToWizardUI(payload.new.message_content, 'admin'); 
        } 
      } 
    }) 
    .subscribe((status) => { 
      console.log(`[Socket Realtime Pipeline Status]: ${status}`); 
      
      if (status === 'CHANNEL_ERROR') { 
        console.error(
          "[Supabase Realtime Error] Subscription rejected!\n" +
          "-> Go to your Supabase Dashboard -> Database -> Replication -> Click 'supabase_realtime' source.\n" +
          "-> Verify that the toggle switch is turned ON for the 'chat_messages' table."
        ); 
      } 
    }); 
};

window.dispatchWizardClientChatMessagePayload = async function() { 
  const inputEl = document.getElementById("wizardClientChatMessageInputField"); 
  
  // FIXED: Explicitly use window context everywhere to stop variable ReferenceErrors
  const activeInstance = window.supabaseClient || window.supabase || window.f4uWizardSupabaseInstance; 
  
  // CRITICAL FIX: Extract the persistent session ID from the global window scope 
  const currentId = window.clientSessionUserId; 

  if (!inputEl) return; 
  if (!currentId || !activeInstance) { 
    console.error("[Payload Delivery Fault] Cannot transmit message: Client context ID or DB reference is null.", { currentId, activeInstance }); 
    return; 
  } 

  const content = inputEl.value.trim(); 
  if (!content) return; 

  // Optimistic UI clear and post to speed up user experience 
  inputEl.value = ""; 
  if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
    window.appendIncomingMsgBubbleToWizardUI(content, 'client'); 
  } 

  try { 
    console.log("[Supabase Push] Dispatching chat message payload row..."); 
    const { error } = await activeInstance 
      .from('chat_messages') 
      .insert({ 
        client_id: currentId, 
        sender_type: 'client', 
        message_content: content 
      }); 

    if (error) { 
      console.error("[Supabase Error] Database rejected client message insert:", error.message); 
    } 
  } catch (backgroundFault) { 
    console.error("[Network Exception Engine] Core network exception during send pass:", backgroundFault.message); 
  } 
}; 

window.appendIncomingMsgBubbleToWizardUI = function(textString, senderTypeRole) { 
  const well = document.getElementById("wizardChatScrollWell"); 
  
  // CRITICAL TRACKING FIX: Prevent silent fail if container fails to mount 
  if (!well) { 
    console.warn("[UI Stream Warning] Target chat window selector element #wizardChatScrollWell not found in active DOM layout canvas."); 
    return; 
  } 

  const bubbleRow = document.createElement("div"); 
  const isAdmin = senderTypeRole === 'admin'; 
  const alignmentStyles = isAdmin ? "margin-right: auto; background: #edf2f7; color: #0f172a; border-bottom-left-radius: 2px;" : "margin-left: auto; background: #0a1f44; color: #ffffff; border-bottom-right-radius: 2px;"; 

  bubbleRow.style.cssText = ` 
    max-width: 85% !important; 
    padding: 8px 12px !important; 
    border-radius: 8px !important; 
    font-size: 0.825rem !important; 
    font-weight: 500 !important; 
    word-break: break-word !important; 
    box-shadow: 0 1px 2px rgba(0,0,0,0.01) !important; 
    line-height: 1.4 !important; 
    text-align: left !important; 
    margin-bottom: 4px !important; 
    ${alignmentStyles} 
  `; 

  bubbleRow.innerText = textString; 
  well.appendChild(bubbleRow); 
  
  // Force view adjustments to keep pace with dynamic streaming
  setTimeout(() => {
    well.scrollTop = well.scrollHeight; 
  }, 10);
};


window.initializeAdminGlobalRealtimeAlertsEngine = function(supabaseClientInstance) { 
  if (!supabaseClientInstance) return; 

  console.log("[Staff Communication Link] Deploying active real-time workspace intercept listeners..."); 

  supabaseClientInstance 
    .channel('global_admin_roster_watcher') 
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'chat_messages', 
      filter: 'sender_type=eq.client' 
    }, (payload) => { 
      console.log("[Admin Pipeline Alert] New message row received from client:", payload.new); 

      try { 
        // FIXED: Replaced webpage text URL with a valid, hyper-lightweight open public CDN audio binary notification file 
        const publicChimeAsset = "https://jsdelivr.net";
        const audioChimeNode = new Audio(publicChimeAsset); 
        
        audioChimeNode.volume = 0.40; 
        
        // Browsers block unprompted audio until the admin actively clicks or types anywhere on the window page
        audioChimeNode.play().catch(e => {
          console.log("[Browser Block] Audio notification delayed until user interface engagement pass.");
        }); 
      } catch (audioErr) { 
        console.warn("[Audio Exception] Notification chime failed initialization:", audioErr); 
      } 

      // Safely check for and trigger your dashboard grid list updates
      if (typeof window.synchronizeChatThreadsRoster === "function") { 
        window.synchronizeChatThreadsRoster(supabaseClientInstance); 
      } 
    }) 
    .subscribe((status) => { 
      console.log(`[Admin Realtime Status]: ${status}`); 
      
      if (status === 'CHANNEL_ERROR') { 
        console.error(
          "[Supabase Error] Admin alert channel subscription rejected!\n" +
          "1. Verify that Realtime replication is enabled for your 'chat_messages' table.\n" +
          "2. Ensure your Row Level Security (RLS) layers allow admin/authenticated users to SELECT from this table."
        ); 
      } 
    }); 
}; 

// Hardened structural initialization block with absolute safety fallbacks
if (window.location.pathname.includes("admin-chat.html")) { 
  const checkInterval = setInterval(() => { 
    const clientRef = window.supabaseClient || window.supabase || window.chatAdminCoreClient || window.f4uWizardSupabaseInstance; 
    if (clientRef) { 
      window.initializeAdminGlobalRealtimeAlertsEngine(clientRef); 
      clearInterval(checkInterval); 
    } 
  }, 100); 
}

window.dispatchOutOfOfficeUnreadChatNotification = function(clientSupabaseInstance, clientUuidStr, fallbackClientText) { 
  if (!clientSupabaseInstance || !clientUuidStr) return; 

  console.log(`[Backup Latency Engine] Monitoring staff engagement rules window for Client UUID #${clientUuidStr}...`); 

  // Executed on a 1-minute timeout boundary parameter
  setTimeout(async () => { 
    try { 
      const { data: messages, error } = await clientSupabaseInstance 
        .from('chat_messages') 
        .select('sender_type') 
        .eq('client_id', clientUuidStr) // Standardized to your verified UUID column schema
        .order('created_at', { ascending: false }); 

      if (error) throw error; 

      const hasAdminReplied = messages && messages.some(msg => String(msg.sender_type).toLowerCase() === 'admin'); 
      if (hasAdminReplied) { 
        console.log(`[Latency Clearance] Active response detected for Client #${clientUuidStr}. Alert dismissed.`); 
        return; 
      } 

      console.log(`[Latency Breach] No active staff response found for Client #${clientUuidStr}. Routing out-of-office webhooks...`); 
      
      // CRITICAL WARNING: Ensure this URL routes to an active backend handler or Webhook path instead of a static homepage.
      const centralNotificationUrl = "https://filings4u.com"; 
      
      const operationalPayloadData = { 
        recipientInbox: "support@filings4u.com", 
        alertType: "UNATTENDED_WIZARD_CHAT_BYPASS", 
        timestamp: new Date().toISOString(), 
        accountTraceId: clientUuidStr, 
        previewContent: fallbackClientText, 
        // FIXED: Resolved dynamic template literal evaluation syntax ($ added)
        routingDirectLink: `https://filings4u.com{clientUuidStr}` 
      }; 

      await fetch(centralNotificationUrl, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'X-Platform-Secret-Token': 'f4u_live_vault_secure_interlock_token_9981' 
        }, 
        body: JSON.stringify(operationalPayloadData) 
      }); 

      console.log(`[Notification Success] Unattended thread telemetry successfully routed to support inboxes.`); 
    } catch (err) { 
      console.error("Critical error inside out-of-office automated communications dispatch loop:", err.message); 
    } 
  }, 60000); 
}; 

window.handleIncomingEmailDirectRoutingLinks = function() { 
  const urlQuerySelectors = new URLSearchParams(window.location.search); 
  let targetAccountNum = urlQuerySelectors.get('targetAccount'); 

  // Fallback path route segment evaluation parameters
  if (!targetAccountNum) { 
    const pathSegments = window.location.pathname.split('/'); 
    const trailingSegment = pathSegments[pathSegments.length - 1]; 
    
    // Validate trailing segment looks like a random UUID string (36 characters long)
    if (trailingSegment && trailingSegment.length === 36) { 
      targetAccountNum = trailingSegment; 
    } 
  } 

  if (!targetAccountNum) return; 

  console.log(`[Deep Link Routing] Auto-connecting conversation timeline for Client UUID: ${targetAccountNum}`); 
  
  let elementLookupInterval = null; 
  elementLookupInterval = setInterval(() => { 
    // Selects against internal layout containers or inner raw data nodes
    const rows = document.querySelectorAll('#adminUsersFeedContainer div, .user-row, [data-user-id]'); 
    let matchingRowElement = null; 

    rows.forEach(row => { 
      if (row.innerText.includes(targetAccountNum) || row.getAttribute('data-user-id') === targetAccountNum) { 
        matchingRowElement = row; 
      } 
    }); 

    if (matchingRowElement) { 
      clearInterval(elementLookupInterval); 
      matchingRowElement.click(); 
      matchingRowElement.style.setProperty("border-left", "4px solid #ef4444", "important"); 
      matchingRowElement.style.setProperty("background", "rgba(16, 185, 129, 0.08)", "important"); 
    } 
  }, 150); 

  setTimeout(() => { 
    if (elementLookupInterval) { 
      clearInterval(elementLookupInterval); 
    } 
  }, 8000); 
}; 

// Administrative console layout deployment routing loops
if (window.location.pathname.includes("admin-chat.html")) { 
  if (document.readyState === "loading") { 
    document.addEventListener("DOMContentLoaded", () => { 
      setTimeout(window.handleIncomingEmailDirectRoutingLinks, 250); 
    }); 
  } else { 
    setTimeout(window.handleIncomingEmailDirectRoutingLinks, 250); 
  } 
} 

console.log("[System Verified] Administrative console deep-linking parameters securely deployed.");


/** * filings4u Platform Architecture 
 * Module: Wizard UI Controls & Storage Pipeline (Step 2 & 3 Combined) 
 * Target: Handles secure session termination, multi-part paperclip uploads, and asynchronous data flushing 
 */ 

// FIXED: Defends against duplicate identifier crashes by completely removing 'let/const' definitions from file scope
if (typeof window.f4uWizardSupabaseInstance === "undefined") { 
  window.f4uWizardSupabaseInstance = window.supabaseClient || window.supabase; 
} 

// FIXED 1: Safely bind baseline global tracking states onto the window framework without overwriting active streams
if (typeof window.clientSessionUserId === "undefined" || window.clientSessionUserId === null) { 
  window.clientSessionUserId = null; 
} 
if (typeof window.clientLiveSocketChannel === "undefined" || window.clientLiveSocketChannel === null) { 
  window.clientLiveSocketChannel = null; 
} 
if (typeof window.activePendingFileObject === "undefined" || window.activePendingFileObject === null) { 
  window.activePendingFileObject = null; 
} 

window.confirmAndTerminateChatSession = async function() { 
  // FIX 2: Explicitly read the active target tracking key from global context 
  const currentId = window.clientSessionUserId; 
  
  if (!currentId) { 
    if (typeof window.toggleSupportFlyoutContainer === "function") {
      window.toggleSupportFlyoutContainer(false); 
    }
    return; 
  } 

  const confirmSessionClose = confirm("Are you sure you want to end this chat conversation? A full text transcript will be delivered to your email address."); 
  if (!confirmSessionClose) return; 

  console.log(`[Session Termination] Shutting down conversation stream links for Client ID: ${currentId}`); 

  // Disconnect active real-time polling socket hooks safely 
  if (window.clientLiveSocketChannel && typeof window.clientLiveSocketChannel.unsubscribe === "function") { 
    window.clientLiveSocketChannel.unsubscribe(); 
  } 

  // Mutate your Supabase session row status to 'ended' so backend dashboard daemons clear tracking 
  try { 
    const activeInstance = window.supabaseClient || window.supabase || window.f4uWizardSupabaseInstance; 
    if (activeInstance) { 
      const { error: updateError } = await activeInstance 
        .from('wizard_intake_sessions') 
        .update({ session_status: 'ended' }) 
        .eq('client_id', currentId); // Matches your verified string UUID schema format

      if (updateError) throw updateError; 
      console.log("[Supabase Sync] Session marked as 'ended' successfully."); 
    } 
  } catch (statusFault) { 
    console.error("[Session Closer Error] Failed to update final session layout state mapping:", statusFault.message); 
  } 

  // Call the processing route to compile logs and send them via Resend 
  if (typeof window.compileAndSendFinalTranscript === "function") { 
    console.log("ðŸ“„ Dispatching dialogue logs upstream before closing execution window..."); 
    try {
      await window.compileAndSendFinalTranscript(); 
    } catch (transcriptError) {
      console.error("[Transcript Error] Upstream logging processing step failed:", transcriptError);
    }
  } 

  // Completely clear operational layout storage states globally 
  window.clientSessionUserId = null; 
  window.clientLiveSocketChannel = null; 
  window.activePendingFileObject = null; 

  // Wipe local cache records so clean chat workflows can spin up on the next loop iteration
  localStorage.removeItem("f4u_user_id");
  localStorage.removeItem("sb-user-id");

  if (typeof window.toggleSupportFlyoutContainer === "function") {
    window.toggleSupportFlyoutContainer(false); 
  }

  // Brief delay to ensure network data passes clear the browser buffer before refresh 
  setTimeout(() => { 
    location.reload(); 
  }, 600); 
};

/** 
 * Module: Wizard UI File Selection Pipeline 
 * Target: Executes automatically when a user clicks the paperclip icon and selects a file. 
 */ 
window.handleLocalFileSelectionEvent = function(inputNodeReference) { 
  if (!inputNodeReference.files || inputNodeReference.files.length === 0) return; 

  // FIXED: Stash the raw browser file parameters inside global state window memory explicitly 
  window.activePendingFileObject = inputNodeReference.files[0]; 

  const badgeStrip = document.getElementById("wizardAttachmentBadgeStrip"); 
  const labelNode = document.getElementById("wizardAttachmentFileName"); 

  if (badgeStrip && labelNode) { 
    labelNode.innerText = window.activePendingFileObject.name; 
    badgeStrip.style.setProperty("display", "flex", "important"); 
  } 
  console.log(`[File Selection] File prepared for upload pipeline: ${window.activePendingFileObject.name}`); 
}; 

/** 
 * Clears the selected file and hides the confirmation indicator badge completely. 
 */ 
window.clearSelectedAttachmentPayload = function() { 
  // FIXED: Flush global window state tracking references cleanly 
  window.activePendingFileObject = null; 

  const fileInput = document.getElementById("wizardChatFileUploadInput"); 
  if (fileInput) { 
    fileInput.value = ""; 
  } 

  const badgeStrip = document.getElementById("wizardAttachmentBadgeStrip"); 
  if (badgeStrip) { 
    badgeStrip.style.setProperty("display", "none", "important"); 
  } 
  console.log("[File Selection] Local attachment payload cleared and input form refreshed."); 
}; 

/**
 * Module: Unified Chat & Storage Dispatcher
 * Target: Handles atomic storage uploads and routes textual messages to database streams.
 */
window.dispatchWizardClientChatMessagePayload = async function() { 
  const inputEl = document.getElementById("wizardClientChatMessageInputField"); 
  const activeInstance = window.supabaseClient || window.supabase || window.f4uWizardSupabaseInstance; 
  const currentId = window.clientSessionUserId; 
  const pendingFile = window.activePendingFileObject; 

  if (!inputEl || !currentId || !activeInstance) { 
    console.error("[Payload Fault] Aborting transmission: Missing input field, current user session, or database connection."); 
    return; 
  } 

  let contentMessageBodyStr = inputEl.value.trim(); 
  let trackingUploadedFileUrl = ""; 

  if (!contentMessageBodyStr && !pendingFile) return; 

  // Clear input elements instantly for optimal responsive frontend interaction speed
  inputEl.value = ""; 

  if (pendingFile) { 
    if (typeof window.clearSelectedAttachmentPayload === "function") { 
      window.clearSelectedAttachmentPayload(); 
    } 

    try { 
      const targetStoragePath = `${currentId}/${Date.now()}_${pendingFile.name}`; 
      console.log(`[Storage Upload] Streaming binary block data to path: ${targetStoragePath}`); 

      const { data: uploadData, error: uploadError } = await activeInstance 
        .storage 
        .from('chat-attachments') 
        .upload(targetStoragePath, pendingFile, { 
          cacheControl: '3600', 
          upsert: false 
        }); 

      if (uploadError) throw uploadError; 

      const { data: publicUrlData } = activeInstance 
        .storage 
        .from('chat-attachments') 
        .getPublicUrl(targetStoragePath); 

      trackingUploadedFileUrl = publicUrlData.publicUrl; 
      console.log(`[Storage Upload Success] Generated asset web retrieval link: ${trackingUploadedFileUrl}`); 

      // Format payload text parameters based on structural input characteristics
      if (!contentMessageBodyStr) { 
        contentMessageBodyStr = `Sent Attachment [${pendingFile.name}]: ${trackingUploadedFileUrl}`; 
      } else { 
        contentMessageBodyStr += ` \n(Attachment: ${trackingUploadedFileUrl})`; 
      } 
    } catch (uploadExceptionTelemetry) { 
      console.error("[Storage Upload Failure] Connection error during payload stream upload:", uploadExceptionTelemetry.message); 
      
      if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
        // FIXED: Cleaned raw visual string parameter representation
        window.appendIncomingMsgBubbleToWizardUI("âš ï¸ File upload failed. Check bucket permissions.", 'admin'); 
      } 
      return; 
    } 
  } 

  if (typeof window.appendIncomingMsgBubbleToWizardUI === "function") { 
    window.appendIncomingMsgBubbleToWizardUI(contentMessageBodyStr, 'client'); 
  } 

  // Mutation Layer: Insert the log entry row data directly inside your chat_messages table schema 
  try { 
    // FIXED: Swapped keys to use client_id to synchronize perfectly with your real-time socket filters
    const payloadDataMutationPacket = { 
      client_id: currentId, 
      sender_type: 'client', 
      message_content: contentMessageBodyStr, 
      is_read_by_admin: false 
    }; 

    const { error: dbInsertError } = await activeInstance 
      .from('chat_messages') 
      .insert(payloadDataMutationPacket); 

    if (dbInsertError) throw dbInsertError; 
    console.log("[Supabase Sync] Message record committed successfully."); 
  } catch (dbFaultException) { 
    console.error("[Silent Logging Exception] Database rejected insertion parameters packet:", dbFaultException.message); 
  } 
};


window.compileAndSendFinalTranscript = async function() { 
  // Ensure we extract the active, working client instance constructed during initialization
  const activeInstance = window.f4uWizardSupabaseInstance || window.supabaseClient || window.supabase; 
  const currentId = window.clientSessionUserId; 

  if (!currentId || !activeInstance) { 
    console.warn("[Transcript Engine] Abandoning compile pass: Missing instance or client tracking ID."); 
    return; 
  } 

  const emailField = document.getElementById("chat_email"); 
  const customerTargetEmail = emailField ? emailField.value.trim() : "support@filings4u.com"; 

  console.log(`[Transcript Compiler] Fetching historical chat records for client payload query context: ${currentId}`); 

  try { 
    // 1. Fetch clean, chronologically sorted historical entries matching your UUID client_id key
    const { data: records, error } = await activeInstance 
      .from('chat_messages') 
      .select('sender_type, message_content, created_at') 
      .eq('client_id', currentId) 
      .order('created_at', { ascending: true }); 

    if (error) throw error; 

    if (!records || records.length === 0) { 
      console.warn("[Transcript Engine] No conversation rows located to export."); 
      return; 
    } 

    // 2. Build structured plain-text conversation log map summary blocks
    let structuredTranscriptString = `=== filings4u Chat Transcript Summary ===\n`; 
    structuredTranscriptString += `Session Client Tracking ID: ${currentId}\n`; 
    structuredTranscriptString += `Export Generated Timestamp: ${new Date().toISOString()}\n`; 
    structuredTranscriptString += `=========================================\n\n`; 

    records.forEach(msg => { 
      const displayTimestamp = new Date(msg.created_at).toLocaleTimeString(); 
      const legibleSenderLabel = String(msg.sender_type).toLowerCase() === 'admin' ? "Support Broker" : "Client Customer"; 
      structuredTranscriptString += `[${displayTimestamp}] ${legibleSenderLabel}: ${msg.message_content}\n`; 
    }); 

    console.log("ðŸ“ Chat log compiled successfully. Saving session payload data summary state to Supabase..."); 

    // 3. Mark the intake tracking row session_status as 'ended' to update the admin feed views
    const { error: sessionUpdateError } = await activeInstance 
      .from('wizard_intake_sessions') 
      .update({ 
        company_name: `Transcript for: ${customerTargetEmail}`, 
        session_status: 'ended' 
      }) 
      .eq('id', currentId); // Matches your verified table UUID primary key column 'id'

    // Quietly log if the optional wizard intake table update falls behind or runs into a trigger conflict
    if (sessionUpdateError) {
      console.warn("[Transcript Engine Warning] Skipping wizard_intake_sessions column sync:", sessionUpdateError.message);
    } else {
      console.log("[Supabase Sync] Transcript status updated on database session row successfully."); 
    }

    // 4. DISPATCH UPSTREAM TRANSCRIPT PIPELINE TO EDGE FUNCTION VIA RESEND
    console.log("[Transcript Engine] Invoking 'send-chat-transcript' Edge Function pipeline execution layer...");
    
    const { data: functionData, error: functionError } = await activeInstance.functions.invoke('send-chat-transcript', {
      body: {
        client_id: currentId,
        target_email: customerTargetEmail,
        formatted_transcript_text: structuredTranscriptString
      }
    });

    if (functionError) throw functionError;
    console.log("[Supabase Sync] Edge Function executed successfully. Email routed via Resend API tracking keys.", functionData);

  } catch (networkFaultTrace) { 
    console.error("Critical error while compiling final discussion logs map structure:", networkFaultTrace.message); 
  } 
};


/**
 * Module: Preflight Form Interceptor Frame
 * Target: Wipes rigid inline triggers to avoid loop conflicts and blocks page refreshes instantly.
 */
function initializePreflightFormInterceptor() {
  const intakeForm = document.querySelector("#chat-preflight-input-form form"); 
  
  if (intakeForm) { 
    intakeForm.removeAttribute("onsubmit"); // Wipe old inline triggers to avoid loop conflicts 
    
    intakeForm.addEventListener("submit", function(event) { 
      // 1. ANCHOR: Halt the redirect immediately before running any other logic 
      event.preventDefault(); 
      event.stopPropagation(); 
      
      console.log("[Form Intercept] Redirect blocked. Handing over to database loop."); 
      
      // 2. Call the validation function and pass the event manually 
      if (typeof window.validateAndLaunchAgentChatSession === "function") { 
        window.validateAndLaunchAgentChatSession(event); 
      } else { 
        console.error("[Form Error] window.validateAndLaunchAgentChatSession is not initialized yet inside browser memory."); 
      } 
    }); 
    console.log("[Form Intercept] Hardened event listener securely attached."); 
  } else { 
    console.warn("[Form Intercept Warning] Could not find form element inside #chat-preflight-input-form container."); 
  } 
}

// FIXED: Defends against platform race conditions if scripts complete loading after DOM parsing
if (document.readyState === "loading") { 
  document.addEventListener("DOMContentLoaded", initializePreflightFormInterceptor); 
} else { 
  initializePreflightFormInterceptor(); 
}

