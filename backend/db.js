const config = require('../config');
const db = require('mongoose');

db.connect(`mongodb://${config.get('db-login')}:${config.get('db-password')}@${config.get('db-host')}/${config.get('db-name')}`)

module.exports = db;