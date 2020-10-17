import Sequelize, { Model } from 'sequelize';

class Deliverer extends Model {
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
        email: Sequelize.STRING,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'deliverers',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Deliverer;
