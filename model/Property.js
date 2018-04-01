const Sequelize = require('sequelize');
const Config = require('../configuration.js');

const sequelize = Config.getSequelize();

const Property = sequelize.define('property', {
    name: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    formula : {
        type : Sequelize.STRING
    }
  }, {
    underscored: true
  });

module.exports = Property;