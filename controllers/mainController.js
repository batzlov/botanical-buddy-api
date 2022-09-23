const Controller = require('../core/controller.js');
const Passport = require('../core/passport.js');

class MainController extends Controller
{
    constructor(...args)
    {
        super(...args);

        const self = this;

        // set default unauthorized
        self.req.authorized = false;
        self.req.user = null;

        self.before(['*'], async (next) => {
            let tokenPayload = Passport.isAuthorized(self.req);
            if(tokenPayload !== false) 
            {
                try 
                {
                    const user = await self.db.User.findOne({
                        where: {
                            id: tokenPayload.id
                        }
                    });

                    if(user) 
                    {
                        self.req.user = user;
                        self.req.authorized = true;
                    }

                    next();
                }
                catch(err) 
                {
                    console.log(err);
                    next();
                }
            }
            else 
            {
                next();
            }
        });
    }

    // TODO: implement functions like paging, meta, handleError etc...
}

module.exports = MainController;