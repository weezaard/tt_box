const XLSX = require('xlsx');
const db = require('./db.js');
const seed = require('./seed');
const Config = require('./configuration.js');
const util = require('./modules/util.js');
const Cache = require('./cache');

async function main() {
    try {
        console.log('in main');

        await db.syncDb.then();
        await seed.bulkCreate();

        //console.log('ASSETS CACHE:');
        //console.log(seed.cache.assets['BTC'].long_name);
        //dbCache = seed.cache;

        console.log('---- Database synced -----');
        
        let data = parseXlsx();
        //console.log(data);
        //console.log(Cache.entityCache.get('BTC').name);

        await db.test();

        await db.importInstrumentsForAsset(data, 'BTC');
    } catch (err) {
        console.error('Prislo je do napake', err);
    } finally {
        Config.getSequelize().close();  // s tem zapremo connectione, sicer se proces ne ustavi        
    }
}

function parseXlsx() {
    var wb = XLSX.readFile("market_instruments.xlsx");
    var sheet = wb.Sheets.marketinstruments;

    let sheetArr = util.sheet2arr(sheet);

    let datesRow = sheetArr[0];
    let valuesRow = sheetArr[1];

    let i = -1;
    let data = [];
    for (let date of datesRow) {
        i++;
        if (typeof date == 'undefined' || !date) continue;
        //console.log(date + '::' + valuesRow[i]);
        data.push({ date : date, val : valuesRow[i]});
        //if (i > 4) break;
    }

    return data;
}


main();