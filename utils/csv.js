const fs = require('fs')
const converter = require('json-2-csv');

function normalizeJsonForCsv(jsonArray) {
    // Get all unique keys from the JSON objects
    let keys = new Set();

    jsonArray.forEach(obj => {
      Object.keys(obj).forEach(key => keys.add(key));
    });
  
    // Normalize each object in the JSON array
    let normalizedArray = jsonArray.map(obj => {
      let normalizedObj = {};
      Array.from(keys).forEach(key => {
        normalizedObj[key] = obj.hasOwnProperty(key) ? obj[key] : '';
        if(normalizedObj[key]) {
          normalizedObj[key] = `${normalizedObj[key]}`
        }
      });
      return normalizedObj;
    });
  
    return normalizedArray;
  }

function arrayToCSV (_json) {
    const json = normalizeJsonForCsv(_json)
    const csv = json.map(row => Object.values(row));
    csv.unshift(Object.keys(json[0]));
    return csv.join('\n');
}

async function writeJsonToCsv (path, json) {
    // fs.writeFileSync(path, `${arrayToCSV(json)}`, 'utf8')
  const csv = await converter.json2csv(json);
  fs.writeFileSync(path, csv, 'utf8')
}

const readCsvToJson = (csvFilepath) => new Promise ((resolve, reject) => {
    const csvString = fs.readFileSync(csvFilepath,'utf8')
    csv.parse(csvString, { columns: true, skip_empty_lines: true}, function(err, records){
        if(err) return reject(err)
        return resolve(records)
    });
})

module.exports = {
    writeJsonToCsv,
    readCsvToJson,
    arrayToCSV,
    normalizeJsonForCsv
}