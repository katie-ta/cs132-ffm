$(document).ready(function() {
	var myName = "";
	var myZip = "";
	var myEmail ="";

	$.get("/profile/user", function(response) {
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


  $.get("/profile/posts", function(response) {
    // response should be json of all the posts
    console.log(response);
    console.log(response.rowCount);
    for (var i = 0; i < response.rowCount; i ++) {
    	var postInfo = response.rows[i];
    	console.log(postInfo.title);
    	console.log("post id : " + postInfo.id);
    	$('#postsHeader').after(createPostHtml(postInfo.id, postInfo.title, postInfo.description, postInfo.email));


    }

    // $('#postsHeader').after(createPostHtml(postInfo.title, postInfo,description, userEmail));

    // <div class = "foodPost">
    //     <a href="profile.html"><img class="userPhoto" src="dean.jpg" alt="profile photo"></a>
    //     <ul class="postUser">
    //         <li p class="username">Peppy C.</li>
    //         <li p class="distance">0.3 mile away</li>
    //         <img class="stars" src="stars.png" alt="stars">
    //     </ul>
    //   <div class="foodText">
    //       <a href="post.html"><p class = "food"> 20 Watermelons </p></a>
    //       <p class = "description"> Freshly Grown! Description description ... </p>
    //   </div>             
    // </div>


    
  })

  

  function createPostHtml(id, title, description) {
  	var res = "<div class = \"foodPost\" style=\"display: flex;\">";
  	res += "<ul class=\"postUser\"><li p class=\"username\">" + myName + "</li>";
  	res += "<li p class=\"distance\">" + myZip + "</li>";
  	res += "<img class=\"stars\" src=\"stars.png\" alt=\"stars\"></ul>";
  	res += "<div class=foodText >";
  	res += "<a href=\"post.html\"><p class = \"food\">" + title +  "</p></a>";
  	res += "<p class = \"description\">" + description +"</p>"
  	res += "</div>"
  	res += "</div>";
  	return res;
  }

});