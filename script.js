// ============================================
// PORTAFOLIO OPTIMIZADO 10/10 - JAVASCRIPT
// Enfocado en conversión y experiencia de usuario
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portafolio David Díaz - Optimizado 10/10');
    
    // ===== CONFIGURACIÓN =====
    const config = {
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        debug: false
    };
    
    // ===== ELEMENTOS PRINCIPALES =====
    const elements = {
        header: document.querySelector('.header-minimal'),
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
        initHeaderScroll();
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
    }
    
    function toggleMobileMenu() {
        const isOpen = document.body.classList.contains('mobile-menu-open');
        isOpen ? closeMobileMenu() : openMobileMenu();
        elements.menuToggle.setAttribute('aria-expanded', !isOpen);
    }
    
    function openMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu active';
        mobileMenu.setAttribute('role', 'dialog');
        mobileMenu.setAttribute('aria-modal', 'true');
        
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <button class="mobile-menu-close" aria-label="Cerrar menú">
                    <i class="fas fa-times"></i>
                </button>
                <nav class="mobile-nav">
                    <a href="#resultados" class="nav-link">
                        <i class="fas fa-chart-line"></i> Resultados
                    </a>
                    <a href="#proyectos" class="nav-link">
                        <i class="fas fa-briefcase"></i> Casos
                    </a>
                    <a href="#servicios" class="nav-link">
                        <i class="fas fa-cogs"></i> Cómo trabajo
                    </a>
                    <a href="#contacto" class="nav-link">
                        <i class="fas fa-calendar-check"></i> Contacto
                    </a>
                </nav>
                <a href="#contacto" class="btn-primary">Consulta gratuita</a>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        document.body.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
        
        const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
        closeBtn.focus();
        closeBtn.addEventListener('click', closeMobileMenu);
        
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
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
                elements.menuToggle.focus();
                elements.menuToggle.setAttribute('aria-expanded', 'false');
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
        const threshold = 100;
        
        function updateHeader() {
            const currentScroll = window.scrollY;
            const isScrollingDown = currentScroll > lastScroll;
            
            if (currentScroll > 50) {
                elements.header.classList.add('scrolled');
                
                if (isScrollingDown && currentScroll > threshold) {
                    elements.header.style.transform = 'translateY(-100%)';
                } else {
                    elements.header.style.transform = 'translateY(0)';
                }
            } else {
                elements.header.classList.remove('scrolled');
                elements.header.style.transform = 'translateY(0)';
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
                    const headerHeight = elements.header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
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
        }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });
        
        elements.statNumbers.forEach(el => observer.observe(el));
    }
    
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const text = element.textContent;
        const isMoney = text.includes('$');
        const isPercentage = text.includes('%');
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
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
                setTimeout(() => element.style.transform = 'scale(1)', 200);
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
                <span class="loading"></span>
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
            '.result-card, .process-card, .testimonial-card, .benefit-item'
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
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // ===== 8. COVERFLOW OPTIMIZADO =====
    function initCoverflow() {
        if (!elements.coverflowTrack) return null;
        
        const slides = document.querySelectorAll('.coverflow-slide');
        const dots = document.querySelectorAll('.coverflow-dots .dot');
        const prevBtn = document.querySelector('.coverflow-prev');
        const nextBtn = document.querySelector('.coverflow-next');
        
        // Elementos de vista previa
        const previewElements = {
            img: document.getElementById('previewImg'),
            title: document.getElementById('previewTitle'),
            description: document.getElementById('previewDescription'),
            badge: document.getElementById('previewBadge'),
            stat1: document.getElementById('previewStat1'),
            duration: document.getElementById('previewDuration')
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
            
            // Actualizar datos
            previewElements.img.src = activeSlide.getAttribute('data-img');
            previewElements.img.alt = activeSlide.getAttribute('data-title');
            previewElements.title.textContent = activeSlide.getAttribute('data-title');
            previewElements.description.textContent = activeSlide.getAttribute('data-description');
            previewElements.badge.textContent = activeSlide.getAttribute('data-badge');
            previewElements.stat1.textContent = activeSlide.getAttribute('data-stat1');
            previewElements.duration.textContent = activeSlide.getAttribute('data-duration');
            
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
            elements.coverflowTrack.style.transform = '';
            elements.coverflowTrack.style.transition = '';
        }
        
        function updateDragEffect() {
            if (!isDragging) return;
            
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
        
        // API pública
        return {
            next: goToNextSlide,
            prev: goToPrevSlide,
            goTo: (index) => goToSlide(index),
            getCurrentIndex: () => currentIndex
        };
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
            });
        }
    }
    
    // ===== INICIALIZAR =====
    init();
    
    // ===== API GLOBAL =====
    window.DDPortfolio = window.DDPortfolio || {};
    Object.assign(window.DDPortfolio, {
        refresh: function() {
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
        },
        
        showNotification: function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('fade-out'), 5000);
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.add('fade-out');
            });
        }
    });
});

// Polyfill para navegadores antiguos
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js');
}
