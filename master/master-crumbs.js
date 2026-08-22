
// ############### DROPDOWN ###############
function initCrumbsDropdowns() {
    const dropdownSelector = '.cr-dropdown';
    let generatedId = 0;

    function getDropdownPart(dropdown, selector) {
        return Array.from(dropdown.children).find((element) => element.matches(selector))
            || dropdown.querySelector(selector);
    }

    function createUniqueId(prefix) {
        let id;

        do {
            generatedId += 1;
            id = `cr-${prefix}-${generatedId}`;
        } while (document.getElementById(id));

        return id;
    }

    function ensureUniqueId(element, prefix) {
        if (!element.id || document.getElementById(element.id) !== element) {
            element.id = createUniqueId(prefix);
        }

        return element.id;
    }

    function prepareDropdown(dropdown) {
        const toggle = getDropdownPart(dropdown, '.cr-drop-toggle');
        const menu = getDropdownPart(dropdown, '.cr-drop-menu');

        if (!toggle || !menu) return null;

        const toggleId = ensureUniqueId(toggle, 'dropdown-toggle');
        const menuId = ensureUniqueId(menu, 'dropdown-menu');
        const isOpen = menu.classList.contains('show');

        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-controls', menuId);
        menu.setAttribute('aria-labelledby', toggleId);
        menu.setAttribute('aria-hidden', String(!isOpen));

        return { toggle, menu };
    }

    function setDropdownState(dropdown, isOpen) {
        const parts = prepareDropdown(dropdown);

        if (!parts) return;

        parts.menu.classList.toggle('show', isOpen);
        parts.toggle.setAttribute('aria-expanded', String(isOpen));
        parts.menu.setAttribute('aria-hidden', String(!isOpen));
    }

    function closeAllDropdowns(exceptDropdown) {
        document.querySelectorAll(dropdownSelector).forEach((dropdown) => {
            if (dropdown !== exceptDropdown) {
                setDropdownState(dropdown, false);
            }
        });
    }

    document.querySelectorAll(dropdownSelector).forEach(prepareDropdown);

    // Event delegation membuat dropdown tetap bekerja jika markup ditambahkan setelah halaman dimuat.
    document.addEventListener('click', function (event) {
        const toggle = event.target.closest('.cr-drop-toggle');

        if (toggle) {
            const dropdown = toggle.closest(dropdownSelector);
            const parts = dropdown && prepareDropdown(dropdown);

            if (!parts) return;

            event.preventDefault();
            event.stopPropagation();

            const willOpen = !parts.menu.classList.contains('show');
            closeAllDropdowns(dropdown);
            setDropdownState(dropdown, willOpen);
            return;
        }

        if (event.target.closest('.cr-drop-item') || !event.target.closest(dropdownSelector)) {
            closeAllDropdowns(null);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;

        const openDropdown = Array.from(document.querySelectorAll(dropdownSelector)).find((dropdown) => {
            const parts = prepareDropdown(dropdown);
            return parts && parts.menu.classList.contains('show');
        });

        if (!openDropdown) return;

        const parts = prepareDropdown(openDropdown);
        closeAllDropdowns(null);
        parts.toggle.focus();
        event.preventDefault();
    });

    // Sinkronkan atribut ARIA pada dropdown yang dibuat secara dinamis.
    if (window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;

                    if (node.matches(dropdownSelector)) {
                        prepareDropdown(node);
                    }

                    node.querySelectorAll(dropdownSelector).forEach(prepareDropdown);
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrumbsDropdowns);
} else {
    initCrumbsDropdowns();
}


// ############### CAROUSEL ###############
class CustomCarousel {
  constructor(carousel) {
    this.carousel = carousel;
    this.slides = carousel.querySelectorAll(".carousel-slide");
    this.prevBtn = carousel.querySelector("[data-prev]");
    this.nextBtn = carousel.querySelector("[data-next]");
    this.indicatorsContainer = carousel.querySelector("[data-indicators]");

    this.currentIndex = 0;
    this.interval = null;

    this.isAuto = carousel.dataset.auto === "true";
    this.duration = Number(carousel.dataset.duration) || 3000;

    // Default false
    this.useThumbnailIndicator = carousel.dataset.indicatorThumbnail === "true";
    this.showLightboxInfo = carousel.dataset.lightboxInfo !== "false";

    this.init();
  }

  init() {
    this.createIndicators();
    this.updateCarousel();
    this.createLightbox();
    
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.prevSlide();
        this.scrollActiveIndicator();
        this.restartAutoSlide();
      });
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.nextSlide();
        this.scrollActiveIndicator();
        this.restartAutoSlide();
      });
    }
    
    if (this.isAuto) {
      this.startAutoSlide();
    }

    this.carousel.addEventListener("click", (event) => {
      if (event.target.closest(".carousel-btn, .carousel-indicator")) return;

      const slide = event.target.closest(".carousel-slide");
      if (slide) {
        this.openLightbox(slide);
      }
    });
  }

  createIndicators() {
    if (!this.indicatorsContainer) return;

    this.indicatorsContainer.innerHTML = "";

    this.indicatorsContainer.classList.toggle(
      "thumbnail-mode",
      this.useThumbnailIndicator
    );

    this.slides.forEach((slide, index) => {
      const indicator = document.createElement("div");

      indicator.classList.add("carousel-indicator");

      if (this.useThumbnailIndicator) {
        const slideImage = slide.querySelector("img");

        if (slideImage) {
          const thumbnailImage = document.createElement("img");

          thumbnailImage.src = slideImage.getAttribute("src");
          thumbnailImage.alt =
            slideImage.getAttribute("alt") || `Slide ${index + 1}`;

          indicator.appendChild(thumbnailImage);
        }
      }

      indicator.addEventListener("click", () => {
        this.goToSlide(index);
        this.scrollActiveIndicator();
        this.restartAutoSlide();
      });

      this.indicatorsContainer.appendChild(indicator);
    });

    this.indicators = this.indicatorsContainer.querySelectorAll(
      ".carousel-indicator"
    );
  }

  updateCarousel() {
    this.slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentIndex);
    });

    if (this.indicators) {
      this.indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === this.currentIndex);
      });
    }
  }

  scrollActiveIndicator() {
    if (!this.useThumbnailIndicator) return;
    if (!this.indicatorsContainer || !this.indicators) return;

    const activeIndicator = this.indicators[this.currentIndex];

    if (!activeIndicator) return;

    const containerWidth = this.indicatorsContainer.offsetWidth;
    const indicatorLeft = activeIndicator.offsetLeft;
    const indicatorWidth = activeIndicator.offsetWidth;

    const scrollPosition =
      indicatorLeft - containerWidth / 2 + indicatorWidth / 2;

    this.indicatorsContainer.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentIndex++;

    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = 0;
    }

    this.updateCarousel();
  }

  prevSlide() {
    this.currentIndex--;

    if (this.currentIndex < 0) {
      this.currentIndex = this.slides.length - 1;
    }

    this.updateCarousel();
  }

  startAutoSlide() {
    this.stopAutoSlide();

    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.duration);
  }

  stopAutoSlide() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  restartAutoSlide() {
    if (this.isAuto) {
      this.startAutoSlide();
    }
  }

  createLightbox() {
    this.lightbox = document.createElement("div");
    this.lightbox.classList.add("carousel-lightbox");

    this.lightbox.innerHTML = `
      <div class="carousel-lightbox-content">
        <button class="carousel-lightbox-close" type="button" aria-label="Close">&times;</button>

        <div class="carousel-lightbox-wrap-img">
          <button class="carousel-lightbox-nav carousel-lightbox-prev" type="button" aria-label="Previous image">&#10094;</button>

          <button class="carousel-lightbox-nav carousel-lightbox-next" type="button" aria-label="Next image">&#10095;</button>

          <img class="carousel-lightbox-img" src="" alt="">
        </div>

        <div class="carousel-lightbox-info">
          <h3 class="carousel-lightbox-title"></h3>
          <p class="carousel-lightbox-desc"></p>
        </div>
      </div>
    `;

    document.body.appendChild(this.lightbox);

    this.lightboxImg = this.lightbox.querySelector(".carousel-lightbox-img");
    this.lightboxInfo = this.lightbox.querySelector(".carousel-lightbox-info");
    this.lightboxTitle = this.lightbox.querySelector(".carousel-lightbox-title");
    this.lightboxDesc = this.lightbox.querySelector(".carousel-lightbox-desc");
    this.lightboxClose = this.lightbox.querySelector(".carousel-lightbox-close");
    this.lightboxPrev = this.lightbox.querySelector(".carousel-lightbox-prev");
    this.lightboxNext = this.lightbox.querySelector(".carousel-lightbox-next");

    if (!this.showLightboxInfo && this.lightboxInfo) {
      this.lightboxInfo.hidden = true;
    }

    this.lightboxClose.addEventListener("click", () => {
      this.closeLightbox();
    });

    this.lightboxPrev.addEventListener("click", () => {
      this.prevLightboxSlide();
    });

    this.lightboxNext.addEventListener("click", () => {
      this.nextLightboxSlide();
    });

    this.lightbox.addEventListener("click", (event) => {
      if (event.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!this.lightbox.classList.contains("active")) return;

      if (event.key === "Escape") {
        this.closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        this.prevLightboxSlide();
      }

      if (event.key === "ArrowRight") {
        this.nextLightboxSlide();
      }
    });

    if (this.slides.length <= 1) {
      this.lightboxPrev.style.display = "none";
      this.lightboxNext.style.display = "none";
    }
  }

  openLightbox(slide) {
    const slideIndex = Array.from(this.slides).indexOf(slide);

    if (slideIndex === -1) return;

    this.lightboxIndex = slideIndex;

    this.showLightboxSlide(this.lightboxIndex);

    this.lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    this.stopAutoSlide();
  }

  showLightboxSlide(index) {
    const slide = this.slides[index];

    if (!slide) return;

    const image = slide.querySelector("img");

    if (!image) return;

    const imageSrc = image.currentSrc || image.getAttribute("src");
    const imageAlt = image.getAttribute("alt") || "";

    const title = slide.dataset.title || imageAlt || "Image Detail";
    const description = slide.dataset.description || "";

    this.lightboxImg.src = imageSrc;
    this.lightboxImg.alt = imageAlt;

    if (this.showLightboxInfo) {
      this.lightboxTitle.textContent = title;
      this.lightboxDesc.textContent = description;
    }

    this.currentIndex = index;
    this.updateCarousel();

    if (this.useThumbnailIndicator) {
      this.scrollActiveIndicator();
    }
  }

  nextLightboxSlide() {
    this.lightboxIndex++;

    if (this.lightboxIndex >= this.slides.length) {
      this.lightboxIndex = 0;
    }

    this.showLightboxSlide(this.lightboxIndex);
  }

  prevLightboxSlide() {
    this.lightboxIndex--;

    if (this.lightboxIndex < 0) {
      this.lightboxIndex = this.slides.length - 1;
    }

    this.showLightboxSlide(this.lightboxIndex);
  }

  closeLightbox() {
    this.lightbox.classList.remove("active");
    document.body.style.overflow = "";

    this.lightboxImg.src = "";

    this.restartAutoSlide();
  }
}

function initCrumbCarousels(root = document) {
  const scope = root instanceof Element || root instanceof Document ? root : document;
  const carousels = [
    ...(scope instanceof Element && scope.matches("[data-carousel]") ? [scope] : []),
    ...scope.querySelectorAll("[data-carousel]")
  ];

  carousels.forEach((carousel) => {
    if (carousel.dataset.carouselInitialized === "true") return;

    carousel.dataset.carouselInitialized = "true";
    carousel.crCarousel = new CustomCarousel(carousel);
  });
}

window.initCrumbCarousels = initCrumbCarousels;

document.addEventListener("DOMContentLoaded", () => {
  initCrumbCarousels();
});