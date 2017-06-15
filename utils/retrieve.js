const Promise = require('bluebird');
const redis = Promise.promisifyAll(require('../redis'));

module.exports.readAll = function(projects, res) {
  if (projects) {
    var counter = 0;
    for (var i = 0; i < projects.length; i++) {
      let project = projects[i];
      redis.hgetallAsync(project.id)
      .then(response => {
        if (response) {
          project.current = response.total;
          project.pledges = response.pledges;
        } else {
          project.current = 0;
          project.pledges = 0;
        }
        counter++;
        if (counter === projects.length) {
          res.send(projects);
        }
      });

    }   
  } else {
    res.send(null);
  }
};

module.exports.getNearlyFunded = function(res) {
  redis.smembersAsync('nearlyFunded')
  .then(projects => {
    var augmentedProjects = [];
    for (let i = 0; i < projects.length; i++) {
      redis.hgetallAsync(projects[i])
      .then(project => {
        augmentedProjects.push({
          id: projects[i],
          current: project.total,
          pledges: project.pledges
        });
        if (augmentedProjects.length === projects.length) {
          res.send(augmentedProjects);
        }
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.send(400);
  });
};
