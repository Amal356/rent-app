const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

// Vérification d'email
router.get('/verify-email', authController.verifyEmail);

// Suppression d'utilisateur
router.delete('/delete-user', verifyToken, isAdmin, authController.deleteUser);

// Route protégée (profil)
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Route admin
router.get('/admin', verifyToken, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Accès administrateur autorisé',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});
// Mise à jour du profil
router.put('/profile', verifyToken, authController.updateProfile);
module.exports = router;