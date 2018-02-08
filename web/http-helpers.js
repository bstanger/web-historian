var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  var file = asset.split('/')[1];
  fs.readFile(asset, function (err, data) {
    console.log('trying to access: ' + asset);
    
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.writeHead(200, exports.headers);
      res.write(data);
      callback();
    }
    //res.end();
  });
  
};



// As you progress, keep thinking about what helper functions you can put here!
