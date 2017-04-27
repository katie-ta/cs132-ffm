$(document).ready(function() {

  // $("#sendMessage").click(function() {
  //   $.get("/createRoom", function(response) {
  //     window.location = "/" + response.roomId;
  //   });
  $("#sortByClosest").click(function() {
  	$.get("/sortClosest", function(response) {

    });
  })

  $("#sortByNewest").click(function() {
  	$.get("/sortNewest", function(response) {
  		
    });
  })

  $("#sortByRating").click(function() {
  	$.get("/sortRating", function(response) {
  		
    });
  })



    //TODO: do whatever you need to do to send message
    $.get("/getAllPosts", function(response) {

      posts = response;
      $.each(response.rows, function(index, val) {
        console.log("email " + val.email);
        var description = val.description;
        if (description.length > 60) {
          description = description.substring(0,60) + ". . .";
        }

        const html = `
        <div class = "foodPost">
            
            <a class="userIcon"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <input id="userEmail" type="hidden" value=${val.email}>
            <ul class="postUser">
                <li p class="username"><b>${val.name}</b></li>
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a class="postTitle"><p class = "food">${val.title}</p></a>
              <input id="postId" type="hidden" value=${val.id}>
              <p class = "description">${description}</p>
              <p>Posted on: ${val.createdAt} </p>
          </div>
            <input type="image" class="messageButton" src="message-button.png">
            <input id="userEmail" type="hidden" value=${val.email}>
        </div>`

        const $post = $(html);
        $post.data('postId', val.id);
        $post.data('userEmail', val.email);
        // console.log("binding data: " + val.email);

        console.log($post.data('postId'));
        console.log($post.data('userEmail'));
        $('.foodFeed').append($post);
    })
    });

});
