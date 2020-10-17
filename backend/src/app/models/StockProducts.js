import Sequelize, { Model } from 'sequelize';

class StockProducts extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          unique: true,
        },
        stock_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        product_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default StockProducts;
