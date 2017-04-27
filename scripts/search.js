$(document).ready(function() {
  $('#submit-btn').on("click", searchPosts);

  function searchPosts() {
    // search for posts here using keywords
    console.log("searching for posts");

    var keywords = $('#keywords').val();


    var options = {
        snack: false,
        produce: false,
        meal: false, 
        perishable: false,
        nonperishable: false
    }

    if($('#snack').is(':checked')) { 
        options.snack = true;
    	console.log("snack is checked"); 
    }

    if($('#produce').is(':checked')) { 
        options.produce = true;
    	console.log("produce is checked"); 
    }

    if($('#meal').is(':checked')) { 
        options.meal = true;
    	console.log("meal is checked"); 
    }

    if($('#perishable').is(':checked')) { 
        options.perishable = true;
    	console.log("perishable"); 
    }

    if($('#non-perishable').is(':checked')) { 
        options.nonperishable = true;
    	console.log("non-perishable"); 
    }

    // then tell server what to search for and which filters!!


    // TODO: send get or post (idk which is better) request back to server with information to search on
    $.post("/getSearchResults", options, function(response) {
        // parse the response which contains all the posts filtered
    })

    }
});