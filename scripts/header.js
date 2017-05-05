function profileRedirect(profileEmail) {
	$.post('/profile', {email: profileEmail}, function(response) {
		console.log("response: " + response);
		console.log("response user Id" + response.id);
		window.location = "/profile=" + response.id;
	});
}


$(document).ready(function() {
	var userId = null;
});
