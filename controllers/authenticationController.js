const Passport = require('../core/passport.js');
const Controller = require('./mainController.js');

class AuthenticationController extends Controller
{
    constructor(...args) 
    {
        super(...args);

        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['signOut'], (next) => {
            if(self.req.authorized === true) 
            {
                next();
            }
            else 
            {
                self.render({
                    message: 'Bitte melde dich zuerst an bevor du versucht dich abzumelden!'
                }, 403);
            }
        });
    }

    async actionSignUp() 
    {
        const self = this;

        const firstName = self.param('firstName');
        const lastName = self.param('lastName');
        const email = self.param('email');
        const password = self.param('password');

        let error = null;
        
        if(!firstName || !lastName || !email || !password) 
        {
            error = 'Parammeter fehlen, bitte überprüfe deine Eingaben.'
            console.log(error)
            self.render({
                details: error
            }, {
                statusCode: 400
            });
        }
        else 
        {
            // check if email already exists in database
            let emailAlreadyExists = null;
            let user = null;
            try 
            {
                emailAlreadyExists = await self.db.User.findOne({
                    where: {
                        email: email
                    }
                });
    
                if(emailAlreadyExists) 
                {
                    error = 'Die E-Mail wird bereits von einem anderen Nutzer verwendet.';
                }
                else 
                {
                    user = await self.db.User.create({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: Passport.hashPassword(password)
                    });
    
                    // default settings
                    await self.db.Settings.create({
                        pourNotifications: true,
                        fertilizeNotifications: true,
                        mondayNotifications: false,
                        tuesdayNotifications: false,
                        wednesdayNotifications: false,
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
            catch(err) 
            {
                error = err;
            }
            
            if(error !== null) 
            {
                self.render({
                    details: error
                }, {
                    statusCode: 400
                });
            }
            else 
            {
                self.render(user);
            }
        }
    }

    async actionSignIn() 
    {
        const self = this;

        const email = self.param('email');
        const password = self.param('password');

        console.log(email, password)

        let error = null;
        let user = null;

        if(!email || !password) 
        {
            error = 'Parameter fehlen, bitte überprüfe deine Eingaben.';

            self.render({
                details: error
            }, {
                statusCode: 400
            });
        }
        else 
        {
            try 
            {
                user = await self.db.User.findOne({
                    where: {
                        email: email
                    }
                });
    
                if(!user || !Passport.comparePassword(password, user.password)) 
                {
                    error = 'Deine Daten stimmen mit keinem Nutzer überein!';
                }
            }
            catch(err) 
            {
                error = err;
                console.log(err);
            }
    
            if(error !== null)
            {
                console.error(error);
                self.render({
                    details: error
                }, {
                    statusCode: 400
                });
            }
            else
            {
                let token = Passport.authorizeUserWithCookie(self.req, self.res, user.id);
                
                self.render({
                    token: token,
                    user: user,
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }, {
                    statusCode: 201
                });
            }
        }
    }

    actionSignOut() 
    {
        const self = this;

        self.res.clearCookie(cfg.cookieName);

        self.render({
            message: 'Du bist jetzt abgemeldet.'
        });
    }

    actionPasswordForgotten() {}
}

module.exports = AuthenticationController;