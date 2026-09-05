// filings4u — canonical Supabase browser client
(function () {
  "use strict";

  function getEnv() {
    return window.FILINGS4U_ENV || {};
  }

  function initializeSupabaseClient() {
    if (window.f4uSupabase) return window.f4uSupabase;

    const env = getEnv();
    const url = String(env.SUPABASE_URL || "").trim();
    const key = String(env.SUPABASE_ANON_KEY || "").trim();

    if (!url || !key) {
      console.warn("[Supabase] Browser client not initialized: SUPABASE_URL or SUPABASE_ANON_KEY is missing.");
      return null;
    }

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      console.error("[Supabase] supabase-js is not loaded.");
      return null;
    }

    const client = window.supabase.createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false
      },
      global: {
        headers: { "x-client-info": "filings4u-wizard" }
      }
    });

    window.f4uSupabase = client;
    window.supabaseClientInstance = client; // compatibility alias
    document.dispatchEvent(new CustomEvent("f4u:supabase-ready", { detail: { client } }));
    console.log("[Supabase] Browser client initialized.");
    return client;
  }

  window.initializeFilings4uSupabase = initializeSupabaseClient;
  initializeSupabaseClient();
})();
