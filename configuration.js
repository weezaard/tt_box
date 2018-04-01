const Sequelize = require('sequelize');

var Configuration = {

    sequelizeSingleton : null,

    database: {
        user: 'postgres',
        password: 'rambo',
        host: 'localhost',
        port: 5432,
        database: 'ttrader',
        //logging: false,
        sequelizeOptions: {
            operatorsAliases: false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },            
        }
    },

    getDbConnectionString : () => `postgres://${Configuration.database.user}:${Configuration.database.password}@${Configuration.database.host}:${Configuration.database.port}/${Configuration.database.database}`,

    getSequelize: () => {
        if (Configuration.sequelizeSingleton == null) {
            var connString = Configuration.getDbConnectionString();
            var sequelize = new Sequelize(connString, Configuration.database.sequelizeOptions);
            Configuration.sequelizeSingleton = sequelize;
        }
        return Configuration.sequelizeSingleton;
    }
};


module.exports = Configuration;