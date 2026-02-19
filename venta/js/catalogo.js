document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("listaLibros");
  if (!contenedor || typeof libros === "undefined") return;

  contenedor.innerHTML = "";

  libros.forEach(libro => {
    contenedor.innerHTML += `
      <div class="libro">
        <h3>${libro.titulo}</h3>
        <p><strong>Autor:</strong> ${libro.autor}</p>
        <p><strong>Precio:</strong> $${libro.precio}</p>
        <button onclick="agregarAlCarrito('${libro.titulo}', ${libro.precio})">
          Agregar al carrito
        </button>
      </div>
    `;
  });
});
