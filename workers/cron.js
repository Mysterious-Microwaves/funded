var cron = require('node-cron');
var utils = require('../utils');

const addCollectionsWorker = function() {
  var currentDate = new Date();
  cron.schedule('* * * * *', function() {
    console.log('updated collections');
    utils.update.addRecentCollections(currentDate);
    currentDate = new Date();
  });
};

// Removes expired projects from nearly funded
const removeExpiredWorker = function() {
  cron.schedule('00 00 * * *', function() {
    utils.update.removeExpired(new Date());
  });
};  

module.exports.init = function() {
  utils.update.writeAll();
  addCollectionsWorker();
  removeExpiredWorker();
};
