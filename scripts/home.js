$(document).ready(function() {
  $("#sortByClosest").click(function() {
  	$.get("/sortClosest", function(response) {

    });
  })

  $("#sortByNewest").click(function() {
  	$.get("/sortNewest", function(response) {
        posts = response;
      $.each(response.rows, function(index, val) {
        console.log("email " + val.email);
        console.log("user id?  " + val.userId);
        var description = val.description;
        if (description.length > 50) {
          description = description.substring(0,50) + ". . .";
        }

        const html = `
        <div class = "foodPost">
            
            <a href="/profile=${val.userId}"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <input id="userEmail" type="hidden" value=${val.email}>
            <ul class="postUser">
                <li p class="username"><b>${val.name}</b></li>
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a href="/post=${val.id}"><p class = "food">${val.title}</p></a>
              <input id="postId" type="hidden" value=${val.id}>
              <p class = "description">${description}</p>
              <p>Posted on: ${val.createdAt} </p>
          </div>
            <input type="image" class="messageButton" src="message-button.png">
            <input id="userEmail" type="hidden" value=${val.email}>
        </div>`

        const $post = $(html);
        $('.foodFeed').append($post);
    })
  		
    });
  })

    $.get("/getAllPosts", function(response) {

      posts = response;
      $.each(response.rows, function(index, val) {
        console.log("email " + val.email);
        console.log("user id?  " + val.userId);
        var description = val.description;
        if (description.length > 50) {
          description = description.substring(0,50) + ". . .";
        }

        const html = `
        <div class = "foodPost">
            
            <a href="/profile=${val.userId}"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>  
            <ul class="postUser">
                <li p class="username"><b>${val.name}</b></li>
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a href="/post=${val.id}"><p class = "food">${val.title}</p></a>
              <p class = "description">${description}</p>
              <p>Posted on: ${val.createdAt} </p>
          </div>
            <a href="mailto:${val.email}"><input type="image" class="messageButton" src="message-button.png" ></a>
        </div>`

        const $post = $(html);
        $post.data("email", val.email);
        $('.foodFeed').append($post);
    })
    });

});
