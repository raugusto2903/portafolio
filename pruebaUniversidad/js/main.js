// Alternar menú en móviles
const mobileMenu = document.getElementById("mobile-menu");
const navList = document.querySelector(".nav-list");

mobileMenu.addEventListener("click", () => {
    navList.classList.toggle("active");
});

// Asegurar que el menú se muestra cuando el tamaño de pantalla es mayor a 768px
window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        navList.style.display = "flex"; // Mostrar menú en pantallas grandes
    } else {
        navList.style.display = "none"; // Ocultar en móviles hasta que se active
    }
});

// Scroll suave para los enlaces
document.querySelectorAll('.nav-list a').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 70, 
            behavior: 'smooth'
        });

        // Cerrar menú en móviles después de hacer clic
        if (window.innerWidth < 768) {
            navList.classList.remove("active");
        }
    });
});



// Botón para mostrar/ocultar formulario
document.getElementById("btn1").addEventListener("click", function() {
    let form = document.getElementById("formContainer");
    form.classList.toggle("hidden");
});

// Manejo del formulario
document.getElementById("subscribeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();

    // Expresión regular para validar el nombre (solo letras y espacios)
    let nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    
    // Expresión regular para validar el correo electrónico
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validación del nombre
    if (!nameRegex.test(name)) {
        alert("⚠️ El nombre solo puede contener letras y espacios. No se permiten números ni caracteres especiales.");
        return;
    }

    // Validación del correo electrónico
    if (!emailRegex.test(email)) {
        alert("⚠️ Ingresa un correo electrónico válido. Ejemplo: usuario@dominio.com");
        return;
    }

    alert("¡Gracias por suscribirte!");
    document.getElementById("formContainer").classList.add("hidden");
});

// Cerrar el formulario al hacer clic en la "X"
document.getElementById("closeForm").addEventListener("click", function() {
    document.getElementById("formContainer").classList.add("hidden");
});

// Cerrar el formulario al hacer clic fuera de él
window.addEventListener("click", function(event) {
    let formContainer = document.getElementById("formContainer");
    if (event.target === formContainer) {
        formContainer.classList.add("hidden");
    }
});


// Seleccionar el botón
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Mostrar el botón cuando el usuario haga scroll hacia abajo
window.addEventListener("scroll", function () {
    if (window.scrollY > 300) { // Aparece después de 300px de scroll
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

// Volver arriba al hacer clic en el botón
scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Hace el desplazamiento suave
    });
});
