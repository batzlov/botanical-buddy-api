const Controller = require('./mainController.js');

class UsersController extends Controller
{
    constructor(...args) 
    {
        super(...args);

        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;
    }

    actionIndex() {}

    actionShow() {}

    actionCreate() {}

    actionDestroy() {}

    actionUpdate() {}
}

module.exports = UsersController;