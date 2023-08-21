$(document).ready(function () {
crearCascada();
});
function crearCascada(){
let  nombre="Ramiro Augusto lamilla Diaz"
const  letters= nombre.split('');
let palabra = "";
const tiempo = 1000;
let h2Element = document.getElementById('miNombre');
for (let i = 0; i < letters.length; i++) {
    setTimeout(function() {
    palabra += letters[i];
     h2Element.textContent = palabra;
    }, tiempo * i);
  }
//cascadeText.innerHTML = newTextContent;
}

 const carousel = document.querySelector('.carousel');
 const images = document.querySelectorAll('.carousel img');

let currentIndex = 0;

function showImage(index) {
     carousel.style.transform = `translateX(-${index * 10}%)`; }

 function nextImage() {
     currentIndex = (currentIndex + 1) % images.length;
     showImage(currentIndex);
 }

 function prevImage() {
     currentIndex = (currentIndex - 1 + images.length) % images.length;
     showImage(currentIndex);
 }

 // Event listeners for next and previous buttons
 document.addEventListener('DOMContentLoaded', () => {
     showImage(currentIndex);
     setInterval(nextImage, 5000); // Auto-slide every 5 seconds
 });
 function redirectTo(url) {
  window.location.href = url;
}
