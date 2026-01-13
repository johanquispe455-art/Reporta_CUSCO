document.addEventListener('DOMContentLoaded', () => {
    const dniInput = document.getElementById('dni');
    const nombreInput = document.getElementById('nombre');
    const loadingIcon = document.getElementById('loading-dni');

    // 1. Limitar el input a 8 dígitos
    dniInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (e.target.value.length === 8) {
            consultarDNI(e.target.value);
        }
    });

    async function consultarDNI(dni) {
        if (loadingIcon) loadingIcon.style.display = 'block';
        nombreInput.placeholder = "Consultando...";
        nombreInput.value = "";

        try {
            // USAMOS UN PROXY PARA EVITAR EL ERROR DE SEGURIDAD (CORS)
            // Esta API es pública y no pide Token
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.peruonline.top/api/dni/${dni}`)}`);
            
            if (!response.ok) throw new Error("Error en el servidor");

            const dataJson = await response.json();
            const res = JSON.parse(dataJson.contents);

            if (res.success && res.data) {
                const persona = res.data;
                // Juntamos los datos que nos da la API
                const nombreCompleto = `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`;
                
                nombreInput.value = nombreCompleto.toUpperCase();
                nombreInput.readOnly = true; // Bloqueamos para que sea oficial
                nombreInput.style.backgroundColor = "#e9ecef";
            } else {
                throw new Error("DNI no encontrado");
            }
        } catch (error) {
            console.error("Fallo la consulta:", error);
            // Si falla, permitimos que el usuario lo escriba a mano
            nombreInput.readOnly = false;
            nombreInput.placeholder = "No se pudo autocompletar, ingresa manualmente";
            nombreInput.style.backgroundColor = "#fff";
        } finally {
            if (loadingIcon) loadingIcon.style.display = 'none';
        }
    }
});

// Envío del formulario de registro
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dni = document.getElementById('dni').value.trim();
        const nombre_completo = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const direccion = document.getElementById('direccion').value.trim();

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni, nombre_completo, correo, telefono, direccion, contrasena: 'temporal123' })
            });
            const data = await res.json();
            if (!data.ok) {
                alert(data.mensaje || 'Error al registrar');
                return;
            }
            document.getElementById('ok').style.display = 'block';
            setTimeout(() => window.location.href = 'iniciar-sesion.html', 1200);
        } catch (err) {
            console.error(err);
            alert('No se pudo conectar al servidor');
        }
    });
});