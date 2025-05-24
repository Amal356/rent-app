const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Logement = sequelize.define('Logement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom_logement: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    plateforme: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'logements',
    timestamps: false
  });

  Logement.associate = function(models) {
    Logement.hasMany(models.Reservation, {
      foreignKey: 'logement_id',
      as: 'reservations'
    });
  };

  return Logement;
};