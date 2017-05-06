$(document).ready(function() {
  $('#submit-btn').on("click", searchPosts);

  function searchPosts() {
    // search for posts here using keywords
    console.log("searching for posts");

    var keywords = $('#keywords').val();
    console.log("initial keywords" + keywords);

    var options  = {
        keyword : keywords,
        foodType: "null",
        perishable: 0,
        zipcode: 0,
    }

    if($('#snack').is(':checked')) {
        options.foodType = "snack";
    console.log("snack is checked");
    }

    if($('#produce').is(':checked')) {
        options.foodType = "produce";
    console.log("produce is checked"); 
    }

    if($('#meal').is(':checked')) {
        options.foodType = "meal";
    console.log("meal is checked");
    }

    if($('#perishable').is(':checked')) {
        options.perishable = 1;
    console.log("perishable");
    }

    if($('#non-perishable').is(':checked')) {
        options.perishable = 0;
    console.log("non-perishable");
    }
    if($('#zipcode').val() != null) {
        options.zipcode = $('#zipcode').val();
    }

    $.post("/getSearchResults", options, function(response) {

        if(response){
            console.log("fired3");

            var resultsJSON = response;
            console.log(resultsJSON.length);
            $('content').empty();

            for(var i =0; i<resultsJSON.length; i++){
                console.log("fired2");
                var val = resultsJSON[i];
                console.log(resultsJSON[i]);

                let description = val.description;
                if (description.length > 50) {
                  description = description.substring(0,50) + ". . .";
                }

			const html = `
        <div class = "foodPost">
            
            <a href="/profile=${val.userId}"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <ul class="postUser">
                <li p class="username"><b>${val.userName}</b></li>
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a href="/post=${val.id}" class="postTitle"><p class = "food">${val.title}</p></a>
              <p class = "description">${description}</p>
              <p>Posted on: ${val.createdAt} </p>
          </div>
            <a href="mailto:${val.userEmail}"><input type="image" class="messageButton" src="message-button.png" ></a>
        </div>`;

					const $post = $(html);
                 $('.foodFeed').append($post);

            }
        }
    })
    }
});
