import Sequelize, { Model } from "sequelize";
const { Op } = require("sequelize");

class Book extends Model {

  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
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
    this.hasMany(models.Borrow, {
      foreignKey: "bookId",
    });

    this.hasMany(models.Score, {
      foreignKey: "bookId",
    });
  }

  async isAvailableToBorrow() {
    if(await this.countBorrows({ where: { isReturned: false } }) > 0) return false;
    
    return true;   
  }

  async canItBeReturned(userId) {
    return await this.getBorrows({ where: {isReturned: false , userId} });
  }

  async score() {
    const score = (await this.getScores({
      attributes: ['score'],
      raw: true
    }));

    const scores = score.map(score => score.score);
    if(scores.length === 0) {
        var average = -1;
    } else {
        var average = parseFloat(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    }

    return average;
  }

}

export default Book;
