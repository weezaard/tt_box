const Sequelize = require('sequelize');
const Config = require('../configuration.js');

const sequelize = Config.getSequelize();

const PropertyValue = sequelize.define('property_value', {
    property_name: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false
    },
    value: {
        type: Sequelize.DECIMAL
    },
  }, {
    underscored: true
  });

module.exports = PropertyValue;