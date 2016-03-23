var url = require('url');
var fs = require('fs');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/



var requestHandler = function(request, response) {

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'text/json'; // just changed from text/plain

  var urlObj = url.parse(request.url, true);
  var path = urlObj.pathname;

  /* Routing based on http method and URL
  */
  if (path !== '/classes/messages') {
    response.writeHead(404, 'Our custom 404!', {'Content-Type': 'text/plain'});
    response.end();
  }
  if (request.method === 'GET') {
    if (request.url === '/classes/messages') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(chatData));
    }
  } else if (request.method === 'POST') {
    if (path === '/classes/messages') {
      var requestBody = '';

      request.on('data', function(data) {
        requestBody += data;
      });

      request.on('end', function() {
        response.writeHead(201, headers);
        var thisObj = makeNewChatObject(requestBody);
        response.end(JSON.stringify(thisObj));
      });
    } 
  } else if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else {
    response.writeHead(405, 'Method not supported', {'Content-Type': 'text/plain'});
  }

};


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var chatData = 
{'results': [] 
};


var makeNewChatObject = function(chatString) {
  chatString = chatString || '';
  var dateCreated = new Date();
  var chatObj = JSON.parse(chatString);
  chatObj.createdAt = chatObj.updatedAt = dateCreated;
  chatObj.objectId = simpleHash(chatObj.text);
  chatData.results.push(chatObj);
  // new write-to-a-file code
  fs.appendFile('/tmp/chatdata.txt', JSON.stringify(chatObj) + '|', function(err) {
    if (err) {
      console.log(err);
    }
  }); 

  return chatObj;
};

var simpleHash = function(text) {

  return Date.now();

};


module.exports = requestHandler;
