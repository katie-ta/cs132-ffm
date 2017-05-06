var sign_response;
var imgUrl;

function upload(file, signed_request, url, done) {
  var xhr = new XMLHttpRequest()
  xhr.open("PUT", signed_request)
  console.log("signed request: " + signed_request);
  console.log("url: " + url);
  xhr.setRequestHeader('x-amz-acl', 'public-read')
  xhr.onload = function() {
    if (xhr.status === 200) {
      done()
    }
  }

  xhr.send(file)
}

function sign_request(file, done) {
  var xhr = new XMLHttpRequest()
  console.log("file: " + file);
  xhr.open("GET", "/sign?file_name=" + file.name + "&file_type=" + file.type)

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText)
      done(response)
    }
  }

  xhr.send()
}



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
					$.alert(response.status);
				}
				console.log(response.status);
			})
		}

		
	})

});