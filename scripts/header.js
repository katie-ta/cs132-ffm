$(document).ready(function() {
	var userId = null;
	
	$('#about').on("click", function() {
		console.log("aboutttt");
		$.get("/about", function(response) {
			window.location = "/about"; 
		})
	})

	$('#createpost').on("click", function() {
		console.log("create post client side");
		$.get("/createpost", function(response) {
			window.location = "/createpost"; 
		})
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
		window.location = "/:userId"; 
	})

	$('#searchheader').on("click", function() {
		console.log("search client side");
		window.location = "/search"; 
	})



    //TODO: do whatever you need to do to send message

    // TODO: get current user id, get user id of person who owns post (it's in a hidden input field)
});
