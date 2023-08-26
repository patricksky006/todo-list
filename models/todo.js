'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Todo.init({
    name: DataTypes.STRING,
    isComplete: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false, //讓新舊資料預設為false
        allowNull: false //資料不可為空白
    }
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};