const Sequelize = require('sequelize');
const Config = require('../configuration.js');

const sequelize = Config.getSequelize();

const Asset = require('./Asset.js');

const Instrument = sequelize.define('instrument', {
     date_of_value: {
      type: Sequelize.DATE,
      allowNull: false
    },
    value: {
        type: Sequelize.DECIMAL
    },
  }, {
    underscored: true
  });

module.exports = Instrument;