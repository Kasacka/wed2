(async function() {
    const express = require('express');
    const methodOverride = require('method-override');
    const bodyParser = require('body-parser');

    const configurationService = require('./services/ConfigurationService');

    const noteController = require('./controllers/NoteController');
    
    const app = express();
    const configurationFile = __dirname + '/config.json';
    const configuration = await configurationService.getConfigurationAsync(configurationFile);

    app.set('view engine', 'hbs');

    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(methodOverride(request => {
        if (request.body && typeof request.body === 'object' &&
            '_method' in request.body) {
            let method = request.body._method;
            delete request.body._method;
            return method;
        }
    }));

    app.get('/', noteController.index.bind(noteController));
    app.get('/?sortBy=:sort', noteController.index.bind(noteController));
    app.put('/note', noteController.create.bind(noteController));
    app.get('/deleteNote/:id', noteController.delete.bind(noteController));
    app.get('/note', (request, response) => {
        response.render('note', {});
    });

    app.listen(configuration.port, () => {
        console.log(`server started successfully on port ${configuration.port}`);
    });
})();