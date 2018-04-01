const Sequelize = require('sequelize');
const User = require('./model/User');
const Config = require('./configuration.js');
const Cache = require('./cache');

const Asset = require('./model/Asset');
const Instrument = require('./model/Instrument');
const Property = require('./model/Property');
const PropertyValue = require('./model/PropertyValue');

const util = require('./modules/util.js');

var syncOptions = {
    force: true
};

/**
 * Associactions definitions
 */
Instrument.belongsTo(Asset);
PropertyValue.belongsTo(Property, { foreignKey: 'property_name' });

let promiseAsset = new Promise((resolve, reject) => {
    Asset.sync(syncOptions).then(() => {
        return Instrument.sync(syncOptions);    
    }).then((o) => {
        resolve(o);
    }).catch((err) => {
        console.error('Prislo je do napake pri sinhronizaciji Asset objektov.', err);
        reject(err);
    });
});

let promiseProperty = new Promise((resolve, reject) => {
    Property.sync(syncOptions).then(() => {
        return PropertyValue.sync(syncOptions);    
    }).then((o) => {
        resolve(o);
    }).catch((err) => {
        console.error('Prislo je do napake pri sinhronizaciji Property objektov.', err);
        reject(err);
    });
});

module.exports.syncDb = Promise.all([ 
    promiseAsset, promiseProperty
]);

module.exports.importInstrumentsForAsset = async function(data, asset_name) {
    var asset = Cache.assetCache.get(asset_name);
    console.log('asset_name='+asset_name);
    console.log('cache='+Cache.assetCache.get('BTC').name);

    return Promise.all(data.map((entry) => {
        return Instrument.create({
            date_of_value: util.parseXlsxDate(entry.date),
            value: entry.val,
            asset_name: asset.name
        });
    }));
    /*
    for (let entry of data) {
        //console.log(`try ${asset.name}`);
        await Instrument.create({
            date_of_value: util.parseXlsxDate(entry.date),
            value: entry.val,
            asset_name: asset.name
        })
    }
    */
}

let test = async function() {

    

    /*
    let [ asset, created]  = await Asset.findOrCreate({
        where : { name : "BTC" },
        defaults : { name : 'BTC', long_name : 'Bitcoin' }
    });

    console.log('asset=', JSON.stringify(asset));

    let newInstrument = Instrument.build({
        date_of_value : util.parseXlsxDate('4/15/18'),
        value: 3.234,
        asset_name: asset.name
    });
    
    await newInstrument.save();
    */
    
    /**
     * Disclaimer!!!
     * Ce naredis najprej prazno instanco z build() ukazom, potem
     * na tej instanci klices setAsset(assetKiSiGaPrejZloadal), bo zadeva
     * crknila, ker setAsset ne naredi drugega kot samo nastavi asociacijo
     * In ker objekt v bazi se ne obstaja, zadeva crkne. Kr neki.
     * 
     * https://github.com/sequelize/sequelize/issues/2582
     */
    //await newInstrument.setAsset(asset);
   
}

module.exports.test = test;
