const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const Controller = require('./mainController.js');

class PlantsController extends Controller
{
    constructor(...args) 
    {
        super(...args);

        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;
    }

    async actionIndex()
    {
        const self = this;

        let plants = null;
        let error = null;
        try
        {
            plants = await self.db.Plant.findAll({
                where: {
                    ownerId: self.req.user.id
                },
                include: [
                    { model: self.db.PlantType, as: 'parent' }
                ]
            });
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
            self.render(plants);
        }
    }

    actionShow() 
    {
        const self = this;

        const id = self.param('id');

        let rawData = fs.readFileSync('database.json');
        let plants = JSON.parse(rawData);
        plants = plants.plants;

        let plant = plants.filter((plant) => {
            return plant.id == id;
        })

        self.render({
            plant: plant
        });
    }

    async actionCreate() 
    {
        const self = this;

        const plantName = self.param('name');
        const plantType = self.param('type');
        const plantTypeId = self.param('typeId');
        const plantHeight = self.param('height');
        const plantImage = self.param('image');

        let error = null;
        let plant = null;
        let pathToPlantImages = path.join(__dirname, '..', '/uploads/');
        try 
        {
            let fileName = uuidv4() + '.jpg';
            plant = await self.db.Plant.create({
                name: plantName,
                type: plantType,
                typeId: plantTypeId,
                height: plantHeight,
                imageRef: fileName,
                // imageData: plantImage,
                ownerId: self.req.user.id
            });

            await self.db.DiaryEntry.create({
                heightMeasured: plantHeight,
                belongsToPlantId: plant.id,
                notedAt: moment().format('YYYY-MM-DD')
            });

            await fs.writeFileSync(pathToPlantImages + fileName, plantImage, 'base64');
        }
        catch(err)
        {
            error = err;
            console.error(err);
        }

        if(error) 
        {
            self.render(error);
        }
        else 
        {
            self.render(plant);
        }
    }

    async actionDestroy() 
    {
        const self = this;

        const id = self.param('id');

        let error = null;
        try 
        {
            await self.db.Plant.destroy({
                where: {
                    id: id
                }
            });

            await self.db.DiaryEntry.destroy({
                where: {
                    belongsToPlantId: id
                }
            });
        }
        catch(err) 
        {
            error = err;
        }

        self.render(error ? error : {});   
    }

    // TODO: 
    actionUpdate() {}
}

module.exports = PlantsController;