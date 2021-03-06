'use strict';
const {
  Model,
  DataTypes,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  
  class Level extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  Level.init({
    level: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    wc_status: DataTypes.INTEGER,
    we_status: DataTypes.INTEGER,
    we_start_time: DataTypes.STRING,
    wc_start_time: DataTypes.STRING,
    dc_status: DataTypes.INTEGER,
    de_status: DataTypes.INTEGER,
    dc_start_time: DataTypes.STRING,
    de_start_time: DataTypes.STRING,
    current: DataTypes.ARRAY(DataTypes.INTEGER),
    mon: DataTypes.STRING,
    tue: DataTypes.STRING,
    wed: DataTypes.STRING,
    thu: DataTypes.STRING,
    fri: DataTypes.STRING,
    sat: DataTypes.STRING,
    sun: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Level',
  });
  return Level;
};