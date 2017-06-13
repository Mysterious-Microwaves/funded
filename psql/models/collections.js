const db = require('../');

const Collection = db.Model.extend({
  tableName: 'collections',
  projects: function() {
    return this.belongsTo('Project');
  }
});


module.exports = db.model('Collection', Collection);
