/**
 * NEOBOOK - Main JavaScript File
 * UX/UI & Product Design Portfolio
 * Utilidades de interactividad y animaciones
 */

// ========== CONFIGURACIÓN ==========
const CONFIG = {
    SCROLL_THRESHOLD: 0.1,
    SCROLL_ROOT_MARGIN: '0px 0px -100px 0px',
    ANIMATION_DURATION: 600,
    ANIMATION_DELAY: 50
};

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initIntersectionObserver();
    initAnimationTriggers();
    initEventListeners();
    initHeaderScroll();
});

// ========== SCROLL SUAVE ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo prevenir default si es un anchor
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Accessibility: Focus al elemento destino
                    target.focus({ preventScroll: true });
                }
            }
        });
    });
}

// ========== INTERSECTION OBSERVER ==========
function initIntersectionObserver() {
    const observerOptions = {
        threshold: CONFIG.SCROLL_THRESHOLD,
        rootMargin: CONFIG.SCROLL_ROOT_MARGIN
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Agregar delay progresivo para cada elemento
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, index * CONFIG.ANIMATION_DELAY);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos animables
    document.querySelectorAll(
        '.service-card, .testimonial-card, .pricing-card, .portfolio-card, .stat'
    ).forEach(el => {
        observer.observe(el);
    });
}

// ========== TRIGGERS DE ANIMACIÓN ==========
function initAnimationTriggers() {
    // Stats con contador animado
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        let hasAnimated = false;
        
        const statsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    animateNumbers();
                    hasAnimated = true;
                    statsObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
}

// ========== ANIMAR NÚMEROS ==========
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number, .stat-box h3');
    
    numbers.forEach(element => {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const isMillions = text.includes('M');
        const isDollar = text.includes('$');
        const baseNumber = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (!isNaN(baseNumber)) {
            let current = 0;
            const increment = Math.ceil(baseNumber / 30);
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= baseNumber) {
                    current = baseNumber;
                    clearInterval(timer);
                }
                
                let displayText = current.toString();
                if (isDollar) displayText = '$' + displayText;
                if (isMillions && current >= 1000000) displayText = (current / 1000000).toFixed(1) + 'M';
                if (isPercentage) displayText += '%';
                
                element.textContent = displayText;
            }, 30);
        }
    });
}

// ========== EVENT LISTENERS ==========
function initEventListeners() {
    // Hover effects en portfolio cards
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Hover effects en service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Click en botones
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
        });
    });

    // Detección de preferencia de movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
}

// ========== HEADER SCROLL EFFECT ==========
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollTop = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 100) {
                    header.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
                } else {
                    header.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ========== UTILIDAD: LAZY LOAD IMAGES ==========
function initLazyLoadImages() {
    if (!('IntersectionObserver' in window)) {
        // Fallback para navegadores antiguos
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== UTILIDAD: FORM VALIDATION ==========
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        // Reset previous state
        input.classList.remove('error');
        
        // Validar requerido
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        }
        
        // Validar email
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // Validar teléfono
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });

    return isValid;
}

// ========== UTILIDAD: COPY TO CLIPBOARD ==========
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copiado al portapapeles');
        });
    } else {
        // Fallback para navegadores antiguos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// ========== UTILIDAD: TRACK EVENT (ANALYTICS) ==========
function trackEvent(eventName, eventData = {}) {
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
    
    // Para debugging
    console.log(`Event tracked: ${eventName}`, eventData);
}

// ========== UTILIDAD: DEBOUNCE ==========
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

// ========== UTILIDAD: THROTTLE ==========
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========== TEMA OSCURO/CLARO ==========
function initThemeToggle() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    });
}

// ========== MODAL UTILITIES ==========
function createModal(content, options = {}) {
    const defaults = {
        closable: true,
        className: '',
        onClose: null
    };
    
    const config = { ...defaults, ...options };
    
    const modal = document.createElement('div');
    modal.className = `modal ${config.className}`;
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            ${config.closable ? '<button class="modal-close">&times;</button>' : ''}
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
        modal.remove();
        if (config.onClose) config.onClose();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    return modal;
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========== PERFORMANCE MONITORING ==========
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const metrics = {
            'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
            'TCP Connection': timing.connectEnd - timing.connectStart,
            'Time to First Byte': timing.responseStart - timing.navigationStart,
            'Download Time': timing.responseEnd - timing.responseStart,
            'DOM Interactive': timing.domInteractive - timing.navigationStart,
            'DOM Complete': timing.domComplete - timing.navigationStart,
            'Load Complete': timing.loadEventEnd - timing.navigationStart
        };
        
        console.table(metrics);
    }
}

// ========== INICIALIZACIÓN EN WINDOW ==========
window.NeoBook = {
    validateForm,
    copyToClipboard,
    trackEvent,
    debounce,
    throttle,
    createModal,
    showToast,
    logPerformance
};

// ========== LOG INICIAL ==========
console.log('%cNeoBook Portfolio', 'color: #C9A646; font-size: 16px; font-weight: bold;');
console.log('%cProfessional UX/UI & Product Design Portfolio', 'color: #B8B8B8; font-size: 12px;');
