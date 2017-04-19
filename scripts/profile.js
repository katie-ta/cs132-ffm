$(document).ready(function() {
  $.get('/profile/posts', function(response) {
    // response should be json of all the posts
    console.log("response" + response);

    $.each(response, function(index, element) {
      $.("#reviewsFeed").append()
    })

  })

});