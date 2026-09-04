// Part 1: Clear Layout Definition and Logo Extractor Loop
const timelineRegistryMatrix = [
  { idx: 0, title: "State Selection", desc: "State of Formation or Registration" },
  { idx: 1, title: "1. Selected Package", desc: "Items and inclusions" },
  { idx: 2, title: "2. Corporate Profile Intake", desc: "Corporate entity details" },
  { idx: 3, title: "3. Add-Ons", desc: "Compliance assets & shields" },
  { idx: 4, title: "4. Power of Attorney", desc: "Digital signature execution" },
  { idx: 5, title: "5. Purchase Summary", desc: "Order item breakdowns" },
  { idx: 6, title: "6. Secure Payment", desc: "Encrypted checkout gateway" },
  { idx: 7, title: "7. Success Portal", desc: "Account creation systems" }
];

window.extractLogoForMobileHeader = function() {
  if (document.getElementById("f4u-mobile-header-bar")) return;
  
  // Find your active brand icon layout target safely
  const sidebarLogo = document.querySelector('.app-logo-area img, .portal-sidebar img, img[class*="logo"]');
  if (!sidebarLogo) {
    console.warn("[Logo Engine] Target logo element not found in active tree yet. Retrying...");
    setTimeout(window.extractLogoForMobileHeader, 50);
    return;
  }

  const mobileHeader = document.createElement("div");
  mobileHeader.id = "f4u-mobile-header-bar";
  mobileHeader.style.cssText = "position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #ffffff; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; padding: 0 16px; z-index: 9990; box-sizing: border-box;";
  
  const logoClone = sidebarLogo.cloneNode(true);
  logoClone.style.cssText = "max-height: 39px; width: auto; padding: 0; margin: 0;";
  
  mobileHeader.appendChild(logoClone);
  document.body.insertBefore(mobileHeader, document.body.firstChild);
  console.log("[Logo Engine Success] Brand asset extracted to top banner successfully.");
};

// Part 2: Dropdown Toggle Overlay Switch Rules
window.toggleMobileSidebarMenuOverlay = function(explicitEventRef) {
  if (explicitEventRef && typeof explicitEventRef.stopPropagation === "function") explicitEventRef.stopPropagation();
  if (explicitEventRef && typeof explicitEventRef.preventDefault === "function") explicitEventRef.preventDefault();

  const navPanel = document.getElementById("f4u-dropdown-menu-panel");
  const triggerIcon = document.getElementById("mobileNavTriggerIcon");
  if (!navPanel) return;

  const isClosed = (navPanel.style.display === "none" || !navPanel.style.display);

  if (isClosed) {
    navPanel.style.setProperty("display", "block", "important");
    if (triggerIcon) triggerIcon.innerHTML = "âœ• Close";
    if (typeof window.syncDropdownStepIndicatorLights === "function") window.syncDropdownStepIndicatorLights();
  } else {
    navPanel.style.setProperty("display", "none", "important");
    if (triggerIcon) triggerIcon.innerHTML = "â˜° Menu";
  }
};

// Part 3: Clean Menu Construction Block (FIXED: SAVE PROGRESS DROPDOWN INJECTION)
window.generateMenuMarkupFromMatrix = function() {
    const listContainer = document.getElementById("f4u-dropdown-list-container");
    if (!listContainer) {
        setTimeout(window.generateMenuMarkupFromMatrix, 50);
        return;
    }

    // 1. Map out your native wizard steps arrays
    let dropdownMarkup = timelineRegistryMatrix.map(step => `
        <li data-index="${step.idx}" class="menu-toggle-wrapper" style="border-bottom: 1px solid #f1f5f9; padding: 12px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: background 0.15s ease; width: 100%; box-sizing: border-box; background: #ffffff;">
            <div class="status-light" id="nav_light_step_${step.idx}" style="width: 10px; height: 10px; border-radius: 50%; background-color: #cbd5e1; flex-shrink: 0; box-shadow: 0 0 0 2px #fff, 0 0 0 3px #cbd5e1;"></div>
            <div style="display: flex; flex-direction: column; gap: 2px; flex-grow: 1; text-align: left;">
                <span class="step-title" style="font-weight: 700; font-size: 0.85rem; color: #0a1f44; margin: 0; display: block; line-height: 1.2;">${step.title}</span>
                <span class="step-desc" style="display: block; font-size: 0.725rem; color: #64748b; margin: 0; line-height: 1.2;">${step.desc}</span>
            </div>
        </li>
    `).join('');

    // 2. ðŸŸ¢ APPEND THE DYNAMIC SAVE PROGRESS ACTION ROW AT THE ABSOLUTE BOTTOM
    dropdownMarkup += `
        <li style="padding: 16px; width: 100%; box-sizing: border-box; background: #ffffff; list-style-type: none;">
            <button id="sidebarFallbackLogoutBtn" class="logout-btn" type="button" 
                onclick="if(typeof window.saveWizardFormStatesVanilla === 'function'){ window.saveWizardFormStatesVanilla(); alert('Progress saved successfully!'); } else { console.warn('Core storage save hook missing.'); }"
                style="width: 100%; cursor: pointer; box-sizing: border-box; padding: 12px; background: #0a1f44; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; -webkit-appearance: none;">
                <i class="fa-solid fa-floppy-disk"></i> Save Progress
            </button>
        </li>
    `;

    // Render aggregated structural window blocks to the viewport container layout
    listContainer.innerHTML = dropdownMarkup;

    requestAnimationFrame(() => {
        window.attachDropdownRowNavigationClickListeners();
        window.syncDropdownStepIndicatorLights();
    });
};


// Part 4: Dynamic Lamp Status Synchronizer
window.syncDropdownStepIndicatorLights = function() {
  const activeStepIdx = parseInt(window.currentWizardActiveStep || window.activeStepIndex || 0, 10);

  timelineRegistryMatrix.forEach(step => {
    const lamp = document.getElementById(`nav_light_step_${step.idx}`);
    const rowWrapper = document.querySelector(`li[data-index="${step.idx}"]`);
    if (!lamp) return;

    if (step.idx < activeStepIdx) {
      lamp.style.backgroundColor = "#10b981";
      lamp.style.boxShadow = "0 0 0 2px #fff, 0 0 0 4px #10b981";
      if (rowWrapper) rowWrapper.style.opacity = "0.75";
    } else if (step.idx === activeStepIdx) {
      lamp.style.backgroundColor = "#0a1f44";
      lamp.style.boxShadow = "0 0 0 2px #fff, 0 0 0 4px #0a1f44, 0 0 8px #0a1f44";
      if (rowWrapper) {
        rowWrapper.style.opacity = "1";
        rowWrapper.style.backgroundColor = "rgba(2, 132, 199, 0.04)";
      }
    } else {
      lamp.style.backgroundColor = "#cbd5e1";
      lamp.style.boxShadow = "0 0 0 2px #fff, 0 0 0 3px #cbd5e1";
      if (rowWrapper) {
        rowWrapper.style.opacity = "0.5";
        rowWrapper.style.backgroundColor = "transparent";
      }
    }
  });
};

// Part 5: Sequential Validation Click Engine
window.attachDropdownRowNavigationClickListeners = function() {
  document.querySelectorAll('.menu-toggle-wrapper').forEach(rowNode => {
    if (!rowNode || rowNode.dataset.dropdownListenerHooked) return;

    rowNode.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetStepIdx = parseInt(rowNode.dataset.index, 10);
      // Grab the active application step from framework runtime memory
      const currentActiveStepIdx = parseInt(window.currentWizardActiveStep || window.activeStepIndex || 0, 10);
      
      // 1. RULE CHECK: Block users from jumping into future uncompleted steps
      if (targetStepIdx > currentActiveStepIdx) {
        console.warn(`[Navigation Guard] Target step ${targetStepIdx} locked. Complete your current view inputs first.`);
        
        // Flash a temporary shake animation or visual cue on the specific row to indicate it's locked
        rowNode.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
        setTimeout(() => { rowNode.style.backgroundColor = "transparent"; }, 300);
        return; 
      }

      // 2. BACKWARD ROUTING PERMITTED: Allow smooth historical review navigation
      if (typeof window.switchWizardActiveViewLayout === "function") {
        window.switchWizardActiveViewLayout(targetStepIdx);
      } else if (typeof window.goToWizardStepIndex === "function") {
        window.goToWizardStepIndex(targetStepIdx);
      }
      
      // Auto-collapse dropdown card panel right after a valid selection click
      const navPanel = document.getElementById("f4u-dropdown-menu-panel");
      if (navPanel) navPanel.style.setProperty("display", "none", "important");
      const icon = document.getElementById("mobileNavTriggerIcon");
      if (icon) icon.innerHTML = "â˜° Menu";
    });
    rowNode.dataset.dropdownListenerHooked = "true";
  });
};

// Outside layout backdrop click dismissal interceptor layer
document.addEventListener("click", function(e) {
  const navPanel = document.getElementById("f4u-dropdown-menu-panel");
  if (!navPanel || navPanel.style.display !== "block") return;
  if (!e.target.closest('#f4u-dropdown-menu-panel') && !e.target.closest('#mobileNavToggleBtn')) {
    navPanel.style.setProperty("display", "none", "important");
    const icon = document.getElementById("mobileNavTriggerIcon");
    if (icon) icon.innerHTML = "â˜° Menu";
  }
});



window.initializeOverlayMenuAssets = function() {
  window.extractLogoForMobileHeader();
  window.generateMenuMarkupFromMatrix();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.initializeOverlayMenuAssets);
} else {
  window.initializeOverlayMenuAssets();
}


