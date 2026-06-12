/*
  faq.js — filtres par catégorie sur la page FAQ
 */

// --- Sélecteurs DOM ---
const $filterBtns = document.querySelectorAll(".faq-filters__btn");
const $faqItems = document.querySelectorAll(".faq-page .faq__item");
const $emptyState = document.querySelector(".faq-empty");

// --- Fonctions ---
function setActiveFilter($activeBtn) {
  $filterBtns.forEach(($btn) => {
    const isActive = $btn === $activeBtn;
    $btn.classList.toggle("is-active", isActive);
    $btn.setAttribute("aria-pressed", String(isActive));
  });
}

function filterFaqItems(category) {
  let visibleCount = 0;

  $faqItems.forEach(($item) => {
    const itemCategory = $item.dataset.category ?? "all";
    const isVisible = category === "all" || itemCategory === category;

    $item.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  if ($emptyState) {
    $emptyState.classList.toggle("is-visible", visibleCount === 0);
  }
}

function initFaqFilters() {
  if ($filterBtns.length === 0) return;

  $filterBtns.forEach(($btn) => {
    $btn.addEventListener("click", () => {
      const category = $btn.dataset.filter ?? "all";
      setActiveFilter($btn);
      filterFaqItems(category);
    });
  });
}

// --- Initialisation ---
document.addEventListener("DOMContentLoaded", () => {
  initFaqFilters();
});
