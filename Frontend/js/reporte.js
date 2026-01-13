document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INICIALIZAR FECHA Y HORA ACTUAL
    const fechaInput = document.getElementById('fechaSuceso');
    const horaInput = document.getElementById('horaSuceso');
    const ahora = new Date();
    
    fechaInput.value = ahora.toISOString().split('T')[0];
    horaInput.value = ahora.getHours().toString().padStart(2, '0') + ":" + 
                      ahora.getMinutes().toString().padStart(2, '0');

    // 2. INICIALIZAR MAPA (Leaflet)
    const map = L.map("map").setView([-13.5171, -71.9784], 14);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Marcador arrastrable
    let marker = L.marker([-13.5171, -71.9784], { draggable: true }).addTo(map);

    // Cargar tipos desde backend y poblar select
    (async () => {
        try {
            const res = await fetch('http://localhost:3000/api/incidencias/tipos');
            const data = await res.json();
            if (data.ok && Array.isArray(data.tipos)) {
                const sel = document.getElementById('tipoIncidencia');
                sel.innerHTML = '<option value="">Seleccione el tipo...</option>';
                data.tipos.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = `${t.id}|${t.nombre}|${t.puntos}`;
                    opt.textContent = `${t.nombre} (${t.puntos} pts)`;
                    sel.appendChild(opt);
                });
            }
        } catch (err) {
            console.error('No se pudieron cargar tipos:', err);
        }
    })();

    function actualizarCamposUbicacion(lat, lng) {
        document.getElementById('coords').value = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        document.getElementById('direccion').value = `Ubicación marcada en mapa (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }

    // Actualizar al hacer clic
    map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        actualizarCamposUbicacion(e.latlng.lat, e.latlng.lng);
    });

    // Actualizar al arrastrar el pin
    marker.on('dragend', () => {
        const pos = marker.getLatLng();
        actualizarCamposUbicacion(pos.lat, pos.lng);
    });

    // Botón GPS
    document.getElementById('btnGps').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                map.setView([latitude, longitude], 17);
                marker.setLatLng([latitude, longitude]);
                actualizarCamposUbicacion(latitude, longitude);
            }, () => alert("No se pudo acceder a tu ubicación."));
        }
    });

    // 3. LÓGICA DE ENVÍO Y PRIORIDAD
    const btnEnviar = document.getElementById('btnEnviar');
    btnEnviar.addEventListener('click', () => {
        const tipoSelect = document.getElementById('tipoIncidencia').value;
        const placa = document.getElementById('placa').value.trim() || "N/A";
        const fecha = fechaInput.value;
        const hora = horaInput.value;
        const coords = document.getElementById('coords').value;
        const desc = document.getElementById('descripcion').value.trim();

        if (!tipoSelect || !coords || !desc) {
            alert("Por favor completa los campos obligatorios (*) y marca la ubicación en el mapa.");
            return;
        }

        // Calcular Prioridad e ID
        // tipoSelect tiene formato "<id>|<nombre>|<puntos>"
        const parts = tipoSelect.split('|');
        const tipo_id = parseInt(parts[0], 10);
        const nombreTipo = parts[1];
        const pts = parseInt(parts[2], 10);
        let prioridad = pts >= 10 ? "alta" : (pts >= 5 ? "media" : "baja");

        // Preparar datos para backend
        const [lat, lng] = coords.split(',').map(s => parseFloat(s));
        const payload = {
            descripcion: desc,
            fecha: new Date().toISOString(),
            direccion: document.getElementById('direccion').value || null,
            latitud: lat || null,
            longitud: lng || null,
            tipo_incidente_id: 1, // placeholder - ajustar si cargas tipos desde backend
            estado: 'recibido',
            prioridad: prioridad,
            placa_vehiculo: placa || null,
            es_anonimo: true
        };

        // Enviar al backend
        (async () => {
            try {
                const headers = { 'Content-Type': 'application/json' };
                // no auth needed for anonymous reports
                const res = await fetch('http://localhost:3000/api/reportes', {
                    method: 'POST', headers, body: JSON.stringify({ ...payload, tipo_incidente_id: tipo_id })
                });
                const data = await res.json();
                if (!data.ok) return alert(data.mensaje || 'Error al enviar reporte');
                const reportID = data.incidencia?.id || ('R-' + Math.floor(Math.random() * 90000 + 10000));

                // Mostrar en la tarjeta de detalle
                document.getElementById('d-id').textContent = "Reporte ID: " + reportID;
                document.getElementById('d-prioridad').textContent = `${prioridad.toUpperCase()} (${pts} pts)`;
                document.getElementById('d-prioridad').className = `prio-${prioridad}`;
                document.getElementById('d-placa').textContent = placa;
                document.getElementById('d-fecha-resumen').textContent = `${fecha} / ${hora}`;
                document.getElementById('d-coords').textContent = coords;
                document.getElementById('d-descripcion').textContent = desc;

                const detalleSec = document.getElementById('detalle');
                detalleSec.style.display = 'block';
                detalleSec.scrollIntoView({ behavior: 'smooth' });
            } catch (err) {
                console.error(err);
                alert('No se pudo conectar al servidor');
            }
        })();
        
    });
});