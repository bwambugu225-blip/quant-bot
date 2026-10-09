// OAuth 2.0 (PKCE) tests.
//
// The pure helpers (PKCE, URL/callback building, expiry) run directly. The
// exchange/refresh paths run against a stubbed `fetch` and a memory
// localStorage, so the real code path — state check, token store, refresh — is
// exercised, not mocked.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  base64UrlEncode, randomVerifier, createCodeChallenge, createPkce, buildAuthorizeUrl,
  parseCallback, sessionFromTokenResponse, isSessionFresh, completeOAuth, ensureAccessToken,
  readOAuthSession, saveOAuthSession, savePending, readPending, clearPending, clearOAuthSession,
  exchangeCode, refreshAccessToken, randomState, MIN_STATE_LENGTH,
  AUTH_URL, TOKEN_URL, DEFAULT_CLIENT_ID, DEFAULT_SCOPE,
} from '../src/lib/oauth.js';

// jsdom-free memory localStorage so the module's storage layer runs for real.
function memoryStorage() {
  const m = new Map();
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    clear: () => m.clear(),
  };
}

const realFetch = globalThis.fetch;
let requests;

beforeEach(() => {
  globalThis.localStorage = memoryStorage();
  requests = [];
  globalThis.fetch = async (url, opts) => {
    requests.push({ url, body: opts?.body, headers: opts?.headers });
    const fields = new URLSearchParams(opts?.body || '');
    if (fields.get('grant_type') === 'refresh_token') {
      return { ok: true, status: 200, json: async () => ({ access_token: 'refreshed', refresh_token: 'r2', expires_in: 3600, scope: 'read trade' }) };
    }
    return { ok: true, status: 200, json: async () => ({ access_token: 'fresh-token', refresh_token: 'r1', expires_in: 3600, token_type: 'Bearer', scope: 'read trade' }) };
  };
});

test('base64UrlEncode drops padding and uses url-safe chars', () => {
  const out = base64UrlEncode(new Uint8Array([251, 255, 190]).buffer);
  assert.ok(!out.includes('=') && !out.includes('+') && !out.includes('/'), out);
});

test('the default scope is trade and state clears Deriv’s 8-char entropy floor', () => {
  assert.equal(DEFAULT_SCOPE, 'trade');
  assert.ok(randomState().length >= MIN_STATE_LENGTH);
});

test('PKCE verifier is 43+ chars and the challenge is a stable SHA-256', async () => {
  const v = randomVerifier();
  assert.ok(v.length >= 43 && v.length <= 128);
  const a = await createCodeChallenge(v);
  const b = await createCodeChallenge(v);
  assert.equal(a, b, 'challenge must be deterministic for a given verifier');
  assert.ok(a.length > 0 && !a.includes('='), 'challenge must be url-safe base64');
  const pkce = await createPkce();
  assert.equal(pkce.code_challenge_method, 'S256');
  assert.equal(pkce.code_challenge, await createCodeChallenge(pkce.code_verifier));
});

test('buildAuthorizeUrl carries the PKCE params, and prompt=registration for signup', () => {
  const base = { clientId: DEFAULT_CLIENT_ID, redirectUri: 'https://x.test/callback', scope: DEFAULT_SCOPE, state: 'st', codeChallenge: 'cc', method: 'S256' };
  const url = new URL(buildAuthorizeUrl({ ...base, mode: 'login' }));
  assert.equal(url.origin + url.pathname, AUTH_URL);
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.get('client_id'), DEFAULT_CLIENT_ID);
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(url.searchParams.get('code_challenge'), 'cc');
  assert.equal(url.searchParams.get('redirect_uri'), 'https://x.test/callback');
  assert.equal(url.searchParams.get('prompt'), null);

  const signup = new URL(buildAuthorizeUrl({ ...base, mode: 'signup' }));
  assert.equal(signup.searchParams.get('prompt'), 'registration');
});

test('parseCallback reads success and error redirects', () => {
  assert.deepEqual(parseCallback('?code=abc&state=s1'), { code: 'abc', state: 's1', error: '', errorDescription: '' });
  const err = parseCallback('?error=access_denied&error_description=Nope');
  assert.equal(err.error, 'access_denied');
  assert.equal(err.errorDescription, 'Nope');
  assert.deepEqual(parseCallback(''), { code: '', state: '', error: '', errorDescription: '' });
});

test('sessionFromTokenResponse stores an absolute expiry and isSessionFresh honours the skew', () => {
  const s = sessionFromTokenResponse({ access_token: 't', expires_in: 3600, scope: 'read' }, { clientId: 'app' });
  assert.equal(s.access_token, 't');
  assert.equal(s.client_id, 'app');
  assert.ok(s.expires_at > Date.now());
  assert.equal(isSessionFresh(s, Date.now()), true);
  // within the 60s skew of expiry counts as stale
  assert.equal(isSessionFresh({ access_token: 't', expires_at: Date.now() + 1000 }, Date.now()), false);
  // a token with no advertised expiry is assumed usable
  assert.equal(isSessionFresh({ access_token: 't', expires_at: 0 }, Date.now()), true);
  assert.equal(isSessionFresh(null), false);
});

test('exchangeCode and refreshAccessToken send the right grant bodies', async () => {
  await exchangeCode({ code: 'c', codeVerifier: 'v', redirectUri: 'r', clientId: 'app' });
  const first = new URLSearchParams(requests[0].body);
  assert.equal(first.get('grant_type'), 'authorization_code');
  assert.equal(first.get('code_verifier'), 'v');
  assert.equal(first.get('code'), 'c');
  assert.equal(requests[0].url, TOKEN_URL);

  await refreshAccessToken('r1', 'app');
  const second = new URLSearchParams(requests[1].body);
  assert.equal(second.get('grant_type'), 'refresh_token');
  assert.equal(second.get('refresh_token'), 'r1');
});

test('completeOAuth rejects a state mismatch without calling the token endpoint', async () => {
  savePending({ code_verifier: 'v', state: 'good', redirect_uri: 'r', client_id: 'app', scope: 'read' });
  await assert.rejects(() => completeOAuth('?code=c&state=bad'), /state mismatch/i);
  assert.equal(requests.length, 0, 'must not exchange a code when state fails');
  assert.equal(readPending().state, 'good', 'pending survives a mismatch so the user can retry');
});

test('completeOAuth exchanges the code, persists the session and clears pending', async () => {
  savePending({ code_verifier: 'v', state: 'good', redirect_uri: 'https://x.test/callback', client_id: 'app', scope: 'read trade' });
  const session = await completeOAuth('?code=c&state=good');
  assert.equal(session.access_token, 'fresh-token');
  assert.equal(session.refresh_token, 'r1');
  assert.equal(readOAuthSession().access_token, 'fresh-token');
  assert.equal(readPending(), null);
  const sent = new URLSearchParams(requests[0].body);
  assert.equal(sent.get('redirect_uri'), 'https://x.test/callback');
  assert.equal(sent.get('code_verifier'), 'v');
});

test('completeOAuth surfaces a Deriv-reported error and clears pending', async () => {
  savePending({ code_verifier: 'v', state: 'good', redirect_uri: 'r', client_id: 'app', scope: 'read' });
  await assert.rejects(() => completeOAuth('?error=invalid_request&error_description=Bad+redirect'), /Bad redirect/);
  assert.equal(readPending(), null);
});

test('ensureAccessToken returns a fresh token untouched, refreshes a stale one, clears on failure', async () => {
  saveOAuthSession(sessionFromTokenResponse({ access_token: 'live', expires_in: 3600 }, { clientId: 'app' }));
  assert.equal(await ensureAccessToken(), 'live');
  assert.equal(requests.length, 0, 'a fresh token needs no network call');

  const stale = sessionFromTokenResponse({ access_token: 'old', refresh_token: 'r1', expires_in: 1 }, { clientId: 'app' });
  stale.expires_at = Date.now() - 10; // force expiry
  saveOAuthSession(stale);
  assert.equal(await ensureAccessToken(), 'refreshed');
  assert.equal(readOAuthSession().access_token, 'refreshed');

  // a failed refresh drops the session instead of looping
  globalThis.fetch = async () => ({ ok: false, status: 400, json: async () => ({ error: 'invalid_grant' }) });
  saveOAuthSession({ access_token: 'old', refresh_token: 'r1', expires_at: Date.now() - 10 });
  assert.equal(await ensureAccessToken(), null);
  assert.equal(readOAuthSession(), null);
});

test('clearOAuthSession / clearPending remove persisted state', () => {
  saveOAuthSession({ access_token: 'x' });
  savePending({ state: 's' });
  clearOAuthSession();
  clearPending();
  assert.equal(readOAuthSession(), null);
  assert.equal(readPending(), null);
});
