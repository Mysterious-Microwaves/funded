const models = require('../psql/models');
const Promise = require('bluebird');
const redis = Promise.promisifyAll(require('../redis'));

const logError = function(err) {
  console.log('there was an error!', err);
};

module.exports.removeExpired = function(date) {
  // redis.smembersAsync('nearlyFunded')
  // .then(projectsIds => {
  //   projectIds = projectIds || [];
  //   return models.Project
  //   .where('id', 'IN', projectsIds)
  //   .where('due_date', '<', date)
  //   .fetchAll()
  // })
  // .then(expiredProjects => {
  //   expiredProjects = expiredProjects.serialize();
  //   for (var i = 0; i < expiredProjects.length; i++) {
  //     redis.srem('nearlyFunded', expiredProjects[i].id);
  //   }
  // })
  // .catch(logError);
};


const getRecentFunding = function(date) {
  return models.Collection
  .where('created_at', '>', date)
  .fetchAll()
  .then(response => {
    return response;
  })
  .catch(logError);
};

const addGoal = function(projectId) {
  return models.Project
  .where({
    id: projectId
  })
  .fetch()
  .then(project => {
    redis.hset(projectId, 'goal', project.attributes.goal);
    return project.attributes.goal;
  });
};


const checkNearlyFunded = function(id, amount, goal, change) {
  var initialPercent = amount / goal;
  var futurePercent = (amount + change) / goal;
    // console.log('id', id)
  if (futurePercent >= .5 && futurePercent < 1) {
    redis.saddAsync('nearlyFunded', id)
  } else if (initialPercent >= .5 && futurePercent < 1) {
    redis.srem('nearlyFunded', id);
  } 
};

const updateProjectData = function(projectData) {
  for (var key in projectData) {
    redis.hgetallAsync(key)
    .then(response => {
      if (response && response.goal) {
        checkNearlyFunded(key, response.amount, response.goal, projectData[key].amount);
      } else {
        addGoal(key)
        .then(goal => {
          checkNearlyFunded(key, 0, goal, projectData[key].amount);
        });
      }
    });
    redis.hincrby(key, 'total', projectData[key].amount);
    redis.hincrby(key, 'pledges', projectData[key].pledges);
  };
};

module.exports.addRecentCollections = function(date) {
  getRecentFunding(date)
  .then(collections => {
    var projects = {};
    collections.forEach(collection => {
      var col = collection.attributes;
      projects[col.project_id] = projects[col.project_id] || { amount: 0, pledges: 0 };
      projects[col.project_id].amount += col.amount;
      projects[col.project_id].pledges += 1;
    });
    updateProjectData(projects);
  })
  .catch(logError);
};

const getFundingForAll = function() {
  return models.Project.fetchAll({
    withRelated: ['collections'],
    columns: ['id', 'goal']
  })
  .then(result => {
    return result;
  })
  .catch(logError);
};

module.exports.writeAll = function() {
  getFundingForAll()
  .then(projects => {
    projects.forEach(project => {
      var total = project.relations.collections.reduce((acc, collection) => {
        return acc + collection.attributes.amount;
      }, 0);
      redis.HMSET(project.attributes.id, {
        'total': total,
        'goal': project.attributes.goal,
        'pledges': project.relations.collections.length
      });
      checkNearlyFunded(project.attributes.id, total, project.attributes.goal, 0);
    });
  })
  .catch(error => {
    console.log('ERROR: ', error)
  });
};


