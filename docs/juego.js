// --- Busca-Minas básico ES5 ---

var FILAS = 8;
var COLUMNAS = 8;
var MINAS = 10;

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
    while (minasColocadas < MINAS) {
        var fila = Math.floor(Math.random() * FILAS);
        var col = Math.floor(Math.random() * COLUMNAS);
        if (!tablero[fila][col].mina) {
            tablero[fila][col].mina = true;
            minasColocadas++;
        }
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

// Abrir celda (click izquierdo)
function AbrirCelda(fila, col) {
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
    CrearTablero();
    ColocarMinas();
    CalcularNumeros();
    RenderizarTablero();
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
}

function OcultarTableroYReiniciar() {
    contenedorTablero.style.display = 'none';
    btnReiniciar.style.display = 'none';
}

OcultarTableroYReiniciar();

if (btnComenzar) {
    btnComenzar.onclick = function() {
        var nombre = inputNombre.value.replace(/\s+/g, '');
        if (nombre.length >= 3) {
            errorNombre.style.display = 'none';
            MostrarTableroYReiniciar();
            NuevaPartida();
            document.getElementById('nombre-container').style.display = 'none';
        } else {
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
