
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
// Thumbnail Slider
const thumbsSwiper = new Swiper(".testimonials__slider--thumb", {
    slidesPerView: "auto",
    spaceBetween: 8,
    watchSlidesProgress: true,
    freeMode: true,
    loop: false,
    centeredSlides: false,
    slideToClickedSlide: true,
    slidesPerView: 7,
    spaceBetween: 8,

    breakpoints: {
        0: {
            slidesPerView: 1.4,
            spaceBetween: 4,
        },
        576: {
            slidesPerView: 6,
            spaceBetween: 4,
        },
    },
});

// Main Slider
// const testimonialSwiper = new Swiper(".testimonials__slider", {
//     slidesPerView: 3,
//     centeredSlides: true,
//     spaceBetween: 24,
//     loop: true,
//     speed: 600,
//     autoHeight: true,

//     navigation: {
//         nextEl: ".testimonials__button--next",
//         prevEl: ".testimonials__button--prev",
//     },

//     thumbs: {
//         swiper: thumbsSwiper,
//         autoScrollOffset: 1,
//     },

//     breakpoints: {
//         0: {
//             slidesPerView: 1.1,
//             spaceBetween: 16,
//         },
//         576: {
//             slidesPerView: 1.3,
//             spaceBetween: 20,
//         },
//         768: {
//             slidesPerView: 2,
//             spaceBetween: 20,
//         },
//         992: {
//             slidesPerView: 2.5,
//             spaceBetween: 24,
//         },
//         1200: {
//             slidesPerView: 3,
//             spaceBetween: 24,
//         },
//     },
// });


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
    const cards = document.querySelectorAll(
        ".testimonials__slider .swiper-slide .testimonial-card"
    );

    let maxHeight = 0;

    // Reset
    cards.forEach((card) => {
        card.style.height = "auto";
    });

    // Get tallest card
    cards.forEach((card) => {
        maxHeight = Math.max(maxHeight, card.offsetHeight);
    });

    // Apply equal height
    cards.forEach((card) => {
        card.style.height = `${maxHeight}px`;
    });

    testimonialSwiper.update();
}

window.addEventListener("load", updateEqualHeight);
window.addEventListener("resize", updateEqualHeight);