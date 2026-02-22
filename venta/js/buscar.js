function buscarLibro() {
  const texto = document.getElementById("busqueda").value.toLowerCase().trim();
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "";

  if (texto === "") {
    resultado.innerHTML = `
      <div class="sin-resultados">
        ❌ Ingresa un término de búsqueda
      </div>
    `;
    return;
  }

  const encontrados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(texto) ||
    libro.autor.toLowerCase().includes(texto)
  );

  if (encontrados.length === 0) {
    resultado.innerHTML = `
      <div class="sin-resultados">
        ❌ No se encontraron libros
      </div>
    `;
    return;
  }

  encontrados.forEach(libro => {
    resultado.innerHTML += `
      <div class="resultado-libro">
        <img src="${libro.imagen}">
        
        <div class="resultado-info">
          <h4>${libro.titulo}</h4>
          
          <div class="resultado-precio">
            $${libro.precio}
          </div>

          <div class="resultado-extra">
            Autor: ${libro.autor} <br>
            Envío gratis • Disponible
          </div>

          <br>

          <a href="${libro.pagina}">Ver más</a>
          <br><br>

        </div>
      </div>
    `;
  });
}
