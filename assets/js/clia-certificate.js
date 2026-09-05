(function(){"use strict";
window.F4UServiceForms?.register("clia-certificate",{
  "title":"CLIA Certificate Application",
  "subtitle":"CMS-116 laboratory certification intake",
  "authority":"Centers for Medicare & Medicaid Services (CMS)",
  "tooltip":"A CLIA Certificate application is used by a laboratory or testing site to obtain or update federal certification under the Clinical Laboratory Improvement Amendments. The answers below are used to prepare the laboratory's CMS-116 application and related certification information.",
  "sections":[
    {"title":"Facility","description":"Laboratory / testing site.","fields":[
      {"id":"facility_name","label":"Facility / laboratory name","type":"text","required":true},
      {"id":"tax_id","label":"Tax ID / EIN","type":"text","required":true,"format":"ein","help":"Enter the 9-digit federal EIN. It will be formatted automatically."},
      {"id":"npi","label":"NPI (if applicable)","type":"text","format":"npi","help":"If the laboratory has an NPI, enter all 10 digits."},
      {"id":"facility_phone","label":"Facility phone","type":"tel","required":true,"format":"phone"},
      {"id":"facility_email","label":"Facility email","type":"email","required":true,"attrs":"autocomplete=\"email\" inputmode=\"email\""},
      {"id":"facility_street","label":"Street address","type":"text","required":true,"attrs":"autocomplete=\"address-line1\""},
      {"id":"facility_line2","label":"Suite / unit (optional)","type":"text"},
      {"id":"facility_city","label":"City","type":"text","required":true},
      {"id":"facility_state","label":"State","type":"select","required":true,"options":"__STATES__"},
      {"id":"facility_zip","label":"ZIP code","type":"text","required":true,"format":"zip"}
    ]},
    {"title":"Certificate type","description":"Select the CLIA certificate pathway that applies to this laboratory.","fields":[
      {"id":"certificate_type","label":"Certificate type","type":"select","required":true,"options":[["waiver","Certificate of Waiver"],["ppmp","Provider-Performed Microscopy Procedures"],["registration","Certificate of Registration"],["compliance","Certificate of Compliance"],["accreditation","Certificate of Accreditation"]]},
      {"id":"testing_start_date","label":"Date testing began / will begin","type":"date","required":true},
      {"id":"testing_schedule","label":"Typical testing schedule","type":"select","required":true,"options":[["weekdays","Weekdays"],["weekends","Weekends only"],["daily","Seven days a week"],["appointment","By appointment / variable schedule"],["other","Other schedule"]]},
      {"id":"hours","label":"Other days and hours of laboratory testing","type":"textarea","required":true,"showWhen":{"field":"testing_schedule","equals":"other"},"span":"full"}
    ]},
    {"title":"Laboratory type","description":"Facility category and ownership.","fields":[
      {"id":"lab_type","label":"Type of laboratory","type":"select","required":true,"options":[["physician_office","Physician office"],["hospital","Hospital"],["independent","Independent laboratory"],["nursing","Skilled nursing / nursing facility"],["home_health","Home health agency"],["pharmacy","Pharmacy"],["ambulatory","Ambulatory surgery center"],["community_clinic","Community clinic / health center"],["other","Other"]]},
      {"id":"lab_type_other","label":"Other laboratory type","type":"text","required":true,"showWhen":{"field":"lab_type","equals":"other"}},
      {"id":"ownership_type","label":"Ownership type","type":"select","required":true,"options":[["private_for_profit","Private — for profit"],["private_nonprofit","Private — nonprofit"],["federal","Federal government"],["state","State government"],["county","County government"],["city","City / municipal government"],["other","Other"]]},
      {"id":"owner_name","label":"Owner / legal entity name","type":"text","required":true}
    ]},
    {"title":"Testing volume","description":"Estimated annual testing volume based on the certificate type selected.","fields":[
      {"id":"waived_tests","label":"Estimated annual waived tests","type":"number","required":true,"attrs":"min=\"0\" inputmode=\"numeric\""},
      {"id":"ppmp_tests","label":"Estimated annual PPMP tests","type":"number","required":true,"attrs":"min=\"0\" inputmode=\"numeric\"","showWhen":{"field":"certificate_type","in":["ppmp","registration","compliance","accreditation"]}},
      {"id":"nonwaived_tests","label":"Estimated annual nonwaived tests","type":"number","required":true,"attrs":"min=\"0\" inputmode=\"numeric\"","showWhen":{"field":"certificate_type","in":["registration","compliance","accreditation"]}}
    ]},
    {"title":"Specialties / subspecialties","description":"Nonwaived testing categories.","showWhen":{"field":"certificate_type","in":["registration","compliance","accreditation"]},"fields":[
      {"id":"specialties","label":"Specialties / subspecialties and estimated annual test volume","type":"textarea","required":true,"placeholder":"Example: Chemistry — 1,200 tests; Hematology — 800 tests","span":"full"}
    ]},
    {"title":"Laboratory director","description":"Director / responsible individual.","fields":[
      {"id":"director_name","label":"Laboratory director full name","type":"text","required":true},
      {"id":"director_credentials","label":"Credentials / degree","type":"select","required":true,"options":[["MD","MD"],["DO","DO"],["PhD","PhD"],["DSc","DSc"],["DDS","DDS"],["DMD","DMD"],["NP","Nurse Practitioner"],["PA","Physician Assistant"],["other","Other"]]},
      {"id":"director_credentials_other","label":"Other credentials / degree","type":"text","required":true,"showWhen":{"field":"director_credentials","equals":"other"}},
      {"id":"director_license","label":"State license number (if applicable)","type":"text"},
      {"id":"director_phone","label":"Director phone","type":"tel","required":true,"format":"phone"},
      {"id":"director_email","label":"Director email","type":"email","required":true}
    ]},
    {"title":"Application contact","description":"Person filings4u may contact about this application.","fields":[
      {"id":"first_name","label":"First name","type":"text","required":true,"attrs":"autocomplete=\"given-name\""},
      {"id":"last_name","label":"Last name","type":"text","required":true,"attrs":"autocomplete=\"family-name\""},
      {"id":"email_address","label":"Email address","type":"email","required":true,"attrs":"autocomplete=\"email\" inputmode=\"email\""},
      {"id":"phone_number","label":"Phone number","type":"tel","required":true,"format":"phone"}
    ]}
  ]
});
})();
