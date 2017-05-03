var express = require('express');
var anyDB = require('any-db');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var path = require('path');
var hogan = require('hogan.js');
var begin = require('any-db-transaction');
var http = require('http');
var bcrypt = require('bcrypt');
var Fuse = require('fuse.js');

var app = express();
var server = http.createServer(app);
var session = require('express-session');
var sortBy = require('sort-by');

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
const createMessageTable = 'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, room INTEGER, user TEXT, body TEXT, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);';
const createUserTable = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, zipcode INTEGER, email TEXT, facebook TEXT, instagram TEXT, description TEXT)';
const createPostTable = 'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, userEmail INTEGER, title TEXT, description TEXT, createdAt TIMESTAMP, servingSize INTEGER, perishable BOOLEAN, type TEXT, zipcode INTEGER, available BOOLEAN)';
const createRoomsTable = 'CREATE TABLE IF NOT EXISTS rooms (id INTEGER PRIMARY KEY, user1 TEXT, user2 TEXT, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);';

app.use(session({secret: 'freefoodmovementsecretsecretthing'}));

// create all table
conn.query( createMessageTable , function(error, data){
  if (error != null) { console.log(error); }
});

conn.query( createUserTable , function(error, data){
  if (error != null) { console.log(error); }
});

conn.query( createPostTable , function(error, data){
  if (error != null) { console.log(error); }
});

conn.query( createRoomsTable , function(error, data){
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
	conn.query(sqlcheck, [email], function(error, result) {
		if (error != null) { console.log(error); }
		if (result.rowCount === 0) {
			// email doesn't exist!! add to database and encrypt password
			status = "valid";
			bcrypt.genSalt(10, function(err, salt) {
		    if (err) return next(err);
		    // encrypts password
		    bcrypt.hash(request.body.password, salt, function(err, hash) {
		      if (err) return next(err);
		      console.log("encrypting");

		      // Store the user to the database, then send the response
		      var sql = 'INSERT INTO users(name, password, zipcode, email, facebook, instagram) VALUES ($1, $2, $3, $4, $5, $6)';
		      conn.query(sql, [name, hash, zipcode, email, facebook, instagram], function(error, result) {
		      	if (error != null) { console.log(error); }
		      	request.session.email = email;
		      	request.session.userId = result.lastInsertId;
		      	console.log("successfully added to db");
		      	response.json({status:"success"});
		      })
		    });
			})
		} else {
			// email already exists
			response.json({status: "invalid email"});
		}
	})
});

app.get('/login', function(request, response) {
	response.render('login.html');
})

app.post('/checkLogin', function(request, response) {
	console.log(request);
	var email = request.body.email;
	var password = request.body.password;
	var sql = 'SELECT * FROM users where email = $1'

	conn.query(sql, [email], function(error, result) {
		if(error!= null) { console.log(error); }

		if (result.rowCount == 0) {
			// TODO: display error message on client side if
			// login doesn't exist and/or redirect user to create
			// an account
			response.json({status: "login does not exist"});
		} else {
				var hash = result.rows[0].password;
				console.log(hash);
				bcrypt.compare(password, hash, function(err, res) {
			    	// res == true 
			    	console.log(res);
			    	request.session.email = email;
			    	request.session.userId = result.rows[0].id;
			    	response.json({status: "success"});
				});
		}
		
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
		response.render('home.html', {currentUser: sess.email});
	} else {
		console.log("no one's logged in :(");
		response.render("signin.html");
	}
  
})

app.get('/getAllPosts', function(request,response) {
	console.log("getting all posts");
	var q = 'select posts.id, posts.title, posts.description, posts.createdAt, posts.zipcode, users.name, users.email, users.id as userId from users, posts where posts.userEmail = users.email and posts.available = 1;';
	conn.query(q, function(err, result) {
		// add each post to global posts array to use in sort-by
		response.json(result);
	});

})

app.get('/about', function(request , response) {
	sess = request.session;
	console.log("session email: " + request.session.email);
	if (request.session.email) {
		response.render('about.html');
	} else {
		response.redirect('/login');
	}
	
})

app.post('/post', function(request, response) {
	if (request.session.email) {
		response.json({postId: request.body.postId});
	} else {
		response.redirect('/login');
	}
})

app.get('/post=:postId', function(request, response) {
	if (request.session.email) {
		response.render('post.html', {postId:  request.params.postId, userEmail: request.session.email})
	} else {
		response.redirect('/login');
	}
	
});

app.post('/getPostInfo', function(request, response) {
	const sql = 'select * from users, posts where posts.id = $1 and posts.userEmail = users.email'
	conn.query(sql, [request.body.postId], function(error, result) {
		console.log(result.rows[0]);
		response.json(result.rows[0]);
	})
})


app.get('/createpost', function(request,response) {
	console.log("create post server");
	if (request.session.email) {
		response.render('createpost.html');
	} else {
		response.redirect('/login');
	}
})

app.post('/savepost', function(request, response) {
	const title = request.body.title;
	const description = request.body.description;
	const createdAt = request.body.createdAt;
	const servingSize = request.body.servingSize;
	const perishable = request.body.perishable;
	const type = request.body.type;
	const zipcode = request.body.zipcode;
	console.log(description);
	console.log(title);
	console.log(createdAt);
	console.log(zipcode);
  
  	const q = 'INSERT INTO posts(userEmail, title, description, createdAt, servingSize, perishable, type, zipcode, available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  	conn.query(q, [request.session.email,  title, description, 
  		createdAt, servingSize, perishable, type, zipcode, true], function(error, result) {
        if (error != null) { console.log(error); }
        response.json({status: "success"});
      });

})

app.get('/search', function(request, response) {
	if (request.session.email) {
		response.render('search.html', {state: request.session.state});
	} else {
		response.redirect('/login');
	}
	
	

});

app.post('/getSearchResults', function(request, response){
	var posts = []// list of all applicable posts
	var searchOptions = request.body;// list of all search options sent over from client-side
	if (searchOptions){
		console.log('1');
		console.log(searchOptions.perishable + ' ' + searchOptions.foodType);
	} else { console.log('request is empty');}

	var q = 'SELECT posts.id, posts.userEmail, posts.title, posts.description, posts.createdAt, posts.zipcode,'
	q += ' users.id as userId, users.name as userName FROM posts, users WHERE posts.available = 1 AND users.email = posts.userEmail';

	if(searchOptions.perishable == 1){
		console.log("perishable conditional");
		q += ' AND perishable = "true" ';
	}

	if (searchOptions.foodType == 'snack'){
		console.log("snack clicked");
		q += ' AND type = "snack" '; 
	}

	if (searchOptions.foodType == 'meal'){
		q += ' AND type = "meal" '; 
	}

	if (searchOptions.foodType == 'produce'){
		q += ' AND type = "produce" ' ; 
	}
	if(searchOptions.zipcode != 0 ){
		console.log("zipcode"+ searchOptions.zipcode);
		console.log("zipcode fired");
		q += ' AND zipcode == ' + searchOptions.zipcode;


	}

	if(searchOptions.zipcode != 0 ){
		console.log("zipcode"+ searchOptions.zipcode);
		console.log("zipcode fired");
		q += ' AND zipcode = ' + searchOptions.zipcode;
	}

	var query = conn.query(q, function(error, result){
		if (error != null) { console.log(error); }
		console.log("loop entered");
		console.log("result " + result);

		if (result) {
			console.log("result rows " + result.rowCount);
			for (var i = 0; i < result.rowCount; i++) {
				console.log(result.rows[i].perishable);
				var post = {
					id: result.rows[i].id, // assignments
					title: result.rows[i].title,
					description: result.rows[i].description,
					zipcode : result.rows[i].zipcode,
					createdAt : result.rows[i].createdAt,
					userName : result.rows[i].userName,
					userId : result.rows[i].userId
					}
				console.log("New JSON Post created");
				posts.push(result.rows[i]);
			}
		}

	console.log("posts as of now" + posts);

	var options = { // list of options that need to be provided to fuse.js for search to occur
		  shouldSort: true,
		  threshold: 0.6,
		  location: 0,
		  distance: 100,
		  maxPatternLength: 32,
		  minMatchCharLength: 1,
		  keys: [
		    "title", // the keys that are searched
		    "description"
			]
		};

	console.log("posts as of FUSE" + posts);
	var fuse = new Fuse(posts, options); // "list" is the item array

	console.log(posts);
	console.log(searchOptions.keywords);
	var result = fuse.search(searchOptions.keyword); // search is conducted and result should be all matching json object;

	console.log();
	 if(searchOptions.keyword == ""){ //if there are no keywords return all posts
		 console.log(posts);
		 response.json(posts);
	 } else {
	 	console.log("fjkdal;fjka;gja; here");
		response.json(result); // results should be sent back as a response
	 }

	} );

} )

app.get('/sortNewest', function(request, response) {
	// use sort-by package by npm

	var q = 'select posts.id, posts.title, posts.description, posts.createdAt, posts.zipcode, users.name, users.email, users.id as userId from users, posts where posts.userEmail = users.email and posts.available = 1;';
	conn.query(q, function(err, result) {
		// add each post to global posts array to use in sort-by
		result.sort(sortBy('createdAt'));
		response.json(result);
	});
	response.render('home.html');
})

app.get('/sortClosest', function(request, response) {
	// use sort-by package by npm

	response.render('home.html');
})

// get request for profile.html (for someone's profile)
app.post("/profile/posts", function(request, response) {
	// sess = request.session;
	console.log("profile posts");
	var sql = 'SELECT posts.id, posts.title, posts.description, posts.zipcode, users.email, posts.createdAt, users.name FROM posts, users WHERE users.id = $1 AND posts.userEmail = users.email AND posts.available = 1'
	var posts = []
	console.log("user id?? " + request.body.userId);
	conn.query(sql, [request.body.userId], function(error, result) {
		// console.log(result);
		if (error != null) { console.log(error); }
			for (var i = 0; i < result.rowCount; i++) {
				console.log(result.rows[i]);
				posts.push(result.rows[i]);
			}
			response.json(result);
	});
})

// get request for profile.html (for someone's profile)
app.post("/profile/userInfo", function(request, response) {
	console.log("getting profile user info");
	var sql = 'SELECT * FROM users WHERE id = $1'
	conn.query(sql, [request.body.userId], function(error, result) {
		response.json(result.rows[0]);
	});
})

app.get('/myProfile', function(request, response) {
	if (request.session.email) {
		console.log(request.session);
		response.render('profile.html', {userId: request.session.userId, userEmail: request.session.email});
	} else {
		response.redirect('/');
	}
})

app.post('/profile', function(request, response) {
	if (request.session.email) {
		// var userId;
		var sql = 'SELECT * FROM users WHERE email = $1'
		conn.query(sql, [request.body.email], function(error, result) {
			// userId = result.rows[0].id;
			console.log(result.rows[0]);
			response.json(result.rows[0]);
		});
		
	} else {
		response.redirect('/');
	}
})

app.get('/profile=:userId', function(request, response) {
	console.log("profile: userid!!?? : " + request.params.userId);
	response.render('profile.html', {userId: request.params.userId, userEmail: request.params.email});

})

app.post('/updateUserInfo', function(request, response) {
	var sql = 'UPDATE users SET name = $1, zipcode = $2, description = $3 WHERE id = $4;'
	conn.query(sql, [request.body.name, request.body.zipcode, request.body.description, request.body.userId], function(err, res) {
		if(err != null) { console.log(err); }
		response.json({status: "success"});
	})
})

// var getRoom = 'SELECT name FROM rooms WHERE name=$1;';
// var getMessages = 'SELECT * FROM messages WHERE room=$1;';
 var checkChat = 'SELECT * FROM rooms WHERE (user1=$1 AND user2=$2) OR (user1=$2 AND user2=$1);';
// var updateMostRecent = 'UPDATE rooms SET time=$1 WHERE room=$2;';
var addNewRoom = 'INSERT INTO rooms VALUES(NULL, $1, $2, CURRENT_TIMESTAMP);';
var addNewMessage = 'INSERT INTO messages VALUES(NULL, $1, $2, $3, CURRENT_TIMESTAMP);';
// var getUserId = 'SELECT id FROM rooms WHERE name=$1;';

app.post("/saveMessage", function(request, response) {
  var q = conn.query(checkChat, [request.session.email, request.body.receiver], function(err, res) {
  	if (err != null) { console.log(err); }
  	console.log(res);
  	if(res.rowCount == 0) {
  		conn.query(addNewRoom, [request.session.email, request.body.receiver], function(err, res) {
  			if (err != null) { console.log(err); }
  			console.log("new room added??");
  			room = res.lastInsertId;
  			console.log("last insert id: " + res.lastInsertId);
  			conn.query(addNewMessage, [room, request.session.email, request.body.body], function(err, res) {
  				if (err != null) { console.log(err) ;}
  				response.json({status: "success"});
  			})
  		});
  	} else {
  		console.log("current room num? " + res.rows[0])
  		conn.query(addNewMessage, [res])
  	}
  })
})

app.get('/messages', function(request, response) {
	if (request.session.email) {
		console.log("messages!!!");
		var q = conn.query('SELECT * FROM rooms WHERE userEmail1 = $1 OR userEmail2 = $1 ORDERBY time ', [request.session.email], function(error, result) {
			if (error != null) { console.log(error); }
			q.on('row', function(row) {
				console.log(row);
			})
		});
		// q.on('row', function(row){
	 //   	 var firstRoom = row.name;
		// });
		response.render('messages.html', {roomName: ""});
	} else {
		response.redirect('/');
	}
})

server.listen(8080, function() {
  console.log("Listening on port 8080");
});
