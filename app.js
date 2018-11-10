(async function() {
    const path = require('path');
    const express = require('express');
    const session = require('express-session');
    const methodOverride = require('method-override');
    const bodyParser = require('body-parser');
    const uuid = require('uuid/v1');

    const configurationService = require('./services/ConfigurationService');
    const router = require('./routes/index');

    const app = express();
    const configurationFile = path.join(__dirname, 'config.json');
    const configuration = await configurationService.getConfigurationAsync(configurationFile);

    app.set('view engine', 'hbs');

    const sessionConfiguration = {
        secret: configuration.sessionSecret,
        resave: false,
        saveUninitialized: false
    };

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session(sessionConfiguration));

    app.use(methodOverride(request => {
        if (request.body && typeof request.body === 'object' &&
            '_method' in request.body) {
            let method = request.body._method;
            delete request.body._method;
            return method;
        }
    }));

    app.use(router);

    app.use((_, response, next) => {
        let error = new Error('Die angefragte Seite wurde leider nicht gefunden.');
        error.status = 404;
        next(error);
    });

    app.use((error, _, response, next) => {
        response.render('error', { message: '' + error });
    });

    app.listen(configuration.port, () => {
        console.log(`server started successfully on port ${configuration.port}`);
    });
})();