$(document).ready(function() {

  $("#sendMessage").click(function() {
    $.get("/createRoom", function(response) {
      window.location = "/" + response.roomId;
    });
    });
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
    var posts;
    $.get("/getAllPosts", function(response) {

      posts = response;
      $.each(response.rows, function(index, val) {
        console.log(val);
        $.post("/getUserName", {email: val.userEmail}, function(response) {
          console.log(val);
          console.log("gett username for " + response.name);
            // response.name is the name of the user who made the post
            // console.log(response);
            const html = `
            <div class = "foodPost">
                <a id="userIcon"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
                <ul class="postUser">
                    <li p class="username">${response.name}</li>
                    <li p class="distance">${response.zipcode}</li>
                </ul>
              <div class="foodText">
                  <a href="post.html"><p class = "food">${val.title}</p></a>
                  <p class = "description">${val.description}</p>
              </div>
                <input type="image" class="messageButton" src="message-button.png" alt="message button" data-toggle="modal" data-target="#messageModal">
            </div>`

            const $post = $(html);
            $post.data('postId', val.id);
            $post.data('userId', response.id);

            $('.foodFeed').append($post);
          })
      });
    })

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
    //     <input type="image" class="messageButton" src="message-button.png" alt="message button" data-toggle="modal" data-target="#messageModal">
    // </div>

});
