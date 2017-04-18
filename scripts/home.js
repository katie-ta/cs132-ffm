$(document).ready(function() {

  $('#sendMessage').on("click", sendMessage);

  $("#sendMessage").click(function() {
    $.get("/createRoom", function(response) {
      window.location = "/" + response.roomId;
    });

    //TODO: do whatever you need to do to send message

    // TODO: get current user id, get user id of person who owns post (it's in a hidden input field)
  });
    // then tell server what to search for and which filters!!

});
