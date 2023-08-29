'use strict'

const { sequelize } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Todos',
      'isComplete',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // 讓新舊資料預設為false
        allowNull: false // 資料不可為空白
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Todos',
      'isComplete'
    )
  }
}
