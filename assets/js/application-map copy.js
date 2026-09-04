// ============================================================================ // 
// ðŸ—ºï¸ MODULE: DYNAMIC APPLICATION MAP TIMELINE TIMING & VIEWPORT HUB 
// ============================================================================ // 
function renderDynamicWizardApplicationMap() { 
  "use strict"; 
  const targetPlaceholder = document.getElementById("wizard-sidebar-application-map-target"); 
  if (!targetPlaceholder) { 
    setTimeout(renderDynamicWizardApplicationMap, 40); 
    return; 
  } 
  
  // ðŸŸ¢ DYNAMIC MOBILE-RESPONSIVE COMPLETION ESTIMATOR ENGINE
  let dynamicMinutesText = "5 minutes"; 
  try {
    // 1. Scan for all visible, non-hidden input components on the page
    const coreFormInputs = document.querySelectorAll(
      "form input:not([type='hidden']), form select, form textarea, #dynamic-onboarding-fields-root input:not([type='hidden']), #dynamic-onboarding-fields-root select"
    );
    
    // 2. Filter out checkboxes/radios belonging to the same grouping to keep item counting accurate
    const distinctFieldsSet = new Set();
    coreFormInputs.forEach(input => {
      if (input.type === "radio" || input.type === "checkbox") {
        distinctFieldsSet.add(input.name || input.id);
      } else {
        distinctFieldsSet.add(input.id || input.className || Math.random().toString());
      }
    });

    const activeFormFieldsCount = distinctFieldsSet.size;

    // ðŸŸ¢ 3. MOBILE ENGINE TRANSLATION GATEWAYS
    // Detect screen width under 768px (standard tablet/mobile breakpoint)
    const isMobileDeviceView = window.matchMedia("(max-width: 768px)").matches;
    
    let secondsPerField = 15;   // Desktop default field velocity
    let structuralOverhead = 150; // Desktop default step baseline (2.5 mins)

    if (isMobileDeviceView) {
      secondsPerField = 25;     // Mobile adjustments for touch keyboards
      structuralOverhead = 270; // Mobile processing overhead (4.5 mins)
      console.log("[Timing Engine] Target layout evaluated as: MOBILE viewport.");
    } else {
      console.log("[Timing Engine] Target layout evaluated as: DESKTOP viewport.");
    }

    // 4. Calculate final values based on device criteria
    const variableSecondsCalculated = (activeFormFieldsCount * secondsPerField) + structuralOverhead; 
    const calculatedMinutesFraction = Math.ceil(variableSecondsCalculated / 60);

    if (calculatedMinutesFraction <= 1) {
      dynamicMinutesText = "1 minute";
    } else {
      dynamicMinutesText = `${calculatedMinutesFraction} minutes`;
    }
    console.log(`[Timing Engine] Detected ${activeFormFieldsCount} distinct fields. Dynamic calculation: ${dynamicMinutesText}`);
  } catch (timingCalculationError) {
    console.warn("[Timing Engine Exception] Falling back to default time boundaries:", timingCalculationError);
  }

  const timelineRegistryMatrix = [ 
    { idx: 0, title: "State Selection", desc: "State of Formation or Registration" }, 
    { idx: 1, title: "1. Selected Package", desc: "Items and inclusions" }, 
    { idx: 2, title: "2. Corporate Profile Intake", desc: "Corporate entity details" }, 
    { idx: 3, title: "3. Add-Ons", desc: "Compliance assets & shields" }, 
    { idx: 4, title: "4. Power of Attorney", desc: "Digital signature execution" }, 
    { idx: 5, title: "5. Purchase Summary", desc: "Order item breakdowns" }, 
    { idx: 6, title: "6. Secure Payment", desc: "Encrypted checkout gateway" }, 
    { idx: 7, title: "7. Account Creation", desc: "Secure your account password" }, 
    { idx: 8, title: "8. Success Portal", desc: "Review and Download Receipt" } 
  ]; 
  
  let compiledMapHtml = ` 
   <div id="f4u-clean-timeline-container" style="box-sizing: border-box; width: 100% !important; padding: 0 24px !important; margin: 0 !important; height: calc(100vh - 180px); display: flex; flex-direction: column;"> 
     <div class="sidebar-header-box" style="margin-bottom: 12px; text-align: left; padding-left: 2px !important;"> 
       <h3 class="sidebar-title-label" style="color: #0a1f44; font-size: 1.15rem; font-weight: 800; margin: 0 0 4px 0; letter-spacing: -0.25px;">Application Map</h3> 
       <p class="sidebar-time-tracker" style="color: #64748b; font-size: 0.775rem; font-weight: 600; margin: 0; display: flex; align-items: center; gap: 4px;"> 
         <i class="fa-solid fa-clock" style="font-size: 0.75rem;"></i> Estimated completion time: <span style="color: #0a1f44; font-weight: 700;">${dynamicMinutesText}</span> 
       </p> 
     </div> 
     
     <nav aria-label="Wizard Steps Progress Tracker" class="sidebar-nav-timeline" style="display: flex; flex-direction: column; justify-content: space-between; flex: 1; width: 100% !important; margin: 0 !important; padding: 16px 0 16px 0 !important;"> `; 
     
  timelineRegistryMatrix.forEach(stepItem => { 
    compiledMapHtml += ` 
     <div id="timeline-row-${stepItem.idx}" class="toc-step-row timeline-row-${stepItem.idx}" style="display: flex !important; align-items: flex-start !important; justify-content: flex-start !important; gap: 12px !important; padding: 0 !important; margin: 0 !important; box-sizing: border-box; width: 100% !important;"> 
       <span class="toc-dot" style="width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-top: 5px; flex-shrink: 0; box-sizing: border-box; transition: background-color 0.2s, box-shadow 0.2s;"></span> 
       <div class="toc-text-group" style="display: flex; flex-direction: column; gap: 2px; width: 100% !important; min-width: 0; box-sizing: border-box; margin: 0 !important; padding: 0 !important; flex-grow: 1 !important;"> 
         <span class="toc-step-title" style="font-size: 0.9rem; color: #64748b; font-weight: 500; transition: color 0.2s; display: block; width: 100% !important; line-height: 1.3; margin: 0 !important; padding: 0 !important;">${stepItem.title}</span> 
         <span class="toc-step-desc" style="font-size: 0.80rem; color: #94a3b8; font-weight: 500; display: block; width: 100% !important; line-height: 1.3; margin: 0 !important; padding: 0 !important; word-wrap: break-word; overflow-wrap: break-word; white-space: normal !important;">${stepItem.desc}</span> 
       </div> 
     </div> 
    
     `;
      
  }); 
  
  
  compiledMapHtml += ` 
     </nav> 
   </div> `; 
   
  targetPlaceholder.innerHTML = compiledMapHtml; 
  
  if (typeof window.updateApplicationMapTimelineBubbles === "function") { 
    const rawValueNum = parseInt(window.currentWizardActiveStep, 10); 
    const liveStepContext = isNaN(rawValueNum) ? 0 : rawValueNum; 
    window.updateApplicationMapTimelineBubbles(liveStepContext); 
  } 
} 

// ============================================================================ // 
// ðŸ—ºï¸ PART 4: MULTI-SIDEBAR TIMELINE NAV LIGHTS ENGINE (SOLID EMERALD 0-INDEX) 
// ============================================================================ // 
function updateApplicationMapTimelineBubbles(currentStepIndex) { 
  const rawStepValue = parseInt(currentStepIndex, 10); 
  const activeStep = isNaN(rawStepValue) ? 0 : rawStepValue; 
  
  for (let i = 0; i <= 8; i++) { 
    const rowNodes = document.querySelectorAll(`#timeline-row-${i}`); 
    rowNodes.forEach(rowNode => { 
      if (!rowNode) return; 
      const dotNode = rowNode.querySelector(".toc-dot"); 
      const titleNode = rowNode.querySelector(".toc-step-title"); 
      
      if (dotNode) { 
        dotNode.style.removeProperty("background-color"); 
        dotNode.style.removeProperty("border"); 
        dotNode.style.removeProperty("box-shadow"); 
      } 
      if (titleNode) { 
        titleNode.style.setProperty("color", "#64748b", "important"); 
        titleNode.style.setProperty("font-weight", "500", "important"); 
      } 
      
      if (i === activeStep) { 
        if (dotNode) { 
          dotNode.style.setProperty("background-color", "#10b981", "important"); 
          dotNode.style.setProperty("border", "3px solid #10b981", "important"); 
          dotNode.style.setProperty("box-shadow", "0 0 0 4px rgba(16, 185, 129, 0.25)", "important"); 
        } 
        if (titleNode) { 
          titleNode.style.setProperty("color", "#10b981", "important"); 
          titleNode.style.setProperty("font-weight", "800", "important"); 
        } 
      } else if (i < activeStep) { 
        if (dotNode) { 
          dotNode.style.setProperty("background-color", "#10b981", "important"); 
          dotNode.style.setProperty("border", "3px solid #10b981", "important"); 
        } 
        if (titleNode) { 
          titleNode.style.setProperty("color", "#0a1f44", "important"); 
          titleNode.style.setProperty("font-weight", "700", "important"); 
        } 
      } else { 
        if (dotNode) { 
          dotNode.style.setProperty("background-color", "#e2e8f0", "important"); 
          dotNode.style.setProperty("border", "3px solid #e2e8f0", "important"); 
        } 
      } 
    }); 
  } 
  
} 



window.renderDynamicWizardApplicationMap = renderDynamicWizardApplicationMap; 
window.updateApplicationMapTimelineBubbles = updateApplicationMapTimelineBubbles; 

if (document.readyState !== "loading") { 
  window.renderDynamicWizardApplicationMap(); 
} else { 
  document.addEventListener("DOMContentLoaded", window.renderDynamicWizardApplicationMap); 
}

