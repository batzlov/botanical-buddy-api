const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");

const Controller = require('./mainController.js');

class PlantTypesController extends Controller
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
        const plantNameString = self.param('nameString')

        let plants = null;
        try
        {
            plants = await self.db.PlantType.findAll({
                where: {
                    nameGer: {
                        [Op.ne]: '',
                        [Op.like]: plantNameString + '%'
                    }
                },
                limit: 50
            });
        }
        catch(err)
        {
            console.log(err);
        }

        // console.log(plants)

        self.render(plants);
    }
}

module.exports = PlantTypesController;