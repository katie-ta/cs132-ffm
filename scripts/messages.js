var socket = io.connect();

$(document).ready(function() {
  var room = meta('roomName');
  $('body').prepend("<div id = 'whitebox' style='display: none'><div id = newChatContainer'>"
    + "<div id='newConvo'>Search a user to chat with</div>" + "<form id ='newConvoForm' action='/'<input id='newConvoUser' name = 'newConvoUser'"
  + "autocomplete= 'off'></input></form></div></div>");

  //when they start a new chat
  $("#newChatButton").on("click", function(e){
    e.preventDefault();
    //pop up to ask who to talk to
    $('#whitebox').fadeIn(200);
    $('#newConvoUser').focus();
    $('#newConvoForm').submit(function(e){
      e.preventDefault();
      username = $('#newConvoUser').val();
      //join that room with that user (if theyve never chatted before, it will create a new room)
      socket.emit('join', username, function(messages){
        for( var i = 0; i < messages.length; i++){
          //make each message html
          var msgHTML = "<li class = 'newMessage'>" + "<span class='newUser'>" + messages[i].username + ": " + "</span>" + messages[i].body + "</li>";
          var convoHTML = "<li class = 'newConvo'>" + "<span class = 'newConvo'>" + messages[i].username + "</span></li>";
          $("#convos").append(convoHTML);
          $("#messages").append(msgHTML);
        }
      });
      $('#whitebox').fadeOut(100, function(){
        this.remove();
      });
      $('#messageBox').show();
      $('#messageField').focus();
        $('#submitmsg').on("click", sendMessage);
    });
  });

  socket.on('message', function(username, message){
    var msg = "<p class='newMessage'>" + "<span class=newNickname'>" + nickname + ": " + "</span>" + message + "</p>";
    $("#messages").append(msg);
  });
});

function sendMessage(e) {
  console.log("sending message");
  e.preventDefault();
  var keywords = $('#messageField').val();
  socket.emit('message', keywords);
  $('')
}

function meta(name) {
	var tag = document.querySelector('meta[name=' + name + ']');
	if(tag != null) {
		return tag.content;
	}
	return '';
}
