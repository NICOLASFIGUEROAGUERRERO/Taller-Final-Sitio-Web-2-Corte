const toggle = document.getElementById('toggle-plan');
const formato = new Intl.NumberFormat('es-CO');

toggle.addEventListener('change', () => {
  document.querySelectorAll('.precio').forEach(p => {
    const mensual = Number(p.dataset.mensual);
    const valor = toggle.checked ? Math.round(mensual * 12 * 0.8) : mensual;
    p.textContent = '$' + formato.format(valor) + (toggle.checked ? '/año' : '');
  });
});