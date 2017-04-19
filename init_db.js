////// Database //////
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://ffm.db');

/*
 *
 */
var q = conn.query('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, userID Text, userName TEXT, coordinates String, time INTEGER)', function(error, data){
  if(!error) {
    console.log("Table Created Successfully");
  }
  else{
    console.log("Error Creating Table");
  }
});
/////////////////////
