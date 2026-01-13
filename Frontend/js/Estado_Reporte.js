document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS SIMULADOS ---
    let DATA = [
        { 
            id: 'D-2024-001', fecha: '2024-05-10', dir: 'Av. El Sol 500, Cusco', 
            tipo: 'Accidente de Tránsito', estado: 'Recibido', desc: 'Choque múltiple entre combi y auto particular. Se requiere ambulancia.', 
            lat: -13.5185, lng: -71.9769, clase: 'D', pts: 10,
            denunciante: 'Juan Pérez', placa: 'X1Y-999', prioManual: null
        },
        { 
            id: 'R-2024-045', fecha: '2024-05-11', dir: 'Plaza de Armas, Portal Belén', 
            tipo: 'Obstáculo en la vía', estado: 'En proceso', desc: 'Hay un montón de piedras bloqueando el paso peatonal turístico.', 
            lat: -13.5160, lng: -71.9780, clase: 'R', pts: 3,
            denunciante: 'Anónimo', placa: 'N/A', prioManual: null
        },
        { 
            id: 'D-2024-002', fecha: '2024-05-12', dir: 'Calle Mantas 120', 
            tipo: 'Vehículo Sospechoso', estado: 'Recibido', desc: 'Vehículo negro con lunas polarizadas merodeando hace 2 horas.', 
            lat: -13.5189, lng: -71.9799, clase: 'D', pts: 8,
            denunciante: 'María Rojas', placa: 'ABC-123', prioManual: null
        },
        { 
            id: 'R-2024-046', fecha: '2024-05-12', dir: 'Av. Garcilaso', 
            tipo: 'Mal estacionamiento', estado: 'Solucionado', desc: 'Auto estacionado sobre la acera impidiendo paso de silla de ruedas.', 
            lat: -13.5226, lng: -71.9678, clase: 'R', pts: 5,
            denunciante: 'Anónimo', placa: 'Z9B-001', prioManual: null
        }
    ];

    const $ = (s) => document.querySelector(s);
    const tbody = $('#tabla tbody');
    let selectedIncidencia = null;
    
    // Mapas
    let mapPreview, markerPreview;
    let mapFull, markerFull;

    function calcularPrioridad(item) {
        if (item.prioManual) return item.prioManual;
        let total = item.pts + (item.clase === 'D' ? 2 : 0);
        if (total >= 10) return 'Alta';
        if (total >= 6) return 'Media';
        return 'Baja';
    }

    function renderRows(list) {
        tbody.innerHTML = '';
        list.forEach(item => {
            const prio = calcularPrioridad(item);
            const tr = document.createElement('tr');
            
            const usuarioHTML = item.clase === 'D' 
                ? `<span class="denunciante-name"><i class="fa-solid fa-user-check"></i> ${item.denunciante}</span>`
                : `<span class="anon-tag"><i class="fa-solid fa-user-secret"></i> Anónimo</span>`;

            // Lógica de Placa en la tabla
            const placaHTML = (item.placa && item.placa !== 'N/A') 
                ? `<div class="placa-table">${item.placa}</div>` 
                : '';

            tr.innerHTML = `
                <td><b>${item.id}</b></td>
                <td>${item.fecha}</td>
                <td>${usuarioHTML}</td>
                <td>
                    <b>${item.tipo}</b><br>
                    <small style="color:#888">${item.dir}</small>
                    ${placaHTML}
                </td>
                <td><span class="status-badge st-${item.estado.replace(/\s+/g, '-')}">${item.estado}</span></td>
                <td><span class="prio-badge prio-${prio}">${prio}</span></td>
                <td style="text-align: center;">
                    <button class="btn-ver-detalles">Ver Detalles</button>
                </td>
            `;
            
            tr.addEventListener('click', () => {
                document.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
                tr.classList.add('selected');
                showPreview(item);
            });
            
            tbody.appendChild(tr);
        });
    }

    function showPreview(item) {
        selectedIncidencia = item;
        $('#no-selection').style.display = 'none';
        $('#detailBody').style.display = 'block';
        $('#d-id-badge').textContent = item.id;
        $('#d-fecha').textContent = item.fecha;
        $('#d-tipo-title').textContent = item.tipo;
        $('#d-desc-preview').textContent = item.desc;
        initMapPreview(item.lat, item.lng);
    }

    function initMapPreview(lat, lng) {
        if (!mapPreview) {
            mapPreview = L.map('map-preview').setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapPreview);
            markerPreview = L.marker([lat, lng]).addTo(mapPreview);
        } else {
            mapPreview.setView([lat, lng], 15);
            markerPreview.setLatLng([lat, lng]);
        }
    }

    function initMapFull(lat, lng) {
        setTimeout(() => {
            if (!mapFull) {
                mapFull = L.map('map-full').setView([lat, lng], 16);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapFull);
                markerFull = L.marker([lat, lng]).addTo(mapFull);
            } else {
                mapFull.invalidateSize();
                mapFull.setView([lat, lng], 16);
                markerFull.setLatLng([lat, lng]);
            }
        }, 300);
    }

    const modal = $('#modalFull');
    
    $('#btnFullScreen').addEventListener('click', () => {
        if(!selectedIncidencia) return;
        openModal(selectedIncidencia);
    });

    $('#closeModal').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    function openModal(item) {
        $('#m-titulo').textContent = item.clase === 'D' ? 'Auditoría de Denuncia' : 'Revisión de Reporte';
        $('#m-id').textContent = item.id;
        $('#m-estado').value = item.estado;
        $('#m-prioridad').value = calcularPrioridad(item);
        $('#m-denunciante').textContent = item.denunciante;
        $('#m-placa').textContent = item.placa;
        $('#m-direccion').textContent = item.dir;
        $('#m-descripcion').textContent = item.desc;

        // OCULTAR DNI SI ES ANÓNIMO
        if(item.clase === 'R') {
            $('#m-dni-container').style.display = 'none';
        } else {
            $('#m-dni-container').style.display = 'flex';
        }

        modal.classList.add('active');
        initMapFull(item.lat, item.lng);
    }

    $('#btnGuardarModal').addEventListener('click', () => {
        if (!selectedIncidencia) return;
        const nuevoEstado = $('#m-estado').value;
        const nuevaPrio = $('#m-prioridad').value;
        const idx = DATA.findIndex(d => d.id === selectedIncidencia.id);
        if(idx !== -1) {
            DATA[idx].estado = nuevoEstado;
            if(nuevaPrio !== calcularPrioridad(DATA[idx])) {
                DATA[idx].prioManual = nuevaPrio;
            }
            alert(`Cambios guardados correctamente.`);
            modal.classList.remove('active');
            applyFilters(); 
            showPreview(DATA[idx]);
        }
    });

    function applyFilters() {
        const query = $('#buscar').value.toLowerCase();
        const fEstado = $('#fEstado').value;
        const fClase = $('#fClase').value;

        const filtrados = DATA.filter(i => {
            const matchesSearch = i.id.toLowerCase().includes(query) || 
                                 i.denunciante.toLowerCase().includes(query) || 
                                 i.placa.toLowerCase().includes(query) ||
                                 i.dir.toLowerCase().includes(query);
            const matchesEstado = fEstado === 'TODOS' || i.estado === fEstado;
            const matchesClase = fClase === 'TODOS' || i.clase === fClase;
            return matchesSearch && matchesEstado && matchesClase;
        });
        renderRows(filtrados);
    }

    $('#buscar').addEventListener('input', applyFilters);
    $('#fEstado').addEventListener('change', applyFilters);
    $('#fClase').addEventListener('change', applyFilters);

    applyFilters();
}); 