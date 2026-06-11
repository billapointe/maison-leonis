/* ============================================
   auth-guard.js — redirige vers la porte si non authentifié
   ============================================ */

import { GATE_ENABLED, GATE_PASSWORD_HASH } from './auth-config.js';

const AUTH_STORAGE_KEY = 'leonis_gate_auth';
const GATE_PAGE = 'index.html';

function isAuthenticated() {
  if (!GATE_ENABLED) {
    return true;
  }

  return sessionStorage.getItem(AUTH_STORAGE_KEY) === GATE_PASSWORD_HASH;
}

if (!isAuthenticated()) {
  const returnPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const gateUrl = new URL(GATE_PAGE, window.location.href);

  if (returnPath && returnPath !== '/' && !returnPath.endsWith(GATE_PAGE)) {
    gateUrl.searchParams.set('return', returnPath);
  }

  window.location.replace(gateUrl.toString());
}
