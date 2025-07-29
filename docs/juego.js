// --- Busca-Minas básico ES5 ---

var FILAS = 8;
var COLUMNAS = 8;
var MINAS = 10;
var NIVEL_ACTUAL = 'facil';

// Función para cambiar el nivel de dificultad
function CambiarNivel(nivel) {
    var configuraciones = {
        'facil': { filas: 8, columnas: 8, minas: 10 },
        'medio': { filas: 12, columnas: 12, minas: 25 },
        'dificil': { filas: 16, columnas: 16, minas: 40 }
    };
    
    if (configuraciones[nivel]) {
        FILAS = configuraciones[nivel].filas;
        COLUMNAS = configuraciones[nivel].columnas;
        MINAS = configuraciones[nivel].minas;
        NIVEL_ACTUAL = nivel;
        
        // Actualizar botones
        var botones = document.querySelectorAll('.boton-nivel');
        for (var i = 0; i < botones.length; i++) {
            botones[i].classList.remove('activo');
        }
        document.getElementById('nivel-' + nivel).classList.add('activo');
        
        // Reiniciar juego si ya está iniciado
        if (juegoIniciado) {
            NuevaPartida();
        }
        
        console.log('Nivel cambiado a:', nivel, '- Configuración:', FILAS + 'x' + COLUMNAS + ' - ' + MINAS + ' minas');
    }
}

// Función para validar que el número de minas sea válido
function ValidarConfiguracionMinas() {
    var totalCeldas = FILAS * COLUMNAS;
    if (MINAS >= totalCeldas) {
        console.error('Error: El número de minas (' + MINAS + ') no puede ser mayor o igual al número total de celdas (' + totalCeldas + ')');
        // Ajustar automáticamente a un valor válido (máximo 80% de las celdas)
        MINAS = Math.floor(totalCeldas * 0.8);
        console.log('Se ajustó automáticamente a ' + MINAS + ' minas');
    }
    if (MINAS <= 0) {
        console.error('Error: El número de minas debe ser mayor que 0');
        MINAS = 1;
        console.log('Se ajustó automáticamente a 1 mina');
    }
}

// Función para probar la validación (solo para desarrollo)
function ProbarValidacionMinas() {
    console.log('=== Pruebas de validación de minas ===');
    
    // Prueba 1: Configuración válida
    console.log('Prueba 1: Configuración válida (10 minas en 8x8)');
    MINAS = 10;
    ValidarConfiguracionMinas();
    console.log('MINAS después de validación:', MINAS);
    
    // Prueba 2: Demasiadas minas
    console.log('Prueba 2: Demasiadas minas (100 minas en 8x8)');
    MINAS = 100;
    ValidarConfiguracionMinas();
    console.log('MINAS después de validación:', MINAS);
    
    // Prueba 3: Cero minas
    console.log('Prueba 3: Cero minas');
    MINAS = 0;
    ValidarConfiguracionMinas();
    console.log('MINAS después de validación:', MINAS);
    
    // Restaurar configuración original
    MINAS = 10;
    console.log('Configuración restaurada a:', MINAS);
    console.log('=== Fin de pruebas ===');
}

// Variables para el temporizador
var temporizadorInterval;
var tiempoTranscurrido = 0;
var juegoIniciado = false;

// Tablero lógico: cada celda será un objeto {mina: bool, abierta: bool, bandera: bool, numero: int}
var tablero = [];

// Inicializa el tablero vacío
function CrearTablero() {
    tablero = [];
    for (var i = 0; i < FILAS; i++) {
        var fila = [];
        for (var j = 0; j < COLUMNAS; j++) {
            fila.push({
                mina: false,
                abierta: false,
                bandera: false,
                numero: 0
            });
        }
        tablero.push(fila);
    }
}

// Coloca minas aleatoriamente
function ColocarMinas() {
    var minasColocadas = 0;
    var intentosMaximos = FILAS * COLUMNAS * 2; // Evitar bucles infinitos
    var intentos = 0;
    
    while (minasColocadas < MINAS && intentos < intentosMaximos) {
        var fila = Math.floor(Math.random() * FILAS);
        var col = Math.floor(Math.random() * COLUMNAS);
        if (!tablero[fila][col].mina) {
            tablero[fila][col].mina = true;
            minasColocadas++;
        }
        intentos++;
    }
    
    // Si no se pudieron colocar todas las minas, ajustar el número
    if (minasColocadas < MINAS) {
        console.warn('No se pudieron colocar todas las minas. Se colocaron ' + minasColocadas + ' de ' + MINAS);
        MINAS = minasColocadas;
    }
}

// Calcula los números de minas vecinas para cada celda
function CalcularNumeros() {
    for (var i = 0; i < FILAS; i++) {
        for (var j = 0; j < COLUMNAS; j++) {
            if (tablero[i][j].mina) {
                tablero[i][j].numero = -1;
                continue;
            }
            var minasVecinas = 0;
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    var ni = i + dx;
                    var nj = j + dy;
                    if (ni >= 0 && ni < FILAS && nj >= 0 && nj < COLUMNAS) {
                        if (tablero[ni][nj].mina) minasVecinas++;
                    }
                }
            }
            tablero[i][j].numero = minasVecinas;
        }
    }
}

// Funciones para el temporizador
function IniciarTemporizador() {
    if (!juegoIniciado) {
        juegoIniciado = true;
        tiempoTranscurrido = 0;
        ActualizarTemporizador();
        temporizadorInterval = setInterval(function() {
            tiempoTranscurrido++;
            ActualizarTemporizador();
        }, 1000);
    }
}

function PararTemporizador() {
    if (temporizadorInterval) {
        clearInterval(temporizadorInterval);
        temporizadorInterval = null;
    }
}

function ActualizarTemporizador() {
    var minutos = Math.floor(tiempoTranscurrido / 60);
    var segundos = tiempoTranscurrido % 60;
    var tiempoFormateado = 'Tiempo: ' + 
        (minutos < 10 ? '0' : '') + minutos + ':' + 
        (segundos < 10 ? '0' : '') + segundos;
    document.getElementById('temporizador').textContent = tiempoFormateado;
}

function ReiniciarTemporizador() {
    PararTemporizador();
    juegoIniciado = false;
    tiempoTranscurrido = 0;
    ActualizarTemporizador();
}

// Función para calcular y actualizar el contador de minas restantes
function ActualizarContadorMinas() {
    var banderasPlantadas = 0;
    for (var i = 0; i < FILAS; i++) {
        for (var j = 0; j < COLUMNAS; j++) {
            if (tablero[i][j].bandera) {
                banderasPlantadas++;
            }
        }
    }
    var minasRestantes = MINAS - banderasPlantadas;
    var textoContador = 'Minas restantes: ' + minasRestantes;
    document.getElementById('contador-minas').textContent = textoContador;
}

// Abrir celda (click izquierdo)
function AbrirCelda(fila, col) {
    // Iniciar temporizador en la primera celda abierta
    IniciarTemporizador();
    
    var celda = tablero[fila][col];
    if (celda.abierta || celda.bandera) return;
    celda.abierta = true;
    var boton = document.querySelector('button[data-fila="' + fila + '"][data-col="' + col + '"]');
    boton.className = 'celda abierta';
    boton.disabled = true;
    if (celda.mina) {
        boton.className += ' mina';
        boton.innerHTML = '💣';
        MostrarTodasLasMinas();
        PararTemporizador();
        setTimeout(function() { MostrarModal('¡Perdiste!'); }, 100);
        return;
    }
    if (celda.numero > 0) {
        boton.innerHTML = celda.numero;
    } else {
        boton.innerHTML = '';
        // Abrir celdas vecinas si es 0
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                var ni = fila + dx;
                var nj = col + dy;
                if (ni >= 0 && ni < FILAS && nj >= 0 && nj < COLUMNAS) {
                    if (!tablero[ni][nj].abierta) AbrirCelda(ni, nj);
                }
            }
        }
    }
    // Verificar si el jugador ganó
    if (VerificarVictoria()) {
        PararTemporizador();
        setTimeout(function() { MostrarModal('¡Ganaste!'); }, 100);
    }
}

// Mostrar todas las minas al perder
function MostrarTodasLasMinas() {
    for (var i = 0; i < FILAS; i++) {
        for (var j = 0; j < COLUMNAS; j++) {
            if (tablero[i][j].mina) {
                var boton = document.querySelector('button[data-fila="' + i + '"][data-col="' + j + '"]');
                boton.className = 'celda abierta mina';
                boton.innerHTML = '💣';
                boton.disabled = true;
            }
        }
    }
}

// Poner o quitar bandera (click derecho)
function ToggleBandera(fila, col, e) {
    e.preventDefault();
    var celda = tablero[fila][col];
    if (celda.abierta) return;
    celda.bandera = !celda.bandera;
    var boton = document.querySelector('button[data-fila="' + fila + '"][data-col="' + col + '"]');
    if (celda.bandera) {
        boton.className = 'celda bandera';
        boton.innerHTML = '🚩';
    } else {
        boton.className = 'celda';
        boton.innerHTML = '';
    }
    ActualizarContadorMinas();
}

// Agregar listeners a los botones
function AgregarListeners() {
    var botones = document.getElementsByClassName('celda');
    for (var i = 0; i < botones.length; i++) {
        (function(boton) {
            var fila = parseInt(boton.getAttribute('data-fila'));
            var col = parseInt(boton.getAttribute('data-col'));
            boton.onmousedown = function(e) {
                if (e.button === 0) AbrirCelda(fila, col);
                if (e.button === 2) ToggleBandera(fila, col, e);
            };
            boton.oncontextmenu = function(e) { e.preventDefault(); };
        })(botones[i]);
    }
}

// Renderiza el tablero en el HTML
function RenderizarTablero() {
    var contenedor = document.getElementById('tablero');
    contenedor.innerHTML = '';
    var tabla = document.createElement('table');
    tabla.className = 'buscaminas-tabla';
    for (var i = 0; i < FILAS; i++) {
        var fila = document.createElement('tr');
        for (var j = 0; j < COLUMNAS; j++) {
            var celda = document.createElement('td');
            var boton = document.createElement('button');
            boton.className = 'celda';
            boton.setAttribute('data-fila', i);
            boton.setAttribute('data-col', j);
            boton.innerHTML = '';
            celda.appendChild(boton);
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    contenedor.appendChild(tabla);
    AgregarListeners();
}

// Inicializa una nueva partida
function NuevaPartida() {
    ValidarConfiguracionMinas();
    CrearTablero();
    ColocarMinas();
    CalcularNumeros();
    RenderizarTablero();
    ReiniciarTemporizador();
    ActualizarContadorMinas();
}

// Llamar a NuevaPartida() para iniciar el juego al cargar
NuevaPartida();

// --- Lógica para nombre de usuario y validación ---
var inputNombre = document.getElementById('nombre-jugador');
var btnComenzar = document.getElementById('comenzar-juego');
var errorNombre = document.getElementById('error-nombre');
var contenedorTablero = document.getElementById('tablero');
var btnReiniciar = document.getElementById('reiniciar');

function MostrarTableroYReiniciar() {
    contenedorTablero.style.display = '';
    btnReiniciar.style.display = '';
    document.getElementById('temporizador').style.display = '';
    document.getElementById('contador-minas').style.display = '';
    document.getElementById('selector-nivel').style.display = 'none';
    document.getElementById('cambiar-nivel').style.display = '';
}

function OcultarTableroYReiniciar() {
    contenedorTablero.style.display = 'none';
    btnReiniciar.style.display = 'none';
    document.getElementById('temporizador').style.display = 'none';
    document.getElementById('contador-minas').style.display = 'none';
    document.getElementById('selector-nivel').style.display = '';
    document.getElementById('cambiar-nivel').style.display = 'none';
}

OcultarTableroYReiniciar();

if (btnComenzar) {
    btnComenzar.onclick = function() {
        var nombre = inputNombre.value.trim();
        // Validación: solo letras, espacios y acentos
        var nombreValido = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre) && nombre.length >= 3;
        if (nombreValido) {
            errorNombre.style.display = 'none';
            MostrarTableroYReiniciar();
            NuevaPartida();
            document.getElementById('nombre-container').style.display = 'none';
        } else {
            errorNombre.textContent = 'El nombre debe tener al menos 3 letras (solo letras permitidas).';
            errorNombre.style.display = 'block';
            OcultarTableroYReiniciar();
        }
    };
}

// Modifico el botón de reinicio para mostrar el input de nombre si se desea reiniciar todo
if (btnReiniciar) {
    btnReiniciar.onclick = function() {
        NuevaPartida();
    };
}

// Event listeners para los botones de nivel
document.addEventListener('DOMContentLoaded', function() {
    var btnFacil = document.getElementById('nivel-facil');
    var btnMedio = document.getElementById('nivel-medio');
    var btnDificil = document.getElementById('nivel-dificil');
    var btnCambiarNivel = document.getElementById('cambiar-nivel');
    var enlaceInicio = document.getElementById('enlace-inicio');
    
    if (btnFacil) {
        btnFacil.onclick = function() {
            CambiarNivel('facil');
        };
    }
    
    if (btnMedio) {
        btnMedio.onclick = function() {
            CambiarNivel('medio');
        };
    }
    
    if (btnDificil) {
        btnDificil.onclick = function() {
            CambiarNivel('dificil');
        };
    }
    
    if (btnCambiarNivel) {
        btnCambiarNivel.onclick = function() {
            OcultarTableroYReiniciar();
            document.getElementById('nombre-container').style.display = '';
            PararTemporizador();
            juegoIniciado = false;
        };
    }
    
    if (enlaceInicio) {
        enlaceInicio.onclick = function(e) {
            e.preventDefault();
            OcultarTableroYReiniciar();
            document.getElementById('nombre-container').style.display = '';
            document.getElementById('selector-nivel').style.display = '';
            PararTemporizador();
            juegoIniciado = false;
            // Limpiar el input del nombre
            document.getElementById('nombre-jugador').value = '';
            // Ocultar mensaje de error si está visible
            document.getElementById('error-nombre').style.display = 'none';
        };
    }
});

// Funciones para mostrar y ocultar el modal de mensaje
function MostrarModal(mensaje) {
    var modal = document.getElementById('modal-mensaje');
    var texto = document.getElementById('modal-texto');
    texto.textContent = mensaje;
    modal.style.display = 'flex';
}

function OcultarModal() {
    var modal = document.getElementById('modal-mensaje');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    var btnCerrar = document.getElementById('modal-cerrar');
    if (btnCerrar) {
        btnCerrar.onclick = OcultarModal;
    }
});

function VerificarVictoria() {
    for (var i = 0; i < FILAS; i++) {
        for (var j = 0; j < COLUMNAS; j++) {
            var celda = tablero[i][j];
            if (!celda.mina && !celda.abierta) {
                return false;
            }
        }
    }
    return true;
}

// Ejecutar pruebas de validación al cargar (solo para desarrollo)
// Comentar esta línea en producción
// ProbarValidacionMinas();
