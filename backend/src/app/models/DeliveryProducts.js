import Sequelize, { Model } from 'sequelize';

class DeliveryProducts extends Model {
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
        order_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        price: Sequelize.BIGINT,
      },
      {
        sequelize,
        tableName: 'deliveries_products',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Product, {
      as: 'products',
      sourceKey: 'product_id',
      foreignKey: 'id',
    });
  }
}

export default DeliveryProducts;
