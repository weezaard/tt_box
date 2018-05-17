const XLSX = require('xlsx');
const db = require('./db.js');
const seed = require('./seed');
const Config = require('./configuration.js');
const util = require('./modules/util.js');
const Cache = require('./cache');
const calcProps = require('./modules/calc_props');
const xlsxSerializer = require('./modules/xlsx_serializer');
const SimplTaktika = require('./taktike/SimplTaktika');
const TestTaktika = require('./taktike/TestTaktika');
const Trader = require('./trading/Trader');
const Kraken = require('./modules/kraken');
const CsvParser = require('./modules/csv_parser');

async function main() {
    try {
        console.log('====== CARBON BASED TRADING BOT commencing operation... =====');
        let assetName = 'XXBTZEUR';

        // prepare CSV file for import
        //let parsedCsv = await CsvParser.parseOHLCData();

        // synchronize data model
        console.log(`---- Syncing database ----`);
        await db.syncDb();
        console.log('Database synced');

        // seed data
        console.log(`\n---- Seeding data and filling CACHE ----`);
        await seed.seedData();
        //await seed.bulkCreate();
        console.log('data seeded in database');
        
        if (false) {
            console.log(`\n----- Bulk importing data from CSV file for asset ${assetName}`);
            // import data from the CSV file
            await db.importInstrumentsFromCsv('./data/hourly.csv', assetName);
            console.log('Imported instruments from CSV file');
        }

        console.log(`\n----- Getting last instrument for ${assetName}`);
        // check timestamp of the last instrument in the database
        let lastInstrument = await db.getLastInstrument(assetName);
        let lastUnixTs;
        let lastIndex = 0;
        if (lastInstrument) {
            lastUnixTs = lastInstrument.unix_ts;
            lastIndex = lastInstrument.index;
        }
        console.log(`last ts = ${lastUnixTs}, last index in db = ${lastIndex}`);
        
        let numberOfNewInstruments = 0;
        if (true) {
            console.log('\n---- Fetching data from Kraken ----')
            numberOfNewInstruments = await fetchLatestOHLC(assetName, lastIndex, lastUnixTs);
            console.log(`.. fetched ${numberOfNewInstruments} new OHLC instruments from API.`);
        }
       
        if (parseInt(numberOfNewInstruments) == 0) {
            console.log(`\n **** NO NEW DATA, aborting further calculations ****`);
            return;
        }

        // TODO - calc properties se ne da nujno izvest vse v memory, ker je prevec podatkov
        // kodo je potrebno napisati tako, da ne pozre toliko memorije... verjetno procesiranje v batchih        
        console.log(`\n---- Fetching latest property value for asset ${assetName} ----`);
        let lastCalculatedProperty = await db.getLastPropertyValue(assetName);
        if (lastCalculatedProperty!=null) {
            console.log(`Last calculated property value index = ${lastCalculatedProperty.index}`);
        } else {
            console.log('No property values exist in the database yet!');
        }
        
        // calculate instrument properties
        console.log(`\n---- Calling calcProps for asset ${assetName} ----`);
        let calculatedProperties = await calcProps(assetName, lastCalculatedProperty);
        console.log('Calc props executed');
        //return;

        // Persist property values to the database.
        try {
            console.log(`\n---- Saving property values to database for asset ${assetName} ----`);
            await db.savePropertyValues(calculatedProperties, assetName, lastCalculatedProperty.index);
            console.log('Property values uspesno zapisani v bazo.');
        } catch (err) {
            console.error(`Napaka pri kreiranju vrednosti propertijev, problematicen instrument na indeksu ${err.indeks}, \nSQL: ${err.sql}\nPodatki za uvoz: `, err.inData);
            throw err;
        }
        return; 

        console.log('\n---- Persisting data to excel file. ----');
        //xlsxSerializer.writePropertiesData(calculatedProperties);

        /**
         * Run tactics on data
         */
        let t1 = new TestTaktika(calculatedProperties.data);
        /*
        calculatedProperties.getValues('index').forEach((val, i) => {
            console.log(t1.predict(i)[0]);
        })
        */
        //console.log(calculatedProperties.data['SimplTaktika']);
        let trader = new Trader(t1, calculatedProperties.data);
        //trader.run();
    } catch (err) {
        console.error('\n!!!!!!!!!!! Prislo je do napake !!!!!!!!!!!!!');
        console.error(err);
    } finally {
        Config.getSequelize().close();  // s tem zapremo connectione, sicer se proces ne ustavi        
    }
}

async function fetchLatestOHLC(assetName, lastIndex, lastUnixTs) {
    // get latest price data from Kraken API (from the last db instrument timestamp onward)
    let instrumentsData = await Kraken.getInstrumentData(assetName, 60, lastUnixTs);
    
    // insert data from Kraken API to database
    try {
        let retAll = await db.appendInstrumentsForAsset(instrumentsData, assetName, lastIndex);
        return instrumentsData.length;
    } catch (err) {
        console.error(`Napaka pri kreiranju instrumentov, problematicen instrument na indeksu ${err.indeks}, \nSQL: ${err.sql}\nPodatki za uvoz: `, err.inData);
        throw err;
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
        data.push({ date : util.parseXlsxDate(date), val : parseFloat(valuesRow[i]) });
        if (i > 4) break;
    }

    return data;
}


main();