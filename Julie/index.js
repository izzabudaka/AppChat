var $ = require('jquery');
var request = require('request');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://scorching-inferno-4414.firebaseIO.com");

baseUri = 'https://api.wit.ai/message?q='
document.getElementById("btn-chat").addEventListener("click", findValue);

function getMessage(message) {
  return '<li class="right clearfix"><span class="chat-img pull-right"><img src="https://www.tynesidecinema.co.uk/_shared_assets/images/user.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>13 mins ago</small><strong class="pull-right primary-font">User</strong></div><p>' + message + '</p></div></li>';
}

function getReply(message) {
  return '<li class="left clearfix"><span class="chat-img pull-left"><img src="http://www.iconsfind.com/wp-content/uploads/2016/01/20160111_5693b29472389.png" height="50" width="50" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">Julie</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>12 mins ago</small></div><p>' + message +'</p></div></li>';
}

function findValue() {
  var message = $($('#btn-input')).val();
  $(".chat").append(getMessage(message));
  getData(baseUri + message, $(".chat"))
  $("#btn-input").val('');
}

function pushFirebase(data){
  console.log('Sending ' + JSON.stringify(data) + ' to firebase!\n')
  myFirebaseRef.push(data);
}

var getData = function(uri, element){
  var result;
  request({
      headers: {
        'Authorization' : 'Bearer 2IXWHHCFB2UAYF7L4M7R2O6YN7V3ZN2C'
      },
      uri: uri,
      method: "GET"
    }, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        console.log("Data retrieved successfully\n" + body)
        body = JSON.parse(body)
        var confidence = body.outcomes[0].confidence
        var entities   = JSON.stringify(body.outcomes[0].entities)
        var intent     = body.outcomes[0].intent
        if(confidence < 0.5) {
          result = "I am " + (confidence * 100) + "% sure that you meant " +
                   intent + " with entities " + entities
                   + " can you please rephrase?"
          console.log(result)
          element.append(getReply(result))
        } else {
          pushFirebase( { 'intent': intent, 'entities': entities, 'timestamp': Firebase.ServerValue.TIMESTAMP } )
          element.append(getReply("Intent: "+ intent + "\n value: " + entities))
        }
      } else{
        console.log("An error occured " + err)
        element.append(getReply(err));
      }
    });
}