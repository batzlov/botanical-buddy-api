const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const ip = '192.168.178.42';
const port = process.env.PORT || 3000;

global.cfg = require('./config/config.js');

const bodyParser = require('body-parser');
app.use(cors({ origin: true, credentials: true }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

const db = require('./core/database')();

const routes = require('./config/routes.js');
const Router = require('./core/router.js');
const router = new Router(app, routes, db);
router.setup();

http.listen(port, ip, () => {
    console.log(`App is listening at https://botanical-buddy.herokuapp.com/`);
});