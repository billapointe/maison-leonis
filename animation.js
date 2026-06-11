/*
  animation.js
  Révélations progressives du hero au chargement, carrousel hero mobile, accordéon FAQ, bouton retour en haut.
 */

const STAGGER_MS = 95;
const HERO_CAROUSEL_INTERVAL_MS = 2500;
const HERO_CAROUSEL_MOBILE_MAX_WIDTH = 768;

function initHeroReveal() {
  const $animated = document.querySelectorAll("[data-animate]");
  if ($animated.length === 0) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    $animated.forEach(($el) => {
      $el.classList.add("is-visible");
    });
    return;
  }

  window.requestAnimationFrame(() => {
    $animated.forEach(($el, index) => {
      const delay = `${index * STAGGER_MS}ms`;
      $el.style.transitionDelay = delay;
      $el.classList.add("is-visible");
    });
  });
}

function initFaqAccordion() {
  const $items = document.querySelectorAll(".faq__item");
  if ($items.length === 0) return;

  $items.forEach(($item) => {
    const $btn = $item.querySelector(".faq__question");
    if (!$btn || !($btn instanceof HTMLButtonElement)) return;

    $btn.addEventListener("click", () => {
      const willOpen = !$item.classList.contains("is-open");
      $item.classList.toggle("is-open", willOpen);
      $btn.setAttribute("aria-expanded", String(willOpen));
    });
  });
}

const SCROLL_TOP_THRESHOLD_PX = 48;

function initScrollTop() {
  const $btn = document.querySelector(".scroll-top");
  if (!$btn || !($btn instanceof HTMLButtonElement)) return;

  let isTicking = false;

  function syncVisibility() {
    isTicking = false;
    const shouldShow = window.scrollY > SCROLL_TOP_THRESHOLD_PX;
    $btn.classList.toggle("is-visible", shouldShow);
    $btn.setAttribute("aria-hidden", String(!shouldShow));
    $btn.tabIndex = shouldShow ? 0 : -1;
  }

  function onScroll() {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(syncVisibility);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  syncVisibility();

  $btn.addEventListener("click", () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  });
}

function initHeroCarousel() {
  const $carousel = document.querySelector(".hero__carousel");
  if (!$carousel) return;

  const $images = $carousel.querySelectorAll(".hero__panel-img");
  const $dots = $carousel.querySelectorAll(".hero__carousel-dot");

  if ($images.length === 0 || $dots.length === 0) return;

  let activeIndex = 0;
  let intervalId = null;
  const $reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $mobile = window.matchMedia(`(max-width: ${HERO_CAROUSEL_MOBILE_MAX_WIDTH}px)`);

  function setSlide(index) {
    activeIndex = (index + $images.length) % $images.length;

    $images.forEach(($img, imgIndex) => {
      $img.classList.toggle("is-active", imgIndex === activeIndex);
    });

    $dots.forEach(($dot, dotIndex) => {
      $dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  function stopAutoplay() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    if (!$mobile.matches || $reducedMotion.matches || $images.length < 2) return;

    intervalId = window.setInterval(() => {
      setSlide(activeIndex + 1);
    }, HERO_CAROUSEL_INTERVAL_MS);
  }

  function syncCarouselMode() {
    if ($mobile.matches) {
      setSlide(activeIndex);
      startAutoplay();
      return;
    }

    stopAutoplay();
    $images.forEach(($img) => {
      $img.classList.remove("is-active");
    });
    $dots.forEach(($dot) => {
      $dot.classList.remove("is-active");
    });
  }

  $dots.forEach(($dot, index) => {
    if (!($dot instanceof HTMLButtonElement)) return;

    $dot.addEventListener("click", () => {
      setSlide(index);
      startAutoplay();
    });
  });

  $carousel.addEventListener("mouseenter", stopAutoplay);
  $carousel.addEventListener("mouseleave", startAutoplay);
  $carousel.addEventListener("focusin", stopAutoplay);
  $carousel.addEventListener("focusout", startAutoplay);

  $mobile.addEventListener("change", syncCarouselMode);
  $reducedMotion.addEventListener("change", syncCarouselMode);

  syncCarouselMode();
}

function initNavMenu() {
  const $toggle = document.querySelector(".nav-toggle");
  const $overlay = document.querySelector(".nav-overlay");
  const $links = document.querySelectorAll(".nav-popup__link");

  if (
    !$toggle ||
    !($toggle instanceof HTMLButtonElement) ||
    !$overlay
  ) {
    return;
  }

  let $lastFocused = null;

  function openMenu() {
    $lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    $overlay.classList.add("is-open");
    $toggle.setAttribute("aria-expanded", "true");
    $toggle.setAttribute("aria-label", "Fermer le menu");
    $overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-nav-open");
    $toggle.focus();
  }

  function closeMenu() {
    $overlay.classList.remove("is-open");
    $toggle.setAttribute("aria-expanded", "false");
    $toggle.setAttribute("aria-label", "Ouvrir le menu");
    $overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-nav-open");

    if ($lastFocused) {
      $lastFocused.focus();
      $lastFocused = null;
    } else {
      $toggle.focus();
    }
  }

  function toggleMenu() {
    const isOpen = $overlay.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  $toggle.addEventListener("click", toggleMenu);

  $overlay.addEventListener("click", (event) => {
    if (event.target === $overlay) {
      closeMenu();
    }
  });

  $links.forEach(($link) => {
    $link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $overlay.classList.contains("is-open")) {
      closeMenu();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavMenu();
  initHeroCarousel();
  initHeroReveal();
  initFaqAccordion();
  initScrollTop();
});
