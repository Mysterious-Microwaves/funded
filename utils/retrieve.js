const redis = require('../redis');
const Promise = require('bluebird');
var get = Promise.promisify(redis.get);

module.exports.readAll = function(projects, res) {
  var counter = 0;
  for (var i = 0; i < projects.length; i++) {
    let project = projects[i];
    get.call(redis, project.id).then(reply => {
      project.current = reply;
      counter++;
      if (counter === projects.length) {
        res.send(projects);
      }
    }); 
  }
};