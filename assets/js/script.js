
function toggleMobileAccordion(event, id) {
    event.stopPropagation();
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.toggle('mobile-menu__item--active');
}

const mobileToggle = document.getElementById('mobileToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
    mobileToggle.classList.toggle('mobile-toggle--active');
    mobileMenu.classList.toggle('mobile-menu--active');
    mobileOverlay.classList.toggle('mobile-overlay--active');
    document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
}

mobileToggle.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', toggleMobileMenu);

document.addEventListener('click', (e) => {
    if (e.target.closest('#mobileCloseBtn')) toggleMobileMenu();
});

const navbarInner = document.getElementById('navbarInner');
window.addEventListener('scroll', () => { navbarInner.classList.toggle('navbar__inner--scrolled', window.pageYOffset > 50); });


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (mobileMenu.classList.contains('mobile-menu--active')) toggleMobileMenu();
    }
});

/* =============================
  6. Faq
============================= */
document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('click', function () {
        const answer = item.querySelector('.faq__answer');
        const icon = item.querySelector('.faq__toggle-icon');
        const isActive = item.classList.contains('faq__item--active');

        // Close all items
        document.querySelectorAll('.faq__item').forEach(i => {
            const a = i.querySelector('.faq__answer');
            const ic = i.querySelector('.faq__toggle-icon');

            a.style.height = '0px';
            i.classList.remove('faq__item--active');

            ic.classList.remove('fa-minus');
            ic.classList.add('fa-plus');
        });

        // Open clicked item
        if (!isActive) {
            item.classList.add('faq__item--active');
            answer.style.height = answer.scrollHeight + 'px';

            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');

            answer.addEventListener('transitionend', () => {
                if (item.classList.contains('faq__item--active')) {
                    answer.style.height = 'auto';
                }
            }, { once: true });
        }
    });
});

// Default state: open the first FAQ item
document.querySelectorAll('.faq__item--active').forEach(item => {
    const answer = item.querySelector('.faq__answer');
    const icon = item.querySelector('.faq__toggle-icon');

    answer.style.height = answer.scrollHeight + 'px';
    icon.classList.remove('fa-plus');
    icon.classList.add('fa-minus');
});


/* =============================
  6. Testimonials Slider
============================= */
function initTestimonialsSlider() {
    const mainSlider = document.querySelector(".testimonials__slider");
    const thumbSlider = document.querySelector(".testimonials__slider--thumb");

    // Stop if required elements don't exist
    if (!mainSlider || !thumbSlider) return;

    const thumbsSwiper = new Swiper(".testimonials__slider--thumb", {
        slidesPerView: 7,
        spaceBetween: 8,
        watchSlidesProgress: true,
        freeMode: true,
        loop: false,
        centeredSlides: false,
        slideToClickedSlide: true,

        breakpoints: {
            0: {
                slidesPerView: 1.4,
                spaceBetween: 4,
            },
            576: {
                slidesPerView: 6,
                spaceBetween: 4,
            },
            768: {
                slidesPerView: 7,
                spaceBetween: 8,
            },
        },
    });

    const testimonialSwiper = new Swiper(".testimonials__slider", {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 24,
        loop: true,
        speed: 600,

        navigation: {
            nextEl: ".testimonials__button--next",
            prevEl: ".testimonials__button--prev",
        },

        thumbs: {
            swiper: thumbsSwiper,
            autoScrollOffset: 1,
        },

        breakpoints: {
            0: {
                slidesPerView: 1.1,
                spaceBetween: 16,
            },
            576: {
                slidesPerView: 1.3,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 2.5,
                spaceBetween: 24,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
        },

        on: {
            init() {
                updateEqualHeight();
            },
            resize() {
                updateEqualHeight();
            },
            slideChangeTransitionEnd() {
                updateEqualHeight();
            },
        },
    });

    function updateEqualHeight() {
        const cards = mainSlider.querySelectorAll(
            ".swiper-slide .testimonial-card"
        );

        if (!cards.length) return;

        let maxHeight = 0;

        // Reset heights
        cards.forEach((card) => {
            card.style.height = "auto";
        });

        // Find tallest card
        cards.forEach((card) => {
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });

        // Apply equal height
        cards.forEach((card) => {
            card.style.height = `${maxHeight}px`;
        });
    }

    window.addEventListener("load", updateEqualHeight);
}

// Initialize after DOM is ready
document.addEventListener("DOMContentLoaded", initTestimonialsSlider);


/* =============================
  6. Hero Light Box
============================= */
document.addEventListener("DOMContentLoaded", () => {
    const lightboxElement = document.querySelector(".glightbox");

    if (!lightboxElement || typeof GLightbox === "undefined") return;

    GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: false,
        autoplayVideos: true,
        openEffect: "zoom",
        closeEffect: "fade",
        plyr: {
            css: "https://cdn.plyr.io/3.7.8/plyr.css",
            js: "https://cdn.plyr.io/3.7.8/plyr.js"
        }
    });
});

/* =============================
  6. Counter
============================= */
document.addEventListener("DOMContentLoaded", () => {

    const counters = document.querySelectorAll("[data-counter]");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const el = entry.target;

            const end = Number(el.dataset.counter);
            const prefix = el.dataset.prefix || "";
            const suffix = el.dataset.suffix || "";
            const duration = Number(el.dataset.duration) || 2;

            // Auto detect decimal places (or use data-decimals if provided)
            const decimalPlaces = el.dataset.decimals !== undefined
                ? Number(el.dataset.decimals)
                : ((el.dataset.counter.split(".")[1] || "").length);

            const counter = new countUp.CountUp(el, end, {
                duration,
                prefix,
                suffix,
                decimalPlaces,
                useGrouping: true
            });

            if (!counter.error) {
                counter.start();
            } else {
                console.error(counter.error);
            }

            observer.unobserve(el);

        });

    }, {
        threshold: 0.4
    });

    counters.forEach(counter => observer.observe(counter));

});

/* =============================
  6. Find Email
============================= */
document.querySelectorAll('.find-email__tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.find-email__tab').forEach(function (t) {
            t.classList.remove('find-email__tab--active');
        });
        tab.classList.add('find-email__tab--active');
    });
});

/* =============================
  6. Pricing Addon
============================= */

const labels = [
    '0', '1K', '2K', '5K', '10K', '20K', '35K', '50K', '75K',
    '100K', '150K', '200K', '250K', '300K', '350K', '400K', '450K', '500K',
    '600K', '700K', '800K', '900K', '1M', '1.3M', '1.5M', '1.8M',
    '2M', '2.3M', '2.5M', '2.8M', '3M', '3.3M', '3.5M'
];

const prices = [
    0, 50, 100, 200, 300, 450, 600, 800, 1000,
    1200, 1500, 1800, 2200, 2600, 3000, 3400, 3800, 4200,
    4800, 5400, 6000, 6600, 7200, 7800, 8400, 9000,
    9600, 10200, 10800, 11400, 12000, 12600, 13200
];

const range = document.getElementById('pricing-addon-range');
const price = document.getElementById('pricing-addon-price');
const ticks = document.getElementById('pricing-addon-ticks');

labels.forEach(label => {
    const div = document.createElement('div');
    div.className = 'pricing-addon__tick';
    div.innerHTML = `<span class="pricing-addon__tick-label">${label}</span>`;
    ticks.appendChild(div);
});

function updatePricingAddon() {
    const value = +range.value;
    const progress = (value / range.max) * 100;

    range.style.setProperty('--progress', `${progress}%`);
    price.textContent = `$${prices[value].toLocaleString()}/year`;
}

range.addEventListener('input', updatePricingAddon);
updatePricingAddon();

/* =============================
  6. Pricing Table Filter
============================= */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.pricing-comparison__filter-btn');
    const tables = document.querySelectorAll('.pricing-comparison__table');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // ১. Active Button State টগল
            filterButtons.forEach(btn => btn.classList.remove('pricing-comparison__filter-btn--active'));
            button.classList.add('pricing-comparison__filter-btn--active');

            // ২. Target Table ID বের করা
            const targetTableId = button.getAttribute('data-target');

            // ৩. টেবিল Show/Hide করা
            tables.forEach(table => {
                if (table.id === targetTableId) {
                    table.classList.remove('pricing-comparison__table--hidden');
                    table.classList.add('pricing-comparison__table--active');
                } else {
                    table.classList.add('pricing-comparison__table--hidden');
                    table.classList.remove('pricing-comparison__table--active');
                }
            });
        });
    });
});

/* =============================
  6. Pricing Card Filter
============================= */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.pricing-card__filter-btn');
    const priceElements = document.querySelectorAll('.pricing-card__price');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle Active Class
            filterButtons.forEach(btn => btn.classList.remove('pricing-card__filter-btn--active'));
            button.classList.add('pricing-card__filter-btn--active');

            const billingType = button.getAttribute('data-billing');

            // Update Prices with Smooth Transition
            priceElements.forEach(priceEl => {
                priceEl.style.opacity = '0';
                setTimeout(() => {
                    priceEl.innerHTML = priceEl.getAttribute(`data-${billingType}`);
                    priceEl.style.opacity = '1';
                }, 150);
            });
        });
    });
});


/* =============================
  6. Booking Calendar
============================= */
