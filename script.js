// Small interactions for the static prototype: mobile menu, dropdown toggles,
// top image rotation, and gallery controls.
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

if (stripImages.length > 1 && !prefersReducedMotion) {
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

if (gallerySlides.length > 1 && !prefersReducedMotion) {
  setInterval(() => {
    showGallerySlide((galleryIndex + 1) % gallerySlides.length);
  }, 5000);
}

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    formStatus.className = "form-status";
    formStatus.textContent = "Sending your message…";

    try {
      const data = Object.fromEntries(new FormData(contactForm));
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We could not send your message.");
      contactForm.reset();
      formStatus.className = "form-status is-success";
      formStatus.textContent = "Thank you! Your message has been sent.";
    } catch (error) {
      formStatus.className = "form-status is-error";
      formStatus.textContent = error.message || "We could not send your message. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}
