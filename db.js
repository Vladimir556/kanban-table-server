const {Sequelize} = require('sequelize');
const path = require("path");
require('dotenv').config();

module.exports = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, './database.sqlite')
});
