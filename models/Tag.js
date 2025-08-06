// models/Tag.js - Model untuk tabel tags

module.exports = (sequelize, DataTypes) => {
  // Definisi model Tag
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    }
  }, {
    tableName: 'tags',
    timestamps: false,
    underscored: true
  });

  // Definisi asosiasi dengan model lain
  Tag.associate = (models) => {
    // Tag dimiliki oleh banyak Memory (many-to-many)
    Tag.belongsToMany(models.Memory, {
      through: 'memory_tags',
      foreignKey: 'tag_id',
      otherKey: 'memory_id',
      as: 'memories'
    });
  };

  return Tag;
};