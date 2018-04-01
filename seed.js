const Asset = require('./model/Asset');
const Instrument = require('./model/Instrument');
const Cache = require('./cache');

let assets = [
    [ 'BTC', 'Bitcoin' ],
    [ 'ETH', 'Ethereum' ],
    [ 'LTC', 'Litecoin' ],
    [ 'XMR', 'Monero' ]
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
            arrOfAssets.map(a => Cache.entityCache.set(a.name, a));
        })
        //.then(() => { console.log('btc cache = ' + Cache.entityCache.get('BTC').name)}).then()        
    ]);
    return promiseAll;
}

/**
 * Zadeva za vsak Asset najprej preveri ali obstaja v bazi
 * in ga ustvari sele, ce ga v bazi ni.
 * Pocasno, ampak kompatibilno s polno bazo.
 */
module.exports.executeFindOrCreate = function() {
    // todo, simplify this, map through the asset var
    return Promise.all([
        findOrCreateAsset('BTC','Bitcoin'),
        findOrCreateAsset('ETH','Ethereum'),
        findOrCreateAsset('LTC','Litecoin'),
    ])
}

function findOrCreateAsset(shortName, longName) {
    return new Promise((resolve, reject) => {
        Asset.findOrCreate({
            where : { name : shortName },
            defaults : { name : shortName, long_name : longName }
        }).then((ret) => { resolve(ret) }).catch((err) => { reject(err); });
    });
}