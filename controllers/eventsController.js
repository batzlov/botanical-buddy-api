const path = require('path');
const Controller = require('./mainController.js');
const moment = require('moment');

const EVENT_TYPES = {
    POUR: 0,
    FERTILIZE: 1
};

const EVENT_TYPE_COLORS = {
    POUR: '#9AD9DB',
    FERTILIZE: '#98D4BB'
};

class EventsController extends Controller
{
    constructor(...args)
    {
        super(...args);

        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['events', 'eventsToday'], (next) => {
            if(self.req.authorized === true) 
            {
                next();
            }
            else 
            {
                self.render({
                    message: 'Bitte melde dich an um diese Schnittstelle anzufragen!'
                }, 403);
            }
        });
    }

    async actionEvents() 
    {
        const self = this;

        // get user settings
        const userId = 1;
        
        let settings = null;
        try 
        {
            settings = await self.db.Settings.findOne({
                where: {
                    id: self.req.user.id
                }
            });
        }
        catch(err) 
        {
            console.error(err);
        }
        
        const events = self.prepareEvents(settings);

        self.render({
            events: events,
            todayAsString: moment().format('DD.MM.YYYY')
        });
    }

    async actionEventsToday() 
    {
        const self = this;

        // get user settings
        const userId = 1;
        
        let settings = null;
        try 
        {
            settings = await self.db.Settings.findOne({
                where: {
                    id: self.req.user.id
                }
            });
        }
        catch(err) 
        {
            console.error(err);
        }
        
        const events = self.prepareEvents(settings);
        const todayAsString = moment().format('DD.MM.YYYY');
        const filteredEvents = events.filter((event) => {
            if(event.date == todayAsString) 
            {
                return event;
            }
        });

        self.render({
            events: filteredEvents
        });
    }

    // private 
    prepareEvents(settings) 
    {
        const events = [];
        const daysInMonth = moment().daysInMonth();
        if(settings.pourNotifications) 
        {
            // 0 is sunday, 6 ist saturday
            const allowedNotificationDays = [];

            if(settings.sundayNotifications) { allowedNotificationDays.push(0) };
            if(settings.mondayNotifications) { allowedNotificationDays.push(1) };
            if(settings.tuesdayNotifications) { allowedNotificationDays.push(2) };
            if(settings.wednesdayNotifications) { allowedNotificationDays.push(3) };
            if(settings.thursdayNotifications) { allowedNotificationDays.push(4) };
            if(settings.fridayNotifications) { allowedNotificationDays.push(5) };
            if(settings.saturdayNotifications) { allowedNotificationDays.push(6) };

            if(settings.remindDaily) 
            {
                for(let day = 1; day <= daysInMonth; day++) 
                {
                    let date = moment().date(day);
                    if(allowedNotificationDays.indexOf(date.day()) !== -1) 
                    {
                        events.push({
                            date: date.format('DD.MM.YYYY'),
                            details: 'Prüfe ob deine Pflanzen Wasser benötigen.',
                            type: EVENT_TYPES.POUR
                        });
                    }
                }
            }
            else if(settings.remindWeekly) 
            {
                const remindPeriod = 7;
                let allowedStartDay = null;
                
                for(let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) 
                {
                    let date = moment().date(dayOfMonth);
                    if(allowedNotificationDays.indexOf(date.day()) !== -1) 
                    {
                        allowedStartDay = dayOfMonth;
                        // exit the loop
                        dayOfMonth = daysInMonth + 1;
                    }
                }
                
                for(let dayOfMonth = allowedStartDay; dayOfMonth <= daysInMonth; dayOfMonth += remindPeriod) 
                {
                    if(dayOfMonth > daysInMonth) { return; }
                    let date = moment().date(dayOfMonth);
                    events.push({
                        date: date.format('DD.MM.YYYY'),
                        details: 'Prüfe ob deine Pflanzen Wasser benötigen.',
                        type: EVENT_TYPES.POUR
                    });
                }
            }
        }

        if(settings.fertilizeNotifications) 
        {
            // numbers of reminders depend on the length of the month
            const fertilieRemindersPerMonth = daysInMonth >= 30 ? 3 : 2;
            const remindPeriod = 14;
            // start on the second of the month
            let day = 2;

            for(let numOfReminders = 0; numOfReminders < fertilieRemindersPerMonth; numOfReminders++) 
            {
                let date = moment().date(day);
                events.push({
                    date: date.format('DD.MM.YYYY'),
                    details: 'Deine Pflanzen benötigen Dünger.',
                    type: EVENT_TYPES.FERTILIZE
                });
                day += remindPeriod;
            }
        }

        return events;
    }
}

module.exports = EventsController;