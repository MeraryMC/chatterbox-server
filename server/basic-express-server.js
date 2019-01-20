var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router()
var app = express()
var port = 3000;
var ip = '127.0.0.1';

var filePath = path.join(__dirname, 'messages.json');
messages = JSON.parse(fs.readFileSync(filePath));

// helper function to write messages to file on server
var writeMessage = function() {
  var savedMessage = JSON.stringify(messages);
  fs.writeFile(filePath, savedMessage, 'utf8', function(err) {
    if (err) {
      return;
    }
  });
};

app.use(function(req, res, next) {
  // allow CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

app.use(express.static('../client'));
app.get('/classes/messages', function (req, res, next) {
    //console.log(typeof messages);
    console.log(req.originalUrl);
   res.send(JSON.stringify(messages));
});

app.post('/classes/messages', function (req, res, next) {
  var data;
  req.on('data', (chunk) => {
    data = JSON.parse(chunk.toString());
  }).on('end', () => {
    messages.results.push(data);
    data.objectId = Date.now();
    data.createdAt = Date.now();
    writeMessage();
    res.send(JSON.stringify(data));
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
