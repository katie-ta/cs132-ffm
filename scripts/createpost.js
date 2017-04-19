$(document).ready(function() {
  $('#submit-btn').on("click", createPost);

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
    var timestamp = dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDay() + " " +  dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    var response = {title: postTitle, description: description, zipcode: zipcode, createdAt: timestamp, servingSize: servingSize, perishable: perishable, type: type, available: true};
    console.log(response);

    $.post("/savePost", response , function(res) {
        //TODO: send back all data to be inserted into database
        //you might want to add callback function that is executed post request success
            if (res.status == "success") {
                console.log("successfully saved message");
            }
    })
  }
});