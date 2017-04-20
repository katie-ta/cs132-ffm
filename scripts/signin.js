$(document).ready(function() {
	$('#login').on("click", function() {
		console.log("log in button clicked");
		window.location = "/login";
	})

	$('#register').on("click", function() {
		window.location = "/register";
	})

});