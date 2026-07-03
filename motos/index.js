/* ============================================
   Horario de Motociclistas
   Genera 24 franjas de media hora (desde las 8:00)
   Clic: asigna un motociclista · Doble clic: lo libera
   ============================================ */

const TOTAL_MOTOCICLISTAS = 8;
const TOTAL_FRANJAS = 24;

class Motociclista {
    constructor(numeracion) {
        this.numeracion = numeracion;
        this.activo = false;
    }
}

const motociclistas = [];
let disponibles = TOTAL_MOTOCICLISTAS;

document.addEventListener('DOMContentLoaded', () => {
    crearMotociclistas();
    crearHorario();
});

/** Crea la lista inicial de motociclistas. */
function crearMotociclistas() {
    for (let i = 0; i < TOTAL_MOTOCICLISTAS; i++) {
        motociclistas.push(new Motociclista(i + 1));
    }
}

/** Genera las franjas horarias de media hora a partir de las 8:00 AM. */
function crearHorario() {
    const cuerpo = document.getElementById('box');
    let hora = 8;
    let filas = '';

    for (let i = 0; i < TOTAL_FRANJAS; i++) {
        const horaEntera = Math.floor(hora);
        const minutos = i % 2 === 1 ? '30' : '00';
        const sufijo = hora < 12 ? 'AM' : 'PM';
        const hora12 = horaEntera > 12 ? horaEntera - 12 : horaEntera;
        const etiqueta = hora12 + ':' + minutos + ' ' + sufijo;

        filas += '<tr><td id="franja-' + i + '">' +
                 '<span>' + etiqueta + '</span>' +
                 '<span class="spant" id="franja-' + i + '-span"></span>' +
                 '</td></tr>';

        hora += 0.5;
    }

    cuerpo.innerHTML = filas;

    // Eventos de asignación (clic) y liberación (doble clic)
    cuerpo.querySelectorAll('td').forEach((celda) => {
        celda.addEventListener('click', () => asignarMotociclista(celda));
        celda.addEventListener('dblclick', () => liberarFranja(celda));
    });
}

/** Asigna el primer motociclista libre a la franja seleccionada. */
function asignarMotociclista(celda) {
    const etiqueta = celda.querySelector('.spant');

    if (etiqueta.textContent !== '') return; // franja ya ocupada

    const libre = motociclistas.find((moto) => !moto.activo);

    if (!libre) {
        etiqueta.textContent = '';
        alert('No hay motociclistas disponibles.');
        return;
    }

    libre.activo = true;
    disponibles--;

    etiqueta.textContent = 'MOTOCICLISTA ' + libre.numeracion;
    celda.classList.add('ocupado', 'imgmoto');
    actualizarContador();
}

/** Libera la franja y devuelve el motociclista a la lista de disponibles. */
function liberarFranja(celda) {
    const etiqueta = celda.querySelector('.spant');
    const texto = etiqueta.textContent;

    if (texto === '') return; // franja ya libre

    const numero = parseInt(texto.split(' ')[1], 10);
    const moto = motociclistas.find((m) => m.numeracion === numero);

    if (moto) {
        moto.activo = false;
        disponibles++;
    }

    etiqueta.textContent = '';
    celda.classList.remove('ocupado', 'imgmoto');
    actualizarContador();
}

/** Refresca el contador visible de motociclistas disponibles. */
function actualizarContador() {
    document.getElementById('contadorDisponibles').textContent = disponibles;
}
