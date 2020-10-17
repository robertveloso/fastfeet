// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const uuid = require('uuid');

faker.locale = 'pt_BR';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'deliverers',
      [
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          email: faker.internet.email(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('deliverers', null, {});
  },
};
