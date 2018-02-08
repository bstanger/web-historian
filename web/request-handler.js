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
  // Add previous check for archive.isUrlInList
  // Check archive.isUrlArchived
  archive.isUrlInList(inputtedUrl, (isInList) => {
    if (isInList) {
      //console.log('is already in list');
      archive.isUrlArchived(archive.paths.archivedSites + '/' + inputtedUrl, (isArchived) => {
        if (isArchived) {
          //console.log('isArchived');
          http.serveAssets(res, archive.paths.archivedSites + '/' + inputtedUrl, () => {
            res.writeHead(200, http.headers);
            res.end();
          });
        } else {
          //console.log('In list but not archived yet');
          res.writeHead(404, http.headers);
          res.end();
        }
      });
    } else {
      console.log('Nope not in list');
      if (isPost) {
        archive.addUrlToList(inputtedUrl, (success) => {
          res.writeHead(302, http.headers);
          res.end();
        });
      } else {
        archive.isUrlArchived(archive.paths.archivedSites + '/' + inputtedUrl, (isArchived) => {
          if (isArchived) {
            console.log('isArchived');
            http.serveAssets(res, archive.paths.archivedSites + '/' + inputtedUrl, () => {
              //console.log(http.headers);
              console.log('serve inputtedUrl: ' + inputtedUrl);
              //console.log()
              //res.writeHead(200, http.headers);
              res.end();
            });
            // res.writeHead(302, archive.headers);
            // res.end();
          } else {
            archive.addUrlToList(inputtedUrl, (success) => {
              res.writeHead(404, http.headers);
              res.end();
            });
          }
        });
      }
    }
  });
  // archive.isUrlArchived(archive.paths.archivedSites + '/' + inputtedUrl, (isArchived) => {
  //   if (isArchived) {
  //     console.log('isArchived');
  //     http.serveAssets(res, archive.paths.archivedSites + '/' + inputtedUrl);
  //     res.writeHead(302, archive.headers);
  //     res.end();
  //   } else {
  //     console.log('Nope not archived');
  //     res.writeHead(404, archive.headers);
  //     res.end();
  //     archive.addUrlToList(inputtedUrl);
  //   }
  // });
};

exports.handleRequest = function (req, res) {
  //res.writeHead(200, http.headers);
  if (req.url === '/') {
    //console.log(req.url);
    if (req.method === 'POST') {
      collectPostBody(req, processInputtedUrl, res, true);
    } else if (req.method === 'GET') {
      http.serveAssets(res, archive.paths.siteAssets + '/index.html', () => {
        res.end();
      });
    }
  } else if (req.url === '/styles.css') {
    http.serveAssets(res, archive.paths.siteAssets + '/styles.css', () => {
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end();
    });
  } else {
    var urlLocation = req.url.split('/')[1];
    console.log('get: ' + urlLocation);
    processInputtedUrl(urlLocation, res);
  }
  
};