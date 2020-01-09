var mymap = L.map('map').setView([46.524, 7.582], 8);

// Définir les différentes couches de base:
var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

// Ajouter la couche de base par défaut à la carte.
osmLayer.addTo(mymap);

var marqueurs = [];

function show_cabanes(){
  // first remove all existing markers on page
  for (var i=0; i < marqueurs.length; i++){
    mymap.removeLayer(marqueurs[i])
  }
  marqueurs = [];
  var region = $('#region').val();
  var url = '/cabanes.json';
  if(region != '') {url = '/'+region+'/cabanes.json';}
  $.getJSON(url, function(data){
    for (var i=0; i < data.length; i++){
      var cabane = data[i]
      var m = L.marker([cabane.y, cabane.x]).addTo(mymap);
      marqueurs.push(m);
    }
    console.log('cabanes.json', data);
  })
}

function show_evenements(){
  // first remove all existing markers on page
  for (var i=0; i < marqueurs.length; i++){
    mymap.removeLayer(marqueurs[i])
  }
  // empty out container
  marqueurs = [];

  var url = '/evenements.json';
  // json
  $.getJSON(url, function(data){
    for (var i=0; i < data.length; i++){
      var evenement = data[i]
      var m = L.marker([evenement.y, evenement.x]).addTo(mymap)
      m.info = evenement
      m.on('click', function(e) {
        var html = '<table cellpadding="3">';
        html += '     <tr>';
        html += '       <td><b>Name:</b></td>';
        html += '       <td>' + e.target.info.nom + '</td>';
        html += '      </tr>';
        html += '      <tr>';
        html += '        <td><b>Date:</b></td>';
        html += '        <td>' + e.target.info.date + '</td>';
        html += '      </tr>';
        html += '    </table>';
        $('.info-box').html(html);
        mymap.flyTo([e.target.info.y,e.target.info.x], 9);
        console.log(e);
      });
      marqueurs.push(m);
    }
    //console.log('evenement.json', data);
  })
}

function update_new_event(){
  var post = $.post("/form", function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
    });
  //$("#new_event_form"));
   //show_evenements();
  // show_updated_event();
}

//show_cabanes();

show_evenements();

// Print coordinates of mouse on map using mousemove from leaflet
mymap.on('mousemove',function(e){
  var coord = e.latlng;
  $('#mouse-coordonnees').html(coord.lat.toFixed(5) +' / '+ coord.lng.toFixed(5));
});

// Set coordinates for form on mouse click from leaflet
mymap.on('click', function(e){
  var coord = e.latlng;
  $('#coordonnees').html('Coordinates: ' + coord.lat.toFixed(5) +' / '+ coord.lng.toFixed(5));
  $('#lat').val(coord.lat.toFixed(4));
  $('#lng').val(coord.lng.toFixed(4));
})

// Set date to today
var date = new Date().toISOString().split('T')[0]
$('#date').val(date);

// Trigger flyto when most_recent_event button clicked
function most_recent_event() {
  $.getJSON('/evenements.json', function(data){
    var mostResentEvent = data[0]; // !!! We are using this because evenements.json is ordered by id DESC!!!
    mymap.flyTo([mostResentEvent.y, mostResentEvent.x], 12)
  })
}
