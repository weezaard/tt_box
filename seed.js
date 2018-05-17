const Asset = require('./model/Asset');
const Instrument = require('./model/Instrument');
const Property = require('./model/Property');
const Cache = require('./cache');

let assets = [
    [ 'XXBTZEUR', 'Bitcoin/EUR' ],
    [ 'ETH', 'Ethereum' ],
    [ 'LTC', 'Litecoin' ],
    [ 'XMR', 'Monero' ]
];

let properties = [
    [ 'index', '' ],
    [ 'perc_change', '' ],
    [ 'rank_perc_change', '' ],
    [ 'naklon', '' ],
    [ 'DMA7', '' ],
    [ 'DMA7_naklon', '' ],
    [ 'DMA7_perc_change', '' ],
];

module.exports.seedData = async function() {
    for (a of assets) {
        // must wait for findOrCreate or else I get "pool is draining" error on Sequelize !?
        await findOrCreateAsset(a[0], a[1]);
    }

    let i = 0;
    for (p of properties) {
        await findOrCreateProperty(p[0], p[1], i);
        i++;
    }
    /*
    let assetPromises = assets.map(a => {
        //findOrCreateAsset(a[0], a[1]);
    });
    let propertyPromises = properties.map((p, i) => {
        return findOrCreateProperty(p[0], p[1], i);
    });
    */
}

/**
 * Creates assets in the database using the bulkCreate Sequelize method.
 * 
 * @returns Promise<Array<Model>>
 */
bulkCreate = function() {
    let promiseAll = Promise.all([
        Asset.bulkCreate(
            assets.map(a => { return { name: a[0], long_name: a[1]} })  // create Asset object from array
        ).then((arrOfAssets) => {
            arrOfAssets.map(a => Cache.assetCache.set(a.name, a));
        })
        .then(() => { console.log('btc cache = ' + Cache.assetCache.get('XXBTZEUR').name)}).then()        
        ,
        Property.bulkCreate(
            properties.map((p, i) => { return { name: p[0], formula: p[1], index: i } })
        ).then((arrOfProperties) => {
            arrOfProperties.map(p => Cache.propertyCache.set(p.name, p));
        })
    ]);
    return promiseAll;
}

function findOrCreateProperty(name, formula, index) {
    return new Promise((resolve, reject) => {
        Property.findOrCreate({
            where : { name: name },
            defaults : { name: name, formula: formula, index: index }
        }).spread((property, created) => {
            Cache.propertyCache.set(property.name, property);
            resolve(property);
        }).catch((err) => { reject(err); });
    });
}

function findOrCreateAsset(shortName, longName) {
    //console.log(shortName, longName);
    return new Promise((resolve, reject) => {
        let focPromise = Asset.findOrCreate({
            where : { name : shortName },
            defaults : { name : shortName, long_name : longName }
        }).spread((asset, created) => {
            //console.log(`asset ${asset.name} created: ${created}`);
            Cache.assetCache.set(asset.name, asset);
            resolve(asset);
        })
        .catch((err) => { reject(err); });
        return focPromise;
    });
}