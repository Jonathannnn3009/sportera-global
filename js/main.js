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

    // ── TEAM REGISTRATION FORM ──────────────────────────────────────────────
    const teamForm = document.getElementById('teamForm');
    if (teamForm) {
        teamForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                id: generateId('TEAM'),
                type: 'team',
                status: 'pending',
                submittedAt: new Date().toISOString(),
                teamName: v('teamName'),
                teamCity: v('teamCity'),
                coachName: v('coachName'),
                coachPhone: v('coachPhone'),
                managerName: v('managerName'),
                managerPhone: v('managerPhone'),
                teamEmail: v('teamEmail'),
                tournament: v('tournament'),
                playerList: v('playerList'),
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'not selected'
            };
            saveRegistration(data);
            showSuccessMessage(teamForm, 'Team registration submitted! You will receive payment instructions at ' + data.teamEmail + ' within 24 hours.');
            teamForm.reset();
        });
    }

    // ── PLAYER REGISTRATION FORM ────────────────────────────────────────────
    const playerForm = document.getElementById('playerForm');
    if (playerForm) {
        playerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                id: generateId('PLAYER'),
                type: 'player',
                status: 'pending',
                submittedAt: new Date().toISOString(),
                playerName: v('playerName'),
                playerDob: v('playerDob'),
                playerTeam: v('playerTeam'),
                playerPosition: v('playerPosition'),
                guardianName: v('guardianName'),
                guardianPhone: v('guardianPhone'),
                playerEmail: v('playerEmail'),
                paymentMethod: document.querySelector('input[name="playerPaymentMethod"]:checked')?.value || 'not selected'
            };
            saveRegistration(data);
            showSuccessMessage(playerForm, 'Player registration submitted! You will receive payment instructions and your Digital ID Card once approved.');
            playerForm.reset();
        });
    }

    // ── CONTACT FORM ────────────────────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showSuccessMessage(contactForm, 'Message sent! We will get back to you within 48 hours.');
            contactForm.reset();
        });
    }

    // Helpers
    function v(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function generateId(prefix) {
        const regs = JSON.parse(localStorage.getItem('sg_registrations') || '[]');
        const count = regs.filter(r => r.type === prefix.toLowerCase()).length + 1;
        return 'SG-' + prefix + '-' + new Date().getFullYear() + '-' + String(count).padStart(4, '0');
    }

    function saveRegistration(data) {
        const regs = JSON.parse(localStorage.getItem('sg_registrations') || '[]');
        regs.push(data);
        localStorage.setItem('sg_registrations', JSON.stringify(regs));
    }

    function showSuccessMessage(form, msg) {
        const existing = form.parentElement.querySelector('.form-success');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'form-success';
        div.style.cssText = 'background:#e8f5e9;border:1px solid #a5d6a7;border-radius:10px;padding:18px 22px;margin-top:20px;color:#1b5e20;display:flex;gap:12px;align-items:flex-start;';
        div.innerHTML = '<i class="fas fa-check-circle" style="color:#2e7d32;font-size:1.3rem;flex-shrink:0;"></i><p style="margin:0;">' + msg + '</p>';
        form.after(div);
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

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
