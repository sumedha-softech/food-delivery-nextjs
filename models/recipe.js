import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

if (!sequelize) {
  throw new Error('Sequelize instance is undefined. Check your database.js export.');
}

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  }
}, {
  tableName: 'Recipe',
  timestamps: false
});

export default Recipe;
