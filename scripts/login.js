$(document).ready(function() {
	$('#loginButton').on("click", function() {
		var email = $('#email').val();
		var password = $('#password').val();
		console.log(email);
		console.log(password);

		if (email == "") {
			alert("Please enter an email!");
		}

		if (password == "") {
			alert("Please enter a password!");
		}

		if (email !== "" && password != "") {
			$.post("/checkLogin", {email: email, password: password}, function(response) {
				console.log(response.status);
				if (response.status === "success") {
					$.get("/", function(req,response) {
						window.location = "/";
					})
				} else if (response.status === "login does not exist") {
					alert("Email does not exist!");
				}
			});
		}

	})
});
