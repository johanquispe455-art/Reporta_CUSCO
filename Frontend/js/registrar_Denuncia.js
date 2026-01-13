// Declaramos variables fuera para que sean accesibles desde cualquier función
let map;
let marker;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Mapa en Cusco
    map = L.map('mapContainer').setView([-13.5226, -71.9673], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Lógica para poner marcador al hacer clic
    map.on('click', function(e) {
        if (marker) map.removeLayer(marker);
        marker = L.marker(e.latlng).addTo(map);
        console.log("Ubicación seleccionada:", e.latlng);
    });

    // Cargar tipos desde backend para el select
    (async () => {
        try {
            const res = await fetch('http://localhost:3000/api/incidencias/tipos');
            const data = await res.json();
            if (data.ok && Array.isArray(data.tipos)) {
                const sel = document.getElementById('tipo_incidente');
                sel.innerHTML = '';
                data.tipos.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = `${t.id}|${t.nombre}|${t.puntos}`;
                    opt.textContent = t.nombre;
                    sel.appendChild(opt);
                });
                const otroOpt = document.createElement('option');
                otroOpt.value = 'otro';
                otroOpt.textContent = 'Otro (Especificar)';
                sel.appendChild(otroOpt);
            }
        } catch (err) {
            console.error('No se pudieron cargar tipos:', err);
        }
    })();

    // 2. Lógica Modal Datos del Infractor
    const btnDenunciado = document.getElementById('btnDenunciado');
    const modalDenunciado = document.getElementById('modalDenunciado');
    const closeDenunciado = document.getElementById('closeDenunciado');
    const saveDenunciado = document.getElementById('saveDenunciado');

    if (btnDenunciado) {
        btnDenunciado.onclick = () => modalDenunciado.style.display = 'block';
        saveDenunciado.onclick = () => modalDenunciado.style.display = 'none';
        closeDenunciado.onclick = () => modalDenunciado.style.display = 'none';
        
        window.onclick = (e) => {
            if (e.target == modalDenunciado) modalDenunciado.style.display = 'none';
        };
    }

    // 3. Envío del Formulario
    const form = document.getElementById('formDenuncia');
    const modalExito = document.getElementById('modalExito');
    const idDisplay = document.getElementById('idGenerado');

    form.onsubmit = function(e) {
        e.preventDefault();

        // Validación: ¿Marcó el mapa?
        if (!marker) {
            alert("Por favor, seleccione la ubicación exacta en el mapa antes de enviar.");
            return;
        }

        // Preparar datos para enviar al backend
        const fecha_hora = document.getElementById('fecha_hora').value || new Date().toISOString();
        const prioridad = document.getElementById('prioridad').value || 'media';
        const tipo_incidente_raw = document.getElementById('tipo_incidente').value || '';
        const otro = document.getElementById('otro_incidente').value || null;
        // tipo_incidente_raw puede ser "<id>|<nombre>|<puntos>"
        let tipo_incidente_id = null;
        if (tipo_incidente_raw) tipo_incidente_id = parseInt(tipo_incidente_raw.split('|')[0], 10);
        const descripcion = document.getElementById('hechos').value.trim();
        const placa = document.getElementById('placa').value.trim() || null;
        const pos = marker.getLatLng();

        const payload = {
            descripcion: descripcion,
            fecha: fecha_hora,
            direccion: `Coordenadas: ${pos.lat.toFixed(6)},${pos.lng.toFixed(6)}`,
            latitud: pos.lat,
            longitud: pos.lng,
            tipo_incidente_id: tipo_incidente_id || 1,
            estado: 'recibido',
            prioridad: prioridad,
            placa_vehiculo: placa,
            denunciante_id: 'C000001', // temporal: reemplazar por sesión real
            denunciado_nombre: document.getElementById('nombre_denunciado')?.value || null,
            denunciado_dni: null
        };

        (async () => {
            try {
                const headers = { 'Content-Type': 'application/json' };
                const token = localStorage.getItem('token');
                if (token) headers['Authorization'] = 'Bearer ' + token;
                const res = await fetch('http://localhost:3000/api/denuncias', {
                    method: 'POST', headers, body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (!data.ok) return alert(data.mensaje || 'Error al enviar denuncia');

                // Mostrar modal de éxito con id devuelto
                const codigoFinal = data.incidencia?.id || ('CR-' + Date.now());
                idDisplay.textContent = codigoFinal;
                modalExito.style.display = 'block';
            } catch (err) {
                console.error(err);
                alert('No se pudo conectar al servidor');
            }
        })();
    };
});

/**
 * FUNCIÓN PARA CERRAR Y REINICIAR TODO
 */
function cerrarExito() {
    // 1. Ocultar el modal de éxito
    document.getElementById('modalExito').style.display = 'none';

    // 2. Reiniciar los campos del formulario (texto, selects, etc.)
    const form = document.getElementById('formDenuncia');
    form.reset();

    // 3. Limpiar elementos manuales
    // Ocultar campo "especificar" si quedó abierto
    document.getElementById('otro_incidente').style.display = 'none';

    // Quitar el marcador del mapa
    if (marker) {
        map.removeLayer(marker);
        marker = null; // Resetear la variable para la validación del próximo envío
    }

    // 4. Volver al inicio de la página con efecto suave
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log("Formulario reiniciado completamente.");
}

/**
 * Función para mostrar/ocultar el input de "Otro"
 */
function checkOtro(select) {
    const otroInput = document.getElementById('otro_incidente');
    otroInput.style.display = (select.value === 'otro') ? 'block' : 'none';
}