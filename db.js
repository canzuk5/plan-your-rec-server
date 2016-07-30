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
