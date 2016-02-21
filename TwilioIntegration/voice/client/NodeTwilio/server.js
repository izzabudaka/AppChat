var twilio = require('twilio'),
    http = require('http');
 
http.createServer(function (req, res) {
    var resp = new twilio.TwimlResponse();

    resp.gather({ finishOnKey="#", action="/analyse", method:"POST" }, function() {
      resp.record( {maxLength:30} )
    });
 
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
 
}).listen(80, '45.33.68.134');
