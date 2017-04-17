$(document).ready(function() {
  $('#submit-btn').on("click", createPost);

  function createPost() {
    // create a post from form
    console.log("creating a post");

    var postTitle = $('#postTitle').val();
    var zipcode = $('#zipcode').val();
    var description = $('#description').val();
    console.log("description: "+ description);

    if($('#snack').is(':checked')) { 
    	console.log("snack is checked"); 
    }

    if($('#produce').is(':checked')) { 
    	console.log("produce is checked"); 
    }

    if($('#meal').is(':checked')) { 
    	console.log("meal is checked"); 
    }

    if($('#perishable').is(':checked')) { 
    	console.log("perishable"); 
    }

    if($('#non-perishable').is(':checked')) { 
    	console.log("non-perishable"); 
    }

    // then tell server what to search for and which filters!!
  }
});