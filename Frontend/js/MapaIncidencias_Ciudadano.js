const map = L.map("map", { zoomControl: false }).setView([-13.5171, -71.9784], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

L.control.zoom({ position: 'topright' }).addTo(map);

// Datos de incidencias (ahora con propiedad 'foto')
const incidencias = [
  { 
    estado: "RECIBIDO", coords: [-13.515, -71.975], categoria: "Accidente", desc: "Choque en Av. de la Cultura.",
    foto: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick/" 
  },
  { 
    estado: "PROCESO", coords: [-13.517, -71.982], categoria: "Bache", desc: "Reparación de vía iniciada.",
    foto: "https://via.placeholder.com/300x200?text=Bache+Reparacion" 
  },
  { 
    estado: "SOLUCIONADO", coords: [-13.519, -71.97], categoria: "Seguridad", desc: "Incendio sofocado totalmente.",
    foto: "https://via.placeholder.com/300x200?text=Incendio+Controlado" 
  },
  { 
    estado: "RECIBIDO", coords: [-13.522, -71.968], categoria: "Infraestructura", desc: "Semáforo malogrado reportado.",
    foto: "https://via.placeholder.com/300x200?text=Semaforo" 
  },
  { 
    estado: "PROCESO", coords: [-13.525, -71.972], categoria: "Tránsito", desc: "Intervención de grúa en curso.",
    foto: "" // Caso sin foto
  },
  { 
    estado: "SOLUCIONADO", coords: [-13.510, -71.980], categoria: "Limpieza", desc: "Escombros retirados de la vía.",
    foto: "https://via.placeholder.com/300x200?text=Vía+Limpia"
  },
];

const colores = {
  RECIBIDO: "#ef4444",
  PROCESO: "#f59e0b",
  SOLUCIONADO: "#10b981"
};

let marcadores = [];

function crearIcono(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

function mostrarMarcadores(filtro) {
  marcadores.forEach(m => map.removeLayer(m));
  marcadores = [];

  const filtradas = incidencias.filter(i => filtro === "todos" || i.estado === filtro);
  
  filtradas.forEach(i => {
    // Solo mostramos la etiqueta img si existe una URL de foto
    const imgHtml = i.foto ? `<img src="${i.foto}" class="popup-img" alt="Evidencia">` : '';

    const marker = L.marker(i.coords, { icon: crearIcono(colores[i.estado]) })
      .bindPopup(`
        <div class="custom-popup">
          <h3>${i.categoria}</h3>
          ${imgHtml}
          <p>${i.desc}</p>
          <span class="status" style="background: ${colores[i.estado]}15; color: ${colores[i.estado]}">${i.estado}</span>
        </div>
      `)
      .addTo(map);
    marcadores.push(marker);
  });

  actualizarEstadisticas();
}

function actualizarEstadisticas() {
  document.getElementById("total-count").textContent = incidencias.length;
  document.getElementById("recibido-count").textContent = incidencias.filter(i => i.estado === "RECIBIDO").length;
  document.getElementById("proceso-count").textContent = incidencias.filter(i => i.estado === "PROCESO").length;
  document.getElementById("solucionado-count").textContent = incidencias.filter(i => i.estado === "SOLUCIONADO").length;
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarMarcadores('todos');
  document.getElementById('tipo').addEventListener('change', (e) => mostrarMarcadores(e.target.value));
  
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if(confirm("¿Cerrar sesión?")) window.location.href = 'index.html';
  });
});