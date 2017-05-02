var assert = require('assert');
var anyDB = require('any-db');
var chakram = require('chakram');
var expect = require('chai').expect;
var chai = require('chai');
var request = require('request');

var baseUrl = "http://localhost:8000";


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

// describe('NewLogin', function() {
// 	var db = anyDB.createConnection('sqlite3://ffm.db');
// 	var name = "Person Who doesn't exist in db!";
// 	var zipcode = 92692;
// 	var email = "john_smith@brown.edu";
// 	var facebook = 	"facebookurl";
// 	var instagram = "instagramurl";
// 	var sqlcheck = 'SELECT * FROM users WHERE email = $1';
// 	var status = "invalid email";

// 	beforeEach(function(done) {
// 	    db.clear(function(err) {
// 	      if (err) return done(err);
// 	    });
// 	  });

// 	describe ("Check in db", function () {
		
// 	})

// 	conn.query(sqlcheck, [email], function(error, result) {
// 		if (error != null) { console.log(error); }

// 		if (result.rowCount === 0) {
// 			status = "valid";
// 		bcrypt.genSalt(10, function(err, salt) {
// 	    if (err) return next(err);
// 	    bcrypt.hash(request.body.password, salt, function(err, hash) {
// 	      if (err) return next(err);
// 	      console.log("encrypting");

// 	      // Store the user to the database, then send the response
// 	      var sql = 'INSERT INTO users(name, password, zipcode, email, facebook, instagram) VALUES ($1, $2, $3, $4, $5, $6)';
// 	      conn.query(sql, [name, hash, zipcode, email, facebook, instagram], function(error, result) {
// 	      	if (error != null) { console.log(error); }
// 	      	request.session.email = email;
// 	      	console.log("successfully added to db");
// 	      	response.json({status:"success"});
// 	      })
// 	    });
// 		})
// 	} else {
// 		response.json({status: "invalid email"});
// 	}
// 	})

// })

var url = 'http://localhost:8080';


describe('Server response', function() {

	it("returns status 200", function(done) {
      request.get(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        console.log(response.body);
        done();
      });
    });
it("returns status 200 for logins", function(done) {
      request.get(url + '/login', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();

      });
    });
it("returns status 200 for register", function(done) {
      request.get(url + '/register', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();

      });
    });
it("returns status 404 for fake url", function(done) {

      request.get(url + '/registeres', function(error, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      });
    });

});




// app.post('/newLogin', function(request, response) {
// 	console.log("newlogin!!");
// 	var name = request.body.name;
// 	var zipcode = request.body.zipcode;
// 	var email = request.body.email;
// 	var facebook = 	request.body.facebook;
// 	var instagram = request.body.instagram;
// 	var sqlcheck = 'SELECT * FROM users WHERE email = $1';
// 	var status = "invalid email";
// 	conn.query(sqlcheck, [email], function(error, result) {
// 		if (error != null) { console.log(error); }
// 		if (result.rowCount === 0) {
// 			status = "valid";
// 		bcrypt.genSalt(10, function(err, salt) {
// 	    if (err) return next(err);
// 	    bcrypt.hash(request.body.password, salt, function(err, hash) {
// 	      if (err) return next(err);
// 	      console.log("encrypting");

// 	      // Store the user to the database, then send the response
// 	      var sql = 'INSERT INTO users(name, password, zipcode, email, facebook, instagram) VALUES ($1, $2, $3, $4, $5, $6)';
// 	      conn.query(sql, [name, hash, zipcode, email, facebook, instagram], function(error, result) {
// 	      	if (error != null) { console.log(error); }
// 	      	request.session.email = email;
// 	      	console.log("successfully added to db");
// 	      	response.json({status:"success"});
// 	      })
// 	    });
// 		})
// 	} else {
// 		response.json({status: "invalid email"});
// 	}
// 	})
// });