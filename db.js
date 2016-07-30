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
      conIn.query("INSERT INTO contact SET ?", contactObj, function(err, result){
        conIn.release();
        if (err){
          callback(err, null);
        }else {
          var output = {};
          output.contacts = result;
          callback(null, {msg: "Contact added"});
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
    user : 'test',
    password : 'PASSWORD HERE',
    database : '?'
  });
}

module.exports = {
  getDB: function(){
    return dbCommands;
  }
}
