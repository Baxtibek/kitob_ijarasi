const {Sequelize} = require('sequelize');
const config = require('config');

module.exports = new Sequelize(
    config.get("db_name"),
    config.get("db_username"),
    config.get("db_password"),
    {
        dialect: "postgres",
        logging: false,
        host: config.get("db_host"),
        port: config.get("db_port"),
    }
)