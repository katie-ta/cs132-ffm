$(document).ready(function() {
	$('#loginButton').on("click", function() {
		$.post("/login")
	})

});