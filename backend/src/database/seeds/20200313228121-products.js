// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const uuid = require('uuid');

faker.locale = 'pt_BR';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'products',
      [
        {
          id: uuid.v4(),
          name: 'Açaí Mix 300ml',
          price: '700',
          description: 'teste',
          type: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: 'Açaí Mix 500ml',
          price: '990',
          description: 'teste',
          type: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: 'Açaí Mix 700ml',
          price: '1100',
          description: 'teste',
          type: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('products', null, {});
  },
};
