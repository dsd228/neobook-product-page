// ============================================
// PORTAFOLIO OPTIMIZADO 10/10 - JAVASCRIPT
// Enfocado en conversión y experiencia de usuario
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portafolio David Díaz - Optimizado 10/10');
    
    // ===== CONFIGURACIÓN =====
    const config = {
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        debug: false
    };
    
    // ===== ELEMENTOS PRINCIPALES =====
    const elements = {
        header: document.querySelector('.header-fixed'),
        menuToggle: document.getElementById('menuToggle'),
        currentYear: document.getElementById('currentYear'),
        contactForm: document.getElementById('contactForm'),
        statNumbers: document.querySelectorAll('[data-count]')
    };
    
    // ===== INICIALIZAR MÓDULOS =====
    function init() {
    updateCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initHeaderSticky();
    initStatsCounter();
    initContactForm();
    initAnimations();
    initAppleGallery();
    initCasesInteractions(); // ← AÑADE ESTA LÍNEA
    initAnalytics();
    
    if (config.debug) console.log('✅ Todos los módulos inicializados');
}
    
    // ===== 1. AÑO ACTUAL =====
    function updateCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // ===== 2. MENÚ MÓVIL OPTIMIZADO =====
    function initMobileMenu() {
        if (!elements.menuToggle) return;
        
        elements.menuToggle.addEventListener('click', toggleMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active') && 
                !e.target.closest('.mobile-menu-content') && 
                !e.target.closest('#menuToggle')) {
                closeMobileMenu();
            }
        });
    }
    
    function toggleMobileMenu() {
        const isOpen = document.body.classList.contains('mobile-menu-open');
        isOpen ? closeMobileMenu() : openMobileMenu();
        elements.menuToggle.setAttribute('aria-expanded', !isOpen);
    }
    
    function openMobileMenu() {
        // Evitar duplicados
        if (document.querySelector('.mobile-menu')) return;
        
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.setAttribute('role', 'dialog');
        mobileMenu.setAttribute('aria-modal', 'true');
        mobileMenu.setAttribute('aria-label', 'Menú de navegación');
        
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <button class="mobile-menu-close" aria-label="Cerrar menú" type="button">
                    <i class="fas fa-times"></i>
                </button>
                <nav class="mobile-nav" aria-label="Navegación principal">
                    <a href="#hero" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-home"></i> Inicio
                    </a>
                    <a href="#gallery" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-paint-brush"></i> Mockups
                    </a>
                    <a href="#resultados" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-chart-line"></i> Resultados
                    </a>
                    <a href="#proyectos" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-briefcase"></i> Casos
                    </a>
                    <a href="#sobre-mi" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-user-tie"></i> Experiencia
                    </a>
                    <a href="#servicios" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-cogs"></i> Proceso
                    </a>
                    <a href="#testimonios" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-quote-right"></i> Testimonios
                    </a>
                    <a href="#contacto" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-calendar-check"></i> Contacto
                    </a>
                </nav>
                <a href="#contacto" class="btn-primary btn-block" onclick="closeMobileMenu()">
                    <i class="fas fa-calendar-check"></i> Trabajemos juntos
                </a>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        
        // Agregar clase active después de un pequeño delay para la animación
        setTimeout(() => {
            mobileMenu.classList.add('active');
            document.body.classList.add('mobile-menu-open');
            
            // Enfocar el botón de cerrar
            const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
            if (closeBtn) closeBtn.focus();
            
            // Event listeners
            closeBtn.addEventListener('click', closeMobileMenu);
            
            // Cerrar al hacer clic en enlaces
            mobileMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            
            // Trap focus dentro del menú
            trapFocus(mobileMenu);
        }, 10);
    }
    
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu) return;
        
        // Remover clase active para animación de salida
        mobileMenu.classList.remove('active');
        
        setTimeout(() => {
            if (mobileMenu.parentNode) {
                mobileMenu.parentNode.removeChild(mobileMenu);
            }
            document.body.classList.remove('mobile-menu-open');
            
            // Restaurar focus al botón del menú
            if (elements.menuToggle) {
                elements.menuToggle.focus();
                elements.menuToggle.setAttribute('aria-expanded', 'false');
            }
        }, 300); // Match CSS transition duration
    }
    
    function trapFocus(element) {
        const focusable = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        const handleKeydown = function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                // Tab
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        
        element.addEventListener('keydown', handleKeydown);
        
        // Remover event listener cuando se cierre el menú
        element._trapFocusHandler = handleKeydown;
    }
    
    // ===== 3. HEADER FIXED (siempre visible) =====
    function initHeaderSticky() {
        if (!elements.header) return;
        
        function updateHeader() {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }
        }
        
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader(); // Estado inicial
    }
    
    // ===== 4. SCROLL SUAVE =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Excluir enlaces que no apuntan a secciones
            if (anchor.getAttribute('href') === '#' || 
                anchor.classList.contains('external-link')) return;
            
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#hero') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = elements.header ? elements.header.offsetHeight : 70;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
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
    
    // ===== 5. CONTADORES DE ESTADÍSTICAS =====
    function initStatsCounter() {
        if (elements.statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.5, 
            rootMargin: '0px 0px -50px 0px' 
        });
        
        elements.statNumbers.forEach(el => observer.observe(el));
    }
    
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
        // Determinar formato
        const isMoney = element.textContent.includes('$');
        const isPercentage = element.textContent.includes('%');
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                clearInterval(timer);
                let finalValue = target;
                
                if (isMoney) {
                    element.textContent = `$${finalValue.toFixed(1)}M`;
                } else if (isPercentage) {
                    element.textContent = `${finalValue.toFixed(0)}%`;
                } else {
                    element.textContent = `${finalValue.toFixed(0)}+`;
                }
                
                // Efecto visual
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            } else {
                const displayValue = Math.floor(current);
                
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
    
    // ===== 6. FORMULARIO DE CONTACTO =====
    function initContactForm() {
        if (!elements.contactForm) return;
        
        // Validación en tiempo real
        elements.contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
        
        // Envío del formulario
        elements.contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>Enviando...</span>
            `;
            
            // Simulación de envío (en producción sería fetch)
            setTimeout(() => {
                showFormSuccess();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    elements.contactForm.reset();
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
        } else if (field.type === 'url' && value && !value.startsWith('http')) {
            isValid = false;
            errorMessage = 'URL debe comenzar con http:// o https://';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function validateForm() {
        let isValid = true;
        
        elements.contactForm.querySelectorAll('[required]').forEach(field => {
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
        const form = elements.contactForm;
        if (!form) return;
        
        const successMessage = document.createElement('div');
        
        successMessage.className = 'form-success';
        successMessage.setAttribute('role', 'alert');
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>¡Solicitud enviada!</h4>
                <p>Te contactaré en menos de 12 horas para agendar tu consulta.</p>
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
        
        const animatedElements = document.querySelectorAll(
            '.result-card, .process-card, .testimonial-card, .benefit-item, .case-card'
        );
        
        if (animatedElements.length === 0) return;
        
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
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    // ===== INTERACCIONES MEJORADAS PARA CASOS =====
function initCasesInteractions() {
    const caseCards = document.querySelectorAll('.case-card');
    
    caseCards.forEach(card => {
        // Hover effects mejorados
        card.addEventListener('mouseenter', () => {
            const stats = card.querySelectorAll('.stat');
            stats.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.transform = 'translateY(-2px)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const stats = card.querySelectorAll('.stat');
            stats.forEach(stat => {
                stat.style.transform = 'translateY(0)';
            });
        });
        
        // Click en la imagen para ver más
        const image = card.querySelector('.case-image');
        if (image) {
            image.addEventListener('click', () => {
                const title = card.querySelector('.case-title').textContent;
                console.log(`📊 Caso visto: ${title}`);
                
                // Aquí podrías agregar lógica para abrir un modal o lightbox
                // Por ejemplo: openCaseModal(card);
            });
        }
        
        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('.btn-primary');
                if (link) link.click();
            }
        });
    });
    
    // Track clicks en botones de casos
    document.querySelectorAll('.btn-case').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.case-card');
            const title = card.querySelector('.case-title').textContent;
            const action = this.textContent.trim();
            
            console.log(`📊 Caso acción: ${title} - ${action}`);
            
            // Aquí iría tu código de analytics
            // trackEvent('case_action', { title: title, action: action });
        });
    });
}
    // ===== 8. GALERÍA APPLE PRO - CARRUSEL INFINITO =====
    function initAppleGallery() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;
        
        // Duplicar los items para efecto infinito
        const items = galleryTrack.querySelectorAll('.gallery-item');
        const cloneItems = Array.from(items).map(item => item.cloneNode(true));
        
        cloneItems.forEach(item => {
            galleryTrack.appendChild(item);
        });
        
        // Controles
        const dots = document.querySelectorAll('.gallery-dot');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        
        let currentIndex = 0;
        const totalItems = items.length;
        let autoScrollInterval;
        
        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = (index + totalItems) % totalItems;
            updateDots();
            
            // Centrar el slide actual
            const trackWidth = galleryTrack.scrollWidth / 2; // Porque duplicamos los items
            const slideWidth = items[0].offsetWidth;
            const targetScroll = currentIndex * slideWidth;
            
            galleryTrack.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            galleryTrack.style.transform = `translateX(-${targetScroll}px)`;
        }
        
        function startAutoScroll() {
            if (config.reduceMotion) return;
            
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateDots();
            }, 5000);
        }
        
        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }
        
        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoScroll();
                goToSlide(currentIndex - 1);
                startAutoScroll();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoScroll();
                goToSlide(currentIndex + 1);
                startAutoScroll();
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoScroll();
                goToSlide(index);
                startAutoScroll();
            });
        });
        
        // Pausar auto-rotación al hacer hover
        const galleryCarousel = document.querySelector('.gallery-carousel');
        if (galleryCarousel) {
            galleryCarousel.addEventListener('mouseenter', stopAutoScroll);
            galleryCarousel.addEventListener('mouseleave', startAutoScroll);
            galleryCarousel.addEventListener('touchstart', stopAutoScroll);
        }
        
        // Iniciar
        updateDots();
        startAutoScroll();
        
        // API pública
        window.galleryAPI = window.galleryAPI || {};
        Object.assign(window.galleryAPI, {
            next: () => goToSlide(currentIndex + 1),
            prev: () => goToSlide(currentIndex - 1),
            goTo: (index) => goToSlide(index),
            getCurrentIndex: () => currentIndex,
            startAutoScroll: startAutoScroll,
            stopAutoScroll: stopAutoScroll
        });
    }
    
    // ===== 9. ANALÍTICAS SIMPLIFICADAS =====
    function initAnalytics() {
        // Track CTA clicks
        document.querySelectorAll('.btn-primary, .btn-cta-primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.textContent.trim();
                console.log(`📊 CTA Clicked: "${text.substring(0, 30)}..."`);
                // Aquí iría tu código de Google Analytics o similares
            });
        });
        
        // Track form submissions
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', function() {
                console.log('📊 Form Submitted');
                // Aquí iría tu código de Google Analytics o similares
            });
        }
        
        // Track mobile menu opens
        if (elements.menuToggle) {
            elements.menuToggle.addEventListener('click', function() {
                const isOpen = document.body.classList.contains('mobile-menu-open');
                console.log(`📊 Mobile Menu ${isOpen ? 'Closed' : 'Opened'}`);
            });
        }
        
        // Track gallery interactions
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const overlay = this.querySelector('.gallery-overlay h3');
                if (overlay) {
                    console.log(`📊 Gallery Item Viewed: "${overlay.textContent}"`);
                }
            });
        });
    }
    
    // ===== INICIALIZAR =====
    init();
    
    // ===== API GLOBAL (para debug/testing) =====
    window.DDPortfolio = window.DDPortfolio || {};
    Object.assign(window.DDPortfolio, {
        refresh: function() {
            if (elements.statNumbers) {
                elements.statNumbers.forEach(stat => {
                    const target = stat.getAttribute('data-count');
                    const text = stat.textContent;
                    
                    if (text.includes('$')) {
                        stat.textContent = `$${target}M`;
                    } else if (text.includes('%')) {
                        stat.textContent = `${target}%`;
                    } else {
                        stat.textContent = `${target}+`;
                    }
                });
            }
        },
        
        showNotification: function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close" type="button">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('fade-out'), 5000);
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.add('fade-out');
            });
        },
        
        // Métodos para controlar el menú desde la consola
        openMobileMenu: openMobileMenu,
        closeMobileMenu: closeMobileMenu,
        toggleMobileMenu: toggleMobileMenu
    });
    
    // Para debugging
    if (config.debug) {
        console.log('🔧 Debug mode enabled');
        console.log('📱 Mobile menu toggle:', elements.menuToggle);
        console.log('🏠 Header:', elements.header);
        console.log('📊 Stats:', elements.statNumbers.length);
        console.log('📝 Contact form:', elements.contactForm);
    }
});

// Polyfill para navegadores antiguos
if (!('scrollBehavior' in document.documentElement.style)) {
    console.log('📦 Loading smoothscroll polyfill...');
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    script.onload = () => console.log('✅ Smoothscroll polyfill loaded');
    document.head.appendChild(script);
}

// Asegurar que las funciones estén disponibles globalmente para los onclick
window.closeMobileMenu = function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) return;
    
    mobileMenu.classList.remove('active');
    
    setTimeout(() => {
        if (mobileMenu.parentNode) {
            mobileMenu.parentNode.removeChild(mobileMenu);
        }
        document.body.classList.remove('mobile-menu-open');
        
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.focus();
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }, 300);
};
