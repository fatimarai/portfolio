/* =====================================================
   FATIMA RAI — PORTFOLIO SCRIPTS
   Theme, cursor, scroll reveals, hero canvas, lightbox
   ===================================================== */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----------------- THEME TOGGLE ----------------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme, animate = false) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
            if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#faf8f5');
        } else {
            root.removeAttribute('data-theme');
            if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light theme');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#0c0a09');
        }
        localStorage.setItem('theme', theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            setTheme(current === 'light' ? 'dark' : 'light', true);
        });
    }

    setTheme(getPreferredTheme());

    /* ----------------- PRELOADER ----------------- */
    const preloader = document.getElementById('preloader');

    function initPreloader() {
        if (!preloader) return;
        preloader.classList.add('active');
        setTimeout(() => {
            preloader.classList.add('hidden');
            const navbar = document.querySelector('.navbar');
            if (navbar) navbar.classList.add('loaded');
            initHeroReveal();
        }, 1400);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreloader);
    } else {
        initPreloader();
    }

    /* ----------------- HERO REVEAL ----------------- */
    function initHeroReveal() {
        if (prefersReducedMotion) return;
        const lines = document.querySelectorAll('.hero h1 .line span');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'transform 1.2s var(--ease-out-expo), opacity 1.2s var(--ease-out-expo)';
                line.style.transform = 'translateY(0)';
                line.style.opacity = '1';
            }, index * 150);
        });
    }

    /* ----------------- CUSTOM CURSOR ----------------- */
    const cursor = document.getElementById('cursor-ring');
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;

    function initCursor() {
        if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (cursor.style.opacity === '0') cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        const interactiveElements = document.querySelectorAll('a, button, .case-image-frame, .expertise-card, .blog-card');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        function animateCursor() {
            const ease = 0.15;
            currentX += (cursorX - currentX) * ease;
            currentY += (cursorY - currentY) * ease;
            cursor.style.left = currentX + 'px';
            cursor.style.top = currentY + 'px';
            requestAnimationFrame(animateCursor);
        }

        if (!prefersReducedMotion) {
            requestAnimationFrame(animateCursor);
        } else {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        }
    }

    initCursor();

    /* ----------------- SCROLL REVEALS ----------------- */
    function initReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach((el) => observer.observe(el));
    }

    initReveal();

    /* ----------------- TIMELINE LINE DRAW ----------------- */
    function initTimeline() {
        const timeline = document.querySelector('.timeline');
        const line = document.querySelector('.timeline-line');
        if (!timeline || !line) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    line.style.height = '100%';
                }
            });
        }, { threshold: 0.3 });

        observer.observe(timeline);
    }

    initTimeline();

    /* ----------------- EXPERTISE CARD TILT & GLOW ----------------- */
    function initExpertiseCards() {
        const cards = document.querySelectorAll('.expertise-card');
        if (window.matchMedia('(pointer: coarse)').matches || prefersReducedMotion) return;

        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    initExpertiseCards();

    /* ----------------- HERO CANVAS (ORGANIC WAVE) ----------------- */
    function initHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas || prefersReducedMotion) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationId;
        let mouse = { x: null, y: null };

        function resize() {
            width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            createParticles();
        }

        function createParticles() {
            particles = [];
            const count = Math.min(60, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.offsetWidth,
                    y: Math.random() * canvas.offsetHeight,
                    baseX: Math.random() * canvas.offsetWidth,
                    baseY: Math.random() * canvas.offsetHeight,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.4 + 0.1
                });
            }
        }

        function getColor() {
            return root.getAttribute('data-theme') === 'light'
                ? '196, 106, 59'
                : '224, 139, 92';
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            const color = getColor();

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;

                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120 && mouse.x !== null) {
                    p.x -= dx * 0.02;
                    p.y -= dy * 0.02;
                }

                if (p.x < 0 || p.x > canvas.offsetWidth) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.offsetHeight) p.speedY *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${color}, ${0.12 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(draw);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', resize, { passive: true });
        resize();
        draw();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                draw();
            }
        });
    }

    initHeroCanvas();

    /* ----------------- LIGHTBOX ----------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    let lastFocusedElement = null;

    window.openLightbox = function (trigger) {
        const img = trigger.querySelector('img');
        if (!img || !lightbox || !lightboxImg) return;
        lastFocusedElement = document.activeElement;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightbox.focus();
    };

    window.closeLightbox = function () {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        lightbox.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusable = lightbox.querySelectorAll('button, [href], img');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }

    /* ----------------- NAVBAR BACKGROUND ON SCROLL ----------------- */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar-inner');
        if (!navbar) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                navbar.style.boxShadow = '0 10px 40px var(--shadow)';
            } else {
                navbar.style.boxShadow = 'none';
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    initNavbarScroll();

    /* ----------------- MOBILE MENU ----------------- */
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if (!mobileMenuBtn || !navLinks) return;

        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    initMobileMenu();
})();
