async function cargarProductos() {
  try {
    const response = await fetch("data/productos.json");
    const productos = await response.json();
    const contenedor = document.getElementById("productos-grid");

    contenedor.innerHTML = ""; 

    productos.forEach(prod => {
      // Renderizar tallas dinámicas
      const tallasHTML = prod.tallas.map(talla => {
        let clase = "talla";
        if (prod.disabled.includes(talla)) clase += " disabled";
        if (prod.seleccionada === talla) clase += " seleccionada";
        return `<div class="${clase}">${talla}</div>`;
      }).join("");

      // Formatear precio con separador de miles
      const precioFormateado = `$${prod.price.toLocaleString("es-CO")}`;

      // Crear card
      const card = document.createElement("div");
      card.classList.add("producto-card", "fade-in");
      card.dataset.id = prod.id;
      card.dataset.name = prod.name;
      card.dataset.price = prod.price;
      card.dataset.image = prod.image;
      card.dataset.images = prod.images ? prod.images.join(",") : "";

      card.innerHTML = `
        <div class="producto-img">
          <img src="${prod.image}" alt="${prod.name}">
        </div>
        <div class="producto-info">
          <h3>${prod.name}</h3>
          <span>${prod.description}</span>
          <div class="tallas">${tallasHTML}</div>
          <div class="producto-precio">${precioFormateado}</div>
          <button class="buy-button">Agregar al Carrito</button>
        </div>
      `;

      // Evento para el botón de carrito
      card.querySelector(".buy-button").addEventListener("click", () => addToCart(card));

      contenedor.appendChild(card);
    });

    // Activa selección de tallas
    activarSeleccionTallas();

    // Activa animación fade-in
    observarAnimaciones();

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// Selección de tallas dinámicas
function activarSeleccionTallas() {
  document.querySelectorAll(".producto-card .talla").forEach(talla => {
    talla.addEventListener("click", () => {
      if (talla.classList.contains("disabled")) return; // No permitir clic
      const contenedor = talla.parentElement;
      contenedor.querySelectorAll(".talla").forEach(t => t.classList.remove("seleccionada"));
      talla.classList.add("seleccionada");
    });
  });
}

// Agregar producto al carrito
function addToCart(card) {
  const name = card.dataset.name;
  const price = Number(card.dataset.price).toLocaleString("es-CO");

  const tallaSeleccionada = card.querySelector(".talla.seleccionada");
  const talla = tallaSeleccionada ? tallaSeleccionada.textContent : "N/A";

  alert(`Agregado: ${name} - $${price} (Talla: ${talla})`);
}

// Animación fade-in al hacer scroll
function observarAnimaciones() {
  const elementos = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.2 });

  elementos.forEach(el => observer.observe(el));
}

cargarProductos();
