const csvParser = require('csv-parse/lib/sync');
const fs = require('fs');
const es = require('event-stream');

/**
 * Currently parses history file (from where?) so
 * that it extracts only hourly ticks and writes that to
 * a new CSV file that is later imported elsewhere.
 */
module.exports.parseOHLCData = async function() {
    let promise = new Promise((resolve, reject) => {
        var lineNr = 0;
        let lastDt = null;

        var wstream = fs.createWriteStream('./data/hourly.csv');
        //var s = fs.createReadStream('./data/krakenTest.csv')
        var s = fs.createReadStream('./data/krakenEUR.csv')
            .pipe(es.split())
            .pipe(es.mapSync(function(line){
        
                if (line==null || line=='') {
                    return;
                }
                // pause the readstream
                s.pause();
        
                lineNr += 1;
        
                // process line here and call s.resume() when rdy
                //console.log(lineNr);
                var parsedLine = csvParser(line)[0];

                let ts = parsedLine[0];
                let dt = new Date(ts*1000);
                //console.log(dt);
                if (lastDt==null) {
                    lastDt = dt;
                } else {
                    let lastHour = lastDt.getHours();
                    let lastDay = lastDt.getDay();
                    //console.log(`lastHour = ${lastHour}, lastMinute = ${lastMinute}`);
                    if (lastHour != dt.getHours() || lastDay != dt.getDay()) {
                        // new hour tick
                        lastDt = dt;
                        console.log(`Bingo, line ${parsedLine}, ts=${ts}, ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`);
                        wstream.write(`${parsedLine}\n`);
                    }
                }
        
                // resume the readstream, possibly from a callback
                s.resume();
            }).on('error', function(err){
                console.log('Error while reading file.', err);
            }).on('end', function(){
                console.log('Read entire file.')
                //parser.end();
                wstream.end();                
            })
        );
        
    });
    return promise;
}