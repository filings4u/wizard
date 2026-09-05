(function(){
"use strict";
function show(message,title="Please review"){
 if(window.F4UWizard?.notify)return window.F4UWizard.notify(title,String(message||""),"error");
 console.warn("[filings4u notice]",message);
}
window.alert=function(message){show(message,"filings4u Secure Wizard");};
})();
