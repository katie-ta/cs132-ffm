var img1 = null;
var img2 = null;
var img3 = null;
var img4 = null;

function createPost() {
  // create a post from form
  console.log("creating a post");

  var postTitle = $('#postTitle').val();
  var zipcode = $('#zipcode').val();
  var description = $('#description').val();
  var type = "";
  var perishable = false;
  var servingSize = $('#servingSize').val();

  if($('#snack').is(':checked')) {
      type = "snack";
  }

  if($('#produce').is(':checked')) {
      type = "produce";
  }

  if($('#meal').is(':checked')) {
      type = "meal";
  }

  if($('#perishable').is(':checked')) {
      console.log("perishable");
      perishable = true;
  }

  if($('#non-perishable').is(':checked')) {
      perishable = false;
  }



  // get/make timestamp
  // note : TIMESTAMP in sql is stored as YYYY-MM-DD HH:MM:SS (non utc, I think)
  var dt = new Date($.now());
  console.log("dt : " + dt);
  console.log("month: " + dt.getMonth());
  console.log("day: " + dt.getDate());

  
  var timestamp = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()  + " " +  dt.getHours() + ":" + dt.getMinutes();
  
  var response = {
    title: postTitle,
    description: description,
    zipcode: zipcode,
    createdAt: timestamp,
    servingSize: servingSize,
    perishable: perishable,
    type: type,
    available: true,
    img1 : img1,
    img2: img2,
    img3: img3,
    img4: img4
  };

  console.log(response);

  $.post("/savePost", response , function(res) {
          if (res.status == "success") {
              console.log("successfully saved message");
              window.location = "/";
          }
  })
}

$(document).ready(function() {
  // console.log("current time: " + formatDate($.now()));
  var dt = new Date($.now());
  console.log("current month: " + monthNames[dt.getMonth()]);
  $('#submit-btn').on("click", createPost);

  $('#image1').change(function() {
		var file = $("#image1")[0].files[0]
      if (!file) return

      sign_request(file, function(response) {
      	console.log("signing request??");
      	sign_response = response;
        upload(file, response.signed_request, response.url, function() {
        	console.log("response: "+ response.url);
        	img1 = response.url;
          $("#preview1").attr("src",response.url);
        })
      })
	})

  $('#image2').change(function() {
		var file = $("#image2")[0].files[0]
      if (!file) return

      sign_request(file, function(response) {
      	console.log("signing request??");
      	sign_response = response;
        upload(file, response.signed_request, response.url, function() {
        	console.log("response: "+ response.url);
        	img2 = response.url;
          $("#preview2").attr("src",response.url);
        })
      })
	})

  $('#image3').change(function() {
		var file = $("#image3")[0].files[0]
      if (!file) return

      sign_request(file, function(response) {
      	console.log("signing request??");
      	sign_response = response;
        upload(file, response.signed_request, response.url, function() {
        	console.log("response: "+ response.url);
        	img3 = response.url;
          $("#preview3").attr("src",response.url);
        })
      })
	})

  $('#image4').change(function() {
		var file = $("#image4")[0].files[0]
      if (!file) return

      sign_request(file, function(response) {
      	console.log("signing request??");
      	sign_response = response;
        upload(file, response.signed_request, response.url, function() {
        	console.log("response: "+ response.url);
        	img4 = response.url;
          $("#preview4").attr("src",response.url);
        })
      })
	})

});
