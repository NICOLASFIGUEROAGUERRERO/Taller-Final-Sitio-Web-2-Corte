const { animate, stagger, createTimeline } = anime;

const loader = document.getElementById('loader');
const tarjetas = [...document.querySelectorAll('.card')];
const botones = [...document.querySelectorAll('.filtro')];
const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Preparar el logo: cada letra va en su propio <span> para animarla por separado */
const logo = document.getElementById('logoTexto');
logo.innerHTML = [...logo.textContent]
  .map(l => `<span class="letra">${l === ' ' ? '&nbsp;' : l}</span>`)
  .join('');

/* 2. Secuencia de introducción con timeline:
      letras -> línea de carga -> desaparece el loader -> entran las tarjetas.
      'outExpo': arranque rápido y frenado largo, da sensación de entrada elegante.
      'inOutQuad': arranque y frenado suaves, ideal para una barra de carga.
      'inQuad': acelera al final, perfecto para que algo "salga" de la pantalla. */
function introduccion() {
  if (reducir) {                       // Accesibilidad: sin movimiento
    loader.style.display = 'none';
    tarjetas.forEach(c => (c.style.opacity = 1));
    return;
  }
  const tl = createTimeline({
    defaults: { ease: 'outExpo', duration: 700 },
    onComplete: () => { loader.style.display = 'none'; }
  });

  tl.add('.letra', { opacity: [0, 1], y: [40, 0], rotate: [-15, 0], delay: stagger(60) })
    .add('.loader-linea', { width: ['0px', '260px'], duration: 600, ease: 'inOutQuad' }, '-=200')
    .add('#loader', { opacity: [1, 0], duration: 500, ease: 'inQuad' }, '+=300')
    .add('.card', { opacity: [0, 1], y: [50, 0], delay: stagger(100) }, '-=100');
}

/* 3. Filtros: las tarjetas que no coinciden salen; las que coinciden entran escalonadas.
      'outBack': pasa un poco del tamaño final y vuelve, da efecto de "aparecer con energía". */
function filtrar(categoria) {
  botones.forEach(b => b.classList.toggle('activo', b.dataset.filtro === categoria));

  const mostrar = tarjetas.filter(c => categoria === 'todos' || c.dataset.cat === categoria);
  const ocultar = tarjetas.filter(c => !mostrar.includes(c));

  if (ocultar.length) {
    animate(ocultar, {
      opacity: 0, scale: 0.8, duration: 300, ease: 'inQuad',
      onComplete: () => ocultar.forEach(c => c.classList.add('oculta'))
    });
  }
  mostrar.forEach(c => c.classList.remove('oculta'));
  animate(mostrar, {
    opacity: [0, 1], scale: [0.85, 1], y: [0, 0],
    delay: stagger(80), duration: 600, ease: 'outBack'
  });
}

/* 4. Interacciones del usuario */
// Clic en los botones de filtro
botones.forEach(b => b.addEventListener('click', () => filtrar(b.dataset.filtro)));

// Teclado: 1-5 eligen filtro, Esc muestra todo
const teclas = { '1': 'todos', '2': 'lagos', '3': 'montana', '4': 'cultura', '5': 'ciudad' };
document.addEventListener('keydown', (e) => {
  if (teclas[e.key]) filtrar(teclas[e.key]);
  if (e.key === 'Escape') filtrar('todos');
});

// Hover: la tarjeta se eleva un poco
tarjetas.forEach(card => {
  card.addEventListener('mouseenter', () => { if (!reducir) animate(card, { y: -8, duration: 250, ease: 'outQuad' }); });
  card.addEventListener('mouseleave', () => { if (!reducir) animate(card, { y: 0, duration: 250, ease: 'outQuad' }); });
});

// Clic en el corazón: rebote elástico y cambio de símbolo
document.querySelectorAll('.fav').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
    if (!reducir) animate(btn, { scale: [1, 1.6, 1], duration: 700, ease: 'outElastic(1, .5)' });
  });
});

introduccion();