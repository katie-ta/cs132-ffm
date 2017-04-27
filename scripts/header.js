$(document).ready(function() {
	var userId = null;

	$('#about').on("click", function() {
			window.location = "/about";
	})

	$('#createpost').on("click", function() {
			window.location = "/createpost"; 
	})

	$('#logo').on("click", function() {
		window.location = "/"; 
	})

	$('#searchheader').on("click", function() {
		console.log("search client side");
		window.location = "/search"; 
	})

	$('#profileheader').on("click", function() {
		console.log("profile client side");
		window.location = "/myProfile";
	})

	$('#messageheader').on("click", function() {
		console.log("messages clicked client side");
		window.location = "/messages"; 
	})

	$('#logout').on("click", function() {
		console.log("logout clicked");
		$.get('/logout', function(request, response) {
			console.log("logged out??");
			
		})
		window.location = "/";

	})

	$( ".foodFeed " ).on( "click", "a.postTitle", function() {
		const postId = $(this).siblings('#postId').val();
	  	console.log(postId);
	  	$.post('/post', {postId: postId}, function(response) {
	  		console.log("response post Id" + response.postId);
	  		window.location = "/post=" + response.postId;
	  	});
	});

	// $ (".foodFeed").on( "click", ".messageButton", function() {
	// 	const userEmail = $(this).siblings('#userEmail').val();
	// 	console.log("messaging... " + userEmail);

	// 	$("#sendMessage").on("click", function() {
	// 		const body = $("#messageBody").val();
	// 		console.log("sending:  " + body + " to " + userEmail);
	// 		$.post('/saveMessage', {receiver: userEmail, body: body}, function(response) {
	// 			// console.log("response post Id" + response.postId);
	// 			// window.location = "/post=" + response.postId;
	// 		});
	// 	})
		
	// })

	$( ".foodFeed " ).on( "click", "a.userIcon", function() {
		const userEmail = $(this).siblings('#userEmail').val();
	  	console.log(userEmail);

	  	$.post('/profile', {email: userEmail}, function(response) {
	  		console.log("response: " + response);
	  		console.log("response user Id" + response.id);
	  		window.location = "/profile=" + response.id;
	  	});
	  	// console.log($("#").parent().parent().data('userEmail'));
	});

	$( ".foodFeed " ).on( "click", ".messageButton", function() {
		const userEmail = $(this).siblings('#userEmail').val();
	  	console.log(userEmail);

	  	window.location.href = "mailto:" + userEmail;
	});
});
