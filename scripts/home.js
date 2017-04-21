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
      for (var i = 0; i < response.rowCount; i ++) {
        var postInfo = response.rows[i];
        console.log(postInfo.title);
        $.post("/getUserName", {email: postInfo.userEmail}, function(response) {
          // response.name is the name of the user who made the post
          console.log(response);
          console.log("appending post html");
          $('.foodFeed').append(createPostHtml(postInfo.id, postInfo.title, postInfo.description, postInfo.email, response.name, response.zipcode));
        })
      


      }
    });

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



    function createPostHtml(id, title, description, email, username, zipcode) {

      var res = "<div class = \"foodPost\">";
      res += "<ul class=\"postUser\"><li p class=\"username\">" + username + "</li>";
      res += "<img class=\"userPhoto\" src=\"katie.jpg\" alt=\"profile photo\">"
      res += "<input type=\"hidden\" id=\"email\" value=\"" + email + "\">"
      res += "<input type=\"hidden\" id=\"postId\" value=\"" + id + "\">"
      res += "<li p class=\"distance\">" + zipcode + "</li>"
      res += "<img class=\"stars\" src=\"stars.png\" alt=\"stars\"></ul>";
      res += "<div class=\"foodText\">";
      res += "<a href=\"post.html\"><p class = \"food\">" + title +  "</p></a>";
      res += "<p class = \"description\">" + description +"</p>"
      res += "</div>"
      res += "</div>";
      return res;
    }

});
