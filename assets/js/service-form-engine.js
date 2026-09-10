(function(){
"use strict";
const api=window.F4UServiceForms=window.F4UServiceForms||{};api._configs=api._configs||{};
window.formRegistry=window.formRegistry||{};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const attr=v=>esc(v).replace(/`/g,"&#96;");
const stateOptions=html=>{const raw=String(html||"");return /value=["']["']/.test(raw)?raw:'<option value="">Select state</option>'+raw;};

function optionsHtml(options,states){
 if(options==="__STATES__") return stateOptions(states);
 return (Array.isArray(options)?options:[]).map(o=>{const a=Array.isArray(o)?o:[o,o];return `<option value="${attr(a[0])}">${esc(a[1])}</option>`}).join("");
}
function condAttrs(show){return show?` data-f4u-condition='${attr(JSON.stringify(show))}'`:"";}
function spanAttr(field){
 const type=String(field.original_type||field.type||"text").toLowerCase();
 const full=["textarea","address","repeater","file","signature","heading","paragraph","divider","hidden"].includes(type);
 return ` data-f4u-span="${full?'full':'half'}"`;
}

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
function fieldMarker(label,required,settings={}){
 if(!required||settings.required_style==='none')return esc(label);
 const indicator=settings.required_style==='required'?' (Required)':' *';
 return settings.required_placement==='before'
   ? esc(indicator.trim()+' '+label)
   : esc(label+indicator);
}
function fieldHtml(field,states,settings={}){
 const id=field.id, req=field.required?' required':'', ph=field.placeholder?` placeholder="${attr(field.placeholder)}"`:'', condition=condAttrs(field.showWhen), help=field.help?`<small class="f4u-field-help">${esc(field.help)}</small>`:'';
 const v=field.validation||{}, validationAttrs=[
   v.min_length!==null&&v.min_length!==undefined&&v.min_length!==''?`minlength="${attr(v.min_length)}"`:'',
   v.max_length!==null&&v.max_length!==undefined&&v.max_length!==''?`maxlength="${attr(v.max_length)}"`:'',
   v.min!==null&&v.min!==undefined&&v.min!==''?`min="${attr(v.min)}"`:'',
   v.max!==null&&v.max!==undefined&&v.max!==''?`max="${attr(v.max)}"`:'',
   v.pattern?`pattern="${attr(v.pattern)}"`:''
 ].filter(Boolean).join(' ');
 const extra=[field.attrs||'',validationAttrs].filter(Boolean).join(' ')?` ${[field.attrs||'',validationAttrs].filter(Boolean).join(' ')}`:'';
 const span=spanAttr(field);
 const originalType=String(field.original_type||field.type||"text");

 if(originalType==="heading")return `<div class="f4u-schema-field f4u-schema-heading"${span}${condition}><h4>${esc(field.label)}</h4>${help}</div>`;
 if(originalType==="paragraph")return `<div class="f4u-schema-field f4u-schema-paragraph"${span}${condition}><p>${esc(field.help||field.label||"")}</p></div>`;
 if(originalType==="divider")return `<div class="f4u-schema-field f4u-schema-divider"${span}${condition}><hr></div>`;
 if(originalType==="hidden")return `<input type="hidden" id="${attr(id)}" name="${attr(id)}" value="${attr(field.value||"")}">`;

 if(originalType==="address"){
   return `<fieldset class="f4u-form-field f4u-schema-field f4u-address-group"${span}${condition}>
     <legend>${fieldMarker(field.label,field.required,settings)}</legend>
     <div class="f4u-field-grid f4u-field-grid--schema">
       ${[
         ["street","Street address","text"],
         ["city","City","text"],
         ["state","State","select"],
         ["zip","ZIP code","text"]
       ].map(([part,label,type])=>{
          const childId=`${id}_${part}`;
          if(type==="select")return `<div class="f4u-form-field"><label for="${attr(childId)}">${label}${field.required?' *':''}</label><select id="${attr(childId)}" name="${attr(childId)}" class="wizard-input-field"${field.required?' required':''}><option value="">Select</option>${stateOptions(states)}</select><div id="err_${attr(childId)}" class="wizard-error-message" aria-live="polite"></div></div>`;
          return `<div class="f4u-form-field"><label for="${attr(childId)}">${label}${field.required?' *':''}</label><input id="${attr(childId)}" name="${attr(childId)}" type="text" class="wizard-input-field"${field.required?' required':''}${part==="zip"?' data-f4u-format="zip" inputmode="numeric" maxlength="10" placeholder="12345 or 12345-6789"':''}><div id="err_${attr(childId)}" class="wizard-error-message" aria-live="polite"></div></div>`;
       }).join("")}
     </div>${help}</fieldset>`;
 }

 if(originalType==="repeater"){
   const subfields=Array.isArray(field.fields)?field.fields:[];
   return `<div class="f4u-form-field f4u-schema-field f4u-repeater"${span}${condition}
     data-f4u-repeater="${attr(id)}" data-f4u-item-label="${attr(field.item_label||"Item")}" data-f4u-min-items="${attr(field.min_items??1)}" data-f4u-max-items="${attr(field.max_items??25)}">
     <div class="f4u-repeater__head"><span class="f4u-field-label">${fieldMarker(field.label,field.required,settings)}</span>${help}</div>
     <div class="f4u-repeater__items" data-f4u-repeater-items></div>
     <button class="f4u-repeater__add" type="button" data-f4u-repeater-add>+ Add ${esc(field.item_label||"item")}</button>
     <template data-f4u-repeater-template>${subfields.map((sub,i)=>fieldHtml({...sub,id:`__ROW___${sub.id||sub.key||`field_${i+1}`}`,original_type:sub.type||"text"},states,settings)).join("")}</template>
   </div>`;
 }

 if(originalType==="file")return `<div class="f4u-form-field f4u-schema-field"${span}${condition}><label for="${attr(id)}">${fieldMarker(field.label,field.required,settings)}</label><input id="${attr(id)}" name="${attr(id)}" type="file" class="wizard-input-field"${req}${extra}>${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
 if(originalType==="signature"){
   return `<div class="f4u-form-field f4u-schema-field f4u-signature-field"${span}${condition}><label for="${attr(id)}">${fieldMarker(field.label,field.required,settings)}</label><input id="${attr(id)}" name="${attr(id)}" type="text" class="wizard-input-field"${req}${ph}${extra}><div class="f4u-schema-signature-preview" data-signature-preview-for="${attr(id)}">Your signature appears here</div>${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
 }

 if(originalType==="checkbox-group"){
   return `<div class="f4u-form-field f4u-schema-field"${span}${condition}><span class="f4u-field-label">${fieldMarker(field.label,field.required,settings)}</span><div class="f4u-option-cards">${(field.options||[]).map((o,i)=>{const a=Array.isArray(o)?o:[o,o];return `<label class="f4u-option-card"><input type="checkbox" name="${attr(id)}" id="${attr(id)}_${i}" value="${attr(a[0])}"${req}><span><strong>${esc(a[1])}</strong></span></label>`}).join('')}</div>${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
 }

 if(field.type==='checkbox')return `<label class="f4u-choice-row f4u-schema-field"${span}${condition}><input type="checkbox" id="${attr(id)}" name="${attr(id)}"${field.checked?' checked':''}${req}><span><strong>${fieldMarker(field.label,field.required,settings)}</strong>${help}</span></label>`;
 if(field.type==='radio')return `<div class="f4u-form-field f4u-schema-field"${span}${condition}><span class="f4u-field-label">${fieldMarker(field.label,field.required,settings)}</span><div class="f4u-option-cards">${(field.options||[]).map((o,i)=>{const a=Array.isArray(o)?o:[o,o];return `<label class="f4u-option-card"><input type="radio" name="${attr(id)}" id="${attr(id)}_${i}" value="${attr(a[0])}"${req}><span><strong>${esc(a[1])}</strong></span></label>`}).join('')}</div>${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
 let control='';
 if(field.type==='select')control=`<select id="${attr(id)}" name="${attr(id)}" class="wizard-input-field"${req}${extra}><option value="">Select</option>${optionsHtml(field.options,states)}</select>`;
 else if(field.type==='textarea')control=`<textarea id="${attr(id)}" name="${attr(id)}" class="wizard-input-field"${req}${ph}${extra}></textarea>`;
 else {
   const kind=inferredFormat(field);
   control=`<input id="${attr(id)}" name="${attr(id)}" type="${attr(field.type||'text')}" class="wizard-input-field"${req}${ph}${field.value?` value="${attr(field.value)}"`:''}${extra}${kind?` data-f4u-format="${attr(kind)}"${formatAttrs(kind)}`:''}>`;
 }
 return `<div class="f4u-form-field f4u-schema-field"${span}${condition}><label for="${attr(id)}">${fieldMarker(field.label,field.required,settings)}</label>${control}${help}<div id="err_${attr(id)}" class="wizard-error-message" aria-live="polite"></div></div>`;
}

function initRepeaters(root){
 root.querySelectorAll('[data-f4u-repeater]').forEach(rep=>{
   if(rep.dataset.f4uReady==="1")return;
   rep.dataset.f4uReady="1";
   const holder=rep.querySelector('[data-f4u-repeater-items]');
   const template=rep.querySelector('template[data-f4u-repeater-template]');
   const add=rep.querySelector('[data-f4u-repeater-add]');
   const min=Math.max(0,Number(rep.dataset.f4uMinItems||1));
   const max=Math.max(min,Number(rep.dataset.f4uMaxItems||25));
   const itemLabel=rep.dataset.f4uItemLabel||"Item";
   let seq=0;

   function addRow(){
     if(holder.children.length>=max)return;
     seq++;
     const row=document.createElement("div");
     row.className="f4u-repeater__item";
     row.dataset.row=String(seq);
     row.innerHTML=`<div class="f4u-repeater__item-head"><strong>${esc(itemLabel)} ${holder.children.length+1}</strong><button type="button" data-f4u-repeater-remove>Remove</button></div><div class="f4u-field-grid f4u-field-grid--schema">${template.innerHTML.replaceAll("__ROW__",String(seq))}</div>`;
     holder.appendChild(row);
     row.querySelector('[data-f4u-repeater-remove]')?.addEventListener("click",()=>{
       if(holder.children.length<=min)return;
       row.remove();
     });
   }

   add?.addEventListener("click",addRow);
   for(let i=0;i<min;i++)addRow();
 });
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
function ruleMatches(root,rule){
 const c=rule?.if||{};
 const nodes=[...root.querySelectorAll(`[name="${CSS.escape(c.field||'')}"],#${CSS.escape(c.field||'')}`)];
 if(!nodes.length)return false;
 if(c.operator==='checked')return nodes.some(n=>!!n.checked);
 const node=nodes.find(n=>n.checked)||nodes[0], value=node.type==='checkbox'?String(node.checked):String(node.value||'');
 if(c.operator==='equals')return value===String(c.value??'');
 if(c.operator==='notEquals')return value!==String(c.value??'');
 if(c.operator==='in'){const vals=Array.isArray(c.value)?c.value.map(String):String(c.value||'').split(',').map(x=>x.trim());return vals.includes(value)}
 return false;
}
function applyRules(root){
 const slug=root.dataset.serviceForm||'', config=api._configs?.[slug]||{}, rules=Array.isArray(config.rules)?config.rules:[];
 rules.forEach(rule=>{
   const hit=ruleMatches(root,rule);
   const targets=[...root.querySelectorAll(`[name="${CSS.escape(rule.target||'')}"],#${CSS.escape(rule.target||'')}`)];
   targets.forEach(target=>{
     const wrap=target.closest('.f4u-schema-field,.f4u-form-field,.f4u-choice-row')||target;
     if(rule.action==='show'){wrap.hidden=!hit;wrap.style.display=hit?'':'none';target.disabled=!hit}
     else if(rule.action==='hide'){wrap.hidden=hit;wrap.style.display=hit?'none':'';target.disabled=hit}
     else if(rule.action==='require'){target.required=!!hit}
     else if(rule.action==='optional'&&hit){target.required=false}
   });
 });
}
function sync(root){
 initRepeaters(root);
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
 applyRules(root);
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
   if(ok && typeof el.checkValidity==='function')ok=el.checkValidity();
   if(el.type==='email'&&el.value)ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
   if(el.dataset.f4uFormat==='ein'&&el.value)ok=el.value.replace(/\D/g,'').length===9;
   if(el.dataset.f4uFormat==='npi'&&el.value)ok=el.value.replace(/\D/g,'').length===10;
   if(el.dataset.f4uFormat==='phone'&&el.value)ok=el.value.replace(/\D/g,'').length===10;
   const target=el.type==='radio'?root.querySelector(`[name="${CSS.escape(el.name)}"]`):el;
   const err=root.querySelector(`#err_${CSS.escape(el.id||el.name)}`);
   if(!ok){target?.setAttribute('aria-invalid','true');if(err){const cfg=api._configs?.[root.dataset.serviceForm||'']||{},field=(cfg.sections||[]).flatMap(s=>s.fields||[]).find(f=>(f.id||f.key)===(el.id||el.name));err.textContent=field?.validation?.message||'Please enter a valid value for this required field.';err.style.display='block'}first=first||target;errors.push(el.id||el.name)}else{target?.removeAttribute('aria-invalid');if(err){err.textContent='';err.style.display='none'}}
 });
 if(first){first.focus?.({preventScroll:true});first.scrollIntoView?.({behavior:'smooth',block:'center'})}
 return {isValid:errors.length===0,errors};
}

function installModernFormStyles(){
 if(document.getElementById('f4u-modern-schema-form-styles'))return;
 const style=document.createElement('style');
 style.id='f4u-modern-schema-form-styles';
 style.textContent=`
 .f4u-schema-form{--f4u-green:#10b981;--f4u-green-dark:#059669;--f4u-ink:#0f172a;--f4u-muted:#64748b;--f4u-line:#dbe3ea;--f4u-soft:#f8fafc;--f4u-danger:#dc2626;font-family:"DM Sans",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--f4u-ink)}
 .f4u-schema-form *{box-sizing:border-box}
 .f4u-schema-form .f4u-form-section{margin:0 0 20px;background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:20px;overflow:hidden;box-shadow:0 3px 10px rgba(15,23,42,.035)}
 .f4u-schema-form .f4u-form-section__head{display:flex;align-items:flex-start;gap:12px;padding:20px 22px 14px;background:linear-gradient(180deg,#fff 0%,#fbfdfc 100%);border-bottom:1px solid #eef2f6}
 .f4u-schema-form .f4u-form-section__number{display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;border-radius:9px;background:#ecfdf5;color:#047857;font-size:12px;font-weight:800}
 .f4u-schema-form .f4u-form-section__head h3{margin:1px 0 3px;font:800 16px/1.25 Manrope,"DM Sans",sans-serif;color:#0b1f3a}
 .f4u-schema-form .f4u-form-section__head p{margin:0;color:#64748b;font-size:12px;line-height:1.5}
 .f4u-schema-form .f4u-form-section__body{padding:20px 22px 22px}
 .f4u-schema-form .f4u-field-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px 18px;align-items:start}
 .f4u-schema-form .f4u-schema-field[data-f4u-span="full"]{grid-column:1/-1}
 .f4u-schema-form .f4u-schema-field[data-f4u-span="half"]{grid-column:auto}
 .f4u-schema-form .f4u-form-field{min-width:0;margin:0;padding:0;border:0}
 .f4u-schema-form .f4u-form-field>label,.f4u-schema-form .f4u-field-label,.f4u-schema-form fieldset>legend{display:block;margin:0 0 7px;color:#344054;font-size:12px;font-weight:700;line-height:1.35}
 .f4u-schema-form .wizard-input-field{display:block;width:100%;min-width:0;height:48px;border:1px solid #cfd8e3;border-radius:12px;background:#fff;color:#101828;padding:0 14px;font:500 14px "DM Sans",sans-serif;outline:0;box-shadow:0 1px 2px rgba(16,24,40,.04),inset 0 1px 0 rgba(255,255,255,.65);transition:border-color .15s ease,box-shadow .15s ease,background .15s ease}
 .f4u-schema-form textarea.wizard-input-field{height:auto;min-height:118px;padding:13px 14px;resize:vertical;line-height:1.55}
 .f4u-schema-form .wizard-input-field:hover{border-color:#aebdca}
 .f4u-schema-form .wizard-input-field:focus{border-color:var(--f4u-green);box-shadow:0 0 0 4px rgba(16,185,129,.12),0 2px 6px rgba(15,23,42,.06)}
 .f4u-schema-form select.wizard-input-field{appearance:none;-webkit-appearance:none;padding-right:44px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-size:18px}
 .f4u-schema-form .f4u-field-help{display:block;margin-top:7px;color:#7c8a9a;font-size:11px;line-height:1.45}
 .f4u-schema-form .wizard-error-message{margin-top:6px;color:var(--f4u-danger);font-size:11px;font-weight:600}
 .f4u-schema-form [aria-invalid="true"]{border-color:#ef4444!important;box-shadow:0 0 0 4px rgba(239,68,68,.10)!important}
 .f4u-schema-form .f4u-address-group{padding:16px!important;border:1px solid #e2e8f0!important;border-radius:16px!important;background:#fbfcfd!important;box-shadow:inset 0 1px 0 #fff}
 .f4u-schema-form .f4u-address-group>legend{padding:0 7px;background:#fff;border-radius:7px}
 .f4u-schema-form .f4u-address-group .f4u-field-grid{grid-template-columns:2fr 1.15fr .9fr .8fr;gap:12px}
 .f4u-schema-form .f4u-address-group .f4u-form-field:first-child{grid-column:auto}
 .f4u-schema-form .f4u-option-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .f4u-schema-form .f4u-option-card{position:relative;display:flex;align-items:center;min-height:52px;margin:0;padding:12px 14px;border:1px solid #d7e0e8;border-radius:13px;background:#fff;cursor:pointer;box-shadow:0 2px 7px rgba(15,23,42,.035);transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease,background .15s ease}
 .f4u-schema-form .f4u-option-card:hover{border-color:#9fdcc6;box-shadow:0 5px 14px rgba(15,23,42,.06);transform:translateY(-1px)}
 .f4u-schema-form .f4u-option-card input{width:18px;height:18px;margin:0 10px 0 0;accent-color:var(--f4u-green);flex:0 0 auto}
 .f4u-schema-form .f4u-option-card:has(input:checked){border-color:var(--f4u-green);background:#f0fdf7;box-shadow:0 0 0 3px rgba(16,185,129,.09)}
 .f4u-schema-form .f4u-option-card strong{font-size:12px;color:#24364b;line-height:1.35}
 .f4u-schema-form .f4u-choice-row{grid-column:1/-1;display:flex;gap:11px;align-items:flex-start;padding:14px 15px;border:1px solid #dce4eb;border-radius:13px;background:#fbfcfd;box-shadow:0 2px 7px rgba(15,23,42,.035);cursor:pointer}
 .f4u-schema-form .f4u-choice-row input{width:18px;height:18px;margin:1px 0 0;accent-color:var(--f4u-green);flex:0 0 auto}
 .f4u-schema-form .f4u-choice-row strong{font-size:12px;line-height:1.45;color:#344054}
 .f4u-schema-form .f4u-repeater{padding:16px;border:1px solid #e2e8f0;border-radius:17px;background:#f8fafc}
 .f4u-schema-form .f4u-repeater__head{margin-bottom:12px}
 .f4u-schema-form .f4u-repeater__items{display:grid;gap:12px}
 .f4u-schema-form .f4u-repeater__item{padding:16px;border:1px solid #dbe4ec;border-radius:15px;background:#fff;box-shadow:0 4px 14px rgba(15,23,42,.045)}
 .f4u-schema-form .f4u-repeater__item-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px;padding-bottom:10px;border-bottom:1px solid #eef2f6}
 .f4u-schema-form .f4u-repeater__item-head strong{font-size:12px;color:#0f766e}
 .f4u-schema-form .f4u-repeater__item-head button{border:0;background:transparent;color:#b42318;font:700 11px "DM Sans";cursor:pointer}
 .f4u-schema-form .f4u-repeater__add{margin-top:12px;min-height:40px;padding:0 14px;border:1px solid #b7e4d3;border-radius:10px;background:#ecfdf5;color:#047857;font:800 12px "DM Sans";cursor:pointer;box-shadow:0 2px 6px rgba(16,185,129,.08)}
 .f4u-schema-form .f4u-repeater__add:hover{background:#dff9ee;border-color:#79d4b4}
 .f4u-schema-form .f4u-schema-signature-preview{margin-top:10px;min-height:64px;padding:15px 17px;border:1px dashed #cbd5e1;border-radius:12px;background:#fafafa;color:#475569;font:italic 24px/1.35 Georgia,serif}
 .f4u-schema-form .f4u-schema-heading,.f4u-schema-form .f4u-schema-paragraph,.f4u-schema-form .f4u-schema-divider{grid-column:1/-1}
 .f4u-schema-form .f4u-schema-heading h4{margin:5px 0 0;font:800 15px Manrope,"DM Sans",sans-serif;color:#172554}
 .f4u-schema-form .f4u-schema-divider hr{border:0;border-top:1px solid #e5e7eb;margin:4px 0}
 .f4u-schema-form .f4u-filing-tooltip,.f4u-schema-form .f4u-service-form__notice,.f4u-schema-form .f4u-schema-notice,.f4u-schema-form .f4u-agency-strip{border-radius:16px!important}
 .f4u-schema-form .f4u-filing-tooltip{display:block!important;padding:0!important;overflow:hidden;border:1px solid #e2e8f0!important;background:#fbfcfd!important;box-shadow:none!important}
 .f4u-schema-form .f4u-filing-tooltip summary{display:flex;align-items:center;gap:10px;min-height:48px;padding:12px 15px;cursor:pointer;list-style:none;color:#0b1f3a;font:800 13px/1.3 Manrope,"DM Sans",sans-serif;user-select:none}
 .f4u-schema-form .f4u-filing-tooltip summary::-webkit-details-marker{display:none}
 .f4u-schema-form .f4u-filing-tooltip summary::after{content:"⌄";margin-left:auto;color:#64748b;font-size:16px;line-height:1;transition:transform .18s ease}
 .f4u-schema-form .f4u-filing-tooltip[open] summary::after{transform:rotate(180deg)}
 .f4u-schema-form .f4u-filing-tooltip__icon{display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px}
 .f4u-schema-form .f4u-filing-tooltip__icon svg{width:18px;height:18px;fill:none;stroke:#059669;stroke-width:1.8}
 .f4u-schema-form .f4u-filing-tooltip__body{padding:0 15px 14px 49px;color:#64748b;font-size:12px;line-height:1.6}
 .f4u-schema-form .f4u-filing-tooltip__body p{margin:0}
 @media(max-width:760px){
   .f4u-schema-form .f4u-field-grid,.f4u-schema-form .f4u-address-group .f4u-field-grid,.f4u-schema-form .f4u-option-cards{grid-template-columns:1fr}
   .f4u-schema-form .f4u-schema-field[data-f4u-span="half"]{grid-column:1/-1}
   .f4u-schema-form .f4u-form-section__head{padding:17px 16px 12px}
   .f4u-schema-form .f4u-form-section__body{padding:16px}
 }
 `;
 document.head.appendChild(style);
}
installModernFormStyles();

api.sync=sync;
api.format=formatValue;
api.register=function(slug,config){api._configs[slug]=config;
 const settings=config.settings||{};
 window.formRegistry[`${slug}-form-master`]=function(states='',context={}){
   const jurisdiction=context.state||window.F4UWizard?.state?.route?.jurisdiction||'';
   const authority=config.authority||'Applicable filing authority';
   const tooltip=config.tooltip||`${config.title} is the filing or application selected for this order. The questions below collect the information filings4u needs to prepare this ${config.title.toLowerCase()} for ${authority}. Review each answer carefully because the information may be placed on the government filing.`;
   return `<div class="f4u-service-form f4u-schema-form" data-service-form="${attr(slug)}">
   <details class="f4u-filing-tooltip"><summary><span class="f4u-filing-tooltip__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 10.5v6"></path><path d="M12 7.3h.01"></path></svg></span><span>What you are filing</span></summary><div class="f4u-filing-tooltip__body"><p>${esc(tooltip)}</p></div></details>
   <div class="f4u-service-form__notice"><div class="f4u-service-form__notice-icon">✓</div><div><strong>${esc(config.title)}</strong><p>${esc(config.subtitle||'Complete the filing information below.')} ${jurisdiction?`Selected jurisdiction: ${esc(jurisdiction)}.`:''}</p></div></div>
   ${config.notice?`<div class="f4u-schema-notice"><strong>Important</strong><span>${esc(config.notice)}</span></div>`:''}
   ${(config.sections||[]).map((s,i)=>`<section class="f4u-form-section"${condAttrs(s.showWhen)}><div class="f4u-form-section__head"><span class="f4u-form-section__number">${i+1}</span><div><h3>${esc(s.title)}</h3>${s.description?`<p>${esc(s.description)}</p>`:''}</div></div><div class="f4u-form-section__body"><div class="f4u-field-grid f4u-field-grid--schema">${(s.fields||[]).map(x=>fieldHtml(x,states,settings)).join('')}</div></div></section>`).join('')}</div>`;
 };
 window.formRegistry[`${slug}-validation-engine`]={validate(){const root=document.querySelector(`[data-service-form="${CSS.escape(slug)}"]`);return root?validate(root):{isValid:false,errors:['form_unavailable']}}};
};

document.addEventListener('change',e=>{const root=e.target.closest?.('.f4u-schema-form');if(root){formatValue(e.target);sync(root)}});
document.addEventListener('input',e=>{const root=e.target.closest?.('.f4u-schema-form');if(root){formatValue(e.target);sync(root);const id=e.target.id;if(id){root.querySelectorAll(`[data-signature-preview-for="${CSS.escape(id)}"]`).forEach(n=>n.textContent=String(e.target.value||"").trim()||"Your signature appears here")}}});
new MutationObserver(()=>document.querySelectorAll('.f4u-schema-form').forEach(root=>{root.querySelectorAll('[data-f4u-format]').forEach(formatValue);sync(root)})).observe(document.documentElement,{childList:true,subtree:true});
})();
