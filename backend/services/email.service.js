const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs').promises;
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, template, data = {}) => {
  try {
    // Chemin vers le template EJS
    const templatePath = path.join(__dirname, '../emails', `${template}.ejs`);
    
    // Lire le template EJS
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    
    // Rendre le template avec les données
    const html = ejs.render(templateContent, {
      ...data,
      appName: process.env.APP_NAME,
      year: new Date().getFullYear()
    });

    // Options de l'email
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

// Exporter les méthodes d'email
module.exports = {
  sendTestEmail: async (to) => {
    return sendEmail(
      to,
      'Test d\'envoi d\'email',
      'test-email',
      { message: 'Ceci est un email de test depuis votre application de gestion de réservations.' }
    );
  },
  sendVerificationEmail: async (user, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    return sendEmail(
      user.email,
      'Vérifiez votre adresse email',
      'verification-email',
      { 
        user, 
        verificationUrl,
        expiryHours: 24
      }
    );
  }
};