const { parseCSV } = require('../services/csvParser.service');
const { parseXLSX } = require('../services/xlsxParser.service');
const { Logement, Reservation } = require('../models');
const fs = require('fs');
const path = require('path');
const { parse } = require('date-fns');

// Mappage des colonnes pour chaque plateforme
const COLUMN_MAPPING = {
  airbnb: {
    // Colonnes Airbnb => Champs base de données
    'Code de confirmation': 'code_confirmation',
    'Statut': 'statut',
    'Nom du voyageur': 'nom_client',
    'Contact': 'contact',
    '# des adultes': 'nb_adultes',
    '# des enfants': 'nb_enfants',
    '# des bébés': 'nb_bebes',
    'Date de début': 'date_arrivee',
    'Date de fin': 'date_depart',
    '# des nuits': 'nb_nuits',
    'Réservée': 'date_reservation',
    'Annonce': 'nom_logement',
    'Revenus': 'montant_total'
  },
  booking: {
    // Colonnes Booking.com => Champs base de données
    'Property Name': 'nom_logement',
    'Location': 'location',
    'Booker Name': 'nom_client',
    'Genius Booker': 'genius_booker',
    'Arrival': 'date_arrivee',
    'Departure': 'date_depart',
    'Booked on': 'date_reservation',
    'Status': 'statut',
    'Total Payment': 'montant_total',
    'Commission': 'commission',
    'Currency': 'devise',
    'Reservation Number': 'reservation_number'
  }
};

// Détecter la plateforme
const detectPlatform = (filename) => {
  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes('airbnb')) return 'airbnb';
  if (lowerFilename.includes('booking')) return 'booking';
  return null;
};

// Fonction pour nettoyer les nombres
const cleanNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = parseFloat(String(value).replace(/[^\d,.-]/g, '').replace(',', '.'));
  return isNaN(num) ? null : num;
};

// Fonction pour nettoyer les dates
const cleanDate = (value, platform) => {
  if (!value) return null;

  const formats = {
    airbnb: ['dd/MM/yyyy', 'yyyy-MM-dd'],
    booking: ['dd/MM/yyyy', 'yyyy-MM-dd']
  };

  for (const format of formats[platform] || []) {
    const parsedDate = parse(value, format, new Date());

    // Vérifier validité
    if (!isNaN(parsedDate.getTime())) {
      // Remettre l'heure à 00:00:00 locale pour éviter le décalage
      parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
    }
  }

  return null;
};

// Nettoyer et formater les données
const cleanReservationData = (data, platform) => {
  const cleaned = {};



  console.log("Raw data:", data);

  const mapping = COLUMN_MAPPING[platform];
  
  // Mapper les colonnes
  Object.entries(mapping).forEach(([sourceKey, targetKey]) => {
    if (data[sourceKey] !== undefined) {
      cleaned[targetKey] = data[sourceKey];
    }
  });

  // Nettoyer les nombres
  ['nb_adultes', 'nb_enfants', 'nb_bebes', 'nb_nuits'].forEach(field => {
    if (cleaned[field] !== undefined) {
      cleaned[field] = cleanNumber(cleaned[field]);
    }
  });

  // Nettoyer les montants
  if (cleaned.montant_total !== undefined) {
    cleaned.montant_total = cleanNumber(cleaned.montant_total);
  }


  console.log(cleaned.date_arrivee)
  // Nettoyer les dates
  cleaned.date_arrivee = cleanDate(cleaned.date_arrivee, platform);
  cleaned.date_depart = cleanDate(cleaned.date_depart, platform);
  cleaned.date_reservation = cleanDate(cleaned.date_reservation, platform);

  return cleaned;
};

// Importer un fichier
// 🔧 Fonction import corrigée
exports.importFile = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
  }

  const platform = detectPlatform(file.originalname);
  const fileExt = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;

  if (!platform) {
    fs.unlinkSync(filePath);
    return res.status(400).json({
      success: false,
      message: 'Nom de fichier invalide (doit contenir airbnb ou booking)'
    });
  }

  try {
    let rows = [];
    if (fileExt === '.csv') {
      rows = await parseCSV(filePath);
    } else if (['.xlsx', '.xls'].includes(fileExt)) {
      rows = await parseXLSX(filePath);
    } else {
      throw new Error('Format de fichier non supporté');
    }

    const results = {
      total: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    for (const [i, row] of rows.entries()) {
      try {
        const data = cleanReservationData(row, platform);



        const [logement] = await Logement.findOrCreate({
          where: { nom_logement: data.nom_logement, plateforme: platform },
          defaults: { nom_logement: data.nom_logement, plateforme: platform }
        });

        const reservationData = {
          ...data,
          logement_id: logement.id,
          fichier_source: file.originalname,
          source_plateforme: platform,
          date_import: new Date()
        };

        const [reservation, created] = await Reservation.findOrCreate({
          where: {
            source_plateforme: platform
          },
          defaults: reservationData
        });

        if (!created) {
          await reservation.update(reservationData);
          results.updated++;
        } else {
          results.inserted++;
        }

        results.total++;

      } catch (err) {
        results.skipped++;
        results.errors.push({
          row: i + 2,
          error: err.message,
          data: JSON.stringify(row)
        });
      }
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Import terminé', results });

  } catch (err) {
    console.error('Erreur d\'importation :', err);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Récupérer les réservations
exports.getReservations = async (req, res) => {
  try {
    const { 
      logement_id, 
      date_debut, 
      date_fin, 
      statut, 
      plateforme,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (logement_id) where.logement_id = logement_id;
    if (statut) where.statut = statut;
    if (plateforme) where.source_plateforme = plateforme;

    if (date_debut) {
      where.date_arrivee = {
        [Sequelize.Op.gte]: new Date(date_debut)
      };
    }

    if (date_fin) {
      where.date_depart = {
        [Sequelize.Op.lte]: new Date(date_fin)
      };
    }

    const { count, rows } = await Reservation.findAndCountAll({
      where,
      include: [{
        model: Logement,
        attributes: ['id', 'nom_logement', 'plateforme']
      }],
      order: [['date_arrivee', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Récupérer les statistiques
exports.getStats = async (req, res) => {
  try {
    const { date_debut, date_fin } = req.query;
    const where = {};

    if (date_debut && date_fin) {
      where.date_arrivee = {
        [Sequelize.Op.between]: [new Date(date_debut), new Date(date_fin)]
      };
    }

    // Statistiques par plateforme
    const statsByPlatform = await Reservation.findAll({
      attributes: [
        'source_plateforme',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_reservations'],
        [Sequelize.fn('SUM', Sequelize.col('montant_total')), 'chiffre_affaires'],
        [Sequelize.fn('AVG', Sequelize.col('montant_total')), 'moyenne_par_reservation']
      ],
      where,
      group: ['source_plateforme']
    });

    // Statistiques par logement
    const statsByLogement = await Reservation.findAll({
      attributes: [
        'logement_id',
        [Sequelize.col('Logement.nom_logement'), 'nom_logement'],
        [Sequelize.fn('COUNT', Sequelize.col('Reservation.id')), 'total_reservations'],
        [Sequelize.fn('SUM', Sequelize.col('montant_total')), 'chiffre_affaires']
      ],
      include: [{
        model: Logement,
        attributes: []
      }],
      where,
      group: ['logement_id', 'Logement.nom_logement'],
      order: [[Sequelize.literal('chiffre_affaires'), 'DESC']],
      limit: 10
    });

    // Taux d'occupation
    const occupationStats = await getOccupationStats(where);

    res.json({
      success: true,
      data: {
        by_platform: statsByPlatform,
        by_logement: statsByLogement,
        occupation: occupationStats
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fonction utilitaire pour calculer les statistiques d'occupation
async function getOccupationStats(where = {}) {
  // Implémentation simplifiée - à adapter selon vos besoins
  const result = await Reservation.findAll({
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('date_arrivee')), 'date'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'reservations']
    ],
    where: {
      ...where,
      date_arrivee: {
        [Sequelize.Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // 30 derniers jours
      }
    },
    group: [Sequelize.fn('DATE', Sequelize.col('date_arrivee'))],
    order: [[Sequelize.fn('DATE', Sequelize.col('date_arrivee')), 'ASC']]
  });

  return result;
}