const Sequelize = require('sequelize');
const Config = require('../configuration.js');

const sequelize = Config.getSequelize();

const Asset = require('./Instrument.js');

const Instrument = sequelize.define('property', {
    name: {
        type: Sequelize.STRING
    },
    formula : {
        type : Sequelize.STRING
    }
  }, {
    underscored: true
  });

module.exports = Instrument;