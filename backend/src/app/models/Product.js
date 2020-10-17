import Sequelize, { Model } from 'sequelize';

class Product extends Model {
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
        description: Sequelize.TEXT,
        type: Sequelize.BOOLEAN,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // this.belongsTo(models.DeliveryProducts, { foreignKey: 'product_id', as: 'product' });
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsToMany(models.Stock, {
      through: 'stock_products',
      as: 'stock',
      foreignKey: 'product_id',
    });
  }
}

export default Product;
