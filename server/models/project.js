'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasOne(models.Activity, { foreignKey: 'projectId' });
      Project.belongsToMany(models.User, { through: models.Project_User, foreignKey: 'projectId' } );
    }
  }
  Project.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Project name is required' },
        notEmpty: { msg: 'Project name is required' }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Description is required' },
        notEmpty: { msg: 'Description is required' }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Started',
      validate: {
        notNull: { msg: 'Status is required' },
        notEmpty: { msg: 'Status is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};