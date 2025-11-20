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
    <p class="price"><strong>Precio: </strong>$${producto.price}</p>
    
    <!-- Tallas -->
    <label for="talla">Selecciona tu talla:</label>
    <select id="talla">
      ${producto.tallas.map(t => `<option value="${t}">${t}</option>`).join("")}
    </select>

    <!-- Cantidad -->
    <label for="cantidad">Cantidad:</label>
    <input type="number" id="cantidad" value="1" min="1">

    <!-- color -->
<div class="producto-colores" style="margin: 10px 0;">
  <span 
    class="color-box" 
    style="background-color:${producto.color}; display: inline-block; width: 20px; height: 20px; border: 1px solid #ccc; vertical-align: middle;" 
    data-color="${producto.nameColor}"></span> 
  <span style="margin-left: 8px; vertical-align: middle;">${producto.nameColor}</span>
</div>


    <!-- Botón WhatsApp -->
<button class="whatsapp-btn" onclick="comprarPorWhatsapp(${producto.id}, '${producto.name}', ${producto.price})"> Comprar por WhatsApp <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg></button>
  `;

  document.getElementById("producto-imagenes").innerHTML = imagenesHTML;
  document.getElementById("producto-info").innerHTML = infoHTML;
}

function comprarPorWhatsapp(id, nombre, price) {
  const talla = document.getElementById("talla").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);

  // aquí la diferencia
  const color = document.querySelector(".color-box").dataset.color; 

  // Calcular subtotal y total
  const subtotal = price * cantidad;
  const total = subtotal;

  const mensaje = `Hola, quiero realizar una compra.
  
Datos del pedido:  

Producto: ${nombre}  
ID: ${id}  
Talla: ${talla} 
Color: ${color} 
Cantidad: ${cantidad}
Precio unitario: $${price.toLocaleString()}  
Subtotal: $${subtotal.toLocaleString()}

Total a pagar: $${total.toLocaleString()}

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

  const url = `https://wa.me/573202594521?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}



cargarDetalleProducto();
