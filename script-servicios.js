// ============================================
// JAVASCRIPT PARA PÁGINA DE SERVICIOS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de Servicios cargada');
    
    // ===== CONFIGURACIÓN =====
    const config = {
        debug: false
    };
    
    // ===== ELEMENTOS PRINCIPALES =====
    const elements = {
        faqQuestions: document.querySelectorAll('.faq-question'),
        statNumbers: document.querySelectorAll('.stat-number'),
        serviceCards: document.querySelectorAll('.servicio-card'),
        comparativaRows: document.querySelectorAll('.table-row')
    };
    
    // ===== INICIALIZAR MÓDULOS =====
    function init() {
        initFAQ();
        initStatsAnimation();
        initServiceCardHover();
        initComparativaHover();
        initSmoothNavigation();
        initServiceTracking();
        
        if (config.debug) console.log('✅ Módulos de servicios inicializados');
    }
    
    // ===== 1. FAQ ACORDEÓN =====
    function initFAQ() {
        elements.faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Cerrar otros FAQ
                elements.faqQuestions.forEach(q => {
                    if (q !== this) {
                        q.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle este FAQ
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Track evento
                trackServiceEvent('faq_toggle', {
                    question: this.textContent.trim(),
                    action: !isExpanded ? 'open' : 'close'
                });
            });
            
            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // ===== 2. ANIMACIÓN DE ESTADÍSTICAS =====
    function initStatsAnimation() {
        if (elements.statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateServiceStat(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        elements.statNumbers.forEach(stat => observer.observe(stat));
    }
    
    function animateServiceStat(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const isMoney = element.textContent.includes('$');
        
        let current = 0;
        const increment = target / 60;
        const duration = 1500;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= 60) {
                clearInterval(timer);
                element.textContent = isMoney ? `$${target.toFixed(1)}M` : `${target.toFixed(0)}+`;
                element.classList.add('animated');
            } else {
                element.textContent = isMoney ? 
                    `$${Math.floor(current).toFixed(1)}M` : 
                    `${Math.floor(current)}+`;
            }
        }, duration / 60);
    }
    
    // ===== 3. HOVER EFFECTS PARA TARJETAS DE SERVICIO =====
    function initServiceCardHover() {
        elements.serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (config.debug) {
                    const title = card.querySelector('.servicio-title').textContent;
                    console.log(`🎯 Hover en servicio: ${title}`);
                }
            });
            
            card.addEventListener('click', (e) => {
                // Solo track si no es un botón
                if (!e.target.closest('a') && !e.target.closest('button')) {
                    const title = card.querySelector('.servicio-title').textContent;
                    trackServiceEvent('service_card_click', { service: title });
                }
            });
        });
    }
    
    // ===== 4. HOVER PARA TABLA COMPARATIVA =====
    function initComparativaHover() {
        elements.comparativaRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                const serviceName = this.querySelector('.servicio-name span').textContent;
                if (config.debug) console.log(`📊 Hover en servicio: ${serviceName}`);
            });
            
            row.addEventListener('click', function(e) {
                if (!e.target.closest('a')) {
                    const serviceName = this.querySelector('.servicio-name span').textContent;
                    trackServiceEvent('comparativa_row_click', { service: serviceName });
                }
            });
        });
    }
    
    // ===== 5. NAVEGACIÓN SUAVE =====
    function initSmoothNavigation() {
        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header-fixed')?.offsetHeight || 70;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    // ===== 6. TRACKING DE SERVICIOS =====
    function initServiceTracking() {
        // Track clicks en enlaces de servicios
        document.querySelectorAll('.servicio-cta a[href*="servicio-"]').forEach(link => {
            link.addEventListener('click', function() {
                const service = this.getAttribute('href').replace('.html', '').replace('servicio-', '');
                trackServiceEvent('service_details_click', { 
                    service: service,
                    text: this.textContent.trim()
                });
            });
        });
        
        // Track botones de consulta
        document.querySelectorAll('a[href="contacto.html"]').forEach(link => {
            link.addEventListener('click', function() {
                const context = this.closest('.servicio-card') ? 
                    this.closest('.servicio-card').querySelector('.servicio-title').textContent :
                    'página_servicios';
                    
                trackServiceEvent('service_consultation_click', { 
                    context: context,
                    location: 'servicios_page'
                });
            });
        });
        
        // Track scroll en página de servicios
        let servicesViewed = new Set();
        const serviceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const serviceTitle = entry.target.querySelector('.servicio-title')?.textContent;
                    if (serviceTitle && !servicesViewed.has(serviceTitle)) {
                        servicesViewed.add(serviceTitle);
                        trackServiceEvent('service_viewed', { service: serviceTitle });
                    }
                }
            });
        }, { threshold: 0.5 });
        
        elements.serviceCards.forEach(card => serviceObserver.observe(card));
    }
    
    // ===== 7. FUNCIÓN DE TRACKING =====
    function trackServiceEvent(eventName, data = {}) {
        // Integración con analytics
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': eventName,
                'page_type': 'servicios',
                ...data
            });
        }
        
        // Log para debugging
        if (config.debug) {
            console.log(`🎯 Evento servicio: ${eventName}`, data);
        }
    }
    
    // ===== 8. INITIAL LOAD ANIMATIONS =====
    function initLoadAnimations() {
        // Animación para cards de servicio
        const cards = document.querySelectorAll('.servicio-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Animación para steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // ===== 9. MOBILE OPTIMIZATIONS =====
    function initMobileOptimizations() {
        // Mejorar touch targets para móviles
        if ('ontouchstart' in window) {
            document.querySelectorAll('.servicio-card, .faq-question, .table-row').forEach(element => {
                element.style.cursor = 'pointer';
                element.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                }, { passive: true });
                
                element.addEventListener('touchend', function() {
                    this.style.transform = '';
                }, { passive: true });
            });
        }
    }
    
    // ===== 10. PRINT STYLES =====
    function initPrintStyles() {
        // Agregar estilos para impresión
        const printStyles = `
            @media print {
                .header-fixed,
                .footer,
                .btn-primary,
                .btn-secondary,
                .hero-cta,
                .cta-servicios {
                    display: none !important;
                }
                
                .servicio-card {
                    break-inside: avoid;
                    box-shadow: none !important;
                    border: 1px solid #ccc !important;
                }
                
                a[href]:after {
                    content: " (" attr(href) ")";
                    font-size: 0.9em;
                    font-weight: normal;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = printStyles;
        document.head.appendChild(styleSheet);
    }
    
    // ===== INICIALIZAR TODO =====
    init();
    initLoadAnimations();
    initMobileOptimizations();
    initPrintStyles();
    
    // ===== API PÚBLICA =====
    window.serviciosPage = {
        toggleFAQ: function(index) {
            if (elements.faqQuestions[index]) {
                elements.faqQuestions[index].click();
            }
        },
        
        scrollToService: function(serviceId) {
            const element = document.getElementById(serviceId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        },
        
        trackServiceView: function(serviceName) {
            trackServiceEvent('service_programmatic_view', { service: serviceName });
        },
        
        getServiceStats: function() {
            return {
                totalServices: elements.serviceCards.length,
                servicesWithStats: elements.statNumbers.length,
                faqItems: elements.faqQuestions.length
            };
        }
    };
    
    // Para debugging
    if (config.debug) {
        console.log('🔍 Debug mode activado para servicios');
        console.log('📊 Total servicios:', elements.serviceCards.length);
        console.log('❓ Total FAQs:', elements.faqQuestions.length);
        console.log('📈 Stats a animar:', elements.statNumbers.length);
    }
});

// ===== POLYFILLS Y UTILIDADES =====

// Detectar si el usuario viene de otra página de servicios
if (document.referrer && document.referrer.includes('servicio-')) {
    const referrerService = document.referrer.split('/').pop().replace('.html', '');
    console.log(`🔗 Usuario viene de: ${referrerService}`);
    
    // Puedes usar esta info para personalizar la experiencia
    if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'service_navigation',
            'from_service': referrerService,
            'to_page': 'servicios'
        });
    }
}

// Detectar si hay parámetros de URL para servicios específicos
const urlParams = new URLSearchParams(window.location.search);
const serviceParam = urlParams.get('service');
if (serviceParam) {
    // Scroll automático al servicio específico
    setTimeout(() => {
        const targetElement = document.querySelector(`[data-service="${serviceParam}"]`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetElement.classList.add('highlighted');
            
            setTimeout(() => {
                targetElement.classList.remove('highlighted');
            }, 3000);
        }
    }, 1000);
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFAQ,
        trackServiceEvent
    };
}
