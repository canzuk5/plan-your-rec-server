var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var dbCon = require('./db.js').getDB();
var request = require('request');
var app = express();
var parseString = require('xml2js').parseString;

app.use('/public', express.static('www'));
app.use(bodyParser.json({ type: 'application/json', limit: '10mb' }));

app.get(/(^(?!(\/api.))(?!(public.)))\S+/, function (req, res) {
  res.sendFile(path.join(__dirname + '/www/index.html'));
});

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

app.get("/api/nodes/1", function (req, res){
	var name = "Awatoto AQ"
request('http://data.hbrc.govt.nz/Envirodata/EMAR.hts?service=Hilltop&request=MeasurementList&Site=' + name, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    parseString(body, function (err, result) {
      res.setHeader('Content-Type', "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(result.HilltopServer.DataSource));
    });
  }
});
});
app.listen(80, function () {
  console.log('Example app listening on port 3000!');
});
