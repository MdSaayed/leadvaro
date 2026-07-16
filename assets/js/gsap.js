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

    const hero = document.querySelector(".hero--home");
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
    // if (!container) return;

    let rotationTimer = null;
    let isRunning = false;

    function rotateItems() {
        const items = Array.from(container.children);
        if (items.length < 2) return;

        const state = Flip.getState(items);
        container.appendChild(items[0]);

        Flip.from(state, {
            duration: 1,
            ease: 'power2.inOut',
            absolute: true,
            onComplete: () => {
                if (isRunning) {
                    rotationTimer = gsap.delayedCall(1.5, rotateItems);
                }
            }
        });
    }

    function startAnimation() {
        if (isRunning) return; // already running হলে দ্বিতীয়বার শুরু করবে না
        isRunning = true;
        rotationTimer = gsap.delayedCall(2, rotateItems);
    }

    function stopAnimation() {
        isRunning = false;
        if (rotationTimer) {
            rotationTimer.kill();
            rotationTimer = null;
        }
        // চলমান কোনো Flip animation থাকলে সেটাও থামিয়ে item পজিশন reset করছি
        gsap.killTweensOf(container.children);
    }

    // matchMedia দিয়ে breakpoint check করা
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

    }, item); // scope করা হলো শুধু এই item এর ভেতরে
});



