/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

/* TO DO's
  Create a createdAt and an objectId property when generating newChatObject
    (May need to find a hashing function or make a really simple one.)
  In POST, check if data successfully stored before sending 201
  Make sure required fields are present when generating newChatObject

  NOTE: There's sample JSON objects code at the bottom.
*/
/* Minor note on possible problem:
(when we use qs.parse with GET if we ever do)
strange error when I tried getting sinon - error from earlier
npm WARN package.json querystring@0.2.0 querystring is also the name of a node core module.
*/


var requestHandler = function(request, response) {

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'text/json'; // just changed from text/plain


  /* Routing based on http method and URL
  */
  if (request.url !== '/classes/messages') {
    response.writeHead(404, 'Our custom 404!', {'Content-Type': 'text/plain'});
    response.end();
  }
  if (request.method === 'GET') {
    if (request.url === '/classes/messages') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(chatData));
    }
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages') {
      var requestBody = '';

      request.on('data', function(data) {
        requestBody += data;
      });

      request.on('end', function() {
        
        response.writeHead(201, headers);
        makeNewChatObject(requestBody);
        response.end();
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
  {'results': [] };

var makeNewChatObject = function(chatString) {

  var chatObj = JSON.parse(chatString);
  chatData.results.push(chatObj);

};

/* Sample chat-message object
*/
// {'createdAt': '2016-03-21T22:36:09.712Z',
//        'objectId': 'EKp683R6Ut',
//        'roomname': 'lobby',
//        'text': 'asdf',
//        'updatedAt': '2016-03-21T22:36:09.712Z',
//        'username': 'bob'
//      }


/* sample Get & Post responses:

data from GET: {"results":[{"createdAt":"2016-03-21T22:36:09.712Z","objectId":"EKp683R6Ut","roomname":"lobby","text":"asdf","updatedAt":"2016-03-21T22:36:09.712Z","username":"bob"}

POST response:  
data = {"createdAt":"2016-03-21T22:41:25.530Z","objectId":"hBTSsm7P2H"}
app.js:132 chatterbox: Message sent
*/

module.exports = requestHandler;
