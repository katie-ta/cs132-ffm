$(document).ready(function() {
	$('#newLoginButton').on("click", function() {
		$.post("/newLogin", {}, function(response) {
			if(response.status == "success") {
				
			}

		})
	})

});