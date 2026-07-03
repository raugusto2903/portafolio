/* ============================================================
   LABERINTO RECURSIVO
   ------------------------------------------------------------
   Resuelve un laberinto con búsqueda en profundidad (DFS)
   recursiva y backtracking, y anima todo el proceso en pantalla.

   Valores de la matriz:
     1 → pared (no se puede atravesar)
     0 → camino libre
     2 → posición inicial del personaje

   La salida es cualquier casilla libre (0) ubicada en el
   borde de la matriz.

   Orden de prioridad de los movimientos:
     1. Derecha   2. Arriba   3. Izquierda   4. Abajo
   ============================================================ */

/* ------------------------------------------------------------
   1. DATOS DEL LABERINTO
   ------------------------------------------------------------ */

const LABERINTO = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
];

/*  Orden de prioridad: derecha, arriba, izquierda, abajo.
    Cada movimiento es [desplazamientoFila, desplazamientoColumna]. */
const MOVIMIENTOS = [
    { nombre: 'derecha',   df: 0,  dc: 1 },
    { nombre: 'arriba',    df: -1, dc: 0 },
    { nombre: 'izquierda', df: 0,  dc: -1 },
    { nombre: 'abajo',     df: 1,  dc: 0 },
];

const EMOJI_PERSONAJE = '🤖';
const EMOJI_SALIDA = '🚩';

/* ------------------------------------------------------------
   2. ESTADO GLOBAL DE LA APLICACIÓN
   ------------------------------------------------------------ */

let celdas = [];          // referencias a los <div> de cada casilla
let animacionEnCurso = false;
let idTemporizador = null;

/* ------------------------------------------------------------
   3. INICIALIZACIÓN
   ------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    dibujarLaberinto();

    document.getElementById('btnIniciar').addEventListener('click', iniciarBusqueda);
    document.getElementById('btnReiniciar').addEventListener('click', reiniciar);
});

/* ------------------------------------------------------------
   4. UTILIDADES SOBRE LA MATRIZ
   ------------------------------------------------------------ */

/** Devuelve la posición [fila, columna] del valor 2 (inicio). */
function buscarInicio() {
    for (let f = 0; f < LABERINTO.length; f++) {
        for (let c = 0; c < LABERINTO[f].length; c++) {
            if (LABERINTO[f][c] === 2) return [f, c];
        }
    }
    return null;
}

/** Una casilla es salida si es camino libre (0) y está en el borde. */
function esSalida(fila, columna) {
    const ultimaFila = LABERINTO.length - 1;
    const ultimaColumna = LABERINTO[0].length - 1;

    const enBorde =
        fila === 0 || fila === ultimaFila ||
        columna === 0 || columna === ultimaColumna;

    return enBorde && LABERINTO[fila][columna] === 0;
}

/** Verifica que la posición exista dentro de la matriz. */
function dentroDelLaberinto(fila, columna) {
    return (
        fila >= 0 && fila < LABERINTO.length &&
        columna >= 0 && columna < LABERINTO[0].length
    );
}

/* ------------------------------------------------------------
   5. ALGORITMO RECURSIVO (DFS + BACKTRACKING)
   ------------------------------------------------------------
   La función `explorar` se llama a sí misma por cada movimiento
   válido. En lugar de animar directamente, registra cada paso en
   un arreglo `pasos`; luego la animación los reproduce en orden.
   Esto separa el ALGORITMO de la PRESENTACIÓN.
   ------------------------------------------------------------ */

/**
 * Resuelve el laberinto y devuelve la lista de pasos del recorrido.
 * @returns {{ pasos: Array, resuelto: boolean }}
 */
function resolverLaberinto() {
    const visitadas = LABERINTO.map((fila) => fila.map(() => false));
    const pasos = [];
    const [filaInicio, columnaInicio] = buscarInicio();

    /**
     * Función RECURSIVA: intenta llegar a la salida desde (fila, columna).
     * @returns {boolean} true si esta rama conduce a la salida.
     */
    function explorar(fila, columna) {
        visitadas[fila][columna] = true;
        pasos.push({ tipo: 'avance', fila, columna });

        // Caso base: llegamos a una salida.
        if (esSalida(fila, columna)) {
            pasos.push({ tipo: 'meta', fila, columna });
            return true;
        }

        // Caso recursivo: probar cada movimiento en orden de prioridad.
        for (const movimiento of MOVIMIENTOS) {
            const nuevaFila = fila + movimiento.df;
            const nuevaColumna = columna + movimiento.dc;

            const esValida =
                dentroDelLaberinto(nuevaFila, nuevaColumna) &&
                LABERINTO[nuevaFila][nuevaColumna] === 0 &&
                !visitadas[nuevaFila][nuevaColumna];

            if (esValida && explorar(nuevaFila, nuevaColumna)) {
                return true; // una rama encontró la salida: propagar el éxito
            }
        }

        // Ninguna dirección funcionó: retroceder (backtracking).
        pasos.push({ tipo: 'retroceso', fila, columna });
        return false;
    }

    const resuelto = explorar(filaInicio, columnaInicio);
    return { pasos, resuelto };
}

/* ------------------------------------------------------------
   6. DIBUJO DEL LABERINTO EN EL DOM
   ------------------------------------------------------------ */

/** Construye la cuadrícula de casillas a partir de la matriz. */
function dibujarLaberinto() {
    const tablero = document.getElementById('tablero');
    const columnas = LABERINTO[0].length;

    tablero.style.gridTemplateColumns = 'repeat(' + columnas + ', 1fr)';
    tablero.innerHTML = '';
    celdas = [];

    LABERINTO.forEach((fila, f) => {
        const filaCeldas = [];

        fila.forEach((valor, c) => {
            const celda = document.createElement('div');
            celda.classList.add('celda');

            if (valor === 1) {
                celda.classList.add('celda--pared');
            } else if (valor === 2) {
                celda.classList.add('celda--inicio');
                celda.textContent = EMOJI_PERSONAJE;
            } else if (esSalida(f, c)) {
                celda.classList.add('celda--salida');
                celda.textContent = EMOJI_SALIDA;
            } else {
                celda.classList.add('celda--camino');
            }

            tablero.appendChild(celda);
            filaCeldas.push(celda);
        });

        celdas.push(filaCeldas);
    });
}

/* ------------------------------------------------------------
   7. ANIMACIÓN DEL RECORRIDO
   ------------------------------------------------------------ */

/** Ejecuta el algoritmo y reproduce los pasos con animación. */
function iniciarBusqueda() {
    if (animacionEnCurso) return;

    animacionEnCurso = true;
    document.getElementById('btnIniciar').disabled = true;

    const velocidad = parseInt(document.getElementById('selectVelocidad').value, 10);
    const { pasos, resuelto } = resolverLaberinto();

    let indice = 0;
    let posicionAnterior = null; // celda donde estaba el personaje

    actualizarEstado('Buscando…', 'buscando');

    idTemporizador = setInterval(() => {
        // ¿Terminó la reproducción de pasos?
        if (indice >= pasos.length) {
            clearInterval(idTemporizador);
            animacionEnCurso = false;

            if (resuelto) {
                actualizarEstado('¡Salida encontrada! 🎉', 'exito');
            } else {
                actualizarEstado('Sin solución 😞', 'fracaso');
            }
            return;
        }

        const paso = pasos[indice];
        const celda = celdas[paso.fila][paso.columna];

        // Quitar el personaje de la casilla anterior.
        if (posicionAnterior) {
            posicionAnterior.classList.remove('celda--personaje');
            if (!posicionAnterior.classList.contains('celda--inicio')) {
                posicionAnterior.textContent = '';
            }
        }

        if (paso.tipo === 'avance') {
            // El personaje entra a una casilla nueva.
            celda.classList.add('celda--visitada', 'celda--personaje');
            celda.textContent = EMOJI_PERSONAJE;
            posicionAnterior = celda;
            actualizarEstado('Buscando…', 'buscando');

        } else if (paso.tipo === 'retroceso') {
            // Rama sin salida: se marca y el personaje vuelve atrás.
            celda.classList.remove('celda--visitada');
            celda.classList.add('celda--retroceso', 'celda--personaje');
            celda.textContent = EMOJI_PERSONAJE;
            posicionAnterior = celda;
            actualizarEstado('Retrocediendo…', 'retroceso');

        } else if (paso.tipo === 'meta') {
            // ¡Salida encontrada!
            celda.classList.add('celda--meta', 'celda--personaje');
            celda.textContent = EMOJI_PERSONAJE;
            posicionAnterior = celda;
        }

        indice++;
    }, velocidad);
}

/** Detiene la animación y regresa el laberinto a su estado inicial. */
function reiniciar() {
    clearInterval(idTemporizador);
    animacionEnCurso = false;
    document.getElementById('btnIniciar').disabled = false;

    dibujarLaberinto();
    actualizarEstado('Listo para iniciar', 'listo');
}

/** Actualiza el texto y el color del indicador de estado. */
function actualizarEstado(texto, tipo) {
    const indicador = document.getElementById('indicadorEstado');
    indicador.textContent = texto;
    indicador.className = 'estado__valor estado--' + tipo;
}
