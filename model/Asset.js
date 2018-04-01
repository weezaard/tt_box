const Sequelize = require('sequelize');
const Config = require('../configuration.js');
//const Instrument = require('./instrument.js');
//console.log(Instrument.prototype);

const sequelize = Config.getSequelize();

let Asset = sequelize.define('asset', {
    name: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    long_name: {
      type: Sequelize.STRING
    }
  }, {
    underscored: true
  }
);
//console.log(Instrument);
//Asset.hasMany(Instrument);

module.exports = Asset;