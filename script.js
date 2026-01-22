// ============================== PORTFOLIOBOX EXACT IMPLEMENTATION ==============================
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Variables principales
    const header = document.getElementById('main-header');
    const zoomableInner = document.getElementById('zoomableInner');
    const heroOverlay = document.getElementById('heroOverlay');
    const heroContent = document.querySelector('.pb-hero-content');
    const scrollDownBtn = document.getElementById('scrollDown');
    const gallerySection = document.getElementById('galeria');
    const parallaxItems = document.querySelectorAll('.pb-parallax-item');
    const menuToggle = document.getElementById('menuToggle');
    
    // ============================== ZOOM EFFECT EXACTO (PORTFOLIOBOX) ==============================
    function initPortfolioboxZoom() {
        if (!zoomableInner) return;
        
        // 1. OBTENER VALOR DE ZOOM DEL DATA ATTRIBUTE
        const zoomContainer = zoomableInner.parentElement;
        const zoomValue = parseInt(zoomContainer.getAttribute('data-zoom')) || 28;
        
        // 2. ESTADO INICIAL (ESTO ES CLAVE) - INLINE
        // Portfoliobox inyecta esto inline, no en CSS
        zoomableInner.style.transform = `scale(${zoomValue}) translateX(22px) translateY(-42px)`;
        zoomableInner.style.opacity = '0';
        
        // 3. OVERLAY Y CONTENIDO INICIAL
        if (heroOverlay) {
            heroOverlay.style.opacity = '1';
        }
        
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
        
        // 4. CORRECCIÓN EN PRIMER FRAME (ESTO ES CLAVE)
        // Fuerza layout reflow (getBoundingClientRect)
        zoomableInner.getBoundingClientRect();
        
        // 5. ANIMACIÓN CON REQUESTANIMATIONFRAME
        requestAnimationFrame(() => {
            // Aplica la transformación final
            zoomableInner.style.transition = 'transform 1.1s cubic-bezier(0.33, 1, 0.68, 1), opacity 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
            zoomableInner.style.transform = 'scale(1) translateX(0) translateY(0)';
            zoomableInner.style.opacity = '1';
            
            // Overlay fade out
            if (heroOverlay) {
                heroOverlay.style.transition = 'opacity 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
                heroOverlay.style.opacity = '0.3';
            }
            
            // Content fade in
            if (heroContent) {
                heroContent.style.transition = 'opacity 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
                heroContent.style.opacity = '1';
            }
            
            console.log('🎯 Zoom Portfoliobox ejecutado (scale:', zoomValue, ')');
        });
    }
    
    // Inicializar zoom al cargar
    setTimeout(initPortfolioboxZoom, 100);
    
    // ============================== MENÚ MÓVIL ==============================
    function initMobileMenu() {
        if (!menuToggle) return;
        
        const navCenter = document.querySelector('.pb-nav-center');
        const navRight = document.querySelector('.pb-nav-right');
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'pb-mobile-menu';
        
        menuToggle.addEventListener('click', function() {
            const isOpen = document.body.classList.contains('mobile-menu-open');
            
            if (!isOpen) {
                // Crear menú móvil
                mobileMenu.innerHTML = `
                    <div class="pb-mobile-menu-content">
                        <button class="pb-mobile-close" aria-label="Cerrar menú">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="pb-mobile-nav">
                            <a href="#galeria" class="pb-nav-link">Galería</a>
                            <a href="#proyectos" class="pb-nav-link">Proyectos</a>
                            <a href="#servicios" class="pb-nav-link">Servicios</a>
                            <a href="#testimonios" class="pb-nav-link">Testimonios</a>
                            <a href="#contacto" class="pb-nav-link">Contacto</a>
                        </div>
                        <div class="pb-mobile-actions">
                            <a href="#contacto" class="pb-btn pb-btn-primary">Empezar Proyecto</a>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(mobileMenu);
                document.body.classList.add('mobile-menu-open');
                
                // Estilos para el menú móvil
                const style = document.createElement('style');
                style.textContent = `
                    .pb-mobile-menu {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(20px);
                        z-index: 2000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: fadeIn 0.3s ease;
                    }
                    .pb-mobile-menu-content {
                        padding: 2rem;
                        width: 100%;
                        max-width: 400px;
                        position: relative;
                    }
                    .pb-mobile-close {
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: var(--pb-gray-500);
                        cursor: pointer;
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .pb-mobile-close:hover {
                        background: var(--pb-gray-100);
                    }
                    .pb-mobile-nav {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        margin-bottom: 3rem;
                    }
                    .pb-mobile-nav .pb-nav-link {
                        color: var(--pb-text-primary);
                        font-size: 1.25rem;
                        font-weight: 500;
                        padding: 0.75rem 0;
                        text-decoration: none;
                        text-align: center;
                        border-bottom: 1px solid var(--pb-border);
                    }
                    .pb-mobile-nav .pb-nav-link:hover {
                        color: var(--pb-primary);
                    }
                    .pb-mobile-actions {
                        display: flex;
                        justify-content: center;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    body.mobile-menu-open {
                        overflow: hidden;
                    }
                `;
                document.head.appendChild(style);
                
                // Cerrar menú
                const closeBtn = mobileMenu.querySelector('.pb-mobile-close');
                closeBtn.addEventListener('click', closeMobileMenu);
                
                // Cerrar al hacer clic en enlaces
                mobileMenu.querySelectorAll('.pb-nav-link').forEach(link => {
                    link.addEventListener('click', closeMobileMenu);
                });
            } else {
                closeMobileMenu();
            }
        });
    }
    
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.pb-mobile-menu');
        if (mobileMenu) {
            mobileMenu.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                mobileMenu.remove();
                document.body.classList.remove('mobile-menu-open');
            }, 300);
        }
    }
    
    initMobileMenu();
    
    // ============================== SCROLL PARA INTEGRACIÓN CON GALERÍA ==============================
    let ticking = false;
    let lastScrollY = 0;
    
    function updateScrollIntegration() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.pb-hero-section').offsetHeight;
        const galleryTop = gallerySection.offsetTop;
        
        // Progreso del scroll (0 a 1)
        let progress = 0;
        
        if (scrollY <= heroHeight) {
            // Dentro del hero
            progress = scrollY / heroHeight;
        } else if (scrollY >= galleryTop && scrollY <= galleryTop + gallerySection.offsetHeight) {
            // Dentro de la galería
            progress = 1;
        } else if (scrollY > heroHeight && scrollY < galleryTop) {
            // Transición entre hero y galería
            progress = 1;
        }
        
        // Ajustar overlay del hero
        if (heroOverlay) {
            const overlayOpacity = 0.3 + (progress * 0.5);
            heroOverlay.style.opacity = Math.min(0.8, overlayOpacity);
        }
        
        // Parallax en items de galería
        if (scrollY > galleryTop - window.innerHeight / 2) {
            const parallaxOffset = (scrollY - (galleryTop - window.innerHeight / 2)) * 0.5;
            
            parallaxItems.forEach(item => {
                const speed = parseFloat(item.getAttribute('data-speed')) || 0.15;
                const yPos = parallaxOffset * speed;
                item.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        // Botón scroll fade
        if (scrollDownBtn) {
            if (progress > 0.3) {
                scrollDownBtn.style.opacity = '0';
                scrollDownBtn.style.pointerEvents = 'none';
            } else {
                scrollDownBtn.style.opacity = '1';
                scrollDownBtn.style.pointerEvents = 'auto';
            }
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollIntegration);
            ticking = true;
        }
    });
    
    // ============================== HEADER SCROLL ==============================
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    
    // ============================== BOTÓN SCROLL DOWN ==============================
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPosition = gallerySection.offsetTop;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Feedback visual
            this.style.opacity = '0.5';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 1000);
        });
        
        // Accesibilidad
        scrollDownBtn.setAttribute('role', 'button');
        scrollDownBtn.setAttribute('tabindex', '0');
        
        scrollDownBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // ============================== SMOOTH SCROLL ==============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil
                closeMobileMenu();
            }
        });
    });
    
    // ============================== INTERACCIÓN CON ITEMS DE GALERÍA ==============================
    parallaxItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const currentTransform = this.style.transform || '';
            this.style.transform = currentTransform + ' scale(1.05)';
            this.style.zIndex = '100';
        });
        
        item.addEventListener('mouseleave', function() {
            const currentTransform = this.style.transform || '';
            this.style.transform = currentTransform.replace(' scale(1.05)', '');
            this.style.zIndex = '';
        });
        
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showProjectModal(title);
        });
    });
    
    function showProjectModal(title) {
        const modalHTML = `
            <div class="pb-project-modal">
                <div class="pb-modal-content">
                    <button class="pb-modal-close">&times;</button>
                    <h3>${title}</h3>
                    <p>Proyecto en desarrollo. Próximamente más detalles.</p>
                    <a href="#contacto" class="pb-btn pb-btn-primary">
                        <i class="fas fa-envelope"></i> Contactar sobre este proyecto
                    </a>
                </div>
            </div>
        `;
        
        // Remover modal existente
        const existingModal = document.querySelector('.pb-project-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Agregar nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Estilos del modal
        const style = document.createElement('style');
        style.textContent = `
            .pb-project-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .pb-modal-content {
                background: white;
                padding: 3rem;
                border-radius: 24px;
                max-width: 500px;
                width: 90%;
                position: relative;
                animation: slideUp 0.4s ease;
            }
            .pb-modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--pb-gray-500);
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .pb-modal-close:hover {
                background: var(--pb-gray-100);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Cerrar modal
        const modal = document.querySelector('.pb-project-modal');
        const closeBtn = modal.querySelector('.pb-modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', function closeModalOnEsc(e) {
            if (e.key === 'Escape') {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
                document.removeEventListener('keydown', closeModalOnEsc);
            }
        });
    }
    
    // ============================== CONTADORES ==============================
    function initCounters() {
        const counters = document.querySelectorAll('.pb-stat-number[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const target = parseInt(entry.target.dataset.count);
                    const suffix = entry.target.textContent.replace(/[0-9]/g, '');
                    let current = 0;
                    
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                    
                    entry.target.dataset.animated = 'true';
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    initCounters();
    
    // ============================== FORMULARIO ==============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            const originalHTML = button.innerHTML;
            
            // Deshabilitar botón y mostrar estado de carga
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Simular envío (en producción esto sería una llamada AJAX real)
            setTimeout(() => {
                // Mostrar mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'pb-form-success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h4>¡Mensaje enviado!</h4>
                        <p>Te responderé en menos de 24 horas.</p>
                    </div>
                `;
                
                // Estilos para el mensaje de éxito
                const style = document.createElement('style');
                style.textContent = `
                    .pb-form-success {
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                        padding: 1.5rem;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        margin-top: 1.5rem;
                        animation: slideUp 0.4s ease;
                    }
                    .pb-form-success i {
                        font-size: 2rem;
                    }
                    .pb-form-success h4 {
                        font-size: 1.125rem;
                        margin-bottom: 0.25rem;
                    }
                    .pb-form-success p {
                        opacity: 0.9;
                        font-size: 0.95rem;
                    }
                `;
                document.head.appendChild(style);
                
                // Insertar mensaje después del formulario
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Restaurar botón
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = originalHTML;
                    button.textContent = originalText;
                    
                    // Limpiar formulario
                    contactForm.reset();
                    
                    // Desaparecer mensaje después de 5 segundos
                    setTimeout(() => {
                        successMessage.style.opacity = '0';
                        successMessage.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            successMessage.remove();
                        }, 300);
                    }, 5000);
                }, 1500);
            }, 2000);
        });
    }
    
    // ============================== LAZY LOADING PARA IMÁGENES ==============================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antiguos
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
    
    initLazyLoading();
    
    // ============================== INICIALIZAR TODO ==============================
    console.log('🚀 Portfoliobox implementado correctamente');
});
