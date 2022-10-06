import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class user extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        tipo: Sequelize.INTEGER,
        senha: Sequelize.VIRTUAL,
        senha_hash: Sequelize.STRING
      },
      {
        freezeTableName: true,
        sequelize
      }
    );

    this.addHook("beforeSave", async user => {
      if (user.senha) {
        user.senha_hash = await bcrypt.hash(user.senha, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.senha_hash);
  }
}

export default user;
