/* ============================================================
   SIMULADOR DE TRAYECTORIA DE PROYECTIL
   ------------------------------------------------------------
   Movimiento parabólico sin resistencia del aire.

   Fórmulas utilizadas (g = 9.8 m/s²):
     vx        = v0 · cos(θ)              velocidad horizontal
     vy        = v0 · sen(θ)              velocidad vertical inicial
     x(t)      = vx · t                   posición horizontal
     y(t)      = vy · t − ½ · g · t²      posición vertical
     tVuelo    = 2 · vy / g               tiempo total de vuelo
     alcance   = vx · tVuelo              distancia horizontal
     alturaMax = vy² / (2 · g)            altura máxima
   ============================================================ */

/* ------------------------------------------------------------
   1. CONSTANTES Y ESTADO
   ------------------------------------------------------------ */

const GRAVEDAD = 9.8;          // m/s²
const DURACION_ANIMACION = 4;  // segundos reales que dura la animación
const MARGEN = 50;             // margen interno del lienzo en píxeles
const LARGO_CANION = 46;       // largo del cañón en píxeles

const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d');

let simulacion = null;   // datos de la simulación en curso
let idAnimacion = null;  // id devuelto por requestAnimationFrame

/* ------------------------------------------------------------
   2. INICIALIZACIÓN
   ------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnLanzar').addEventListener('click', lanzar);
    document.getElementById('btnReiniciar').addEventListener('click', reiniciar);

    // Redibujar la escena si cambian el ángulo o la velocidad (previsualización)
    document.getElementById('inputAngulo').addEventListener('input', dibujarEscena);
    document.getElementById('inputVelocidad').addEventListener('input', dibujarEscena);

    dibujarEscena();
});

/* ------------------------------------------------------------
   3. FÍSICA DEL MOVIMIENTO PARABÓLICO
   ------------------------------------------------------------ */

/**
 * Calcula todas las magnitudes del lanzamiento.
 * @param {number} anguloGrados  Ángulo del cañón en grados.
 * @param {number} velocidad     Velocidad inicial en m/s.
 * @returns {object} Datos físicos del lanzamiento.
 */
function calcularFisica(anguloGrados, velocidad) {
    const anguloRad = (anguloGrados * Math.PI) / 180;

    const vx = velocidad * Math.cos(anguloRad); // componente horizontal
    const vy = velocidad * Math.sin(anguloRad); // componente vertical

    const tiempoVuelo = (2 * vy) / GRAVEDAD;
    const alcance = vx * tiempoVuelo;
    const alturaMaxima = (vy * vy) / (2 * GRAVEDAD);

    return { anguloRad, vx, vy, tiempoVuelo, alcance, alturaMaxima };
}

/**
 * Posición del proyectil en el instante t (en metros).
 * @param {object} fisica  Datos devueltos por calcularFisica.
 * @param {number} t       Tiempo transcurrido en segundos.
 */
function posicionEn(fisica, t) {
    return {
        x: fisica.vx * t,
        y: fisica.vy * t - 0.5 * GRAVEDAD * t * t,
    };
}

/* ------------------------------------------------------------
   4. CONVERSIÓN DE METROS A PÍXELES
   ------------------------------------------------------------
   La escala se calcula para que toda la parábola quepa en el
   lienzo, sin importar qué tan lejos llegue el proyectil.
   ------------------------------------------------------------ */

/** Crea el conversor de coordenadas físicas → coordenadas del lienzo. */
function crearEscala(fisica) {
    const anchoUtil = lienzo.width - MARGEN * 2;
    const altoUtil = lienzo.height - MARGEN * 2;

    // Metros por píxel (se toma la dimensión más exigente)
    const escalaX = fisica.alcance > 0 ? anchoUtil / fisica.alcance : 1;
    const escalaY = fisica.alturaMaxima > 0 ? altoUtil / fisica.alturaMaxima : 1;
    const escala = Math.min(escalaX, escalaY);

    return {
        aPixeles(xMetros, yMetros) {
            return {
                px: MARGEN + xMetros * escala,
                py: lienzo.height - MARGEN - yMetros * escala,
            };
        },
    };
}

/* ------------------------------------------------------------
   5. DIBUJO DE LA ESCENA
   ------------------------------------------------------------ */

/** Dibuja el fondo, el suelo y el cañón (estado inicial). */
function dibujarEscena() {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    dibujarCuadricula();
    dibujarSuelo();

    const angulo = leerAngulo();
    dibujarCanion(angulo);
}

/** Cuadrícula sutil de referencia. */
function dibujarCuadricula() {
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
    ctx.lineWidth = 1;

    for (let x = MARGEN; x < lienzo.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, lienzo.height);
        ctx.stroke();
    }
    for (let y = lienzo.height - MARGEN; y > 0; y -= 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(lienzo.width, y);
        ctx.stroke();
    }
}

/** Línea del suelo. */
function dibujarSuelo() {
    const ySuelo = lienzo.height - MARGEN;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ySuelo);
    ctx.lineTo(lienzo.width, ySuelo);
    ctx.stroke();
}

/**
 * Dibuja el cañón inclinado según el ángulo.
 * @param {number} anguloGrados  Inclinación en grados.
 */
function dibujarCanion(anguloGrados) {
    const anguloRad = (anguloGrados * Math.PI) / 180;
    const base = { x: MARGEN, y: lienzo.height - MARGEN };

    ctx.save();
    ctx.translate(base.x, base.y);

    // Tubo del cañón (rotado; en canvas el eje Y crece hacia abajo)
    ctx.rotate(-anguloRad);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, -6, LARGO_CANION, 12);
    ctx.restore();

    // Base circular del cañón
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(base.x, base.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Texto del ángulo actual
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText(anguloGrados + '°', base.x + 20, base.y - 18);
}

/**
 * Dibuja la trayectoria recorrida, el proyectil y el punto de caída.
 * @param {number} tActual  Tiempo simulado transcurrido (s).
 */
function dibujarSimulacion(tActual) {
    const { fisica, escala } = simulacion;

    dibujarEscena();

    // --- Trayectoria recorrida (línea punteada) ---
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();

    const pasos = 120;
    for (let i = 0; i <= pasos; i++) {
        const t = (tActual * i) / pasos;
        const pos = posicionEn(fisica, t);
        const { px, py } = escala.aPixeles(pos.x, pos.y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // --- Proyectil en su posición actual ---
    const posActual = posicionEn(fisica, tActual);
    const { px, py } = escala.aPixeles(posActual.x, posActual.y);

    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // --- Punto de caída (cuando la simulación terminó) ---
    if (tActual >= fisica.tiempoVuelo) {
        const caida = escala.aPixeles(fisica.alcance, 0);

        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(caida.px, caida.py, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 13px "Segoe UI", sans-serif';
        ctx.fillText('💥 ' + fisica.alcance.toFixed(1) + ' m', caida.px - 35, caida.py - 16);
    }
}

/* ------------------------------------------------------------
   6. CONTROL DE LA SIMULACIÓN
   ------------------------------------------------------------ */

/** Lee y valida el ángulo ingresado. */
function leerAngulo() {
    const valor = parseFloat(document.getElementById('inputAngulo').value);
    return isNaN(valor) ? 45 : Math.min(Math.max(valor, 1), 89);
}

/** Lee y valida la velocidad ingresada. */
function leerVelocidad() {
    const valor = parseFloat(document.getElementById('inputVelocidad').value);
    return isNaN(valor) ? 30 : Math.min(Math.max(valor, 1), 200);
}

/** Inicia el lanzamiento del proyectil. */
function lanzar() {
    cancelAnimationFrame(idAnimacion);

    const angulo = leerAngulo();
    const velocidad = leerVelocidad();
    const fisica = calcularFisica(angulo, velocidad);

    simulacion = {
        fisica,
        escala: crearEscala(fisica),
        inicio: null, // marca de tiempo real del primer frame
    };

    document.getElementById('btnLanzar').disabled = true;
    limpiarResultados();

    idAnimacion = requestAnimationFrame(animar);
}

/**
 * Bucle de animación: convierte el tiempo real transcurrido en
 * tiempo simulado, de modo que todo vuelo dure lo mismo en pantalla.
 * @param {DOMHighResTimeStamp} marcaTiempo
 */
function animar(marcaTiempo) {
    if (simulacion.inicio === null) simulacion.inicio = marcaTiempo;

    const transcurridoReal = (marcaTiempo - simulacion.inicio) / 1000;
    const progreso = Math.min(transcurridoReal / DURACION_ANIMACION, 1);
    const tSimulado = progreso * simulacion.fisica.tiempoVuelo;

    dibujarSimulacion(tSimulado);

    if (progreso < 1) {
        idAnimacion = requestAnimationFrame(animar);
    } else {
        mostrarResultados(simulacion.fisica);
        document.getElementById('btnLanzar').disabled = false;
    }
}

/** Detiene la animación y restaura el estado inicial. */
function reiniciar() {
    cancelAnimationFrame(idAnimacion);
    simulacion = null;

    document.getElementById('btnLanzar').disabled = false;
    limpiarResultados();
    dibujarEscena();
}

/* ------------------------------------------------------------
   7. SECCIÓN DE RESULTADOS
   ------------------------------------------------------------ */

/** Muestra las magnitudes calculadas con una pequeña animación. */
function mostrarResultados(fisica) {
    escribirResultado('resDistancia', fisica.alcance.toFixed(2) + ' m');
    escribirResultado('resAltura', fisica.alturaMaxima.toFixed(2) + ' m');
    escribirResultado('resTiempo', fisica.tiempoVuelo.toFixed(2) + ' s');
}

/** Escribe un valor y reproduce la animación de destello. */
function escribirResultado(id, texto) {
    const elemento = document.getElementById(id);
    elemento.textContent = texto;
    elemento.classList.remove('resultado__valor--nuevo');
    void elemento.offsetWidth; // reinicia la animación CSS
    elemento.classList.add('resultado__valor--nuevo');
}

/** Vacía la sección de resultados. */
function limpiarResultados() {
    document.getElementById('resDistancia').textContent = '—';
    document.getElementById('resAltura').textContent = '—';
    document.getElementById('resTiempo').textContent = '—';
}
