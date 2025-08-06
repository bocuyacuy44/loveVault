// models/Memory.js - Model untuk tabel memories

module.exports = (sequelize, DataTypes) => {
  // Definisi model Memory
  const Memory = sequelize.define('Memory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    memory_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
    tableName: 'memories',
    timestamps: true,
    underscored: true
  });

  // Definisi asosiasi dengan model lain
  Memory.associate = (models) => {
    // Memory dimiliki oleh satu User
    Memory.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });

    // Memory memiliki banyak Photo
    Memory.hasMany(models.Photo, {
      foreignKey: 'memory_id',
      as: 'photos',
      onDelete: 'CASCADE'
    });

    // Memory memiliki banyak Tag (many-to-many)
    Memory.belongsToMany(models.Tag, {
      through: 'memory_tags',
      foreignKey: 'memory_id',
      otherKey: 'tag_id',
      as: 'tags'
    });
  };

  return Memory;
};