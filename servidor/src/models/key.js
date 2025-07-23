module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Key', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    keyId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    publicKey: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
};
