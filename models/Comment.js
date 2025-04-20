const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Comment extends Model {}

// Define fields for Comment
Comment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'comment'
});

module.exports = Comment;
