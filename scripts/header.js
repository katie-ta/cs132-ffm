var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDate(timestamp) {
  let split = timestamp.split(" ");
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
    return hour + ":" + minutes + end + " " + monthNames[date[1] - 1] + " " + date[2] + ", " + date[0];
}

function upload(file, signed_request, url, done) {
  var xhr = new XMLHttpRequest()
  xhr.open("PUT", signed_request)
  console.log("signed request: " + signed_request);
  console.log("url: " + url);
  xhr.setRequestHeader('x-amz-acl', 'public-read')
  xhr.onload = function() {
    if (xhr.status === 200) {
      done()
    }
  }

  xhr.send(file)
}

function sign_request(file, done) {
  var xhr = new XMLHttpRequest()
  console.log("file: " + file);
  xhr.open("GET", "/sign?file_name=" + file.name + "&file_type=" + file.type)

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText)
      done(response)
    }
  }

  xhr.send()
}

// 
//
// $(document).ready(function() {
// 	var userId = null;
// });
