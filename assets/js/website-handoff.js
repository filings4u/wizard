const CFG=window.F4U_WIZARD_CONFIG;
const STATE_CODES=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

async function post(body){
  const res=await fetch(`${CFG.functionsBaseUrl}/wizard-v2-handoff`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":CFG.supabasePublishableKey},
    body:JSON.stringify(body),
    cache:"no-store",
    credentials:"omit"
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok){
    const error=new Error(data.message||data.error||"Unable to start application.");
    error.code=data.error||"handoff_failed";
    throw error;
  }
  return data;
}

function normalizeState(value){
  const state=String(value||"").trim().toUpperCase();
  return STATE_CODES.includes(state)?state:"";
}

function serviceRequiresState(service){
  if(service?.service_type) return service.service_type==="state";
  return service?.requires_jurisdiction===true;
}

function stateGate(serviceTitle="this service",selected=""){
  return new Promise(resolve=>{
    document.getElementById("f4u-state-gate")?.remove();
    const wrap=document.createElement("div");
    wrap.id="f4u-state-gate";
    wrap.className="f4u-state-gate";
    wrap.innerHTML=`
      <div class="f4u-state-gate__backdrop" data-close></div>
      <section class="f4u-state-gate__dialog" role="dialog" aria-modal="true" aria-labelledby="f4u-state-gate-title">
        <button type="button" class="f4u-state-gate__close" data-close aria-label="Close">×</button>
        <span class="f4u-state-gate__kicker">State filing service</span>
        <h2 id="f4u-state-gate-title">Select the filing state.</h2>
        <p>${serviceTitle} is priced and processed by jurisdiction. Choose the state where this filing applies before entering the secure application.</p>
        <label for="f4u-state-gate-select">Filing state</label>
        <select id="f4u-state-gate-select">
          <option value="">Select a state</option>
          ${STATE_CODES.map(code=>`<option value="${code}" ${selected===code?"selected":""}>${code}</option>`).join("")}
        </select>
        <small>Government and specialty services bypass this state gate.</small>
        <div class="f4u-state-gate__actions">
          <button type="button" class="f4u-state-gate__cancel" data-close>Cancel</button>
          <button type="button" class="f4u-state-gate__continue">Continue to secure application</button>
        </div>
      </section>`;
    document.body.appendChild(wrap);
    document.body.classList.add("f4u-state-gate-open");
    const select=wrap.querySelector("select");
    requestAnimationFrame(()=>select.focus());
    const finish=value=>{
      document.body.classList.remove("f4u-state-gate-open");
      wrap.remove();
      resolve(value);
    };
    wrap.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>finish("")));
    wrap.querySelector(".f4u-state-gate__continue").addEventListener("click",()=>{
      const value=normalizeState(select.value);
      if(!value){select.setAttribute("aria-invalid","true");select.focus();return;}
      finish(value);
    });
  });
}

export async function startWizardV2({service,plan,state="",returnUrl=location.href,entry="public",serviceMeta=null}){
  let selectedState=normalizeState(state);
  if(serviceRequiresState(serviceMeta) && !selectedState){
    selectedState=await stateGate(serviceMeta?.service_title||serviceMeta?.title||service);
    if(!selectedState) return {cancelled:true};
  }
  const result=await post({action:"mint",service,plan,state:selectedState,return_url:returnUrl,entry});
  const url=new URL(CFG.wizardUrl);
  url.searchParams.set("handoff",result.token);
  location.assign(url.toString());
  return result;
}

export function bindWizardV2Links(selector="[data-wizard-v2]"){
  document.querySelectorAll(selector).forEach(el=>{
    el.addEventListener("click",async ev=>{
      ev.preventDefault();
      el.disabled=true;
      try{
        await startWizardV2({
          service:el.dataset.service||document.body.dataset.wizardService,
          plan:el.dataset.plan,
          state:el.dataset.state||"",
          entry:el.dataset.entry||"public",
          serviceMeta:{
            service_type:el.dataset.serviceType||"",
            requires_jurisdiction:el.dataset.requiresJurisdiction==="true",
            service_title:el.dataset.serviceTitle||""
          }
        });
      }catch(error){
        console.error(error);
        alert(error.message||"We couldn't start the secure application. Please try again.");
      }finally{
        el.disabled=false;
      }
    });
  });
}
