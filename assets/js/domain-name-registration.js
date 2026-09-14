(function(){"use strict";
window.F4UServiceForms?.register("domain-name-registration",{
  "title":"Domain Name Registration",
  "subtitle":"Register, transfer, or configure a business domain name",
  "authority":"filings4u Domain Services",
  "notice":"Domain availability, registry eligibility, premium-domain pricing, registrar fees, and final registration terms are confirmed during fulfillment. Transfer authorization codes are collected separately through a protected workflow and are not stored in the general wizard intake.",
  "sections":[
    {
      "title":"Domain request",
      "description":"Tell us which domain you want and how it will be used.",
      "fields":[
        {"id":"request_type","label":"What do you need?","type":"select","required":true,"options":[["new_registration","New domain registration"],["transfer","Transfer an existing domain"],["dns_only","DNS / nameserver setup for an existing domain"]]},
        {"id":"preferred_domain","label":"Preferred domain name","type":"text","required":true,"placeholder":"example.com","attrs":"autocomplete=\"off\" autocapitalize=\"none\" spellcheck=\"false\""},
        {"id":"alternate_domain_1","label":"Alternate domain #1","type":"text","placeholder":"example.net","attrs":"autocomplete=\"off\" autocapitalize=\"none\" spellcheck=\"false\""},
        {"id":"alternate_domain_2","label":"Alternate domain #2","type":"text","placeholder":"example.co","attrs":"autocomplete=\"off\" autocapitalize=\"none\" spellcheck=\"false\""},
        {"id":"alternate_domain_3","label":"Alternate domain #3","type":"text","placeholder":"example.us","attrs":"autocomplete=\"off\" autocapitalize=\"none\" spellcheck=\"false\""},
        {"id":"domain_use","label":"Primary use","type":"select","required":true,"options":[["website","Business website"],["email","Business email"],["website_email","Website and email"],["redirect","Redirect / forwarding"],["brand_protection","Brand protection / reserve domain"],["other","Other"]]}
      ]
    },
    {
      "title":"Registrant information",
      "description":"Provide the legal registrant and primary contact information.",
      "fields":[
        {"id":"registrant_type","label":"Registrant type","type":"select","required":true,"options":[["business","Business / organization"],["individual","Individual"]]},
        {"id":"organization_name","label":"Legal business / organization name","type":"text","showWhen":{"field":"registrant_type","equals":"business"}},
        {"id":"first_name","label":"Registrant first name","type":"text","required":true},
        {"id":"last_name","label":"Registrant last name","type":"text","required":true},
        {"id":"email","label":"Registrant email","type":"email","required":true},
        {"id":"phone","label":"Registrant phone","type":"tel","required":true},
        {"id":"address1","label":"Street address","type":"text","required":true},
        {"id":"address2","label":"Address line 2","type":"text"},
        {"id":"city","label":"City","type":"text","required":true},
        {"id":"state_region","label":"State / province / region","type":"text","required":true},
        {"id":"postal_code","label":"Postal code","type":"text","required":true},
        {"id":"country","label":"Country","type":"text","required":true,"value":"US"}
      ]
    },
    {
      "title":"Privacy, renewal & DNS",
      "description":"Choose registration and DNS preferences.",
      "fields":[
        {"id":"privacy_requested","label":"Request domain privacy where available","type":"checkbox"},
        {"id":"auto_renew","label":"Enable auto-renew when supported","type":"checkbox"},
        {"id":"registration_years","label":"Initial registration term","type":"select","required":true,"options":[["1","1 year"],["2","2 years"],["3","3 years"],["5","5 years"]]},
        {"id":"dns_mode","label":"DNS setup","type":"select","required":true,"options":[["default","Use default registrar DNS"],["nameservers","I have nameservers"],["records","I need DNS records configured"],["later","Configure later"]]},
        {"id":"nameserver_1","label":"Nameserver 1","type":"text","showWhen":{"field":"dns_mode","equals":"nameservers"}},
        {"id":"nameserver_2","label":"Nameserver 2","type":"text","showWhen":{"field":"dns_mode","equals":"nameservers"}},
        {"id":"website_provider","label":"Website / hosting provider","type":"text"},
        {"id":"email_provider","label":"Business email provider","type":"text"},
        {"id":"dns_instructions","label":"DNS records or setup instructions","type":"textarea"}
      ]
    },
    {
      "title":"Authorization",
      "description":"Confirm authority and provide any transfer context.",
      "fields":[
        {"id":"existing_registrar","label":"Current registrar (transfer / existing domain)","type":"text","showWhen":{"field":"request_type","notEquals":"new_registration"}},
        {"id":"transfer_code_delivery","label":"Transfer authorization code","type":"paragraph","help":"For domain transfers, filings4u will request the registrar transfer authorization code through a protected fulfillment channel after checkout. Do not place the code in notes or other wizard fields.","showWhen":{"field":"request_type","equals":"transfer"}},
        {"id":"registrant_attestation","label":"I confirm I am authorized to register, transfer, or configure the requested domain on behalf of the registrant.","type":"checkbox","required":true},
        {"id":"availability_acknowledgement","label":"I understand domain availability and final registry pricing are confirmed only at the time of registration.","type":"checkbox","required":true},
        {"id":"notes","label":"Additional instructions","type":"textarea"}
      ]
    }
  ]
});})();
