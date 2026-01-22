// ==============================
// PORTFOLIOBOX EXACT REPLICA - MAIN SCRIPT
// ==============================

// Estado de la aplicación
let currentTheme = 'light';
let isMobileMenuOpen = false;

// ==============================
// INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfoliobox Exact Replica - Inicializando');
    
    // Inicializar todos los módulos
    initMobileNavigation();
    initSmoothScroll();
    initContactForm();
    initAnimations();
    initScrollEffects();
    
    // Configurar año actual en el footer
    const yearElement = document.querySelector('.pb-copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
});

// ==============================
// MOBILE NAVIGATION
// ==============================
function initMobileNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelectorAll('.pb-nav-link');
    
    // Crear menú móvil si no existe
    createMobileMenu();
    
    const mobileMenu = document.querySelector('.pb-mobile-menu');
    
    // Toggle del menú móvil
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Cerrar menú al hacer clic en enlaces
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
            !menuToggle.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú al redimensionar a escritorio
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

function createMobileMenu() {
    const navCenter = document.querySelector('.pb-nav-center');
    if (!navCenter || document.querySelector('.pb-mobile-menu')) return;
    
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
// SMOOTH SCROLL
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
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Llamada inicial
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.pb-nav-link');
    const scrollY = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.pb-nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

// ==============================
// CONTACT FORM
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
    const originalText = submitBtn.innerHTML;
    
    // Deshabilitar botón y mostrar loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío (en producción sería una petición fetch/AJAX)
    setTimeout(() => {
        // Éxito
        showFormMessage('¡Mensaje enviado con éxito! Te contactaré en menos de 24 horas.', 'success');
        
        // Resetear formulario
        form.reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
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
// ANIMATIONS ON SCROLL
// ==============================
function initAnimations() {
    // Animaciones de entrada para elementos
    const animatedElements = document.querySelectorAll('.pb-project-card, .pb-service-card, .pb-testimonial-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
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
// SCROLL EFFECTS
// ==============================
function initScrollEffects() {
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.pb-header');
    
    function updateHeaderOnScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Usar requestAnimationFrame para mejor performance
    function onScroll() {
        requestAnimationFrame(updateHeaderOnScroll);
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ==============================
// UTILITY FUNCTIONS
// ==============================
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
// EVENT LISTENERS GLOBALES
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
        const searchInput = document.querySelector('#contactForm input[type="text"], #contactForm input[type="email"]');
        if (searchInput) searchInput.focus();
    }
});

// Prevenir envío de formulario con Enter en campos no apropiados
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !e.target.form) {
        e.preventDefault();
    }
});

// ==============================
// INLINE STYLES PARA ANIMACIONES
// ==============================
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-out;
    }
    
    .field-error {
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
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
