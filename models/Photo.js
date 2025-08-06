// models/Photo.js - Model untuk tabel photos

module.exports = (sequelize, DataTypes) => {
  // Definisi model Photo
  const Photo = sequelize.define('Photo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'memories',
        key: 'id'
      }
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    caption: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    upload_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'photos',
    timestamps: false,
    underscored: true
  });

  // Definisi asosiasi dengan model lain
  Photo.associate = (models) => {
    // Photo dimiliki oleh satu Memory
    Photo.belongsTo(models.Memory, {
      foreignKey: 'memory_id',
      as: 'memory',
      onDelete: 'CASCADE'
    });
  };

  return Photo;
};