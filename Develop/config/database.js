const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  }
);

const db = {
  sequelize,
  Sequelize,
};

// Import and associate models

db.User = require('../models/user')(sequelize, Sequelize);
db.Post = require('../models/post')(sequelize, Sequelize);

// Define associations between models

db.User.hasMany(db.Post, { foreignKey: 'user_id' });
db.Post.belongsTo(db.User, { foreignKey: 'user_id' });

module.exports = db;
