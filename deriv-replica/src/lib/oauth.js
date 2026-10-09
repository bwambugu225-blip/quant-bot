// Deriv OAuth 2.0 — Authorization Code flow with PKCE.
//
// This is the primary login method: the user authenticates on Deriv's own
// domain and the app receives an access token usable as `Authorization: Bearer`
// on the REST/OTP calls that open the trading WebSocket. Reference:
// https://developers.deriv.com/llms/oauth.md
//
// The token endpoint is called directly from the browser (PKCE makes the
// client secret unnecessary, and the endpoint returns CORS headers). Deriv's
// guide suggests a backend exchange; if this app is later given one, only
// `exchangeCode`/`refresh` need to point at it instead — the rest is unchanged.
//
// The module stays importable in Node (tests run there): anything that needs
// `location`/`localStorage` is guarded, and the pure helpers (PKCE, URL and
// callback building, expiry) have no browser dependency.

const AUTH_URL = 'https://auth.deriv.com/oauth2/auth';
const TOKEN_URL = 'https://auth.deriv.com/oauth2/token';
const DEFAULT_CLIENT_ID = '33JFxN3sbe2usdFigbMb8';

// Scope granted to this app. Deriv rejected `read trade` for our App ID with
// `invalid_scope`; `trade` alone is what the client is allowed to request.
export const DEFAULT_SCOPE = 'trade';

// Deriv requires `state` to carry at least 8 characters of entropy.
export const MIN_STATE_LENGTH = 8;

const TOKEN_KEY = 'deriv_oauth';       // { access_token, refresh_token, expires_at, scope, client_id }
const PKCE_KEY = 'deriv_oauth_pkce';   // { verifier, state, redirect_uri, client_id, scope, mode }

// ── storage (guarded for non-browser use) ──────────────────────────────────
function store() {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch (e) {
    return null;
  }
}

function readJson(key) {
  const s = store();
  if (!s) return null;
  try {
    const raw = s.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function writeJson(key, value) {
  const s = store();
  if (!s) return null;
  try {
    if (value == null) s.removeItem(key);
    else s.setItem(key, JSON.stringify(value));
  } catch (e) { /* storage may be blocked */ }
  return value;
}

// Build-time overrides. Referenced statically so Vite substitutes them at build
// time; dynamic `import.meta.env[name]` would not be replaced in the bundle.
const ENV_APP_ID = (import.meta.env && import.meta.env.VITE_DERIV_APP_ID) || '';
const ENV_REDIRECT = (import.meta.env && import.meta.env.VITE_DERIV_REDIRECT_URI) || '';

// The App ID is the OAuth client id. Order: an explicit runtime override
// (localStorage, set via the Account menu), then a build-time env var, then the
// built-in default.
export function oauthClientId() {
  const s = store();
  try { return (s && s.getItem('deriv_app_id')) || ENV_APP_ID || DEFAULT_CLIENT_ID; }
  catch (e) { return ENV_APP_ID || DEFAULT_CLIENT_ID; }
}

// Must match one of the redirect URLs pre-registered on the Deriv app exactly.
// Our App ID has `…/callback.html` registered, so that is the default; a
// build-time override covers deployments that register `/callback` instead.
// `callback.html` bridges to the SPA's /callback route to run the exchange.
export function oauthRedirectUri() {
  if (ENV_REDIRECT) return ENV_REDIRECT;
  if (typeof location === 'undefined') return '';
  return `${location.origin}/callback.html`;
}

// ── PKCE ───────────────────────────────────────────────────────────────────
export function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function randomVerifier(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return base64UrlEncode(buf);
}

export function randomState() {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return base64UrlEncode(buf);
}

export async function createCodeChallenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64UrlEncode(digest);
}

export async function createPkce() {
  const code_verifier = randomVerifier();
  return {
    code_verifier,
    code_challenge: await createCodeChallenge(code_verifier),
    code_challenge_method: 'S256',
  };
}

// ── URL building ───────────────────────────────────────────────────────────
// Sign-up uses the same endpoint with `prompt=registration`.
export function buildAuthorizeUrl({ clientId, redirectUri, scope, state, codeChallenge, method = 'S256', mode = 'login' }) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: method,
  });
  if (mode === 'signup') params.set('prompt', 'registration');
  return `${AUTH_URL}?${params.toString()}`;
}

// Parse Deriv's redirect back to us. Success carries `code`+`state`; failure
// carries `error`(+`error_description`).
export function parseCallback(search) {
  const params = new URLSearchParams(search || '');
  return {
    code: params.get('code') || '',
    state: params.get('state') || '',
    error: params.get('error') || '',
    errorDescription: params.get('error_description') || '',
  };
}

// ── session persistence ────────────────────────────────────────────────────
export function readOAuthSession() { return readJson(TOKEN_KEY); }
export function saveOAuthSession(session) { return writeJson(TOKEN_KEY, session); }
export function clearOAuthSession() { return writeJson(TOKEN_KEY, null); }

export function readPending() { return readJson(PKCE_KEY); }
export function savePending(pending) { return writeJson(PKCE_KEY, pending); }
export function clearPending() { return writeJson(PKCE_KEY, null); }

// `expires_in` is seconds from now; store an absolute ms deadline so a reload
// can decide whether a refresh is needed.
export function sessionFromTokenResponse(body, { clientId, scope } = {}) {
  const now = Date.now();
  return {
    access_token: body.access_token,
    refresh_token: body.refresh_token || '',
    scope: body.scope || scope || '',
    token_type: body.token_type || 'Bearer',
    client_id: clientId || '',
    expires_at: body.expires_in ? now + Number(body.expires_in) * 1000 : 0,
    obtained_at: now,
  };
}

// Treat a token as stale a minute early so a request never races the expiry.
export function isSessionFresh(session, now = Date.now(), skewMs = 60000) {
  if (!session || !session.access_token) return false;
  if (!session.expires_at) return true; // no expiry advertised — assume usable
  return session.expires_at - skewMs > now;
}

// ── network ────────────────────────────────────────────────────────────────
async function postToken(fields) {
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  });
  const body = await resp.json().catch(() => null);
  if (!resp.ok || body?.error) {
    const msg = body?.error_description || body?.error || `Token request failed (HTTP ${resp.status})`;
    throw new Error(msg);
  }
  return body;
}

export async function exchangeCode({ code, codeVerifier, redirectUri, clientId }) {
  return postToken({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });
}

export async function refreshAccessToken(refreshToken, clientId) {
  return postToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });
}

// Refresh the stored session if it is close to expiry. Returns the access token
// (possibly just refreshed) or null when there is no usable session. A failed
// refresh clears the session so the app falls back to the login prompt.
export async function ensureAccessToken() {
  const session = readOAuthSession();
  if (!session?.access_token) return null;
  if (isSessionFresh(session)) return session.access_token;
  if (!session.refresh_token) { clearOAuthSession(); return null; }
  try {
    const body = await refreshAccessToken(session.refresh_token, session.client_id || oauthClientId());
    const next = sessionFromTokenResponse(body, { clientId: session.client_id, scope: session.scope });
    if (!next.refresh_token) next.refresh_token = session.refresh_token;
    saveOAuthSession(next);
    return next.access_token;
  } catch (e) {
    clearOAuthSession();
    return null;
  }
}

// ── entry points ───────────────────────────────────────────────────────────
// Begin the flow: store the verifier/state, then send the browser to Deriv.
// `mode` is 'login' or 'signup'.
export async function beginOAuth(mode = 'login') {
  const pkce = await createPkce();
  const state = randomState();
  const clientId = oauthClientId();
  const redirectUri = oauthRedirectUri();
  const scope = DEFAULT_SCOPE;
  savePending({ ...pkce, state, redirect_uri: redirectUri, client_id: clientId, scope, mode });
  const url = buildAuthorizeUrl({
    clientId, redirectUri, scope, state,
    codeChallenge: pkce.code_challenge, method: pkce.code_challenge_method, mode,
  });
  if (typeof location !== 'undefined') location.assign(url);
  return url;
}

// Complete the flow on /callback: verify state, exchange the code, persist the
// session. Returns the stored session; throws on mismatch or exchange failure.
export async function completeOAuth(search) {
  const { code, state, error, errorDescription } = parseCallback(search);
  const pending = readPending();
  if (error) {
    clearPending();
    throw new Error(errorDescription || error);
  }
  if (!pending) throw new Error('No pending login — start again from the log in page.');
  if (!state || state !== pending.state) throw new Error('Login state mismatch — start again from the log in page.');
  if (!code) throw new Error('Login was cancelled before returning a code.');

  const body = await exchangeCode({
    code,
    codeVerifier: pending.code_verifier,
    redirectUri: pending.redirect_uri,
    clientId: pending.client_id,
  });
  const session = sessionFromTokenResponse(body, { clientId: pending.client_id, scope: pending.scope });
  saveOAuthSession(session);
  clearPending();
  return session;
}

// Human-readable redirect for the login UI's error banner.
export function describeOAuthError(err) {
  const m = (err?.message || '').toLowerCase();
  if (m.includes('invalid_client')) return 'This app is not recognised by Deriv. Check the App ID.';
  if (m.includes('redirect_uri')) return 'Redirect URI mismatch — it must be registered on the Deriv app.';
  if (m.includes('invalid_grant')) return 'The login code expired or was already used. Try again.';
  if (m.includes('access_denied')) return 'Login was cancelled.';
  return err?.message || 'Login failed. Please try again.';
}

export { AUTH_URL, TOKEN_URL, DEFAULT_CLIENT_ID };
