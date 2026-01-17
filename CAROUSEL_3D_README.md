# 🎡 Carrusel 3D Coverflow - Documentación Completa

## 📋 Descripción

Carrusel 3D tipo coverflow (estilo Apple) implementado con **HTML, CSS y JavaScript puro**, sin dependencias externas. Proporciona una experiencia de usuario premium con atención al detalle en el diseño y las animaciones.

## ✨ Características Principales

### 🎨 Diseño Premium
- ✅ Cards de **320x400px** con bordes redondeados
- ✅ Sombras profundas (box-shadow) y sutil efecto inset
- ✅ Fondos con `background-image` ajustados a `cover`
- ✅ Opacidad y blur en cards no activas para destacar la principal
- ✅ Gradientes de fondo personalizables

### 🔄 Comportamiento 3D
- ✅ Card activa con elevación (`translateZ` positivo) y escala aumentada
- ✅ Cards laterales con rotación (`rotateY`) proporcional a su posición
- ✅ `z-index` dinámico calculado según cercanía al centro
- ✅ Transiciones fluidas con `cubic-bezier(0.22, 0.61, 0.36, 1)`

### 🖱️ Interacciones del Usuario
- ✅ Navegación mediante **scroll del mouse** (wheel)
- ✅ Click en cualquier card para activarla
- ✅ Soporte para teclado (flechas izquierda/derecha)
- ✅ Soporte táctil para dispositivos móviles (swipe)
- ✅ Sin autoplay (según especificaciones)

### ⚡ Rendimiento Optimizado
- ✅ Uso estratégico de `will-change` para optimización de renderizado
- ✅ Solo `transform` y `opacity` para animaciones (sin reflows)
- ✅ `backface-visibility: hidden` para mejor rendimiento
- ✅ Debouncing en eventos de scroll

### ♿ Accesibilidad y UX
- ✅ Movimiento sutil para evitar mareos
- ✅ Indicadores visuales de posición
- ✅ Instrucciones claras de navegación
- ✅ Navegación por teclado incluida
- ✅ Código completamente comentado

## 📁 Archivo

**Ubicación:** `carousel-3d-coverflow.html`

**Tamaño:** ~17KB (código autocontenido)

## 🚀 Uso

### Opción 1: Abrir Directamente
```bash
# Abrir el archivo en cualquier navegador moderno
open carousel-3d-coverflow.html
```

### Opción 2: Servidor Local
```bash
# Python 3
python3 -m http.server 8080

# Navegar a: http://localhost:8080/carousel-3d-coverflow.html
```

## 🖼️ Personalización de Imágenes

### Reemplazar con URLs Externas
```javascript
const carouselImages = [
  'https://tu-sitio.com/imagen1.jpg',
  'https://tu-sitio.com/imagen2.jpg',
  'https://tu-sitio.com/imagen3.jpg',
  // ... más imágenes
];
```

### Reemplazar con Rutas Locales
```javascript
const carouselImages = [
  './images/producto1.jpg',
  './images/producto2.jpg',
  './images/producto3.jpg',
  // ... más imágenes
];
```

### Agregar/Quitar Cards
El carrusel se adapta automáticamente al número de imágenes en el array. Simplemente agrega o quita URLs del array `carouselImages`.

## 🎨 Personalización de Estilos

### Cambiar Tamaño de Cards
```css
.carousel-card {
  width: 400px;  /* Cambiar de 320px */
  height: 500px; /* Cambiar de 400px */
}
```

### Cambiar Colores de Fondo
```css
body {
  background: linear-gradient(135deg, #TU_COLOR_1, #TU_COLOR_2);
}
```

### Ajustar Bordes Redondeados
```css
.carousel-card {
  border-radius: 30px; /* Cambiar de 20px */
}
```

### Modificar Sombras
```css
.carousel-card {
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.5),  /* Sombra principal */
    0 15px 40px rgba(0, 0, 0, 0.4),   /* Sombra secundaria */
    inset 0 1px 0 rgba(255, 255, 255, 0.2); /* Inset sutil */
}
```

## ⚙️ Configuración Técnica

### Perspectiva 3D
```css
.carousel-wrapper {
  perspective: 1200px; /* Ajustar profundidad 3D */
}
```

### Velocidad de Transición
```css
.carousel-card {
  transition: 
    transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1), /* Cambiar 0.7s */
    opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1),
    filter 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
}
```

### Espaciado entre Cards
```javascript
// En la función updateCarousel()
const translateX = normalizedIndex * 280; // Cambiar 280px
```

### Ángulo de Rotación
```javascript
// En la función updateCarousel()
const rotateY = normalizedIndex * 35; // Cambiar 35 grados
```

## 📱 Responsive Design

El carrusel incluye breakpoints para dispositivos móviles:

```css
@media (max-width: 768px) {
  .carousel-wrapper {
    height: 500px;
    perspective: 800px;
  }

  .carousel-card {
    width: 260px;
    height: 340px;
  }
}
```

## 🎮 Controles de Navegación

| Método | Acción |
|--------|--------|
| **Scroll del Mouse** | Arriba = Anterior, Abajo = Siguiente |
| **Click en Card** | Activa la card clickeada |
| **Flecha Izquierda** | Card anterior |
| **Flecha Derecha** | Card siguiente |
| **Swipe Izquierda** | Card siguiente (móvil) |
| **Swipe Derecha** | Card anterior (móvil) |

## 🔧 Estructura del Código

### HTML
- Contenedor principal con perspectiva (`carousel-wrapper`)
- Track con `preserve-3d` (`carousel-track`)
- Cards generadas dinámicamente
- Indicadores de posición
- Instrucciones de uso

### CSS
- Reset y configuración base
- Contenedor con perspectiva 3D
- Track con `transform-style: preserve-3d`
- Estilos de cards (320x400px, sombras, bordes)
- Estados activo/inactivo
- Responsive design
- Optimizaciones de rendimiento

### JavaScript
- Configuración de imágenes (fácilmente reemplazables)
- Inicialización del carrusel
- Cálculo de transformaciones 3D
- Event handlers (wheel, click, teclado, touch)
- Gestión de estado y animaciones
- Debouncing y throttling

## 📊 Rendimiento

### Optimizaciones Implementadas
1. **will-change** en propiedades que se animan
2. **Solo transform y opacity** para animaciones
3. **backface-visibility: hidden** para evitar renderizado innecesario
4. **Debouncing** en eventos de scroll
5. **Flag isAnimating** para prevenir animaciones simultáneas
6. **z-index con transición retrasada** para cambios suaves

### Métricas Esperadas
- **FPS:** 60fps constantes
- **Tiempo de animación:** 700ms
- **Carga inicial:** <100ms
- **Tamaño:** ~17KB

## 🌐 Compatibilidad

| Navegador | Versión Mínima | Soporte |
|-----------|----------------|---------|
| Chrome | 90+ | ✅ Total |
| Firefox | 88+ | ✅ Total |
| Safari | 14+ | ✅ Total |
| Edge | 90+ | ✅ Total |
| Opera | 76+ | ✅ Total |

**Nota:** Requiere soporte para CSS3 transforms 3D y ES6 JavaScript.

## 📸 Capturas de Pantalla

### Vista Inicial
![Carousel - Card 1 Activa](https://github.com/user-attachments/assets/0a7688f8-49c7-4631-89df-709cb3abe73a)

### Navegación Activa
![Carousel - Card 3 Activa](https://github.com/user-attachments/assets/61d99add-db7d-436d-89b6-7b84dc20b7e1)

### Scroll Fluido
![Carousel - Card 4 Activa](https://github.com/user-attachments/assets/36a3dd6c-4e97-4ed8-8be4-f12f91eded36)

## 🎯 Casos de Uso

- ✅ Galería de productos premium
- ✅ Portfolio de diseño
- ✅ Showcase de aplicaciones
- ✅ Galería de imágenes destacadas
- ✅ Presentación de servicios
- ✅ Carrusel de testimonios visuales

## 📝 Comentarios en el Código

El código incluye comentarios detallados en español que explican:
- Propósito de cada sección
- Cómo funcionan las transformaciones 3D
- Lógica de las interacciones
- Optimizaciones de rendimiento
- Cómo personalizar cada aspecto

## 🚫 Sin Dependencias

- ✅ **No requiere** jQuery
- ✅ **No requiere** Swiper.js
- ✅ **No requiere** Bootstrap
- ✅ **No requiere** frameworks CSS
- ✅ **100% vanilla** HTML, CSS y JavaScript

## 📦 Entregables Completos

- ✅ Estructura HTML limpia y semántica
- ✅ Estilo CSS completamente funcional
- ✅ Comportamiento interactivo con JavaScript
- ✅ Código autocompleto listo para copiar y pegar
- ✅ Documentación detallada (este archivo)
- ✅ Comentarios exhaustivos en el código

## 🎓 Aprendizaje

Este carrusel es un excelente ejemplo para aprender:
- CSS 3D Transforms avanzados
- Gestión de estado en JavaScript vanilla
- Optimización de rendimiento en animaciones
- Event handling moderno
- Responsive design
- Accesibilidad web

## 🔄 Actualizaciones Futuras

Ideas para mejorar el carrusel:
- [ ] Modo autoplay opcional
- [ ] Controles de navegación con botones
- [ ] Thumbnails en la parte inferior
- [ ] Lazy loading de imágenes
- [ ] Animaciones de entrada personalizables
- [ ] Temas predefinidos (dark/light)

## 📞 Soporte

Para preguntas, sugerencias o reportar problemas:
- Abre un issue en GitHub
- Revisa la documentación en el código
- Consulta los comentarios detallados

## 📄 Licencia

Este componente se incluye como parte del proyecto bajo la licencia MIT.

---

**Creado con ❤️ - Diseño Premium sin Compromisos**

*Última actualización: Enero 2026*
