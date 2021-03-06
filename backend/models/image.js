const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const user = require('./user');

class image extends Model {};

image.init({
    id: {
        type:           Sequelize.INTEGER,
        primaryKey:     true,
        autoIncrement:  true
    },
    userId: {
        type:           Sequelize.UUID,
        allowNull:      false,
        unique:         true,
        references: {
            model:  'users',
            key:    'id'
        }
    },
    name: {  
        type:       Sequelize.STRING(30),
        allowNull:  false,
    },
    data: {
        type: DataTypes.BLOB("long"),
    },
}, { sequelize, modelName: "images" });

image.belongsTo(user);

module.exports = image;