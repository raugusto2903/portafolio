/* ============================================
   Portafolio — JavaScript principal
   Sin dependencias externas (vanilla JS)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    escribirNombre();
    iniciarMenuMovil();
    iniciarAnimacionTarjetas();
    actualizarAnio();
});

/**
 * Efecto máquina de escribir para el nombre del hero.
 * (Versión mejorada del antiguo efecto "cascada", sin jQuery)
 */
function escribirNombre() {
    const nombre = 'Ramiro Augusto Lamilla Díaz';
    const elemento = document.getElementById('miNombre');
    if (!elemento) return;

    const velocidad = 90; // ms por letra
    let indice = 0;

    const escribir = () => {
        if (indice < nombre.length) {
            elemento.textContent += nombre.charAt(indice);
            indice++;
            setTimeout(escribir, velocidad);
        }
    };

    escribir();
}

/**
 * Menú hamburguesa para móvil/tablet.
 * Se cierra al hacer clic en un enlace.
 */
function iniciarMenuMovil() {
    const boton = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!boton || !menu) return;

    boton.addEventListener('click', () => {
        const abierto = menu.classList.toggle('navbar__nav--abierto');
        boton.setAttribute('aria-expanded', abierto);
    });

    menu.querySelectorAll('.navbar__link').forEach((enlace) => {
        enlace.addEventListener('click', () => {
            menu.classList.remove('navbar__nav--abierto');
            boton.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * Las tarjetas de proyecto aparecen suavemente
 * cuando entran en pantalla (IntersectionObserver).
 */
function iniciarAnimacionTarjetas() {
    const tarjetas = document.querySelectorAll('.tarjeta');

    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada, i) => {
                if (entrada.isIntersecting) {
                    // Pequeño retraso escalonado entre tarjetas
                    setTimeout(() => {
                        entrada.target.classList.add('tarjeta--visible');
                    }, i * 100);
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    tarjetas.forEach((tarjeta) => observador.observe(tarjeta));
}

/** Año actual en el footer, siempre al día. */
function actualizarAnio() {
    const anio = document.getElementById('anioActual');
    if (anio) anio.textContent = new Date().getFullYear();
}
