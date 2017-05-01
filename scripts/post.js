$(document).ready(function() {
  const postId = $('meta[name=postId]').attr("content");
  console.log(" post id!!! : " + $('meta[name=postId]').attr("content"));


  $.post('/getPostInfo', {postId: postId}, function(response) {
    console.log(response);

    $(".postTitle").text(response.title);

    $(".descriptionHeader").after(response.description);

    $(".zipcode").after(" " + response.zipcode);

    $(".username").text(response.name);
    
    $(".createdAt").after(response.createdAt);

    if (response.perishable) {
      $("#labels").append("<span class=\"label label-primary\">Perishable</span>");
    }

    if (response.type == "snack") {
      $("#labels").append("<span class=\"label label-success\">Snack</span>");
    }
    if (response.type == "produce") {
      $("#labels").append("<span class=\"label label-success\">Produce</span>");
    }
    if (response.type == "other") {
      $("#labels").append("<span class=\"label label-success\">Other</span>");
    }

    if (response.servingSize) {
      $("#labels").append("<span class=\"label label-info\">Serves" + response.servingSize + "</span>");
    }

    
  })
  // var servings = "";
  // $('.dropdown-menu li > a').click(function(e){
  //     $('.status').text(this.innerHTML);
  //     servings = $(this).text();
  // });
  // $('#submit-btn').on("click", function (){
  //   createPost(servings);
  // });


  // /*
  //   Returns the time of day (pm vs am)
  // */
  // function getTime(hours, minutes){
  //   var ap = "";
  //   if(hours >= 12) {
  //     ap = "PM";
  //   }
  //   else{
  //     ap = "AM"
  //   }
  //   hours = hours%12; // will give you the hours on a 12 hour based system
  //   return (hours + ":" + minutes + ap);
  // };

  // function createPost(servingSize) {
  //   // create a post from form
  //   console.log("creating a post");

  //   var postTitle = $('#postTitle').val();
  //   var zipcode = $('#zipcode').val();
  //   var description = $('#description').val();
  //   console.log("description: "+ description);
  //   var perishable;
  //   var foodType;
  //   var servingSize;
  //   var available;
  //   console.log("hello");

  //   if($('#snack').is(':checked')) {
  //   	console.log("snack is checked");
  //     foodType = "snack";
  //   }

  //   if($('#produce').is(':checked')) {
  //   	console.log("produce is checked");
  //     foodType = "produce";
  //   }

  //   if($('#meal').is(':checked')) {
  //   	console.log("meal is checked");
  //     foodType = "meal";
  //   }

  //   if($('#perishable').is(':checked')) {
  //   	console.log("perishable");
  //     perishable = true;
  //   }

  //   if($('#non-perishable').is(':checked')) {
  //   	console.log("non-perishable");
  //     perishable = false;
  //   }
  //   var t = new Date();
  //   var time = getTime(t.getHours(), t.getMinutes());
  //   var requestData = {
  //     // userId: // get userId
  //     title: postTitle,
  //     description: description,
  //     createdAt: time,
  //     perishable: perishable,
  //     type: foodType,
  //     servingSize: servingSize,
  //     zipcode: zipcode,
  //     available: true
  //   }
  //   $.post("/createPost", requestData);
  // }


});
