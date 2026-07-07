// ==========================================
// SPORTERA GLOBAL - Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 800);
    }

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));

    // Counter animation
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.getAttribute('data-count')));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el, target) {
        let current = 0;
        const inc = target / 60;
        const t = setInterval(() => {
            current += inc;
            if (current >= target) { el.textContent = target + '+'; clearInterval(t); }
            else el.textContent = Math.floor(current) + '+';
        }, 30);
    }

    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = item.src;
                document.body.style.overflow = 'hidden';
            });
        });
        const closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
    }

    // Registration tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Team registration, player registration, and the contact form each have
    // their own real submit handlers with live Firebase validation, defined
    // inline in registration.html and contact.html — this file must not
    // attach a second listener to those same forms, since an earlier version
    // did exactly that and its unconditional .reset() call was silently
    // wiping the form (including "uploaded" files) after every submit
    // attempt, regardless of whether the real handler's validation passed.

    // News page — load articles from localStorage
    if (document.getElementById('newsArticlesFeed')) {
        renderNewsFromStorage();
    }
});

// ── PUBLIC: render admin-published news on news.html ────────────────────────
function renderNewsFromStorage() {
    const feed = document.getElementById('newsArticlesFeed');
    if (!feed) return;
    const articles = JSON.parse(localStorage.getItem('sg_news') || '[]').filter(a => a.status === 'published').reverse();
    if (!articles.length) return;
    feed.innerHTML = '';
    articles.forEach(a => {
        const card = document.createElement('div');
        card.className = 'news-card fade-in';
        card.innerHTML = `
            <div class="news-card-image" style="height:220px;background:linear-gradient(135deg,var(--primary-dark),var(--primary-light));display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:3rem;">
                ${a.image ? `<img src="${a.image}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fas fa-futbol"></i>'}
            </div>
            <div class="news-card-body">
                <div class="news-meta">
                    <span class="news-category">${a.category}</span>
                    <span class="news-date"><i class="fas fa-calendar"></i> ${formatDate(a.publishDate)}</span>
                </div>
                <h3>${a.title}</h3>
                <p>${a.body.substring(0, 180)}${a.body.length > 180 ? '…' : ''}</p>
            </div>`;
        feed.prepend(card);
    });
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
