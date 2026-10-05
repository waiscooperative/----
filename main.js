/* ========================================
   WAIS Cooperative
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAnimations();
    initScrollEffects();
});

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const compactNavQuery = window.matchMedia('(max-width: 1024px)');

    function isCompactNav() {
        return compactNavQuery.matches;
    }

    function setNavOpen(open) {
        if (!navToggle || !navMenu) return;

        navMenu.classList.toggle('active', open);
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-open', open);
    }

    function closeNav() {
        setNavOpen(false);
    }

    if (navToggle && navMenu) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            setNavOpen(!navMenu.classList.contains('active'));
        });
    }

    const menuLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isCompactNav()) {
                closeNav();
            }
        });
    });
    
    // Handle nested dropdown toggle on mobile
    const nestedDropdowns = document.querySelectorAll('.dropdown-menu > li > span.dropdown-item');
    nestedDropdowns.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (isCompactNav()) {
                e.preventDefault();
                e.stopPropagation();
                const parentLi = this.parentElement;
                parentLi.classList.toggle('expanded');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!isCompactNav() || !navMenu || !navMenu.classList.contains('active')) return;
        if (e.target.closest('.nav-menu') || e.target.closest('.nav-toggle')) return;
        closeNav();
    });

    compactNavQuery.addEventListener('change', function(event) {
        if (!event.matches) {
            closeNav();
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentPath === '/' || currentPath.endsWith('index.html')) {
            if (linkPath === 'index.html') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

/* ========================================
   Scroll Effects
   ======================================== */
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ========================================
   Animations
   ======================================== */
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.card, .step-item, .benefit-item, .service-card');
    animateElements.forEach(el => observer.observe(el));
}

/* ========================================
   Form Validation
   ======================================== */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (!value) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = 'This field is required.';
                errorElement.classList.add('show');
            }
            isValid = false;
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address.';
                    errorElement.classList.add('show');
                }
                isValid = false;
            }
        }
        
        // Number validation
        if (field.type === 'number' && value) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue <= 0) {
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid positive number.';
                    errorElement.classList.add('show');
                }
                isValid = false;
            }
        }
    });
    
    return isValid;
}

/* ========================================
   Modal Functions
   ======================================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* ========================================
   Notification Functions
   ======================================== */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/* ========================================
   Utility Functions
   ======================================== */
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-PH', options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
