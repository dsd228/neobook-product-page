// ============================== DAVID DÍAZ PORTFOLIO ==============================
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Variables principales
    const header = document.getElementById('main-header');
    const zoomableInner = document.getElementById('zoomableInner');
    const heroOverlay = document.getElementById('heroOverlay');
    const heroContent = document.querySelector('.dd-hero-content');
    const scrollDownBtn = document.getElementById('scrollDown');
    const menuToggle = document.getElementById('menuToggle');
    
    // ============================== ZOOM EFFECT (PORTFOLIOBOX STYLE) ==============================
    function initPortfolioZoom() {
        if (!zoomableInner) return;
        
        // 1. Obtener valor de zoom
        const zoomContainer = zoomableInner.parentElement;
        const zoomValue = parseInt(zoomContainer.getAttribute('data-zoom')) || 28;
        
        // 2. Estado inicial (inline como Portfoliobox)
        zoomableInner.style.transform = `scale(${zoomValue}) translateX(25px) translateY(-45px)`;
        zoomableInner.style.opacity = '0';
        
        // 3. Overlay inicial
        if (heroOverlay) {
            heroOverlay.style.opacity = '1';
        }
        
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
        
        // 4. Forzar reflow
        zoomableInner.getBoundingClientRect();
        
        // 5. Animación con requestAnimationFrame
        requestAnimationFrame(() => {
            // Transformación final
            zoomableInner.style.transition = 'transform 1.1s cubic-bezier(0.33, 1, 0.68, 1), opacity 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
            zoomableInner.style.transform = 'scale(1) translateX(0) translateY(0)';
            zoomableInner.style.opacity = '1';
            
            // Overlay fade out
            if (heroOverlay) {
                heroOverlay.style.transition = 'opacity 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
                heroOverlay.style.opacity = '0.4';
            }
            
            // Content fade in
            if (heroContent) {
                heroContent.style.transition = 'opacity 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
                heroContent.style.opacity = '1';
            }
            
            console.log('🚀 Efecto Portfoliobox ejecutado (scale:', zoomValue, ')');
        });
    }
    
    // Inicializar zoom al cargar
    setTimeout(initPortfolioZoom, 100);
    
    // ============================== MENÚ MÓVIL ==============================
    function initMobileMenu() {
        if (!menuToggle) return;
        
        menuToggle.addEventListener('click', function() {
            const isOpen = document.body.classList.contains('mobile-menu-open');
            
            if (!isOpen) {
                // Crear menú móvil
                const mobileMenu = document.createElement('div');
                mobileMenu.className = 'dd-mobile-menu';
                mobileMenu.innerHTML = `
                    <div class="dd-mobile-menu-content">
                        <button class="dd-mobile-close" aria-label="Cerrar menú">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="dd-mobile-nav">
                            <a href="#proyectos" class="dd-nav-link">Proyectos</a>
                            <a href="#servicios" class="dd-nav-link">Servicios</a>
                            <a href="#proceso" class="dd-nav-link">Proceso</a>
                            <a href="#testimonios" class="dd-nav-link">Testimonios</a>
                            <a href="#contacto" class="dd-nav-link">Contacto</a>
                        </div>
                        <div class="dd-mobile-actions">
                            <a href="#contacto" class="dd-btn dd-btn-primary">Empezar Proyecto</a>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(mobileMenu);
                document.body.classList.add('mobile-menu-open');
                
                // Cerrar menú
                const closeBtn = mobileMenu.querySelector('.dd-mobile-close');
                closeBtn.addEventListener('click', closeMobileMenu);
                
                // Cerrar al hacer clic en enlaces
                mobileMenu.querySelectorAll('.dd-nav-link').forEach(link => {
                    link.addEventListener('click', closeMobileMenu);
                });
                
                // Cerrar con ESC
                document.addEventListener('keydown', function closeMenuOnEsc(e) {
                    if (e.key === 'Escape') {
                        closeMobileMenu();
                        document.removeEventListener('keydown', closeMenuOnEsc);
                    }
                });
            } else {
                closeMobileMenu();
            }
        });
    }
    
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.dd-mobile-menu');
        if (mobileMenu) {
            mobileMenu.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                mobileMenu.remove();
                document.body.classList.remove('mobile-menu-open');
            }, 300);
        }
    }
    
    initMobileMenu();
    
    // ============================== HEADER SCROLL ==============================
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    
    // ============================== SCROLL DOWN BUTTON ==============================
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPosition = document.querySelector('#proyectos').offsetTop;
            
            window.scrollTo({
                top: targetPosition - 80,
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
            if (href === '#' || href === '#hero') return;
            
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
    
    // ============================== PROJECT GALLERY INTERACTION ==============================
    const galleryThumbs = document.querySelectorAll('.dd-gallery-thumb');
    
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remover clase active de todos
            galleryThumbs.forEach(t => t.classList.remove('active'));
            
            // Agregar active al thumb clickeado
            this.classList.add('active');
            
            // Cambiar imagen principal del proyecto
            const projectShowcase = this.closest('.dd-project-showcase');
            if (projectShowcase) {
                const mainImage = projectShowcase.querySelector('.dd-project-main-image');
                if (mainImage) {
                    const thumbImg = this.querySelector('img');
                    // Efecto de transición
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.style.transition = 'opacity 0.3s ease';
                        mainImage.style.opacity = '1';
                    }, 50);
                }
            }
        });
    });
    
    // ============================== PROJECT FEATURES HOVER ==============================
    const features = document.querySelectorAll('.dd-feature');
    
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ============================== SERVICE CARDS INTERACTION ==============================
    const serviceCards = document.querySelectorAll('.dd-service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ============================== TESTIMONIAL CAROUSEL ==============================
    function initTestimonials() {
        const testimonials = document.querySelectorAll('.dd-testimonial-card');
        let currentIndex = 0;
        
        function rotateTestimonials() {
            testimonials.forEach((testimonial, index) => {
                if (index === currentIndex) {
                    testimonial.style.opacity = '1';
                    testimonial.style.transform = 'translateY(0) scale(1.05)';
                } else {
                    testimonial.style.opacity = '0.8';
                    testimonial.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            currentIndex = (currentIndex + 1) % testimonials.length;
        }
        
        // Inicializar con animación
        testimonials.forEach((testimonial, index) => {
            testimonial.style.transition = 'all 0.5s ease';
            if (index === 0) {
                testimonial.style.opacity = '1';
            } else {
                testimonial.style.opacity = '0.8';
            }
        });
        
        // Rotar testimonials cada 5 segundos
        // setInterval(rotateTestimonials, 5000);
    }
    
    initTestimonials();
    
    // ============================== CONTACT FORM ==============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.innerHTML;
            
            // Deshabilitar y mostrar estado de carga
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
            
            // Simular envío
            setTimeout(() => {
                // Mostrar mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'dd-form-success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h4>¡Mensaje enviado!</h4>
                        <p>Te responderé en menos de 24 horas.</p>
                    </div>
                `;
                
                // Estilos para el mensaje
                successMessage.style.cssText = `
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    animation: fadeIn 0.4s ease;
                `;
                
                this.parentNode.appendChild(successMessage);
                
                // Restaurar formulario
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = originalText;
                    
                    // Limpiar formulario
                    this.reset();
                    
                    // Eliminar mensaje después de 5 segundos
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
    
    // ============================== PARALLAX EFFECT ON SCROLL ==============================
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.dd-grid-item');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.05 + (index * 0.01);
            const yPos = scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // ============================== ANIMATE ON SCROLL ==============================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    document.querySelectorAll('.dd-project-showcase, .dd-service-card, .dd-testimonial-card, .dd-process-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ============================== STATS COUNTER ==============================
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.dd-stat-number');
        
        statNumbers.forEach(stat => {
            const originalText = stat.textContent;
            const isPercentage = originalText.includes('%');
            const isPlus = originalText.includes('+');
            
            // Extraer número
            const number = parseFloat(originalText.replace(/[^0-9.]/g, ''));
            
            let current = 0;
            const increment = number / 30; // 30 frames
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = originalText;
                    clearInterval(timer);
                } else {
                    let displayNumber = Math.floor(current);
                    if (isPercentage) {
                        stat.textContent = displayNumber + '%';
                    } else if (isPlus) {
                        stat.textContent = displayNumber + '+';
                    } else {
                        stat.textContent = displayNumber;
                    }
                }
            }, 30);
        });
    }
    
    // Iniciar contadores cuando el hero está en vista
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(initStatsCounter, 1000);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.dd-hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // ============================== INITIALIZE ==============================
    console.log('🚀 Portfolio David Díaz implementado correctamente');
    
    // Inicializar tooltips para proyectos
    const projectTags = document.querySelectorAll('.dd-tag');
    projectTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
});
