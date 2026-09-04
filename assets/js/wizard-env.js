// filings4u — public browser configuration
// Set the Supabase browser-safe anon/publishable key before production deployment.
// Never put the service-role key in this file.
window.FILINGS4U_ENV = Object.freeze({
  SUPABASE_URL: "https://lrbimrlbskjweynxlgas.supabase.co",
  SUPABASE_ANON_KEY: window.ENV_SUPABASE_ANON_KEY || "",
  STRIPE_PUBLISHABLE_KEY: window.ENV_STRIPE_PUBLISHABLE_KEY || ""
});
