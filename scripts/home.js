$(document).ready(function() {
  // $('#sendMessage').on("click", sendMessage);
  //
  // function sendMessage() {
  //   console.log("message button clicked");
  // }
  $('#sendMessage').on("click", sendMessage);

  $("#sendMessage").click(function() {
    $.get("/createRoom", function(response) {
      window.location = "/" + response.roomId;
    });
  });
    // then tell server what to search for and which filters!!

});
