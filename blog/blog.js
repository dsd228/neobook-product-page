// blog.js - Funcionalidades específicas para la página del blog

// Año actual automático
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if(targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if(targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Manejo de imágenes con fallback
function handleImageError(img) {
  const parent = img.parentElement;
  if (parent.classList.contains('card-image')) {
    // Crear placeholder si la imagen no carga
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `<i class="fas fa-image"></i>`;
    
    // Reemplazar la imagen con el placeholder
    parent.removeChild(img);
    parent.appendChild(placeholder);
  }
}

// Configurar imágenes para manejar errores
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('.card-image img');
  
  images.forEach(img => {
    // Agregar evento de error
    img.addEventListener('error', function() {
      handleImageError(this);
    });
    
    // Efecto hover en las imágenes de las cards
    const card = img.closest('.article-card');
    if (card) {
      card.addEventListener('mouseenter', function() {
        const img = this.querySelector('.card-image img');
        if (img && img.complete && img.naturalHeight !== 0) {
          img.style.transform = 'scale(1.05)';
        }
      });
      
      card.addEventListener('mouseleave', function() {
        const img = this.querySelector('.card-image img');
        if (img && img.complete && img.naturalHeight !== 0) {
          img.style.transform = 'scale(1)';
        }
      });
    }
  });
  
  // Lazy loading para imágenes
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// Prevenir envío de formularios (si hay alguno)
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Aquí puedes agregar lógica para enviar formularios
    alert('Formulario enviado (simulación)');
  });
});
