var dbCommands = {}
, mysql = require('mysql')
, pool;

connectToDB();

const CONST_DB_SITENAME = "generalSiteName";
const CONST_DB_LAT = "lat";
const CONST_DB_LONG = "long";
const CONST_DB_RAINFALL = "generalRainfall";
const CONST_DB_HUMIDITY = "generalHumidity";
const CONST_DB_SOLAR = "generalSolarRad";
const CONST_DB_AIR_TEMP = "airTemp";
const CONST_DB_WIND_SPEED = "airWindSpeed";
const CONST_DB_WIND_DIRECTION = "airWindDirection";
const CONST_DB_AIR_QUALITY_25 = "airQuality2.5";
const CONST_DB_AIR_GUST = "airGustSpeed";
const CONST_DB_AIR_QUALITY_10 = "airQuality10";
const CONST_DB_WATER_DEPTH = "waterDepth";
const CONST_DB_WATER_FLOWRATE = "waterFlowrate";
const CONST_DB_WATER_QUALITY = "waterQuality";
const CONST_DB_WATER_TEMP = "waterTemp";
const CONST_DB_WATER_SWELL = "waterSwell";
const CONST_DB_WATER_TIDE = "waterTide";

dbCommands.saveNewLocation = function(dataIn, callback) {
  accessConnection(function(err, conIn){
    if (err){
      callback(err, conIn);
    } else {
      console.log("Saving location " + JSON.stringify(dataIn));
      var insertObj = {};
      insertObj[CONST_DB_SITENAME] = dataIn.name;
      insertObj[CONST_DB_LAT] = dataIn.lat;
      insertObj[CONST_DB_LONG] = dataIn.long;
      insertObj[CONST_DB_RAINFALL] = dataIn.rainfall;
      insertObj[CONST_DB_HUMIDITY] = dataIn.humidity;
      insertObj[CONST_DB_SOLAR] = dataIn.solar;
      insertObj[CONST_DB_AIR_TEMP] = dataIn.airTemp;
      conIn.query("INSERT INTO contact SET ?", contactObj, function(err, result){
        conIn.release();
        if (err){
          callback(err, null);
        }else {
          callback(null, true);
        }
      });
    }
  });
}

function accessConnection(callback){
  pool.getConnection(function(err, connection){
    if (err) {
      if (connection){
        connection.release();
      }
      callback(err, null);
    } else {
      connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
          connectToDB();
        } else {
          throw err;
        }
      });
      callback(null, connection);
    }
  });
}

function connectToDB(){
  pool = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'node',
    password : 'nodeThrowawayPa$$word',
    database : 'canzuk'
  });
}

module.exports = {
  getDB: function(){
    return dbCommands;
  }
}
