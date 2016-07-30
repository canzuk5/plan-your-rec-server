var mymap = L.map('mapid').setView([-39.542321, 176.672763], 10);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FuenVrIiwiYSI6ImNpcjhlNmltdTAwenRnN20zZzJnaGY2eW0ifQ.V53-PWoukCQNhbBG-cf2tw', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18
}).addTo(mymap);

populateMarkers();

var data = [];

function populateMarkers(){
  var cb = function(resultsIn){
    var resultParsed = JSON.parse(resultsIn);
    data = [];
    for (var loc of resultParsed.locations){
        data.push(loc);
        var circle = L.circle([loc.lat, loc.long], 200, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(mymap);
      circle.bindPopup("<b>" + loc.name + "</b>");
      circle.on("click", markerClicked);
    }
  }
  getUrl("/api/nodes", cb);
}

function markerClicked(e) {
    var locData = this.getLatLng();
    for (var loc of data) {
      if (loc.lat == locData.lat && loc.long == locData.lng) {
        console.log($('#selection'));
        $('#selection').text(JSON.stringify(loc));
        break;
      }
    }
}


function getUrl(url, cb)
{
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200)
    cb(req.responseText);
  }
  req.open("GET", url, true);
  req.send(null);
}
