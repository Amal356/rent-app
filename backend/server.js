const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const importRoutes = require('./routes/import.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', importRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Fonction pour créer l'admin
async function createAdmin() {
  try {
    // Supprimer l'utilisateur existant si il existe
    await sequelize.models.User.destroy({ where: { email: 'admin@example.com' } });

    // Créer l'utilisateur admin
    const admin = await sequelize.models.User.create({
      email: 'admin@example.com',
      password_hash: 'admin123',
      role: 'admin',
      verification_token: null,
      is_verified: true
    });

    console.log('Admin créé avec succès !');
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  }
}

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

// Synchroniser les modèles avec la base de données
sequelize.sync({ force: false }).then(() => {
  // Créer l'admin
  createAdmin().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
    });
  });
}).catch((error) => {
  console.error('Erreur lors de la synchronisation:', error);
});