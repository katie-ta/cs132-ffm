$(document).ready(function() {
	$('#loginButton').on("click", function() {
		var email = $('#email').val();
		var password = $('#password').val();
		console.log(email);
		console.log(password);
		$.post("/checkLogin", {email: email, password: password}, function(response) {
			console.log(response.status);
			if (response.status === "success") {
				$.get("/", function(req,response) {
					window.location = "/";
				})
			}
		});
	})

	$('#noaccount').on("click", function() {
		window.location = "/register";
	})

});