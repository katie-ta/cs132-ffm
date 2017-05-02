function getPostInfo(postId, currentUser) {
  $.post('/getPostInfo', {postId: postId}, function(response) {
    console.log(response);

    if (response.email == currentUser) {
      $('#edit').show();
    }


    $(".postTitle").text(response.title);

    $("#description").text("" + response.description);

    $("#zipcode").text(response.zipcode);

    $(".username").text(response.name);

    // $(".userDescription").text(response.description);
    
    $("#createdAt").text(response.createdAt);

    if (response.perishable) {
      $("#labels").append("<span class=\"label label-primary\">Perishable</span>&nbsp;");
    }

    if (response.nonperishable) {
      $("#labels").append("<span class=\"label label-primary\">Non-Perishable</span>&nbsp;");
    }

    if (response.type == "snack") {
      $("#labels").append("<span class=\"label label-success\">Snack</span>&nbsp;");
    }
    if (response.type == "produce") {
      $("#labels").append("<span class=\"label label-success\">Produce</span>&nbsp;");
    }

    if (response.type == "meal") {
      $("#labels").append("<span class=\"label label-success\">Meal</span>&nbsp;");
    }

    if (response.type == "other") {
      $("#labels").append("<span class=\"label label-success\">Other</span>&nbsp;");
    }

    if (response.servingSize) {
      $("#labels").append("<span class=\"label label-info\">Serves " + response.servingSize + "</span>&nbsp;");
    }
    



  })
}

$(document).ready(function() {
  const postId = $('meta[name=postId]').attr("content");
  const currentUser = $('meta[name=userEmail]').attr("content");
  $('#edit').hide();
  $('#done').hide();
  console.log(" post id!!! : " + $('meta[name=postId]').attr("content"));
  console.log(" current user: " + currentUser);

  getPostInfo(postId, currentUser);

  $('#edit').on("click", function() {
    console.log("edit clicked");
    $(this).hide();
    $('#done').show();
      var $description=$('#profileDescription'), isEditable=$description.is('.editable');
      $description.prop('contenteditable',!isEditable).toggleClass('editable');

      var $zip=$('#profileZipcode'), isEditable=$zip.is('.editable');
      $zip.prop('contenteditable', !isEditable).toggleClass('editable');

      var $name=$('#profileName'), isEditable=$name.is('.editable');
      $name.prop('contenteditable', !isEditable).toggleClass('editable');
    
  })

  $('#done').on("click", function() {
    console.log("done clicked");
    $(this).hide();
    $('#edit').show();
      var $description=$('#description'), isEditable=$description.is('.editable');
      $description.prop('contenteditable',!isEditable).toggleClass('editable');

      var $zip=$('#zipcode'), isEditable=$zip.is('.editable');
      $zip.prop('contenteditable', !isEditable).toggleClass('editable');

      console.log($('#profileDescription').text());
      var edits = {
        postId : postId,
        description: $('#profileDescription').text(),
        zipcode: $('#profileZipcode').text(),
        name: $('#profileName').text()
      }
      console.log(edits);
      $.post('/updatePostInfo', edits, function(request, response) {
        console.log(response);
      })

  })
});
