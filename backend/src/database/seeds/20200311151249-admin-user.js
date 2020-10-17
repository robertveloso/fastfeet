const bcrypt = require('bcryptjs');
const uuid = require('uuid')

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          id: uuid.v4(),
          name: 'Distribuidora Acai Food JBA',
          email: 'admin@acaifood.com.br',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
