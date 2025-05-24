const db = require('../models');
const User = db.User;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Inscription
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Vérifier si le rôle est valide
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      email,
      password_hash: password,
      verification_token: verificationToken,
      role: role || 'user'
    });

    const token = user.generateJWT();

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token,
      verification_token: verificationToken
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const token = user.generateJWT();

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Vérification d'email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification manquant'
      });
    }

    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification invalide ou expiré'
      });
    }

    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    res.json({
      success: true,
      message: 'Email vérifié avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
















// Mise à jour du profil
exports.updateProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword, role } = req.body;
    const userId = req.user.id;

    // Vérifier si le rôle est valide
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Si un nouveau mot de passe est fourni, vérifier l'ancien
    if (newPassword) {
      const isMatch = await user.validPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }
      user.password_hash = newPassword;
    }

    // Mettre à jour les autres champs
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Suppression d'utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Droits administrateur requis.'
      });
    }

    // Supprimer l'utilisateur
    await user.destroy();

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });






  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};