const express = require('express');
const router = express.Router();
const importController = require('../controllers/import.controller');
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Importer un fichier
router.post(
  '/import',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  upload.single('file'),
  importController.importFile
);

// Récupérer les réservations
router.get(
  '/reservations',
  authMiddleware.verifyToken,
  importController.getReservations
);

// Récupérer les statistiques
router.get(
  '/stats',
  authMiddleware.verifyToken,
  importController.getStats
);

module.exports = router;