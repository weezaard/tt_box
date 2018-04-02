const XLSX = require('xlsx');
const db = require('./db.js');
const seed = require('./seed');
const Config = require('./configuration.js');
const util = require('./modules/util.js');
const Cache = require('./cache');
const calcProps = require('./modules/calc_props');
const xlsxSerializer = require('./modules/xlsx_serializer');

async function main() {
    try {
        console.log('in main');

        await db.syncDb();
        
        await seed.bulkCreate();

        //console.log('ASSETS CACHE:');
        //console.log(seed.cache.assets['BTC'].long_name);
        //dbCache = seed.cache;

        console.log('---- Database synced -----');
        
        let instrumentsData = parseXlsx();
        console.log(`Instrument data is ${instrumentsData.length} long.`);
        //console.log(Cache.entityCache.get('BTC').name);

        //await db.test();

        let assetName = 'BTC';
       
        try {
            let retAll = await db.importInstrumentsForAsset(instrumentsData, assetName);
            console.log('Instrumenti uspesno uvozeni');
        } catch (err) {
            console.error(`Napaka pri kreiranju instrumentov, problematicen instrument na indeksu ${err.indeks}, \nSQL: ${err.sql}\nPodatki za uvoz: `, err.inData);
            throw err;
        }
       
        //console.log(calcProps);
        console.log('Calling calc props');
        let calculatedProperties = await calcProps(assetName);
        console.log('Calc props executed');

        xlsxSerializer.writePropertiesData(calculatedProperties.data);
    } catch (err) {
        console.error('Prislo je do napake');
        console.error(err);
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
        if (isNaN(valuesRow[i])) {
            console.log(`Value not a number: ${valuesRow[i]} at index ${i}, skipping data cell.`);
            //throw new Error('Value not a number!');
            continue;
        }
        data.push({ date : date, val : parseFloat(valuesRow[i]) });
        if (i > 4) break;
    }

    return data;
}


main();