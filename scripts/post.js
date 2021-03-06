var servingSize;
var img1, img2, img3, img4;
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function deletePost(postId) {
  $.post('/deletePost', {postId: postId}, function(request, response) {
    console.log(response);
    if (response) {
      window.location = "/";
    }
  })
}

function uploadImage(image, preview) {
  console.log(image);
  var file = $(image)[0].files[0]
    if (!file) return

    sign_request(file, function(response) {
      console.log("signing request??");
      sign_response = response;
      upload(file, response.signed_request, response.url, function() {
        console.log("response: "+ response.url);
        $(preview).attr("src",response.url);
      })
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

    if (response.userEmail == currentUser) {
      $('#edit').show();
      $('#delete').show();

    } else {
      $('.messageButton').show();
    }

    if (response.img1) {
      $("#img1").attr('src', response.img1);
    } else { $('#img1').hide(); }

    if (response.img2) {
      $("#img2").attr('src', response.img2);
    } else {
      $("#img2").hide();
    }
    if (response.img3) {
      $("#img3").attr('src', response.img3);
    } else {
      $("#img3").hide();
    }

    if (response.img4) {
      $("#img4").attr('src', response.img4);
    } else {
      $("#img4").hide();
    }
    $(".postTitle").text(response.title);
    $("#description").text("" + response.description);
    $("#zipcode").text(response.zipcode);
    $(".username").text(response.name);
    $("#servingSize").val(response.servingSize);
    $('#messageButton').attr('href', "mailto:" + response.userEmail);
    $('.userIcon').attr('href', "/profile=" + response.userId);

    // $(".userDescription").text(response.description);
    console.log("created at :" + response.createdAt);
    let split = response.createdAt.split(" ");
    let time = split[1].split(":");
    let date = split[0].split("-");
    let hour = time[0];
    let minutes = time[1];
    let end = "am"

    if (hour > 12) {
      hour = hour - 12;
      end = "pm";
    }

    console.log("time : " + hour + ":" + minutes + end);
    console.log("date : " + monthNames[date[1] - 1] + "-" + date[2] + "-" + date[0]);

    $("#createdAt").text(formatDate(response.createdAt));



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

function displayModal(url) {
  $("#imgModal").modal("show");
  $('.modal-content').attr('src', url);
}

$(document).ready(function() {
  const postId = $('meta[name=postId]').attr("content");
  const currentUser = $('meta[name=userEmail]').attr("content");
  $('#edit').hide();
  $('#done').hide();
  $('#delete').hide();
  $('#types').hide();
  $('.edits').hide();
  $('.messageButton').hide();
  $('.test').hide();
  console.log(" post id!!! : " + $('meta[name=postId]').attr("content"));
  console.log(" current user: " + currentUser);

  getPostInfo(postId, currentUser);

  $('#img1').click(function() { displayModal(this.src); })
  $('#img2').click(function() { displayModal(this.src); })
  $('#img3').click(function() { displayModal(this.src); })
  $('#img4').click(function() { displayModal(this.src); })

  $('#delete1').click(function() { $('#img1').attr('src', null)})
  $('#delete2').click(function() { $('#img2').attr('src', null)})
  $('#delete3').click(function() { $('#img3').attr('src', null)})
  $('#delete4').click(function() { $('#img4').attr('src', null)})

  $('#delete').click(function() { $('#myModal').modal("show"); });

  $('#delete-post').click(function() { deletePost(postId); });

  $('#edit').on("click", function() {
    console.log("edit clicked");
    $(this).hide();
    $('#done').show();
    $('#labels').hide();
    $('#postedOn').hide();
    $('#types').show();
    $('.edits').show();
    $('.test').show();
    $('.postImage').show();
      var $description=$('#description'), isEditable=$description.is('.editable');
      $description.prop('contenteditable',!isEditable).toggleClass('editable');

      var $zip=$('#zipcode'), isEditable=$zip.is('.editable');
      $zip.prop('contenteditable', !isEditable).toggleClass('editable');

      var $title=$('.postTitle'), isEditable=$title.is('.editable');
      $title.prop('contenteditable', !isEditable).toggleClass('editable');

      $('#upload1').change(function() {
        uploadImage('#upload1', '#img1');
        $('#img1').show();
        img1 = $('#img1').attr('src');
    	})

      $('#upload2').change(function() {
        uploadImage('#upload2', '#img2');
        $('#img2').show();

    	})

      $('#upload3').change(function() {
        uploadImage('#upload3', '#img3');
        $('#img3').show();
    	})

      $('#upload4').change(function() {
        uploadImage('#upload4', '#img4');
        $('#img4').show();
    	})
  })

  $('#done').on("click", function() {
    console.log("done clicked");
    $(this).hide();
    $('#edit').show();
    $('#labels').show();
    $('#postedOn').show();
    $('#types').hide();
    $('.edits').hide();
    $('.test').hide();
    // $('.postImage').show();
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
          $("#perishableTag").text("Perishable");
          perishable = true;
      }

      if($('#non-perishable').is(':checked')) {
          perishable = false;
          $("#perishableTag").text("Non-Perishable");
      }


      if (!$('#img1').attr('src')) { $('#img1').hide() }
      if (!$('#img2').attr('src')) { $('#img2').hide() }
      if (!$('#img3').attr('src')) { $('#img3').hide() }
      if (!$('#img4').attr('src')) { $('#img4').hide() }

      console.log($('#description').text());
      var edits = {
        postId : postId,
        description: $('#description').text(),
        zipcode: $('#zipcode').text(),
        title: $('.postTitle').text(),
        type: type,
        perishable: perishable,
        servingSize: servingSize,
        img1: $('#img1').attr('src'),
        img2: $('#img2').attr('src'),
        img3: $('#img3').attr('src'),
        img4: $('#img4').attr('src')
      }
      console.log(edits);
      $.post('/updatePostInfo', edits, function(request, response) {
        console.log(response);

      })

  })
});
