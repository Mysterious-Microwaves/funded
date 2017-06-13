var cron = require('node-cron');
var utils = require('../utils');

var currentDate = new Date();

module.exports.init = function() {
  utils.update.writeAll();

  cron.schedule('*/10 * * * * *', function() {
    utils.update.addRecentCollections(currentDate);
    curentDate = new Date();
  });

};
