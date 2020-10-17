// eslint-disable-next-line import/no-extraneous-dependencies
const uuid = require('uuid');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'stock',
      [
        {
          id: uuid.v4(),
          name: 'Ovomaltine',
          price: '200',
          quantity: '10kg',
          notes: 'teste',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: 'Paçoca',
          price: '150',
          quantity: '10kg',
          notes: 'teste',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          name: 'Leite Ninho',
          price: '150',
          quantity: '10kg',
          notes: 'teste',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('stock', null, {});
  },
};
