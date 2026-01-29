'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.Project, { foreignKey: 'projectId' })
      Activity.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Activity.init({
    projectId:{ 
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'projectId is required' },
        notEmpty: { msg: 'projectId is required' }
      }
    },
    todo: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Todo is required' },
        notEmpty: { msg: 'Todo is required' }
      }
    },
    todoStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Started',
      validate: {
        notNull: { msg: 'Status is required' },
        notEmpty: { msg: 'Status is required' }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};