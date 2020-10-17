// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const uuid = require('uuid')

faker.locale = 'pt_BR';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'recipients',
      [
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          street: faker.address.streetName(),
          number: faker.random.number(),
          phone: faker.phone.phoneNumber('38#########'),
          district: 'Esplanada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          street: faker.address.streetName(),
          number: faker.random.number(),
          phone: faker.phone.phoneNumber('38#########'),
          district: 'Esplanada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          street: faker.address.streetName(),
          number: faker.random.number(),
          phone: faker.phone.phoneNumber('38#########'),
          district: 'Esplanada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          street: faker.address.streetName(),
          number: faker.random.number(),
          phone: faker.phone.phoneNumber('38#########'),
          district: 'Esplanada',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: faker.name.findName(),
          street: faker.address.streetName(),
          number: faker.random.number(),
          phone: faker.phone.phoneNumber('38#########'),
          district: 'Esplanada',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('recipients', null, {});
  },
};
