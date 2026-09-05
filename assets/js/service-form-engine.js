(function(){
"use strict";
const api=window.F4UServiceForms=window.F4UServiceForms||{};
window.formRegistry=window.formRegistry||{};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const attr=v=>esc(v).replace(/`/g,"&#96;");
const stateOptions=html=>{const raw=String(html||"");return /value=["']["']/.test(raw)?raw:'<option value="">Select state</option>'+raw;};

function optionsHtml(options,states){
 if(options==="__STATES__") return stateOptions(states);
 return (Array.isArray(options)?options:[]).map(o=>{const a=Array.isArray(o)?o:[o,o];return `<option value="${attr(a[0])}">${esc(a[1])}</option>`}).join("");
}
function condAttrs(show){return show?` data-f4u-condition='${attr(JSON.stringify(show))}'`:"";}
function spanAttr(field){return ` data-f4u-span="${field.span==='full'?'full':'half'}"`;}

function inferredFormat(field){
 const id=String(field.id||"").toLowerCase();
 const label=String(field.label||"").toLowerCase();
 if(field.format)return field.format;
 if(/(^|_)(phone|telephone|mobile)(_|$)/.test(id)||/phone number|telephone|mobile phone/.test(label))return "phone";
 if(id==="tax_id"||/(^|_)(ein|federal_ein|employer_ein)(_|$)/.test(id)||/\bein\b/.test(label))return "ein";
 if(/(^|_)npi(_|$)/.test(id)||/\bnpi\b/.test(label))return "npi";
 if(/(^|_)(zip|zip_code|postal_code)(_|$)/.test(id)||/zip code|postal code/.test(label))return "zip";
 if(/(^|_)(usdot|usdot_number|dot_number)(_|$)/.test(id)||/usdot number/.test(label))return "usdot";
 if(/(^|_)(mc_number|mc_no)(_|$)/.test(id)||/mc number/.test(label))return "mc";
 if(/(^|_)(vin)(_|$)/.test(id)||/vehicle identification number|\bvin\b/.test(label))return "vin";
 return "";
}
function formatAttrs(kind){
 if(kind==="phone")return ' inputmode="tel" autocomplete="tel" maxlength="14" pattern="\\(\\d{3}\\) \\d{3}-\\d{4}" placeholder="(555) 555-5555"';
 if(kind==="ein")return ' inputmode="numeric" maxlength="10" pattern="\\d{2}-\\d{7}" placeholder="12-3456789"';
 if(kind==="npi")return ' inputmode="numeric" maxlength="10" placeholder="10 digits"';
 if(kind==="zip")return ' inputmode="numeric" maxlength="10" placeholder="12345 or 12345-6789"';
 if(kind==="usdot")return ' inputmode="numeric" maxlength="8" placeholder="USDOT number"';
 if(kind==="mc")return ' inputmode="numeric" maxlength="9" placeholder="MC-123456"';
 if(kind==="vin")return ' maxlength="17" autocapitalize="characters" placeholder="17-character VIN"';
 return "";
}
function fieldHtml(field,states){
 const id=field.id, req=field.required?' required':'', ph=field.placeholder?` placeholder="${attr(field.placeholder)}"`:'', extra=field.attrs?` ${field.attrs}`:'', condition=condAttrs(field.showWhen), help=field.help?`<small class="f4u-field-help">${esc(field.help)}</small>`:'';
 const span=spanAttr(field);
 if(field.type==='checkbox')return `<label class="f4u-choice-row f4u-schema-field"${span}${condition}><input type="checkbox" id="${attr(id)}" name="${attr(id)}"${field.checked?' checked':''}${req}><span><strong>${esc(field.label)}${field.required?' *':''}</strong>${help}</span></label>`;
 if(field.type==='radio')return `<div class="f4u-form-field f4u-schema-field"${span}${condition}><span class="f4u-field-label">${esc(field.label)}${field.required?' *':''}</span><div class="f4u-option-cards">${(field.options||[]).map((o,i)=>{const a=Array.isArray(o)?o:[o,o];return `<label class="f4u-option-card"><input type="radio" name="${attr(id)}" id="${attr(id)}_${i}" value="${attr(a[0])}"${req}><span><strong>${esc(a[1])}</strong></span></label>`}).join('')}</div>${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
 let control='';
 if(field.type==='select')control=`<select id="${attr(id)}" name="${attr(id)}" class="wizard-input-field"${req}${extra}><option value="">Select</option>${optionsHtml(field.options,states)}</select>`;
 else if(field.type==='textarea')control=`<textarea id="${attr(id)}" name="${attr(id)}" class="wizard-input-field"${req}${ph}${extra}></textarea>`;
 else {
   const kind=inferredFormat(field);
   control=`<input id="${attr(id)}" name="${attr(id)}" type="${attr(field.type||'text')}" class="wizard-input-field"${req}${ph}${field.value?` value="${attr(field.value)}"`:''}${extra}${kind?` data-f4u-format="${attr(kind)}"${formatAttrs(kind)}`:''}>`;
 }
 return `<div class="f4u-form-field f4u-schema-field"${span}${condition}><label for="${attr(id)}">${esc(field.label)}${field.required?' *':''}</label>${control}${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
}
function matches(root,c){
 if(!c)return true;
 if(Array.isArray(c.all))return c.all.every(x=>matches(root,x));
 if(Array.isArray(c.any))return c.any.some(x=>matches(root,x));
 const nodes=[...root.querySelectorAll(`[name="${CSS.escape(c.field)}"]`)];
 if(!nodes.length)return false;
 if(Object.prototype.hasOwnProperty.call(c,'checked'))return !!nodes[0].checked===!!c.checked;
 const node=nodes.find(n=>n.checked)||nodes[0];
 const value=node.type==='checkbox'?String(node.checked):String(node.value||'');
 if(Object.prototype.hasOwnProperty.call(c,'equals'))return value===String(c.equals);
 if(Object.prototype.hasOwnProperty.call(c,'notEquals'))return value!==String(c.notEquals);
 if(Array.isArray(c.in))return c.in.map(String).includes(value);
 if(Array.isArray(c.notIn))return !c.notIn.map(String).includes(value);
 return true;
}
function sync(root){
 root.querySelectorAll('[data-f4u-condition]').forEach(el=>{
   let c=null;try{c=JSON.parse(el.dataset.f4uCondition)}catch{}
   const show=matches(root,c);
   el.hidden=!show;
   el.style.display=show?'':'none';
   el.querySelectorAll('input,select,textarea').forEach(x=>{
     if(x.dataset.originalRequired===undefined)x.dataset.originalRequired=x.required?'1':'0';
     x.required=show&&x.dataset.originalRequired==='1';
     x.disabled=!show;
   });
 });
}
function formatValue(el){
 const kind=el.dataset.f4uFormat;
 if(!kind)return;
 let raw=String(el.value||'');
 if(kind==='phone'){
   const d=raw.replace(/\D/g,'').slice(0,10);
   el.value=d.length<=3?d:d.length<=6?`(${d.slice(0,3)}) ${d.slice(3)}`:`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
 }else if(kind==='ein'){
   const d=raw.replace(/\D/g,'').slice(0,9); el.value=d.length>2?`${d.slice(0,2)}-${d.slice(2)}`:d;
 }else if(kind==='npi')el.value=raw.replace(/\D/g,'').slice(0,10);
 else if(kind==='zip'){
   const d=raw.replace(/\D/g,'').slice(0,9);el.value=d.length>5?`${d.slice(0,5)}-${d.slice(5)}`:d;
 }else if(kind==='usdot')el.value=raw.replace(/\D/g,'').slice(0,8);
 else if(kind==='mc'){
   const d=raw.replace(/\D/g,'').slice(0,7);el.value=d?`MC-${d}`:'';
 }else if(kind==='vin')el.value=raw.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g,'').slice(0,17);
}
function validate(root){
 sync(root);let first=null,errors=[];const radios=new Set();
 root.querySelectorAll('[required]').forEach(el=>{
   if(el.disabled||el.closest('[hidden]'))return;
   let ok=true;
   if(el.type==='radio'){if(radios.has(el.name))return;radios.add(el.name);ok=!!root.querySelector(`input[name="${CSS.escape(el.name)}"]:checked`)}
   else if(el.type==='checkbox')ok=el.checked;
   else ok=!!String(el.value||'').trim();
   if(el.type==='email'&&el.value)ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
   if(el.dataset.f4uFormat==='ein'&&el.value)ok=el.value.replace(/\D/g,'').length===9;
   if(el.dataset.f4uFormat==='npi'&&el.value)ok=el.value.replace(/\D/g,'').length===10;
   if(el.dataset.f4uFormat==='phone'&&el.value)ok=el.value.replace(/\D/g,'').length===10;
   const target=el.type==='radio'?root.querySelector(`[name="${CSS.escape(el.name)}"]`):el;
   const err=root.querySelector(`#err_${CSS.escape(el.id||el.name)}`);
   if(!ok){target?.setAttribute('aria-invalid','true');if(err){err.textContent='Please enter a valid value for this required field.';err.style.display='block'}first=first||target;errors.push(el.id||el.name)}else{target?.removeAttribute('aria-invalid');if(err){err.textContent='';err.style.display='none'}}
 });
 if(first){first.focus?.({preventScroll:true});first.scrollIntoView?.({behavior:'smooth',block:'center'})}
 return {isValid:errors.length===0,errors};
}

api.sync=sync;
api.format=formatValue;
api.register=function(slug,config){
 window.formRegistry[`${slug}-form-master`]=function(states='',context={}){
   const jurisdiction=context.state||window.F4UWizard?.state?.route?.jurisdiction||'';
   const authority=config.authority||'Applicable filing authority';
   const tooltip=config.tooltip||`${config.title} is the filing or application selected for this order. The questions below collect the information filings4u needs to prepare this ${config.title.toLowerCase()} for ${authority}. Review each answer carefully because the information may be placed on the government filing.`;
   return `<div class="f4u-service-form f4u-schema-form" data-service-form="${attr(slug)}">
   <aside class="f4u-filing-tooltip"><span class="f4u-filing-tooltip__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 10.5v6"></path><path d="M12 7.3h.01"></path></svg></span><div><strong>What you are filing</strong><p>${esc(tooltip)}</p></div></aside>
   <div class="f4u-service-form__notice"><div class="f4u-service-form__notice-icon">✓</div><div><strong>${esc(config.title)}</strong><p>${esc(config.subtitle||'Complete the filing information below.')} ${jurisdiction?`Selected jurisdiction: ${esc(jurisdiction)}.`:''}</p></div></div>
   ${config.notice?`<div class="f4u-schema-notice"><strong>Important</strong><span>${esc(config.notice)}</span></div>`:''}
   <div class="f4u-agency-strip"><span>Prepared for</span><strong>${esc(authority)}</strong></div>
   ${(config.sections||[]).map((s,i)=>`<section class="f4u-form-section"${condAttrs(s.showWhen)}><div class="f4u-form-section__head"><span class="f4u-form-section__number">${i+1}</span><div><h3>${esc(s.title)}</h3>${s.description?`<p>${esc(s.description)}</p>`:''}</div></div><div class="f4u-form-section__body"><div class="f4u-field-grid f4u-field-grid--schema">${(s.fields||[]).map(x=>fieldHtml(x,states)).join('')}</div></div></section>`).join('')}</div>`;
 };
 window.formRegistry[`${slug}-validation-engine`]={validate(){const root=document.querySelector(`[data-service-form="${CSS.escape(slug)}"]`);return root?validate(root):{isValid:false,errors:['form_unavailable']}}};
};

document.addEventListener('change',e=>{const root=e.target.closest?.('.f4u-schema-form');if(root){formatValue(e.target);sync(root)}});
document.addEventListener('input',e=>{const root=e.target.closest?.('.f4u-schema-form');if(root){formatValue(e.target);sync(root)}});
new MutationObserver(()=>document.querySelectorAll('.f4u-schema-form').forEach(root=>{root.querySelectorAll('[data-f4u-format]').forEach(formatValue);sync(root)})).observe(document.documentElement,{childList:true,subtree:true});
})();
