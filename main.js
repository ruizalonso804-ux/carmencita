/* =============================================
   CARMENCITA EXPORT — Main JavaScript
   Section Loader + Interactions
   ============================================= */

// ---------- Section Loader ----------
const sections = [
    'navbar',
    'hero',
    'empresa',
    'stats',
    'value-props',
    'exportacion',
    'certifications',
    'alianzas',
    'beekeepers',
    'testimonial',
    'news',
    'contact',
    'footer',
];

async function loadSections() {
    const promises = sections.map(async (name) => {
        const container = document.getElementById(`section-${name}`);
        if (!container) return;
        try {
            const resp = await fetch(`/sections/${name}.html`);
            if (!resp.ok) throw new Error(`Failed to load ${name}`);
            container.innerHTML = await resp.text();
        } catch (err) {
            console.error(`Error loading section "${name}":`, err);
        }
    });

    await Promise.all(promises);
    initInteractions();
}

// ---------- Interactions ----------
function initInteractions() {
    initNavbar();
    initScrollAnimations();
    initCounters();
    initContactForm();
    initSmoothScroll();
}

// --- Navbar ---
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!navbar) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow =
                mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// --- Scroll Animations ---
function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el, i) => {
        el.style.transitionDelay = `${i % 4 * 0.1}s`;
        observer.observe(el);
    });
}

// --- Animated Counters ---
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.round(eased * target);

        el.textContent = current.toLocaleString('es-CL');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Add + suffix for large numbers
            el.textContent =
                target >= 100
                    ? target.toLocaleString('es-CL') + '+'
                    : target.toLocaleString('es-CL');
        }
    }

    requestAnimationFrame(update);
}

// --- Contact Form (Formspree) ---
// Reemplaza XXXXXXXX con tu ID de Formspree (formspree.io → New Form → copia el ID)
const FORMSPREE_ID = 'XXXXXXXX';

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('.contact__submit');
        const originalText = btn.textContent;

        btn.textContent = 'Enviando...';
        btn.disabled = true;

        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                btn.textContent = '✓ Mensaje enviado';
                btn.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            } else {
                throw new Error('Error en el envío');
            }
        } catch {
            btn.textContent = 'Error — intente de nuevo';
            btn.style.background = 'linear-gradient(135deg, #e53935, #b71c1c)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

// --- Smooth Scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#') return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            const offset = 80; // navbar height
            const top =
                target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', loadSections);
