import Sequelize, { Model } from "sequelize";
import User from "./User";

class Borrow extends Model {

  static init(sequelize) {
    super.init(
      {
        userId: Sequelize.INTEGER,
        bookId: Sequelize.INTEGER,
        isReturned: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
        
        //paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
        //underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
        //freezeTableName: false, //If it's false, it will use the table name in the plural. Ex: Users
        //tableName: 'Users' //Define table name
      }
    );

    this.addHook("beforeSave", async (user) => {
     
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId" });
    this.belongsTo(models.Book, { foreignKey: "bookId" });
  }

}

export default Borrow;
