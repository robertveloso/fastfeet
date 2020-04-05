import faker from 'faker';
import factory from 'factory-girl';

import User from '../src/app/models/User';
import Deliverer from '../src/app/models/Deliverer';

factory.define('User', User, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}));

factory.define('Deliverer', Deliverer, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
}));

export default factory;
