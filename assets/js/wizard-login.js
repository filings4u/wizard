(function(){
"use strict";
const $=s=>document.querySelector(s),esc=v=>window.F4UWizard?.esc?.(v)||String(v||"");
function showLoggedIn(user){
 const b=document.getElementById("f4u-wizard-login-button");
 if(!b)return;
 const meta=user?.user_metadata||{};
 const first=meta.first_name||meta.firstName||"";
 const last=meta.last_name||meta.lastName||"";
 const name=(first+" "+last).trim()||user?.email||"Customer";
 b.classList.add("is-authenticated");
 b.disabled=true;
 b.setAttribute("aria-label",`Logged in as ${name}`);
 b.innerHTML=`<span class="wizard-floating-tool__icon">✓</span><span class="wizard-floating-tool__text"><strong>Logged in</strong><small>${esc(name)}</small></span>`;
 window.__F4U_WIZARD_EXPLICIT_LOGIN=true;
}
function modal(){
 if(document.getElementById("f4u-wizard-login-modal"))return;
 const root=document.createElement("div");root.id="f4u-wizard-login-modal";root.className="f4u-brand-modal";
 root.innerHTML=`<div class="f4u-brand-modal__backdrop" data-login-close></div><section class="f4u-brand-modal__card f4u-login-card" role="dialog" aria-modal="true"><button class="f4u-brand-modal__close" type="button" data-login-close>×</button><span class="f4u-brand-modal__kicker">filings4u Secure Wizard</span><h2>Log in & resume</h2><p class="f4u-modal-intro">Log in with the email address and password on your filings4u account. If a saved application exists, we’ll restore it automatically.</p><div id="f4u-login-status"></div><form id="f4u-wizard-login-form" novalidate><label>Email address *</label><input id="f4u-login-email" type="email" class="wizard-input-field" required autocomplete="email"><label>Password *</label><input id="f4u-login-password" type="password" class="wizard-input-field" required autocomplete="current-password"><div class="f4u-brand-modal__actions"><button type="button" class="btn-wizard-secondary" data-login-close>Cancel</button><button class="btn-wizard-main" type="submit">Log In</button></div></form></section>`;
 document.body.appendChild(root);root.querySelectorAll("[data-login-close]").forEach(x=>x.onclick=()=>root.remove());root.querySelector("form").onsubmit=login;
}
async function login(e){
 e.preventDefault();const sb=window.f4uSupabase||window.supabaseClientInstance,status=$("#f4u-login-status"),btn=e.submitter,email=$("#f4u-login-email").value.trim().toLowerCase(),password=$("#f4u-login-password").value;
 if(!sb){status.innerHTML='<div class="f4u-modal-status f4u-modal-status--error">Secure login is not ready. Please try again.</div>';return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!password){status.innerHTML='<div class="f4u-modal-status f4u-modal-status--error">Enter the email address and password for your filings4u account.</div>';return;}
 btn.disabled=true;btn.textContent="Checking account…";
 try{
  const {data,error}=await sb.auth.signInWithPassword({email,password});
  if(error||!data?.session||!data?.user)throw new Error("We could not verify a filings4u account with that email and password.");
  const {data:verified,error:verifyError}=await sb.auth.getUser(data.session.access_token),authUser=verified?.user;
  if(verifyError||!authUser?.id||String(authUser.email||"").toLowerCase()!==email){try{await sb.auth.signOut();}catch(_){}throw new Error("We could not verify a filings4u account with that email and password.");}
  const uid=authUser.id;showLoggedIn(authUser);let restored=false;
  const {data:lead}=await sb.from("wizard_abandoned_leads").select("*").eq("auth_user_id",uid).order("updated_at",{ascending:false}).limit(1).maybeSingle();
  if(lead?.progress_payload){const w=window.F4UWizard,p=lead.progress_payload;w.state.answers={...(p.answers||{})};w.state.addons=[...(p.addons||[])];w.state.authorization={...(p.authorization||{})};w.state.currentStep=Math.min(8,Math.max(1,Number(lead.current_step)||1));w.state.jurisdiction=w.stateName?.(lead.jurisdiction_state)||lead.jurisdiction_state||"";w.persist();const url=new URL(location.href);if(lead.service_key)url.searchParams.set("service",lead.service_key);if(lead.plan_tier)url.searchParams.set("plan",lead.plan_tier);if(w.state.jurisdiction)url.searchParams.set("state",w.state.jurisdiction);history.replaceState({},"",url.pathname+"?"+url.searchParams.toString());restored=true;}
  else{const {data:profile}=await sb.from("client_profiles").select("*").eq("id",uid).maybeSingle();if(profile){const a=window.F4UWizard.state.answers;a.first_name=profile.first_name||a.first_name||"";a.last_name=profile.last_name||a.last_name||"";a.email_address=profile.email_address||email;a.phone_number=profile.phone_number||a.phone_number||"";a.street_address=profile.street_address||a.street_address||"";a.city=profile.city||a.city||"";a.state=window.F4UWizard.stateName?.(profile.state)||profile.state||a.state||"";a.zip_code=profile.zip_code||a.zip_code||"";window.F4UWizard.persist();}}
  status.innerHTML=`<div class="f4u-modal-status f4u-modal-status--success"><strong>Account verified.</strong><span>${restored?"Your saved application has been restored.":"Your customer profile is ready."}</span></div>`;document.getElementById("f4u-wizard-login-modal")?.remove();window.F4UWizard.go(restored?window.F4UWizard.state.currentStep:1);
 }catch(error){status.innerHTML=`<div class="f4u-modal-status f4u-modal-status--error">${esc(error.message||error)}</div>`;btn.disabled=false;btn.textContent="Log In";}
}
window.displayWizardLoginModal=modal;document.addEventListener("click",e=>{if(e.target.closest("#f4u-wizard-login-button")){e.preventDefault();modal();}},true);

window.addEventListener("pagehide",()=>{
 if(!window.__F4U_WIZARD_EXPLICIT_LOGIN)return;
 const sb=window.f4uSupabase||window.supabaseClientInstance;
 try{sb?.auth?.signOut?.({scope:"local"});}catch(_){}
 window.__F4U_WIZARD_EXPLICIT_LOGIN=false;
});

})();