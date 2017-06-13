const models = require('../psql/models');
const redis = require('../redis');

const logError = function(err) {
  console.log('there was an error!', err);
};

const getRecentFunding = function(date) {
  return models.Collection.where('created_at', '>', date)
  .fetchAll()
  .then(response => {
    return response;
  })
  .catch(logError);
};

const update = function(key, val) {
  redis.incrby(key, val, function(err) {
    if (err) console.log(err)
  });
};

module.exports.addRecentCollections = function(date) {
  getRecentFunding(date)
  .then(collections => {
    var projects = {};
    collections.forEach(collection => {
      var col = collection.attributes;
      console.log(col.id);
      projects[col.id] = projects[col.id] || 0;
      projects[col.id] += col.amount;
    });
    for (var key in projects) {
      update(key, projects[key]);
    } 
  })
  .catch(logError);
};

const getFundingForAll = function() {
  return models.Project.fetchAll({
    withRelated: ['collections'],
    columns: ['id', 'title', 'goal']
  })
  .then(result => {
    return result;
  })
  .catch(logError);
};

const create = function(key, val) {
  redis.set(key, val, function(err, reply) {
    if (err) console.log(err)
  });
};

module.exports.writeAll = function() {
  getFundingForAll()
  .then(projects => {
    projects.forEach(project => {
      var total = project.relations.collections.reduce((acc, collection) => {
        return acc + collection.attributes.amount;
      }, 0);
      create(project.attributes.id, total);
    });
  })
  .catch(logError);
};

