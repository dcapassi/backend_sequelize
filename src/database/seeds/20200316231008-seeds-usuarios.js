"use strict";
//Default user: admin@admin.com - password: admin
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "user",
      [
        {
          id: 1,
          nome: "Admin",
          email: "admin@admin.com",
          senha_hash:
            "$2a$08$MVrBEXy1IUcBaTdSPmps8Oo/xLbt0rwTaPrtXiZSjG4avqO31po.2",
          created_at: new Date(),
          updated_at: new Date(),
          tipo: 1
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", null, {});
  }
};
