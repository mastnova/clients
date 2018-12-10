const config = require('../config');
const db = require('mongoose');

db.connect(config.get('db-host'));

module.exports = db;