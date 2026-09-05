// filings4u — public browser configuration
// The Supabase anon key is browser-safe and is protected by RLS / Edge Functions.
// Never place the Supabase service-role key in frontend files.
window.FILINGS4U_ENV = Object.freeze({
  SUPABASE_URL: "https://lrbimrlbskjweynxlgas.supabase.co",
  SUPABASE_ANON_KEY: window.ENV_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmltcmxic2tqd2V5bnhsZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjQ0NTYsImV4cCI6MjA5NDEwMDQ1Nn0.I8fQ6ZjA9oaTqJCF-7Z7vUboXC8zv2cogBv4PC_1ihU",
  STRIPE_PUBLISHABLE_KEY: window.ENV_STRIPE_PUBLISHABLE_KEY || ""
});
