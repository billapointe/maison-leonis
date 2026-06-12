/* ============================================
   cookie-consent.js — bannière de consentement (Loi 25)
   ============================================ */

const COOKIE_CONSENT_KEY = 'leonis_cookie_consent';

const $existingBanner = document.querySelector('.cookie-banner');

if ($existingBanner) {
  $existingBanner.remove();
}

function hideBanner() {
  const $banner = document.querySelector('.cookie-banner');

  if ($banner) {
    $banner.classList.add('cookie-banner--hidden');
    window.setTimeout(() => $banner.remove(), 300);
  }

  document.body.classList.remove('has-cookie-banner');
}

function saveConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch (error) {
    console.error('Impossible de sauvegarder le consentement cookies:', error);
  }

  hideBanner();
}

function createBanner() {
  const $banner = document.createElement('aside');
  $banner.className = 'cookie-banner';
  $banner.setAttribute('role', 'dialog');
  $banner.setAttribute('aria-labelledby', 'cookie-banner-title');
  $banner.setAttribute('aria-describedby', 'cookie-banner-text');
  $banner.setAttribute('aria-live', 'polite');

  $banner.innerHTML = `
    <div class="cookie-banner__inner">
      <div class="cookie-banner__content">
        <p class="cookie-banner__title" id="cookie-banner-title">Cookies et confidentialité</p>
        <p class="cookie-banner__text" id="cookie-banner-text">
          On utilise des témoins essentiels et des services tiers (polices, vidéos intégrées)
          pour faire fonctionner le site. En cliquant «&nbsp;Accepter&nbsp;», tu consens à leur
          utilisation. Consulte notre
          <a class="cookie-banner__link" href="confidentialite.html">politique de confidentialité</a>.
        </p>
      </div>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--outline" type="button" data-consent="essential">
          Essentiels seulement
        </button>
        <button class="cookie-banner__btn cookie-banner__btn--primary" type="button" data-consent="accepted">
          Accepter
        </button>
      </div>
    </div>
  `;

  $banner.addEventListener('click', (event) => {
    const $button = event.target.closest('[data-consent]');

    if (!$button) {
      return;
    }

    saveConsent($button.dataset.consent);
  });

  document.body.appendChild($banner);
  document.body.classList.add('has-cookie-banner');
}

function initCookieConsent() {
  try {
    if (localStorage.getItem(COOKIE_CONSENT_KEY)) {
      return;
    }
  } catch (error) {
    console.error('Impossible de lire le consentement cookies:', error);
  }

  createBanner();
}

initCookieConsent();
