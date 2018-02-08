var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

var collectPostBody = function(req, callback, res) {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    var inputtedUrl = body.split('=')[1];
    callback(inputtedUrl, res);
  });
};

var processInputtedUrl = function(inputtedUrl, res) {
  archive.isUrlArchived(inputtedUrl, (isArchived) => {
    if (isArchived) {
      http.serveAssets(res, archive.paths.archivedSites + '/' + inputtedUrl);
    } else {
      console.log('Nope not archived');
    }
  });
};

exports.handleRequest = function (req, res) {
  res.writeHead(200, http.headers);
  if (req.url === '/') {
    console.log(req.url);
    if (req.method === 'POST') {
      collectPostBody(req, processInputtedUrl, res);
    } else if (req.method === 'GET') {
      http.serveAssets(res, archive.paths.siteAssets + '/index.html');
    }
  } else if (req.url === '/styles.css') {
    http.serveAssets(res, archive.paths.siteAssets + '/styles.css');
  } else {
    var urlLocation = req.url.split('/')[1];
    processInputtedUrl(urlLocation, res);
  }
  
};