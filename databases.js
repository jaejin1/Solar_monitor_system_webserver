var db_config = require('./db_config.json');

module.exports = {
  host : db_config.host,
  user : db_config.user,
  password : db_config.password,
  database : db_config.databases
};
