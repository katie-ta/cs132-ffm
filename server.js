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
var uniqid = require('uniqid');

var app = express();
var aws = require('aws-sdk');
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

var AWS_ACCESS_KEY = ""
var AWS_SECRET_KEY = ''
var S3_BUCKET = 'freefoodmvment'

// stuff to use for bcrypt password encryptions
const saltRounds = 10;

const createUserTable = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, zipcode TEXT, email TEXT, facebook TEXT, instagram TEXT, description TEXT, img TEXT)';
const createPostTable = 'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, userEmail INTEGER, title TEXT, description TEXT, createdAt TIMESTAMP, servingSize INTEGER, perishable BOOLEAN, type TEXT, zipcode TEXT, available BOOLEAN, img1 TEXT, img2 TEXT, img3 TEXT, img4 TEXT)';


app.use(session({
	secret: 'freefoodmovementsecretsecretthing',
	resave: true,
    saveUninitialized: true}));

conn.query( createUserTable , function(error, data){
  if (error != null) { console.log(error); }
});

conn.query( createPostTable , function(error, data){
  if (error != null) { console.log(error); }
});

var sess;
function generateImgUrl(id) {
	return 'https://s3.amazonaws.com/' + S3_BUCKET + '/' + id;
}


app.get('/sign', function(req, res) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

  var unique_id = uniqid();
  console.log("unique id : " + unique_id);
  var s3 = new aws.S3()
  var options = {
    Bucket: S3_BUCKET,
    Key: unique_id,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', options, function(err, data){
    if(err) return res.send('Error with S3')

    res.json({
      signed_request: data,
      url: generateImgUrl(unique_id)
    })
  })
})

app.get('/register', function(request, response) {
	response.render('register.html');
})

app.post('/newLogin', function(request, response) {
	console.log("newlogin!!");
	var name = request.body.name;
	var zipcode = request.body.zipcode;
	var email = request.body.email;
	var facebook = 	request.body.facebook;
	var instagram = request.body.instagram;
	var img = request.body.img;
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
		      var sql = 'INSERT INTO users(name, password, zipcode, email, facebook, instagram, img) VALUES ($1, $2, $3, $4, $5, $6, $7)';
		      conn.query(sql, [name, hash, zipcode, email, facebook, instagram, img], function(error, result) {
		      	if (error != null) { console.log(error); }
		      	request.session.email = email;
		      	request.session.userId = result.lastInsertId;
		      	request.session.zipcode = zipcode;
		      	request.session.userImg = img;
		      	console.log("successfully added to db");
		      	response.json({status:"success"});
		      })
		    });
			})
		} else {
			// email already exists
      console.log("email already exists");
			response.json({status: "invalid email"});
		}
	})
});

app.get('/login', function(request, response) {
	response.render('login.html');
})

app.post('/checkLogin', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
	var sql = 'SELECT * FROM users where email = $1'

	conn.query(sql, [email], function(error, result) {
		if(error!= null) { console.log(error); }

		if (result.rowCount == 0) {
			response.json({status: "login does not exist"});
		} else {
				var hash = result.rows[0].password;
				console.log(hash);
				console.log("password : " + password);
				bcrypt.compare(password, hash, function(err, res) {
			    	// res == true
			    	console.log(res);
			    	if (res) {
			    		request.session.email = email;
			    	request.session.userId = result.rows[0].id;
			    	request.session.zipcode = result.rows[0].zipcode;
			    	request.session.userImg = result.rows[0].img;
			    	response.json({status: "success"});
			    	} else {
			    		response.json({status: "incorrect password"});
			    	}
			    	
				});
		}
	})

});

app.get('/logout', function(request, response) {
	console.log("destroying session");
	request.session.destroy();
	response.redirect("/");
})

// get the home page
app.get('/', function(request, response) {
	console.log("session email: " + request.session.email);
	if (request.session.email) {
		console.log("there's an email!!!");
		response.render('home.html', {currentUser: request.session.email, userImg: request.session.userImg});
	} else {
		console.log("no one's logged in :(");
		response.render("signin.html");
	}

})

// get all available posts for home page
app.get('/getAllPosts', function(request,response) {
	console.log("getting all posts");
	var q = 'select posts.id, posts.title, posts.description, posts.createdAt, posts.zipcode, users.name, users.email, users.img, users.id as userId from users, posts where posts.userEmail = users.email and posts.available = 1;';
	conn.query(q, function(err, result) {
		// add each post to global posts array to use in sort-by
		posts = [];//clears out posts so that the posts array wont have multiple copies of the same post each time this get request is made
		if (err != null) { console.log(err); }
		console.log("loop entered");
		console.log("result " + result);

		if (result) {
			for (var i = 0; i < result.rowCount; i++) {
				console.log(result.rows[i].perishable);
				var post = {
					id: result.rows[i].id, // assignments
					title: result.rows[i].title,
					description: result.rows[i].description,
					zipcode : result.rows[i].zipcode,
					createdAt : result.rows[i].createdAt,
					userName : result.rows[i].userName,
					userId : result.rows[i].userId,
					userEmail: result.rows[i].email,
					img: result.rows[i].img
					}

				posts.push(result.rows[i]);
			}
		}
		response.json(result);
	});

})

app.get('/about', function(request , response) {
	sess = request.session;
	console.log("session email: " + request.session.email);
	if (request.session.email) {
		response.render('about.html', {userImg: request.session.userImg});
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
		response.render('post.html', {postId:  request.params.postId, userEmail: request.session.email, userImg: request.session.userImg})
	} else {
		response.redirect('/login');
	}
});

app.post('/getPostInfo', function(request, response) {
	const sql = 'select posts.*, users.id as userId from users, posts where posts.id = $1 and posts.userEmail = users.email'
	conn.query(sql, [request.body.postId], function(error, result) {
		console.log(result.rows[0]);
		response.json(result.rows[0]);
	})
})


app.get('/createpost', function(request,response) {
	console.log("create post server");
	if (request.session.email) {
		response.render('createpost.html', {userImg: request.session.userImg});
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
  const img1 = request.body.img1;
  const img2 = request.body.img2;
  const img3 = request.body.img3;
  const img4 = request.body.img4;
	console.log(description);
	console.log(title);
	console.log(createdAt);
	console.log(zipcode);

  	const q = 'INSERT INTO posts(userEmail, title, description, createdAt, servingSize, perishable, type, zipcode, available, img1, img2, img3, img4) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';
  	conn.query(q, [request.session.email,  title, description,
  		createdAt, servingSize, perishable, type, zipcode, true, img1, img2, img3, img4], function(error, result) {
        if (error != null) { console.log(error); }
        response.json({status: "success"});
      });

})

app.post('/updatePostInfo', function(request, response) {
  console.log("UPDATES: ");
  console.log(request.body);
  var sql = 'UPDATE posts SET title = ?, description = ?, zipcode = ?, type = ?, perishable = ?, servingSize = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ? WHERE id = ?';
  conn.query(sql, [request.body.title, request.body.description, request.body.zipcode, request.body.type, request.body.perishable, request.body.servingSize,
  request.body.img1, request.body.img2, request.body.img3, request.body.img4,request.body.postId], function(error, result) {
    if (error != null) { console.log(error); }
    response.json({status: "success"});
  })

})

app.post('/deletePost', function(request, response) {
  console.log("deleting post");
  var sql = 'UPDATE posts SET available = 0 WHERE id = ?';
  console.log("with id " + request.body.postId);
  conn.query(sql, [request.body.postId], function(error, result) {
    if (error != null) { console.log(error); }
    response.json({status: "success"});
  })
})

app.get('/search', function(request, response) {
	if (request.session.email) {
		response.render('search.html', {state: request.session.state, userImg: request.session.userImg});
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
	q += 'users.img, users.id as userId, users.name as userName FROM posts, users WHERE posts.available = 1 AND users.email = posts.userEmail';

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
		q += ' AND posts.zipcode = ' + searchOptions.zipcode;


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

		// add each post to global posts array to use in sort-by
		console.log(posts);
		posts.sort(sortBy('createdAt'));
		response.json(posts);
})

app.get('/sortOldest', function(request, response) {
	// use sort-by package by npm
		console.log(posts);
		posts.sort(sortBy('-createdAt'));
		response.json(posts);
})

function sortLocations(zipcodes, current) {
  function dist(z) {
  	let key = "PAdMI2aJADbKcHNNHOrJoiqMYuekK5fAFtmoww879kRm1F9ItAsSSTERoTb8YrIE"
  	console.log("current " + current);
  	console.log("z.zipcode " + z.zipcode);
  	let url = "https://www.zipcodeapi.com/rest/" + key + "/distance.json/" + current +  "/" + z.zipcode +"/km"
    console.log("url : " + url);
    app.get(url, function(request, response) {
    	console.log(response);
    	console.log("distance from " + current + " to " + z + ": " + response.distance);
    	return response.distance;
    })
  }

  zipcodes.sort(function(z1, z2) {
    return dist(z1) - dist(z2);
  });
}

app.get('/sortClosest', function(request, response) {
	// use sort-by package by npm
	if (request.session) {

		let currZipcode = request.session.zipcode;

		let key = "PAdMI2aJADbKcHNNHOrJoiqMYuekK5fAFtmoww879kRm1F9ItAsSSTERoTb8YrIE"
			let url = "https://www.zipcodeapi.com/rest/" + key + "/distance.json/" + currZipcode +  "/" + 92692 +"/km"
		  console.log("url : " + url);
		app.get(url, function(request, response) {
			console.log("response" + response);
			console.log("distance from " + current + " to " + z + ": " + response.distance);
			// return response.distance;
		})
		console.log('curr zip ' + currZipcode);
		var q = 'select zipcode from posts where available = 1;';
		conn.query(q, function(err, result) {
			// add each post to global posts array to use in sort-by
			console.log(result.rows);
			result.rows.forEach(function(z) {
				console.log("zipcode z " + z.zipcode);
				let key = "PAdMI2aJADbKcHNNHOrJoiqMYuekK5fAFtmoww879kRm1F9ItAsSSTERoTb8YrIE"
					let url = "https://www.zipcodeapi.com/rest/" + key + "/distance.json/" + currZipcode +  "/" + z.zipcode +"/km"
				  console.log("url : " + url);
				app.get(url, function(request, response) {
					console.log(request);
					console.log(response);
					console.log("distance from " + current + " to " + z + ": " + response.distance);
					// return response.distance;
				})
			})
			for (let i = 0; i < result.rowCount; i ++) {

			}
 			// console.log("sorting? : " + sortLocations(result.rows, currZipcode));
			// console.log(result);
			response.json(result.rows);
		});

	}


	// response.render('home.html');
})

// get request for profile.html (for someone's profile)
app.post("/profile/posts", function(request, response) {
	// sess = request.session;
	console.log("profile posts");
	var sql = 'SELECT posts.id, posts.title, posts.description, posts.zipcode, users.email, posts.createdAt, users.img, users.name FROM posts, users WHERE users.id = $1 AND posts.userEmail = users.email AND posts.available = 1'
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
		response.render('profile.html', {userId: request.session.userId, userEmail: request.session.email, userImg: request.session.userImg});
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
	response.render('profile.html', {userId: request.params.userId, userEmail: request.params.email, userImg: request.session.userImg, currentUser: request.session.email});

})

app.post('/updateUserInfo', function(request, response) {
	var sql = 'UPDATE users SET name = $1, zipcode = $2, description = $3 WHERE id = $4;'
	conn.query(sql, [request.body.name, request.body.zipcode, request.body.description, request.body.userId], function(err, res) {
		if(err != null) { console.log(err); }
		request.session.zipcode = request.body.zipcode;
		response.json({status: "success"});
	})
})

server.listen(8080, function() {
  console.log("Listening on port 8080");
});
