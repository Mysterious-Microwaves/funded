const config = require('config');

if (process.env.DATABASE_URL) {
  config.knex.connection.host = process.env.DATABASE_URL;
}

module.exports = config['knex'];
