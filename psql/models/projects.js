const db = require('../');

const Project = db.Model.extend({
  tableName: 'projects',
  collections: function() {
    return this.hasMany('Collection');
  },
  orgs: function() {
    return this.belongsTo('Org');
  }
});

module.exports = db.model('Project', Project);