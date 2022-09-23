const Controller = require('./mainController.js');

class SettingsController extends Controller
{
    constructor(...args) 
    {
        super(...args);

        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*'], (next) => {
            if(self.req.authorized === true) 
            {
                next();
            }
            else 
            {
                self.render({
                    message: 'Bitte melde dich an bevor du diese Schnittstellen anfragst!'
                }, 403);
            }
        });
    }

    async actionIndex() 
    {
        const self = this;

        let settings = null;
        let error = null;
        try 
        {
            settings = await self.db.Settings.findOne({
                where: {
                    belongsToUser: self.req.user.id
                }
            });
        }
        catch(err) 
        {
            console.error(err);
            error = err;
        }

        if(error) 
        {
            self.render(error);
        }
        else 
        {
            self.render(settings)
        }
    }

    async actionUpdate() 
    {
        const self = this;

        const pourNotifications = self.param('pourNotifications');
        const fertilizeNotifications = self.param('fertilizeNotifications');
        const mondayNotifications = self.param('mondayNotifications');
        const tuesdayNotifications = self.param('tuesdayNotifications');
        const wednesdayNotifications = self.param('wednesdayNotifications');
        const thursdayNotifications = self.param('thursdayNotifications');
        const fridayNotifications = self.param('fridayNotifications');
        const saturdayNotifications = self.param('saturdayNotifications');
        const sundayNotifications = self.param('sundayNotifications');
        const remindDaily = self.param('remindDaily');
        const remindWeekly = self.param('remindWeekly');

        let error = null;
        let settings = null;
        try 
        {
            settings = await self.db.Settings.findOne({
                where: {
                    belongsToUser: self.req.user.id
                }
            });

            settings.pourNotifications = pourNotifications;
            settings.fertilizeNotifications = fertilizeNotifications;
            settings.mondayNotifications = mondayNotifications;
            settings.tuesdayNotifications = tuesdayNotifications;
            settings.wednesdayNotifications = wednesdayNotifications;
            settings.thursdayNotifications = thursdayNotifications;
            settings.fridayNotifications = fridayNotifications;
            settings.saturdayNotifications = saturdayNotifications;
            settings.sundayNotifications = sundayNotifications;
            settings.remindDaily = remindDaily;
            settings.remindWeekly = remindWeekly;

            // default settings
            await settings.save();
        }
        catch(err) 
        {
            error = err;
            console.log(err);
        }

        if(error) 
        {
            self.render(error);
        }
        else 
        {
            self.render(settings);
        }
    }
}

module.exports = SettingsController;