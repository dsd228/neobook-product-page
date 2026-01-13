// Manejo básico de interacción: thumbnails, añadir al carrito (placeholder), accesibilidad
document.addEventListener('DOMContentLoaded', function(){
  // Thumbnails -> cambiar imagen principal
  document.querySelectorAll('.thumbnail').forEach(btn => {
    btn.addEventListener('click', function(){
      const src = btn.getAttribute('data-src');
      const mainImg = document.querySelector('#mainImage img');
      if(src && mainImg){
        mainImg.src = src;
        mainImg.alt = btn.querySelector('img')?.alt || mainImg.alt;
      }
    });

    btn.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Botón añadir al carrito (simulación)
  const addToCart = document.getElementById('addToCart');
  if(addToCart){
    addToCart.addEventListener('click', function(){
      addToCart.disabled = true;
      addToCart.textContent = 'Añadido ✓';
      setTimeout(()=>{ addToCart.disabled = false; addToCart.textContent = '🛒 Añadir al Carrito'; }, 1200);
    });
  }
});
