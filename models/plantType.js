'use strict';

module.exports = (sequelize, DataTypes) => {
    const PlantType = sequelize.define('PlantType', {
        nameLat: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nameGer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        descGer: {
            type: DataTypes.STRING(5000),
            allowNull: true
        },
        familyName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tempDesc: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        lightDesc: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        moistureDesc: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        earthDesc: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        breedDesc: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        fertilizeDesc: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
    }, {
        // other model options go here
        freezeTableName: true
    });

    PlantType.associate = (models) => {
        PlantType.hasMany(models.Plant, {
            as: 'hasChildren',
            foreignKey: 'typeId'
        });
    };

    return PlantType;
};
