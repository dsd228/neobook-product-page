// ============================================
// PORTAFOLIO PREMIUM DAVID DÍAZ - JAVASCRIPT
// CON CARRUSEL COVERFLOW 3D TIPO APPLE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portafolio David Díaz - Coverflow 3D Cargado');
    
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
        
        // Inicializar Coverflow
        const coverflow = initCoverflow();
        
        console.log('✅ Módulos inicializados');
        
        // Exponer coverflow globalmente
        window.DDPortfolio = window.DDPortfolio || {};
        window.DDPortfolio.coverflow = coverflow;
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (coverflow && coverflow.cleanup) {
                coverflow.cleanup();
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
                    <a href="#coverflow" class="nav-link">Galería 3D</a>
                    <a href="#servicios" class="nav-link">Servicios</a>
                    <a href="#proceso" class="nav-link">Proceso</a>
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
    
    // ===== 10. CARRUSEL COVERFLOW 3D =====
    function initCoverflow() {
        const coverflowTrack = document.getElementById('coverflowTrack');
        if (!coverflowTrack) return null;
        
        const slides = document.querySelectorAll('.coverflow-slide');
        const dots = document.querySelectorAll('.coverflow-dots .dot');
        const prevBtn = document.querySelector('.coverflow-prev');
        const nextBtn = document.querySelector('.coverflow-next');
        const autoplayToggle = document.getElementById('autoplayToggle');
        const progressBar = document.querySelector('.autoplay-progress .progress-bar');
        
        // Elementos de vista previa
        const previewImg = document.getElementById('previewImg');
        const previewTitle = document.getElementById('previewTitle');
        const previewDescription = document.getElementById('previewDescription');
        const previewBadge = document.getElementById('previewBadge');
        const previewStat1 = document.getElementById('previewStat1');
        const previewStat2 = document.getElementById('previewStat2');
        const previewDuration = document.getElementById('previewDuration');
        const previewLink = document.getElementById('previewLink');
        
        // Variables de estado
        let currentIndex = 0;
        let totalSlides = slides.length;
        let isAnimating = false;
        let autoplayInterval = null;
        let isAutoplay = true;
        let autoplaySpeed = 5000; // 5 segundos
        let isDragging = false;
        let dragStartX = 0;
        let dragCurrentX = 0;
        let dragThreshold = 50; // px mínimo para cambiar slide
        
        // Configuración
        const configCoverflow = {
            animationDuration: 800,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            visibleSlides: 3, // Slides visibles a cada lado
            touchSensitivity: 2
        };
        
        // Inicializar
        updateCoverflow();
        updatePreview();
        initEventListeners();
        startAutoplay();
        
        // Función para actualizar coverflow
        function updateCoverflow() {
            if (isAnimating) return;
            
            isAnimating = true;
            
            // Actualizar índices de slides
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                
                // Calcular índice relativo
                let relativeIndex = index - currentIndex;
                
                // Limitar índices visibles
                if (Math.abs(relativeIndex) > configCoverflow.visibleSlides) {
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
            
            // Actualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Reset animating flag después de la transición
            setTimeout(() => {
                isAnimating = false;
            }, configCoverflow.animationDuration);
        }
        
        // Función para actualizar vista previa
        function updatePreview() {
            const activeSlide = slides[currentIndex];
            
            if (!activeSlide || !previewImg) return;
            
            // Obtener datos del slide activo
            const imgSrc = activeSlide.getAttribute('data-img');
            const title = activeSlide.getAttribute('data-title');
            const description = activeSlide.getAttribute('data-description');
            const badge = activeSlide.getAttribute('data-badge');
            const stat1 = activeSlide.getAttribute('data-stat1');
            const stat2 = activeSlide.getAttribute('data-stat2');
            const duration = activeSlide.getAttribute('data-duration');
            const link = activeSlide.getAttribute('data-link');
            
            // Actualizar elementos de vista previa
            if (previewImg) {
                previewImg.src = imgSrc;
                previewImg.alt = title;
            }
            if (previewTitle) previewTitle.textContent = title;
            if (previewDescription) previewDescription.textContent = description;
            if (previewBadge) previewBadge.textContent = badge;
            if (previewStat1) previewStat1.textContent = stat1;
            if (previewStat2) previewStat2.textContent = stat2;
            if (previewDuration) previewDuration.textContent = duration;
            if (previewLink) previewLink.href = link;
            
            // Animación de transición
            const previewContent = document.querySelector('.preview-content');
            if (previewContent) {
                previewContent.style.opacity = '0';
                previewContent.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    previewContent.style.transition = 'all 0.5s ease';
                    previewContent.style.opacity = '1';
                    previewContent.style.transform = 'translateY(0)';
                }, 50);
            }
        }
        
        // Navegación
        function goToSlide(index) {
            if (isAnimating || index === currentIndex) return;
            
            // Calcular nuevo índice (con wrap-around)
            currentIndex = (index + totalSlides) % totalSlides;
            
            updateCoverflow();
            updatePreview();
            resetAutoplay();
        }
        
        function goToPrevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function goToNextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        // Auto-play
        function startAutoplay() {
            if (!isAutoplay || config.reduceMotion) return;
            
            clearInterval(autoplayInterval);
            
            autoplayInterval = setInterval(() => {
                if (!isDragging && !isAnimating) {
                    goToNextSlide();
                }
            }, autoplaySpeed);
            
            // Iniciar animación de progress bar
            if (progressBar) {
                progressBar.style.animation = `progressBar ${autoplaySpeed}ms linear infinite`;
            }
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
            if (progressBar) {
                progressBar.style.animation = 'none';
            }
        }
        
        function resetAutoplay() {
            if (isAutoplay) {
                startAutoplay();
            }
        }
        
        function toggleAutoplay() {
            isAutoplay = !isAutoplay;
            
            if (isAutoplay) {
                startAutoplay();
                if (autoplayToggle) {
                    autoplayToggle.checked = true;
                }
            } else {
                stopAutoplay();
                if (autoplayToggle) {
                    autoplayToggle.checked = false;
                }
            }
        }
        
        // Event Listeners
        function initEventListeners() {
            // Botones de navegación
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPrevSlide();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToNextSlide();
                });
            }
            
            // Dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(index);
                });
            });
            
            // Auto-play toggle
            if (autoplayToggle) {
                autoplayToggle.addEventListener('change', toggleAutoplay);
            }
            
            // Click en slides
            slides.forEach((slide, index) => {
                slide.addEventListener('click', (e) => {
                    if (!isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                        goToSlide(index);
                    }
                });
            });
            
            // Wheel scroll
            coverflowTrack.addEventListener('wheel', handleWheel, { passive: false });
            
            // Touch/Mouse drag
            coverflowTrack.addEventListener('mousedown', startDrag);
            coverflowTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
            
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
            document.addEventListener('touchcancel', endDrag);
            
            // Keyboard navigation
            document.addEventListener('keydown', handleKeydown);
        }
        
        function handleWheel(e) {
            e.preventDefault();
            
            if (isAnimating) return;
            
            const delta = Math.sign(e.deltaY);
            
            if (delta > 0) {
                goToNextSlide();
            } else {
                goToPrevSlide();
            }
        }
        
        function startDrag(e) {
            isDragging = true;
            dragStartX = e.clientX;
            dragCurrentX = dragStartX;
            
            // Pausar auto-play temporalmente
            stopAutoplay();
        }
        
        function handleDrag(e) {
            if (!isDragging) return;
            
            dragCurrentX = e.clientX;
            updateDragEffect();
        }
        
        function handleTouchStart(e) {
            if (e.touches.length === 1) {
                isDragging = true;
                dragStartX = e.touches[0].clientX;
                dragCurrentX = dragStartX;
                stopAutoplay();
            }
        }
        
        function handleTouchMove(e) {
            if (!isDragging || e.touches.length !== 1) return;
            
            e.preventDefault();
            dragCurrentX = e.touches[0].clientX;
            updateDragEffect();
        }
        
        function endDrag() {
            if (!isDragging) return;
            
            const dragDistance = dragCurrentX - dragStartX;
            
            if (Math.abs(dragDistance) > dragThreshold) {
                if (dragDistance > 0) {
                    goToPrevSlide();
                } else {
                    goToNextSlide();
                }
            }
            
            isDragging = false;
            
            // Reanudar auto-play si estaba activo
            if (isAutoplay) {
                startAutoplay();
            }
        }
        
        function updateDragEffect() {
            if (!isDragging) return;
            
            const dragDistance = (dragCurrentX - dragStartX) * configCoverflow.touchSensitivity;
            const dragPercentage = dragDistance / window.innerWidth;
            
            // Efecto visual durante el drag
            coverflowTrack.style.transform = `translateX(${dragDistance}px)`;
            coverflowTrack.style.transition = 'none';
            
            // Feedback visual en slides
            slides.forEach((slide, index) => {
                if (Math.abs(index - currentIndex) <= configCoverflow.visibleSlides) {
                    const baseTransform = slide.getAttribute('data-index');
                    const extraRotation = dragPercentage * 10; // Rotación adicional por drag
                    
                    if (baseTransform) {
                        const baseValue = parseInt(baseTransform);
                        let newRotation = 0;
                        
                        if (baseValue < 0) {
                            newRotation = 30 + extraRotation;
                        } else if (baseValue > 0) {
                            newRotation = -30 + extraRotation;
                        }
                        
                        slide.style.transform = slide.style.transform.replace(
                            /rotateY\([^)]*\)/,
                            `rotateY(${newRotation}deg)`
                        );
                    }
                }
            });
        }
        
        function handleKeydown(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                toggleAutoplay();
            }
        }
        
        // Cleanup
        function cleanup() {
            stopAutoplay();
            
            // Remover event listeners
            if (prevBtn) prevBtn.removeEventListener('click', goToPrevSlide);
            if (nextBtn) nextBtn.removeEventListener('click', goToNextSlide);
            if (autoplayToggle) autoplayToggle.removeEventListener('change', toggleAutoplay);
            
            dots.forEach(dot => {
                dot.removeEventListener('click', () => {});
            });
            
            slides.forEach(slide => {
                slide.removeEventListener('click', () => {});
            });
            
            coverflowTrack.removeEventListener('wheel', handleWheel);
            coverflowTrack.removeEventListener('mousedown', startDrag);
            coverflowTrack.removeEventListener('touchstart', handleTouchStart);
            
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);
            document.removeEventListener('touchcancel', endDrag);
            document.removeEventListener('keydown', handleKeydown);
        }
        
        // Public methods
        return {
            next: goToNextSlide,
            prev: goToPrevSlide,
            goTo: (index) => goToSlide(index),
            play: () => {
                isAutoplay = true;
                startAutoplay();
                if (autoplayToggle) autoplayToggle.checked = true;
            },
            pause: () => {
                isAutoplay = false;
                stopAutoplay();
                if (autoplayToggle) autoplayToggle.checked = false;
            },
            cleanup: cleanup,
            getCurrentIndex: () => currentIndex,
            getTotalSlides: () => totalSlides
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
        },
        
        // Métodos para controlar el coverflow desde la consola
        coverflowNext: function() {
            if (window.DDPortfolio.coverflow) {
                window.DDPortfolio.coverflow.next();
            }
        },
        
        coverflowPrev: function() {
            if (window.DDPortfolio.coverflow) {
                window.DDPortfolio.coverflow.prev();
            }
        },
        
        coverflowGoTo: function(index) {
            if (window.DDPortfolio.coverflow) {
                window.DDPortfolio.coverflow.goTo(index);
            }
        },
        
        coverflowPlay: function() {
            if (window.DDPortfolio.coverflow) {
                window.DDPortfolio.coverflow.play();
            }
        },
        
        coverflowPause: function() {
            if (window.DDPortfolio.coverflow) {
                window.DDPortfolio.coverflow.pause();
            }
        }
    });
});

// Polyfill para Safari
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => console.log('Polyfill cargado'));
}
