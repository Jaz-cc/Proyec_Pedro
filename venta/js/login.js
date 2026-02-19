function login() {
        const usuario = document.getElementById("usuario").value;
        const password = document.getElementById("password").value;
        const mensaje = document.getElementById("mensaje");

        // Credenciales "quemadas" (solo para ejemplo)
        const usuarioCorrecto = "admin";
        const passwordCorrecto = "1234";

        if (usuario === usuarioCorrecto && password === passwordCorrecto) {
            mensaje.textContent = "Acceso concedido";
            mensaje.className = "success";
            // Redireccionar
            window.location.href = "index.html";

        } else {
            mensaje.textContent = "Usuario o contraseña incorrectos";
            mensaje.className = "error";
        }
    }