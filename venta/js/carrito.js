let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarDelCarrito(titulo) {
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
  console.log(item.img);

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
        <img src="${item.img}" alt="Libro">

        <div class="item-info">
          <h4>${item.titulo}</h4>
          <div class="item-cantidad">Cantidad: ${item.cantidad}</div>
        </div>

        <div class="item-precio">$${subtotal}</div>

        <button onclick="eliminarDelCarrito('${item.titulo}')" class="btn btn-sm btn-danger">
          ✕
        </button>
      </div>
    `;
  });

  totalHTML.textContent = "$" + total;
}

/* formulari */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formCompra");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const titulo = form.dataset.titulo;
      const precio = parseFloat(form.dataset.precio);
      const cantidad = parseInt(document.getElementById("cantidad").value);
      const img = form.dataset.img;
      const confirmacion = form.querySelector('input[type="text"]').value.toUpperCase();

      if (confirmacion !== "SI") {
        alert("❌ Compra cancelada. Escriba SI para confirmar.");
        return;
      }

      const existente = carrito.find(item => item.titulo === titulo);

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({ titulo, precio, cantidad, img });
      }

      guardarCarrito();
      alert("✅ Libro agregado al carrito");
      form.reset();
    });
  }

  renderCarrito();
});
