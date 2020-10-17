import Sequelize, { Model } from 'sequelize';

class DeliveryStock extends Model {
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
        delivery_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        product_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        stock_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        order_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        price: Sequelize.BIGINT,
      },
      {
        sequelize,
        tableName: 'deliveries_stock',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Stock, {
      as: 'stock',
      sourceKey: 'stock_id',
      foreignKey: 'id',
    });
  }
}

export default DeliveryStock;
