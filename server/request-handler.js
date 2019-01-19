/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
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


messages = {
  results: [{username: 'Jono', text: 'Do my bidding!', createdAt: 47, objectId: 1}]
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  }

  if (request.method === 'GET') {
    if (request.url === '/classes/messages' || request.url === '/classes/messages?order=-createdAt') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(messages));
    } else {
      response.writeHead(404, headers);
      response.end('Hello, World!');
    }
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages' || request.url === '/classes/messages?order=-createdAt') {
      response.writeHead(201, headers);
      var data;
      request.on('data', (chunk) => {
        data = JSON.parse(chunk.toString());
      }).on('end', () => {
        messages.results.push(data);
        data.objectId = Date.now();
        data.createdAt = Date.now();
        response.end(JSON.stringify(data));
      });
    } else {
      response.writeHead(404, headers);
      response.end('Hello, World!');
    }
  } else {
    response.writeHead(404, headers);
    response.end('Hello, World!');
  }
};


exports.requestHandler = requestHandler;