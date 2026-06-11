/* ============================================
   gate.js — formulaire d'accès par mot de passe
   ============================================ */

import { GATE_ENABLED, GATE_PASSWORD_HASH } from './auth-config.js';

const AUTH_STORAGE_KEY = 'leonis_gate_auth';
const DEFAULT_DESTINATION = 'home.html';

const $form = document.querySelector('.gate-form');
const $password = document.querySelector('#gate-password');
const $toggle = document.querySelector('.gate-form__toggle');
const $error = document.querySelector('.gate-form__error');

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getReturnUrl() {
  const params = new URLSearchParams(window.location.search);
  const returnPath = params.get('return');

  if (!returnPath || returnPath.includes('index.html')) {
    return DEFAULT_DESTINATION;
  }

  return returnPath;
}

function showError(message) {
  if (!$error) {
    return;
  }

  $error.textContent = message;
  $error.hidden = false;
  $form?.classList.add('gate-form--error');
}

function clearError() {
  if (!$error) {
    return;
  }

  $error.textContent = '';
  $error.hidden = true;
  $form?.classList.remove('gate-form--error');
}

function redirectToSite() {
  window.location.replace(getReturnUrl());
}

async function handleSubmit(event) {
  event.preventDefault();
  clearError();

  const password = $password?.value.trim() ?? '';

  if (!password) {
    showError('Entre le mot de passe pour accéder au site.');
    $password?.focus();
    return;
  }

  const hash = await hashPassword(password);

  if (hash !== GATE_PASSWORD_HASH) {
    showError('Mot de passe incorrect. Réessaie.');
    if ($password) {
      $password.value = '';
      $password.focus();
    }
    return;
  }

  sessionStorage.setItem(AUTH_STORAGE_KEY, hash);
  redirectToSite();
}

function togglePasswordVisibility() {
  if (!$password || !$toggle) {
    return;
  }

  const isVisible = $password.type === 'text';
  $password.type = isVisible ? 'password' : 'text';
  $toggle.setAttribute('aria-pressed', String(!isVisible));
  $toggle.setAttribute(
    'aria-label',
    isVisible ? 'Afficher le mot de passe' : 'Masquer le mot de passe'
  );
}

function init() {
  if (!GATE_ENABLED) {
    redirectToSite();
    return;
  }

  if (sessionStorage.getItem(AUTH_STORAGE_KEY) === GATE_PASSWORD_HASH) {
    redirectToSite();
    return;
  }

  $form?.addEventListener('submit', handleSubmit);
  $toggle?.addEventListener('click', togglePasswordVisibility);
  $password?.addEventListener('input', clearError);
  $password?.focus();
}

init();
