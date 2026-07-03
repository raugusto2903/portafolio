/* ============================================
   Posición Global 1
   Consulta puntos GPS de individuos (API Movebank)
   y los dibuja en un mapa Leaflet.
   ============================================ */

const URL_MOVEBANK =
    'https://www.movebank.org/movebank/service/public/json' +
    '?study_id=2911040' +
    '&individual_local_identifiers=4262-84830876' +
    '&individual_local_identifiers=1163-1163' +
    '&individual_local_identifiers=2131-2131' +
    '&sensor_type=gps';

let mapa;
let individuos = []; // datos recibidos de la API
let capaMarcadores;  // grupo de marcadores para poder limpiarlos

document.addEventListener('DOMContentLoaded', () => {
    iniciarMapa();
    consultarIndividuos();

    document.getElementById('button').addEventListener('click', generarCoordenadas);
});

/** Crea el mapa base con OpenStreetMap. */
function iniciarMapa() {
    mapa = L.map('mapid').setView([-1.3895888, -89.6209152], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
    }).addTo(mapa);

    capaMarcadores = L.layerGroup().addTo(mapa);
}

/** Descarga los individuos disponibles y llena el selector. */
function consultarIndividuos() {
    fetch(URL_MOVEBANK)
        .then((respuesta) => {
            if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
            return respuesta.json();
        })
        .then((datos) => {
            individuos = datos.individuals || [];
            const selector = document.getElementById('select');
            selector.innerHTML = '';

            individuos.forEach((individuo, i) => {
                const opcion = document.createElement('option');
                opcion.value = i;
                opcion.textContent =
                    individuo.individual_local_identifier || 'Individuo ' + (i + 1);
                selector.appendChild(opcion);
            });
        })
        .catch((error) => {
            alert('No se pudieron cargar los datos: ' + error.message);
        });
}

/** Dibuja en el mapa y en la tabla los puntos solicitados. */
function generarCoordenadas() {
    const cantidad = parseInt(document.getElementById('number').value, 10);
    const indice = parseInt(document.getElementById('select').value, 10);
    const individuo = individuos[indice];

    if (!individuo) {
        alert('Selecciona un individuo válido.');
        return;
    }
    if (!cantidad || cantidad < 1) {
        alert('Ingresa un número de puntos válido.');
        return;
    }

    // Nombre científico del individuo seleccionado
    document.getElementById('Name').textContent =
        individuo.individual_taxon_canonical_name || '—';

    const ubicaciones = individuo.locations || [];
    const totalPuntos = Math.min(cantidad, ubicaciones.length);
    const cuerpoTabla = document.getElementById('tablecordinates');
    const coordenadas = [];
    let filas = '';

    capaMarcadores.clearLayers();
    cuerpoTabla.innerHTML = '';

    for (let i = 0; i < totalPuntos; i++) {
        const lat = ubicaciones[i].location_lat;
        const lng = ubicaciones[i].location_long;

        filas += '<tr><td>' + lat + '</td><td>' + lng + '</td></tr>';
        coordenadas.push([lat, lng]);
        L.marker([lat, lng]).addTo(capaMarcadores);
    }

    cuerpoTabla.innerHTML = filas;

    // Centra el mapa sobre los puntos dibujados
    if (coordenadas.length > 0) {
        mapa.fitBounds(L.latLngBounds(coordenadas), { padding: [40, 40] });
    }
}
