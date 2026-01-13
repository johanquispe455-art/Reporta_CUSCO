document.addEventListener('DOMContentLoaded', () => {
  // Manejo de Cierre de Sesión
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      // Aquí podrías limpiar localStorage o cookies en el futuro
      window.location.href = "index.html";
    });
  }

  // Efecto dinámico para los enlaces del sidebar
  const menuLinks = document.querySelectorAll('.sidebar__menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});