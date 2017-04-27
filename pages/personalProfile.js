$(document).ready(function() {
	var myName = "";
	var myZip = "";
	var myEmail ="";
  const userId = $('meta[name=userId]').attr("content");
  const userEmail = $('meta[name=userEmail]').attr("content");
  console.log(" user id! : " + userId);
  console.log("user email: " + userEmail);

	$.post("/profile/userInfo", {userId: userId}, function(response) {
    // response should be json of all user info
    console.log("profile info");
    console.log(response);

	var profileInfo = response;
	console.log(profileInfo.name);
	myName = profileInfo.name;
	myZip = profileInfo.zipcode;
	myEmail = profileInfo.email;


	$('#profileName').text(myName);
	$('#profileZipcode').text(myZip);

	if (profileInfo.facebook != "") {
		$('.socMedia').append("<a href='" + profileInfo.facebook + "'><img class=\"socialLink\" src=\"facebook.ico\" alt=\"FB icon\"></a>");;
	}
	
	if (profileInfo.instagram != "") {
		$('.socMedia').append("<a href='" + profileInfo.instagram + "'><img class=\"socialLink\" src=\"insta.png\" alt=\"Instagram icon\"></a>");
	}

	if (profileInfo.linkedin) {
		$('.socMedia').append("<a href='" + profileInfo.linkedin + "'><img class=\"socialLink\" src=\"linkedin.png\" alt=\"LinkedIn icon\"></a>");
	}
  })


  $.post("/profile/posts", {userId: userId}, function(response) {
    // response should be json of all the posts
    console.log(response);
    console.log(response.rowCount);
      $.each(response.rows, function(index, val) {
        console.log(val);
      console.log(val.title);
      console.log("post id : " + val.id);
      var description = val.description;
        if (description.length > 60) {
          description = description.substring(0,60) + ". . .";
        }

        const html = `
        <div class = "foodPost">
            
            <a class="userIcon"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <input id="userEmail" type="hidden" value=${val.email}>
            <ul class="postUser">
                <li p class="username">${val.name}</li>
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a class="postTitle"><p class = "food">${val.title}</p></a>
              <input id="postId" type="hidden" value=${val.id}>
              <p class = "description">${description}</p>
              <p>Posted on:  ${val.createdAt}</p>
          </div>
            <input type="image" class="messageButton" src="message-button.png" alt="message button" data-toggle="modal" data-target="#messageModal">
            <input id="userEmail" type="hidden" value=${val.email}>
        </div>`

        const $post = $(html);
        $('.reviewsFeed').append($post);

      })
    
  })
  
  $( ".reviewsFeed " ).on( "click", "a.userIcon", function() {
    const userEmail = $(this).siblings('#userEmail').val();
      console.log(userEmail);

      $.post('/profile', {email: userEmail}, function(response) {
        console.log("response: " + response);
        console.log("response user Id" + response.id);
        window.location = "/profile=" + response.id;
      });
      // console.log($("#").parent().parent().data('userEmail'));
  });

  $( ".reviewsFeed " ).on( "click", ".messageButton", function() {
    const userEmail = $(this).siblings('#userEmail').val();
      console.log(userEmail);

      window.location.href = "mailto:" + userEmail;
  });

  $( ".reviewsFeed " ).on( "click", "a.postTitle", function() {
    const postId = $(this).siblings('#postId').val();
      console.log(postId);
      $.post('/post', {postId: postId}, function(response) {
        console.log("response post Id" + response.postId);
        window.location = "/post=" + response.postId;
      });
      // console.log($("#").parent().parent().data('userEmail'));
  });

});
