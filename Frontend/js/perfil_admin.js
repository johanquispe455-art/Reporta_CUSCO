document.addEventListener('DOMContentLoaded', () => {
    const btnEditar = document.getElementById('btnEditar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnGuardar = document.getElementById('btnGuardar');
    const formPerfil = document.getElementById('formPerfil');
    const displayNombre = document.getElementById('displayNombre');
    
    // CAMBIO: Ahora seleccionamos TODOS los inputs dentro del formulario
    const inputsEditables = formPerfil.querySelectorAll('input');

    // Activar edición
    btnEditar.addEventListener('click', () => {
        inputsEditables.forEach(input => {
            input.disabled = false; // Habilita todos
            input.style.borderColor = '#8b1a1a';
        });
        
        btnEditar.style.display = 'none';
        btnCancelar.style.display = 'flex';
        btnGuardar.style.display = 'flex';
        
        inputsEditables[0].focus();
    });

    // Cancelar edición
    btnCancelar.addEventListener('click', () => {
        bloquearCampos();
        // Opcional: Recargar la página para deshacer cambios no guardados
        // location.reload(); 
    });

    // Guardar cambios
    formPerfil.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Actualizar el nombre en la cabecera de la tarjeta
        displayNombre.textContent = document.getElementById('nombre').value;
        
        alert('Perfil actualizado con éxito.');
        bloquearCampos();
    });

    function bloquearCampos() {
        inputsEditables.forEach(input => {
            input.disabled = true;
            input.style.borderColor = '#eee';
        });
        
        btnEditar.style.display = 'flex';
        btnCancelar.style.display = 'none';
        btnGuardar.style.display = 'none';
    }
});