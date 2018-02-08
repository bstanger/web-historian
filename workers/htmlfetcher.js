// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

var fetchHTML = function() {
  var helperUrls = [];
  var urlsCount = 0;
  var downloadUrls = archive.downloadUrls;

  archive.readListOfUrls((urls) => {
    for (var i = 0; i < urls.length; i++) {
      archive.isUrlArchived(urls[i], function() {
        var index = i;
        return (isArchived) => {
          urlsCount++;
          if (!isArchived) {
            helperUrls.push(urls[index]);
          }
          if (urlsCount === urls.length) {
            downloadUrls(helperUrls);
          }
        };
      }());
    }
  });

};

fetchHTML();