let indice = 0;
let imagenes = [];

async function cargarCarrusel() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const response = await fetch("data/productos.json"); 
    const productos = await response.json();

    const producto = productos.find(p => p.id === id);

    if (!producto) {
      console.error("Producto no encontrado");
      return;
    }

    imagenes = producto.imagenes;

    const carrusel = document.getElementById("carrusel");
    carrusel.innerHTML = imagenes.map((src, i) =>
      `<img src="${src}" class="${i === 0 ? 'active' : ''}">`
    ).join("");
  } catch (error) {
    console.error("Error cargando el carrusel:", error);
  }
}

function moverCarrusel(direccion) {
  const imgs = document.querySelectorAll("#carrusel img");
  if (imgs.length === 0) return;

  imgs[indice].classList.remove("active");
  indice = (indice + direccion + imgs.length) % imgs.length;
  imgs[indice].classList.add("active");
}

cargarCarrusel();
