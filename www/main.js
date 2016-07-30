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
    if (resultParsed){
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
  }
  getUrl("/api/nodes", cb);
}

function markerClicked(e) {
    var locData = this.getLatLng();
    for (var loc of data) {
      if (loc.lat == locData.lat && loc.long == locData.lng) {
        console.log($('#selection'));
        parseData(loc);
        break;
      }
    }
}

function parseData(dataIn){
  if (dataIn.name !== null){
    $('#dataName').show();
    $('#dataName').text("Station name: " + dataIn.name);
  } else {
    $('#dataName').hide();
  }

  if (dataIn.rainFall !== null){
    $('#dataRain').show();
    $('#dataRain').text("Rainfall: " + dataIn.rainFall + "mm");
  } else {
    $('#dataRain').hide();
  }

  if (dataIn.humidity !== null){
    $('#dataHumidity').show();
    $('#dataHumidity').text("Humidity: " + dataIn.humidity + "%");
  } else {
    $('#dataHumidity').hide();
  }

  if (dataIn.solar !== null){
    $('#dataSolar').show();
    $('#dataSolar').text("Solar Radiation: " + dataIn.solar + "");
  } else {
    $('#dataSolar').hide();
  }

  if (dataIn.airTemp !== null){
    $('#dataAirTemp').show();
    $('#dataAirTemp').text("Air Temperature: " + dataIn.airTemp + "°C");
  } else {
    $('#dataAirTemp').hide();
  }

  if (dataIn.windSpeed !== null){
    $('#dataWindSpeed').show();
    $('#dataWindSpeed').text("Wind Speed: " + dataIn.windSpeed + "");
  } else {
    $('#dataWindSpeed').hide();
  }

  if (dataIn.windDirection !== null){
    $('#dataWindDirection').show();
    $('#dataWindDirection').text("Wind Direction: " + dataIn.windDirection + "°");
  } else {
    $('#dataWindDirection').hide();
  }

  if (dataIn.airQuality10 !== null){
    $('#dataAirQuality10').show();
    $('#dataAirQuality10').text("Air Quality 10: " + dataIn.airQuality10 + "");
  } else {
    $('#dataAirQuality10').hide();
  }

  if (dataIn.airQuality25 !== null){
    $('#dataAirQuality25').show();
    $('#dataAirQuality25').text("Air Quality 25: " + dataIn.airQuality25 + "");
  } else {
    $('#dataAirQuality25').hide();
  }

  if (dataIn.airGust !== null){
    $('#dataAirGust').show();
    $('#dataAirGust').text("Air Gust: " + dataIn.airGust + "");
  } else {
    $('#dataAirGust').hide();
  }

  if (dataIn.waterFlow !== null){
    $('#dataWaterFlow').show();
    $('#dataWaterFlow').text("Water Flow: " + dataIn.waterFlow + "");
  } else {
    $('#dataWaterFlow').hide();
  }

  if (dataIn.waterTemp !== null){
    $('#dataWaterTemp').show();
    $('#dataWaterTemp').text("Water Temperature: " + dataIn.waterTemp + "°C");
  } else {
    $('#dataWaterTemp').hide();
  }

  if (dataIn.turbidity !== null){
    $('#dataTurbidity').show();
    $('#dataTurbidity').text("Turbidity: " + dataIn.turbidity + "");
  } else {
    $('#dataTurbidity').hide();
  }

  if (dataIn.eColi !== null){
    $('#dataEcoli').show();
    $('#dataEcoli').text("E Coli: " + dataIn.eColi + "");
  } else {
    $('#dataEcoli').hide();
  }

  if (dataIn.enterococci !== null){
    $('#dataEnterococci').show();
    $('#dataEnterococci').text("Enterococci: " + dataIn.enterococci + "");
  } else {
    $('#dataEnterococci').hide();
  }

  if (dataIn.chloroA !== null){
    $('#dataChroloA').show();
    $('#dataChroloA').text("Chlorophyll A: " + dataIn.chloroA + "");
  } else {
    $('#dataChroloA').hide();
  }

  if (dataIn.periChloro !== null){
    $('#dataPeriChloro').show();
    $('#dataPeriChloro').text("Periphyton Chlorophyll A: " + dataIn.periChloro + "");
  } else {
    $('#dataPeriChloro').hide();
  }

  if (dataIn.blackDisc !== null){
    $('#dataBlackDisc').show();
    $('#dataBlackDisc').text("Black Disck: " + dataIn.blackDisc + "");
  } else {
    $('#dataBlackDisc').hide();
  }

  if (dataIn.ammoNitro !== null){
    $('#dataAmmoNitro').show();
    $('#dataAmmoNitro').text("Ammoniacal Nitrogen: " + dataIn.ammoNitro + "");
  } else {
    $('#dataAmmoNitro').hide();
  }

  if (dataIn.nitrateNitro !== null){
    $('#dataNitrateNitro').show();
    $('#dataNitrateNitro').text("Nitrate Nitrogen: " + dataIn.nitrateNitro + "");
  } else {
    $('#dataNitrateNitro').hide();
  }

  if (dataIn.totalNitro !== null){
    $('#dataTotalNitro').show();
    $('#dataTotalNitro').text("Total Nitrogen: " + dataIn.totalNitro + "");
  } else {
    $('#dataTotalNitro').hide();
  }

  if (dataIn.totalKJ_Nitro !== null){
    $('#dataTotalKJ_Nitro').show();
    $('#dataTotalJ_Nitro').text("Total KJ Nitrogen: " + dataIn.totalKJ_Nitro + "");
  } else {
    $('#dataTotalKJ_Nitro').hide();
  }

  if (dataIn.totalPhos !== null){
    $('#dataTotalPhos').show();
    $('#dataTotalPhos').text("Total Phosphorus: " + dataIn.totalPhos + "");
  } else {
    $('#dataTotalKJ_Nitro').hide();
  }

  if (dataIn.dissolvedReactivePhos !== null){
    $('#dataDissolvedPhos').show();
    $('#dataDissolvedPhos').text("Dissolved Reactive Phosphorus: " + dataIn.dissolvedReactivePhos + "");
  } else {
    $('#dataDissolvedPhos').hide();
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
