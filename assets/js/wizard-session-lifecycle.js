(function(){
"use strict";
const ENDPOINT="https://lrbimrlbskjweynxlgas.supabase.co/functions/v1/wizard-session-lifecycle";
const AWAY_KEY="f4u_wizard_left_at";
const RUNTIME_KEY="f4u_wizard_runtime_state_v1";
const SESSION_KEY="f4u_wizard_session_token";
const PAYMENT_KEY="f4u_verified_payment_result";
const COMPLETED_KEY="f4u_wizard_completed_at";
const FIVE_MINUTES=5*60*1000;
function sb(){return window.f4uSupabase||window.supabaseClientInstance||null;}
function clearRuntime(){
 sessionStorage.removeItem(RUNTIME_KEY);sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(PAYMENT_KEY);sessionStorage.removeItem(AWAY_KEY);sessionStorage.removeItem(COMPLETED_KEY);
 try{if(window.F4UWizard?.state){Object.assign(window.F4UWizard.state,{jurisdiction:"",addons:[],authorization:{},answers:{},verifiedPayment:null,currentStep:1,routeKey:"",checkout:null,__completionLifecycleDone:false});}}catch(_){}
}
async function serverEnd(token,reason){if(!token)return;try{await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_token:token,reason}),keepalive:true});}catch(_){} }
async function signOut(){const client=sb();if(!client)return;try{await client.auth.signOut({scope:"local"});}catch(_){try{await client.auth.signOut();}catch(__){}}}
window.endFilings4uWizardSession=async function(reason,options){
 const opts={signOut:false,clearState:true,...(options||{})},token=sessionStorage.getItem(SESSION_KEY);
 await Promise.allSettled([serverEnd(token,reason||"ended"),opts.signOut?signOut():Promise.resolve()]);
 if(opts.clearState)clearRuntime();else{sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(AWAY_KEY);}
};
const leftAt=Number(sessionStorage.getItem(AWAY_KEY)||0);
if(leftAt&&Date.now()-leftAt>=FIVE_MINUTES){
 const token=sessionStorage.getItem(SESSION_KEY);serverEnd(token,"away_timeout");signOut();clearRuntime();
 const u=new URL(location.href);u.searchParams.delete("state");history.replaceState({},"",u.pathname+"?"+u.searchParams.toString());
}
sessionStorage.removeItem(AWAY_KEY);
const completedAt=Number(sessionStorage.getItem(COMPLETED_KEY)||0);
if(completedAt){
 const completedRoute=location.pathname+location.search;
 history.replaceState({f4uCompleted:true},"",completedRoute);
 history.pushState({f4uFreshStart:true},"",completedRoute);
 window.addEventListener("popstate",()=>{clearRuntime();location.replace(location.pathname+location.search);},{once:true});
}

function markAway(){sessionStorage.setItem(AWAY_KEY,String(Date.now()));}
window.addEventListener("pagehide",markAway);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")markAway();else sessionStorage.removeItem(AWAY_KEY);});
})();
