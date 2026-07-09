// Small interactions for the static prototype: mobile menu, dropdown toggles,
// top image rotation, and gallery controls.
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const parent = toggle.closest(".has-dropdown");
    const isOpen = parent.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});

function rotateItems(items, activeIndex) {
  items.forEach((item, index) => {
    item.classList.toggle("is-active", index === activeIndex);
  });
}

const stripImages = document.querySelectorAll(".strip-image");
let stripIndex = 0;

if (stripImages.length > 1) {
  setInterval(() => {
    stripIndex = (stripIndex + 1) % stripImages.length;
    rotateItems(stripImages, stripIndex);
  }, 3500);
}

const gallerySlides = document.querySelectorAll(".gallery-slide");
const galleryDots = document.querySelectorAll(".slide-dot");
let galleryIndex = 0;

function showGallerySlide(index) {
  galleryIndex = index;
  rotateItems(gallerySlides, galleryIndex);
  rotateItems(galleryDots, galleryIndex);
}

galleryDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showGallerySlide(index);
  });
});

if (gallerySlides.length > 1) {
  setInterval(() => {
    showGallerySlide((galleryIndex + 1) % gallerySlides.length);
  }, 5000);
}
