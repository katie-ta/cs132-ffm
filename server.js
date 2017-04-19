var express = require('express');
var anyDB = require('any-db');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var path = require('path');
var hogan = require('hogan.js');
var begin = require('any-db-transaction');
var http = require('http');
var bcrypt = require('bcrypt');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

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
const createUserTable = 'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, password TEXT, zipcode INTEGER, email TEXT, facebook TEXT, instagram TEXT)';
const createPostTable = 'CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, userId TEXT, title TEXT, description TEXT, createdAt TIMESTAMP, perishable BOOLEAN, type TEXT, zipcode INTEGER, available, BOOLEAN)';

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

// create room identifier
function generateRoomIdentifier() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var result = '';
  for (var i = 0; i < 6; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  if (roomIds.has(result)) {
    result = generateRoomIdentifier();
  }
  roomIds.add(result);
  return result;
}


// get the home page
app.get('/', function(request, response) {
	// TODO: query database for all available posts, default sorted by createdAt column
	var q = 'SELECT * FROM posts WHERE available == true';


	// TODO: when a user wants to re-sort, requery database and order by something else?

  response.render('home.html');
})

app.get('/about', function(request , response) {
	response.render('about.html');
})

app.get('/createpost', function(request , response) {
	console.log("create post server");
	// add post to database

	response.render('createpost.html');
})

app.post('/savepost', function(request, response) {
	console.log(request);
	var description = request.body.description;
	var title = request.body.title;
})

app.get('/search', function(request, response) {
	// catches the search form stuff
	// TODO: get search information 
	// run some sort of search algorithm on all of the posts

	// TODO : look for some sort of search api that will work? OR manually search all posts?

	// TODO:  redirect to search results page (after Yuri makes it)

	// TODO: create foodPost div, insert all information, append it to results div

	response.render('search.html');
})

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



// get request for profile.html (for someone's profile)
app.get('/:userId', function(request, response) {
	response.render('profile.html', {userId : request.param.userId});

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




