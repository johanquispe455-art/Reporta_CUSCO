document.addEventListener('DOMContentLoaded', () => {
    const btnEditar = document.getElementById('btnEditarPerfil');
    const btnGuardar = document.getElementById('btnGuardar');
    const campos = document.querySelectorAll('.campo-perfil');
    const logoutBtn = document.getElementById('logoutBtn');

    // Función Editar
    btnEditar.addEventListener('click', () => {
        campos.forEach(campo => {
            campo.disabled = false;
        });
        campos[0].focus(); // Poner foco en el primer nombre
        
        btnEditar.style.display = 'none';
        btnGuardar.style.display = 'flex';
        
        // Animación de entrada para el botón guardar
        btnGuardar.style.animation = 'fadeIn 0.5s forwards';
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});