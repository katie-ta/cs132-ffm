$(document).ready(function() {
	$('#loginButton').on("click", function() {
		var email = $('#email').val();
		var password = $('#password').val();
		$.post("/checkLogin", {email: email , password: password}, function(response) {
			console.log(response);
		})
	})

});