var fs = require('fs');
var path = require('path');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

// file location of all posted messages
var filePath = path.join(__dirname, 'messages.json');

// helper function to write messages to file on server
var writeMessage = function() {
  var savedMessage = JSON.stringify(messages);
  fs.writeFile(filePath, savedMessage, 'utf8', function(err) {
    if (err) {
      return;
    }
  });
};

// initializes messages with files from our local drive
messages = JSON.parse(fs.readFileSync(filePath));

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
    } else if (request.url.includes('/client')) {
      response.writeHead(200);
      pathParts = request.url.split('?');

      var indexPath = path.join(__dirname, '..', ...pathParts[0].split('/'));

      response.end(fs.readFileSync(indexPath));
    } else if (request.url === '/client/client/styles/styles.css') {
      response.writeHead(200);
      var cssPath = path.join(__dirname, '..', 'client', 'client', 'styles', 'styles.css');
      response.end(fs.readFileSync(cssPath));
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
        writeMessage();
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