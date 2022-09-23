const defaultRenderOptions = {
    statusCode: 200,
    layout: false
};
 
class Controller
{
    constructor(router, req, res, action)
    {
        const self = this;

        self.router = router;
        self.req = req;
        self.res = res;
        self.action = action;

        self.format = Controller.HTTP_FORMAT_HTML;

        self.beforeList = [];
    }

    get db() 
    {
        return this.router.database;
    }

    before(actions, fn)
    {
        const self = this;

        if(typeof actions === 'string')
        {
            actions = [actions];
        }

        self.beforeList.push({
            actions: actions,
            fn: fn
        });
    }

    executeBeforeList(cb, index = 0)
    {
        const self = this;

        if(index >= self.beforeList.length)
        {
            cb();
        }
        else
        {
            self.executeBefore(self.beforeList[index], () => {
                process.nextTick(function(){
                    self.executeBeforeList(cb, ++index);
                });
            });
        }
    }

    executeBefore(before, cb)
    {
        const self = this;
        
        if(before.actions.indexOf('*') !== -1 && before.actions.indexOf('-' + self.action) === -1
           || before.actions.indexOf(self.action) !== -1)
        {
            before.fn.apply(self, [cb]);    
        }
        else
        {
            process.nextTick(function(){
                cb();
            });
        }
    }

    render(params = {}, opts = {})
    {
        const self = this;

        opts = Object.assign(defaultRenderOptions, opts);

        self.res.status(opts.statusCode);

        if(self.format === Controller.HTTP_FORMAT_JSON)
        {
            let jsonStr = JSON.stringify(params);
            self.res.set('content-type', 'application/json');
            self.res.set('content-length', jsonStr.length);
            self.res.send(jsonStr);
        }
        else
        {
            // TODO: html rendering can be implemented here...
        }
    }

    param(key)
    {
        const self = this;

        if(self.req.query && typeof self.req.query[key] !== 'undefined')
        {
            return self.req.query[key];
        }
        else if(self.req.body && typeof self.req.body[key] !== 'undefined')
        {
            return self.req.body[key];
        }

        return self.req.params[key];
    }

    urlFor(...args)
    {
        return this.router.urlFor(...args);
    }

    redirect(url = '/')
    {
        return this.res.redirect(302, url);
    }
 }
 
// Defines
Controller.HTTP_FORMAT_JSON = 'JSON';
Controller.HTTP_FORMAT_HTML = 'HTML';
Controller.HTTP_CODE_INTERNAL_SERVER_ERROR = 500;
Controller.HTTP_CODE_NOT_ACCEPTABLE = 406;
Controller.HTTP_CODE_UNAUTHORIZED = 401;
Controller.HTTP_CODE_FORBIDDEN = 403;
Controller.HTTP_CODE_BAD_REQUEST = 400;
Controller.HTTP_CODE_CREATED = 201;
Controller.HTTP_CODE_OK = 200;

module.exports = Controller;