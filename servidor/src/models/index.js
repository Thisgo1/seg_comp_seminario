const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const KeyModel = require('./key');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = UserModel(sequelize);
const Key = KeyModel(sequelize);

User.hasMany(Key, { foreignKey: 'userId' });
Key.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Key
};
