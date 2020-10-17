import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';
import mongoConfig from '../config/mongo';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Product from '../app/models/Product';
import Stock from '../app/models/Stock';
import Deliverer from '../app/models/Deliverer';
import Delivery from '../app/models/Delivery';

import StockProducts from '../app/models/StockProducts';
import DeliveryProducts from '../app/models/DeliveryProducts';
import DeliveryStock from '../app/models/DeliveryStock';

const models = [
  User,
  Recipient,
  File,
  Product,
  Stock,
  Deliverer,
  Delivery,
  StockProducts,
  DeliveryProducts,
  DeliveryStock,
];

class Database {
  constructor() {
    this.init();
    // this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
