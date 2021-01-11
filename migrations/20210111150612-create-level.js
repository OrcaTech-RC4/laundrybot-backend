'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Levels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wc_status: {
        type: Sequelize.INTEGER
      },
      we_status: {
        type: Sequelize.INTEGER
      },
      we_start_time: {
        type: Sequelize.STRING
      },
      wc_start_time: {
        type: Sequelize.STRING
      },
      dc_status: {
        type: Sequelize.INTEGER
      },
      de_status: {
        type: Sequelize.INTEGER
      },
      dc_start: {
        type: Sequelize.STRING
      },
      de_start: {
        type: Sequelize.STRING
      },
      current: {
        type: Sequelize.ARRAY
      },
      mon: {
        type: Sequelize.STRING
      },
      tue: {
        type: Sequelize.STRING
      },
      wed: {
        type: Sequelize.STRING
      },
      thu: {
        type: Sequelize.STRING
      },
      fri: {
        type: Sequelize.STRING
      },
      sat: {
        type: Sequelize.STRING
      },
      sun: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Levels');
  }
};