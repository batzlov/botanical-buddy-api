'use strict';

module.exports = (sequelize, DataTypes) => {
    const Plant = sequelize.define('Plant', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageRef: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // imageData: {
        //     type: DataTypes.BLOB('long'),
        //     allowNull: false,
        //     get() {
        //         return String(this.getDataValue('imageData')).toString('base64');
        //     }
        // }
    }, {
        // other model options go here
        freezeTableName: true
    });

    Plant.associate = (models) => {
        Plant.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'ownerId'
        });

        Plant.belongsTo(models.PlantType, {
            as: 'parent',
            foreignKey: 'typeId'
        });

        Plant.hasMany(models.DiaryEntry, {
            as: 'hasDiaryEntries',
            foreignKey: 'belongsToPlantId'
        });
    };

    return Plant;
};
