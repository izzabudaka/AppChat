var $ = require('jquery');

document.getElementById("btn-chat").addEventListener("click", findValue);
function findValue() {
  var message = $($('#btn-input')).val();

  var reply = '<li class="right clearfix"><span class="chat-img pull-right"><img src="https://www.tynesidecinema.co.uk/_shared_assets/images/user.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>13 mins ago</small><strong class="pull-right primary-font">User</strong></div><p>' + message + '</p></div></li>';
  $(".chat").append(reply);
  $("#btn-input").val('');
}
