/**
 * Lógica de Gestión de Usuarios - Cusco Reporta
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const btnMostrarForm = document.getElementById('btnMostrarForm');
    const btnCerrarForm = document.getElementById('btnCerrarForm');
    const containerFormulario = document.getElementById('containerFormulario');
    const formUsuario = document.getElementById('formCrearUsuario');
    const tablaUsuarios = document.getElementById('tbodyUsuarios');
    const buscador = document.getElementById('buscadorUsuario');

    // Control de visibilidad del formulario
    const togglerFormulario = (show) => {
        containerFormulario.style.display = show ? 'block' : 'none';
        btnMostrarForm.style.display = show ? 'none' : 'block';
    };

    btnMostrarForm.addEventListener('click', () => togglerFormulario(true));
    btnCerrarForm.addEventListener('click', () => togglerFormulario(false));

    // Lógica de Búsqueda en tiempo real
    buscador.addEventListener('keyup', () => {
        const query = buscador.value.toLowerCase();
        const filas = tablaUsuarios.querySelectorAll('tr');

        filas.forEach(fila => {
            const contenidoFila = fila.textContent.toLowerCase();
            fila.style.display = contenidoFila.includes(query) ? '' : 'none';
        });
    });

    // Guardar nuevo usuario
    formUsuario.addEventListener('submit', (e) => {
        e.preventDefault();

        const usuario = {
            dni: document.getElementById('dni').value,
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            rol: document.getElementById('rol').value
        };

        agregarFila(usuario);
        
        formUsuario.reset();
        togglerFormulario(false);
    });

    function agregarFila(user) {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${user.dni}</td>
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
            <td><span class="badge badge-${user.rol.toLowerCase()}">${user.rol}</span></td>
            <td>
                <button class="btn-eliminar" style="color: #8b1a1a; border: none; background: none; cursor: pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        // Evento para eliminar la fila
        tr.querySelector('.btn-eliminar').addEventListener('click', () => {
            if (confirm(`¿Estás seguro de eliminar al usuario con DNI ${user.dni}?`)) {
                tr.remove();
            }
        });

        tablaUsuarios.appendChild(tr);
    }
});