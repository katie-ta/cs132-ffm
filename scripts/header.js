// function profileRedirect(profileEmail) {
// 	$.post('/profile', {email: profileEmail}, function(response) {
// 		console.log("response: " + response);
// 		console.log("response user Id" + response.id);
// 		window.location = "/profile=" + response.id;
// 	});
// }

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
