$(document).ready(function() {
  $('#sendMessageButton').on("click", sendMessage);

  function sendMessage() {
    // search for posts here using keywords
    console.log("sending message");

    var keywords = $('#messageBody').val();
  }
});