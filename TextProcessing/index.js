var request = require('request');

query = 'Add button Cat'
junk  = "AHDHSAHD"
uri   = 'https://api.wit.ai/message?q=' + junk

var getConfidence = function(res) {
  console.log(res)
  return res.outcomes[0].confidence
}

var getIntent = function(res) {
  return res.outcomes[0].intent
}

var getEntities = function(res) {
  return res.outcomes[0].entities
}

var witChat = function(uri){
  var witResponse = getData(uri, null, function(res) {
    var confidence = getConfidence(res)
    var intent     = getIntent(res)
    var entities   = getEntities(res)
    if(confidence < 0.5) {
      result = "I am " + (confidence * 100) + " sure that you meant " +
               intent + " with entities " + entities 
               + " can you please rephrase?"
      return result
    }
  return witResponse
  })
}

var getData = function(uri, method){
  request({
      headers: {
        'Authorization' : 'Bearer 2IXWHHCFB2UAYF7L4M7R2O6YN7V3ZN2C'
      },
      uri: uri,
      method: method || "GET"
    }, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        console.log("Data retrieved successfully\n" + body)
        return body
      } else{
        console.log("An error occured " + err)
        return body
      }
    });
}

witChat(uri)