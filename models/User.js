// models/User.js - Model untuk tabel users

module.exports = (sequelize, DataTypes) => {
  // Definisi model User
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  // Definisi asosiasi dengan model lain
  User.associate = (models) => {
    // User memiliki banyak Memory
    User.hasMany(models.Memory, {
      foreignKey: 'user_id',
      as: 'memories',
      onDelete: 'CASCADE'
    });
  };

  return User;
};