$(document).ready(function() {
	function register() {
		console.log("register")
	}

	$('#create-btn').on("click", function() {
		var name = $('#name').val();
		var email = $('#email').val();
		var password = $('#password').val();
		var zipcode = $('#zipcode').val();

		var facebook = $('#facebook').val();
		var instagram = $('#instagram').val();
		var linkedin = $('#password').val();

		if ($('#facebook').val() == "") {
			facebook = null;
		}



		if (name != "" && email !="" && password !="") {
			var user = {
				name: name,
				email: email,
				password: password,
				zipcode: zipcode,
				facebook: facebook,
				instagram: instagram,
				linkedin: linkedin
			}
			console.log("sending back new login?")

			$.post("/newLogin", user, function(response) {

				if(response.status == "success") {
					
				}

			})
		}

		
	})

});