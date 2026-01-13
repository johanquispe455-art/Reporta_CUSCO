/**
 * LÓGICA DEL MAPA DE INCIDENCIAS - ADMIN
 * Simulación de datos alineados con la BD de Cusco Reporta
 */

const INCIDENTES = [
    { id: '1052', fecha: '2024-04-20 14:30', estado: 'Recibido', tipo: 'Accidente de Tránsito', dir: 'Av. El Sol 500', lat: -13.5185, lng: -71.9769, prioridad: 'Alta', reportadoPor: 'Juan Perez' },
    { id: '1048', fecha: '2024-04-18 09:15', estado: 'En proceso', tipo: 'Semáforo Malogrado', dir: 'Calle Pumacurco 210', lat: -13.5176, lng: -71.9740, prioridad: 'Media', reportadoPor: 'Maria Soto' },
    { id: '1034', fecha: '2024-04-15 18:00', estado: 'Solucionado', tipo: 'Obstrucción de Vía', dir: 'Jirón Santiago 320', lat: -13.5240, lng: -71.9795, prioridad: 'Baja', reportadoPor: 'Anonimo' },
    { id: '1013', fecha: '2024-04-10 11:20', estado: 'En proceso', tipo: 'Señal de Tránsito Caída', dir: 'Av. Garcilaso 1204', lat: -13.5226, lng: -71.9678, prioridad: 'Media', reportadoPor: 'Carlos Ruiz' },
    { id: '1001', fecha: '2024-04-05 07:45', estado: 'Solucionado', tipo: 'Bache Peligroso', dir: 'Urb. Ttio D-12', lat: -13.5270, lng: -71.9487, prioridad: 'Alta', reportadoPor: 'Vecinos Ttio' }
];

let map, markersLayer;

// Colores para los marcadores según estado
const colorByEstado = (e) => {
    if(e === 'Recibido') return '#ef4444';
    if(e === 'En proceso') return '#f59e0b';
    return '#10b981';
};

const getChipHTML = (e) => {
    const cls = e === 'Recibido' ? 'red' : e === 'En proceso' ? 'yellow' : 'green';
    return `<span class="chip ${cls}">${e}</span>`;
};

function initMap() {
    // Coordenadas centrales de Cusco
    map = L.map('map').setView([-13.520, -71.970], 14);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: 'Cusco Reporta Admin'
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
}

function renderMarkers(list) {
    markersLayer.clearLayers();
    const bounds = [];

    list.forEach(r => {
        const marker = L.circleMarker([r.lat, r.lng], {
            radius: 9,
            fillColor: colorByEstado(r.estado),
            color: '#fff',
            weight: 2,
            fillOpacity: 0.9
        });

        marker.bindPopup(`<strong>Incidencia #${r.id}</strong><br>${r.tipo}`);
        marker.on('click', () => showDetail(r));
        marker.addTo(markersLayer);
        bounds.push([r.lat, r.lng]);
    });

    if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] });
}

// MUESTRA DETALLES Y HACE EL BOTÓN FUNCIONAL
function showDetail(r) {
    const container = document.getElementById('detalle');
    container.innerHTML = `
        <div class="det-row"><b>ID Reporte</b><span>#${r.id}</span></div>
        <div class="det-row"><b>Tipo</b><span>${r.tipo}</span></div>
        <div class="det-row"><b>Estado</b><span>${getChipHTML(r.estado)}</span></div>
        <div class="det-row"><b>Prioridad</b><span>${r.prioridad}</span></div>
        <div class="det-row"><b>Ubicación</b><span>${r.dir}</span></div>
        <div class="det-row"><b>Fecha</b><span>${r.fecha}</span></div>
        
        <a href="Estado_Reporte.html?id=${r.id}" class="btn btn-manage">
            <i class="fa-solid fa-pen-to-square"></i> Gestionar Incidencia
        </a>
    `;
}

function updateStats(list) {
    document.getElementById('c-reci').textContent = list.filter(x => x.estado === 'Recibido').length;
    document.getElementById('c-proc').textContent = list.filter(x => x.estado === 'En proceso').length;
    document.getElementById('c-solu').textContent = list.filter(x => x.estado === 'Solucionado').length;
}

function handleFilter() {
    const estado = document.getElementById('fEstado').value;
    const filtered = estado === 'TODOS' ? INCIDENTES : INCIDENTES.filter(x => x.estado === estado);
    
    renderMarkers(filtered);
    updateStats(filtered);
    
    if(filtered.length === 0) {
        document.getElementById('detalle').innerHTML = '<div class="empty-state">No hay resultados.</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    
    document.getElementById('btnAplicar').addEventListener('click', handleFilter);
    document.getElementById('fEstado').addEventListener('change', handleFilter);
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if(confirm('¿Desea cerrar sesión?')) window.location.href = 'index.html';
    });

    handleFilter(); 
});