const PlantsController = require('../controllers/plantsControllers');
const HelperController = require('../controllers/helperController');
const EventsController = require('../controllers/eventsController');
const DiaryController = require('../controllers/diaryController');
const PlantTypesController = require('../controllers/plantTypesController');
const SettingsController = require('../controllers/settingsController');
const AuthenticationController = require('../controllers/authenticationController');

let routes = {
    'plants': {
        controller: PlantsController,
        actions: [
            { path: '/plants', action: 'index', method: 'get' },
            { path: '/plants', action: 'create', method: 'post' },
            { path: '/plants/:id', action: 'show', method: 'get' },
            { path: '/plants/:id', action: 'destroy', method: 'delete' },
        ]
    },
    'plantTypes': {
        controller: PlantTypesController,
        actions: [
            { path: '/plant-types', action: 'index', method: 'get' },
        ]
    },
    'settings': {
        controller: SettingsController,
        actions: [
            { path: '/settings', action: 'index', method: 'get' },
            { path: '/settings', action: 'update', method: 'put' },
        ]
    },
    'authentication': {
        controller: AuthenticationController,
        actions: [
            { path: '/sign-up', action: 'signUp', method: 'post' },
            { path: '/sign-in', action: 'signIn', method: 'post' },
            { path: '/sign-out', action: 'signOut', method: 'get' },
        ]
    },
    'events': {
        controller: EventsController,
        actions: [
            { path: '/events', action: 'events', method: 'get' },
            { path: '/events-today', action: 'eventsToday', method: 'get' }
        ]
    },
    'diary': {
        controller: DiaryController,
        actions: [
            { path: '/:plantId/diary-entries', action: 'index', method: 'get' },
            { path: '/:plantId/diary-entries', action: 'create', method: 'post' },
        ]
    },
    'helper': {
        controller: HelperController,
        actions: [
            { path: '/', action: 'index', method: 'get' },
            { path: '/init-db', action: 'initDatabase', method: 'get' },
            { path: '/insert-demo-data', action: 'insertDemoData', method: 'get' },
            { path: '**', action: '404', method: 'get' },
        ]
    },
};

module.exports = routes;