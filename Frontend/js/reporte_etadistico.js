/**
 * REPORTE ESTADÍSTICO - CUSCO REPORTA
 */

document.addEventListener('DOMContentLoaded', () => {
    initMainChart();
    initDoughnutChart();
    initBarChartDistrict();

    // Exportar PDF Listener
    document.getElementById("downloadPdf")?.addEventListener("click", () => {
        const btn = document.getElementById("downloadPdf");
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando...';
        setTimeout(() => {
            alert("Reporte PDF generado y descargado correctamente.");
            btn.innerHTML = '<i class="fa-solid fa-file-export"></i> Exportar Reporte';
        }, 1500);
    });

    // Logout
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        if (confirm('¿Cerrar sesión administrativa?')) {
            window.location.href = "../index.html";
        }
    });
});

// 1. Gráfico de Tendencia (Líneas)
function initMainChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
            datasets: [{
                label: 'Incidencias 2024',
                data: [120, 150, 180, 140, 210, 250, 230, 280],
                borderColor: '#8b1a1a',
                backgroundColor: 'rgba(139, 26, 26, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { display: false }, beginAtZero: true },
                x: { grid: { display: false } }
            }
        }
    });
}

// 2. Gráfico de Tipos (Doughnut)
function initDoughnutChart() {
    const ctx = document.getElementById('doughnutChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Accidentes', 'Semáforos', 'Vías/Baches', 'Limpieza'],
            datasets: [{
                data: [35, 15, 30, 20],
                backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            }
        }
    });
}

// 3. Gráfico por Distrito (Barras Horizontales)
function initBarChartDistrict() {
    const ctx = document.getElementById('barChartDistrict').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Cusco Centro', 'Wanchaq', 'San Sebastián', 'Santiago', 'San Blas'],
            datasets: [{
                label: 'Cantidad',
                data: [450, 320, 280, 210, 150],
                backgroundColor: '#1e293b',
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { display: false } }
            }
        }
    });
}