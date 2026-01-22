// ============================================
// PORTAFOLIO PREMIUM DAVID DÍAZ - JAVASCRIPT
// CON CARRUSEL APILADO INTERACTIVO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portafolio David Díaz - Cargado');
    
    // ===== CONFIGURACIÓN INICIAL =====
    const config = {
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
    
    // ===== VARIABLES GLOBALES =====
    const header = document.querySelector('.header-minimal');
    const menuToggle = document.getElementById('menuToggle');
    const currentYearEl = document.getElementById('currentYear');
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    // ===== INICIALIZAR TODO =====
    function init() {
        updateCurrentYear();
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initStatsCounter();
        initContactForm();
        initAnimations();
        initLazyLoading();
        initAccessibility();
        
        // Nuevo: Inicializar carrusel
        const carousel = initCarousel();
        
        console.log('✅ Módulos inicializados');
        
        // Exponer carrusel globalmente
        window.DDPortfolio = window.DDPortfolio || {};
        window.DDPortfolio.carousel = carousel;
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (carousel && carousel.cleanup) {
                carousel.cleanup();
            }
        });
    }
    
    // ===== 1. ACTUALIZAR AÑO =====
    function updateCurrentYear() {
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }
    
    // ===== 2. MENÚ MÓVIL =====
    function initMobileMenu() {
        if (!menuToggle) return;
        
        menuToggle.addEventListener('click', toggleMobileMenu);
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }
    
    function toggleMobileMenu() {
        const isOpen = document.body.classList.contains('mobile-menu-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
        
        menuToggle.setAttribute('aria-expanded', !isOpen);
    }
    
    function openMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu active';
        mobileMenu.setAttribute('role', 'dialog');
        mobileMenu.setAttribute('aria-modal', 'true');
        mobileMenu.setAttribute('aria-label', 'Menú de navegación');
        
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <button class="mobile-menu-close" aria-label="Cerrar menú">
                    <i class="fas fa-times"></i>
                </button>
                <nav class="mobile-nav" aria-label="Navegación móvil">
                    <a href="#proyectos" class="nav-link">Proyectos</a>
                    <a href="#servicios" class="nav-link">Servicios</a>
                    <a href="#proceso" class="nav-link">Proceso</a>
                    <a href="#testimonios" class="nav-link">Testimonios</a>
                    <a href="#contacto" class="nav-link">Contacto</a>
                </nav>
                <a href="#contacto" class="btn-primary btn-full">Iniciar Proyecto</a>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        document.body.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
        
        // Enfocar y configurar cierre
        const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
        closeBtn.focus();
        
        closeBtn.addEventListener('click', closeMobileMenu);
        
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Trap focus
        trapFocus(mobileMenu);
    }
    
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                mobileMenu.remove();
                document.body.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
                menuToggle.focus();
                menuToggle.setAttribute('aria-expanded', 'false');
            }, 300);
        }
    }
    
    function trapFocus(element) {
        const focusable = element.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }
    
    // ===== 3. HEADER SCROLL =====
    function initHeaderScroll() {
        let lastScroll = 0;
        
        function updateHeader() {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
                
                if (currentScroll > lastScroll && currentScroll > 100) {
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
        updateHeader();
    }
    
    // ===== 4. SCROLL SUAVE =====
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
                    
                    history.pushState(null, null, href);
                    closeMobileMenu();
                }
            });
        });
    }
    
    // ===== 5. CONTADOR ESTADÍSTICAS =====
    function initStatsCounter() {
        if (statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(el => observer.observe(el));
    }
    
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const isPercentage = element.textContent.includes('%');
        const isMoney = element.textContent.includes('$');
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                let finalValue = target;
                if (isMoney) {
                    element.textContent = `$${finalValue.toFixed(1)}M`;
                } else if (isPercentage) {
                    element.textContent = `${finalValue.toFixed(0)}%`;
                } else {
                    element.textContent = `${finalValue.toFixed(0)}+`;
                }
                clearInterval(timer);
                
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            } else {
                let displayValue = Math.floor(current);
                
                if (isMoney) {
                    element.textContent = `$${displayValue.toFixed(1)}M`;
                } else if (isPercentage) {
                    element.textContent = `${displayValue}%`;
                } else {
                    element.textContent = `${displayValue}+`;
                }
            }
        }, duration / steps);
    }
    
    // ===== 6. FORMULARIO CONTACTO =====
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        // Validación en tiempo real
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
        
        // Envío
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="loading"></span>
                <span>Enviando...</span>
            `;
            
            // Simular envío
            setTimeout(() => {
                showFormSuccess();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    contactForm.reset();
                }, 1500);
            }, 2000);
        });
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        clearError({ target: field });
        
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email inválido';
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
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearError({ target: field });
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            
            const errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            `;
            
            formGroup.appendChild(errorEl);
            field.setAttribute('aria-invalid', 'true');
        }
    }
    
    function clearError(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.remove('error');
            
            const errorEl = formGroup.querySelector('.form-error');
            if (errorEl) errorEl.remove();
            
            field.removeAttribute('aria-invalid');
        }
    }
    
    function showFormSuccess() {
        const form = document.getElementById('contactForm');
        const successMessage = document.createElement('div');
        
        successMessage.className = 'form-success';
        successMessage.setAttribute('role', 'alert');
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>¡Mensaje enviado!</h4>
                <p>Te responderé en menos de 24 horas.</p>
            </div>
        `;
        
        form.parentNode.insertBefore(successMessage, form);
        
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 300);
        }, 5000);
    }
    
    // ===== 7. ANIMACIONES =====
    function initAnimations() {
        if (config.reduceMotion) return;
        
        const elements = document.querySelectorAll(
            '.project-card, .service-card, .testimonial-card, .process-step'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // ===== 8. LAZY LOADING =====
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            images.forEach(img => {
                img.classList.add('lazy-load');
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            });
        } else {
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
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ===== 9. ACCESIBILIDAD =====
    function initAccessibility() {
        // Añadir roles a imágenes sin alt
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', '');
            img.setAttribute('aria-hidden', 'true');
        });
        
        // Navegación con teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });
    }
    
    // ===== 10. CARRUSEL APILADO =====
    function initCarousel() {
        const carouselTrack = document.getElementById('carouselTrack');
        if (!carouselTrack) return null;
        
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        let currentIndex = 0;
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let autoRotateInterval = null;
        
        // Configuración
        const configCarousel = {
            slideCount: slides.length,
            autoRotateDelay: 8000,
            mouseSensitivity: 0.5
        };
        
        // Inicializar
        updateCarousel();
        startAutoRotate();
        initMouseWheel();
        initTouchEvents();
        initHoverEffects();
        
        // Event Listeners
        if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
        if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Navegación
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
            resetAutoRotate();
        }
        
        function goToPrevSlide() {
            currentIndex = (currentIndex - 1 + configCarousel.slideCount) % configCarousel.slideCount;
            updateCarousel();
            resetAutoRotate();
        }
        
        function goToNextSlide() {
            currentIndex = (currentIndex + 1) % configCarousel.slideCount;
            updateCarousel();
            resetAutoRotate();
        }
        
        function updateCarousel() {
            // Actualizar slides
            slides.forEach((slide, index) => {
                const diff = (index - currentIndex + configCarousel.slideCount) % configCarousel.slideCount;
                
                slide.classList.remove('active');
                
                // Asignar nuevos índices para efecto apilado
                let newIndex = diff;
                if (newIndex > 2) newIndex = 4 - newIndex;
                
                slide.setAttribute('data-index', newIndex);
                
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });
            
            // Actualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Auto-rotación
        function startAutoRotate() {
            if (configCarousel.autoRotateDelay > 0 && !config.reduceMotion) {
                autoRotateInterval = setInterval(() => {
                    goToNextSlide();
                }, configCarousel.autoRotateDelay);
            }
        }
        
        function resetAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                startAutoRotate();
            }
        }
        
        // Mouse Wheel
        function initMouseWheel() {
            carouselTrack.addEventListener('wheel', handleWheel, { passive: false });
        }
        
        function handleWheel(e) {
            e.preventDefault();
            
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                if (e.deltaY > 0) {
                    goToNextSlide();
                } else {
                    goToPrevSlide();
                }
            } else {
                if (e.deltaX > 0) {
                    goToNextSlide();
                } else {
                    goToPrevSlide();
                }
            }
            
            resetAutoRotate();
        }
        
        // Touch/Mouse Drag
        function initTouchEvents() {
            carouselTrack.addEventListener('mousedown', startDrag);
            carouselTrack.addEventListener('touchstart', startDrag);
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
            document.addEventListener('touchcancel', endDrag);
        }
        
        function startDrag(e) {
            isDragging = true;
            startX = getClientX(e);
            currentX = startX;
            
            resetAutoRotate();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const newX = getClientX(e);
            const deltaX = newX - currentX;
            
            currentX = newX;
            
            // Si el drag es significativo, cambiar slide
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    goToPrevSlide();
                } else {
                    goToNextSlide();
                }
                endDrag();
            }
        }
        
        function endDrag() {
            isDragging = false;
        }
        
        function getClientX(e) {
            return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        }
        
        // Hover effects
        function initHoverEffects() {
            slides.forEach((slide, index) => {
                slide.addEventListener('click', (e) => {
                    if (!isDragging) {
                        e.preventDefault();
                        goToSlide(index);
                    }
                });
                
                // Para desktop: hover effect
                if (!config.isTouch) {
                    slide.addEventListener('mouseenter', () => {
                        if (!isDragging) {
                            slide.style.zIndex = '15';
                        }
                    });
                    
                    slide.addEventListener('mouseleave', () => {
                        if (!isDragging && !slide.classList.contains('active')) {
                            slide.style.zIndex = '';
                        }
                    });
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === 'ArrowLeft') {
                goToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
            }
        });
        
        // Cleanup
        function cleanup() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
            }
            
            // Remover event listeners
            if (prevBtn) prevBtn.removeEventListener('click', goToPrevSlide);
            if (nextBtn) nextBtn.removeEventListener('click', goToNextSlide);
            
            dots.forEach((dot, index) => {
                dot.removeEventListener('click', () => goToSlide(index));
            });
            
            carouselTrack.removeEventListener('wheel', handleWheel);
            carouselTrack.removeEventListener('mousedown', startDrag);
            carouselTrack.removeEventListener('touchstart', startDrag);
            
            document.removeEventListener('keydown', handleKeydown);
        }
        
        function handleKeydown(e) {
            if (e.key === 'ArrowLeft') goToPrevSlide();
            if (e.key === 'ArrowRight') goToNextSlide();
        }
        
        document.addEventListener('keydown', handleKeydown);
        
        // Public methods
        return {
            next: goToNextSlide,
            prev: goToPrevSlide,
            goTo: goToSlide,
            cleanup: cleanup,
            getCurrentIndex: () => currentIndex
        };
    }
    
    // ===== INICIALIZAR =====
    init();
    
    // ===== UTILIDADES GLOBALES =====
    window.DDPortfolio = window.DDPortfolio || {};
    Object.assign(window.DDPortfolio, {
        refresh: function() {
            statNumbers.forEach(stat => {
                const target = stat.getAttribute('data-count');
                const isPercentage = stat.textContent.includes('%');
                const isMoney = stat.textContent.includes('$');
                
                if (isMoney) {
                    stat.textContent = `$${target}M`;
                } else if (isPercentage) {
                    stat.textContent = `${target}%`;
                } else {
                    stat.textContent = `${target}+`;
                }
            });
        },
        
        showNotification: function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.setAttribute('role', 'alert');
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close" aria-label="Cerrar">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
            
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            });
        }
    });
});

// Polyfill para Safari
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => console.log('Polyfill cargado'));
}
