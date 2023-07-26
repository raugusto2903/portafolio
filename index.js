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
cascadeText.innerHTML = newTextContent;
}