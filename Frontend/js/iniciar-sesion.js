document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("username").value.trim();
    const contrasena = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await response.json();

      if (!data.ok) {
        openModal("❌", "Error", data.mensaje);
        return;
      }

      // Guardar token y redirección según rol
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario_id', data.usuario_id);
        localStorage.setItem('rol', data.rol);
      }

      if (data.rol === "admin") {
        window.location.href = "panel_admin.html";
      } else {
        window.location.href = "panel.html";
      }

    } catch (error) {
      openModal("❌", "Error", "No se pudo conectar al servidor");
    }
  });
});

// Modal (se queda igual)
function openModal(icon, title, message) {
  document.getElementById("modalIcon").innerText = icon;
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;
  document.getElementById("customAlert").style.display = "flex";
}

function closeModal() {
  document.getElementById("customAlert").style.display = "none";
}
