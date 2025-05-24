const xlsx = require('xlsx');

function parseXLSX(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier Excel:', error);
    throw new Error('Format de fichier Excel invalide');
  }
}

module.exports = { parseXLSX };