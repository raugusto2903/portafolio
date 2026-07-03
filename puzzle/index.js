/* ============================================
   Puzzle de Memoria
   Encuentra las parejas de cartas iguales.
   Cartas: images/card1.png … card12.png (12 parejas)
   ============================================ */

const TOTAL_PAREJAS = 12;
const TIEMPO_VISIBLE = 900; // ms que permanecen visibles las cartas sin pareja

let primeraCarta = null;
let bloqueado = false; // evita clics mientras se ocultan cartas
let parejasEncontradas = 0;
let intentos = 0;

document.addEventListener('DOMContentLoaded', () => {
    iniciarJuego();
    document.getElementById('reiniciar').addEventListener('click', iniciarJuego);
});

/** Crea el tablero con las parejas barajadas. */
function iniciarJuego() {
    primeraCarta = null;
    bloqueado = false;
    parejasEncontradas = 0;
    intentos = 0;
    actualizarMarcador();
    document.getElementById('mensaje').textContent = '';
    document.getElementById('totalParejas').textContent = TOTAL_PAREJAS;

    // Dos copias de cada carta, barajadas
    const cartas = [];
    for (let i = 1; i <= TOTAL_PAREJAS; i++) {
        cartas.push(i, i);
    }
    barajar(cartas);

    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';

    cartas.forEach((numero) => {
        const carta = document.createElement('button');
        carta.type = 'button';
        carta.className = 'carta';
        carta.dataset.numero = numero;
        carta.setAttribute('aria-label', 'Carta boca abajo');
        carta.addEventListener('click', () => voltearCarta(carta));
        tablero.appendChild(carta);
    });
}

/** Lógica al voltear una carta. */
function voltearCarta(carta) {
    if (bloqueado) return;
    if (carta.classList.contains('carta--abierta')) return;
    if (carta.classList.contains('carta--encontrada')) return;

    mostrar(carta);

    if (!primeraCarta) {
        primeraCarta = carta;
        return;
    }

    // Segunda carta del intento
    intentos++;
    actualizarMarcador();

    if (primeraCarta.dataset.numero === carta.dataset.numero) {
        marcarPareja(primeraCarta, carta);
    } else {
        ocultarTrasPausa(primeraCarta, carta);
    }

    primeraCarta = null;
}

/** Muestra la imagen de la carta. */
function mostrar(carta) {
    carta.classList.add('carta--abierta');
    carta.style.backgroundImage = 'url("images/card' + carta.dataset.numero + '.png")';
    carta.setAttribute('aria-label', 'Carta número ' + carta.dataset.numero);
}

/** Devuelve la carta a su estado boca abajo. */
function ocultar(carta) {
    carta.classList.remove('carta--abierta');
    carta.style.backgroundImage = '';
    carta.setAttribute('aria-label', 'Carta boca abajo');
}

/** Pareja correcta: quedan visibles de forma permanente. */
function marcarPareja(cartaA, cartaB) {
    cartaA.classList.replace('carta--abierta', 'carta--encontrada');
    cartaB.classList.replace('carta--abierta', 'carta--encontrada');
    parejasEncontradas++;
    actualizarMarcador();

    if (parejasEncontradas === TOTAL_PAREJAS) {
        document.getElementById('mensaje').textContent =
            '¡Felicitaciones! Completaste el juego en ' + intentos + ' intentos. 🎉';
    }
}

/** Pareja incorrecta: se ocultan después de una pausa. */
function ocultarTrasPausa(cartaA, cartaB) {
    bloqueado = true;
    setTimeout(() => {
        ocultar(cartaA);
        ocultar(cartaB);
        bloqueado = false;
    }, TIEMPO_VISIBLE);
}

/** Actualiza parejas e intentos en pantalla. */
function actualizarMarcador() {
    document.getElementById('parejas').textContent = parejasEncontradas;
    document.getElementById('intentos').textContent = intentos;
}

/** Baraja un arreglo en el sitio (Fisher–Yates). */
function barajar(arreglo) {
    for (let i = arreglo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
    }
}
