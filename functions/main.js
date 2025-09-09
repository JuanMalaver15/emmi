let cart = [];

function addToCart(button) {
  const productCard = button.closest('.producto-card');
  const productData = {
    id: parseInt(productCard.dataset.id),
    name: productCard.dataset.name,
    price: parseInt(productCard.dataset.price),
    image: productCard.dataset.image,
  };

  const existingItem = cart.find(item => item.id === productData.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...productData, quantity: 1 });
  }

  updateCartDisplay();

  const originalText = button.textContent;
  button.textContent = '¡Agregado! ✓';
  button.style.background = '#10b981';
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
    button.disabled = false;
  }, 1500);
}

function updateCartDisplay() {
  const cartBadge = document.getElementById('cartBadge');
  const cartBody = document.getElementById('cartBody');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const totalAmount = document.getElementById('totalAmount');

  // Calcular número total de productos
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = cartCount;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartFooter.style.display = 'none';
    cartBody.innerHTML = `<p id="cartEmpty">El carrito está vacío</p>`;
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';

    cartBody.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" width="50">
        <div class="cart-item-info">
          <div>${item.name}</div>
          <div>$${item.price.toLocaleString()}</div>
          <div>
            Cantidad: ${item.quantity}
            <button class="btn-add" onclick="increaseQuantity(${item.id})">+</button>
          </div>
        </div>
        <button class="btn-trash" onclick="removeFromCart(${item.id})">🗑️</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalAmount.textContent = `$${total.toLocaleString()}`;
  }
}

function increaseQuantity(productId) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity += 1;
    updateCartDisplay();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
}

function openCart() {
  document.getElementById('cartModal').classList.add('active');
}
function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
}

function checkout() {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  alert('Gracias por su compra. Total: ' + document.getElementById('totalAmount').textContent);
  cart = [];
  updateCartDisplay();
  closeCart();
}

// Inicializar vista
updateCartDisplay();


    // --- Preview Modal con Slider ---
const modal = document.getElementById("previewModal");
const slidesContainer = document.getElementById("slidesContainer");
const closeBtn = document.querySelector(".close-preview");
let currentSlide = 0;

// Abrir modal al hacer clic en imagen del producto
document.querySelectorAll(".producto-img img").forEach(img => {
  img.addEventListener("click", () => {
    const productoCard = img.closest(".producto-card");

    // Puedes guardar más imágenes en el atributo data-images separado por coma
    const images = productoCard.dataset.images 
      ? productoCard.dataset.images.split(",") 
      : [img.src];

    slidesContainer.innerHTML = images.map(src => 
      `<div class="slide"><img src="${src}" alt=""></div>`
    ).join("");

    currentSlide = 0;
    showSlide(currentSlide);

    modal.style.display = "block";
  });
});

// Cerrar modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };

// Navegar en slides
document.querySelector(".prev").onclick = () => changeSlide(-1);
document.querySelector(".next").onclick = () => changeSlide(1);

function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  if (index >= slides.length) currentSlide = 0;
  if (index < 0) currentSlide = slides.length - 1;

  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function changeSlide(n) {
  currentSlide += n;
  showSlide(currentSlide);
}
