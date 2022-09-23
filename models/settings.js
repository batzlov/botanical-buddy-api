'use strict';

module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define('Settings', {
        pourNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        fertilizeNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mondayNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        tuesdayNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        wednesdayNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        thursdayNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        fridayNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        saturdayNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        sundayNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        remindDaily: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        remindWeekly: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    }, {
        // other model options go here
        freezeTableName: true
    });

    Settings.associate = (models) => {
        Settings.belongsTo(models.User, {
            foreignKey: 'belongsToUser'
        });
    };

    return Settings;
};
