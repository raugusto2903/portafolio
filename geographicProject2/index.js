/* ============================================
   Posición Global 2
   Genera puntos aleatorios alrededor de un punto
   medio, los dibuja en el mapa y los clasifica
   por cuadrante (NO, NE, SO, SE).
   ============================================ */

const PUNTO_MEDIO = [4.64105, -74.06273]; // Bogotá

let mapa;
let capaMarcadores;
let listaCoordenadas = [];

document.addEventListener('DOMContentLoaded', () => {
    iniciarMapa();
    document.getElementById('button').addEventListener('click', generarCoordenadas);
});

/** Crea el mapa base con el punto medio marcado. */
function iniciarMapa() {
    mapa = L.map('mapid').setView(PUNTO_MEDIO, 9);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
    }).addTo(mapa);

    // Punto medio de referencia con círculo y ejes
    L.circle(PUNTO_MEDIO, { radius: 100000, color: '#38bdf8' }).addTo(mapa);
    L.marker(PUNTO_MEDIO).addTo(mapa).bindTooltip('Punto medio').openTooltip();

    const [lat, lng] = PUNTO_MEDIO;
    L.polyline([[lat - 1, lng], [lat + 1, lng]], { color: '#e2e8f0' }).addTo(mapa); // eje vertical
    L.polyline([[lat, lng - 1], [lat, lng + 1]], { color: '#e2e8f0' }).addTo(mapa); // eje horizontal

    capaMarcadores = L.layerGroup().addTo(mapa);

    // Clic en el mapa: agrega un punto manual
    mapa.on('click', alHacerClicEnMapa);
}

/** Genera N puntos aleatorios alrededor del punto medio. */
function generarCoordenadas() {
    const cantidad = parseInt(document.getElementById('number').value, 10);

    if (!cantidad || cantidad < 1) {
        alert('Ingresa un número de puntos válido.');
        return;
    }

    listaCoordenadas = [];
    capaMarcadores.clearLayers();
    document.getElementById('tablecordinates').innerHTML = '';

    let filas = '';

    for (let i = 0; i < cantidad; i++) {
        // Desplazamiento aleatorio entre 0.02 y 0.8 grados, con signo aleatorio
        const desplazamientoLat = numeroAleatorio(0.02, 0.8) * signoAleatorio();
        const desplazamientoLng = numeroAleatorio(0.02, 0.8) * signoAleatorio();

        const lat = PUNTO_MEDIO[0] + desplazamientoLat;
        const lng = PUNTO_MEDIO[1] + desplazamientoLng;

        filas += '<tr><td>' + lat.toFixed(5) + '</td><td>' + lng.toFixed(5) + '</td></tr>';
        listaCoordenadas.push([lat, lng]);
        L.marker([lat, lng]).addTo(capaMarcadores);
    }

    document.getElementById('tablecordinates').innerHTML = filas;
    clasificarPorCuadrante();
}

/** Agrega un punto donde el usuario hace clic. */
function alHacerClicEnMapa(evento) {
    const lat = evento.latlng.lat;
    const lng = evento.latlng.lng;

    L.marker([lat, lng]).addTo(capaMarcadores);

    const fila = '<tr><td>' + lat.toFixed(5) + '</td><td>' + lng.toFixed(5) + '</td></tr>';
    document.getElementById('tablecordinates').innerHTML += fila;

    listaCoordenadas.push([lat, lng]);
    clasificarPorCuadrante();
}

/** Clasifica cada punto según su cuadrante respecto al punto medio. */
function clasificarPorCuadrante() {
    const [latMedio, lngMedio] = PUNTO_MEDIO;
    const contadores = { NO: 0, NE: 0, SO: 0, SE: 0 };
    let filas = '';

    listaCoordenadas.forEach(([lat, lng]) => {
        let cuadrante;

        if (lat > latMedio) {
            cuadrante = lng > lngMedio ? 'Noreste' : 'Noroeste';
        } else {
            cuadrante = lng > lngMedio ? 'Sureste' : 'Suroeste';
        }

        if (cuadrante === 'Noroeste') contadores.NO++;
        if (cuadrante === 'Noreste') contadores.NE++;
        if (cuadrante === 'Suroeste') contadores.SO++;
        if (cuadrante === 'Sureste') contadores.SE++;

        filas += '<tr><td>' + lat.toFixed(5) + '</td><td>' + lng.toFixed(5) +
                 '</td><td>' + cuadrante + '</td></tr>';
    });

    document.getElementById('tableSort').innerHTML = filas;
    document.getElementById('textfield').value = contadores.NO;
    document.getElementById('textfield2').value = contadores.NE;
    document.getElementById('textfield3').value = contadores.SO;
    document.getElementById('textfield4').value = contadores.SE;
}

/* ---------- Utilidades ---------- */
function numeroAleatorio(min, max) {
    return Math.random() * (max - min) + min;
}

function signoAleatorio() {
    return Math.random() < 0.5 ? -1 : 1;
}
