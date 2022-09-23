const path = require('path');
const fs = require('fs');
const Controller = require('./mainController.js');
const Passport = require('../core/passport.js');
const fetch = require('node-fetch');

class HelperController extends Controller
{
    constructor(...args)
    {
        super(...args);

        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;
    }

    actionIndex() 
    {
        const self = this;

        self.res.sendFile(path.join(__dirname, '..', 'index.html'));
    }

    action404() 
    {
        const self = this;

        self.render({
            message: 'Die angefragte Schnittstelle/Ressource existiert nicht!'
        });
    }

    async actionInsertDemoData() 
    {
        const self = this;

        let error = null;
        try 
        {
            let plantTypes = JSON.parse(fs.readFileSync('./seeds/types.json', 'utf8'));
            for(let i = 0; i < plantTypes.length; i++) 
            {
                // check if a plant with the same lat name already exists
                let plantAlreadyExists = await self.db.PlantType.findOne({
                    where: {
                        nameLat: plantTypes[i].nameLat
                    }
                });

                if(!plantAlreadyExists && plantTypes[i].nameGer.length > 0) 
                {
                    await self.db.PlantType.create(plantTypes[i]);
                }
            }
            
            let users = JSON.parse(fs.readFileSync('./seeds/users.json'));
            for(let i = 0; i < users.length; i++)
            {
                let userAlreadyExists = await self.db.User.findOne({
                    where: {
                        email: users[i].email
                    }
                });

                if(!userAlreadyExists) 
                {
                    users[i].password = Passport.hashPassword(users[i].password);
                    const user = await self.db.User.create(users[i]);

                    await self.db.Settings.create({
                        pourNotifications: true,
                        fertilizeNotifications: true,
                        mondayNotifications: false,
                        tuesdayNotifications: true,
                        wednesdayNotifications: true,
                        thursdayNotifications: false,
                        fridayNotifications: true,
                        saturdayNotifications: true,
                        sundayNotifications: true,
                        remindDaily: true,
                        remindWeekly: false,
                        belongsToUser: user.id
                    });
                }
            }
    
            let plants = JSON.parse(fs.readFileSync('./seeds/plants.json')); 
            await self.db.Plant.bulkCreate(plants);
            
            let diaryEntries = JSON.parse(fs.readFileSync('./seeds/diaryEntries.json')); 
            await self.db.DiaryEntry.bulkCreate(diaryEntries);
        }
        catch(err) 
        {
            error = err;
            console.error(error);
        }

        if(error) 
        {
            self.render(error);
        }
        else 
        {
            self.render({
                message: 'Demo Daten wurde erfolgreich in der Datenbank gespeichert!'
            });
        }
    }

    async actionInitDatabase() 
    {
        const self = this;

        let error = null;
        try 
        {
            await self.db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            await self.db.User.sync({ force: true });
            await self.db.PlantType.sync({ force: true });
            await self.db.Plant.sync({ force: true });
            await self.db.Settings.sync({ force: true });
            await self.db.DiaryEntry.sync({ force: true });
            await self.db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        }
        catch(err) 
        {
            error = err;
            console.error('Something went wrong...', err);
        }
        

        if(error) 
        {
            self.render(error);
        }
        else 
        {
            self.render({
                message: 'Die Datenbank wurde erfolgreich synchronisiert!'
            });
        }
    }

    async b64toBlob(fileName) 
    {
        const res = await fetch(`https://garten-jeden.herokuapp.com/uploads/`+fileName);
        console.log('res HEEEEEEEELP!!! ->', res);
        return res.blob();
    };
}

module.exports = HelperController;