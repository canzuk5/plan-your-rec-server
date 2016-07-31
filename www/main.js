var mymap = L.map('mapid').setView([-39.542321, 176.672763], 10);
var minWind = $('#windSpeedMin');
var maxWind = $('#windSpeedMax');

var maxHumidity = $('#humidityMax');
var minHumidity = $('#humidityMin');

var maxTemp = $('#airTempMax');
var minTemp = $('#airTempMin');

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FuenVrIiwiYSI6ImNpcjhlNmltdTAwenRnN20zZzJnaGY2eW0ifQ.V53-PWoukCQNhbBG-cf2tw', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18
}).addTo(mymap);

populateMarkers();

var data = [];

const CONST_STATUS_PASSED = "passed";
const CONST_STATUS_UNSAFE = "unsafe";
const CONST_STATUS_PARTIAL = "partial";
const CONST_STATUS_NONE = "none";

$(document).ready(function() {
    $('select').material_select();
    minWind.change(function() {
      updateMarkers();
    });
    maxWind.change(function() {
      updateMarkers();
    });
    maxHumidity.change(function() {
      updateMarkers();
    });
    minHumidity.change(function() {
      updateMarkers();
    });
    maxTemp.change(function() {
      updateMarkers();
    });
    minTemp.change(function() {
      updateMarkers();
    });
  });

function populateMarkers(){
  var cb = function(resultsIn){
    var resultParsed = JSON.parse(resultsIn);
    data = [];
    if (resultParsed){
    for (var loc of resultParsed.locations){
      loc.status = "";
      data.push(loc);
    }
    updateMarkers();
  }
  }
  getUrl("/api/nodes", cb);
}

function updateMarkers() {
  for (var loc of data){
    var windPassed = false;
    var humidityPassed = false;
    var tempPassed = false;
    var isSafe = checkSafe(loc);

if (isSafe){

    if (loc.airTemp != null){
      if (loc.airTemp > minTemp.val() && loc.airTemp < maxTemp.val()){
        tempPassed = true;
      }
    }

    if (loc.humidity != null){
      if (loc.humidity > minHumidity.val() && loc.humidity < maxHumidity.val()){
        humidityPassed = true;
      }
    }

    if (loc.windSpeed != null){
      if (loc.windSpeed > minWind.val() && loc.windSpeed < maxWind.val()){
        windPassed = true;
      }
    }

    if (windPassed && humidityPassed && tempPassed){
      loc.status = CONST_STATUS_PASSED;
    } else if (windPassed || humidityPassed || tempPassed) {
      loc.status = CONST_STATUS_PARTIAL;
    } else {
      loc.status = CONST_STATUS_NONE;
    }
  } else {
    loc.status = CONST_STATUS_UNSAFE;
  }
  buildMarker(loc);
  }
}

function buildMarker(dataIn) {
  if (dataIn.circle){
    mymap.removeLayer(dataIn.circle);
  }
  var circle = L.circle([dataIn.lat, dataIn.long], 500, styleMarkerColour(dataIn.status)).addTo(mymap);
  circle.bindPopup(buildPopUp(dataIn));
  circle.on("click", markerClicked);
  dataIn.circle = circle;
}

function styleMarkerColour(statusIn) {
  var output = {};
  if (statusIn == CONST_STATUS_UNSAFE) {
    output.color = '#ca0020';
    output.fillColour = "#ca0020";
    output.fillOpacity = 0.5;
  } else if (statusIn == CONST_STATUS_PASSED) {
    output.color = '#0571b0';
    output.fillColour = "#0571b0";
    output.fillOpacity = 0.75;
  } else if (statusIn == CONST_STATUS_PARTIAL) {
    output.color = '#92c5de';
    output.fillColour = "#92c5de";
    output.fillOpacity = 0.40;
  } else {
    output.color = '#f4a582';
    output.fillColour = "#f4a582";
    output.fillOpacity = 0.25;
  }
  return output;
}

function buildPopUp(dataIn) {
  console.log(dataIn);
  var output = "";
  if (dataIn.status == CONST_STATUS_UNSAFE) {
    output += '<div><p>' + dataIn.name + '</p><i class="small material-icons md-red right">warning</i><p>The conditions here are risky.</p></div>'
  } else if (dataIn.status == CONST_STATUS_PASSED) {
    output += '<div><p>' + dataIn.name + '</p><i class="small material-icons md-green right">done_all</i><p>This matches all of your filters.</p></div>'
  } else if (dataIn.status == CONST_STATUS_PARTIAL) {
    output += '<div><p>' + dataIn.name + '</p><i class="small material-icons md-green right">done</i><p>This matches some of your filters.</p></div>'

  } else {
    output += '<div><p>' + dataIn.name + '</p><i class="small material-icons right">sync_problem</i><p>Not enough data or doesn\'t match your filters.</p></div>'

  }
  console.log(output);
  return output;
}

function checkSafe(dataIn) {
  if (dataIn.eColi !== null){
    if (dataIn.eColi > 88){
      return false
    } else {
      return true;
    }
  } else {
    return true;
  }
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
    $('#dataRain').text("Rainfall: " + dataIn.rainFall + " mm");
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
    $('#dataSolar').text("Solar Radiation: " + dataIn.solar + " W/m²");
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
    $('#dataWindSpeed').text("Wind Speed: " + dataIn.windSpeed + " km/h");
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
    $('#dataAirQuality10').text("Air Quality PM10: " + dataIn.airQuality10 + " μg/m³");
  } else {
    $('#dataAirQuality10').hide();
  }

  if (dataIn.airQuality25 !== null){
    $('#dataAirQuality25').show();
    $('#dataAirQuality25').text("Air Quality PM2.5: " + dataIn.airQuality25 + " μg/m³");
  } else {
    $('#dataAirQuality25').hide();
  }

  if (dataIn.airGust !== null){
    $('#dataAirGust').show();
    $('#dataAirGust').text("Air Gust: " + dataIn.airGust + " km/h");
  } else {
    $('#dataAirGust').hide();
  }

  if (dataIn.waterFlow !== null){
    $('#dataWaterFlow').show();
    $('#dataWaterFlow').text("Water Flow: " + dataIn.waterFlow + " m³/s");
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
    $('#dataTurbidity').text("Turbidity: " + dataIn.turbidity + " NTU");
  } else {
    $('#dataTurbidity').hide();
  }

  if (dataIn.eColi !== null){
    $('#dataEcoli').show();
    $('#dataEcoli').text("E. Coli: " + dataIn.eColi + " CFU/100 mL");
  } else {
    $('#dataEcoli').hide();
  }

  if (dataIn.enterococci !== null){
    $('#dataEnterococci').show();
    $('#dataEnterococci').text("Enterococci: " + dataIn.enterococci + " CFU/100 mL");
  } else {
    $('#dataEnterococci').hide();
  }

  if (dataIn.chloroA !== null){
    $('#dataChroloA').show();
    $('#dataChroloA').text("Chlorophyll A: " + dataIn.chloroA + " mg/m²");
  } else {
    $('#dataChroloA').hide();
  }

  if (dataIn.periChloro !== null){
    $('#dataPeriChloro').show();
    $('#dataPeriChloro').text("Periphyton Chlorophyll A: " + dataIn.periChloro + " mg/m²");
  } else {
    $('#dataPeriChloro').hide();
  }

  if (dataIn.blackDisc !== null){
    $('#dataBlackDisc').show();
    $('#dataBlackDisc').text("Black Disc: " + dataIn.blackDisc + " m");
  } else {
    $('#dataBlackDisc').hide();
  }

  if (dataIn.ammoNitro !== null){
    $('#dataAmmoNitro').show();
    $('#dataAmmoNitro').text("Ammoniacal Nitrogen: " + dataIn.ammoNitro + " mg/L");
  } else {
    $('#dataAmmoNitro').hide();
  }

  if (dataIn.nitrateNitro !== null){
    $('#dataNitrateNitro').show();
    $('#dataNitrateNitro').text("Nitrate Nitrogen: " + dataIn.nitrateNitro + " mg/L");
  } else {
    $('#dataNitrateNitro').hide();
  }

  if (dataIn.totalNitro !== null){
    $('#dataTotalNitro').show();
    $('#dataTotalNitro').text("Total Nitrogen: " + dataIn.totalNitro + " mg/L");
  } else {
    $('#dataTotalNitro').hide();
  }

  if (dataIn.totalKJ_Nitro !== null){
    $('#dataTotalKJ_Nitro').show();
    $('#dataTotalJ_Nitro').text("Total KJ Nitrogen: " + dataIn.totalKJ_Nitro + " mg/L");
  } else {
    $('#dataTotalKJ_Nitro').hide();
  }

  if (dataIn.totalPhos !== null){
    $('#dataTotalPhos').show();
    $('#dataTotalPhos').text("Total Phosphorus: " + dataIn.totalPhos + " mg/L");
  } else {
    $('#dataTotalKJ_Nitro').hide();
  }

  if (dataIn.dissolvedReactivePhos !== null){
    $('#dataDissolvedPhos').show();
    $('#dataDissolvedPhos').text("Dissolved Reactive Phosphorus: " + dataIn.dissolvedReactivePhos + " mg/L");
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
