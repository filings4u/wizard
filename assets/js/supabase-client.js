/**
 * filings4u portal-aware Supabase client
 * Replaces the old shared assets/js/supabase-client.js.
 * Keeps Admin and Client sessions isolated on the same portal.filings4u.com origin.
 */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://lrbimrlbskjweynxlgas.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RlmqwQM8ATOc7-ML9hvwgw_UljUEavh';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[filings4u] Supabase JS v2 must load before assets/js/supabase-client.js');
    return;
  }

  const page = (location.pathname.split('/').pop() || '').toLowerCase();

  function resolvePortal() {
    if (page.startsWith('admin-')) return 'admin';
    if (
      page.startsWith('client-') ||
      page === 'customer-login.html' ||
      page === 'customer-login' ||
      page === 'reset-password.html' ||
      page === 'reset-password'
    ) return 'client';
    return 'public';
  }

  const portal = resolvePortal();
  const storageKeys = Object.freeze({
    admin: 'filings4u-admin-auth',
    client: 'filings4u-client-auth',
    public: 'filings4u-public-auth'
  });
  const storageKey = storageKeys[portal];

  // One client per page, but each portal gets a completely different persisted session key.
  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey,
        flowType: 'pkce'
      }
    }
  );

  // Existing portal code expects this compatibility name.
  window.filings4uSupabase = client;

  // Explicit aliases prevent future page code from accidentally grabbing the wrong portal client.
  if (portal === 'admin') window.filings4uAdminSupabase = client;
  if (portal === 'client') window.filings4uClientSupabase = client;

  window.FILINGS4U_PORTAL = portal;
  window.FILINGS4U_AUTH_STORAGE_KEY = storageKey;
  window.FILINGS4U_SUPABASE_URL = SUPABASE_URL;
  window.FILINGS4U_SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY;

  // Local logout only. Never invalidate another browser portal session.
  window.filings4uSignOut = async function filings4uSignOut() {
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) throw error;
  };

  console.info(`[filings4u] ${portal} auth namespace: ${storageKey}`);
})();
