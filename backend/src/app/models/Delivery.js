import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
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
        payment_method: Sequelize.INTEGER,
        fare: Sequelize.BIGINT,
        discount: Sequelize.BIGINT,
        received: Sequelize.BIGINT,
        change: Sequelize.BIGINT,
        total: Sequelize.BIGINT,

        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.DeliveryProducts, {
      as: 'deliveriesProducts',
      sourceKey: 'id',
      foreignKey: 'delivery_id',
    });
    this.hasMany(models.DeliveryStock, {
      as: 'deliveriesStock',
      sourceKey: 'id',
      foreignKey: 'delivery_id',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliverer, {
      foreignKey: 'deliverer_id',
      as: 'deliverer',
    });
  }
}

export default Delivery;
