document.addEventListener('DOMContentLoaded', () => {
    // Datos actualizados con campos opcionales (placa, denunciado)
    const DATA = [
        { 
            id: '1052', fecha: '2024-04-20', clase: 'Tránsito', dir: 'Av. El Sol 500', 
            estado: 'REPORTE', desc: 'Vehículo bloqueando rampa de acceso para discapacitados.', 
            foto: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80', 
            lat: -13.5185, lng: -71.9769, 
            placa: 'X1V-882', denunciado: 'Empresa TransCusco' 
        },
        { 
            id: '1048', fecha: '2024-04-18', clase: 'Infraestructura', dir: 'Calle Pumacurco 210', 
            estado: 'PROCESO', desc: 'Semáforo peatonal con cables expuestos.', 
            foto: 'https://images.unsplash.com/photo-1545147986-a9d6f210df77?auto=format&fit=crop&w=800&q=80', 
            lat: -13.5140, lng: -71.9790 
        },
        { 
            id: '1034', fecha: '2024-04-15', clase: 'Seguridad', dir: 'Jirón Santiago 320', 
            estado: 'SOLUCIONADO', desc: 'Obstrucción de vía por escombros de construcción.', 
            foto: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', 
            lat: -13.5210, lng: -71.9740,
            denunciado: 'Constructora Los Andes'
        },
        { 
            id: '1027', fecha: '2024-04-13', clase: 'Tránsito', dir: 'Calle Mantas 120', 
            estado: 'SOLUCIONADO', desc: 'Camión de carga descargando en horario no permitido.', 
            foto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80', 
            lat: -13.5170, lng: -71.9800,
            placa: 'V5C-990'
        }
    ];

    const tbody = document.getElementById('tbody');
    const inputBuscar = document.getElementById('buscar');
    const fEstado = document.getElementById('fEstado');
    const modal = document.getElementById('modalDetalle');
    
    let map, marker;

    function renderRows(filtrados) {
        tbody.innerHTML = '';
        filtrados.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${item.id}</strong></td>
                <td>${item.fecha}</td>
                <td>${item.clase}</td>
                <td>${item.dir}</td>
                <td><span class="status-badge status-${item.estado.toLowerCase()}">${item.estado}</span></td>
                <td><button class="btn-ver" onclick="verDetalle('${item.id}')"><i class="fa-solid fa-eye"></i> Ver</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function initMap(lat, lng) {
        if (!map) {
            map = L.map('map-detalle').setView([lat, lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            marker = L.marker([lat, lng]).addTo(map);
        } else {
            map.setView([lat, lng], 16);
            marker.setLatLng([lat, lng]);
            setTimeout(() => { map.invalidateSize(); }, 200);
        }
    }

    window.verDetalle = (id) => {
        const item = DATA.find(d => d.id === id);
        if (item) {
            document.getElementById('det-id').textContent = item.id;
            document.getElementById('det-fecha').textContent = item.fecha;
            document.getElementById('det-clase').textContent = item.clase;
            document.getElementById('det-dir').textContent = item.dir;
            document.getElementById('det-desc').textContent = item.desc;
            document.getElementById('det-foto').src = item.foto;
            
            // Lógica para campos opcionales: Placa
            const wrapperPlaca = document.getElementById('wrapper-placa');
            if(item.placa) {
                document.getElementById('det-placa').textContent = item.placa;
                wrapperPlaca.style.display = 'block';
            } else {
                wrapperPlaca.style.display = 'none';
            }

            // Lógica para campos opcionales: Denunciado
            const wrapperDenunciado = document.getElementById('wrapper-denunciado');
            if(item.denunciado) {
                document.getElementById('det-denunciado').textContent = item.denunciado;
                wrapperDenunciado.style.display = 'block';
            } else {
                wrapperDenunciado.style.display = 'none';
            }
            
            const badge = document.getElementById('det-estado');
            badge.textContent = item.estado;
            badge.className = `status-badge status-${item.estado.toLowerCase()}`;
            
            modal.classList.add('active');
            initMap(item.lat, item.lng);
        }
    };

    document.querySelector('.close-modal').addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });

    function applyFilters() {
        const query = inputBuscar.value.toLowerCase();
        const estado = fEstado.value;
        const filtrados = DATA.filter(i => {
            const matchesSearch = i.id.toLowerCase().includes(query) || i.dir.toLowerCase().includes(query);
            const matchesEstado = estado === 'TODOS' || i.estado === estado;
            return matchesSearch && matchesEstado;
        });
        renderRows(filtrados);
    }

    inputBuscar.addEventListener('input', applyFilters);
    fEstado.addEventListener('change', applyFilters);

    document.getElementById("logoutBtn").addEventListener("click", () => {
        if (confirm('¿Cerrar sesión?')) window.location.href = "./index.html";
    });

    renderRows(DATA);
});