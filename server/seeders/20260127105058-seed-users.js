'use strict';
const {hashPassword} = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [
      { 
        username: 'adminuser',
        email: 'owner@example.com',
        password: '12345',
        role: 'owner',
      },
      {
        username: 'collabuser',
        email: 'collaborator@example.com',
        password: '12345',
        role: 'collaborator',
      }
    ];

    users.forEach((el)=> {
      delete el.id
      el.password = hashPassword(el.password)
      el.createdAt = el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};