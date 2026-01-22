// ============================== PORTFOLIO DAVID DÍAZ - UX/UI OPTIMIZADO ==============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio David Díaz - Cargado y optimizado');
    
    // ============================== CONFIGURACIÓN INICIAL ==============================
    const config = {
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
    
    // ============================== VARIABLES GLOBALES ==============================
    const header = document.getElementById('main-header');
    const zoomableInner = document.getElementById('zoomableInner');
    const heroOverlay = document.getElementById('heroOverlay');
    const heroContent = document.querySelector('.dd-hero-content');
    const scrollDownBtn = document.getElementById('scrollDown');
    const menuToggle = document.getElementById('menuToggle');
    const currentYearEl = document.getElementById('currentYear');
    
    // ============================== INICIALIZACIONES ==============================
    function initAll() {
        updateCurrentYear();
        initPortfolioZoom();
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initScrollDownButton();
        initContactForm();
        initAnimations();
        initStatsCounter();
        initAccessibility();
        initLazyLoading();
        initTestimonialsCarousel();
        
        console.log('✅ Todos los módulos inicializados correctamente');
    }
    
    // ============================== 1. ACTUALIZAR AÑO ==============================
    function updateCurrentYear() {
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }
    
    // ============================== 2. EFECTO ZOOM (OPTIMIZADO) ==============================
    function initPortfolioZoom() {
        if (!zoomableInner || config.reduceMotion) return;
        
        const zoomContainer = zoomableInner.parentElement;
        const zoomValue = parseInt(zoomContainer.getAttribute('data-zoom')) || 25;
        
        // Estado inicial
        zoomableInner.style.transform = `scale(${zoomValue})`;
        zoomableInner.style.opacity = '0';
        
        if (heroOverlay) heroOverlay.style.opacity = '1';
        if (heroContent) heroContent.style.opacity = '1';
        
        // Forzar reflow y animar
        requestAnimationFrame(() => {
            zoomableInner.style.transition = 'transform 1.1s cubic-bezier(0.33, 1, 0.68, 1), opacity 1.1s ease';
            zoomableInner.style.transform = 'scale(1)';
            zoomableInner.style.opacity = '1';
            
            if (heroOverlay) {
                heroOverlay.style.transition = 'opacity 1.1s ease';
                heroOverlay.style.opacity = '0.4';
            }
            
            console.log('🎬 Efecto zoom ejecutado');
        });
    }
    
    // ============================== 3. MENÚ MÓVIL (ACCESIBLE) ==============================
    function initMobileMenu() {
        if (!menuToggle) return;
        
        menuToggle.addEventListener('click', toggleMobileMenu);
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
            }
        });
    }
    
    function toggleMobileMenu() {
        const isOpen = document.body.classList.contains('mobile-menu-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
        
        // Actualizar estado ARIA
        menuToggle.setAttribute('aria-expanded', !isOpen);
    }
    
    function openMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'dd-mobile-menu';
        mobileMenu.setAttribute('role', 'dialog');
        mobileMenu.setAttribute('aria-label', 'Menú de navegación');
        mobileMenu.setAttribute('aria-modal', 'true');
        
        mobileMenu.innerHTML = `
            <div class="dd-mobile-menu-content">
                <button class="dd-mobile-close" aria-label="Cerrar menú">
                    <i class="fas fa-times"></i>
                </button>
                <nav class="dd-mobile-nav" aria-label="Navegación principal">
                    <a href="#proyectos" class="dd-nav-link">Proyectos</a>
                    <a href="#servicios" class="dd-nav-link">Servicios</a>
                    <a href="#herramientas" class="dd-nav-link">Herramientas</a>
                    <a href="#proceso" class="dd-nav-link">Proceso</a>
                    <a href="#testimonios" class="dd-nav-link">Testimonios</a>
                    <a href="#contacto" class="dd-nav-link">Contacto</a>
                </nav>
                <div class="dd-mobile-actions">
                    <a href="#contacto" class="dd-btn dd-btn-primary">Empezar Proyecto</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        document.body.classList.add('mobile-menu-open');
        
        // Enfocar primer elemento del menú
        setTimeout(() => {
            const firstLink = mobileMenu.querySelector('.dd-nav-link');
            if (firstLink) firstLink.focus();
        }, 100);
        
        // Configurar cierre
        const closeBtn = mobileMenu.querySelector('.dd-mobile-close');
        closeBtn.addEventListener('click', closeMobileMenu);
        
        mobileMenu.querySelectorAll('.dd-nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Trap focus dentro del modal
        trapFocus(mobileMenu);
    }
    
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.dd-mobile-menu');
        if (mobileMenu) {
            mobileMenu.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                mobileMenu.remove();
                document.body.classList.remove('mobile-menu-open');
                menuToggle.focus(); // Devolver foco al botón
                menuToggle.setAttribute('aria-expanded', 'false');
            }, 300);
        }
    }
    
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
    
    // ============================== 4. HEADER SCROLL ==============================
    function initHeaderScroll() {
        let lastScroll = 0;
        const headerHeight = header.offsetHeight;
        
        function updateHeader() {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
                
                // Ocultar/mostrar según scroll direction
                if (currentScroll > lastScroll && currentScroll > headerHeight) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.classList.remove('scrolled');
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }
        
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader(); // Estado inicial
    }
    
    // ============================== 5. SCROLL SMOOTH ==============================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '#hero') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: config.reduceMotion ? 'auto' : 'smooth'
                    });
                    
                    // Actualizar URL sin recargar
                    history.pushState(null, null, href);
                    
                    // Cerrar menú móvil si está abierto
                    closeMobileMenu();
                }
            });
        });
    }
    
    // ============================== 6. BOTÓN SCROLL DOWN ==============================
    function initScrollDownButton() {
        if (!scrollDownBtn) return;
        
        scrollDownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector('#proyectos');
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: config.reduceMotion ? 'auto' : 'smooth'
                });
                
                // Feedback táctil
                this.classList.add('clicked');
                setTimeout(() => this.classList.remove('clicked'), 300);
            }
        });
        
        // Accesibilidad teclado
        scrollDownBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // ============================== 7. CONTADOR ESTADÍSTICAS ==============================
    function initStatsCounter() {
        const statElements = document.querySelectorAll('.dd-stat-number');
        if (statElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statElements.forEach(el => observer.observe(el));
    }
    
    function animateCounter(element) {
        const originalText = element.textContent;
        const isPercentage = originalText.includes('%');
        const isPlus = originalText.includes('+');
        const isMoney = originalText.includes('$');
        
        // Extraer número
        let number = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        if (isNaN(number)) return;
        
        const duration = 2000; // 2 segundos
        const steps = 60;
        const increment = number / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                element.textContent = originalText;
                clearInterval(timer);
                
                // Efecto visual
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            } else {
                let displayNumber = Math.floor(current);
                
                if (isMoney) {
                    element.textContent = `$${displayNumber.toLocaleString()}`;
                } else if (isPercentage) {
                    element.textContent = displayNumber + '%';
                } else if (isPlus) {
                    element.textContent = displayNumber + '+';
                } else {
                    element.textContent = displayNumber.toLocaleString();
                }
            }
        }, duration / steps);
    }
    
    // ============================== 8. FORMULARIO DE CONTACTO ==============================
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        // Validación en tiempo real
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
        
        // Envío del formulario
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const originalState = submitBtn.disabled;
            
            // Estado de carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="dd-loading" aria-hidden="true"></span>
                <span class="dd-btn-text">Enviando...</span>
            `;
            
            // Simular envío (en producción sería una petición real)
            setTimeout(() => {
                showFormSuccess();
                
                // Restaurar botón
                setTimeout(() => {
                    submitBtn.disabled = originalState;
                    submitBtn.innerHTML = originalText;
                    contactForm.reset();
                }, 1500);
            }, 2000);
        });
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';
        
        // Limpiar error previo
        clearError({ target: field });
        
        // Validaciones específicas
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un email válido';
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function validateForm() {
        const form = document.getElementById('contactForm');
        let isValid = true;
        
        form.querySelectorAll('[required]').forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        const consent = form.querySelector('#consent');
        if (consent && !consent.checked) {
            showFieldError(consent, 'Debes aceptar la política de privacidad');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        // Remover error previo
        clearError({ target: field });
        
        // Añadir clase de error
        const formGroup = field.closest('.dd-form-group, .dd-form-consent');
        if (formGroup) {
            formGroup.classList.add('error');
            
            // Crear elemento de error
            const errorEl = document.createElement('div');
            errorEl.className = 'dd-form-error';
            errorEl.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            `;
            
            formGroup.appendChild(errorEl);
            
            // Focus en campo con error
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `error-${field.id}`);
            
            // Asociar error con campo para screen readers
            errorEl.id = `error-${field.id}`;
        }
    }
    
    function clearError(e) {
        const field = e.target;
        const formGroup = field.closest('.dd-form-group, .dd-form-consent');
        
        if (formGroup) {
            formGroup.classList.remove('error');
            
            const errorEl = formGroup.querySelector('.dd-form-error');
            if (errorEl) errorEl.remove();
            
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        }
    }
    
    function showFormSuccess() {
        const form = document.getElementById('contactForm');
        const successMessage = document.createElement('div');
        
        successMessage.className = 'dd-form-success';
        successMessage.setAttribute('role', 'alert');
        successMessage.innerHTML = `
            <div class="dd-success-content">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <div>
                    <h4>¡Mensaje enviado correctamente!</h4>
                    <p>Te responderé en menos de 24 horas hábiles. Revisa tu email.</p>
                </div>
            </div>
        `;
        
        // Insertar después del formulario
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        // Auto-eliminar después de 8 segundos
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 300);
        }, 8000);
    }
    
    // ============================== 9. ANIMACIONES AL SCROLL ==============================
    function initAnimations() {
        if (config.reduceMotion) return;
        
        const elementsToAnimate = document.querySelectorAll(
            '.dd-project-showcase, .dd-service-card, .dd-testimonial-card, .dd-process-step'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Clase para elementos animados
        const style = document.createElement('style');
        style.textContent = `
            .dd-project-showcase.animated,
            .dd-service-card.animated,
            .dd-testimonial-card.animated,
            .dd-process-step.animated {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================== 10. ACCESIBILIDAD ==============================
    function initAccessibility() {
        // Añadir skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'dd-skip-link';
        skipLink.textContent = 'Saltar al contenido principal';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Añadir ID al contenido principal
        const mainContent = document.querySelector('main') || document.querySelector('.dd-hero-section');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
        
        // Mejorar etiquetas ARIA
        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('alt')) {
                img.setAttribute('alt', '');
                img.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Añadir roles a secciones
        document.querySelectorAll('section').forEach(section => {
            if (!section.getAttribute('role')) {
                section.setAttribute('role', 'region');
            }
        });
        
        // Mejorar focus visible
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    // ============================== 11. LAZY LOADING ==============================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype && !config.isTouch) {
            // Navegador soporta lazy loading nativo
            lazyImages.forEach(img => {
                img.classList.add('dd-lazy-load');
                
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            });
        } else {
            // Fallback para navegadores antiguos
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ============================== 12. TESTIMONIOS CARRUSEL ==============================
    function initTestimonialsCarousel() {
        const testimonialCards = document.querySelectorAll('.dd-testimonial-card');
        if (testimonialCards.length < 2) return;
        
        let currentIndex = 0;
        const autoRotate = !config.reduceMotion;
        
        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                card.style.opacity = i === index ? '1' : '0.5';
                card.style.transform = i === index ? 'translateY(0)' : 'translateY(20px)';
                card.style.zIndex = i === index ? '1' : '0';
                card.style.pointerEvents = i === index ? 'auto' : 'none';
            });
            
            currentIndex = index;
        }
        
        function nextTestimonial() {
            const nextIndex = (currentIndex + 1) % testimonialCards.length;
            showTestimonial(nextIndex);
        }
        
        // Rotación automática (solo en escritorio)
        if (autoRotate && window.innerWidth > 768) {
            setInterval(nextTestimonial, 8000);
        }
        
        // Navegación manual
        testimonialCards.forEach((card, index) => {
            card.addEventListener('click', () => showTestimonial(index));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showTestimonial(index);
                }
            });
        });
        
        // Inicializar
        showTestimonial(0);
    }
    
    // ============================== 13. PERFORMANCE & OPTIMIZATIONS ==============================
    function initPerformance() {
        // Debounce eventos de scroll y resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalcular elementos que dependen del viewport
                console.log('Viewport resized');
            }, 250);
        }, { passive: true });
        
        // Preconectar a dominios importantes
        const links = [
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
            'https://images.unsplash.com'
        ];
        
        links.forEach(link => {
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = link;
            preconnect.crossOrigin = '';
            document.head.appendChild(preconnect);
        });
    }
    
    // ============================== 14. ERROR HANDLING ==============================
    function initErrorHandling() {
        // Capturar errores no controlados
        window.addEventListener('error', function(e) {
            console.error('Error capturado:', e.error);
            // Aquí podrías enviar el error a un servicio de tracking
        });
        
        // Promise rejections no manejadas
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Promise rejection no manejada:', e.reason);
        });
    }
    
    // ============================== 15. SERVICE WORKER (OPCIONAL) ==============================
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registrado:', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker falló:', error);
                    });
            });
        }
    }
    
    // ============================== INICIALIZAR TODO ==============================
    initAll();
    initPerformance();
    initErrorHandling();
    
    // Solo en producción
    if (window.location.hostname !== 'localhost') {
        initServiceWorker();
    }
});

// ============================== UTILIDADES GLOBALES ==============================
// Para uso desde la consola o otros scripts
window.DDPortfolio = {
    refreshStats: function() {
        const stats = document.querySelectorAll('.dd-stat-number');
        stats.forEach(stat => {
            const original = stat.textContent;
            stat.textContent = '0';
            setTimeout(() => {
                stat.textContent = original;
            }, 100);
        });
    },
    
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `dd-notification dd-notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <span>${message}</span>
            <button class="dd-notification-close" aria-label="Cerrar notificación">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Cerrar manualmente
        notification.querySelector('.dd-notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
};

// Polyfill para smooth scroll en Safari
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => {
            console.log('Smoothscroll polyfill cargado');
        });
}
