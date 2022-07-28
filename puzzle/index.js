// JavaScript Document
let timeout;
var auxCardFirst;
var auxCardSecond;
var cardfirst="";
var cardsecond="";
function opencard(id){
	var AuxId;
	if(id>13){
	  AuxId = id-10;	
	}
	if(id>23){
	  AuxId = id-20;	
	}
	if(id>33){
	  AuxId = id-30;	
	}
	if(id>43){
	  AuxId = id-40;	
	}
	if(id<=13){
		AuxId = id;
	}
	
	var auxCard = id.toString();
	let cardSelected = document.getElementById(auxCard);
	var card ="card"+AuxId;
	cardSelected.classList.add(card);
	timeout=setTimeout(closeCard, 1000);
	if(cardfirst===""){
		cardfirst=card;
		auxCardFirst=auxCard;
		timeout=setTimeout(closeCard, 1000);
	}
	else if(cardfirst!=="" && cardsecond===""){
		cardsecond=card;
		auxCardSecond=auxCard;
		timeout=setTimeout(closeCard, 1000);
	}
	if(cardfirst !== "" && cardsecond !== "" ){
		similarCard();
		cardfirst="";
		cardsecond="";
		timeout=setTimeout(closeCard, 1000);
	}
	timeout=setTimeout(closeCard, 1000);
}

function closeCard(){
	if(cardfirst!==""){
	let cardSelectedfirst = document.getElementById(auxCardFirst);
	cardSelectedfirst.classList.remove(cardfirst);}
	if(cardsecond!==""){
	let cardSelectedsecond = document.getElementById(auxCardSecond);
	cardSelectedsecond.classList.remove(cardsecond);}
}

function similarCard(){
	if(cardfirst===cardsecond){
	let cardSelectedfirst = document.getElementById(auxCardFirst);
	cardSelectedfirst.classList.add(cardfirst);
	let cardSelectedsecond = document.getElementById(auxCardSecond);
	cardSelectedsecond.classList.add(cardsecond);	
	alert(" SON IGUALES");
	}
	else{
		alert(" SON DIFERENTES");
		closeCard();
	}
}