$(document).ready(function() {

  $("#sendMessage").click(function() {
    $.get("/createRoom", function(response) {
      window.location = "/" + response.roomId;
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

    // TODO: get current user id, get user id of person who owns post (it's in a hidden input field)
  });
    // then tell server what to search for and which filters!!

});
