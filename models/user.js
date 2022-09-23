'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        freezeTableName: true
    });

    User.associate = (models) => {
        User.hasMany(models.Plant, {
            as: 'ownsPlants',
            foreignKey: 'ownerId'
        });

        User.hasOne(models.Settings, {
            foreignKey: 'belongsToUser'
        });
    };

    return User;
};