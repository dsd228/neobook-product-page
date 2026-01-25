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
        coverflowTrack: document.getElementById('coverflowTrack'),
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
        initCoverflow();
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
                    <a href="#mockups" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-paint-brush"></i> Mockups
                    </a>
                    <a href="#resultados" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-chart-line"></i> Resultados
                    </a>
                    <a href="#proyectos" class="nav-link" onclick="closeMobileMenu()">
                        <i class="fas fa-briefcase"></i> Casos
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
            '.result-card, .process-card, .testimonial-card, .benefit-item, .mockup-card'
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
    
    // ===== 8. COVERFLOW CON CONTEXTO =====
    function initCoverflow() {
        if (!elements.coverflowTrack) return;
        
        const slides = document.querySelectorAll('.coverflow-slide');
        const dots = document.querySelectorAll('.coverflow-dots .dot');
        const prevBtn = document.querySelector('.coverflow-prev');
        const nextBtn = document.querySelector('.coverflow-next');
        
        if (slides.length === 0) return;
        
        // Elementos de vista previa CON CONTEXTO
        const previewElements = {
            img: document.getElementById('previewImg'),
            title: document.getElementById('previewTitle'),
            description: document.getElementById('previewDescription'),
            badge: document.getElementById('previewBadge'),
            stat1: document.getElementById('previewStat1'),
            duration: document.getElementById('previewDuration'),
            problem: document.getElementById('previewProblem'),
            solution: document.getElementById('previewSolution')
        };
        
        // Estado
        let currentIndex = 0;
        const totalSlides = slides.length;
        let isAnimating = false;
        let isDragging = false;
        let dragStartX = 0;
        let dragCurrentX = 0;
        const dragThreshold = 30;
        
        // Configuración
        const coverflowConfig = {
            animationDuration: 600,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            visibleSlides: 2
        };
        
        // Inicializar
        updateCoverflow();
        updatePreview();
        initCoverflowEvents();
        
        // Funciones principales
        function updateCoverflow() {
            if (isAnimating) return;
            isAnimating = true;
            
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                
                let relativeIndex = index - currentIndex;
                
                if (Math.abs(relativeIndex) > coverflowConfig.visibleSlides) {
                    slide.style.opacity = '0';
                    slide.style.pointerEvents = 'none';
                } else {
                    slide.style.opacity = '';
                    slide.style.pointerEvents = '';
                    slide.setAttribute('data-index', relativeIndex.toString());
                }
                
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            setTimeout(() => {
                isAnimating = false;
            }, coverflowConfig.animationDuration);
        }
        
        function updatePreview() {
            const activeSlide = slides[currentIndex];
            if (!activeSlide || !previewElements.img) return;
            
            // Actualizar datos CON CONTEXTO
            previewElements.img.src = activeSlide.getAttribute('data-img');
            previewElements.img.alt = activeSlide.getAttribute('data-title');
            previewElements.title.textContent = activeSlide.getAttribute('data-title');
            previewElements.description.textContent = activeSlide.getAttribute('data-description');
            previewElements.badge.textContent = activeSlide.getAttribute('data-badge');
            previewElements.stat1.textContent = activeSlide.getAttribute('data-stat1');
            previewElements.duration.textContent = activeSlide.getAttribute('data-duration');
            
            // Contexto problema/solución
            if (previewElements.problem) {
                previewElements.problem.textContent = activeSlide.getAttribute('data-problem');
            }
            if (previewElements.solution) {
                previewElements.solution.textContent = activeSlide.getAttribute('data-solution');
            }
            
            // Animación
            const previewContent = document.querySelector('.preview-content');
            if (previewContent) {
                previewContent.style.opacity = '0';
                previewContent.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    previewContent.style.transition = 'all 0.4s ease';
                    previewContent.style.opacity = '1';
                    previewContent.style.transform = 'translateY(0)';
                }, 50);
            }
        }
        
        function goToSlide(index) {
            if (isAnimating || index === currentIndex) return;
            
            currentIndex = (index + totalSlides) % totalSlides;
            updateCoverflow();
            updatePreview();
        }
        
        function goToPrevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function goToNextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        // Event Listeners
        function initCoverflowEvents() {
            // Botones de navegación
            if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
            if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
            
            // Dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });
            
            // Click en slides
            slides.forEach((slide, index) => {
                slide.addEventListener('click', () => {
                    if (!isDragging) goToSlide(index);
                });
            });
            
            // Wheel
            elements.coverflowTrack.addEventListener('wheel', handleWheel, { passive: false });
            
            // Drag
            elements.coverflowTrack.addEventListener('mousedown', startDrag);
            elements.coverflowTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
            
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
            document.addEventListener('touchcancel', endDrag);
            
            // Teclado
            document.addEventListener('keydown', handleKeydown);
        }
        
        function handleWheel(e) {
            e.preventDefault();
            if (isAnimating) return;
            
            e.deltaY > 0 ? goToNextSlide() : goToPrevSlide();
        }
        
        function startDrag(e) {
            isDragging = true;
            dragStartX = e.clientX || e.touches[0].clientX;
            dragCurrentX = dragStartX;
            
            // Prevenir selección de texto durante el drag
            e.preventDefault();
        }
        
        function handleDrag(e) {
            if (!isDragging) return;
            dragCurrentX = e.clientX || e.touches[0].clientX;
            updateDragEffect();
        }
        
        function handleTouchStart(e) {
            if (e.touches.length === 1) {
                startDrag(e);
            }
        }
        
        function handleTouchMove(e) {
            if (!isDragging || e.touches.length !== 1) return;
            e.preventDefault();
            handleDrag(e);
        }
        
        function endDrag() {
            if (!isDragging) return;
            
            const dragDistance = dragCurrentX - dragStartX;
            
            if (Math.abs(dragDistance) > dragThreshold) {
                dragDistance > 0 ? goToPrevSlide() : goToNextSlide();
            }
            
            isDragging = false;
            if (elements.coverflowTrack) {
                elements.coverflowTrack.style.transform = '';
                elements.coverflowTrack.style.transition = '';
            }
        }
        
        function updateDragEffect() {
            if (!isDragging || !elements.coverflowTrack) return;
            
            const dragDistance = dragCurrentX - dragStartX;
            elements.coverflowTrack.style.transform = `translateX(${dragDistance}px)`;
            elements.coverflowTrack.style.transition = 'none';
        }
        
        function handleKeydown(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNextSlide();
            }
        }
        
        // Auto-rotación opcional
        let autoRotateInterval;
        function startAutoRotate() {
            if (config.reduceMotion) return;
            
            autoRotateInterval = setInterval(() => {
                goToNextSlide();
            }, 5000);
        }
        
        function stopAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
            }
        }
        
        // Pausar auto-rotación en hover/interacción
        const coverflowContainer = document.querySelector('.coverflow-container');
        if (coverflowContainer) {
            coverflowContainer.addEventListener('mouseenter', stopAutoRotate);
            coverflowContainer.addEventListener('mouseleave', startAutoRotate);
            coverflowContainer.addEventListener('touchstart', stopAutoRotate);
        }
        
        // Iniciar auto-rotación
        startAutoRotate();
        
        // API pública
        window.coverflowAPI = window.coverflowAPI || {};
        Object.assign(window.coverflowAPI, {
            next: goToNextSlide,
            prev: goToPrevSlide,
            goTo: (index) => goToSlide(index),
            getCurrentIndex: () => currentIndex,
            startAutoRotate: startAutoRotate,
            stopAutoRotate: stopAutoRotate
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
        
        // Track mockup gallery interactions
        document.querySelectorAll('.view-full').forEach(link => {
            link.addEventListener('click', function() {
                const mockupTitle = this.closest('.mockup-card').querySelector('h3').textContent;
                console.log(`📊 Mockup Viewed: "${mockupTitle}"`);
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
// Agrega esto al final de tu script.js existente o crea un nuevo archivo

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryOverlay = document.querySelector('.gallery-overlay');
    const galleryClose = document.querySelector('.gallery-close');
    const body = document.body;
    
    // Expandir card al hacer clic
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevenir que se expanda si ya está expandida
            if (this.classList.contains('expanded')) return;
            
            // Obtener posición original
            const rect = this.getBoundingClientRect();
            
            // Calcular transform para animación
            const scaleX = window.innerWidth / rect.width;
            const scaleY = window.innerHeight / rect.height;
            
            // Guardar posición original
            this.style.setProperty('--original-x', `${rect.left}px`);
            this.style.setProperty('--original-y', `${rect.top}px`);
            this.style.setProperty('--original-width', `${rect.width}px`);
            this.style.setProperty('--original-height', `${rect.height}px`);
            
            // Añadir clases para expansión
            this.classList.add('expanded');
            galleryOverlay.classList.add('active');
            body.classList.add('no-scroll');
            
            // Forzar reflow para reiniciar animación
            void this.offsetWidth;
        });
    });
    
    // Cerrar card expandida
    function closeExpandedCard() {
        const expandedItem = document.querySelector('.gallery-item.expanded');
        if (expandedItem) {
            expandedItem.classList.remove('expanded');
            galleryOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    }
    
    // Eventos para cerrar
    galleryClose.addEventListener('click', closeExpandedCard);
    galleryOverlay.addEventListener('click', closeExpandedCard);
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeExpandedCard();
        }
    });
    
    // Prevenir scroll en cards expandidas
    document.addEventListener('wheel', function(e) {
        if (document.querySelector('.gallery-item.expanded')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Cerrar al hacer clic fuera de la imagen expandida
    document.addEventListener('click', function(e) {
        const expandedItem = document.querySelector('.gallery-item.expanded');
        if (expandedItem && 
            !expandedItem.contains(e.target) && 
            e.target !== galleryClose && 
            !galleryClose.contains(e.target)) {
            closeExpandedCard();
        }
    });
});
