const date = require('date-and-time');
const XLSX = require('xlsx');

/**
 * Converts a string date value returned by the XLSX module
 * to the javascript Date object.
 * @param xlsxDate string date formatted M/D/YY
 * @returns A new Promise.
 */
module.exports.parseXlsxDate = function(xlsxDate) {
    return date.parse(xlsxDate, 'M/D/YY');
}

/**
 * Convert XLSX sheet to a javascript array
 * @param {XLSX.Sheet} sheet 
 * @returns array of rows, each row is an array of cells
 */
module.exports.sheet2arr = function(sheet){
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
       row = [];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
           var nextCell = sheet[
              XLSX.utils.encode_cell({r: rowNum, c: colNum})
           ];
           if( typeof nextCell === 'undefined' ){
              row.push(void 0);
           } else row.push(nextCell.w);
        }
        result.push(row);
    }
    return result;
 };
