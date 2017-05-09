$(document).ready(function() {
	var myName = "";
	var myZip = "";
	var myEmail ="";
  const userId = $('meta[name=userId]').attr("content");
  const userEmail = $('meta[name=userEmail]').attr("content");
  const currentUser = $('meta[name=userEmail]').attr("content");
  console.log(" user id! : " + userId);
  console.log("user email: " + userEmail);
  $('#edit').hide();
  $('#done').hide();

	$.post("/profile/userInfo", {userId: userId}, function(response) {
    // response should be json of all user info
    console.log("profile info");
    console.log(response);


	var profileInfo = response;
	console.log(profileInfo.name);
	myName = profileInfo.name;
	myZip = profileInfo.zipcode;
	myEmail = profileInfo.email;
  var description;

  if (myEmail == userEmail) {
    $('#edit').show();
  }


	$('#profileName').text(myName);
	$('#profileZipcode').text(myZip);
  if (profileInfo.description) {
    $('#profileDescription').text(profileInfo.description);
  } else {
    $('#profileDescription').html("<i> no description available </i>");
  }


	if (profileInfo.facebook != "") {
		$('.socMedia').append("<a href=\"" + profileInfo.facebook + "\"><img class=\"socialLink\" src=\"facebook.ico\" alt=\"FB icon\"></a>&nbsp;");;
	}

	if (profileInfo.instagram != "") {
		$('.socMedia').append("<a href='" + profileInfo.instagram + "'><img class=\"socialLink\" src=\"insta.png\" alt=\"Instagram icon\"></a>&nbsp;");
	}

	if (profileInfo.linkedin) {
		$('.socMedia').append("<a href='" + profileInfo.linkedin + "'><img class=\"socialLink\" src=\"linkedin.png\" alt=\"LinkedIn icon\"></a>&nbsp;");
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
        if (val.description && val.description.length > 60) {
          description = description.substring(0,60) + ". . .";
        }

        const html = `
        <div class = "foodPost">
            <a class="userIcon"><img class="userPhoto" src=${val.img} alt="profile photo"></a>
            <input id="userEmail" type="hidden" value=${val.email}>
            <ul class="postUser">
                <li p class="username">${val.name}</li>
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a href="/post=${val.id}"><p class = "food">${val.title}</p></a>
              <p class = "description">${description}</p>
              <p>Posted on:  ${formatDate(val.createdAt)}</p>
          </div>
            <input type="image" class="messageButton" src="message-button.png" alt="message button" data-toggle="modal" data-target="#messageModal">
            <input id="userEmail" type="hidden" value=${val.email}>
        </div>`

        const $post = $(html);
        $('.reviewsFeed').append($post);

      })

  })

$('#edit').on("click", function() {
  console.log("edit clicked");
  $(this).hide();
  $('#done').show();
    var $description=$('#profileDescription'), isEditable=$description.is('.editable');
    $description.prop('contenteditable',!isEditable).toggleClass('editable');

    var $zip=$('#profileZipcode'), isEditable=$zip.is('.editable');
    $zip.prop('contenteditable', !isEditable).toggleClass('editable');

    var $name=$('#profileName'), isEditable=$name.is('.editable');
    $name.prop('contenteditable', !isEditable).toggleClass('editable');

})

$('#done').on("click", function() {
  console.log("done clicked");
  $(this).hide();
  $('#edit').show();
    var $description=$('#profileDescription'), isEditable=$description.is('.editable');
    $description.prop('contenteditable',!isEditable).toggleClass('editable');

    var $zip=$('#profileZipcode'), isEditable=$zip.is('.editable');
    $zip.prop('contenteditable', !isEditable).toggleClass('editable');

    var $name=$('#profileName'), isEditable=$name.is('.editable');
    $name.prop('contenteditable', !isEditable).toggleClass('editable');

    console.log($('#profileDescription').text());
    var edits = {
      userId : userId,
      description: $('#profileDescription').text(),
      zipcode: $('#profileZipcode').text(),
      name: $('#profileName').text()
    }
    console.log(edits);
    $.post('/updateUserInfo', edits, function(request, response) {
      console.log(response);
			if (response) {
				const html = `<div class="alert alert-success alert-dismissable">
					  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
					  <strong>Success!</strong> Indicates a successful or positive action.
					</div>`
				const $alert = $(html);
				$('.alerts').append($alert);

			}
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
