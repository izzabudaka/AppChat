var http = require('http');
var dispatcher = require('httpdispatcher');
var request = require('request');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://scorching-inferno-4414.firebaseIO.com");
var twilio = require('twilio');

function pushFirebase(data){
  console.log('Sending ' + JSON.stringify(data) + ' to firebase!\n')
  myFirebaseRef.push(data);
}

var getData = function(uri, callback){
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
          return JSON.stringify(result)
        } else {
          pushFirebase( { 'intent': intent, 'entities': entities, 'timestamp': Firebase.ServerValue.TIMESTAMP } )
          return "Intent: "+ intent + "\n value: " + entities
        }
      } else{
        console.log("An error occured " + err)
        return JSON.stringify(err);
      }
    });
}

function handleRequest(request, response){
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

http.createServer(function (req, res) {
    handleRequest(req, res)
}).listen(3000);

dispatcher.setStatic('resources');

dispatcher.onGet("/button", function(req, res) {
    var resp = new twilio.TwimlResponse();
    resp.say("Add a button with text Eureka!")
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString())
});   

function getCommandText(reqBody, callback) {
  reqBody.split("&").forEach( function(element) {
    if(element.indexOf("TranscriptionText") > -1 ){
      element = element.split("=")[1]
      while( element.indexOf("%20") > -1 )
        element = element.replace("%20", " ")
      element = element.trim()
      callback(element)
    }
  })
}
dispatcher.onPost("/analyse", function(req, res) {
    console.log(req.body.split("&"))
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    getCommandText( req.body, function (result) {
      getData('https://api.wit.ai/message?q=' + result)
      res.end("Done") 
    })
});
   
dispatcher.onPost("/call", function(req, res) {
    var resp = new twilio.TwimlResponse();
    resp.say('Please state your command')
    resp.record( { maxLength:30, transcribeCallback: "/analyse" } )
    resp.say('Thank you')
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString())
});   
