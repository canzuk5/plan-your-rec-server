var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var dbCon = require('./db.js').getDB();
var request = require('request');
var app = express();
var parseString = require('xml2js').parseString;
var environmentCount = 0;

app.use('/public', express.static('www'));
app.use(bodyParser.json({ type: 'application/json', limit: '10mb' }));

app.get(/(^(?!(\/api.))(?!(public.)))\S+/, function (req, res) {
  res.sendFile(path.join(__dirname + '/www/index.html'));
});

var wantedRows = [{name: "Rainfall", row: "rainfall"},
{name: "Humidity", row: "humidity"},
{name: "Solar Radiation", row: "solar"},
{name: "Water Temperature (WQ)", row: "waterTemp"},
{name: "Air Temperature", row: "airTemp"},
{name: "Average Wind Speed", row: "windSpeed"},
{name: "Maximum Wind Speed", row: "airGust"},
{name: "E. Coli", row: "eColi"},
{name: "PM10", row: "airQuality10"},
{name: "PM2.5", row: "airQuality2_5"},
{name: "Flow", row: "flowRate"},
{name: "Turbidity (Field)", row: "turbidity"},
{name: "Enterococci", row: "enterococci"},
{name: "Chlorophyll a calculated", row: "chloroA"},
{name: "Periphyton Chlorophyll a", row: "periChloro"},
{name: "Black Disc", row: "blackDisc"},
{name: "Ammoniacal Nitrogen", row: "ammoNitro"},
{name: "Nitrite Nitrogen", row: "nitrateNitro"},
{name: "Total Nitrogen", row: "totalNitro"},
{name: "Total Kjeldahl Nitrogen", row: "totalKJ_Nitro"},
{name: "Total Phosphorus", row: "totalPhos"},
{name: "Dissolved Reactive Phosphorus", row: "dissolvedReactivePhos"},
{name: "Average Wind Direction", row: "windDirection"}];

var rowNames = [];

for (var row of wantedRows){
  rowNames.push(row.name);
}
var populateDB = function(){
  dbCon.clearLocations();
  environmentCount++;
  request('http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=SiteList&location=LatLong', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        var startedCount = 0;

        var finish = function() {console.log('Finished.')}

        var errCatcher = function(err, resultLocal){
          if (err){
            console.log(err);
          }
          if (startedCount == result.HilltopServer.Site.length){
            finish();
          } else {
          iteration();
        }
        }

        var iteration = function() {
          console.log("counter: " + startedCount +'/' + result.HilltopServer.Site.length);
          if (startedCount < result.HilltopServer.Site.length){
          var item = result.HilltopServer.Site[startedCount];
          startedCount++;
          if (item.Latitude && item.Longitude){
            var obj = {};
            obj.name = item.$.Name;
            obj.lat = item.Latitude[0];
            obj.long = item.Longitude[0];
            getLocationData(obj, errCatcher);
          } else {
            errCatcher("No Lat or long", null);
          }
        } else {
          finish();
        }
        }

        iteration();
      });
    }
  });
}

populateDB();

app.get("/api/nodes", function (req, res){
  request('http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=SiteList&location=LatLong', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        res.setHeader('Content-Type', "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(result.HilltopServer.Site));
      });
    }
  });
});

function getLocationData(baseIn, callback){
  environmentCount++;
  console.log("enviro count:" + environmentCount);
  request('http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=MeasurementList&Site=' + baseIn.name, function (error, response, body1) {
    if (!error && response.statusCode == 200) {
      parseString(body1, function (err, result) {
        if (err){
          callback(err, null);
        } else {
          var count = 0;
          var countTotal = 0;
          var countDataPoints = 0;
          var checkFin = function() {
                  console.log("checking fin: " + countDataPoints + "/" + result.HilltopServer.DataSource.length + " & " + count + "/" + countTotal);
            if (countDataPoints == result.HilltopServer.DataSource.length && count == countTotal){
              dbCon.saveNewLocation(baseIn, callback);
            }
          }
          console.log("datapoint length: " + result.HilltopServer.DataSource.length);
          if (result.HilltopServer.DataSource.length > 0){
          for (var dataPoint of result.HilltopServer.DataSource){
            console.log('starting datapoint iteration.');
            countDataPoints++;
            if (dataPoint.Measurement){
              if (dataPoint.Measurement.length > 0){
            countTotal += dataPoint.Measurement.length;
            console.log("measurement length: " + dataPoint.Measurement.length);
            for (var measurement of dataPoint.Measurement) {
              if (rowNames.indexOf(measurement.$.Name) > -1){
                requestName = measurement.$.Name;
                if (measurement.RequestAs){
                  requestName = measurement.RequestAs;
                }
                environmentCount++;
                console.log("enviro count:" + environmentCount);
                console.log("getting: " + 'http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=GetData&Site=' + baseIn.name + '&Measurement=' + requestName);
                request('http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=GetData&Site=' + baseIn.name + '&Measurement=' + requestName, function (error2, response2, body2){
                  if (!error && response.statusCode == 200) {
                    parseString(body2, function (err2, result2) {
                      if (err2){
                        console.log('http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=GetData&Site=' + baseIn.name + '&Measurement=' + requestName);
                        console.log(err2);
                      } else {
                        if (result2.Hilltop){
                          switch (result2.Hilltop.Measurement[0].DataSource[0].$.Name) {
                          case wantedRows[0].name:
                          baseIn[wantedRows[0].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[1].name:
                          baseIn[wantedRows[1].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[2].name:
                          baseIn[wantedRows[2].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[3].name:
                          baseIn[wantedRows[3].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[4].name:
                          baseIn[wantedRows[4].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[5].name:
                          baseIn[wantedRows[5].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[6].name:
                          baseIn[wantedRows[6].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[7].name:
                          baseIn[wantedRows[7].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[8].name:
                          baseIn[wantedRows[8].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[9].name:
                          baseIn[wantedRows[9].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[10].name:
                          baseIn[wantedRows[10].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[11].name:
                          baseIn[wantedRows[11].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[12].name:
                          baseIn[wantedRows[12].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[13].name:
                          baseIn[wantedRows[13].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[14].name:
                          baseIn[wantedRows[14].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[15].name:
                          baseIn[wantedRows[15].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[16].name:
                          baseIn[wantedRows[16].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[17].name:
                          baseIn[wantedRows[17].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[18].name:
                          baseIn[wantedRows[18].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[19].name:
                          baseIn[wantedRows[19].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[20].name:
                          baseIn[wantedRows[20].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[21].name:
                          baseIn[wantedRows[21].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                          case wantedRows[22].name:
                          baseIn[wantedRows[22].row] = result2.Hilltop.Measurement[0].Data[0].E.Value;
                          break;
                        }
                      } else {
                        console.log(baseIn.name);
                        console.log(result2);
                      }
                    }
                  });
                } else {
                  console.log(error);
                }
                console.log('reached end.');
                  count++;
                  checkFin();
                });
              } else {
                console.log("count added BEFORE: " + count);
                count++;
                checkFin();
              }
            }
          } else {
            console.log("count added BEFORE: " + count);
            count++;
            checkFin();
          }
          } else {

            checkFin();
          }
          }
        } else {
          checkFin();
        }
        }
        });
      } else {
        console.log('http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=MeasurementList&Site=' + baseIn.name);
        console.log(error);
        callback()
      }
    });
  }

  app.listen(80, function () {
  });
