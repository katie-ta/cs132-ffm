$(document).ready(function() {
  console.log("ready");
  $('#submit-btn').on("click", searchPosts);

  function searchPosts() {
    // search for posts here
    console.log("searching for posts");
  }
});