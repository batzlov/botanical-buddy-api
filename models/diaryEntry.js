'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const DiaryEntry = sequelize.define('DiaryEntry', {
        heightMeasured: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        notedAt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            get() {
                return moment(this.getDataValue('notedAt')).format('DD.MM.YYYY');
            }
        },
    }, {
        freezeTableName: true
    });

    DiaryEntry.associate = (models) => {
        DiaryEntry.belongsTo(models.Plant, {
            as: 'belongsToPlant',
            foreignKey: 'belongsToPlantId'
        });
    };

    return DiaryEntry;
};