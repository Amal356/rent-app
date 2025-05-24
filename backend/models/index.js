const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'postgres',
    logging: dbConfig.logging
  }
);

const db = {
  sequelize,
  Sequelize,
  User: require('./user.model')(sequelize, DataTypes),
  Logement: require('./logement.model')(sequelize, DataTypes),
  Reservation: require('./reservation.model')(sequelize, DataTypes)
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;