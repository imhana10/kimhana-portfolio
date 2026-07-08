const navLinks = document.querySelectorAll(".header__nav a");
const sections = document.querySelectorAll("main .section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll(".grid-gallery__toggle").forEach((button) => {
  const gallery = button.previousElementSibling;
  button.addEventListener("click", () => {
    const expanded = gallery.classList.toggle("is-expanded");
    button.textContent = expanded ? button.dataset.labelLess : button.dataset.labelMore;
  });
});

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
const lightboxImg = document.createElement("img");
const lightboxPrev = document.createElement("button");
lightboxPrev.className = "lightbox__btn lightbox__btn--prev";
lightboxPrev.textContent = "‹";
const lightboxNext = document.createElement("button");
lightboxNext.className = "lightbox__btn lightbox__btn--next";
lightboxNext.textContent = "›";
const lightboxClose = document.createElement("button");
lightboxClose.className = "lightbox__close";
lightboxClose.textContent = "×";
lightboxClose.setAttribute("aria-label", "닫기");
lightbox.append(lightboxImg, lightboxPrev, lightboxNext, lightboxClose);
document.body.appendChild(lightbox);

let lightboxImages = [];
let lightboxIndex = 0;

const showLightboxImage = () => {
  const img = lightboxImages[lightboxIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
};

lightbox.addEventListener("click", () => lightbox.classList.remove("is-open"));

lightboxPrev.addEventListener("click", (event) => {
  event.stopPropagation();
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
});

lightboxNext.addEventListener("click", (event) => {
  event.stopPropagation();
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  showLightboxImage();
});

lightboxClose.addEventListener("click", (event) => {
  event.stopPropagation();
  lightbox.classList.remove("is-open");
});

document.querySelectorAll(".carousel").forEach((carousel) => {
  const images = carousel.querySelectorAll(".carousel__img");
  let index = 0;

  if (images.length <= 1) {
    carousel.querySelector(".carousel__btn--prev")?.style.setProperty("display", "none");
    carousel.querySelector(".carousel__btn--next")?.style.setProperty("display", "none");
  }

  images.forEach((img, i) => {
    img.style.transition = "none";
    img.style.transform = i === index ? "translateX(0)" : "translateX(100%)";
  });

  const show = (next, direction) => {
    const newIndex = (next + images.length) % images.length;
    if (newIndex === index) return;
    const oldIndex = index;
    index = newIndex;

    images.forEach((img, i) => {
      if (i === oldIndex || i === newIndex) return;
      img.style.transition = "none";
      img.style.transform = "translateX(100%)";
    });

    const outgoing = images[oldIndex];
    const incoming = images[newIndex];
    incoming.style.transition = "none";
    incoming.style.transform = direction > 0 ? "translateX(100%)" : "translateX(-100%)";

    void incoming.offsetWidth;

    requestAnimationFrame(() => {
      outgoing.style.transition = "transform 0.5s ease";
      outgoing.style.transform = direction > 0 ? "translateX(-100%)" : "translateX(100%)";
      incoming.style.transition = "transform 0.5s ease";
      incoming.style.transform = "translateX(0)";
      outgoing.classList.remove("is-active");
      incoming.classList.add("is-active");
    });
  };

  const autoplayInterval = carousel.closest("#space") ? 6000 : 4000;

  let autoplay;
  const stopAutoplay = () => clearInterval(autoplay);
  const startAutoplay = () => {
    if (images.length <= 1) return;
    stopAutoplay();
    autoplay = setInterval(() => show(index + 1, 1), autoplayInterval);
  };

  carousel.querySelector(".carousel__btn--prev")?.addEventListener("click", (event) => {
    event.stopPropagation();
    show(index - 1, -1);
    startAutoplay();
  });
  carousel.querySelector(".carousel__btn--next")?.addEventListener("click", (event) => {
    event.stopPropagation();
    show(index + 1, 1);
    startAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  carousel.addEventListener("click", () => {
    lightboxImages = Array.from(images);
    lightboxIndex = index;
    showLightboxImage();
    lightbox.classList.add("is-open");
  });

  startAutoplay();
});
