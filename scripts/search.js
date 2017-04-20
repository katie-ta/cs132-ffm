$(document).ready(function() {
  $('#submit-btn').on("click", searchPosts);

  function searchPosts() {
    // search for posts here using keywords
    console.log("searching for posts");

    var keywords = $('#keywords').val();


    var options  = {
        keyword : keywords,
        type: "null", 
        perishable: 0,
        nonPerishable: 0
    }

    if($('#snack').is(':checked')) { 
        options.type = "snack";
    	console.log("snack is checked"); 
    }

    if($('#produce').is(':checked')) { 
        options.type = "produce";
    	console.log("produce is checked"); 
    }

    if($('#meal').is(':checked')) { 
        options.type = "meal";
    	console.log("meal is checked"); 
    }

    if($('#perishable').is(':checked')) { 
        options.perishable = 1;
    	console.log("perishable"); 
    }

    if($('#non-perishable').is(':checked')) { 
        options.nonPerishable = 1;
    	console.log("non-perishable"); 
    }

    // then tell server what to search for and which filters!!


                 

    // TODO: send get or post (idk which is better) request back to server with information to search on
    $.post("/getSearchResults", options, function(response) {

        if(response.status == success){

            var resultsJSON = response.json();

            for(var i =0; i<resultsJSON.length; i++){
                var post = resultsJSON[k];

             var div = document.createElement('div');

                div.className = 'row';

                div.innerHTML = '<input type="text" name="name" value="" />\
                    <input type="text" name="value" value="" />\
                    <label> <input type="checkbox" name="check" value="1" /> Checked? </label>\
                    <input type="button" value="-" onclick="removeRow(this)">';

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