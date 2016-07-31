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
const CONST_DB_AIR_QUALITY_25 = "airQuality25";
const CONST_DB_AIR_GUST = "airGustSpeed";
const CONST_DB_AIR_QUALITY_10 = "airQuality10";
const CONST_DB_WATER_FLOWRATE = "waterFlowrate";
const CONST_DB_WATER_TEMP = "waterTemp";
const CONST_DB_TURBIDITY = "turbidity";
const CONST_DB_E_COLI = "e_coli";
const CONST_DB_ENTEROCOCCI = "enterococci";
const CONST_DB_CHLOROPHYLL_A_CALC = "chlorophyll_a_calc";
const CONST_DB_PERIPHYTON_CHLOROPHYLL_A = "periphyton_chlorophyll_a";
const CONST_DB_BLACK_DISC = "black_disc";
const CONST_DB_AMMONIACAL_NITROGEN = "ammoniacal_nitrogen";
const CONST_DB_NITRITE_NITROGEN = "nitrite_nitrogen";
const CONST_DB_TOTAL_NITROGEN = "total_nitrogen";
const CONST_DB_TOTAL_KJ_NITROGEN = "total_kjeldahl_nitrogen";
const CONST_DB_TOTAL_PHOSPHORUS = "total_phosphorus";
const CONST_DB_DISSOLVED_REACTIVE_PHOSPHORUS = "dissolved_reactive_phosphorus";

dbCommands.saveNewLocation = function(dataIn, callback, conIn) {
  console.log("Saving location " + JSON.stringify(dataIn));
  var insertObj = {};
  insertObj[CONST_DB_SITENAME] = dataIn.name;
  insertObj[CONST_DB_LAT] = dataIn.lat;
  insertObj[CONST_DB_LONG] = dataIn.long;
  insertObj[CONST_DB_RAINFALL] = dataIn.rainfall;
  insertObj[CONST_DB_HUMIDITY] = dataIn.humidity;
  insertObj[CONST_DB_SOLAR] = dataIn.solar;
  insertObj[CONST_DB_AIR_TEMP] = dataIn.airTemp;
  insertObj[CONST_DB_WIND_SPEED] = dataIn.windSpeed;
  insertObj[CONST_DB_WIND_DIRECTION] = dataIn.windDirection;
  insertObj[CONST_DB_AIR_QUALITY_25] = dataIn.airQuality2_5;
  insertObj[CONST_DB_AIR_GUST] = dataIn.airGust;
  insertObj[CONST_DB_AIR_QUALITY_10] = dataIn.airQuality10;
  insertObj[CONST_DB_WATER_FLOWRATE] = dataIn.flowRate;
  insertObj[CONST_DB_WATER_TEMP] = dataIn.waterTemp;
  insertObj[CONST_DB_TURBIDITY] = dataIn.turbidity;
  insertObj[CONST_DB_E_COLI] = dataIn.eColi;
  insertObj[CONST_DB_ENTEROCOCCI] = dataIn.enterococci;
  insertObj[CONST_DB_CHLOROPHYLL_A_CALC] = dataIn.chloroA;
  insertObj[CONST_DB_PERIPHYTON_CHLOROPHYLL_A] = dataIn.periChloro;
  insertObj[CONST_DB_BLACK_DISC] = dataIn.blackDisc;
  insertObj[CONST_DB_AMMONIACAL_NITROGEN] = dataIn.ammoNitro;
  insertObj[CONST_DB_NITRITE_NITROGEN] = dataIn.nitrateNitro;
  insertObj[CONST_DB_TOTAL_NITROGEN] = dataIn.totalNitro;
  insertObj[CONST_DB_TOTAL_KJ_NITROGEN] = dataIn.totalKJ_Nitro;
  insertObj[CONST_DB_TOTAL_PHOSPHORUS] = dataIn.totalPhos;
  insertObj[CONST_DB_DISSOLVED_REACTIVE_PHOSPHORUS] = dataIn.dissolvedReactivePhos;

if (conIn) {
  conIn.query("INSERT INTO tblGeneral SET ?", insertObj, function(err, result){
    if (err){
      callback(err, null);
    }else {
      callback(null, true);
    }
  });
} else {
  accessConnection(function(err, conIn){
    if (err){
      callback(err, conIn);
    } else {
      conIn.query("INSERT INTO tblGeneral SET ?", insertObj, function(err, result){
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
}

dbCommands.getLocations = function(callback){
  accessConnection( function( err, conIn){
    if (err){
      callback(err, null);
    } else {
      conIn.query("SELECT * FROM tblGeneral", function(err, res){
        conIn.release();
        if (err){
          callback(err, null);
        }else {
          var result = [];

          for (var i =0; i < res.length; i++){
            var locationItem = {};
            locationItem.name = res[i][CONST_DB_SITENAME];
            locationItem.rainFall = res[i][CONST_DB_RAINFALL];
            locationItem.humidity = res[i][CONST_DB_HUMIDITY];
            locationItem.solar = res[i][CONST_DB_SOLAR];
            locationItem.lat = res[i][CONST_DB_LAT];
            locationItem.long = res[i][CONST_DB_LONG];
            locationItem.airTemp = res[i][CONST_DB_AIR_TEMP];
            locationItem.windSpeed = res[i][CONST_DB_WIND_SPEED];
            locationItem.windDirection = res[i][CONST_DB_WIND_DIRECTION];
            locationItem.airQuality25 = res[i][CONST_DB_AIR_QUALITY_25];
            locationItem.airQuality10 = res[i][CONST_DB_AIR_QUALITY_10];
            locationItem.airGust = res[i][CONST_DB_AIR_GUST];
            locationItem.waterFlow = res[i][CONST_DB_WATER_FLOWRATE];
            locationItem.waterTemp = res[i][CONST_DB_WATER_TEMP];
            locationItem.turbidity = res[i][CONST_DB_TURBIDITY];
            locationItem.eColi = res[i][CONST_DB_E_COLI];
            locationItem.enterococci = res[i][CONST_DB_ENTEROCOCCI];
            locationItem.chloroA = res[i][CONST_DB_CHLOROPHYLL_A_CALC];
            locationItem.periChloro = res[i][CONST_DB_PERIPHYTON_CHLOROPHYLL_A];
            locationItem.blackDisc = res[i][CONST_DB_BLACK_DISC];
            locationItem.ammoNitro = res[i][CONST_DB_AMMONIACAL_NITROGEN];
            locationItem.nitrateNitro = res[i][CONST_DB_NITRITE_NITROGEN];
            locationItem.totalNitro = res[i][CONST_DB_TOTAL_NITROGEN];
            locationItem.totalKJ_Nitro = res[i][CONST_DB_TOTAL_KJ_NITROGEN];
            locationItem.totalPhos = res[i][CONST_DB_TOTAL_PHOSPHORUS];
            locationItem.dissolvedReactivePhos = res[i][CONST_DB_DISSOLVED_REACTIVE_PHOSPHORUS];
            result.push(locationItem);
          }
          var output = {};
          output.locations = result;
          callback(null, output);
        }
      });
    }
  });
}

dbCommands.clearLocations = function(callback){
  accessConnection(function(err, conIn){
    if (err){
      callback(err, conIn);
    } else {
      conIn.beginTransaction(function (err){
        if (err){
          conIn.release();
          callback(err, null);
        } else {
          conIn.query("DELETE FROM tblGeneral", {}, function(err, result){
            if (err){
              conIn.rollback(function() {
                conIn.release();
                callback(err);
              });
            } else {
              callback(null, conIn);
            }
          });
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
