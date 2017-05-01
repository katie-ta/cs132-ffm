$(document).ready(function() {
  $('#submit-btn').on("click", searchPosts);

  function searchPosts() {
    // search for posts here using keywords
    console.log("searching for posts");

    var keywords = $('#keywords').val();


    var options  = {
        keyword : keywords,
        foodType: "null", 
        perishable: 0,
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

    // then tell server what to search for and which filters!!


                 
    // TODO: send get or post (idk which is better) request back to server with information to search on
    $.post("/getSearchResults", options, function(response) {

        if(response){
            console.log("fired3");
            var resultsJSON = response;
            console.log(resultsJSON.length);
            document.getElementById('content').innerHTML = '';

            for(var i =0; i<resultsJSON.length; i++){
                console.log("fired2");
                var val = resultsJSON[i];

             var div = document.createElement('div');

                div.className = 'row';

                div.innerHTML = `
        <div class = "foodPost">
            
            <a id="userIcon"><img class="userPhoto" src="katie.jpg" alt="profile photo"></a>
            <ul class="postUser">
                <li p class="distance">${val.zipcode}</li>
            </ul>
          <div class="foodText">
              <a class="postTitle"><p class = "food">${val.title}</p></a>
              <input id="postId" type="hidden" value=${val.id}>
              <p class = "description">${val.description}</p>
          </div>
            <input type="image" class="messageButton" src="message-button.png" alt="message button" data-toggle="modal" data-target="#messageModal">
        </div>`;

                 document.getElementById('content').appendChild(div);


                // $('.container-element').add(


                //     '<div class = "post">
                //           <a href="profile.html"><img class="userPhoto" src= ' +document.write()+' alt="profile photo"></a>
                //           <div class="nameStars">
                //               <li p class="username">Peppy C.:</li>
                //               <img class="stars" src="stars.png" alt="stars">
                //                 <p>Totally reccommend Pippys lemons! I made a delicious meringue pie. </p>
                //             </div>
                //       </div>'


                      //); // append to some new results div on search page

            }
        }


        // parse the response which contains all the posts filtered
    })
  }
});