(function(){
"use strict";

window.renderWizardStep5=function(){
  const host=document.getElementById("step-5-injection-placeholder");
  if(!host)return;

  const w=window.F4UWizard;
  const r=w.refreshRoute();
  const a=w.state.authorization||{};
  const serviceName=r.service?.name||w.title(r.serviceKey);
  const jurisdiction=r.jurisdiction||"";

  host.innerHTML=`
    <section class="f4u-entry-layout f4u-poa-step">
      <div class="f4u-entry-copy">
        <span class="f4u-entry-kicker">Step 5 · Power of Attorney</span>
        <h2>Power of Attorney & Digital Execution</h2>
        <p>Review and electronically sign the limited authorization that allows filings4u, LLC to prepare, process, and submit documents for this order.</p>
      </div>

      <div id="poa-dynamic-state-tooltip" class="f4u-poa-status ${a.document_reviewed?"is-complete":""}" role="status" aria-live="polite">
        <span id="poa-tooltip-icon" class="f4u-poa-status__icon" aria-hidden="true">${a.document_reviewed?"✓":"!"}</span>
        <span id="poa-tooltip-text">
          ${a.document_reviewed
            ? `Document reviewed. You may now enter your legal name and complete the electronic signature.`
            : `Scroll through the entire authorization agreement to the bottom before signing. Your signature fields will unlock when the review is complete.`}
        </span>
      </div>

      <article class="f4u-poa-document" id="f4u-poa-document">
        <div class="f4u-document-brand">
          <img src="images/logo.png" alt="filings4u">
          <div>
            <strong>filings4u, LLC</strong>
            <span>A Subsidiary of Roseland Companies, LLC</span>
          </div>
        </div>

        <div class="f4u-poa-document__meta">
          <span>Limited Power of Attorney</span>
          <span>${w.esc(serviceName)}</span>
          ${jurisdiction?`<span>${w.esc(jurisdiction)}</span>`:""}
        </div>

        <h3>Limited Power of Attorney & Corporate Agency Agreement</h3>

        <div id="poa-scroll-box" class="f4u-poa-scroll" tabindex="0" aria-label="Limited Power of Attorney document">
          <p>
            <strong>LIMITED POWER OF ATTORNEY &amp; CORPORATE AGENCY AGREEMENT</strong>
          </p>

          <p>
            <strong>WHEREAS,</strong> the undersigned Principal appoints and authorizes
            <strong>filings4u, LLC</strong>, an Illinois limited liability company and a subsidiary of
            <strong>Roseland Companies, LLC</strong>, together with its authorized operational agents, officers,
            employees, and designees, to act as the Principal's limited Attorney-in-Fact and Corporate Agent
            solely under the terms and limitations stated in this Agreement.
          </p>

          <h4>1. Express Limited Scope of Appointment</h4>
          <p>
            This appointment is limited to administrative, regulatory, filing, registration, compliance,
            document-preparation, document-transmission, and related ministerial activities reasonably necessary
            to perform the service purchased by the Principal through the filings4u digital filing wizard.
          </p>
          <p>
            For this order, the authorization applies specifically to
            <strong>${w.esc(serviceName)}</strong>${jurisdiction?` in <strong>${w.esc(jurisdiction)}</strong>`:""}.
            The Attorney-in-Fact may prepare, complete, sign where permitted and authorized, correct, amend,
            transmit, submit, receive, and process applications, registrations, forms, renewals, supporting
            documents, and related correspondence necessary to complete that service.
          </p>

          <h4>2. Grant of Operational Powers</h4>
          <p>
            The Principal authorizes filings4u, LLC to communicate with applicable state filing offices,
            federal agencies, regulatory bodies, registries, tax authorities, licensing agencies, and other
            governmental or administrative entities as reasonably necessary to carry out the selected service.
          </p>
          <p>
            This limited authorization may include responding to routine filing deficiencies, correcting
            clerical or formatting issues, transmitting customer-approved information, receiving filing
            confirmations, and taking other administrative actions reasonably required to complete the order.
          </p>

          <h4>3. Customer Information & Accuracy</h4>
          <p>
            The Principal certifies that the information submitted through the filings4u wizard is complete and
            accurate to the best of the Principal's knowledge and that the Principal has authority to act for
            the applicant, business, organization, carrier, or other entity identified in this order.
          </p>
          <p>
            filings4u, LLC may rely on the information supplied by the Principal and is not responsible for
            inaccuracies, omissions, or delays caused by information supplied by the Principal or by government
            agency requirements outside filings4u's reasonable control.
          </p>

          <h4>4. Electronic Signatures & Intent</h4>
          <p>
            The Principal agrees to conduct this transaction electronically and expressly intends the typed
            first and last name entered below, together with the associated electronic record and execution
            timestamp, to serve as the Principal's electronic signature for this authorization.
          </p>
          <p>
            The Principal acknowledges that electronic signatures and electronic records may be used in
            accordance with applicable federal and state electronic-transactions law, including the federal
            Electronic Signatures in Global and National Commerce Act (ESIGN) and applicable enactments of the
            Uniform Electronic Transactions Act (UETA), where those laws apply.
          </p>

          <h4>5. No Attorney-Client Relationship</h4>
          <p>
            This authorization does not create an attorney-client relationship and does not appoint filings4u,
            LLC as an attorney-at-law. filings4u, LLC provides filing, registration, compliance, document
            preparation, and administrative support services and does not provide legal, tax, accounting, or
            other professional advice.
          </p>

          <h4>6. Ratification, Revocation & Duration</h4>
          <p>
            The Principal ratifies lawful administrative acts performed by filings4u, LLC within the scope of
            this authorization. This authorization becomes effective when electronically executed and remains
            effective only for the selected order and reasonably related filing communications unless earlier
            revoked in writing or as otherwise required by applicable law.
          </p>
          <p>
            Revocation does not affect actions already taken in reasonable reliance on this authorization before
            filings4u receives and can reasonably process the revocation. A revocation request may be submitted
            through an available verified client portal workflow or by contacting filings4u support.
          </p>

          <h4>7. Corporate Entity Information</h4>
          <p>
            <strong>filings4u, LLC</strong><br>
            A Subsidiary of Roseland Companies, LLC<br>
            State of Illinois<br>
            Support: <a href="mailto:support@filings4u.com">support@filings4u.com</a>
          </p>

          <div class="f4u-poa-scroll-end" aria-hidden="true">
            End of authorization document
          </div>
        </div>

        <div id="poa_input_wrapper" class="f4u-poa-signature-fields ${a.document_reviewed?"is-unlocked":""}">
          <div class="f4u-poa-sign-grid">
            <div class="f4u-form-field">
              <label for="poa_first_name">First name <span aria-hidden="true">*</span></label>
              <input id="poa_first_name" class="wizard-input-field" autocomplete="given-name"
                value="${w.esc(a.first_name||"")}" ${a.document_reviewed?"":"disabled"} required>
            </div>
            <div class="f4u-form-field">
              <label for="poa_last_name">Last name <span aria-hidden="true">*</span></label>
              <input id="poa_last_name" class="wizard-input-field" autocomplete="family-name"
                value="${w.esc(a.last_name||"")}" ${a.document_reviewed?"":"disabled"} required>
            </div>
          </div>
        </div>

        <div class="f4u-signature-viewport ${a.document_reviewed?"is-unlocked":""}">
          <span>Legal electronic signature preview</span>
          <strong id="poa_signature_preview">${w.esc([a.first_name,a.last_name].filter(Boolean).join(" ")||"Your signature appears here")}</strong>
          <small id="poa-signature-time">
            ${w.esc(a.executed_at?`Signed electronically · ${new Date(a.executed_at).toLocaleString()}`:"Date and time are recorded when you sign and continue.")}
          </small>
        </div>

        <div id="poa_consent_wrapper" class="f4u-poa-consent-wrap ${a.document_reviewed?"is-unlocked":""}">
          <label class="f4u-consent-row">
            <input type="checkbox" id="poa_consent_checkbox" ${a.consent?"checked":""} ${a.document_reviewed?"":"disabled"}>
            <span>
              I have reviewed this Limited Power of Attorney and consent to electronic execution. I intend my typed
              first and last name to serve as my electronic signature. I certify that I am authorized to act
              for the applicant or business identified in this order.
            </span>
          </label>
        </div>
      </article>

      <div class="wizard-action-footer">
        <button id="step5-back" type="button" class="btn-wizard-secondary">← Back to Recommended Services</button>
        <button id="step5-next" type="button" class="btn-wizard-main" ${a.document_reviewed?"":'aria-disabled="true"'}>
          Sign & Continue to Summary
        </button>
      </div>
    </section>`;

  const scrollBox=document.getElementById("poa-scroll-box");
  const inputWrap=document.getElementById("poa_input_wrapper");
  const consentWrap=document.getElementById("poa_consent_wrapper");
  const consent=document.getElementById("poa_consent_checkbox");
  const first=document.getElementById("poa_first_name");
  const last=document.getElementById("poa_last_name");
  const preview=document.getElementById("poa_signature_preview");
  const next=document.getElementById("step5-next");
  const status=document.getElementById("poa-dynamic-state-tooltip");
  const statusIcon=document.getElementById("poa-tooltip-icon");
  const statusText=document.getElementById("poa-tooltip-text");

  let reviewed=!!a.document_reviewed;

  function updateSignature(){
    const name=[first?.value.trim(),last?.value.trim()].filter(Boolean).join(" ");
    if(preview)preview.textContent=name||"Your signature appears here";
  }

  function unlockSignature(){
    if(reviewed)return;
    reviewed=true;

    inputWrap?.classList.add("is-unlocked");
    consentWrap?.classList.add("is-unlocked");
    document.querySelector(".f4u-signature-viewport")?.classList.add("is-unlocked");

    if(first)first.disabled=false;
    if(last)last.disabled=false;
    if(consent)consent.disabled=false;
    if(next){next.disabled=false;next.removeAttribute("aria-disabled");}

    status?.classList.add("is-complete");
    if(statusIcon)statusIcon.textContent="✓";
    if(statusText)statusText.textContent="Document reviewed. You may now enter your legal name and complete the electronic signature.";

    w.state.authorization={
      ...(w.state.authorization||{}),
      document_reviewed:true,
      document_reviewed_at:new Date().toISOString(),
      service_key:r.serviceKey,
      jurisdiction:r.jurisdiction||null
    };
    w.persist();
  }

  function checkScroll(){
    if(!scrollBox||reviewed)return;
    const threshold=12;
    if(scrollBox.scrollTop+scrollBox.clientHeight>=scrollBox.scrollHeight-threshold){
      unlockSignature();
    }
  }

  scrollBox?.addEventListener("scroll",checkScroll,{passive:true});
  // If content is short enough to fit without scrolling, do not trap the customer.
  requestAnimationFrame(()=>{
    if(scrollBox && scrollBox.scrollHeight<=scrollBox.clientHeight+12)unlockSignature();
  });

  first?.addEventListener("input",updateSignature);
  last?.addEventListener("input",updateSignature);
  updateSignature();

  document.getElementById("step5-back")?.addEventListener("click",()=>w.go(4));

  next?.addEventListener("click",()=>{
    if(!reviewed){
      w.notify(
        "Review the authorization first",
        "Scroll to the bottom of the Power of Attorney document before signing.",
        "error"
      );
      status?.classList.add("needs-attention");
      if(statusText)statusText.textContent="Please scroll through the entire Power of Attorney agreement to the bottom before you can sign and continue.";
      scrollBox?.focus();
      scrollBox?.scrollIntoView({block:"center"});
      return;
    }

    const f=String(first?.value||"").trim();
    const l=String(last?.value||"").trim();
    const hasConsent=!!consent?.checked;

    if(!f||!l){
      w.notify(
        "Signature name required",
        "Enter both the first and last name of the authorized signer.",
        "error"
      );
      (!f?first:last)?.focus();
      return;
    }

    if(!hasConsent){
      w.notify(
        "Authorization required",
        "Check the authorization box before continuing.",
        "error"
      );
      consent?.focus();
      return;
    }

    const executedAt=new Date().toISOString();
    const signerName=`${f} ${l}`;

    w.state.authorization={
      first_name:f,
      last_name:l,
      signer_name:signerName,
      signature:signerName,
      consent:true,
      document_reviewed:true,
      document_reviewed_at:a.document_reviewed_at||w.state.authorization?.document_reviewed_at||executedAt,
      executed_at:executedAt,
      service_key:r.serviceKey,
      service_name:serviceName,
      jurisdiction:r.jurisdiction||null,
      document_title:"Limited Power of Attorney & Corporate Agency Agreement",
      document_version:"2026-09-05",
      principal_acknowledgment:true,
      electronic_signature_intent:true,
      parent_company:"Roseland Companies, LLC"
    };

    w.persist();
    w.go(6);
  });
};

})();
