/**
 * filings4u Wizard v2 secure handoff + state gate
 * MARKETING REPO ONLY.
 * State-priced services must select a state before a handoff can be minted.
 * Government/specialty services bypass the state gate.
 */
(function(){
  "use strict";

  const CONFIG = Object.freeze({
    wizardOrigin: "https://wizard.filings4u.com",
    wizardPath: "/wizard-v2.html",
    handoffEndpoint: "https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-v2-handoff",
    publishableKey: "sb_publishable_RlmqwQM8ATOc7-ML9hvwgw_UljUEavh",
    transitionMs: 75
  });

  const STATES = [
    ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],["DC","District of Columbia"]
  ];
  const STATE_CODES = new Set(STATES.map(x=>x[0]));
  let redirecting = false;
  let lastTrigger = null;

  const clean = value => String(value ?? "").trim();
  const slug = value => clean(value).toLowerCase().replace(/[_\s]+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"");
  const normalizeState = value => { const v=clean(value).toUpperCase(); return STATE_CODES.has(v)?v:""; };

  function contextFrom(trigger){
    const d=trigger?.dataset||{};
    return {
      service: slug(d.service||d.wizardService||d.serviceKey),
      plan: slug(d.plan||d.wizardPlan||d.planTier),
      state: normalizeState(d.state||d.stateCode||d.jurisdiction),
      serviceType: clean(d.serviceType).toLowerCase(),
      requiresJurisdiction: d.requiresJurisdiction === "true" || clean(d.serviceType).toLowerCase() === "state",
      serviceTitle: clean(d.serviceTitle) || "this service",
      entry: clean(d.entry||"public").toLowerCase()
    };
  }

  function returnUrl(){ const u=new URL(location.href); u.hash=""; return u.toString(); }

  function installStyles(){
    if(document.getElementById("f4u-v2-handoff-styles")) return;
    const style=document.createElement("style");
    style.id="f4u-v2-handoff-styles";
    style.textContent=`
      body.f4u-gate-open{overflow:hidden}
      #f4u-state-gate,#f4u-secure-handoff{position:fixed;inset:0;z-index:2147483647;font-family:Manrope,"DM Sans",Inter,system-ui,sans-serif}
      #f4u-state-gate{display:flex;align-items:center;justify-content:center;padding:22px}
      #f4u-state-gate .backdrop{position:absolute;inset:0;background:rgba(10,31,68,.62);backdrop-filter:blur(7px)}
      #f4u-state-gate .dialog{position:relative;width:min(94vw,520px);border:1px solid #dbe3ee;border-radius:22px;background:#fff;box-shadow:0 30px 90px rgba(10,31,68,.28);padding:32px}
      #f4u-state-gate .close{position:absolute;right:18px;top:15px;border:0;background:transparent;color:#64748b;font-size:28px;cursor:pointer}
      #f4u-state-gate .kicker{display:inline-block;margin-bottom:9px;color:#059669;font-size:12px;font-weight:900;letter-spacing:.09em;text-transform:uppercase}
      #f4u-state-gate h2{margin:0;color:#0a1f44;font-size:28px;line-height:1.18;letter-spacing:-.6px}
      #f4u-state-gate p{margin:12px 0 22px;color:#64748b;font-size:14px;line-height:1.65}
      #f4u-state-gate label{display:block;margin-bottom:8px;color:#0a1f44;font-size:13px;font-weight:850}
      #f4u-state-gate select{width:100%;height:52px;border:1px solid #cbd5e1;border-radius:11px;background:#fff;padding:0 14px;color:#0a1f44;font:inherit;outline:none}
      #f4u-state-gate select:focus{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.13)}
      #f4u-state-gate select[aria-invalid=true]{border-color:#dc2626}
      #f4u-state-gate .help{display:block;margin-top:9px;color:#64748b;font-size:12px;line-height:1.5}
      #f4u-state-gate .actions{display:grid;grid-template-columns:1fr 1.5fr;gap:10px;margin-top:24px}
      #f4u-state-gate button{min-height:48px;border-radius:10px;padding:10px 15px;font:inherit;font-weight:850;cursor:pointer}
      #f4u-state-gate .cancel{border:1px solid #cbd5e1;background:#fff;color:#0a1f44}
      #f4u-state-gate .continue{border:1px solid #10b981;background:#10b981;color:#fff}
      #f4u-state-gate .continue:hover{background:#059669;border-color:#059669}
      #f4u-secure-handoff{display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(10,31,68,.58);backdrop-filter:blur(7px);opacity:0;visibility:hidden;pointer-events:none;transition:.18s ease}
      #f4u-secure-handoff.is-open{opacity:1;visibility:visible;pointer-events:auto}
      #f4u-secure-handoff .card{width:min(92vw,430px);overflow:hidden;border:1px solid #dbe3ee;border-radius:18px;background:#fff;box-shadow:0 28px 80px rgba(10,31,68,.24);text-align:center}
      #f4u-secure-handoff .accent{height:5px;background:#10b981}
      #f4u-secure-handoff .body{padding:32px 30px 28px}
      #f4u-secure-handoff .brand{margin-bottom:22px;color:#0a1f44;font-size:28px;font-weight:900;letter-spacing:-1.15px}.brand span{color:#10b981}
      #f4u-secure-handoff .spinner{width:48px;height:48px;margin:0 auto 20px;border:4px solid #dfe7ef;border-top-color:#10b981;border-radius:50%;animation:f4uSpin .78s linear infinite}
      #f4u-secure-handoff .error-icon{display:none;width:54px;height:54px;margin:0 auto 18px;border-radius:50%;background:#fff1f2;color:#be123c;font-size:25px;font-weight:900;line-height:54px}
      #f4u-secure-handoff[data-state=error] .spinner{display:none}#f4u-secure-handoff[data-state=error] .error-icon{display:block}
      #f4u-secure-handoff h2{margin:0;color:#0a1f44;font-size:19px;line-height:1.35}#f4u-secure-handoff p{margin:8px auto 0;max-width:330px;color:#64748b;font-size:14px;line-height:1.6}
      #f4u-secure-handoff .detail{display:none;margin-top:16px;padding:11px 13px;border:1px solid #fecdd3;border-radius:9px;background:#fff7f8;color:#9f1239;font-size:12px;line-height:1.45;text-align:left;word-break:break-word}
      #f4u-secure-handoff[data-state=error] .detail{display:block}#f4u-secure-handoff .actions{display:none;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px}#f4u-secure-handoff[data-state=error] .actions{display:grid}
      #f4u-secure-handoff button{min-height:44px;border-radius:9px;padding:10px 15px;font:inherit;font-size:14px;font-weight:800;cursor:pointer}#f4u-handoff-retry{border:1px solid #10b981;background:#10b981;color:#fff}#f4u-handoff-close{border:1px solid #cbd5e1;background:#fff;color:#0a1f44}
      @keyframes f4uSpin{to{transform:rotate(360deg)}}
      @media(max-width:560px){#f4u-state-gate .dialog{padding:28px 20px 20px}#f4u-state-gate h2{font-size:24px}#f4u-state-gate .actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function stateGate(context){
    installStyles();
    return new Promise(resolve=>{
      document.getElementById("f4u-state-gate")?.remove();
      const el=document.createElement("div");
      el.id="f4u-state-gate";
      el.innerHTML=`<div class="backdrop" data-close></div><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="f4u-gate-title"><button type="button" class="close" data-close aria-label="Close">×</button><span class="kicker">State-priced service</span><h2 id="f4u-gate-title">Select the filing state.</h2><p>${context.serviceTitle} requires a filing jurisdiction. Choose the state where this service applies before entering the secure application.</p><label for="f4u-gate-state">Filing state</label><select id="f4u-gate-state"><option value="">Select a state</option>${STATES.map(([code,name])=>`<option value="${code}"${context.state===code?" selected":""}>${name}</option>`).join("")}</select><small class="help">Your state determines the filing jurisdiction and any applicable government filing fee. Government and specialty services skip this step.</small><div class="actions"><button type="button" class="cancel" data-close>Cancel</button><button type="button" class="continue">Continue to secure application</button></div></section>`;
      document.body.appendChild(el); document.body.classList.add("f4u-gate-open");
      const select=el.querySelector("select"); requestAnimationFrame(()=>select.focus());
      const finish=v=>{document.body.classList.remove("f4u-gate-open");el.remove();resolve(v)};
      el.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",()=>finish("")));
      el.querySelector(".continue").addEventListener("click",()=>{const state=normalizeState(select.value);if(!state){select.setAttribute("aria-invalid","true");select.focus();return}finish(state)});
    });
  }

  function overlay(){
    installStyles();
    let el=document.getElementById("f4u-secure-handoff"); if(el)return el;
    el=document.createElement("div");el.id="f4u-secure-handoff";el.innerHTML=`<div class="card"><div class="accent"></div><div class="body"><div class="brand">filings<span>4u</span></div><div class="spinner"></div><div class="error-icon">!</div><h2 id="f4u-handoff-title">Opening your secure application</h2><p id="f4u-handoff-message">Protecting your service, package, and filing information.</p><div class="detail" id="f4u-handoff-detail"></div><div class="actions"><button id="f4u-handoff-retry" type="button">Try again</button><button id="f4u-handoff-close" type="button">Close</button></div></div></div>`;document.body.appendChild(el);
    el.querySelector("#f4u-handoff-close").addEventListener("click",()=>{el.classList.remove("is-open");redirecting=false});
    el.querySelector("#f4u-handoff-retry").addEventListener("click",()=>lastTrigger&&enter(lastTrigger,true));
    return el;
  }

  function showLoading(){const el=overlay();el.dataset.state="loading";document.getElementById("f4u-handoff-title").textContent="Opening your secure application";document.getElementById("f4u-handoff-message").textContent="Protecting your service, package, and filing information.";document.getElementById("f4u-handoff-detail").textContent="";requestAnimationFrame(()=>el.classList.add("is-open"))}
  function showError(message){const el=overlay();el.dataset.state="error";el.classList.add("is-open");document.getElementById("f4u-handoff-title").textContent="We couldn't open the secure application";document.getElementById("f4u-handoff-message").textContent="Your selection is still safe. Please try again.";document.getElementById("f4u-handoff-detail").textContent=message||"The secure handoff did not complete."}

  async function mint(context){
    const res=await fetch(CONFIG.handoffEndpoint,{method:"POST",mode:"cors",credentials:"omit",cache:"no-store",headers:{"Content-Type":"application/json","apikey":CONFIG.publishableKey},body:JSON.stringify({action:"mint",service:context.service,plan:context.plan,state:context.state||null,entry:context.entry,return_url:returnUrl()})});
    const payload=await res.json().catch(()=>({})); if(!res.ok){const e=new Error(payload.message||payload.error||`Secure handoff returned HTTP ${res.status}.`);e.code=payload.error;throw e} if(!payload?.token)throw new Error("The secure handoff did not return an access token."); return payload;
  }

  async function enter(trigger,retry=false){
    if(redirecting&&!retry)return; lastTrigger=trigger; const context=contextFrom(trigger);
    if(!context.service||!context.plan){showError("This pricing option is missing its service or package information.");return}
    if(context.requiresJurisdiction&&!context.state){context.state=await stateGate(context);if(!context.state)return}
    if(!context.requiresJurisdiction) context.state="";
    redirecting=true;showLoading();
    try{const handoff=await mint(context);const destination=new URL(CONFIG.wizardPath,CONFIG.wizardOrigin);destination.searchParams.set("handoff",handoff.token);setTimeout(()=>location.assign(destination.toString()),CONFIG.transitionMs)}catch(error){redirecting=false;console.error("[filings4u] Wizard v2 handoff failed:",error);showError(error?.message)}
  }

  document.addEventListener("click",event=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const trigger=event.target?.closest?.("[data-wizard-handoff]");if(!trigger)return;event.preventDefault();enter(trigger)},true);
  window.F4UWizardHandoff=Object.freeze({enter});
})();
