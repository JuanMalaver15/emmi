async function cargarProductos() {
  try {
    const response = await fetch("productos.json");
    const productos = await response.json();
    const contenedor = document.getElementById("productos-grid");

    productos.forEach(prod => {
      // Renderizar tallas dinámicas
      const tallasHTML = prod.tallas.map(talla => {
        const clase = prod.disabled.includes(talla) ? "talla disabled" : "talla";
        return `<div class="${clase}">${talla}</div>`;
      }).join("");

      // Formatear precio con separador de miles
      const precioFormateado = `$${prod.price.toLocaleString("es-CO")}`;

      const card = `
        <div class="producto-card fade-in" 
             data-id="${prod.id}" 
             data-name="${prod.name}" 
             data-price="${prod.price}" 
             data-image="${prod.image}">
          <div class="producto-img">
            <img src="${prod.image}" alt="${prod.name}">
          </div>
          <div class="producto-info">
            <h3>${prod.name}</h3>
            <span>${prod.description}</span>
            <div class="tallas">${tallasHTML}</div>
            <div class="producto-precio">${precioFormateado}</div>
            <button class="buy-button" onclick="addToCart(this)">Agregar al Carrito</button>
          </div>
        </div>
      `;
      contenedor.innerHTML += card;
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

cargarProductos();

// Función de carrito (ejemplo básico)
function addToCart(button) {
  const card = button.closest(".producto-card");
  const name = card.dataset.name;
  const price = card.dataset.price;
  alert(`Agregado: ${name} - $${price}`);
}
