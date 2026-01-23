// ============================================
// PORTAFOLIO PREMIUM DAVID DÍAZ - JAVASCRIPT
// CON GALAXIA ORBITANTE 3D ÚNICA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portafolio David Díaz - Galaxia 3D Cargada');
    
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
        
        // Nuevo: Inicializar Galaxia 3D
        const galaxy = initGalaxy3D();
        
        console.log('✅ Módulos inicializados');
        
        // Exponer galaxia globalmente
        window.DDPortfolio = window.DDPortfolio || {};
        window.DDPortfolio.galaxy = galaxy;
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (galaxy && galaxy.cleanup) {
                galaxy.cleanup();
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
                    <a href="#carrusel3d" class="nav-link">Galería 3D</a>
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
    
    // ===== 10. GALAXIA 3D ÚNICA - CARRUSEL ORBITANTE =====
    function initGalaxy3D() {
        const galaxyContainer = document.querySelector('.galaxy-container');
        if (!galaxyContainer) return null;
        
        const orbitProjects = document.querySelectorAll('.orbit-project');
        const controlButtons = {
            speedUp: document.getElementById('speedUp'),
            playPause: document.getElementById('playPause'),
            speedDown: document.getElementById('speedDown'),
            resetView: document.getElementById('resetView')
        };
        
        // Variables de estado
        let isAnimating = true;
        let rotationSpeed = 1;
        let mouseX = 0;
        let mouseY = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let animationId = null;
        
        // Configuración
        const configGalaxy = {
            baseSpeed: 0.2,
            maxSpeed: 3,
            minSpeed: 0.1,
            mouseSensitivity: 0.002,
            dragSensitivity: 0.3,
            autoRotation: true,
            smoothFactor: 0.05,
            zoomSpeed: 0.1
        };
        
        // Inicializar
        initOrbits();
        initMouseInteraction();
        initTouchInteraction();
        initControls();
        startAnimation();
        
        // Función para inicializar órbitas
        function initOrbits() {
            const orbits = document.querySelectorAll('.orbit');
            
            orbits.forEach((orbit, index) => {
                const projects = orbit.querySelectorAll('.orbit-project');
                const orbitRadius = orbit.offsetWidth / 2;
                const angleStep = (2 * Math.PI) / projects.length;
                
                projects.forEach((project, projectIndex) => {
                    const angle = angleStep * projectIndex;
                    const x = Math.cos(angle) * orbitRadius;
                    const y = Math.sin(angle) * orbitRadius;
                    
                    project.style.transform = `translateX(${x}px) translateY(${y}px)`;
                    
                    // Añadir delay para animación escalonada
                    project.style.animationDelay = `${index * 0.5 + projectIndex * 0.2}s`;
                });
            });
        }
        
        // Función para inicializar interacción con mouse
        function initMouseInteraction() {
            // Movimiento del mouse
            galaxyContainer.addEventListener('mousemove', handleMouseMove);
            
            // Drag para rotar
            galaxyContainer.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', endDrag);
            
            // Wheel para zoom (simulado con rotación)
            galaxyContainer.addEventListener('wheel', handleWheel, { passive: false });
            
            // Hover en proyectos
            orbitProjects.forEach(project => {
                project.addEventListener('mouseenter', () => {
                    if (!isDragging) {
                        project.classList.add('hover-active');
                        project.style.zIndex = '100';
                    }
                });
                
                project.addEventListener('mouseleave', () => {
                    if (!isDragging) {
                        project.classList.remove('hover-active');
                        project.style.zIndex = '';
                    }
                });
                
                project.addEventListener('click', (e) => {
                    if (!isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Animación de click
                        project.style.transform += ' scale(0.9)';
                        setTimeout(() => {
                            project.style.transform = project.style.transform.replace(' scale(0.9)', '');
                        }, 200);
                        
                        // Aquí podrías añadir funcionalidad para abrir modal o redirigir
                        console.log('Proyecto clickeado:', project.querySelector('h4').textContent);
                    }
                });
            });
        }
        
        function handleMouseMove(e) {
            if (configGalaxy.autoRotation && !isDragging) {
                const rect = galaxyContainer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                mouseX = (e.clientX - centerX) * configGalaxy.mouseSensitivity;
                mouseY = (e.clientY - centerY) * configGalaxy.mouseSensitivity;
                
                targetRotationX = mouseY;
                targetRotationY = mouseX;
            }
        }
        
        function startDrag(e) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            // Pausar rotación automática temporalmente
            const wasAutoRotating = configGalaxy.autoRotation;
            configGalaxy.autoRotation = false;
            
            galaxyContainer.style.cursor = 'grabbing';
            
            // Restaurar rotación automática al soltar
            document.addEventListener('mouseup', function restoreAutoRotation() {
                if (wasAutoRotating) {
                    setTimeout(() => {
                        configGalaxy.autoRotation = true;
                    }, 1000);
                }
                document.removeEventListener('mouseup', restoreAutoRotation);
            });
        }
        
        function handleDrag(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            currentRotationY += deltaX * configGalaxy.dragSensitivity;
            currentRotationX += deltaY * configGalaxy.dragSensitivity;
            
            // Limitar rotación vertical
            currentRotationX = Math.max(-60, Math.min(60, currentRotationX));
            
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            updateGalaxyRotation();
        }
        
        function endDrag() {
            isDragging = false;
            galaxyContainer.style.cursor = 'grab';
        }
        
        function handleWheel(e) {
            e.preventDefault();
            
            if (e.deltaY > 0) {
                // Scroll down - aumentar velocidad
                rotationSpeed = Math.min(configGalaxy.maxSpeed, rotationSpeed + 0.1);
            } else {
                // Scroll up - disminuir velocidad
                rotationSpeed = Math.max(configGalaxy.minSpeed, rotationSpeed - 0.1);
            }
            
            updateSpeedIndicator();
        }
        
        // Función para inicializar interacción táctil
        function initTouchInteraction() {
            if (!config.isTouch) return;
            
            galaxyContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
            galaxyContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            galaxyContainer.addEventListener('touchend', handleTouchEnd);
            
            // Para dispositivos táctiles, desactivamos hover effects
            orbitProjects.forEach(project => {
                project.style.pointerEvents = 'auto';
            });
        }
        
        function handleTouchStart(e) {
            if (e.touches.length === 1) {
                isDragging = true;
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                configGalaxy.autoRotation = false;
            }
        }
        
        function handleTouchMove(e) {
            if (!isDragging || e.touches.length !== 1) return;
            
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - dragStartX;
            const deltaY = touch.clientY - dragStartY;
            
            currentRotationY += deltaX * configGalaxy.dragSensitivity * 2;
            currentRotationX += deltaY * configGalaxy.dragSensitivity * 2;
            
            // Limitar rotación vertical
            currentRotationX = Math.max(-60, Math.min(60, currentRotationX));
            
            dragStartX = touch.clientX;
            dragStartY = touch.clientY;
            
            updateGalaxyRotation();
        }
        
        function handleTouchEnd() {
            isDragging = false;
            // Reactivar rotación automática después de un tiempo
            setTimeout(() => {
                configGalaxy.autoRotation = true;
            }, 2000);
        }
        
        // Función para inicializar controles
        function initControls() {
            if (controlButtons.speedUp) {
                controlButtons.speedUp.addEventListener('click', () => {
                    rotationSpeed = Math.min(configGalaxy.maxSpeed, rotationSpeed + 0.5);
                    updateSpeedIndicator();
                    showControlFeedback('Velocidad aumentada');
                });
            }
            
            if (controlButtons.playPause) {
                controlButtons.playPause.addEventListener('click', () => {
                    isAnimating = !isAnimating;
                    controlButtons.playPause.innerHTML = isAnimating ? 
                        '<i class="fas fa-pause"></i>' : 
                        '<i class="fas fa-play"></i>';
                    controlButtons.playPause.setAttribute('aria-label', 
                        isAnimating ? 'Pausar animación' : 'Reanudar animación');
                    
                    showControlFeedback(isAnimating ? 'Animación reanudada' : 'Animación pausada');
                });
            }
            
            if (controlButtons.speedDown) {
                controlButtons.speedDown.addEventListener('click', () => {
                    rotationSpeed = Math.max(configGalaxy.minSpeed, rotationSpeed - 0.5);
                    updateSpeedIndicator();
                    showControlFeedback('Velocidad reducida');
                });
            }
            
            if (controlButtons.resetView) {
                controlButtons.resetView.addEventListener('click', () => {
                    currentRotationX = 0;
                    currentRotationY = 0;
                    targetRotationX = 0;
                    targetRotationY = 0;
                    rotationSpeed = 1;
                    updateGalaxyRotation();
                    updateSpeedIndicator();
                    showControlFeedback('Vista restablecida');
                });
            }
        }
        
        function updateSpeedIndicator() {
            // Podrías añadir un indicador visual de velocidad aquí
            console.log('Velocidad actual:', rotationSpeed);
        }
        
        function showControlFeedback(message) {
            // Feedback visual para controles
            const feedback = document.createElement('div');
            feedback.className = 'control-feedback';
            feedback.textContent = message;
            feedback.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(0, 210, 106, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                z-index: 1000;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.parentNode.removeChild(feedback);
                    }
                }, 300);
            }, 2000);
            
            // Añadir estilos de animación si no existen
            if (!document.querySelector('#controlFeedbackStyles')) {
                const style = document.createElement('style');
                style.id = 'controlFeedbackStyles';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutRight {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Función para actualizar rotación de la galaxia
        function updateGalaxyRotation() {
            const orbits = document.querySelectorAll('.orbit');
            const core = document.querySelector('.galaxy-core');
            
            if (core) {
                core.style.transform = `translate(-50%, -50%) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
            }
            
            orbits.forEach((orbit, index) => {
                // Añadir rotación individual a cada órbita
                const orbitRotation = currentRotationY * 0.5 + (index * 10);
                orbit.style.transform = `translate(-50%, -50%) rotateX(${currentRotationX * 0.3}deg) rotateY(${orbitRotation}deg)`;
            });
        }
        
        // Función principal de animación
        function startAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            function animate() {
                if (isAnimating) {
                    // Rotación automática suave
                    if (configGalaxy.autoRotation && !isDragging) {
                        currentRotationY += configGalaxy.baseSpeed * rotationSpeed;
                        
                        // Interpolación suave hacia target rotation (mouse)
                        currentRotationX += (targetRotationX - currentRotationX) * configGalaxy.smoothFactor;
                        currentRotationY += (targetRotationY - currentRotationY) * configGalaxy.smoothFactor;
                    }
                    
                    // Actualizar rotación
                    updateGalaxyRotation();
                    
                    // Actualizar posición de proyectos en órbitas
                    updateOrbitPositions();
                }
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
        }
        
        function updateOrbitPositions() {
            const orbits = document.querySelectorAll('.orbit');
            const time = Date.now() * 0.001;
            
            orbits.forEach((orbit, orbitIndex) => {
                const projects = orbit.querySelectorAll('.orbit-project');
                const orbitRadius = orbit.offsetWidth / 2;
                const angleStep = (2 * Math.PI) / projects.length;
                const orbitSpeed = (orbitIndex + 1) * 0.2 * rotationSpeed;
                
                projects.forEach((project, projectIndex) => {
                    const baseAngle = angleStep * projectIndex;
                    const dynamicAngle = baseAngle + time * orbitSpeed;
                    const x = Math.cos(dynamicAngle) * orbitRadius;
                    const y = Math.sin(dynamicAngle) * orbitRadius;
                    
                    // Añadir efecto de flotación
                    const floatY = Math.sin(time * 2 + projectIndex) * 10;
                    
                    project.style.transform = `translateX(${x}px) translateY(${y + floatY}px)`;
                    
                    // Efecto 3D - rotar proyecto para que siempre mire hacia el centro
                    const projectAngle = Math.atan2(y, x) * (180 / Math.PI);
                    project.style.transform += ` rotateZ(${-projectAngle}deg)`;
                });
            });
        }
        
        // Cleanup
        function cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            // Remover event listeners
            galaxyContainer.removeEventListener('mousemove', handleMouseMove);
            galaxyContainer.removeEventListener('mousedown', startDrag);
            galaxyContainer.removeEventListener('wheel', handleWheel);
            galaxyContainer.removeEventListener('touchstart', handleTouchStart);
            galaxyContainer.removeEventListener('touchmove', handleTouchMove);
            galaxyContainer.removeEventListener('touchend', handleTouchEnd);
            
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', endDrag);
            
            orbitProjects.forEach(project => {
                project.removeEventListener('mouseenter', () => {});
                project.removeEventListener('mouseleave', () => {});
                project.removeEventListener('click', () => {});
            });
            
            Object.values(controlButtons).forEach(button => {
                if (button) {
                    button.removeEventListener('click', () => {});
                }
            });
        }
        
        // Public methods
        return {
            play: () => { isAnimating = true; },
            pause: () => { isAnimating = false; },
            setSpeed: (speed) => { 
                rotationSpeed = Math.max(configGalaxy.minSpeed, Math.min(configGalaxy.maxSpeed, speed));
                updateSpeedIndicator();
            },
            reset: () => {
                currentRotationX = 0;
                currentRotationY = 0;
                targetRotationX = 0;
                targetRotationY = 0;
                rotationSpeed = 1;
                updateGalaxyRotation();
                updateSpeedIndicator();
            },
            cleanup: cleanup,
            getSpeed: () => rotationSpeed,
            isPlaying: () => isAnimating
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
        
        // Métodos para controlar la galaxia desde la consola
        galaxyPlay: function() {
            if (window.DDPortfolio.galaxy) {
                window.DDPortfolio.galaxy.play();
            }
        },
        
        galaxyPause: function() {
            if (window.DDPortfolio.galaxy) {
                window.DDPortfolio.galaxy.pause();
            }
        },
        
        galaxySetSpeed: function(speed) {
            if (window.DDPortfolio.galaxy) {
                window.DDPortfolio.galaxy.setSpeed(speed);
            }
        },
        
        galaxyReset: function() {
            if (window.DDPortfolio.galaxy) {
                window.DDPortfolio.galaxy.reset();
            }
        }
    });
});

// Polyfill para Safari
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => console.log('Polyfill cargado'));
}
