(function(){
"use strict";
const api=window.F4UServiceForms=window.F4UServiceForms||{};
window.formRegistry=window.formRegistry||{};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const attr=v=>esc(v).replace(/`/g,"&#96;");
const stateOptions=html=>{const raw=String(html||"");return /value=[\"'][\"']/.test(raw)?raw:'<option value="">Select state</option>'+raw;};
function optionsHtml(options,states){
 if(options==="__STATES__") return stateOptions(states);
 return (Array.isArray(options)?options:[]).map(o=>{const a=Array.isArray(o)?o:[o,o];return `<option value="${attr(a[0])}">${esc(a[1])}</option>`}).join("");
}
function condAttrs(show){return show?` data-f4u-condition='${attr(JSON.stringify(show))}'`:"";}
function fieldHtml(field,states){
 const id=field.id, req=field.required?' required':'', ph=field.placeholder?` placeholder="${attr(field.placeholder)}"`:'', extra=field.attrs?` ${field.attrs}`:'', condition=condAttrs(field.showWhen), help=field.help?`<small class="f4u-field-help">${esc(field.help)}</small>`:'';
 if(field.type==='checkbox')return `<label class="f4u-choice-row f4u-schema-field"${condition}><input type="checkbox" id="${attr(id)}" name="${attr(id)}"${field.checked?' checked':''}${req}><span><strong>${esc(field.label)}${field.required?' *':''}</strong>${help}</span></label>`;
 if(field.type==='radio')return `<div class="f4u-form-field f4u-schema-field"${condition}><span class="f4u-field-label">${esc(field.label)}${field.required?' *':''}</span><div class="f4u-option-cards">${(field.options||[]).map((o,i)=>{const a=Array.isArray(o)?o:[o,o];return `<label class="f4u-option-card"><input type="radio" name="${attr(id)}" id="${attr(id)}_${i}" value="${attr(a[0])}"${req}><span><strong>${esc(a[1])}</strong></span></label>`}).join('')}</div>${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
 let control='';
 if(field.type==='select')control=`<select id="${attr(id)}" name="${attr(id)}" class="wizard-input-field"${req}${extra}><option value="">Select</option>${optionsHtml(field.options,states)}</select>`;
 else if(field.type==='textarea')control=`<textarea id="${attr(id)}" name="${attr(id)}" class="wizard-input-field"${req}${ph}${extra}></textarea>`;
 else control=`<input id="${attr(id)}" name="${attr(id)}" type="${attr(field.type||'text')}" class="wizard-input-field"${req}${ph}${field.value?` value="${attr(field.value)}"`:''}${extra}>`;
 return `<div class="f4u-form-field f4u-schema-field"${condition}><label for="${attr(id)}">${esc(field.label)}${field.required?' *':''}</label>${control}${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
}
function matches(root,c){
 if(!c)return true; const nodes=[...root.querySelectorAll(`[name="${CSS.escape(c.field)}"]`)]; if(!nodes.length)return false;
 if(Object.prototype.hasOwnProperty.call(c,'checked'))return !!nodes[0].checked===!!c.checked;
 const node=nodes.find(n=>n.checked)||nodes[0]; const value=node.type==='checkbox'?String(node.checked):String(node.value||'');
 if(Object.prototype.hasOwnProperty.call(c,'equals'))return value===String(c.equals);
 if(Object.prototype.hasOwnProperty.call(c,'notEquals'))return value!==String(c.notEquals);
 if(Array.isArray(c.in))return c.in.map(String).includes(value);
 return true;
}
function sync(root){root.querySelectorAll('[data-f4u-condition]').forEach(el=>{let c=null;try{c=JSON.parse(el.dataset.f4uCondition)}catch{} const show=matches(root,c);el.hidden=!show;el.style.display=show?'':'none';el.querySelectorAll('input,select,textarea').forEach(x=>{if(!show){x.dataset.wasRequired=x.required?'1':'';x.required=false}else if(x.dataset.wasRequired==='1'){x.required=true;delete x.dataset.wasRequired}});});}
function validate(root){sync(root);let first=null,errors=[];const radios=new Set();root.querySelectorAll('[required]').forEach(el=>{if(el.closest('[hidden]'))return;let ok=true;if(el.type==='radio'){if(radios.has(el.name))return;radios.add(el.name);ok=!!root.querySelector(`input[name="${CSS.escape(el.name)}"]:checked`)}else if(el.type==='checkbox')ok=el.checked;else ok=!!String(el.value||'').trim();if(el.type==='email'&&el.value)ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());const target=el.type==='radio'?root.querySelector(`[name="${CSS.escape(el.name)}"]`):el;const err=root.querySelector(`#err_${CSS.escape(el.id||el.name)}`);if(!ok){target?.setAttribute('aria-invalid','true');if(err){err.textContent='Please complete this required field.';err.style.display='block'}first=first||target;errors.push(el.id||el.name)}else{target?.removeAttribute('aria-invalid');if(err){err.textContent='';err.style.display='none'}}});if(first){first.focus?.({preventScroll:true});first.scrollIntoView?.({behavior:'smooth',block:'center'})}return {isValid:errors.length===0,errors};}
api.register=function(slug,config){
 window.formRegistry[`${slug}-form-master`]=function(states='',context={}){const jurisdiction=context.state||window.F4UWizard?.state?.route?.jurisdiction||'';const authority=config.authority||'Applicable filing authority';return `<div class="f4u-service-form f4u-schema-form" data-service-form="${attr(slug)}"><div class="f4u-service-form__notice"><div class="f4u-service-form__notice-icon">✓</div><div><strong>${esc(config.title)}</strong><p>${esc(config.subtitle||'Complete the filing information below.')} ${jurisdiction?`Selected jurisdiction: ${esc(jurisdiction)}.`:''}</p></div></div>${config.notice?`<div class="f4u-schema-notice"><strong>Important</strong><span>${esc(config.notice)}</span></div>`:''}<div class="f4u-agency-strip"><span>Prepared for</span><strong>${esc(authority)}</strong></div>${(config.sections||[]).map((s,i)=>`<section class="f4u-form-section"><div class="f4u-form-section__head"><span class="f4u-form-section__number">${i+1}</span><div><h3>${esc(s.title)}</h3>${s.description?`<p>${esc(s.description)}</p>`:''}</div></div><div class="f4u-form-section__body"><div class="f4u-field-grid f4u-field-grid--schema">${(s.fields||[]).map(x=>fieldHtml(x,states)).join('')}</div></div></section>`).join('')}</div>`;};
 window.formRegistry[`${slug}-validation-engine`]={validate(){const root=document.querySelector(`[data-service-form="${CSS.escape(slug)}"]`);return root?validate(root):{isValid:false,errors:['form_unavailable']}}};
};
document.addEventListener('change',e=>{const root=e.target.closest?.('.f4u-schema-form');if(root)sync(root)});
document.addEventListener('input',e=>{const root=e.target.closest?.('.f4u-schema-form');if(root)sync(root)});
new MutationObserver(()=>document.querySelectorAll('.f4u-schema-form').forEach(sync)).observe(document.documentElement,{childList:true,subtree:true});
})();