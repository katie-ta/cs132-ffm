$(document).ready(function() {
	var userId = null;

	$('#about').on("click", function() {
			window.location = "/about";
	})

	$('#createpost').on("click", function() {
			window.location = "/createpost"; 
	})

	$('#logo').on("click", function() {
		window.location = "/"; 
	})

	$('#searchheader').on("click", function() {
		console.log("search client side");
		window.location = "/search"; 
	})

	$('#profileheader').on("click", function() {
		console.log("profile client side");
		window.location = "/profile";
	})

	$('#searchheader').on("click", function() {
		console.log("search client side");
		window.location = "/search"; 
	})

	$('#logout').on("click", function() {
		console.log("logout clicked");
		$.get('/logout', function(request, response) {
			console.log("logged out??");
			
		})
		window.location = "/";

	})



    //TODO: do whatever you need to do to send message

    // TODO: get current user id, get user id of person who owns post (it's in a hidden input field)
});
