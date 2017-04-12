$(document).ready(function() {
  $('#submit-btn').on("click", searchPosts);

  function searchPosts() {
    // search for posts here using keywords
    console.log("searching for posts");

    var keywords = $('#keywords').val();

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