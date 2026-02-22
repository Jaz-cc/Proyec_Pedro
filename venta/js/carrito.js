let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
const boton = document.getElementById("btnAgregar");
if (boton) {
  boton.classList.add("animar");
  setTimeout(() => {
    boton.classList.remove("animar");
  }, 400);
}

function eliminarDelCarrito(titulo) {
  const item = carrito.find(i => i.titulo === titulo);
  if (item) {
    const libro = libros.find(l => l.titulo === titulo);
    if (libro) {
      libro.stock += item.cantidad;
      guardarLibros();
    }
  }
  carrito = carrito.filter(item => item.titulo !== titulo);
  guardarCarrito();
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
}


function renderCarrito() {
  
  const contenedor = document.getElementById("listaCarrito");
  const totalHTML = document.getElementById("totalCarrito");

  if (!contenedor || !totalHTML) return;

  contenedor.innerHTML = "";

  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p> Tu carrito está vacío</p>';
    totalHTML.textContent = "$0";
    return;
  }

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    contenedor.innerHTML += `
      <div class="item-carrito">
        <img src="${item.imagen}" alt="Libro">

        <div class="item-info">
          <h4>${item.titulo}</h4>
          <div class="item-cantidad">
            <button onclick="cambiarCantidad('${item.titulo}', -1)">−</button>
            <span>${item.cantidad}</span>
            <button onclick="cambiarCantidad('${item.titulo}', 1)">+</button>
          </div>
        </div>

        <div class="item-precio">$${subtotal}</div>

        <button onclick="eliminarDelCarrito('${item.titulo}')" class="btn btn-link text-danger fs-5">
        <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    `;
  });

  totalHTML.textContent = "$" + total;
}

function cambiarCantidad(titulo, cambio) {

  const item = carrito.find(i => i.titulo === titulo);
  const libro = libros.find(l => l.titulo === titulo);

  if (!item || !libro) return;

  if (cambio === 1 && libro.stock > 0) {
    item.cantidad++;
    libro.stock--;
  }

  if (cambio === -1 && item.cantidad > 1) {
    item.cantidad--;
    libro.stock++;
  }

  guardarCarrito();
  guardarLibros();
  renderCarrito();
}

function realizarCompra() {

  if (carrito.length === 0) return;

  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();
  const tarjeta = document.getElementById("tarjetaCliente").value.trim();
  const cvv = document.getElementById("cvvCliente").value.trim();

  let valido = true;

document.getElementById("errorNombre").innerText = "";
document.getElementById("errorDireccion").innerText = "";
document.getElementById("errorTarjeta").innerText = "";
document.getElementById("errorCvv").innerText = "";

if (nombre.length < 5) {
  document.getElementById("errorNombre").innerText =
    "El nombre debe tener al menos 5 caracteres.";
  valido = false;
}

if (direccion.length < 10) {
  document.getElementById("errorDireccion").innerText =
    "La dirección debe ser más completa.";
  valido = false;
}

if (!/^\d{16}$/.test(tarjeta)) {
  document.getElementById("errorTarjeta").innerText =
    "La tarjeta debe tener 16 dígitos.";
  valido = false;
}

if (!/^\d{3}$/.test(cvv)) {
  document.getElementById("errorCvv").innerText =
    "El CVV debe tener 3 dígitos.";
  valido = false;
}

if (!valido) return;

  let total = 0;
  carrito.forEach(item => {
    total += item.precio * item.cantidad;
  });

  const numeroOrden = "ORD-" + Date.now();
  // COPIA ANTES DE VACIAR
  const productosComprados = [...carrito];
  guardarHistorial(numeroOrden, total);
  // ticket con copia
  generarTicket(nombre, direccion, numeroOrden, total, productosComprados);
  carrito = [];
  guardarCarrito();
  renderCarrito();

  document.getElementById("ordenGenerada").innerText =
    "Número de orden: " + numeroOrden;

  document.getElementById("pantallaExito").style.display = "flex";
}
function generarTicket(nombre, direccion, orden, total, productos) {

  let ticket = "===== TICKET DE COMPRA =====\n\n";
  ticket += "Orden: " + orden + "\n";
  ticket += "Cliente: " + nombre + "\n";
  ticket += "Dirección: " + direccion + "\n\n";

  productos.forEach(item => {
    ticket += item.titulo + " x" + item.cantidad +
              " - $" + (item.precio * item.cantidad) + "\n";
  });

  ticket += "\nTOTAL: $" + total;
  ticket += "\n============================";
  // archivo descargable
  const blob = new Blob([ticket], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ticket_" + orden + ".txt";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function renderHistorial() {

  const contenedor = document.getElementById("listaHistorial");
  if (!contenedor) return;

  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  if (historial.length === 0) {
    contenedor.innerHTML = "<p>No hay compras realizadas aún.</p>";
    return;
  }

  contenedor.innerHTML = "";
  historial.forEach(compra => {
    let productosHTML = "";
    compra.productos.forEach(prod => {
      productosHTML += `
        <li>${prod.titulo} x${prod.cantidad} - $${prod.precio * prod.cantidad}</li>
      `;
    });

    contenedor.innerHTML += `
      <div class="card mb-4 p-3 shadow-sm">
        <h5>Orden: ${compra.orden}</h5>
        <p><strong>Fecha:</strong> ${compra.fecha}</p>
        <ul>${productosHTML}</ul>
        <h6>Total: $${compra.total}</h6>
      </div>
    `;
  });
}

function guardarHistorial(orden, total) {

  let historial = JSON.parse(localStorage.getItem("historial")) || [];

  historial.push({
    orden: orden,
    fecha: new Date().toLocaleString(),
    total: total,
    productos: JSON.parse(JSON.stringify(carrito))
  });

  localStorage.setItem("historial", JSON.stringify(historial));
}

function cerrarExito() {
  document.getElementById("pantallaExito").style.display = "none";
  window.location.href = "index.html";
}

/* formulari */

document.addEventListener("DOMContentLoaded", () => {

  renderCarrito();
  renderHistorial();

  const form = document.getElementById("formCompra");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const titulo = form.dataset.titulo;
      const precio = parseFloat(form.dataset.precio);
      const cantidad = parseInt(document.getElementById("cantidad").value);
      const imagen = form.dataset.imagen;
      const confirmacion = form.querySelector('input[type="text"]').value.toUpperCase();

      if (confirmacion !== "SI") return;

      const libro = libros.find(l => l.titulo === titulo);
      if (!libro) return;
      if (cantidad > libro.stock) return;

      libro.stock -= cantidad;
      guardarLibros();

      const existente = carrito.find(item => item.titulo === titulo);

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({ titulo, precio, cantidad, imagen });
      }

      guardarCarrito();
      form.reset();
    });
  }

});
