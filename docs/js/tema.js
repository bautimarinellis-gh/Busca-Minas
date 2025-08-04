// Funcionalidad para manejar el tema oscuro/claro
"use strict";

// Cargar tema guardado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var temaGuardado = localStorage.getItem('modo-tema');
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('tema-oscuro');
    }
});

// Función para cambiar entre modo claro y oscuro
function cambiarTema() {
    document.body.classList.toggle('tema-oscuro');
    // Guardar en localStorage
    localStorage.setItem('modo-tema', document.body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro');
}

// Agregar event listener al botón de tema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    var botonTema = document.getElementById('cambiar-tema');
    if (botonTema) {
        botonTema.onclick = cambiarTema;
    }
}); 