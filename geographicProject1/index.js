// JavaScript Document
// crear la clase
class individuals{
    constructor(study_id, individual_local_identifier, individual_taxon_canonical_name, sensor_type_id, sensor_id, individual_id) {
        this.study_id = study_id;
        this.individual_local_identifier = individual_local_identifier;
        this.individual_taxon_canonical_name = individual_taxon_canonical_name;
        this.sensor_type_id = sensor_type_id;
        this.sensor_id = sensor_id;
        this.individual_id = individual_id;
        this.locations = [];
}
}
	/**class location{
		constructor(timestamp,location_long,location_lat){
			this.timestamp = timestamp;
			this.location_long = location_long;
			this.location_lat = location_lat;
		}
	}*/
var individual1,individual2,individual3;
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function ConsultarAnimales() {
    var p = new individuals();
	var aux;
	getJSON('https://www.movebank.org/movebank/service/public/json?study_id=2911040&individual_local_identifiers=4262-84830876&individual_local_identifiers=1163-1163&individual_local_identifiers=2131-2131&sensor_type=gps',
function(err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    //alert('Your query count: ' + data);
	  aux = JSON.stringify(data.individuals);
	  individual1 = JSON.parse(aux)[0];
	  individual2 = JSON.parse(aux)[1];
	  individual3 = JSON.parse(aux)[2];
	  select = document.getElementById('select');

for (var i = 0; i<=2; i++){
    var opt = document.createElement('option');
    opt.value = i;
	if(i==0)opt.innerHTML = 'individual1';
	if(i==1)opt.innerHTML = 'individual2';
	if(i==2)opt.innerHTML = 'individual3';
    select.appendChild(opt);
}
  }
});	
	
}


function generateCordinates(){
	var number= document.getElementById('number').value;
	var selectIndividual= document.getElementById('select').value;
	var elem2 = document.getElementById('Name');
	
	 
	if(selectIndividual==0){
		var locations =individual1.locations;
		elem2.innerHTML = individual1.individual_taxon_canonical_name;
	}
	if(selectIndividual==1){
		var locations =individual2.locations;
		elem2.innerHTML = individual2.individual_taxon_canonical_name;					
						   }
	if(selectIndividual==2){
		var locations =individual3.locations;
		elem2.innerHTML = individual3.individual_taxon_canonical_name;
						   }
	var location = locations[0];
   var number= document.getElementById('number').value;
	var selectIndividual= document.getElementById('select').value;
	var html="";
	var puntox;
	var puntoy;
    	
	var listCordinates = new Array();
	
	var cordinate =[];
	var markrCordinates;
	
	for(let i = 0 ; i < number ; i++ ){
		var cordinate =[];
		location=locations[i];
		puntoy=location.location_long;
		puntox=location.location_lat;
		html +="<tr><td>"+puntox+"</td><td>"+puntoy+"</td></tr>";
		parseFloat(puntox);
		parseFloat(puntoy);
		cordinate =[puntox,puntoy];
		//if(i==0) L.map("mapid").setView(cordinate, 1000).addTo(mymap);
		listCordinates.push(cordinate);
		markrCordinates = L.marker(cordinate)
            .addTo(mymap);
            //.bindPopup()
            //.openPopup();
	}
	var tbody = document.getElementById('tablecordinates');
	tbody.innerHTML +=html;	
	//band = 1 ;
	//alert(band);
	//sortCardinates(listCordinates);
	
}


/*function onMapClick(e) {
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
}*/