var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

var collectPostBody = function(req, callback, res, isPost) {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    var inputtedUrl = body.split('=')[1];
    callback(inputtedUrl, res, isPost);
  });
};

var processInputtedUrl = function(inputtedUrl, res, isPost) {
  archive.isUrlInList(inputtedUrl, (isInList) => {
    if (isInList) {
      archive.isUrlArchived(archive.paths.archivedSites + '/' + inputtedUrl, (isArchived) => {
        if (isArchived) {
          http.serveAssets(res, archive.paths.archivedSites + '/' + inputtedUrl, (data) => {
            res.writeHead(200, http.headers);
            res.write(data);
            res.end();
          });
        } else {
          http.serveAssets(res, archive.paths.siteAssets + '/loading.html', (data) => {
            res.writeHead(302, http.headers);
            console.log('should be 404');
            res.write(data);
            res.end();
          });
        }
      });
    } else {
      if (isPost) {
        archive.addUrlToList(inputtedUrl, () => {
          http.serveAssets(res, archive.paths.siteAssets + '/loading.html', (data) => {
            res.writeHead(302, http.headers);
            res.write(data);
            res.end();
          });
        });
      } else {
        archive.isUrlArchived(archive.paths.archivedSites + '/' + inputtedUrl, (isArchived) => {
          if (isArchived) {
            console.log('isArchived');
            http.serveAssets(res, archive.paths.archivedSites + '/' + inputtedUrl, (data) => {
              console.log('serve inputtedUrl: ' + inputtedUrl);
              res.write(data);
              res.end();
            });
          } else {
            archive.addUrlToList(inputtedUrl, (success) => {
              http.serveAssets(res, archive.paths.siteAssets + '/loading.html', (data) => {
                res.writeHead(404, http.headers);
                res.write(data);
                res.end();
              });
            });
          }
        });
      }
    }
  });
};

exports.handleRequest = function (req, res) {
  if (req.url === '/') {
    if (req.method === 'POST') {
      collectPostBody(req, processInputtedUrl, res, true);
    } else if (req.method === 'GET') {
      http.serveAssets(res, archive.paths.siteAssets + '/index.html', (data) => {
        res.write(data);
        res.end();
      });
    }
  } else if (req.url === '/styles.css') {
    http.serveAssets(res, archive.paths.siteAssets + '/styles.css', (data) => {
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
    });
  } else {
    var urlLocation = req.url.split('/')[1];
    console.log('get: ' + urlLocation);
    processInputtedUrl(urlLocation, res);
  }
  
};