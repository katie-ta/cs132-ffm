var servingSize;

function deletePost(postId) {
  $.post('/deletePost', {postId: postId}, function(request, response) {
    console.log(response);
    if (response) {
      window.location = "/";
    }
  })
}

function getPostInfo(postId, currentUser) {
  $.post('/getPostInfo', {postId: postId}, function(response) {
    if (response.available == 0) {
      console.log("NO LONGER AVAILABLE") ;
      $(".postTitle").text("POST NO LONGER EXISTS");
    } else {
    servingSize = response.servingSize;
    console.log(response);

    if (response.email == currentUser) {
      $('#edit').show();
      $('#delete').show()
    }


    $(".postTitle").text(response.title);

    $("#description").text("" + response.description);

    $("#zipcode").text(response.zipcode);

    $(".username").text(response.name);

    $("#servingSize").val(response.servingSize);

    // $(".userDescription").text(response.description);

    $("#createdAt").text(response.createdAt);
    console.log("perishable? " + response.perishable);
    if (response.perishable == "true") {
      $("#labels").append("<span id=\"perishableTag\" class=\"label label-primary\">Perishable</span>&nbsp;");
      $('#perishable').attr('checked',true);

    } else {
      $("#labels").append("<span id=\"perishableTag\" class=\"label label-primary\">Non-Perishable</span>&nbsp;");
      $('#nonperishable').attr('checked',true);
    }

    if (response.type == "snack") {
      $("#labels").append("<span id=\"mealTag\" class=\"label label-success\">Snack</span>&nbsp;");
      $('#snack').attr('checked',true);
    }
    if (response.type == "produce") {
      $("#labels").append("<span id=\"mealTag\" class=\"label label-success\">Produce</span>&nbsp;");
      $('#produce').attr('checked',true);
    }

    if (response.type == "meal") {
      $("#labels").append("<span id=\"mealTag\" class=\"label label-success\">Meal</span>&nbsp;");
      $('#meal').attr('checked',true);
    }

    if (response.type == "other") {
      $("#labels").append("<span id=\"mealTag\" class=\"label label-success\">Other</span>&nbsp;");
      $('#other').attr('checked',true);
    }

    if (response.servingSize) {
      $("#labels").append("<span id=\"servingSizeTag\" class=\"label label-info\">Serves " + response.servingSize + "</span>&nbsp;");
    }
  }




  })
}

$(document).ready(function() {
  const postId = $('meta[name=postId]').attr("content");
  const currentUser = $('meta[name=userEmail]').attr("content");
  $('#edit').hide();
  $('#done').hide();
  $('#delete').hide();
  $('#types').hide();

  console.log(" post id!!! : " + $('meta[name=postId]').attr("content"));
  console.log(" current user: " + currentUser);

  getPostInfo(postId, currentUser);

  $('#delete').click(function() {
    $("#error").html("You Clicked on Click here Button");
      $('#myModal').modal("show");
    });

  $('#delete-post').click(function() {
    deletePost(postId);
  });

  $('#edit').on("click", function() {
    console.log("edit clicked");
    $(this).hide();
    $('#done').show();
    $('#labels').hide();
    $('#postedOn').hide();
    $('#types').show();
      var $description=$('#description'), isEditable=$description.is('.editable');
      $description.prop('contenteditable',!isEditable).toggleClass('editable');

      var $zip=$('#zipcode'), isEditable=$zip.is('.editable');
      $zip.prop('contenteditable', !isEditable).toggleClass('editable');

      var $title=$('.postTitle'), isEditable=$title.is('.editable');
      $title.prop('contenteditable', !isEditable).toggleClass('editable');

  })

  $('#done').on("click", function() {
    console.log("done clicked");
    $(this).hide();
    $('#edit').show();
    $('#labels').show();
    $('#postedOn').show();
    $('#types').hide();
      var $description=$('#description'), isEditable=$description.is('.editable');
      $description.prop('contenteditable',!isEditable).toggleClass('editable');

      var $zip=$('#zipcode'), isEditable=$zip.is('.editable');
      $zip.prop('contenteditable', !isEditable).toggleClass('editable');

      var $title=$('.postTitle'), isEditable=$title.is('.editable');
      $title.prop('contenteditable', !isEditable).toggleClass('editable');

      var type = "";
      var perishable;
      var servingSize = $('#servingSize').val();
      $("#servingSizeTag").text("Serves " + servingSize);

      if($('#snack').is(':checked')) {
          type = "snack";
          $("#mealTag").text("Snack");
      }

      if($('#produce').is(':checked')) {
          type = "produce";
          $("#mealTag").text("Produce");
      }

      if($('#meal').is(':checked')) {
          type = "meal";
          $("#mealTag").text("Meal");
      }

      if($('#perishable').is(':checked')) {
          console.log("perishable");
          $("#perishableTag").text("Perishable");
          perishable = true;
      }

      if($('#non-perishable').is(':checked')) {
          perishable = false;
          $("#perishableTag").text("Non-Perishable");
      }

      console.log($('#description').text());
      var edits = {
        postId : postId,
        description: $('#description').text(),
        zipcode: $('#zipcode').text(),
        title: $('.postTitle').text(),
        type: type,
        perishable: perishable,
        servingSize: servingSize
      }
      console.log(edits);
      $.post('/updatePostInfo', edits, function(request, response) {
        console.log(response);

      })

  })
});
