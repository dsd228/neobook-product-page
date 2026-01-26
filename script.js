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
        statNumbers: document.querySelectorAll('[data-count]'),
        galleryTrack: document.querySelector('.gallery-track'),
        casesGrid: document.querySelector('.cases-grid')
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
        initCasesInteractions();
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
    
    // ===== 8. GALERÍA APPLE PRO - CARRUSEL INFINITO =====
    function initAppleGallery() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;
        
        // Duplicar los items para efecto infinito
        const items = galleryTrack.querySelectorAll('.gallery-item');
        if (items.length === 0) return;
        
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
                
                // Animación suave para auto-scroll
                const slideWidth = items[0].offsetWidth;
                const targetScroll = currentIndex * slideWidth;
                galleryTrack.style.transition = 'transform 0.8s ease-in-out';
                galleryTrack.style.transform = `translateX(-${targetScroll}px)`;
            }, 5000);
        }
        
        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }
        
        // Event listeners para controles
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
        
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    stopAutoScroll();
                    goToSlide(index);
                    startAutoScroll();
                });
            });
        }
        
        // Pausar auto-rotación al hacer hover
        const galleryCarousel = document.querySelector('.gallery-carousel');
        if (galleryCarousel) {
            galleryCarousel.addEventListener('mouseenter', stopAutoScroll);
            galleryCarousel.addEventListener('mouseleave', startAutoScroll);
            galleryCarousel.addEventListener('touchstart', stopAutoScroll);
        }
        
        // Touch/swipe para móviles
        let touchStartX = 0;
        let touchEndX = 0;
        
        galleryCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        galleryCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe izquierda - siguiente
                    stopAutoScroll();
                    goToSlide(currentIndex + 1);
                } else {
                    // Swipe derecha - anterior
                    stopAutoScroll();
                    goToSlide(currentIndex - 1);
                }
                startAutoScroll();
            }
        }
        
        // Iniciar
        updateDots();
        startAutoScroll();
        
        // API pública para control externo
        window.galleryAPI = window.galleryAPI || {};
        Object.assign(window.galleryAPI, {
            next: () => {
                stopAutoScroll();
                goToSlide(currentIndex + 1);
                startAutoScroll();
            },
            prev: () => {
                stopAutoScroll();
                goToSlide(currentIndex - 1);
                startAutoScroll();
            },
            goTo: (index) => {
                stopAutoScroll();
                goToSlide(index);
                startAutoScroll();
            },
            getCurrentIndex: () => currentIndex,
            startAutoScroll: startAutoScroll,
            stopAutoScroll: stopAutoScroll
        });
    }
    
    // ===== 9. INTERACCIONES MEJORADAS PARA CASOS =====
    function initCasesInteractions() {
        const caseCards = document.querySelectorAll('.case-card');
        
        caseCards.forEach(card => {
            // Hover effects mejorados
            card.addEventListener('mouseenter', () => {
                if (config.reduceMotion) return;
                
                const stats = card.querySelectorAll('.stat');
                stats.forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.transform = 'translateY(-2px)';
                    }, index * 50);
                });
                
                // Efecto en el badge
                const badge = card.querySelector('.case-badge');
                if (badge) {
                    badge.style.transform = 'translateY(-2px) scale(1.05)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const stats = card.querySelectorAll('.stat');
                stats.forEach(stat => {
                    stat.style.transform = 'translateY(0)';
                });
                
                const badge = card.querySelector('.case-badge');
                if (badge) {
                    badge.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            // Click en la imagen para expandir
            const image = card.querySelector('.case-image');
            if (image) {
                image.addEventListener('click', () => {
                    const title = card.querySelector('.case-title')?.textContent || 'Caso';
                    console.log(`📊 Caso visto: ${title}`);
                    
                    // Aquí podrías agregar lógica para abrir un modal o lightbox
                    openImageModal(card);
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
            
            // Touch feedback para móviles
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            }, { passive: true });
        });
        
        // Track clicks en botones de casos
        document.querySelectorAll('.btn-case').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.case-card');
                const title = card?.querySelector('.case-title')?.textContent || 'Caso';
                const action = this.textContent.trim();
                
                console.log(`📊 Caso acción: ${title} - ${action}`);
                trackEvent('case_action', { title: title, action: action });
            });
        });
        
        // Efectos de scroll para casos
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const casesObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, observerOptions);
        
        caseCards.forEach(card => {
            casesObserver.observe(card);
        });
    }
    
    // ===== 10. MODAL PARA IMÁGENES DE CASOS =====
    function openImageModal(card) {
        const imageSrc = card.querySelector('.case-image img')?.src;
        if (!imageSrc) return;
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Cerrar modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-image-container">
                    <img src="${imageSrc}" alt="Imagen ampliada del caso" class="modal-image">
                </div>
                <div class="modal-info">
                    <h3 class="modal-title">${card.querySelector('.case-title')?.textContent || ''}</h3>
                    <p class="modal-description">${card.querySelector('.case-badge')?.textContent || ''}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Forzar reflow para animación
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Event listeners del modal
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                document.body.style.overflow = '';
            }, 300);
        }
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Cerrar con ESC
        document.addEventListener('keydown', function handleEsc(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        });
        
        // Trap focus dentro del modal
        trapFocus(modal);
    }
    
    // ===== 11. ANALÍTICAS SIMPLIFICADAS =====
    function initAnalytics() {
        // Track CTA clicks
        document.querySelectorAll('.btn-primary, .btn-cta-primary, .btn-case').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.textContent.trim();
                const href = this.getAttribute('href') || '';
                console.log(`📊 CTA Clicked: "${text.substring(0, 30)}..." → ${href}`);
                trackEvent('cta_click', { text: text, href: href });
            });
        });
        
        // Track form submissions
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', function() {
                console.log('📊 Form Submitted');
                trackEvent('form_submit', { form: 'contact' });
            });
        }
        
        // Track mobile menu opens
        if (elements.menuToggle) {
            elements.menuToggle.addEventListener('click', function() {
                const isOpen = document.body.classList.contains('mobile-menu-open');
                console.log(`📊 Mobile Menu ${isOpen ? 'Closed' : 'Opened'}`);
                trackEvent('mobile_menu', { action: isOpen ? 'close' : 'open' });
            });
        }
        
        // Track gallery interactions
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const overlay = this.querySelector('.gallery-overlay h3');
                const title = overlay?.textContent || 'Gallery Item';
                console.log(`📊 Gallery Item Viewed: "${title}"`);
                trackEvent('gallery_view', { item: title });
            });
        });
        
        // Track scroll depth
        let scrollDepthTracked = [25, 50, 75, 90];
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            scrollDepthTracked.forEach(depth => {
                if (scrollPercent >= depth && !window[`scroll${depth}Tracked`]) {
                    console.log(`📊 Scroll Depth: ${depth}%`);
                    trackEvent('scroll_depth', { depth: `${depth}%` });
                    window[`scroll${depth}Tracked`] = true;
                }
            });
        }, { passive: true });
        
        // Track time on page
        let pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
            console.log(`📊 Time on Page: ${timeSpent}s`);
            trackEvent('time_on_page', { seconds: timeSpent });
        });
    }
    
    function trackEvent(eventName, data = {}) {
        // Aquí integrarías con Google Analytics, Facebook Pixel, etc.
        // Ejemplo con dataLayer para GTM:
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': eventName,
                ...data
            });
        }
        
        // Log para debugging
        if (config.debug) {
            console.log(`🎯 Event: ${eventName}`, data);
        }
    }
    
    // ===== 12. PERFORMANCE OPTIMIZATIONS =====
    function initPerformance() {
        // Lazy load imágenes fuera del viewport
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        // Preload recursos críticos
        const criticalResources = [
            'styles.css',
            'script.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
        
        // Optimizar scroll performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Aquí código que necesita ejecutarse en scroll
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    // ===== 13. PWA READY (opcional) =====
    function initPWA() {
        // Registrar Service Worker si está disponible
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registrado:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ Error registrando Service Worker:', error);
                    });
            });
        }
        
        // Detectar instalación de PWA
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevenir que el navegador muestre el prompt automáticamente
            e.preventDefault();
            
            // Guardar el evento para usarlo después
            window.deferredPrompt = e;
            
            // Mostrar botón de instalación personalizado
            showInstallButton();
        });
        
        // Detectar si la app ya está instalada
        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA instalada');
            trackEvent('pwa_installed');
        });
    }
    
    function showInstallButton() {
        const installButton = document.createElement('button');
        installButton.className = 'btn-primary pwa-install-btn';
        installButton.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installButton.style.position = 'fixed';
        installButton.style.bottom = '20px';
        installButton.style.right = '20px';
        installButton.style.zIndex = '9999';
        
        installButton.addEventListener('click', async () => {
            if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                const { outcome } = await window.deferredPrompt.userChoice;
                console.log(`PWA instalación: ${outcome}`);
                trackEvent('pwa_install_prompt', { outcome: outcome });
                window.deferredPrompt = null;
                installButton.remove();
            }
        });
        
        document.body.appendChild(installButton);
        
        // Ocultar después de 10 segundos
        setTimeout(() => {
            installButton.style.opacity = '0';
            setTimeout(() => installButton.remove(), 300);
        }, 10000);
    }
    
    // ===== INICIALIZAR TODO =====
    init();
    initPerformance();
    
    // Solo inicializar PWA en producción
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        initPWA();
    }
    
    // ===== API GLOBAL (para debug/testing) =====
    window.DDPortfolio = window.DDPortfolio || {};
    Object.assign(window.DDPortfolio, {
        // Refrescar contadores
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
        
        // Mostrar notificación
        showNotification: function(message, type = 'success', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close" type="button" aria-label="Cerrar notificación">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            document.body.appendChild(notification);
            
            // Forzar reflow
            notification.offsetHeight;
            notification.classList.add('show');
            
            // Auto cerrar
            const autoClose = setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
            
            // Cerrar manualmente
            notification.querySelector('.notification-close').addEventListener('click', () => {
                clearTimeout(autoClose);
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            });
        },
        
        // Métodos para controlar el menú
        openMobileMenu: openMobileMenu,
        closeMobileMenu: closeMobileMenu,
        toggleMobileMenu: toggleMobileMenu,
        
        // Métodos para la galería
        nextGallery: () => window.galleryAPI?.next(),
        prevGallery: () => window.galleryAPI?.prev(),
        goToGallery: (index) => window.galleryAPI?.goTo(index),
        
        // Métodos de analytics
        trackEvent: trackEvent,
        
        // Métodos de utilidad
        smoothScrollTo: function(targetId) {
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = elements.header?.offsetHeight || 70;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        },
        
        // Test de funcionalidades
        testAll: function() {
            console.group('🧪 Test de funcionalidades');
            console.log('📱 Mobile menu:', !!elements.menuToggle);
            console.log('📊 Stats counters:', elements.statNumbers.length);
            console.log('📝 Contact form:', !!elements.contactForm);
            console.log('🖼️ Gallery:', !!elements.galleryTrack);
            console.log('💼 Cases grid:', !!elements.casesGrid);
            console.groupEnd();
            
            this.showNotification('✅ Todas las funcionalidades cargadas', 'success');
        }
    });
    
    // Para debugging
    if (config.debug) {
        console.log('🔧 Debug mode enabled');
        console.log('📱 Mobile menu toggle:', elements.menuToggle);
        console.log('🏠 Header:', elements.header);
        console.log('📊 Stats:', elements.statNumbers.length);
        console.log('📝 Contact form:', elements.contactForm);
        console.log('🖼️ Gallery track:', elements.galleryTrack);
        console.log('💼 Cases grid:', elements.casesGrid);
    }
});

// ===== POLYFILLS Y FUNCIONES GLOBALES =====

// Polyfill para smooth scroll
if (!('scrollBehavior' in document.documentElement.style)) {
    console.log('📦 Loading smoothscroll polyfill...');
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    script.onload = () => {
        console.log('✅ Smoothscroll polyfill loaded');
        // Iniciar el polyfill
        if (typeof smoothscroll !== 'undefined') {
            smoothscroll.polyfill();
        }
    };
    document.head.appendChild(script);
}

// Polyfill para IntersectionObserver
if (!('IntersectionObserver' in window)) {
    console.log('📦 Loading IntersectionObserver polyfill...');
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    script.onload = () => console.log('✅ IntersectionObserver polyfill loaded');
    document.head.appendChild(script);
}

// Función global para cerrar el menú móvil (necesaria para onclick en HTML)
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

// Función para detectar y manejar prefers-color-scheme
function initDarkMode() {
    // Escuchar cambios en la preferencia de color
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleColorSchemeChange(e) {
        if (e.matches) {
            // Modo oscuro activado
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            // Modo claro activado
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
    
    // Configurar listener
    darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
    
    // Estado inicial
    handleColorSchemeChange(darkModeMediaQuery);
}

// Iniciar detección de modo oscuro cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('🚨 Error global:', e.error);
    
    // Enviar error a analytics si está disponible
    if (window.DDPortfolio && window.DDPortfolio.trackEvent) {
        window.DDPortfolio.trackEvent('javascript_error', {
            message: e.error?.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
        });
    }
    
    // Mostrar error amigable al usuario si es crítico
    if (e.error && e.error.message.includes('critical')) {
        window.DDPortfolio?.showNotification(
            '⚠️ Hubo un error al cargar la página. Por favor, recarga.',
            'error'
        );
    }
}, false);

// Manejo de promises no capturadas
window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Promise no manejada:', e.reason);
    
    if (window.DDPortfolio && window.DDPortfolio.trackEvent) {
        window.DDPortfolio.trackEvent('unhandled_promise', {
            reason: e.reason?.toString()
        });
    }
}, false);

// Optimización para conexiones lentas
if ('connection' in navigator) {
    const connection = navigator.connection;
    
    if (connection) {
        // Si la conexión es lenta (2g/3g/slow-2g)
        if (connection.saveData || 
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.effectiveType === '3g') {
            
            console.log('📶 Conexión lenta detectada, optimizando...');
            
            // Desactivar auto-play de videos
            document.querySelectorAll('video, iframe').forEach(media => {
                media.setAttribute('data-src', media.src);
                media.removeAttribute('src');
                media.loading = 'lazy';
            });
            
            // Desactivar animaciones no esenciales
            document.documentElement.style.setProperty('--transition-normal', '0.1s');
            document.documentElement.style.setProperty('--transition-fast', '0.05s');
        }
    }
}

// ===== ESTILOS DINÁMICOS PARA NOTIFICACIONES =====
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    border-radius: 12px;
    background: var(--color-white);
    color: var(--color-black);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateX(120%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 350px;
    border-left: 4px solid var(--color-primary);
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left-color: #4CAF50;
}

.notification-error {
    border-left-color: #F44336;
}

.notification-warning {
    border-left-color: #FF9800;
}

.notification-info {
    border-left-color: #2196F3;
}

.notification-close {
    background: none;
    border: none;
    color: var(--color-gray-500);
    cursor: pointer;
    padding: 4px;
    margin-left: auto;
    font-size: 0.875rem;
    transition: color 0.2s ease;
}

.notification-close:hover {
    color: var(--color-black);
}

/* Estilos para modal de imágenes */
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.image-modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(10px);
}

.modal-content {
    position: relative;
    z-index: 2;
    background: var(--color-white);
    border-radius: var(--radius-2xl);
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.image-modal.active .modal-content {
    transform: scale(1);
}

.modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-white);
    border: none;
    color: var(--color-black);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    z-index: 3;
    box-shadow: var(--shadow-md);
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: var(--color-gray-100);
    transform: scale(1.1);
}

.modal-image-container {
    width: 100%;
    height: 70vh;
    overflow: hidden;
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

.modal-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--color-gray-50);
}

.modal-info {
    padding: var(--space-5);
    border-top: 1px solid var(--color-gray-200);
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: var(--space-2);
    color: var(--color-black);
}

.modal-description {
    color: var(--color-gray-600);
    font-size: 0.875rem;
}

/* Estilos para botón de instalación PWA */
.pwa-install-btn {
    animation: pulse 2s infinite;
    box-shadow: 0 4px 20px rgba(180, 189, 61, 0.4);
}

@keyframes pulse {
    0% {
        box-shadow: 0 4px 20px rgba(180, 189, 61, 0.4);
    }
    50% {
        box-shadow: 0 4px 30px rgba(180, 189, 61, 0.6);
    }
    100% {
        box-shadow: 0 4px 20px rgba(180, 189, 61, 0.4);
    }
}

/* Estilos para modo oscuro */
[data-theme="dark"] {
    --color-white: #1D1D1F;
    --color-black: #FFFFFF;
    --color-gray-50: #2C2C2E;
    --color-gray-100: #3A3A3C;
    --color-gray-200: #48484A;
    --color-gray-300: #636366;
    --color-gray-400: #8E8E93;
    --color-gray-500: #A1A1A6;
    --color-gray-600: #C7C7CC;
    --color-gray-700: #D1D1D6;
    --color-gray-800: #E5E5EA;
    --color-gray-900: #F2F2F7;
}

/* Responsive para modal */
@media (max-width: 768px) {
    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
        border-radius: var(--radius-xl);
    }
    
    .modal-image-container {
        height: 60vh;
    }
    
    .notification {
        max-width: calc(100vw - 40px);
        top: 10px;
        right: 10px;
        left: 10px;
    }
}
`;

// Inyectar estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initSmoothScroll,
        initStatsCounter,
        initContactForm,
        initAppleGallery,
        initCasesInteractions,
        initAnalytics,
        trackEvent
    };
}                closeMobileMenu();
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
