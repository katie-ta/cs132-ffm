var SchemaObject = require('node-schema-object');

// Create User schema 
var User = new SchemaObject({
  id: String,
  name: String,
  email: String,
  password: String
});

User.prototype.findById = function (id, callback) {
	db.get('users', {id: id}).run(function (err, data) {
	if (err) return callback(err);
	callback(null, new User(data));
	});
}