/* =========================================================
   Sklípek pod Turoldem — interakce
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Rok v patičce ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Mobilní navigace ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  function closeNav() {
    if (!navToggle || !primaryNav) return;
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Otevřít menu");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Zavřít menu" : "Otevřít menu");
    });

    // Zavřít po kliknutí na odkaz v menu
    primaryNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });

    // Zavřít po kliknutí mimo menu
    document.addEventListener("click", function (e) {
      if (
        primaryNav.classList.contains("is-open") &&
        !primaryNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeNav();
      }
    });
  }

  /* ---------- Lightbox galerie ---------- */
  var gallery = document.getElementById("gallery");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var btnClose = document.getElementById("lightboxClose");
  var btnPrev = document.getElementById("lightboxPrev");
  var btnNext = document.getElementById("lightboxNext");

  if (gallery && lightbox && lightboxImg) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-item"));
    var currentIndex = 0;
    var lastFocused = null;

    function showImage(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;

      var btn = items[currentIndex];
      var full = btn.getAttribute("data-full");
      var img = btn.querySelector("img");
      lightboxImg.setAttribute("src", full);
      lightboxImg.setAttribute("alt", img ? img.getAttribute("alt") || "" : "");
    }

    function openLightbox(index) {
      lastFocused = document.activeElement;
      showImage(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (btnClose) btnClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lightboxImg.setAttribute("src", "");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    items.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        openLightbox(i);
      });
    });

    if (btnClose) btnClose.addEventListener("click", closeLightbox);
    if (btnPrev) btnPrev.addEventListener("click", function () { showImage(currentIndex - 1); });
    if (btnNext) btnNext.addEventListener("click", function () { showImage(currentIndex + 1); });

    // Klik na pozadí (mimo obrázek a tlačítka) zavře
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Klávesnice
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      else if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });

    // Dotykové gesto (swipe) pro mobil
    var touchStartX = 0;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) showImage(currentIndex - 1);
        else showImage(currentIndex + 1);
      }
    }, { passive: true });
  }
})();
