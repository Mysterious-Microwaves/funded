'use strict';

const app = require('./app');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('Example app listening on port %s!', PORT);
});