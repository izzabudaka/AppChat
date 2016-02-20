var request = require('request');

query = 'Add button Cat'
junk  = "AHDHSAHD"
uri   = 'https://api.wit.ai/message?q='

var http = require('http');
var dispatcher = require('httpdispatcher');
dispatcher.setStatic('resources');

dispatcher.onPost("/chat", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    getData(uri + req.body, res)
});

const PORT=8080; 
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

var getData = function(uri, response, method){
  var result;
  request({
      headers: {
        'Authorization' : 'Bearer 2IXWHHCFB2UAYF7L4M7R2O6YN7V3ZN2C'
      },
      uri: uri,
      method: method || "GET"
    }, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        console.log("Data retrieved successfully\n" + body)
        body = JSON.parse(body)
        var confidence = body.outcomes[0].confidence
        var entities   = body.outcomes[0].entities
        var intent     = body.outcomes[0].intent
        if(confidence < 0.5) {
          result = "I am " + (confidence * 100) + "% sure that you meant " +
                   intent + " with entities " + entities 
                   + " can you please rephrase?"
          console.log(result)
          response.end(result)
        } else {
          response.end(res)
        }
      } else{
        console.log("An error occured " + err)
        response.end(err)
      }
    });
}