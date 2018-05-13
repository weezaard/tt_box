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

/*
let assetsCache = {};
module.exports.cache = {};
module.exports.cache['assets'] = assetsCache;
*/

/**
 * Creates assets in the database using the bulkCreate Sequelize method.
 * 
 * @returns Promise<Array<Model>>
 */
module.exports.bulkCreate = function() {
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

/**
 * Zadeva za vsak Asset najprej preveri ali obstaja v bazi
 * in ga ustvari sele, ce ga v bazi ni.
 * Pocasno, ampak kompatibilno s polno bazo.
 */
/*
module.exports.executeFindOrCreate = function() {
    // todo, simplify this, map through the asset var
    return Promise.all([
        findOrCreateAsset('BTC','Bitcoin'),
        findOrCreateAsset('ETH','Ethereum'),
        findOrCreateAsset('LTC','Litecoin'),
    ])
}
*/

function findOrCreateAsset(shortName, longName) {
    return new Promise((resolve, reject) => {
        Asset.findOrCreate({
            where : { name : shortName },
            defaults : { name : shortName, long_name : longName }
        }).then((ret) => { resolve(ret) }).catch((err) => { reject(err); });
    });
}