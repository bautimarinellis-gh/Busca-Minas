/**
 * BUSCAMINAS - VALIDACIONES DE FORMULARIO DE CONTACTO
 * ==================================================
 * 
 * Maneja la validación del formulario de contacto:
 * - Validación de campos (nombre, email, mensaje)
 * - Mensajes de error dinámicos
 * - Procesamiento de envío por email
 * 
 */

"use strict";

/**
 * Event listener para el envío del formulario de contacto
 * Valida todos los campos y procesa el envío si es válido
 */
document.getElementById('contacto-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var nombre = document.getElementById('nombre').value.trim();
    var email = document.getElementById('email').value.trim();
    var mensaje = document.getElementById('mensaje').value.trim();
    var error = false;

    // Validación nombre alfanumérico
    var nombreValido = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre) && nombre.length > 0;
    if (!nombreValido) {
        document.getElementById('error-nombre').textContent = 'El nombre debe ser alfanumérico.';
        document.getElementById('error-nombre').style.display = 'block';
        error = true;
    } else {
        document.getElementById('error-nombre').style.display = 'none';
    }

    // Validación email
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
        document.getElementById('error-email').textContent = 'El email no es válido.';
        document.getElementById('error-email').style.display = 'block';
        error = true;
    } else {
        document.getElementById('error-email').style.display = 'none';
    }

    // Validación mensaje
    if (mensaje.length <= 5) {
        document.getElementById('error-mensaje').textContent = 'El mensaje debe tener más de 5 caracteres.';
        document.getElementById('error-mensaje').style.display = 'block';
        error = true;
    } else {
        document.getElementById('error-mensaje').style.display = 'none';
    }

    if (error) return;

    var subject = encodeURIComponent('Contacto desde Busca-Minas');
    var body = encodeURIComponent('Nombre: ' + nombre + '\nEmail: ' + email + '\nMensaje: ' + mensaje);
    document.getElementById('mensaje-enviado').style.display = 'block';
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}); 