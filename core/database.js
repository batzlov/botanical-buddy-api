const { Sequelize, DataTypes } = require('sequelize');

module.exports = function() 
{
    const sequelize = new Sequelize('gartenjeden', 'root', 'root', {
        port: '3306',
        host: '127.0.0.1',
        dialect: 'mysql'
    });

    const db = {
        Sequelize: Sequelize,
        sequelize: sequelize
    };

    try 
    {
        const User = require('../models/user')(db.sequelize, DataTypes);
        db[User.name] = User;
        const Plant = require('../models/plant')(db.sequelize, DataTypes);
        db[Plant.name] = Plant;
        const PlantType = require('../models/plantType')(db.sequelize, DataTypes);
        db[PlantType.name] = PlantType;
        const Settings = require('../models/settings')(db.sequelize, DataTypes);
        db[Settings.name] = Settings;
        const DiaryEntry = require('../models/diaryEntry')(db.sequelize, DataTypes);
        db[DiaryEntry.name] = DiaryEntry;
    
        db[User.name].associate(db);
        db[Plant.name].associate(db);
        db[PlantType.name].associate(db);
        db[Settings.name].associate(db);
        db[DiaryEntry.name].associate(db);
    }
    catch(err) 
    {
        console.error(err);
    }

    return db;
}