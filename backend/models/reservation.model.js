const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code_confirmation: { type: DataTypes.STRING(100), allowNull: false },
    nom_client: { type: DataTypes.STRING(255), allowNull: true },
    contact: { type: DataTypes.STRING(255), allowNull: true },
    nb_adultes: { type: DataTypes.INTEGER, allowNull: true },
    nb_enfants: { type: DataTypes.INTEGER, allowNull: true },
    nb_bebes: { type: DataTypes.INTEGER, allowNull: true },
    date_arrivee: { type: DataTypes.DATEONLY, allowNull: false },
    date_depart: { type: DataTypes.DATEONLY, allowNull: false },
    nb_nuits: { type: DataTypes.INTEGER, allowNull: true },
    date_reservation: { type: DataTypes.DATE, allowNull: true },
    montant_total: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    devise: { type: DataTypes.STRING(10), allowNull: true },
    statut: { type: DataTypes.STRING(100), allowNull: true },
    source_plateforme: { 
      type: DataTypes.STRING(50), 
      allowNull: false,
      validate: { isIn: [['airbnb', 'booking']] }
    },
    fichier_source: { type: DataTypes.STRING(255), allowNull: true },
    date_import: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    location: { type: DataTypes.STRING(255), allowNull: true },
    genius_booker: { type: DataTypes.BOOLEAN, defaultValue: false },
    commission: { type: DataTypes.DECIMAL(10, 2), allowNull: true }
  }, {
    tableName: 'reservations',
    timestamps: false,
    indexes: [
      { fields: ['code_confirmation', 'source_plateforme'], unique: true },
      { fields: ['date_arrivee'] },
      { fields: ['date_depart'] },
      { fields: ['logement_id'] }
    ]
  });

  Reservation.associate = function(models) {
    Reservation.belongsTo(models.Logement, {
      foreignKey: 'logement_id',
      as: 'logement'
    });
  };

  return Reservation;
};