const Sequelize = require('sequelize');

module.exports = {
  up: queryInterface => {
    return queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        // unique: true,
        // allowNull: false
      },
      recipient_id: {
        // Referência ao destinatário
        type: Sequelize.UUID,
        references: { model: 'recipients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      deliverer_id: {
        // Referência ao entregador
        type: Sequelize.UUID,
        references: { model: 'deliverers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fare: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      discount: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      received: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      change: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      total: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_date: {
        // Data de retirada
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        // Data de entrega ao destinatário
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('deliveries');
  },
};
