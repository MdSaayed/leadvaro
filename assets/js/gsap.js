gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Flip);

/* =============================
   Fade In Animation
============================= */

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('[data-animation="fade-in"]').forEach(parent => {

        // Prevent duplicate initialization
        if (parent.dataset.gsapInitialized === "true") return;
        parent.dataset.gsapInitialized = "true";

        const children = [...parent.children];

        if (!children.length) return;

        gsap.set(children, {
            y: 200,
            opacity: 0
        });

        gsap.to(children, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            overwrite: "auto",
            scrollTrigger: {
                trigger: parent,
                start: "top 90%",
                once: true,
                invalidateOnRefresh: true
            }
        });

    });

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });


    /* ==============================
       Zoom In Animation
    ============================== */
    document.querySelectorAll('[data-animation="zoom-in"]').forEach(parent => {

        const children = parent.children;

        gsap.set(children, {
            scale: 0.8,
            opacity: 0
        });

        ScrollTrigger.batch(children, {
            start: "top 95%",
            onEnter: (batch) => {
                gsap.to(batch, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.15,
                    ease: "power2.out",
                    overwrite: true
                });
            },
            // onLeaveBack: (batch) => {
            //     gsap.to(batch, {
            //         scale: 0.8,
            //         opacity: 0,
            //         duration: 0.5,
            //         ease: "power2.in",
            //         overwrite: true
            //     });
            // }
        });
    });
});

/* ==============================
   Hero Animation
============================== */
document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector('[data-animation="hero"]');
    if (!hero) return;

    /* ---------- Split hero title into words for stagger reveal ---------- */
    const titleEl = hero.querySelector(".hero__title");
    if (titleEl) {
        const words = titleEl.textContent.trim().split(" ");
        titleEl.innerHTML = words
            .map(w => `<span class="word"><span class="word-inner">${w}</span></span>`)
            .join(" ");
        titleEl.querySelectorAll(".word").forEach(w => {
            w.style.display = "inline-block";
            w.style.overflow = "hidden";
            w.style.verticalAlign = "top";
        });
    }

    /* ---------- Initial states (overrides preload CSS opacity:0) ---------- */
    gsap.set(hero.querySelector(".subtitle"), { y: -20, opacity: 0 });
    gsap.set(hero.querySelectorAll(".hero__title .word-inner"), { y: "110%", opacity: 0 });
    gsap.set(hero.querySelector(".hero__desc"), { y: 25, opacity: 0 });
    gsap.set(hero.querySelectorAll(".cta-wrap .btn"), { y: 20, opacity: 0, scale: 0.9 });
    gsap.set(hero.querySelector(".hero__image"), { x: 80, opacity: 0, scale: 0.92 });
    gsap.set(hero.querySelector(".hero__image--small"), { y: 40, opacity: 0, scale: 0.85 });
    gsap.set(hero.querySelector(".hero__play-btn"), { opacity: 0, scale: 0.5 });
    gsap.set(hero.querySelector(".bg-img"), { opacity: 0, scale: 1.1 });

    // also make sure the word wrappers themselves (not just word-inner) are visible
    gsap.set(hero.querySelectorAll(".hero__title .word"), { opacity: 1 });

    /* ---------- Master intro timeline ---------- */
    const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.2,
        onComplete: () => { window.__heroAnimReady = true; }
    });

    tl.to(hero.querySelector(".bg-img"), { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0)
        .to(hero.querySelector(".subtitle"), { y: 0, opacity: 1, duration: 0.6 }, 0.1)
        .to(hero.querySelectorAll(".hero__title .word-inner"), {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power4.out"
        }, 0.25)
        .to(hero.querySelector(".hero__desc"), { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .to(hero.querySelectorAll(".cta-wrap .btn"), {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)"
        }, "-=0.35")
        .to(hero.querySelector(".hero__image"), {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power3.out"
        }, "-=0.6")
        .to(hero.querySelector(".hero__image--small"), {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.6)"
        }, "-=0.5")
        .to(hero.querySelector(".hero__play-btn"), {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.6)"
        }, "-=0.35");

    /* ---------- Mark ready immediately too, in case onComplete fires late ---------- */
    window.__heroAnimReady = true;
    hero.classList.remove("js-fallback");

    /* ---------- CTA button hover micro-interaction ---------- */
    hero.querySelectorAll(".cta-wrap .btn").forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            gsap.to(btn, { scale: 1.05, duration: 0.25, ease: "power2.out" });
        });
        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { scale: 1, duration: 0.25, ease: "power2.out" });
        });
    });

    /* ---------- Play button: pulsing rings + hover/click interaction ---------- */
    const playBtn = hero.querySelector(".hero__play-btn");
    if (playBtn) {
        playBtn.style.position = playBtn.style.position || "absolute";
        playBtn.style.cursor = "pointer";

        // create 2 pulse rings behind the button
        for (let i = 0; i < 2; i++) {
            const ring = document.createElement("span");
            ring.className = "play-pulse-ring";
            ring.style.position = "absolute";
            ring.style.inset = "0";
            ring.style.borderRadius = "50%";
            ring.style.border = "2px solid rgba(79,70,229,0.55)";
            ring.style.pointerEvents = "none";
            playBtn.appendChild(ring);

            gsap.fromTo(ring,
                { scale: 1, opacity: 0.6 },
                {
                    scale: 1.6,
                    opacity: 0,
                    duration: 2,
                    ease: "power1.out",
                    repeat: -1,
                    delay: i * 1 + tl.duration(),
                }
            );
        }

        // continuous gentle breathing scale on the button itself
        gsap.to(playBtn, {
            scale: 1.05,
            duration: 1.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: tl.duration()
        });

        playBtn.addEventListener("mouseenter", () => {
            gsap.to(playBtn, { scale: 1.15, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        });
        playBtn.addEventListener("mouseleave", () => {
            gsap.to(playBtn, { scale: 1.05, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        });
        playBtn.addEventListener("mousedown", () => {
            gsap.to(playBtn, { scale: 0.92, duration: 0.15, ease: "power2.out" });
        });
        playBtn.addEventListener("mouseup", () => {
            gsap.to(playBtn, { scale: 1.15, duration: 0.15, ease: "power2.out" });
        });

        // hook: replace with your actual video-modal open logic
        playBtn.addEventListener("click", () => {
            playBtn.dispatchEvent(new CustomEvent("hero:play-clicked", { bubbles: true }));
        });
    }

    /* ---------- Continuous floating animation for the small overlay image ---------- */
    gsap.to(hero.querySelector(".hero__image--small"), {
        y: "+=14",
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: tl.duration() + 0.3
    });

    /* ---------- Subtle floating glow icon inside subtitle badge ---------- */
    gsap.to(hero.querySelector(".subtitle svg"), {
        rotate: 8,
        transformOrigin: "50% 50%",
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });

    /* ---------- Parallax on scroll for background + dashboard image ---------- */
    gsap.to(hero.querySelector(".bg-img"), {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(hero.querySelector(".hero__image-wrap"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

});

/* ==============================
   Problem Item Flip
============================== */

document.querySelectorAll('.problems').forEach((section) => {
    const container = section.querySelector('.problems__items');
    if (!container) return;

    let rotationTimer = null;
    let isRunning = false;

    function rotateItems() {
        const items = Array.from(container.children);
        if (items.length < 2) return;

        // ১. শুধুমাত্র আইটেমগুলোর স্টেট ক্যাপচার করুন
        const state = Flip.getState(items, {
            props: "transform, zIndex"
        });

        // ২. DOM Reorder
        container.appendChild(items[0]);

        // ৩. Flip Animation
        Flip.from(state, {
            duration: 1,
            ease: 'power2.inOut',
            spin: false,
            onComplete: () => {
                if (isRunning) {
                    rotationTimer = gsap.delayedCall(1.5, rotateItems);
                }
            }
        });
    }

    function startAnimation() {
        if (isRunning) return;
        isRunning = true;
        rotationTimer = gsap.delayedCall(2, rotateItems);
    }

    function stopAnimation() {
        isRunning = false;
        if (rotationTimer) {
            rotationTimer.kill();
            rotationTimer = null;
        }
        gsap.killTweensOf(container.children);
    }

    // Hover Pause/Resume
    container.addEventListener('mouseenter', () => {
        if (isRunning && rotationTimer) rotationTimer.pause();
    });

    container.addEventListener('mouseleave', () => {
        if (isRunning && rotationTimer) rotationTimer.resume();
    });

    // Responsive Handling
    const mm = gsap.matchMedia();

    mm.add({
        isMobile: '(max-width: 480px)',
        isDesktop: '(min-width: 481px)'
    }, (context) => {
        const { isMobile } = context.conditions;

        if (isMobile) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
});

/* ==============================
   How It Work Item (Problem Item)
============================== */
document.querySelectorAll('.problems__item--how-it-work').forEach((container) => {
    const items = Array.from(container.children);
    if (items.length < 2) return;

    let rotationTimer = null;
    let isRunning = false;
    let slotStyles = [];

    function captureInitialSlots() {
        const containerRect = container.getBoundingClientRect();

        gsap.set(container, { position: 'relative' });

        slotStyles = items.map((item) => {
            const rect = item.getBoundingClientRect();
            const computed = getComputedStyle(item);

            // rotate বের করা (transform বা standalone rotate property থেকে)
            let rotateVal = computed.rotate && computed.rotate !== 'none'
                ? computed.rotate
                : '0deg';

            return {
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
                rotate: rotateVal,
                zIndex: computed.zIndex !== 'auto' ? computed.zIndex : 1
            };
        });

        items.forEach((item, i) => {
            gsap.set(item, {
                position: 'absolute',
                top: 0,
                left: 0,
                x: slotStyles[i].x,
                y: slotStyles[i].y,
                rotate: slotStyles[i].rotate,
                zIndex: slotStyles[i].zIndex
            });
        });

        const maxBottom = Math.max(...items.map((item, i) =>
            slotStyles[i].y + item.offsetHeight
        ));
        gsap.set(container, { minHeight: maxBottom });
    }

    function applySlotStyles() {
        const currentItems = Array.from(container.children);
        currentItems.forEach((item, i) => {
            const s = slotStyles[i];
            if (!s) return;
            gsap.set(item, {
                x: s.x,
                y: s.y,
                rotate: s.rotate,
                zIndex: s.zIndex
            });
        });
    }

    function rotateItems() {
        const currentItems = Array.from(container.children);
        if (currentItems.length < 2) return;

        const state = Flip.getState(currentItems, { props: 'rotate' });

        container.appendChild(currentItems[0]);
        applySlotStyles();

        Flip.from(state, {
            duration: 1,
            ease: 'power2.inOut',
            props: 'rotate',
            onComplete: () => {
                if (isRunning) {
                    rotationTimer = gsap.delayedCall(1.5, rotateItems);
                }
            }
        });
    }

    function startAnimation() {
        if (isRunning) return;
        isRunning = true;
        captureInitialSlots();
        rotationTimer = gsap.delayedCall(2, rotateItems);
    }

    function stopAnimation() {
        isRunning = false;
        if (rotationTimer) {
            rotationTimer.kill();
            rotationTimer = null;
        }
        gsap.killTweensOf(container.children);
    }

    const mm = gsap.matchMedia();
    mm.add({
        isMobile: '(max-width: 300px)',
        isDesktop: '(min-width: 301px)'
    }, (context) => {
        const { isMobile } = context.conditions;
        if (isMobile) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
});

document.querySelectorAll('.how-it-works__item').forEach((item) => {
    let ctx = gsap.context(() => {

        const largeImg = item.querySelector('.how-it-works__item-img--large');
        const smallImg = item.querySelector('.how-it-works__item-img--small');

        if (!largeImg || !smallImg) return;

        // Large image: left bottom origin থেকে clockwise (left → right sweep)
        gsap.fromTo(largeImg,
            { rotate: -25, transformOrigin: 'left bottom' },
            {
                rotate: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Small image: ঠিক উল্টো দিকে, counter-clockwise
        gsap.fromTo(smallImg,
            { rotate: 25, transformOrigin: 'left bottom' },
            {
                rotate: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

    }, item);
});


// Global Registration (Only Once)
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ==============================
   Section Animation
============================== */
document.addEventListener("DOMContentLoaded", () => {

    // Helper Function: Safe query Selector Array (Eliminates 'null' warnings)
    const getExisting = (parent, selectors) => {
        if (!parent) return [];
        return selectors
            .map(selector => parent.querySelector(selector))
            .filter(Boolean); // Only returns elements that actually exist in DOM
    };

    /* ==============================
       1. Hero About Section
    ============================== */
    const heroAbout = document.querySelector(".hero.hero--about");
    if (heroAbout) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const leftElements = getExisting(heroAbout, [
            ".subtitle__wrapper",
            ".hero__title",
            ".hero__desc",
            ".hero__cta-wrap"
        ]);

        if (leftElements.length) {
            tl.from(leftElements, { y: 40, opacity: 0, stagger: 0.15 });
        }

        const heroImg = heroAbout.querySelector(".hero__img");
        if (heroImg) {
            tl.from(heroImg, { y: 30, scale: 0.95, rotation: -2, opacity: 0, duration: 1 }, "-=0.6");
        }

        const bgImg = heroAbout.querySelector(".bg-img");
        if (bgImg) {
            tl.from(bgImg, { opacity: 0, scale: 1.05, duration: 1.2 }, 0);
        }
    }

    /* ==============================
       2. Our Journey Area
    ============================== */
    const journeySection = document.querySelector(".our-journey");
    if (journeySection) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: journeySection,
                start: "top 80%",
                toggleActions: "play none none none",
            },
            defaults: { ease: "power3.out", duration: 0.8 },
        });

        const headerEls = getExisting(journeySection, [".our-journey__badge", ".our-journey__title"]);
        if (headerEls.length) {
            tl.from(headerEls, { y: 35, opacity: 0, stagger: 0.15 });
        }

        const journeyItems = journeySection.querySelectorAll(".our-journey__item");
        journeyItems.forEach((item) => {
            const icon = item.querySelector("[class*='our-journey__icon']");
            const line = item.querySelector(".our-journey__line");
            const year = item.querySelector(".our-journey__year");

            if (icon) {
                gsap.set(icon, { transformOrigin: "center center" });
                tl.from(icon, { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2");
            }
            if (line) {
                gsap.set(line, { transformOrigin: "left center" });
                tl.from(line, { scaleX: 0, opacity: 0, duration: 0.5 }, "-=0.2");
            }
            if (year) {
                tl.from(year, { y: 20, opacity: 0, duration: 0.4 }, "-=0.4");
            }
        });
    }

    /* ==============================
       3. Hero API Docs
    ============================== */
    const apiHero = document.querySelector(".hero.hero--api-docs");
    if (apiHero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const leftEls = getExisting(apiHero, [
            ".subtitle__wrapper",
            ".hero__title",
            ".hero__desc",
            ".hero__cta-wrap"
        ]);

        if (leftEls.length) {
            tl.from(leftEls, { y: 35, opacity: 0, stagger: 0.12 });
        }

        const heroImg = apiHero.querySelector(".hero__img");
        if (heroImg) {
            tl.from(heroImg, { y: 40, scale: 0.96, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.5");
        }

        const bgImg = apiHero.querySelector(".bg-img");
        if (bgImg) {
            tl.from(bgImg, { opacity: 0, scale: 1.05, duration: 1.2 }, 0);
        }
    }

    /* ==============================
       4. Hero Blog Area
    ============================== */
    const blogHero = document.querySelector(".hero--blog");
    if (blogHero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const contentEls = getExisting(blogHero, [
            ".subtitle__wrapper",
            ".hero__title",
            ".hero__desc",
            ".search-bar"
        ]);

        if (contentEls.length) {
            tl.from(contentEls, { y: 35, opacity: 0, stagger: 0.15 });
        }

        const bgImg = blogHero.querySelector(".bg-img");
        if (bgImg) {
            tl.from(bgImg, { opacity: 0, scale: 1.05, duration: 1.2 }, 0);
        }
    }

    /* ==============================
       5. Hero Find Decision Area
    ============================== */
    const findDecisionHero = document.querySelector(".hero--find-decision");
    if (findDecisionHero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const headerEls = getExisting(findDecisionHero, [
            ".subtitle__wrapper",
            ".hero__title",
            ".hero__desc",
            ".hero__cta-wrap"
        ]);

        if (headerEls.length) {
            tl.from(headerEls, { y: 35, opacity: 0, stagger: 0.12 });
        }

        const heroImg = findDecisionHero.querySelector(".hero__image");
        if (heroImg) {
            tl.from(heroImg, { y: 45, scale: 0.96, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.5");
        }

        const bgImg = findDecisionHero.querySelector(".bg-img");
        if (bgImg) {
            tl.from(bgImg, { opacity: 0, scale: 1.04, duration: 1.2 }, 0);
        }
    }

    /* ==============================
       6. Hero Case Study 2 Area
    ============================== */
    const caseStudyHeroTwo = document.querySelector(".hero--case-study-two");
    if (caseStudyHeroTwo) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const leftEls = getExisting(caseStudyHeroTwo, [
            ".hero__badge",
            ".hero__titl",
            ".hero__desc",
            ".hero__cta",
            ".hero__short-wrap"
        ]);

        if (leftEls.length) {
            tl.from(leftEls, { y: 35, opacity: 0, stagger: 0.12 });
        }

        const heroImg = caseStudyHeroTwo.querySelector(".hero__img");
        if (heroImg) {
            tl.from(heroImg, { y: 40, scale: 0.95, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.6");
        }
    }

    /* ==============================
       7. Hero Case Study Area
    ============================== */
    const caseStudyHero = document.querySelector(".hero--case-study");
    if (caseStudyHero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const headerEls = getExisting(caseStudyHero, [
            ".subtitle__wrapper",
            ".hero__title",
            ".hero__desc",
            ".hero__cta-wrap"
        ]);

        if (headerEls.length) {
            tl.from(headerEls, { y: 35, opacity: 0, stagger: 0.12 });
        }

        const cards = caseStudyHero.querySelectorAll(".hero__card");
        if (cards.length) {
            tl.from(cards, {
                y: 30,
                scale: 0.95,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "back.out(1.2)"
            }, "-=0.4");
        }

        const bgImg = caseStudyHero.querySelector(".bg-img");
        if (bgImg) {
            tl.from(bgImg, { opacity: 0, scale: 1.05, duration: 1.2 }, 0);
        }
    }

    /* ==============================
       8. Breadcrumbs Area
    ============================== */
    const breadcrumbsSection = document.querySelector(".breadcrumbs");
    if (breadcrumbsSection) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const breadcrumbEls = getExisting(breadcrumbsSection, [
            ".breadcrumbs__link-wrap",
            ".breadcrumbs__subtitle",
            ".breadcrumbs__title",
            ".breadcrumbs__desc",
            ".breadcrumbs__meta-wrap"
        ]);

        if (breadcrumbEls.length) {
            tl.from(breadcrumbEls, { y: 30, opacity: 0, stagger: 0.1 });
        }

        const bgImg = breadcrumbsSection.querySelector(".bg-img");
        if (bgImg) {
            tl.from(bgImg, { opacity: 0, scale: 1.05, duration: 1.2 }, 0);
        }
    }

    /* ==============================
       9. Hero Changelog Area
    ============================== */
    const changelogHero = document.querySelector(".hero--changelog");
    if (changelogHero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const elements = getExisting(changelogHero, [
            ".hero__badge-group",
            ".hero__title",
            ".hero__description",
            ".hero__form"
        ]);

        if (elements.length) {
            tl.from(elements, { y: 35, opacity: 0, stagger: 0.12 });
        }
    }

    /* ==============================
       10. Hero Prospeo Area
    ============================== */
    const prospeoHero = document.querySelector(".hero--prospeo-alt");
    if (prospeoHero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        const elements = getExisting(prospeoHero, [
            ".subtitle",
            ".hero__title",
            ".hero__desc",
            ".hero__cta-wrap",
            ".hero__list"
        ]);

        if (elements.length) {
            tl.from(elements, { y: 35, opacity: 0, stagger: 0.12 });
        }

        const bgImg = prospeoHero.querySelector(".bg-img");
        if (bgImg) {
            tl.from(bgImg, { opacity: 0, scale: 1.05, duration: 1.2 }, 0);
        }
    }

    /* ==============================
       11. Hero Contact Area
    ============================== */
    const contactHero = document.querySelector(".hero--contact");
    if (contactHero) {
        const tl = gsap.timeline({
            delay: 0.2,
            defaults: { ease: "power3.out", duration: 1.1 },
        });

        const headerElements = contactHero.querySelectorAll(".subtitle, .hero__title, .hero__desc");
        if (headerElements.length) {
            tl.from(headerElements, { y: 40, opacity: 0, stagger: 0.18 });
        }

        const cards = contactHero.querySelectorAll(".info-card");
        if (cards.length) {
            tl.from(cards, { y: 45, opacity: 0, stagger: 0.12 }, "-=0.5");
        }
    }

    /* ==============================
       12. Home Hero Area (.hero--home)
    ============================== */
    const homeHeroSection = document.querySelector(".hero--home");
    if (homeHeroSection) {
        const heroTl = gsap.timeline({
            delay: 0.1,
            defaults: { ease: "power3.out", duration: 0.8 },
        });

        const heroEls = getExisting(homeHeroSection, [
            ".subtitle",
            ".hero__title",
            ".hero__desc",
            ".hero__cta-wrap"
        ]);

        if (heroEls.length) {
            heroTl.from(heroEls, { opacity: 0, y: 30, stagger: 0.12 });
        }

        const heroImages = homeHeroSection.querySelectorAll(".hero__image, .hero__image--small, .hero__play-btn");
        if (heroImages.length) {
            heroTl.from(
                heroImages,
                { opacity: 0, y: 40, scale: 0.95, stagger: 0.15, ease: "power2.out" },
                "-=0.5"
            );
        }
    }

    /* ==============================
       13. Generic Scroll Reveal (Scoped per Section)
    ============================== */
    // 'reveal-section' ক্লাস ব্যবহার করে শুধু নির্দিষ্ট সেকশনে জেনারেল অ্যানিমেশন দেওয়া ভালো,
    // যাতে অন্য নির্দিষ্ট লেআউটের সেকশনে কনফ্লিক্ট না করে।
    const genericRevealSections = document.querySelectorAll("section.reveal-section");

    if (genericRevealSections.length > 0) {
        genericRevealSections.forEach((section) => {
            const targets = section.querySelectorAll(
                "h1, h2, h3, p, span, a, img, button, [class*='card'], [class*='form']"
            );

            if (targets.length > 0) {
                gsap.from(targets, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 82%",
                        toggleActions: "play none none reverse",
                    },
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                });
            }
        });
    }

});


/* ==============================
   Domain Search Hero Area
============================== */
document.addEventListener("DOMContentLoaded", () => {
    // Scope element selection strictly to this section
    const heroSection = document.querySelector(".hero--domain-search");

    if (!heroSection) return;

    const q = gsap.utils.selector(heroSection);

    // Initial timeline for Page Load
    const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 }
    });

    tl
        // 1. Subtitle & Icon reveal
        .from(q(".subtitle"), {
            y: -20,
            opacity: 0,
        })

        // 2. Main Heading reveal (Slight scale-up effect)
        .from(q(".hero__title"), {
            y: 30,
            opacity: 0,
            scale: 0.98,
        }, "-=0.5")

        // 3. Description reveal
        .from(q(".hero__desc"), {
            y: 20,
            opacity: 0,
        }, "-=0.6")

        // 4. Consultation CTA Button reveal
        .from(q(".hero__cta-wrap"), {
            y: 20,
            opacity: 0,
            scale: 0.95,
        }, "-=0.5")

        // 5. Search Card Container reveal
        .from(q(".search-card"), {
            y: 40,
            opacity: 0,
            duration: 1,
        }, "-=0.4")

        // 6. Search Card Inner Form Elements stagger reveal
        .from([q(".search-card__top"), q(".search-card__bottom")], {
            y: 15,
            opacity: 0,
            stagger: 0.2,
            duration: 0.6,
        }, "-=0.6")

        // 7. Background image subtle fade-in
        .from(q(".bg-wrap"), {
            opacity: 0,
            duration: 1.2,
        }, "-=1.2");
});


/* ==============================
   Hero Email Finder Area 
============================== */
document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.querySelector(".hero--find-email");
    if (!heroSection) return;

    const q = gsap.utils.selector(heroSection);

    const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 }
    });

    tl.from(q(".subtitle__wrapper"), {
        y: -20,
        opacity: 0
    })
        .from(q(".hero__title"), {
            y: 30,
            opacity: 0,
            scale: 0.98
        }, "-=0.5")
        .from(q(".hero__desc"), {
            y: 20,
            opacity: 0
        }, "-=0.6")
        .from(q(".find-email"), {
            y: 40,
            opacity: 0,
            duration: 1
        }, "-=0.4")
        .from(q(".find-email__tab"), {
            y: 15,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            clearProps: "opacity,transform"
        }, "-=0.6")
        .from(q(".find-email__card"), {
            y: 20,
            opacity: 0,
            duration: 0.6
        }, "-=0.4")
        .from(q(".bg-wrap"), {
            opacity: 0,
            duration: 1.2
        }, "-=1.2");
});

/* ==============================
   Email Validator Area
============================== */
document.addEventListener("DOMContentLoaded", () => {
    const validatorSection = document.querySelector(".email-validator");
    if (!validatorSection) return;

    const q = gsap.utils.selector(validatorSection);

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: validatorSection,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        defaults: { ease: "power3.out", duration: 0.8 }
    });

    tl.from(q(".email-validator__title"), {
        y: 30,
        opacity: 0,
        clearProps: "opacity,transform"
    })
        .from(q(".email-card"), {
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            clearProps: "opacity,transform"
        }, "-=0.4")
        .from(q(".email-card__status"), {
            scale: 0.8,
            opacity: 0,
            stagger: 0.15,
            duration: 0.5,
            clearProps: "opacity,transform"
        }, "-=0.3");
});

/* ==============================
  Hero Features Area
============================== */
document.addEventListener("DOMContentLoaded", () => {
    const heroFeatures = document.querySelector(".hero--features");
    if (!heroFeatures) return;

    const q = gsap.utils.selector(heroFeatures);

    const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 }
    });

    tl.from(q(".hero__badge-group"), {
        y: -20,
        opacity: 0,
        clearProps: "opacity,transform"
    })
        .from(q(".hero__title"), {
            y: 30,
            opacity: 0,
            scale: 0.98,
            clearProps: "opacity,transform"
        }, "-=0.5")
        .from(q(".hero__desc"), {
            y: 20,
            opacity: 0,
            clearProps: "opacity,transform"
        }, "-=0.6")
        .from(q(".hero__cta-wrap"), {
            y: 20,
            opacity: 0,
            scale: 0.95,
            clearProps: "opacity,transform"
        }, "-=0.5")
        .from(q(".hero__tag"), {
            y: 15,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            clearProps: "opacity,transform"
        }, "-=0.4");
});

/* ==============================
  Find CEO Hero Area
============================== */
document.addEventListener("DOMContentLoaded", () => {
    const spineSection = document.querySelector(".feature-spine");
    if (!spineSection) return;

    const q = gsap.utils.selector(spineSection);

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: spineSection,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        defaults: { ease: "power3.out", duration: 0.8 }
    });

    tl.from([q(".feature-spine__badge"), q(".feature-spine__title"), q(".feature-spine__description")], {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        clearProps: "opacity,transform"
    })
        .from(q(".feature-spine__line"), {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power2.inOut",
            clearProps: "opacity,transform"
        }, "-=0.3")
        .from(q(".feature-spine__step-badge"), {
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.7)",
            clearProps: "opacity,transform"
        }, "-=0.6")
        .from(q(".feature-spine__card"), {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.7,
            clearProps: "opacity,transform"
        }, "-=0.4")
        .from(q(".feature-spine__footer-note"), {
            y: 15,
            opacity: 0,
            duration: 0.5,
            clearProps: "opacity,transform"
        }, "-=0.2");
});

/* ==============================
  Hero Find decision Area
============================== */
document.addEventListener("DOMContentLoaded", () => {
    const heroDecision = document.querySelector(".hero--find-dicision");
    if (!heroDecision) return;

    const q = gsap.utils.selector(heroDecision);

    const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 }
    });

    tl.from(q(".subtitle__wrapper"), {
        y: -15,
        opacity: 0,
        duration: 0.6,
        clearProps: "opacity,transform"
    })

        // ২. মেইন টাইটেল নিচ থেকে স্মুথলি স্কেল হয়ে ভেসে উঠবে
        .from(q(".hero__title"), {
            y: 25,
            opacity: 0,
            scale: 0.98,
            duration: 0.9,
            clearProps: "opacity,transform"
        }, "-=0.4")

        // ৩. ডেসক্রিপশন টেক্সট স্লাইড ইন করবে
        .from(q(".hero__desc"), {
            y: 20,
            opacity: 0,
            duration: 0.7,
            clearProps: "opacity,transform"
        }, "-=0.6")

        // ৪. দুটি বাটন একের পর এক (stagger) পপ-ইন করবে
        .from(q(".hero__cta-wrap .btn"), {
            y: 20,
            opacity: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: "back.out(1.4)",
            clearProps: "opacity,transform"
        }, "-=0.5")

        // ৫. UI ড্যাশবোর্ড ইমেজ নিচ থেকে ৩D ফিল নিয়ে স্মুথলি রিভিল হবে
        .from(q(".hero__image-wrap"), {
            y: 50,
            opacity: 0,
            scale: 0.96,
            duration: 1.1,
            ease: "power4.out",
            clearProps: "opacity,transform"
        }, "-=0.4")

        .from(q(".bg-wrap"), {
            opacity: 0,
            duration: 1.2,
            clearProps: "opacity,transform"
        }, "-=1.2");
});


