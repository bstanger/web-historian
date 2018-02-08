var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var https = require('https');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

//var urls = [];

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  //console.log('in readListOfUrls', exports.paths.list);
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log('error reading sites.txt');
    } else {
      var urls = data.split('\n');
      urls.pop();
      callback(urls);
    }
    
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((urls) => {
    callback(urls.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls((urls) => {
    if (urls.includes(url)) {
      callback(false);
    } else {
      urls.push(url);
      //console.log(urls.join('\n') + ' to ' + exports.paths.list);
      fs.appendFile(exports.paths.list, url + '\n', callback);
      // fs.writeFile(exports.paths.list, urls.join('\n'), function(err) {
      //   console.log('asdf');
      //   if (err) {
      //     urls.pop();
      //     callback(false);
      //     console.log('error reading sites.txt');
      //   } else {
      //     console.log('asdf');
      //     callback(true);
      //   }
      // });
      //console.log('done');
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.access(url, fs.constants.F_OK, (isNotArchived) => {
    if (isNotArchived) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  // console.log(urls);
  urls.forEach((aUrl) => {
    var urlName = aUrl;
    //console.log(urlName);
    return function() {
      console.log(urlName);
      https.get('https://' + urlName, function(resp) {
        console.log('success!');
        var body = '';
        resp.on('data', function(data) {
          body += data;
        });
        resp.on('end', function() {
          //console.log(body);
          fs.writeFile(exports.paths.archivedSites + '/' + urlName, body, () => {
            console.log('written file');
          });
        });
      }).on('error', (err) => {
        console.log('Error: ' + err.message);
        // Should remove that non-existent url from sites.txt here
      });
    }();
  });
};