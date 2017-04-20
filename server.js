var express = require('express');
var anyDB = require('any-db');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var path = require('path');
var hogan = require('hogan.js');
var begin = require('any-db-transaction');
var http = require('http');
var bcrypt = require('bcrypt');
var fuse = require('fuse');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var passport = require('passport')
var session = require('express-session')
const LocalStrategy = require('passport-local').Strategy

var roomIds = new Set();
var userIds = new Set();
var postIds = new Set();

var posts = [];

app.use(express.static(path.join(__dirname, '/css')));
app.use(express.static(path.join(__dirname, '/imgs')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/pages'); // tell Express where to find templates, in this case the '/pages' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages
app.use(express.static(__dirname + '/scripts'));

var conn = anyDB.createConnection('sqlite3://ffm.db'); // create database connection


// stuff to use for bcrypt password encryptions
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// create message table
const createMessageTable = 'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, username TEXT, body TEXT)';
const createUserTable = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, zipcode INTEGER, email TEXT, facebook TEXT, instagram TEXT)';
const createPostTable = 'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, userEmail INTEGER, title TEXT, description TEXT, createdAt TIMESTAMP, servingSize INTEGER, perishable BOOLEAN, type TEXT, zipcode INTEGER, available BOOLEAN)';

app.use(session({secret: 'freefoodmovementsecretsecretthing'}));

// TODO: create all table schemas and query like below:
conn.query( createMessageTable , function(error, data){
  if (error != null) { console.log(error); }
});

conn.query( createUserTable , function(error, data){
  if (error != null) { console.log(error); }
});

conn.query( createPostTable , function(error, data){
  if (error != null) { console.log(error); }
});

var sess;

app.get('/register', function(request, response) {
	sess = request.session;
	console.log(sess);
	response.render('register.html');
})

app.post('/newLogin', function(request, response) {
	console.log("newlogin!!");
	var name = request.body.name;
	var zipcode = request.body.zipcode;
	var email = request.body.email;
	var facebook = 	request.body.facebook;
	var instagram = request.body.instagram;
	var sqlcheck = 'SELECT * FROM users WHERE email = $1';
	var status = "invalid email";
	conn.query(sqlcheck, [email], function(error, result) {
		if (error != null) { console.log(error); }
		if (result.rowCount === 0) {
			status = "valid";
		bcrypt.genSalt(10, function(err, salt) {
	    if (err) return next(err);
	    bcrypt.hash(request.body.password, salt, function(err, hash) {
	      if (err) return next(err);
	      console.log("encrypting");

	      // Store the user to the database, then send the response
	      var sql = 'INSERT INTO users(name, password, zipcode, email, facebook, instagram) VALUES ($1, $2, $3, $4, $5, $6)';
	      conn.query(sql, [name, hash, zipcode, email, facebook, instagram], function(error, result) {
	      	if (error != null) { console.log(error); }
	      	request.session.email = email;
	      	console.log("successfully added to db");
	      	response.json({status:"success"});
	      })
	    });
		})
	} else {
		response.json({status: "invalid email"});
	}
	})
});

app.get('/login', function(request, response) {
	response.render('login.html');
})

app.post('/checkLogin', function(request, response) {
	sess = request.session;
	var email = request.body.email;
	var password = request.body.password;
	var sql = 'SELECT password FROM users where email = $1'

	conn.query(sql, [email], function(error, result) {
		if(error!= null) { console.log(error); }
		var hash = result.rows[0].password;
		console.log(hash);
		bcrypt.compare(password, hash, function(err, res) {
	    	// res == true 
	    	console.log(res);
	    	sess.email = email;
	    	response.json({status: "success"});
		});
	})
	
});

app.get('/logout', function(request, response) {
	console.log("destroying session");
	request.session.destroy();
})

// get the home page
app.get('/', function(request, response) {
	sess = request.session;
	console.log("session email: " + sess.email);
	if (sess.email) {
		console.log("there's an email!!!");
		response.render('home.html');
	} else {
		console.log("no one's logged in :(");
		response.render("signin.html");
	}

	// TODO: query database for all available posts, default sorted by createdAt column
	var q = 'SELECT * FROM posts WHERE available == true';

	// TODO: when a user wants to re-sort, requery database and order by something else?
  
})

app.get('/about', function(request , response) {
	sess = request.session;
	console.log("session email: " + session);
	if (request.session.email) {
		response.render('about.html');
	} else {
		response.redirect('/login');
	}
	
})


app.get('/createpost', function(request,response) {
	console.log("create post server");
	console.log("session email: " + request.session.email);
	if (request.session.email) {
		;
		response.render('createpost.html');
	} else {
		response.redirect('/login');
	}
})

app.post('/savepost', function(request, response) {
	var description = request.body.description;
	var title = request.body.title;
	var createdAt = request.body.createdAt;
	var zipcode = request.body.zipcode;
	var servingSize = request.body.servingSize;
	console.log(description);
	console.log(title);
	console.log(createdAt);
	console.log(zipcode);
  
  	var sql = 'INSERT INTO posts(userEmail, title, description, createdAt, servingSize, perishable, type, zipcode, available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  	conn.query(q, [request.session.email,  title, description, 
  		createdAt, servingSize, perishable, type, zipcode, available], function(error, result) {
        if (error != null) { console.log(error); }
      });
  // posts (id INTEGER PRIMARY KEY AUTOINCREMENT, userEmail INTEGER, title TEXT, description TEXT, createdAt TIMESTAMP, 
  // servingSize INTEGER, perishable BOOLEAN, type TEXT, zipcode INTEGER, available BOOLEAN)

})

app.get('/search', function(request, response) {
	if (request.session.email) {
		

		
	} else {
		response.redirect('/login');
	}
	// catches the search form stuff
	// TODO: get search information
	// run some sort of search algorithm on all of the posts

	// TODO : look for some sort of search api that will work? OR manually search all posts?

	// TODO:  redirect to search results page (after Yuri makes it)

	// TODO: create foodPost div, insert all information, append it to results div
	var posts = [];
	var searchOptions = request.body.options;
	var q = 'SELECT * FROM posts WHERE available == true AND searchOptions.';

	var query = conn.query(q);
	query.on('row', function(){

		var post = {

			id: row.id,
			title: row.title,
			decription: decription.title

		}
		posts.push(post);

	});

	var options = {
	  shouldSort: true,
	  threshold: 0.6,
	  location: 0,
	  distance: 100,
	  maxPatternLength: 32,
	  minMatchCharLength: 1,
	  keys: [
	    "title",
	    "author.firstName"
	]
	};

	// var fuse = new Fuse(posts, options); // "list" is the item array
	// var result = fuse.search("old ma");

	response.json(result);
	response.render('search.html');

});

app.get('/sortNewest', function(request, response) {
	// use sort-by package by npm

	response.render('home.html');
})

app.get('/sortClosest', function(request, response) {
	// use sort-by package by npm

	response.render('home.html');
})

app.get('/sortRating', function(request, response) {
	// use sort-by package by npm
	response.render('home.html');

})

app.get('/profile', function(request, response) {
	sess = request.session;
	if (sess.email) {

		response.render('profile.html');
	} else {
		response.render('signin.html');
	}
  
})



// TODO: create get requests for each page:

// get request for profile.html (for someone's profile)
app.get('/profile/posts', function(request, response) {
	var user = request.user;
	var posts = [];
	var userID = 1; // replace later with actual user id via authentication
	var sql = 'SELECT * FROM posts WHERE userId == $1 AND available == true'
	var availablePosts = conn.query(sql, [user.id]);
	availablePosts.on('row', function(request, response){
    var thisId = row.id;
  	var thisTitle = row.title;
  	var thisDescription = row.description;
  	var thisTime = row.createdAt;
  	var thisType = row.type;

		var post = {
      id: thisId,
			title: thisTitle,
			description: thisDescription,
			time: thisTime,
			type: thisType
		}

		  posts.push(post);
		})

	q.on('end', function(){
	 response.json(posts);
	});

	


	// TODO: load all posts that belong this person
	// if the post is active, append it to the active posts div
	// TODO: add "active posts div"



	// if the post is inactive, append it to previous posts div
	// TODO: get rid of reviews div, add previous posts div (which should be the same styling
	// as foodFeed)

	// TODO: get all of user's social media links and embed them
})





server.listen(8080, function() {
  console.log("Listening on port 8080");
});
