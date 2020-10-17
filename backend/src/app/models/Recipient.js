import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
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
        phone: Sequelize.STRING,
        mail: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        district: Sequelize.STRING,
        complement: Sequelize.TEXT,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Recipient;
