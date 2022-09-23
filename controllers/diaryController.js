const Controller = require('./mainController');
const moment = require('moment');

class DiaryController extends Controller 
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
                    message: 'Bitte melde dich an um diese Schnittstelle nutzen zu können!'
                }, 403);
            }
        });
    }

    async actionIndex() 
    {
        const self = this;

        const plantId = self.param('plantId');

        let error = null;
        let diaryEntries = null;
        if(!plantId) 
        {
            error = 'Parameter fehlen, biite überprüfe deine Anfrage!';
            self.render(error);
        }
        else 
        {
            try 
            {
                diaryEntries = await self.db.DiaryEntry.findAll({
                    where: {
                        belongsToPlantId: plantId
                    }
                });
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
                    diaryEntries: diaryEntries
                });
            }
        }
    }

    async actionCreate() 
    {
        const self = this;
        
        const plantId = self.param('plantId');
        const plantHeight = self.param('plantHeight');

        let error = null;
        let diaryEntries = null;
        if(!plantId || !plantHeight) 
        {
            error = 'Parameter fehlen, bitte überprüfe deine Anfrage!';
            self.render(error);
        }
        else 
        {
            console.log('PLANT ID _> !!!! ', plantId);
            const now = moment();
            try 
            {
                await self.db.DiaryEntry.create({
                    heightMeasured: plantHeight,
                    belongsToPlantId: plantId,
                    notedAt: now.format('YYYY-MM-DD')
                });

                diaryEntries = await self.db.DiaryEntry.findAll({
                    where: {
                        belongsToPlantId: plantId
                    }
                });
            } 
            catch(err) 
            {
                error = err;
                console.error(error);
            }
        }

        if(error) 
        {
            self.render(error);
        }
        else 
        {
            self.render({
                diaryEntries: diaryEntries
            });
        }
    }
}

module.exports = DiaryController;