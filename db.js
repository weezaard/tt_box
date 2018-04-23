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
PropertyValue.belongsTo(Asset);




module.exports.syncDb = async function() {
    let promiseAsset = Asset.sync(syncOptions).then(() => {
        return Instrument.sync(syncOptions);    
    });

    let promiseProperty = Property.sync(syncOptions).then(() => {
        return PropertyValue.sync(syncOptions);
    });

    return Promise.all([ 
        promiseAsset, 
        promiseProperty
    ])
};

module.exports.savePropertyValues = async function(calculatedProperties, asset_name) {
    var asset = Cache.assetCache.get(asset_name);

    return Promise.all(
        calculatedProperties.propertyNames.map((propertyName, i, origData) => {
            if (propertyName=='SLV') return;
            return saveValues(propertyName, calculatedProperties.getValues(propertyName), asset);
        })
    );
}

async function saveValues(propertyName, values, asset) {
    console.log(`Saving prop ${propertyName} with values ${values}`);
    return Promise.all(values.map((entry, i, origData) => {
        let newPropVal = PropertyValue.create({
            property_name : propertyName,
            index : parseInt(i)+1,
            value : entry,
            asset_name: asset.name
        }).catch((err) => { 
            //return err 
            err.indeks = i;
            err.inData = origData[i];
            throw err;
        });
        return newPropVal;
    }));
}

module.exports.importInstrumentsForAsset = async function(data, asset_name) {
    var asset = Cache.assetCache.get(asset_name);
    //console.log('asset_name='+asset_name);
    //console.log('cache='+Cache.assetCache.get('BTC').name);

    return Promise.all(data.map((entry, i, origData) => {
        //console.log(`value at ${i}: ${entry.val}`);
        let newInstrument = Instrument.create({
            date_of_value: util.parseXlsxDate(entry.date),
            value: parseFloat(entry.val),
            asset_name: asset.name
        }).catch((err) => { 
            //return err 
            err.indeks = i;
            err.inData = origData[i];
            throw err;
        });
        /*
        .catch((err) => { 
            throw err;  // ko se zgodi prva napaka, jo bo prestregel spodnji catch, to je default delovanje, ce sploh ni te kode
            return err; // razlika je med throw in return... ce das return ga spodnji catch ne bo prestregel...
        });
        */
       return newInstrument;
    }))
    /*.catch((err) => {
        // prestreze prvo napako, ki se zgodi v kateremkoli Promise-u v array-u Promise.all
        console.error(`Pri kreiranju instrumentov so se zgodile napake, prva napaka: ${err.name}, \nSQL: ${err.sql}`);
        //throw err;
        //return err;   //ce dam return, se err ne bo vrgel tam kjer se je funkcija importInstrumentsForAsset klicala
    })*/
    ;
   
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
