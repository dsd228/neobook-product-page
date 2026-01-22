// ==============================
// PORTFOLIOBOX EXACT REPLICA - MAIN SCRIPT
// CONECTADO AL HTML Y FUNCIONAL
// ==============================

// Estado global
let isMobileMenuOpen = false;
let lastScrollY = 0;
let ticking = false;
// ==============================
// GALERÍA PARALLAX EFFECT
// ==============================
function initGalleryParallax() {
    const gallery = document.getElementById('galleryParallax');
    if (!gallery) return;
    
    const items = gallery.querySelectorAll('.pb-gallery-item');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        items.forEach((item, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(rate * speed);
            item.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
    
    // Efecto hover en elementos de la galería
    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.opacity = '0.5';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.opacity = '0.3';
        });
    });
}

// Inicializar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... tu código existente ...
    initGalleryParallax();
});
// ==============================
// 1. INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfoliobox Exact Replica - Inicializando');
    
    // Inicializar todos los módulos
    initMobileNavigation();
    initSmoothScroll();
    initContactForm();
    initScrollEffects();
    initAnimations();
    initCounters();
    
    // Configurar año actual en el footer
    updateCurrentYear();
    
    // Añadir clase loaded para transiciones
    setTimeout(() => {
        document.body.classList.add('pb-loaded');
    }, 100);
});

// ==============================
// 2. MOBILE NAVIGATION
// ==============================
function initMobileNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelectorAll('.pb-nav-link');
    
    // Crear menú móvil si no existe
    if (!document.querySelector('.pb-mobile-menu')) {
        createMobileMenu();
    }
    
    const mobileMenu = document.querySelector('.pb-mobile-menu');
    
    // Toggle del menú móvil
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Cerrar menú al hacer clic en enlaces móviles
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (isMobileMenuOpen && 
            menuToggle && 
            !menuToggle.contains(e.target) && 
            mobileMenu && 
            !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú al redimensionar a escritorio
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth >= 768 && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }, 250));
}

function createMobileMenu() {
    const navCenter = document.querySelector('.pb-nav-center');
    if (!navCenter) return;
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'pb-mobile-menu';
    mobileMenu.innerHTML = navCenter.innerHTML;
    
    document.querySelector('.pb-header').appendChild(mobileMenu);
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.pb-mobile-menu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (!mobileMenu || !menuToggle) return;
    
    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const mobileMenu = document.querySelector('.pb-mobile-menu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (!mobileMenu || !menuToggle) return;
    
    mobileMenu.classList.add('active');
    menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    menuToggle.setAttribute('aria-expanded', 'true');
    isMobileMenuOpen = true;
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.pb-mobile-menu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (!mobileMenu || !menuToggle) return;
    
    mobileMenu.classList.remove('active');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-expanded', 'false');
    isMobileMenuOpen = false;
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
}

// ==============================
// 3. SMOOTH SCROLL
// ==============================
function initSmoothScroll() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.pb-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (window.innerWidth < 768 && isMobileMenuOpen) {
                    closeMobileMenu();
                }
            }
        });
    });
    
    // Actualizar enlace activo en navegación
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    updateActiveNavLink(); // Llamada inicial
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.pb-nav-link');
    const scrollY = window.pageYOffset + 150;
    
    let currentActive = null;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            currentActive = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActive}`) {
            link.classList.add('active');
        }
    });
}

// ==============================
// 4. SCROLL EFFECTS
// ==============================
function initScrollEffects() {
    const header = document.querySelector('.pb-header');
    const parallaxBg = document.getElementById('parallax-bg');
    const scrollHint = document.getElementById('scrollHint');
    
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        
        // Header transform
        if (header) {
            if (scrollY > 100) {
                header.classList.remove('hero-mode');
                header.classList.add('scrolled');
                
                // Efecto fade mientras sales del hero
                if (scrollY < 500) {
                    const opacity = 1 - (scrollY / 500);
                    header.style.opacity = Math.max(opacity, 0.3).toString();
                } else {
                    header.style.opacity = '1';
                }
            } else {
                header.classList.add('hero-mode');
                header.classList.remove('scrolled');
                header.style.opacity = '1';
            }
        }
        
        // Parallax effect
        if (parallaxBg) {
            const rate = scrollY * -0.3;
            parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        // Scroll hint visibility
        if (scrollHint) {
            if (scrollY > 300) {
                scrollHint.style.opacity = '0';
                scrollHint.style.pointerEvents = 'none';
            } else {
                scrollHint.style.opacity = '1';
                scrollHint.style.pointerEvents = 'auto';
            }
        }
    }
    
    // Scroll event con throttling
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateScrollEffects();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Click en scroll hint
    if (scrollHint) {
        scrollHint.addEventListener('click', function() {
            const proyectosSection = document.getElementById('proyectos');
            if (proyectosSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = proyectosSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Feedback visual
                this.style.opacity = '0.5';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 1000);
            }
        });
    }
}

// ==============================
// 5. ANIMATIONS ON SCROLL
// ==============================
function initAnimations() {
    const animatedElements = document.querySelectorAll('.pb-project-card, .pb-service-card, .pb-testimonial-card, .pb-process-step, .pb-reveal');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    }
}

// ==============================
// 6. ANIMATED COUNTERS
// ==============================
function initCounters() {
    const counters = document.querySelectorAll('.pb-stat-number[data-count]');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => observer.observe(counter));
    }
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    
    // Solo animar si hay un número para animar
    if (isNaN(target)) return;
    
    const increment = target / 50;
    const duration = 1500;
    const stepTime = Math.max(Math.floor(duration / (target / increment)), 30);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// ==============================
// 7. CONTACT FORM
// ==============================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!validateContactForm()) {
            return;
        }
        
        // Simular envío
        simulateFormSubmission();
    });
    
    // Validación en tiempo real
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.getAttribute('id');
    
    // Limpiar error previo
    clearFieldError(e);
    
    // Validaciones específicas
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor, introduce un email válido');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc2626';
}

function clearFieldError(e) {
    const field = e.target;
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

function simulateFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Mostrar loading
    if (btnText && btnLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
    }
    submitBtn.disabled = true;
    
    // Simular envío (en producción sería una petición fetch/AJAX)
    setTimeout(() => {
        // Éxito
        showFormMessage('¡Mensaje enviado con éxito! Te contactaré en menos de 24 horas.', 'success');
        
        // Resetear formulario
        form.reset();
        
        // Restaurar botón
        if (btnText && btnLoading) {
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
        submitBtn.disabled = false;
        
        // Desaparecer mensaje después de 5 segundos
        setTimeout(() => {
            const successMessage = document.querySelector('.form-success');
            if (successMessage) {
                successMessage.remove();
            }
        }, 5000);
        
    }, 1500);
}

function showFormMessage(text, type) {
    // Remover mensajes anteriores
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-${type}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        font-weight: 500;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        messageDiv.style.border = '1px solid #22c55e';
        messageDiv.style.color = '#22c55e';
    } else {
        messageDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        messageDiv.style.border = '1px solid #ef4444';
        messageDiv.style.color = '#ef4444';
    }
    
    const form = document.getElementById('contactForm');
    form?.insertBefore(messageDiv, form.firstChild);
}

// ==============================
// 8. UTILITY FUNCTIONS
// ==============================
function updateCurrentYear() {
    const yearElement = document.querySelector('.pb-copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
}

// Debounce para eventos de resize/scroll
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

// Throttle para eventos frecuentes
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==============================
// 9. EVENT LISTENERS GLOBALES
// ==============================
// Teclas de acceso rápido
document.addEventListener('keydown', function(e) {
    // Escape para cerrar menú móvil
    if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Ctrl/Cmd + K para focus en formulario
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const emailInput = document.querySelector('#contactForm input[type="email"]');
        if (emailInput) emailInput.focus();
    }
});

// Prevenir envío de formulario con Enter en campos no apropiados
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !e.target.form) {
        e.preventDefault();
    }
});

// ==============================
// 10. INLINE STYLES PARA ANIMACIONES
// ==============================
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .field-error {
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .btn-loading {
        display: none;
    }
    
    .form-message {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        font-weight: 500;
        text-align: center;
        animation: fadeIn 0.3s ease;
    }
    
    .form-success {
        background-color: rgba(34, 197, 94, 0.1);
        border: 1px solid #22c55e;
        color: #22c55e;
    }
    
    .form-error {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        color: #ef4444;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
`;

document.head.appendChild(animationStyles);

console.log('✅ Portfoliobox Exact Replica - Inicializado correctamente');
