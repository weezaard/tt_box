const XLSX = require('xlsx');

function writePropertiesData(data) {
    //console.log(data.data['SLV']);
    //return;
    var wsRows = [];
    let i = 0;
    for (let prop in data) {
        //console.log(prop);
        let row = [];
        row.push(prop);

        let x = data[prop];

        for (let propVal in x) {
            let val = x[propVal];
            row.push(val);
        }

        wsRows.push(row);
        i++;
    }

    /* Add the worksheet to the workbook */
    let workbook = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(wsRows);
    XLSX.utils.book_append_sheet(workbook, ws, "Market instruments properties");
    XLSX.writeFile(workbook, 'out.xlsb');
}

function test() {
    var workbook = XLSX.utils.book_new();

    var ws_data = [
        [ "S", "h", "e", "e", "t", "J", "S" ],
        [  1 ,  2 ,  3 ,  4 ,  5 ]
      ];
      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      
      /* Add the worksheet to the workbook */
      XLSX.utils.book_append_sheet(workbook, ws, "sheet_name");

      XLSX.writeFile(workbook, 'out.xlsb');
};

module.exports.test = test();
module.exports.writePropertiesData = writePropertiesData;

test();