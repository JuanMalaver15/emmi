async function cargarDetalleProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const response = await fetch("data/productos.json");
  const productos = await response.json();

  const producto = productos.find(p => p.id == id);

  if (!producto) {
    document.body.innerHTML = "<h2>Producto no encontrado</h2>";
    return;
  }

  // Imágenes
  const imagenesHTML = `
    <img src="${producto.image}" alt="${producto.name}" class="imagen-principal">
  `;

  // Información
  const infoHTML = `
    <h2>${producto.name}</h2>
    <p>${producto.description}</p>
    <p><strong>Precio: </strong>$${producto.price}</p>
    
    <!-- Tallas -->
    <label for="talla">Selecciona tu talla:</label>
    <select id="talla">
      ${producto.tallas.map(t => `<option value="${t}">${t}</option>`).join("")}
    </select>

    <!-- Cantidad -->
    <label for="cantidad">Cantidad:</label>
    <input type="number" id="cantidad" value="1" min="1">

    <!-- Botón WhatsApp -->
    <button class="whatsapp-btn" onclick="comprarPorWhatsapp(${producto.id}, '${producto.name}')">Comprar por WhatsApp</button>
  `;

  document.getElementById("producto-imagenes").innerHTML = imagenesHTML;
  document.getElementById("producto-info").innerHTML = infoHTML;
}

function comprarPorWhatsapp(id, nombre) {
  const talla = document.getElementById("talla").value;
  const cantidad = document.getElementById("cantidad").value;

  const mensaje = `Hola, quiero comprar el producto ${nombre} con id: ${id} en talla ${talla} (Cantidad: ${cantidad})`;
  const url = `https://wa.me/573202594521?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

cargarDetalleProducto();
