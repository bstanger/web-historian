var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var urls = [];

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
  console.log('in readListOfUrls', exports.paths.list);
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log('error reading sites.txt');
    } else {
      urls = data.split('\n');
      callback(urls);
    }
    
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(() => {
    callback(urls.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls(() => {
    if (urls.includes(url)) {
      callback(false);
    } else {
      urls.push(url);
      console.log(urls.join('\n') + ' to ' + exports.paths.list);
      //fs.appendFile(exports.paths.list, url + '\n', callback);
      fs.writeFile(exports.paths.list, urls.join('\n'), function(err) {
        console.log('asdf');
        if (err) {
          urls.pop();
          callback(false);
          console.log('error reading sites.txt');
        } else {
          console.log('asdf');
          callback(true);
        }
      });
      console.log('done');
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  console.log('in isUrlArchived ', url);
  fs.access(url, fs.constants.F_OK, (isNotArchived) => {
    console.log(isNotArchived);
    if (isNotArchived) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  
};
