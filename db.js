var dbCommands = {}
, mysql = require('mysql')
, pool;

connectToDB();

function saveNewLocation(dataIn, callback) {
  accessConnection(function(err, conIn){
    if (err){
      callback(err, conIn);
    } else {
      console.log("Saving location " + JSON.stringify(dataIn));
      var insertObj = {};
      insertObj.generalSiteName = dataIn.name;
      insertObj.lat = dataIn.lat;
      insertObj.long = dataIn.long;
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
