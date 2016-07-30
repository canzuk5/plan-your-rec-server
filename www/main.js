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
    for (var loc of resultParsed){
      if (loc.Latitude && loc.Longitude){
        data.push(loc);
      var marker = L.marker([loc.Latitude[0], loc.Longitude[0]]).addTo(mymap);
      marker.bindPopup("<b>" + loc.$.Name + "</b>");
      marker.on("click", markerClicked)
    } else {
      console.log(JSON.stringify(loc));
    }
    }
  }
  getUrl("/api/nodes", cb);
}

function markerClicked(e) {
    var locData = this.getLatLng();
    for (var loc of data) {
      if (loc.Latitude[0] == locData.lat && loc.Longitude[0] == locData.lng) {
        console.log($('#selection'));
        $('#selection').text(loc.$.Name);
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
