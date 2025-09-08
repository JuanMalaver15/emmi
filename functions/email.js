// Inicializar EmailJS (coloca esto antes del addEventListener)
emailjs.init("qLFr35GDi18K3nbLz"); // Reemplaza con tu clave pública de EmailJS

// Form submission mejorado
document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const telefono = formData.get('tel');
    const mensaje = formData.get('mensaje');
    
    // Enhanced validation
    if (!validateForm(nombre, email, telefono, mensaje)) {
        return;
    }
    
    const button = this.querySelector('.buy-button');
    const originalText = button.textContent;
    
    // Update button state
    button.textContent = 'Enviando...';
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    
    // Prepare template parameters for EmailJS
    const templateParams = {
        from_name: nombre,
        from_email: email,
        telefono: telefono,
        message: mensaje,
        to_email: '',
        reply_to: email
    };
    
    // Send email using EmailJS
    emailjs.send('service_moya014', 'template_cebxpow', templateParams)
        .then(function(response) {
            console.log('Email enviado exitosamente!', response.status, response.text);
            
            // Success state
            button.textContent = '¡Mensaje Enviado! ✓';
            button.style.background = '#10b981';
            button.style.cursor = 'default';
            
            // Show success message
            showNotification('¡Gracias! Tu mensaje ha sido enviado correctamente.', 'success');
            
            // Reset form
            document.querySelector('.contact-form').reset();
            
            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                button.style.cursor = 'pointer';
            }, 3000);
            
        })
        .catch(function(error) {
            console.error('Error al enviar email:', error);
            
            // Error state
            button.textContent = 'Error al enviar';
            button.style.background = '#ef4444';
            
            // Show error message
            showNotification('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.', 'error');
            
            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                button.style.cursor = 'pointer';
            }, 3000);
        });
});

// Enhanced validation function
function validateForm(nombre, email, mensaje) {
    const errors = [];
    
    // Name validation
    if (!nombre || nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    // Message validation
    if (!mensaje || mensaje.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-family: inherit;
        ${type === 'success' ? 'background: #10b981; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);