(function(){
"use strict";

const $=(id)=>document.getElementById(id);
const CHAT_ENDPOINT="https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-guest-chat";
let clientId=null;
let chatToken=null;
let contact={};
let pollTimer=null;
let seenMessageIds=new Set();

function open(show){
  const panel=$("support-chat-flyout-panel");
  if(!panel)return;
  panel.style.setProperty("display",show?"flex":"none","important");
  requestAnimationFrame(()=>{
    panel.classList.toggle("is-open",!!show);
    panel.style.opacity=show?"1":"0";
    panel.style.transform=show?"translateY(0) scale(1)":"translateY(12px) scale(.985)";
  });
}

function notify(title,message,type="error"){
  window.F4UWizard?.notify?.(title,message,type);
}

function apiHeaders(){
  const anon=window.FILINGS4U_ENV?.SUPABASE_ANON_KEY||window.ENV_SUPABASE_ANON_KEY||"";
  return {
    "Content-Type":"application/json",
    ...(anon?{"apikey":anon,"Authorization":`Bearer ${anon}`}:{})
  };
}

async function callChat(body){
  const response=await fetch(CHAT_ENDPOINT,{
    method:"POST",
    headers:apiHeaders(),
    body:JSON.stringify(body)
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(payload.error||"Chat service is temporarily unavailable.");
  return payload;
}

function formatPhone(value){
  const digits=String(value||"").replace(/\D/g,"").slice(0,10);
  if(digits.length<=3)return digits;
  if(digits.length<=6)return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function bubble(text,who,time){
  const well=$("wizardChatScrollWell");
  if(!well)return;
  const row=document.createElement("div");
  row.className=`f4u-chat-message-row ${who==="client"?"is-client":"is-admin"}`;

  const wrap=document.createElement("div");
  wrap.className="f4u-chat-message-wrap";

  if(who!=="client"){
    const label=document.createElement("span");
    label.className="f4u-chat-message-label";
    label.textContent="filings4u Support";
    wrap.appendChild(label);
  }

  const msg=document.createElement("div");
  msg.className=`f4u-chat-message ${who==="client"?"is-client":"is-admin"}`;
  msg.textContent=text;
  wrap.appendChild(msg);

  const meta=document.createElement("span");
  meta.className="f4u-chat-message-time";
  const dt=time?new Date(time):new Date();
  meta.textContent=dt.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
  wrap.appendChild(meta);

  row.appendChild(wrap);
  well.appendChild(row);
  well.scrollTop=well.scrollHeight;
}

function renderChat(){
  const box=$("wizardChatDynamicInterfaceBox");
  if(!box)return;
  box.innerHTML=`
    <div class="f4u-chat-active">
      <div class="f4u-chat-statusbar">
        <span class="f4u-chat-online-dot" aria-hidden="true"></span>
        <div><strong>Conversation open</strong><small>A filings4u team member can reply here.</small></div>
      </div>
      <div id="wizardChatScrollWell" class="f4u-chat-scroll" aria-live="polite"></div>
      <form id="wizard-chat-message-form" class="f4u-chat-compose">
        <label class="sr-only" for="wizardClientChatMessageInputField">Type your message</label>
        <textarea id="wizardClientChatMessageInputField" rows="2" maxlength="4000" placeholder="Type your message…"></textarea>
        <button class="f4u-chat-send" type="submit" aria-label="Send message">
          <span>Send</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
        </button>
      </form>
      <div class="f4u-chat-privacy">Messages are securely stored with your support conversation.</div>
    </div>`;
  const endBtn=$("wizardHeaderEndChatBtn");
  if(endBtn)endBtn.style.display="inline-flex";
  $("wizard-chat-message-form")?.addEventListener("submit",send);
  bubble(`Hello ${contact.first}! Your message room is open. How can we help?`,"admin");
}

async function start(event){
  event.preventDefault();
  const first=String($("chat_first_name")?.value||"").trim();
  const last=String($("chat_last_name")?.value||"").trim();
  const phone=String($("chat_phone")?.value||"").trim();
  const email=String($("chat_email")?.value||"").trim().toLowerCase();
  const digits=phone.replace(/\D/g,"");
  const btn=$("f4uSubmitBtn");

  if(!first||!last||!email||!email.includes("@")||digits.length!==10){
    notify("Check your contact information","Enter your first and last name, a valid email address, and a 10-digit phone number.");
    return;
  }

  if(btn){btn.disabled=true;btn.textContent="Opening chat…";}
  try{
    const data=await callChat({action:"start",first_name:first,last_name:last,email,phone:formatPhone(phone)});
    clientId=data.client_id;
    chatToken=data.chat_token;
    contact={first,last,email,phone:formatPhone(phone)};
    sessionStorage.setItem("f4u_guest_chat",JSON.stringify({clientId,chatToken,contact}));
    renderChat();
    beginPolling();
  }catch(error){
    if(btn){btn.disabled=false;btn.textContent="Start secure chat";}
    notify("Chat connection failed",error.message||"Please try again.");
  }
}

async function send(event){
  event.preventDefault();
  const input=$("wizardClientChatMessageInputField");
  const text=String(input?.value||"").trim();
  if(!text||!clientId||!chatToken)return;
  const button=event.currentTarget?.querySelector("button[type='submit']");
  if(button)button.disabled=true;
  if(input)input.value="";
  bubble(text,"client");
  try{
    await callChat({action:"send",client_id:clientId,chat_token:chatToken,message:text});
  }catch(error){
    bubble("We couldn't send that message. Please try again.","admin");
    console.error("[Wizard Chat]",error);
  }finally{
    if(button)button.disabled=false;
    input?.focus();
  }
}

async function pollMessages(){
  if(!clientId||!chatToken)return;
  try{
    const data=await callChat({action:"list",client_id:clientId,chat_token:chatToken});
    (data.messages||[]).forEach((message)=>{
      const id=message.message_id||`${message.created_at}-${message.sender_type}-${message.message_content}`;
      if(seenMessageIds.has(id))return;
      seenMessageIds.add(id);
      if(String(message.sender_type).toLowerCase()==="admin"){
        bubble(message.message_content,"admin",message.created_at);
      }
    });
  }catch(error){
    console.warn("[Wizard Chat] poll failed",error);
  }
}

function beginPolling(){
  clearInterval(pollTimer);
  pollMessages();
  pollTimer=setInterval(pollMessages,4000);
}

function closeEndChatModal(){
  document.getElementById("f4u-end-chat-modal")?.remove();
}

function confirmEndChat(){
  if(document.getElementById("f4u-end-chat-modal"))return;

  const root=document.createElement("div");
  root.id="f4u-end-chat-modal";
  root.className="f4u-chat-confirm";
  root.innerHTML=`
    <div class="f4u-chat-confirm__backdrop" data-chat-confirm-close></div>
    <section class="f4u-chat-confirm__card" role="dialog" aria-modal="true" aria-labelledby="f4u-chat-confirm-title">
      <button type="button" class="f4u-chat-confirm__close" data-chat-confirm-close aria-label="Close">×</button>

      <div class="f4u-chat-confirm__icon" aria-hidden="true">?</div>
      <span class="f4u-chat-confirm__kicker">filings4u Support</span>
      <h2 id="f4u-chat-confirm-title">End this support chat?</h2>
      <p>
        This will close the current chat session. We’ll email a copy of the conversation
        to <strong>${esc(contact?.email||"the email address you entered")}</strong>.
      </p>

      <div id="f4u-chat-confirm-status"></div>

      <div class="f4u-chat-confirm__actions">
        <button type="button" class="f4u-chat-confirm__cancel" data-chat-confirm-close>Keep Chat Open</button>
        <button type="button" class="f4u-chat-confirm__end" id="f4u-chat-confirm-end">End Chat</button>
      </div>
    </section>`;

  document.body.appendChild(root);
  root.querySelectorAll("[data-chat-confirm-close]").forEach(el=>el.addEventListener("click",closeEndChatModal));
  root.querySelector("#f4u-chat-confirm-end")?.addEventListener("click",endConfirmed);
}

async function endConfirmed(){
  if(!clientId||!chatToken){closeEndChatModal();open(false);return;}

  const button=document.getElementById("f4u-chat-confirm-end");
  const status=document.getElementById("f4u-chat-confirm-status");

  if(button){
    button.disabled=true;
    button.textContent="Ending…";
  }

  try{
    const data=await callChat({action:"end",client_id:clientId,chat_token:chatToken});
    clearInterval(pollTimer);
    pollTimer=null;
    clientId=null;
    chatToken=null;
    contact={};
    seenMessageIds.clear();
    sessionStorage.removeItem("f4u_guest_chat");

    closeEndChatModal();
    open(false);

    notify(
      "Chat ended",
      data.email?`Your transcript was sent to ${data.email}.`:"Your chat session has been closed.",
      "success"
    );
  }catch(error){
    if(status){
      status.innerHTML=`<div class="f4u-chat-confirm__error">${esc(error.message||"Please try again.")}</div>`;
    }
    if(button){
      button.disabled=false;
      button.textContent="End Chat";
    }
  }
}

async function end(){
  if(!clientId||!chatToken){open(false);return;}
  confirmEndChat();
}

function restoreChat(){
  try{
    const saved=JSON.parse(sessionStorage.getItem("f4u_guest_chat")||"null");
    if(!saved?.clientId||!saved?.chatToken)return;
    clientId=saved.clientId;
    chatToken=saved.chatToken;
    contact=saved.contact||{};
    renderChat();
    beginPolling();
  }catch(_){/* ignore invalid storage */}
}

function wire(){
  $("f4uActiveIntakeForm")?.addEventListener("submit",start);
  const phone=$("chat_phone");
  if(phone){
    phone.setAttribute("inputmode","tel");
    phone.setAttribute("maxlength","14");
    phone.addEventListener("input",()=>{phone.value=formatPhone(phone.value);});
  }
  restoreChat();
}

document.addEventListener("click",event=>{
  const trigger=event.target.closest("[data-chat-action]");
  if(!trigger)return;
  const action=trigger.dataset.chatAction;
  if(action==="open")open(true);
  if(action==="close")open(false);
  if(action==="end")end();
});


document.addEventListener("keydown",event=>{
  if(event.key==="Escape" && document.getElementById("f4u-end-chat-modal")){
    closeEndChatModal();
  }
});

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",wire,{once:true});
else wire();
})();
