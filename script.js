// ============================================
// SISTEMA COMPLETO DE ESTADOS Y FEEDBACK UX
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Sistema de estados UX cargado');
    
    // ===== CONFIGURACIÓN DEL SISTEMA =====
    const System = {
        // Configuración
        config: {
            debug: true,
            reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            connection: navigator.connection ? navigator.connection.effectiveType : '4g'
        },
        
        // Estados del sistema
        state: {
            isLoading: false,
            hasError: false,
            activeSection: 'hero',
            scrollProgress: 0,
            formSubmitting: false
        },
        
        // Elementos del DOM
        elements: {
            progressBar: document.querySelector('.progress-bar'),
            loadingOverlay: document.querySelector('.loading-overlay'),
            sectionIndicator: document.querySelector('.section-indicator'),
            navSections: document.querySelectorAll('.nav-section'),
            currentYear: document.getElementById('currentYear'),
            contactForm: document.getElementById('contactForm'),
            toastContainer: document.querySelector('.toast-container')
        },
        
        // Initialize all systems
        init: function() {
            this.initObservers();
            this.initScrollSystem();
            this.initNavigationSystem();
            this.initFormSystem();
            this.initErrorSystem();
            this.initLoadingSystem();
            this.initAnalytics();
            this.updateCurrentYear();
            
            console.log('🚀 Sistema UX inicializado');
        },
        
        // ===== 1. SISTEMA DE OBSERVADORES =====
        initObservers: function() {
            // Intersection Observer para animaciones
            this.animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                    }
                });
            }, { threshold: 0.1 });
            
            // Observar elementos animables
            document.querySelectorAll('.result-card, .process-card, .testimonial-card').forEach(el => {
                this.animationObserver.observe(el);
            });
            
            // Mutation Observer para estados de carga
            this.mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        this.handleClassChange(mutation.target);
                    }
                });
            });
        },
        
        // ===== 2. SISTEMA DE SCROLL Y PROGRESO =====
        initScrollSystem: function() {
            // Progress bar
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                
                this.state.scrollProgress = scrolled;
                
                if (this.elements.progressBar) {
                    this.elements.progressBar.style.width = scrolled + '%';
                }
                
                // Actualizar sección activa
                this.updateActiveSection();
            });
            
            // Smooth scroll con feedback
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;
                    
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        this.showLoading('Navegando...', 300);
                        
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Feedback táctil
                        if (this.config.isTouch) {
                            this.vibrate(50);
                        }
                        
                        setTimeout(() => {
                            this.hideLoading();
                        }, 500);
                    }
                });
            });
        },
        
        // ===== 3. SISTEMA DE NAVEGACIÓN CON ESTADOS =====
        initNavigationSystem: function() {
            // Actualizar sección activa
            this.updateActiveSection();
            
            // Navegación por teclado
            document.addEventListener('keydown', (e) => {
                // Navegación entre secciones con teclado
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const sections = ['hero', 'resultados', 'proyectos', 'proceso', 'contacto'];
                    const currentIndex = sections.indexOf(this.state.activeSection);
                    let nextIndex;
                    
                    if (e.key === 'ArrowDown') {
                        nextIndex = Math.min(currentIndex + 1, sections.length - 1);
                    } else {
                        nextIndex = Math.max(currentIndex - 1, 0);
                    }
                    
                    const nextSection = document.getElementById(sections[nextIndex]);
                    if (nextSection) {
                        nextSection.scrollIntoView({ behavior: 'smooth' });
                        this.showToast(`Sección: ${sections[nextIndex]}`, 'info');
                    }
                }
            });
            
            // Indicador de sección en header
            if (this.elements.sectionIndicator) {
                this.updateSectionIndicator();
            }
        },
        
        updateActiveSection: function() {
            const sections = document.querySelectorAll('section[id]');
            let currentSection = 'hero';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                const scrollPosition = window.scrollY;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            });
            
            if (this.state.activeSection !== currentSection) {
                this.state.activeSection = currentSection;
                
                // Actualizar navegación
                this.elements.navSections.forEach(nav => {
                    nav.classList.remove('active');
                    if (nav.getAttribute('data-section') === currentSection) {
                        nav.classList.add('active');
                    }
                });
                
                // Actualizar breadcrumb
                this.updateBreadcrumb(currentSection);
                
                // Actualizar indicador
                this.updateSectionIndicator();
            }
        },
        
        updateBreadcrumb: function(section) {
            const breadcrumbItems = {
                hero: 'Inicio',
                resultados: 'Resultados',
                proyectos: 'Proyectos',
                proceso: 'Proceso',
                contacto: 'Contacto'
            };
            
            const breadcrumbCurrent = document.querySelector('.breadcrumb-item.current');
            if (breadcrumbCurrent && breadcrumbItems[section]) {
                breadcrumbCurrent.textContent = breadcrumbItems[section];
            }
        },
        
        updateSectionIndicator: function() {
            if (!this.elements.sectionIndicator) return;
            
            const activeNav = document.querySelector('.nav-section.active');
            if (activeNav) {
                const navRect = activeNav.getBoundingClientRect();
                const containerRect = activeNav.parentElement.getBoundingClientRect();
                
                this.elements.sectionIndicator.style.width = navRect.width + 'px';
                this.elements.sectionIndicator.style.left = (navRect.left - containerRect.left) + 'px';
            }
        },
        
        // ===== 4. SISTEMA DE FORMULARIOS CON VALIDACIÓN =====
        initFormSystem: function() {
            if (!this.elements.contactForm) return;
            
            // Validación en tiempo real
            const inputs = this.elements.contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                // Validación en blur
                input.addEventListener('blur', (e) => {
                    this.validateField(e.target);
                });
                
                // Validación en tiempo real para errores
                input.addEventListener('input', (e) => {
                    this.clearFieldError(e.target);
                    
                    // Mostrar estado de validación
                    if (this.isValidField(e.target)) {
                        this.showFieldSuccess(e.target);
                    }
                });
                
                // Efecto de enfoque
                input.addEventListener('focus', (e) => {
                    e.target.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', (e) => {
                    e.target.parentElement.classList.remove('focused');
                });
            });
            
            // Envío del formulario
            this.elements.contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (this.state.formSubmitting) return;
                
                // Validar todo el formulario
                if (!this.validateForm()) {
                    this.showToast('Por favor, corrige los errores del formulario', 'error');
                    return;
                }
                
                // Cambiar estado
                this.state.formSubmitting = true;
                this.setFormState('submitting');
                
                try {
                    // Simular envío (en producción sería fetch)
                    await this.submitForm();
                    
                    // Éxito
                    this.setFormState('success');
                    this.showToast('¡Mensaje enviado! Te responderé en menos de 12 horas.', 'success');
                    
                    // Resetear formulario después de éxito
                    setTimeout(() => {
                        this.elements.contactForm.reset();
                        this.setFormState('default');
                        this.state.formSubmitting = false;
                    }, 3000);
                    
                } catch (error) {
                    // Error
                    this.setFormState('error');
                    this.showToast('Error al enviar. Por favor, intenta nuevamente.', 'error');
                    this.state.formSubmitting = false;
                    
                    // Registrar error
                    this.logError('Form submission failed', error);
                }
            });
        },
        
        validateField: function(field) {
            const value = field.value.trim();
            const isRequired = field.hasAttribute('required');
            const type = field.type;
            let isValid = true;
            let errorMessage = '';
            
            // Limpiar estado anterior
            this.clearFieldError(field);
            field.parentElement.classList.remove('validating');
            
            // Validar campo requerido
            if (isRequired && !value) {
                isValid = false;
                errorMessage = 'Este campo es obligatorio';
            }
            
            // Validar email
            if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, ingresa un email válido';
                }
            }
            
            // Validar URL
            if (type === 'url' && value && !value.startsWith('http')) {
                isValid = false;
                errorMessage = 'La URL debe comenzar con http:// o https://';
            }
            
            // Mostrar error o éxito
            if (!isValid) {
                this.showFieldError(field, errorMessage);
            } else if (value) {
                this.showFieldSuccess(field);
            }
            
            return isValid;
        },
        
        validateForm: function() {
            let isValid = true;
            const fields = this.elements.contactForm.querySelectorAll('[required]');
            
            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        showFieldError: function(field, message) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;
            
            // Agregar clase de error
            formGroup.classList.add('error');
            field.classList.add('error');
            
            // Crear elemento de error
            const errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.textContent = message;
            errorEl.setAttribute('role', 'alert');
            
            // Insertar después del input
            field.parentNode.insertBefore(errorEl, field.nextSibling);
            
            // Enfocar el campo con error
            field.focus();
            
            // Feedback de error
            this.vibrate(100);
        },
        
        clearFieldError: function(field) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;
            
            formGroup.classList.remove('error');
            field.classList.remove('error');
            
            const errorEl = formGroup.querySelector('.form-error');
            if (errorEl) {
                errorEl.remove();
            }
        },
        
        showFieldSuccess: function(field) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;
            
            formGroup.classList.add('success');
            field.classList.add('success');
        },
        
        setFormState: function(state) {
            const submitBtn = this.elements.contactForm.querySelector('.btn-submit');
            if (!submitBtn) return;
            
            // Ocultar todos los estados
            const states = ['default', 'loading', 'success', 'error'];
            states.forEach(s => {
                submitBtn.setAttribute('data-state', state);
                const stateEl = submitBtn.querySelector(`.btn-state-${s}`);
                if (stateEl) {
                    stateEl.hidden = s !== state;
                }
            });
            
            // Deshabilitar botón durante envío
            submitBtn.disabled = state === 'submitting';
        },
        
        submitForm: function() {
            return new Promise((resolve, reject) => {
                // Simular llamada a API
                setTimeout(() => {
                    // Simular éxito 90% del tiempo
                    if (Math.random() > 0.1) {
                        resolve();
                    } else {
                        reject(new Error('Simulated API error'));
                    }
                }, 1500);
            });
        },
        
        // ===== 5. SISTEMA DE ERRORES =====
        initErrorSystem: function() {
            // Capturar errores globales
            window.addEventListener('error', (e) => {
                this.logError('Global error', e.error);
                this.showErrorBoundary('Ocurrió un error inesperado');
            });
            
            // Capturar promesas rechazadas
            window.addEventListener('unhandledrejection', (e) => {
                this.logError('Unhandled promise rejection', e.reason);
            });
            
            // Manejar errores de recursos
            document.addEventListener('error', (e) => {
                if (e.target.tagName === 'IMG') {
                    this.handleImageError(e.target);
                }
            }, true);
        },
        
        handleImageError: function(img) {
            // Reemplazar imagen rota por placeholder
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
            img.alt = 'Imagen no disponible';
            
            // Mostrar notificación
            this.showToast('Algunas imágenes no pudieron cargarse', 'warning');
        },
        
        logError: function(context, error) {
            if (this.config.debug) {
                console.error(`[Error System] ${context}:`, error);
            }
            
            // Aquí podrías enviar el error a un servicio como Sentry
            // Sentry.captureException(error, { extra: { context } });
        },
        
        showErrorBoundary: function(message) {
            const errorEl = document.createElement('div');
            errorEl.className = 'error-boundary';
            errorEl.innerHTML = `
                <h2>😕 Algo salió mal</h2>
                <p>${message}</p>
                <button class="btn-primary" onclick="location.reload()">
                    Recargar página
                </button>
            `;
            
            document.body.appendChild(errorEl);
        },
        
        // ===== 6. SISTEMA DE CARGA =====
        initLoadingSystem: function() {
            // Mostrar carga inicial
            this.showLoading('Cargando portfolio...', 1000);
            
            // Ocultar cuando todo esté listo
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.hideLoading();
                }, 500);
            });
            
            // Manejar carga lenta
            setTimeout(() => {
                if (document.readyState !== 'complete') {
                    this.showToast('La carga está tomando más tiempo de lo esperado', 'warning');
                }
            }, 3000);
        },
        
        showLoading: function(message = 'Cargando...', duration = null) {
            if (this.elements.loadingOverlay) {
                const overlay = this.elements.loadingOverlay;
                const spinner = overlay.querySelector('.loading-spinner');
                
                // Agregar mensaje si no existe
                if (!spinner.nextElementSibling || !spinner.nextElementSibling.classList.contains('loading-message')) {
                    const messageEl = document.createElement('p');
                    messageEl.className = 'loading-message';
                    messageEl.textContent = message;
                    spinner.parentNode.insertBefore(messageEl, spinner.nextSibling);
                } else {
                    spinner.nextElementSibling.textContent = message;
                }
                
                overlay.classList.add('active');
                this.state.isLoading = true;
                
                // Ocultar automáticamente si se especifica duración
                if (duration) {
                    setTimeout(() => {
                        this.hideLoading();
                    }, duration);
                }
            }
        },
        
        hideLoading: function() {
            if (this.elements.loadingOverlay) {
                this.elements.loadingOverlay.classList.remove('active');
                this.state.isLoading = false;
            }
        },
        
        // ===== 7. SISTEMA DE NOTIFICACIONES =====
        showToast: function(message, type = 'info') {
            if (!this.elements.toastContainer) return;
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.setAttribute('role', 'alert');
            toast.innerHTML = `
                <div class="toast-content">${message}</div>
                <button class="toast-close" aria-label="Cerrar notificación">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Agregar al contenedor
            this.elements.toastContainer.appendChild(toast);
            
            // Mostrar toast
            setTimeout(() => {
                toast.hidden = false;
            }, 10);
            
            // Configurar cierre
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                this.hideToast(toast);
            });
            
            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                this.hideToast(toast);
            }, 5000);
            
            // Feedback táctil
            if (type === 'error' || type === 'warning') {
                this.vibrate(200);
            }
        },
        
        hideToast: function(toast) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        },
        
        // ===== 8. SISTEMA DE ANALÍTICAS Y MONITOREO =====
        initAnalytics: function() {
            // Monitorear interacciones importantes
            this.trackCTAs();
            this.trackFormInteractions();
            this.trackCoverflowInteractions();
            
            // Monitorear performance
            this.monitorPerformance();
            
            // Monitorear conexión
            this.monitorConnection();
        },
        
        trackCTAs: function() {
            document.querySelectorAll('.btn-primary, .btn-cta-primary, .nav-section').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const label = btn.textContent.trim().substring(0, 30);
                    this.logEvent('CTA Click', { label, section: this.state.activeSection });
                });
            });
        },
        
        trackFormInteractions: function() {
            if (this.elements.contactForm) {
                // Track focus en campos
                this.elements.contactForm.querySelectorAll('input, textarea').forEach(field => {
                    field.addEventListener('focus', () => {
                        this.logEvent('Form Field Focus', { field: field.name });
                    });
                });
            }
        },
        
        trackCoverflowInteractions: function() {
            const coverflow = document.querySelector('.coverflow-track');
            if (coverflow) {
                // Track navegación del coverflow
                document.querySelectorAll('.coverflow-prev, .coverflow-next, .dot').forEach(control => {
                    control.addEventListener('click', () => {
                        this.logEvent('Coverflow Navigation', { control: control.className });
                    });
                });
            }
        },
        
        monitorPerformance: function() {
            // Usar Performance API
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    
                    this.logEvent('Performance', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        readyStart: perfData.fetchStart
                    });
                }, 0);
            });
        },
        
        monitorConnection: function() {
            if (navigator.connection) {
                navigator.connection.addEventListener('change', () => {
                    this.config.connection = navigator.connection.effectiveType;
                    
                    if (this.config.connection === 'slow-2g' || this.config.connection === '2g') {
                        this.showToast('Conexión lenta detectada. Algunas funciones pueden estar limitadas.', 'warning');
                    }
                });
            }
        },
        
        logEvent: function(name, data = {}) {
            if (this.config.debug) {
                console.log(`[Analytics] ${name}:`, data);
            }
            
            // Aquí podrías enviar a Google Analytics
            // gtag('event', name, data);
        },
        
        // ===== 9. UTILIDADES DEL SISTEMA =====
        vibrate: function(duration = 100) {
            if (navigator.vibrate && this.config.isTouch) {
                navigator.vibrate(duration);
            }
        },
        
        handleClassChange: function(element) {
            // Monitorear cambios de clase para estados
            if (element.classList.contains('loading')) {
                this.logEvent('Element Loading State Changed', { element: element.tagName });
            }
        },
        
        updateCurrentYear: function() {
            if (this.elements.currentYear) {
                this.elements.currentYear.textContent = new Date().getFullYear();
            }
        },
        
        isValidField: function(field) {
            const value = field.value.trim();
            const type = field.type;
            
            if (field.required && !value) return false;
            
            if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            }
            
            return true;
        }
    };
    
    // Inicializar sistema
    System.init();
    
    // Exponer API global
    window.PortfolioSystem = {
        showToast: (msg, type) => System.showToast(msg, type),
        showLoading: (msg, duration) => System.showLoading(msg, duration),
        hideLoading: () => System.hideLoading(),
        logError: (context, error) => System.logError(context, error),
        navigateTo: (section) => {
            const target = document.getElementById(section);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    // Manejar errores críticos
    window.addEventListener('error', (e) => {
        PortfolioSystem.logError('Critical Error', e.error);
        PortfolioSystem.showToast('Error crítico. Por favor, recarga la página.', 'error');
    });
});

// Polyfills para navegadores antiguos
if (!window.IntersectionObserver) {
    import('https://unpkg.com/intersection-observer@0.12.0/intersection-observer.js');
}

if (!Element.prototype.closest) {
    import('https://unpkg.com/element-closest@3.0.2/browser.js');
}
