document.addEventListener('DOMContentLoaded', () => {
    // Manejo de marcar como leída
    const readButtons = document.querySelectorAll('.btn-read');
    
    readButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.notif-card');
            
            // Animación de desvanecimiento para simular lectura
            card.classList.remove('unread');
            card.style.borderLeftColor = "#e2e8f0";
            
            // Reemplazar botones por ticket de leída
            const actions = this.closest('.notif-actions');
            actions.innerHTML = '<span class="read-receipt">✓ Leída</span>';
            
            // Opcional: Notificación visual
            console.log("Notificación marcada como leída");
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            window.location.href = 'index.html';
        }
    });
});