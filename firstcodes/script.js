const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const ctaButton = document.querySelector('.cta-btn');
const modal = document.getElementById('visit-modal');
const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
const outlineButtons = document.querySelectorAll('.btn-outline');
const contactForm = document.getElementById('contact-form');
const socialLinks = document.querySelectorAll('.social-icons a');
const contactStatus = document.getElementById('contact-status');

const API_BASE = window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'http://localhost:3000';
const API = new URL('/api', API_BASE).toString();

async function fetchJSON(url, opts={}){
    opts.headers = opts.headers || {};
    if (!opts.headers['Content-Type']) opts.headers['Content-Type'] = 'application/json';
    if (opts.body && typeof opts.body !== 'string') {
        opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

function setActiveNav() {
    const sections = document.querySelectorAll('section');
    let currentId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 180) {
            currentId = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
}

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (nav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

function rippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

function toggleMenu() {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
}

function bindModal() {
    ctaButton.addEventListener('click', openModal);
    modalCloseButtons.forEach(button => button.addEventListener('click', closeModal));
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
}

function bindNavigation() {
    menuToggle.addEventListener('click', toggleMenu);
    window.addEventListener('scroll', setActiveNav);
}

function bindLinks() {
    outlineButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.open('https://maps.google.com/?q=Ibafo,+Ogun+State,+Nigeria', '_blank');
        });
    });
}

function bindContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            contactStatus.textContent = 'Please fill in all fields before sending your message.';
            contactStatus.style.color = '#b91c1c';
            return;
        }

        try {
            await fetchJSON(`${API}/contact`, {
                method: 'POST',
                body: { name, email, message }
            });
            contactStatus.textContent = `Thanks ${name}! Your message has been received.`;
            contactStatus.style.color = '#166534';
            contactForm.reset();
        } catch (error) {
            contactStatus.textContent = error.message || 'Unable to send your message. Please try again later.';
            contactStatus.style.color = '#b91c1c';
        }
    });
}

async function loadSermons() {
    const grid = document.getElementById('sermon-grid');
    if (!grid) return;

    try {
        const sermons = await fetchJSON(`${API}/sermons`);
        grid.innerHTML = sermons.length ? sermons.map(s => {
            const img = s.images && s.images.length ? `<img src="${s.images[0]}" alt="${s.title}" class="sermon-thumb" style="width:100%;height:180px;object-fit:cover;border-radius:8px">` : '<div class="sermon-image"></div>';
            const ad = s.ad ? `<div class="ad" style="margin-top:8px">${s.ad}</div>` : '';
            return `
            <article class="sermon-card bg-gradient-purple">
                ${img}
                <div class="sermon-content">
                    <h3>${s.title}</h3>
                    <p class="speaker">By ${s.author || 'Our Team'}</p>
                    <p>${(s.body || '').slice(0, 150)}${(s.body || '').length > 150 ? '...' : ''}</p>
                    <button class="btn btn-small" type="button">Listen Now</button>
                    ${ad}
                </div>
            </article>
        `}).join('') : '<p>No recent sermons available yet.</p>';
    } catch (error) {
        grid.innerHTML = '<p>Unable to load sermons at this time.</p>';
    }
}

async function loadAnnouncements() {
    const grid = document.getElementById('announcement-grid');
    if (!grid) return;

    try {
        const announcements = await fetchJSON(`${API}/announcements`);
        const activeItems = announcements.filter(a => a.active === 1 || a.active === true);
        grid.innerHTML = activeItems.length ? activeItems.map(a => {
            const imgs = a.images && a.images.length ? `<img src="${a.images[0]}" alt="${a.title}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:8px">` : '';
            const addr = a.address ? `<p><strong>Location:</strong> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.address)}" target="_blank" rel="noopener">${a.address}</a></p>` : '';
            const checklist = a.checklist && a.checklist.length ? `<ul>${a.checklist.map(i => `<li>${i}</li>`).join('')}</ul>` : '';
            const ad = a.ad ? `<div class="ad" style="margin-top:8px">${a.ad}</div>` : '';
            return `
            <article class="announcement-card card">
                ${imgs}
                <h3>${a.title}</h3>
                <p>${a.content}</p>
                ${addr}
                ${checklist}
                ${ad}
            </article>
        `}).join('') : '<p>No announcements right now. Check back soon.</p>';
    } catch (error) {
        grid.innerHTML = '<p>Unable to load announcements at this time.</p>';
    }
}

function bindSocialLinkLabels() {
    socialLinks.forEach(link => {
        if (!link.hasAttribute('aria-label')) {
            const icon = link.querySelector('i');
            if (icon) {
                const label = icon.className.replace('fab fa-', '').replace('-', ' ');
                link.setAttribute('aria-label', label.charAt(0).toUpperCase() + label.slice(1));
            }
        }
    });
}

function addHeaderShadow() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
    }
}

function initFadeIn() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -120px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .value-card, .sermon-card, .ministry-card, .giving-method').forEach(card => {
        card.classList.add('fade-in-card');
        observer.observe(card);
    });
}

function init() {
    smoothScroll();
    setActiveNav();
    rippleEffect();
    bindModal();
    bindNavigation();
    bindLinks();
    bindContactForm();
    bindSocialLinkLabels();
    addHeaderShadow();
    initFadeIn();
    loadSermons();
    loadAnnouncements();
    window.addEventListener('scroll', addHeaderShadow);
}

document.addEventListener('DOMContentLoaded', init);

