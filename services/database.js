'use strict';
var config = require('../config');
var knex = require('knex')({
	client: config.db.db_client,
	connection: config.db.db_connection,
});
module.exports = knex;