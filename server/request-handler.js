/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// TO DO: Investigate if querystring doesn't work
// strange error when I tried getting sinon - not sinon related but one of the errors for an earlier...
// npm WARN package.json querystring@0.2.0 querystring is also the name of a node core module.

var requestHandler = function(request, response) {
  

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // May need to be text/json or application/json
  headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // example args(200, {default})
  //response.writeHead(statusCode, headers);



 
  if (request.method === 'GET') {
    if (request.url === '/classes/messages') {
      // do our thing
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(chatData));
    }
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages') {
      var requestBody = '';


      request.on('data', function(data) {
        requestBody += data;
      });
      request.on('end', function() {
        // store the data first and send 201 only if successful
        
        response.writeHead(201, headers);

        makeNewChatObject(requestBody);
        // note: comes in stringified, so we have to use a parse - qs.parse?
        // write on the response object, it's all JSON for us
        // WE create a createdAt and an objectId property and return  
        // We might need to find a hashing function or make a really simple one
        response.end();
      });
    } else {
      response.writeHead(404, 'Our custom 404!', {'Content-Type': 'text/plain'});
    }
  } else if (request.method === 'OPTIONS') {
    // just return a 200 response with the allowed header
    response.writeHead(statusCode, headers);
    response.end();

  } else {
    response.writeHead(405, 'Method not supported', {'Content-Type': 'text/plain'});
  }

  /* sample Get & Post responses:

  data from GET: {"results":[{"createdAt":"2016-03-21T22:36:09.712Z","objectId":"EKp683R6Ut","roomname":"lobby","text":"asdf","updatedAt":"2016-03-21T22:36:09.712Z","username":"bob"}
  
  POST response:  
  data = {"createdAt":"2016-03-21T22:41:25.530Z","objectId":"hBTSsm7P2H"}
  app.js:132 chatterbox: Message sent
  */

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  console.dir(request);



  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //

  // response.data = data;
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //response.end(JSON.stringify(chatData));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var chatData = 
  {'results': [] };

var makeNewChatObject = function(chatString) {

  var chatObj = JSON.parse(chatString);
  chatData.results.push(chatObj);

};


// {'createdAt': '2016-03-21T22:36:09.712Z',
//        'objectId': 'EKp683R6Ut',
//        'roomname': 'lobby',
//        'text': 'asdf',
//        'updatedAt': '2016-03-21T22:36:09.712Z',
//        'username': 'bob'
//      }


module.exports = requestHandler;




