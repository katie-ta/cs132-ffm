var sign_response;
var imgUrl;




$(document).ready(function() {
	function register() {
		console.log("register")
	}

	$('#image').change(function() {
		var file = $("#image")[0].files[0]
      if (!file) return

      sign_request(file, function(response) {
      	console.log("signing request??");
      	sign_response = response;
        upload(file, response.signed_request, response.url, function() {
        	console.log("response: "+ response.url);
        	imgUrl = response.url;
          $("#preview").attr("src",response.url);
        })
      })
	})

	$('#create-btn').on("click", function() {
		var name = $('#name').val();
		var email = $('#email').val();
		var password = $('#password').val();
		var zipcode = $('#zipcode').val();
		console.log(zipcode);

		var facebook = $('#facebook').val();
		var instagram = $('#instagram').val();
		var linkedin = $('#password').val();

		if ($('#facebook').val() == "") {
			facebook = null;
		}

		if ($('#instagram').val() == "") {
			instagram = null;
		}

		if ($('#linkedin').val() == "") {
			linkedin = null;
		}

		if (name != "" && email !="" && password !="") {
			var user = {
				name: name,
				email: email,
				password: password,
				zipcode: zipcode,
				facebook: facebook,
				instagram: instagram,
				img: imgUrl
			}
			console.log("sending back new login?")

			$.post("/newLogin", user, function(response) {
				console.log(response);
				if(response.status == "success") {
						window.location = "/";
				} else if (response.status == "invalid email") {
					alert("Email already exists!");
				}
				console.log(response.status);
			})
		} else {
			alert("Please enter all required fields!");
		}


	})

});
