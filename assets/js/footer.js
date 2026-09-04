// ============================================================================ //
// ðŸ“¦ ISOLATED AUTOMATED SYSTEM FOOTER INJECTION ENGINE                         //
// ============================================================================ //;(function renderGlobalApplicationFooterHtml() {
  "use strict";

  // Target your dedicated external layout anchor placeholder right below Step 7
  const targetNode = document.getElementById("wizard-footer-injection-target");
  if (!targetNode) {
    // If the master HTML structural node isn't ready yet, defer execution safely
    setTimeout(renderGlobalApplicationFooterHtml, 40);
    return;
  }

  /**
   * MULTI-DEVICE IMPLEMENTATION LAYER:
   * Combines full-width desktop constraints with custom negative margin mobile breakouts.
   */
  targetNode.innerHTML = `
    <!-- ðŸŸ¢ DYNAMIC MEDIA OVERRIDES WRAPPER -->
<style>
  /* ============================================================================ */
  /* ðŸ’» GLOBAL & DESKTOP GRID DEFAULTS                                           */
  /* ============================================================================ */
  #f4u-standalone-footer-wrapper {
    display: block !important;
    width: 100% !important;
    max-width: 1200px !important;
    margin: 40px auto 0 auto !important;
    clear: both;
    position: relative;
    z-index: 10;
    box-sizing: border-box;
    overflow: hidden !important;
    border-radius: 12px !important;
  }
  
  /* ============================================================================ */
  /* ðŸ“± MOBILE VIEWPORT BREAKPOINT BLOCK (UNDER 600px EXCLUSIVE)                 */
  /* ============================================================================ */
  @media (max-width: 600px) {
    
  
    
    /* ðŸŸ¢ THE INLINE STRIPPER: Overrides hardcoded inline desktop constraints on the inner tag */
    #f4u-standalone-footer-wrapper .portal-legal-footer {
      display: flex !important;
      flex-direction: column !important; /* Stacks your elements into 3 distinct centered tiers */
      justify-content: center !important;
      align-items: center !important;
      text-align: center !important;
      padding: 24px 16px !important;
      gap: 16px !important;
      
      /* ðŸŸ¢ CRITICAL: Overrides the hardcoded desktop layout inline metrics */
      width: 100% !important;
      max-width: 100% !important; 
      margin: 0 !important; 
    }
    
    /* ROW 1: Copyright text text wrapping tracks */
    #f4u-standalone-footer-wrapper .copyright-text-block,
    p.copyright-text-block, 
    .portal-legal-footer p.copyright-text-block {
      display: block !important;
      text-align: center !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 0 4px 0 !important;
      white-space: normal !important; /* Natural fluid tracking bounds */
    }
    
    /* ROW 2: Middle links horizontal alignment row spacing */
    #f4u-standalone-footer-wrapper .footer-links-centered-row {
      display: flex !important;
      flex-direction: row !important; /* Keeps links side-by-side */
      width: 100% !important;
      justify-content: center !important;
      gap: 16px !important;
      margin: 0 !important;
    }
    
    /* ROW 3: Secure encryption badge capsule pill alignment */
    #f4u-standalone-footer-wrapper .trust-badge {
      display: inline-flex !important;
      width: auto !important;
      margin: 0 auto !important;
    }
  }
</style>


    <!-- ðŸŸ¢ MASTER CONTEXT LAYOUT CANVAS -->
    <div id="f4u-standalone-footer-wrapper">
      <!-- ðŸŸ¢ FIXED INLINE STYLE LAYER: Added max-width and margin auto directly to the footer tag -->
      <footer class="portal-legal-footer" style="box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 1450px; background: #0a1f44; padding: 24px 32px; color: #ffffff; margin: 0 auto; clear: both; transition: all 0.2s ease-in-out;">
        
        <!-- LEFT COMPONENT: COPYRIGHT TEXT BLOCK (Row 1 on Mobile) -->
        <p class="copyright-text-block" style="margin: 0; font-size: 0.8rem; line-height: 1.5; text-align: left; color: #94a3b8;">
          &copy; 2026 filings4u, LLC. All rights reserved.<br>
          A Subsidiary of <a href="https://roselandcompanies.com" target="_blank" rel="noopener noreferrer" style="color: #10b981; text-decoration: none; font-weight: bold; transition: color 0.2s;">Roseland Companies, LLC</a>
        </p>

        <!-- CENTER COMPONENT: MIDDLE LEGAL LINKS (Row 2 on Mobile) -->
        <div class="footer-links-centered-row" style="display: flex; gap: 24px; align-items: center;">
          <a href="privacy-policy.html" style="color: #94a3b8; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color 0.2s;">Privacy Policy</a>
          <a href="terms-of-service.html" style="color: #94a3b8; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color 0.2s;">Terms of Service</a>
          <a href="refund-policy.html" style="color: #94a3b8; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color 0.2s;">Refund Policy</a>
        </div>

        <!-- RIGHT COMPONENT: SECURE TRUST BADGE KEY (Row 3 on Mobile) -->
        <div class="trust-badge" style="background: rgba(255, 255, 255, 0.05); padding: 10px 20px; border-radius: 8px; font-size: 0.75rem; color: #ffffff; display: flex; align-items: center; white-space: nowrap; font-family: system-ui, sans-serif;">
          <span style="color: #10b981; font-weight: 800; margin-right: 8px; letter-spacing: 0.5px;">SECURE</span> 256-bit SSL Encrypted Connection
        </div>

      </footer>
    </div>
  `;

  console.log("[Footer Engine Success] Multi-device responsive breakout parameters applied cleanly inside container target.");
})();


