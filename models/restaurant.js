import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Restaurant = sequelize.define('Restaurant', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(18, 0),
        allowNull: true
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},
    {
        tableName: 'Restaurant',
        timestamps: false
    });

export default Restaurant;