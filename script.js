// ============================== GALERÍA INTEGRADA CON ZOOM ==============================
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Variables principales
    const header = document.getElementById('main-header');
    const heroSection = document.querySelector('.pb-hero-section');
    const heroGalleryContainer = document.getElementById('heroGalleryContainer');
    const heroOverlay = document.getElementById('heroOverlay');
    const heroContent = document.querySelector('.pb-hero-content');
    const mainGallery = document.getElementById('mainGallery');
    const scrollDownBtn = document.getElementById('scrollDown');
    const gallerySection = document.getElementById('galeria');
    const expandedGallery = document.getElementById('expandedGallery');
    
    // Estados
    let isZooming = false;
    let zoomProgress = 0;
    let lastScrollY = 0;
    let ticking = false;
    
    // ============================== INICIALIZAR GALERÍA ==============================
    function initializeGallery() {
        const galleryItems = mainGallery.querySelectorAll('.pb-gallery-item');
        
        // Agregar gradientes dinámicos
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        ];
        
        galleryItems.forEach((item, index) => {
            // Asignar gradiente
            item.style.background = gradients[index % gradients.length];
            
            // Eventos hover
            item.addEventListener('mouseenter', function() {
                if (!isZooming) {
                    this.style.transform = 'translateZ(100px) scale(1.1)';
                    this.style.zIndex = '100';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!isZooming) {
                    this.style.transform = '';
                    this.style.zIndex = '';
                }
            });
            
            // Click para ver detalles
            item.addEventListener('click', function() {
                const project = this.getAttribute('data-project');
                showProjectDetails(project);
            });
        });
        
        // Clonar items para la galería expandida
        if (expandedGallery) {
            expandedGallery.innerHTML = mainGallery.innerHTML;
        }
    }
    
    // ============================== EFECTO ZOOM INTEGRADO ==============================
    function updateIntegratedZoom() {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const galleryTop = gallerySection.offsetTop;
        
        // Calcular progreso del scroll
        let progress = 0;
        
        if (scrollY <= heroHeight) {
            // En el hero
            progress = scrollY / heroHeight;
            isZooming = true;
        } else if (scrollY >= galleryTop && scrollY <= galleryTop + gallerySection.offsetHeight) {
            // En la sección de galería
            progress = 1;
            isZooming = false;
        } else if (scrollY > heroHeight && scrollY < galleryTop) {
            // Transición entre hero y galería
            progress = 1;
            isZooming = false;
        } else {
            // Después de la galería
            progress = 1;
            isZooming = false;
        }
        
        // Limitar progreso entre 0 y 1
        progress = Math.max(0, Math.min(1, progress));
        
        // Solo actualizar si hay cambios
        if (Math.abs(progress - zoomProgress) > 0.001) {
            applyZoomTransform(progress);
            zoomProgress = progress;
        }
        
        // Efecto parallax en la galería expandida
        if (expandedGallery && scrollY > galleryTop) {
            const galleryItems = expandedGallery.querySelectorAll('.pb-gallery-item');
            const parallaxOffset = (scrollY - galleryTop) * 0.3;
            
            galleryItems.forEach((item, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = parallaxOffset * speed;
                item.style.transform = `translateY(${yPos}px) rotate(${getItemRotation(index)})`;
            });
        }
        
        ticking = false;
    }
    
    function applyZoomTransform(progress) {
        // Efecto de zoom out en el contenedor
        const startScale = 1;
        const endScale = 0.3;
        const scale = startScale - (progress * (startScale - endScale));
        
        // Posición (mover hacia arriba)
        const startY = 0;
        const endY = -50;
        const yPos = startY + (progress * (endY - startY));
        
        // Tamaño de los items
        const itemStartScale = 0.8;
        const itemEndScale = 1;
        const itemScale = itemStartScale + (progress * (itemEndScale - itemStartScale));
        
        // Opacidad del overlay
        const overlayOpacity = 1 - (progress * 0.8);
        
        // Transformaciones del hero
        if (heroGalleryContainer) {
            heroGalleryContainer.style.transform = `translateY(${yPos}%) scale(${scale})`;
            heroGalleryContainer.style.opacity = 1 - (progress * 0.5);
        }
        
        if (heroOverlay) {
            heroOverlay.style.opacity = overlayOpacity;
        }
        
        if (heroContent) {
            heroContent.style.opacity = 1 - (progress * 1.2);
            heroContent.style.transform = `translateY(${progress * 50}px)`;
        }
        
        // Transformaciones de los items en el hero
        const heroItems = mainGallery.querySelectorAll('.pb-gallery-item');
        heroItems.forEach((item, index) => {
            // Escala individual
            item.style.transform = `translateZ(${getItemZ(index, progress)}px) scale(${getItemScale(index, progress)})`;
            
            // Opacidad
            item.style.opacity = 0.4 + (progress * 0.6);
            
            // Mostrar contenido cuando esté cerca
            const itemInner = item.querySelector('.pb-item-inner');
            if (itemInner) {
                itemInner.style.opacity = progress > 0.3 ? 1 : 0;
            }
        });
        
        // Ocultar botón cuando se hace zoom
        if (scrollDownBtn) {
            if (progress > 0.2) {
                scrollDownBtn.style.opacity = 0;
                scrollDownBtn.style.pointerEvents = 'none';
            } else {
                scrollDownBtn.style.opacity = 1;
                scrollDownBtn.style.pointerEvents = 'auto';
            }
        }
    }
    
    // Funciones auxiliares para efectos 3D
    function getItemZ(index, progress) {
        const startZ = [-100, -80, -60, -40, -20, 0, 20, 40];
        const endZ = [0, 10, 20, 30, 40, 50, 60, 70];
        return startZ[index] + (progress * (endZ[index] - startZ[index]));
    }
    
    function getItemScale(index, progress) {
        const startScale = [0.8, 0.8, 0.85, 0.85, 0.9, 0.9, 0.95, 1];
        const endScale = [1.1, 1.0, 1.05, 1.0, 1.1, 1.05, 1.0, 1.1];
        return startScale[index] + (progress * (endScale[index] - startScale[index]));
    }
    
    function getItemRotation(index) {
        const rotations = ['-5deg', '3deg', '-2deg', '5deg', '-3deg', '2deg', '-4deg', '4deg'];
        return rotations[index % rotations.length];
    }
    
    // ============================== SCROLL EVENT ==============================
    function handleScroll() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateIntegratedZoom();
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // ============================== HEADER ==============================
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // ============================== BOTÓN SCROLL DOWN ==============================
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPosition = gallerySection.offsetTop;
            
            // Animación suave al hacer clic
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
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
    
    // ============================== MOSTRAR DETALLES DEL PROYECTO ==============================
    function showProjectDetails(projectId) {
        const projects = {
            paseo: {
                title: "PASEO App",
                category: "FinTech Mobile Design",
                description: "Diseño integral de app FinTech para paseo de perros con sistema de pagos y seguimiento en tiempo real.",
                link: "https://github.com/dsd228/dsd228-paseo-ux-case-study"
            },
            nexus: {
                title: "Nexus Dashboard",
                category: "SaaS B2B Interface",
                description: "Rediseño UX/UI de dashboard operativo B2B para simplificar flujos y reducir curva de aprendizaje.",
                link: "https://github.com/dsd228/nexus-logistics-ui"
            },
            caroyense: {
                title: "La Caroyense",
                category: "E-commerce Redesign",
                description: "Rediseño mobile-first de e-commerce optimizando funnel de compra para maximizar conversión.",
                link: "https://github.com/dsd228/la-caroyense-ux-ui-redesign"
            },
            health: {
                title: "HealthTrack Pro",
                category: "Health App UI/UX",
                description: "Aplicación de salud con seguimiento de métricas y recomendaciones personalizadas.",
                link: "#"
            },
            edulearn: {
                title: "EduLearn Platform",
                category: "Educational SaaS",
                description: "Plataforma de aprendizaje en línea con sistema de gamificación y analytics.",
                link: "#"
            },
            travel: {
                title: "TravelMate",
                category: "Travel App Design",
                description: "App de viajes con planificación de itinerarios y reservas integradas.",
                link: "#"
            },
            finance: {
                title: "Finance Dashboard",
                category: "Analytics & Reports",
                description: "Dashboard financiero con visualización de datos y reportes automáticos.",
                link: "#"
            },
            fitness: {
                title: "FitTrack Pro",
                category: "Fitness App UI/UX",
                description: "Aplicación de fitness con seguimiento de entrenamientos y nutrición.",
                link: "#"
            }
        };
        
        const project = projects[projectId];
        if (project) {
            const modalHTML = `
                <div class="pb-project-modal">
                    <div class="pb-modal-content">
                        <button class="pb-modal-close">&times;</button>
                        <h3>${project.title}</h3>
                        <span class="pb-modal-category">${project.category}</span>
                        <p>${project.description}</p>
                        ${project.link !== '#' ? 
                            `<a href="${project.link}" target="_blank" class="pb-btn pb-btn-primary">
                                <i class="fab fa-github"></i> Ver Proyecto
                            </a>` : 
                            `<button class="pb-btn pb-btn-primary" disabled>Próximamente</button>`
                        }
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
                }
                .pb-modal-category {
                    display: inline-block;
                    background: var(--pb-primary);
                    color: white;
                    padding: 0.25rem 1rem;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin: 1rem 0;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
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
        }
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
    
    // ============================== FORMULARIO ==============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.textContent = 'Enviando...';
            button.disabled = true;
            
            setTimeout(() => {
                alert('¡Mensaje enviado! Te contactaré en 24 horas.');
                this.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        });
    }
    
    // ============================== MENÚ MÓVIL ==============================
    const menuToggle = document.getElementById('menuToggle');
    
    function closeMobileMenu() {
        const navCenter = document.querySelector('.pb-nav-center');
        if (navCenter && window.innerWidth < 768) {
            navCenter.style.display = 'none';
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navCenter = document.querySelector('.pb-nav-center');
            if (window.getComputedStyle(navCenter).display === 'flex') {
                navCenter.style.display = 'none';
                this.innerHTML = '<i class="fas fa-bars"></i>';
                this.setAttribute('aria-expanded', 'false');
            } else {
                navCenter.style.display = 'flex';
                navCenter.style.flexDirection = 'column';
                navCenter.style.position = 'absolute';
                navCenter.style.top = '100%';
                navCenter.style.left = '0';
                navCenter.style.width = '100%';
                navCenter.style.background = 'rgba(255, 255, 255, 0.98)';
                navCenter.style.backdropFilter = 'blur(20px)';
                navCenter.style.padding = '2rem';
                navCenter.style.boxShadow = 'var(--pb-shadow-lg)';
                this.innerHTML = '<i class="fas fa-times"></i>';
                this.setAttribute('aria-expanded', 'true');
            }
        });
    }
    
    // ============================== INICIALIZACIÓN ==============================
    function init() {
        initializeGallery();
        initCounters();
        updateIntegratedZoom();
        updateHeader();
        
        console.log('🚀 Galería Integrada con Zoom iniciada');
    }
    
    // Iniciar cuando el DOM esté listo
    init();
});
