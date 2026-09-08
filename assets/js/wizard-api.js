const CFG=window.F4U_WIZARD_CONFIG;
const TOKEN_KEY="f4u_wizard_v2_session_token";

function accessToken(){
  try{
    const keys=Object.keys(localStorage).filter(k=>k.startsWith("sb-")&&k.endsWith("-auth-token"));
    for(const key of keys){
      const raw=localStorage.getItem(key);
      if(!raw) continue;
      const parsed=JSON.parse(raw);
      const token=parsed?.access_token||parsed?.currentSession?.access_token;
      if(token) return token;
    }
  }catch(_){}
  return "";
}
async function callFunction(name,body,{auth=true}={}){
  const headers={"Content-Type":"application/json","apikey":CFG.supabasePublishableKey};
  const jwt=auth?accessToken():"";
  if(jwt) headers.Authorization=`Bearer ${jwt}`;
  const res=await fetch(`${CFG.functionsBaseUrl}/${name}`,{
    method:"POST",headers,body:JSON.stringify(body),cache:"no-store",credentials:"omit"
  });
  let data={}; try{data=await res.json();}catch(_){}
  if(!res.ok){const e=new Error(data.error||`Request failed (${res.status})`);e.code=data.error||"request_failed";e.status=res.status;e.data=data;throw e;}
  return data;
}
function setSessionToken(token){if(token) sessionStorage.setItem(TOKEN_KEY,token);}
function getSessionToken(){return sessionStorage.getItem(TOKEN_KEY)||"";}
function clearSessionToken(){sessionStorage.removeItem(TOKEN_KEY);}
export async function bootstrapService(service){return callFunction("wizard-v2-bootstrap",{service},{auth:false});}
export async function mintHandoff(payload){return callFunction("wizard-v2-handoff",{action:"mint",...payload});}
export async function consumeHandoff(token){const data=await callFunction("wizard-v2-session",{action:"consume",handoff_token:token});setSessionToken(data.session_token);return data;}
export async function resumeSession(){const token=getSessionToken();if(!token) throw new Error("No saved session.");return callFunction("wizard-v2-session",{action:"resume",session_token:token});}
export async function saveStep(step_key,answers){const token=getSessionToken();if(!token) throw new Error("No active session.");return callFunction("wizard-v2-session",{action:"save",session_token:token,step_key,answers});}
export async function createQuote(addon_keys=[]){const token=getSessionToken();if(!token) throw new Error("No active session.");return callFunction("wizard-v2-quote",{session_token:token,addon_keys});}
export {getSessionToken,clearSessionToken,accessToken};
