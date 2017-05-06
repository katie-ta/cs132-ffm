$(document).ready(function() {
 

$("#sortByOldest").click(function() {
    $.get("/sortOldest", function(response) {
              $('.foodFeed').innerHTML = "" ;
              $('.foodFeed').empty();

        posts = response;

        for(var i = 0; i< response.length; i++){


        var description = response[i].description;
        if (description.length > 50) {
          description = description.substring(0,50) + ". . .";
        }

        const html = `
        <div class = "foodPost">
            
            <a href="/profile=${response[i].userId}"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <input id="userEmail" type="hidden" response[i]ue=${response[i].email}>
            <ul class="postUser">
                <li p class="username"><b>${response[i].name}</b></li>
                <li p class="distance">${response[i].zipcode}</li>
            </ul>
          <div class="foodText">
              <a href="/post=${response[i].id}"><p class = "food">${response[i].title}</p></a>
              <input id="postId" type="hidden" response[i]ue=${response[i].id}>
              <p class = "description">${description}</p>
              <p>Posted on: ${response[i].createdAt} </p>
          </div>
            <input type="image" class="messageButton" src="message-button.png">
            <input id="userEmail" type="hidden" response[i]ue=${response[i].email}>
        </div>`

        const $post = $(html);
        $('.foodFeed').append($post);

        }
      
    });
  })



  $("#sortByNewest").click(function() {
  	$.get("/sortNewest", function(response) {
              $('.foodFeed').innerHTML = "" ;
              $('.foodFeed').empty();

        posts = response;

        for(var i = 0; i< response.length; i++){


        var description = response[i].description;
        if (description.length > 50) {
          description = description.substring(0,50) + ". . .";
        }

        const html = `
        <div class = "foodPost">
            
            <a href="/profile=${response[i].userId}"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <input id="userEmail" type="hidden" response[i]ue=${response[i].email}>
            <ul class="postUser">
                <li p class="username"><b>${response[i].name}</b></li>
                <li p class="distance">${response[i].zipcode}</li>
            </ul>
          <div class="foodText">
              <a href="/post=${response[i].id}"><p class = "food">${response[i].title}</p></a>
              <input id="postId" type="hidden" response[i]ue=${response[i].id}>
              <p class = "description">${description}</p>
              <p>Posted on: ${response[i].createdAt} </p>
          </div>
            <input type="image" class="messageButton" src="message-button.png">
            <input id="userEmail" type="hidden" response[i]ue=${response[i].email}>
        </div>`

        const $post = $(html);
        $('.foodFeed').append($post);

        }
  		
    });
  })

    $.get("/getAllPosts", function(response) {
          console.log("respomse" + response);

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
            
            <a href="/profile=${val.userId}"><img class="userPhoto" src="${val.img}" alt="profile photo"></a>  
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
