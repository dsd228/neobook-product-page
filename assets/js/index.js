// Search functionality: filtrar cards por texto
document.addEventListener('DOMContentLoaded', function(){
  const input = document.querySelector('.search-input');
  if(input){
    input.addEventListener('keypress', function(e){
      if(e.key === 'Enter'){
        const term = this.value.toLowerCase().trim();
        document.querySelectorAll('.product-card').forEach(card=>{
          card.style.display = card.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
        });
      }
    });
  }

  // Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth'});
    });
  });
});
