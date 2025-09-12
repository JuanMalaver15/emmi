let cart = [];

function addToCart(card, boton) {
  const productCard = card.closest('.producto-card');
  const productData = {
    id: parseInt(productCard.dataset.id),
    name: productCard.dataset.name,
    talla: productCard.dataset.tallas,
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
  const originalText = boton.textContent;
  boton.textContent = '¡Agregado! ✓';
  boton.style.background = '#10b981';
  boton.disabled = true;

  setTimeout(() => {
    boton.textContent = originalText;
    boton.style.background = '';
    boton.disabled = false;
  }, 1500);
}

function updateCartCount(count) {
  const desktopBadge = document.getElementById("cartBadgeDesktop");
  if (desktopBadge) desktopBadge.textContent = count;

  const mobileBadge = document.getElementById("cartBadgeMobile");
  if (mobileBadge) mobileBadge.textContent = count;
}

function updateCartDisplay() {
  const cartBody = document.getElementById('cartBody');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const totalAmount = document.getElementById('totalAmount');

  // Calcular número total de productos
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartCount(cartCount);

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';   
    cartFooter.style.display = 'none';
    cartBody.innerHTML = "<p id='cartEmpty'>El carrito está vacío</p>";
  } else {
    cartFooter.style.display = 'block';
    console.log(JSON.stringify(cart));
    cartBody.innerHTML = cart.map(item => `
      <div class="slider-container" style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" width="50">
          <div class="cart-item-info">
            <div>${item.name}</div>
            <div>Talla: ${item.talla}</div>
            <div>$${item.price.toLocaleString()}</div>
            <div>
              Cantidad: ${item.quantity}
              <button class="btn-add" onclick="increaseQuantity(${item.id})">+</button>
            </div>
          </div>
          <button class="btn-trash" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
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
  document.querySelector('.floating-cart').style.display = 'none'; 
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
  // Mostrar de nuevo SOLO en móviles
  if (window.innerWidth <= 768) {
    document.querySelector('.floating-cart').style.display = 'flex';
  }
}


function checkout() {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  // Construir detalles de los productos en el carrito
  let productosTexto = cart.map(item => {
    return `Producto: ${item.name}\nID: ${item.id}\nTalla: ${item.talla}\nCantidad: ${item.quantity}\nPrecio unitario: $${item.price.toLocaleString()}\nSubtotal: $${(item.price * item.quantity).toLocaleString()}`;
  }).join("\n\n");

  // Total de la compra
  let total = document.getElementById('totalAmount').textContent;

  // Mensaje estructurado para WhatsApp (sin emojis)
  const mensaje = `Hola, quiero realizar una compra.
  
Datos del pedido:  
${productosTexto}

Total a pagar: ${total}

Dirección de entrega: [Escribe tu dirección completa]  
Nombre completo: [Tu nombre]  
Teléfono de contacto: [Tu número]  

Método de pago: Transferencia bancaria  
- Una vez realizada la transferencia, adjuntar comprobante aquí para confirmar el pedido.  

Pasos para completar la compra:  
1) Envía este mensaje con tus datos completos.  
2) Realiza la transferencia a la cuenta que te enviaremos.  
3) Envía el comprobante por este chat.  
4) Confirmaremos tu pedido y te daremos el tiempo estimado de entrega.  

Gracias por tu confianza, estamos atentos a tu confirmación.`;

  // URL de WhatsApp
  const url = `https://wa.me/573202594521?text=${encodeURIComponent(mensaje)}`;

  // Redirigir a WhatsApp
  window.open(url, '_blank');

  // Limpiar carrito
  alert('Gracias por su compra. Total: ' + total);
  cart = [];
  updateCartDisplay();
  closeCart();
}


// Inicializar vista
updateCartDisplay();
