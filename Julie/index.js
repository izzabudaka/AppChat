var $ = require('jquery');
var request = require('request');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://scorching-inferno-4414.firebaseIO.com/components");

baseUri = 'https://api.wit.ai/message?q='
document.getElementById("btn-chat").addEventListener("click", findValue);


var greetingSentences = ["Hi", "Hi!", "Hello!", "Hello", "Good morning", "Hi there", "Hey my friend"];
var doneSentences = ["Done", "I'll take care of it", "Here you go", "Just a second", "Will do", "Just a moment", "Ok", "I've done that", "Sure, I can do this for you"];
var gratitudeSentences = ["You're welcome", "You are welcome", "My pleasure", "No problem!"];

function getMessage(message) {
  return '<li class="right clearfix"><span class="chat-img pull-right"><img src="https://www.tynesidecinema.co.uk/_shared_assets/images/user.png" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>A few moments ago</small><strong class="pull-right primary-font">You</strong></div><p>' + message + '</p></div></li>';
}

function getReply(message) {
  return '<li class="left clearfix"><span class="chat-img pull-left"><img src="http://www.iconsfind.com/wp-content/uploads/2016/01/20160111_5693b29472389.png" height="50" width="50" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">Julie</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>A few moments ago</small></div><p>' + message +'</p></div></li>';
}

var context = "";

function findValue() {
  var message = $($('#btn-input')).val();
  $(".chat").append(getMessage(message));
  var uri = baseUri + message;
  if (context != "") {
    uri += "&context="+context;
  }
  getData(uri, $(".chat"))
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
          result = "I am not sure that you meant. Can you please rephrase?"
          console.log(result)
          element.append(getReply(result))
        } else {
          var reply = "Intent: "+ intent + "\n value: " + entities;
          console.log(intent);
          switch(intent) {
            case 'greeting': reply = greetingSentences[Math.floor(Math.random()*greetingSentences.length)];
            break;
            case 'silly_question': reply = "This doesn't sound like something I'll be able to help you with.";
            break;
            case 'info': reply = "Hopefully I will be able to help you with that.";
            break;
            case 'add_login': reply = "Which fields to you want?";
                              context = '{"state": "STATE_WAITING_LOGIN_FIELDS"}';
            break;
            case 'gratitude': reply = gratitudeSentences[Math.floor(Math.random()*gratitudeSentences.length)];
            break;
            default: reply = doneSentences[Math.floor(Math.random()*doneSentences.length)];
                     context = "";
            break;
          }
          pushFirebase( { 'intent': intent, 'entities': entities, 'timestamp': Firebase.ServerValue.TIMESTAMP } )
          element.append(getReply(reply));
        }
      } else{
        console.log("An error occured " + err)
        element.append(getReply(err));
      }
    });
}
