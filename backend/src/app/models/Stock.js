import Sequelize, { Model } from 'sequelize';

class Stock extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          unique: true,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        price: Sequelize.BIGINT,
        quantity: Sequelize.STRING,
        notes: Sequelize.TEXT,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'stock',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsToMany(models.Product, {
      through: 'stock_products',
      as: 'products',
      foreignKey: 'stock_id',
    });
  }
}

export default Stock;
