// JavaScript Document


var listCordinates= new Array();
var band ;

function generateCordinates(){
	
   var number= document.getElementById('number').value;
	var html="";
	var puntox=4.64105;
	var puntoy=-74.06273;
	parseFloat(puntox);
	parseFloat(puntoy);
	var listCordinates = new Array();
	var x;
	var y;
	var cordinate =[];
	var markrCordinates;
	var band = 0;
	for(let i = 0 ; i < number ; i++ ){
		var cordinate =[];
		band=(Math.random() * (3 - 0) + 0).toFixed(0);
		x=(Math.random() * (0.8 - 0.0200) + 0.0200);
		
		y=(Math.random() * (0.8 - 0.0200) + 0.0200);
		if(band == 1){x= x * (-1); y= y * (-1);}
		if(band == 2){x= x * (-1);}
		if(band == 3){y= y * (-1);}
		puntox += x;
		puntoy += y;
		html +="<tr><td>"+puntox+"</td><td>"+puntoy+"</td></tr>"
		cordinate =[puntox,puntoy];
		listCordinates.push(cordinate);
		markrCordinates = L.marker(cordinate)
            .addTo(mymap)
            .bindPopup()
            .openPopup();
		puntox=4.64105;
	    puntoy=-74.06273;
	}
	var tbody = document.getElementById('tablecordinates');
	tbody.innerHTML +=html;	
	band = 1 ;
	//alert(band);
	sortCardinates(listCordinates);
	
}

function sortCardinates(listCordinates){
	//alert(band);
	//$("#tableSort").remove();
	if(band === 0){
	delete_table();}
	var countNorthWest=0;
	var countNorthEast=0;
	var countSouthWest=0;
	var countSouthEast=0;
	var puntox=4.64105;
	var puntoy=-74.06273;
	
	var tbody2 = document.getElementById('tableSort');
	var html2 ="";
	for(let i = 0 ; i < listCordinates.length; i++ ){
		
		if(listCordinates[i][0]>puntox && listCordinates[i][1]>puntoy)
			{
				countNorthEast++;
				html2 +="<tr><td>"+listCordinates[i][0]+"</td><td>"+listCordinates[i][1]+"</td><td>NorthWest</td></tr>"
			}
		if(listCordinates[i][0]>puntox && listCordinates[i][1]<puntoy)
			{
				countNorthWest++;
				html2 +="<tr><td>"+listCordinates[i][0]+"</td><td>"+listCordinates[i][1]+"</td><td>NorthEast</td></tr>"
			}
		if(listCordinates[i][0]<puntox && listCordinates[i][1]<puntoy)
			{
				countSouthWest++;
				html2 +="<tr><td>"+listCordinates[i][0]+"</td><td>"+listCordinates[i][1]+"</td><td>SouthWest</td></tr>"
			}
		if(listCordinates[i][0]<puntox && listCordinates[i][1]>puntoy)
			{
				countSouthEast++;
				html2 +="<tr><td>"+listCordinates[i][0]+"</td><td>"+listCordinates[i][1]+"</td><td>SouthEast</td></tr>"
			}
		
	}
	tbody2.innerHTML +=html2;
	document.getElementById('textfield').value = countNorthWest;
	document.getElementById('textfield2').value = countNorthEast;
	document.getElementById('textfield3').value = countSouthWest;
	document.getElementById('textfield4').value = countSouthEast;

}

function onMapClick(e) {
    //alert("You clicked the map at " + e.latlng);
	var cordinateMouse =L.marker(e.latlng);
	cordinateMouse.addTo(mymap);
	var cordinate2=e.latlng.toString();
    alert(cordinate2);
	var array = cordinate2.split(',');
var b = array[0];
	b = b.replace(/[^\d.-]/g, '');
	b = parseFloat(b);
var c = array[1];
	c = c.replace(/[^\d.-]/g, '');
	c = parseFloat(c);
	var tbody3 = document.getElementById('tablecordinates');
	var html3="";
	html3 +="<tr><td>"+b+"</td><td>"+c+"</td></tr>";
	tbody3.innerHTML +=html3;
	var cordinate3=[];
	cordinate3=[b,c];
	listCordinates.push(cordinate3);
	//alert("zzzzz");
	band=0;
	sortCardinates(listCordinates);
	//alert("continuar")
	
}
function delete_table(){
   var table = document.getElementById("tableSort");
   var rowCount = table.rows.length;
   while(table.rows.length > 1) {
  table.deleteRow(1);
}
}