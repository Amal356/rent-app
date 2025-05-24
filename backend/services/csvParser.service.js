const csv = require('csv-parser');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath, { encoding: 'utf8' }) // Set encoding to UTF-8
      .pipe(csv({ separator: ';' })) // Specify semicolon as delimiter
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
module.exports= {parseCSV}