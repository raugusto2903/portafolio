var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);


	

class Motociclista{
	constructor(Activo,numeracion){
		this.Activo = Activo;
		this.numeracion = numeracion;
	}
}
var motos = new Array();
var times = new Array(); // time array


function CrearHorario(){
	var hh = 8,hi; 
	for (var i=0;i<24; i++) {
		    hi=hh;
		    hi = Math.floor(hh);
			var mm = 0; // start time
  			if (i % 2 == 1){mm = "30"}
		    else {mm = "00"}
		    var time ="";
		    time =  hi + ":" + mm + " ";
	        if(hh < 12)  {time += "AM"}
		    else {time += "PM"}
  			times.push(time);
  			hh =  hh + 0.5;
}
		var prueba ="";
	    var tables = document.getElementById('box');
	    prueba =""
		for(var j=0 ; j < times.length ; j++){
			prueba += '<tr><td id="'+ j +'" onclick= "asignarMotociclistas(this.id);"ondblclick="desasignarMoto(this.id);" >' + times[j] + '<span style="margin-left: 10px;" id="'+j+'span" value="8"></span></td></tr>';
		}
	    
	    
	//alert(prueba);
    tables.innerHTML += prueba;    
}
function crearMotociclistas(){
	for(let i = 0 ; i < 8 ; i++ )
		{
			var Activo= false;
			var numeracion = i;
			var aux = new Motociclista(Activo,numeracion);
			motos.push(aux);	
			//alert(aux.Activo+aux.numeracion);
		}
}
window.crearMotociclistas();
var cont=8;
function asignarMotociclistas(id){
	var key = id.toString();
	var elemento = document.getElementById(key);
	
	var auxId=key+"span";
    var spanAux =document.getElementById(auxId);
	var texto = spanAux.textContent;
	let aux=0;
	for(let x=0 ; x < motos.length ; x++){
		//alert("si hay motociclistas");
		if(motos[x].Activo===false && texto === "" ){
		  if(cont != 0){
				 motos[x].Activo = true ;
				 spanAux.innerHTML += "MOTOCICLISTA "+motos[x].numeracion;
				 spanAux.classList.add('spant');
			  	elemento.setAttribute('style', 'background-color:red');
   				 elemento.classList.add('imgmoto');
				 cont --;
			     alert(cont);
				break;
		  }else if(cont == 0){
				alert("no hay motociclistas");
		  }
		}		
	}
	
}

function desasignarMoto(id){
	var key = id.toString();
	var elemento = document.getElementById(key);
	var auxId=key+"span";
	var spanAux =document.getElementById(auxId);
	var numeroMoto =spanAux.textContent;
	alert(numeroMoto);
	const myArray = numeroMoto.split(" ");
	var number = myArray[1];
	var elemento = document.getElementById(key);
	spanAux.classList.remove("spant");
	spanAux.innerHTML = "";
	elemento.classList.remove("imgmoto");
	elemento.setAttribute('style', 'background-color:cornflowerblue');
	alert(number);
	motos[parseInt(number)].Activo = false;
	cont++;
	alert(cont);
}

