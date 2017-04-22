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
    $.get("/getAllPosts", function(response) {

      posts = response;
      $.each(response.rows, function(index, val) {
        console.log(val);

        const html = `
        <div class = "foodPost">
            
            <a id="userIcon"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <ul class="postUser">
                <input id="userEmail" type="hidden" value=${val.email}>
                <li p class="username">${val.name}</li>
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a class="postTitle"><p class = "food">${val.title}</p></a>
              <input id="postId" type="hidden" value=${val.id}>
              <p class = "description">${val.description}</p>
          </div>
            <input type="image" class="messageButton" src="message-button.png" alt="message button" data-toggle="modal" data-target="#messageModal">
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
