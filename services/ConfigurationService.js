(async function() {
    const file = require('fs');

    async function getConfigurationAsync(configurationFile) {
        return new Promise((resolve, reject) => {
            file.readFile(configurationFile, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    const configuration = JSON.parse(String(data));
                    resolve(configuration);
                }
            });
        });
    }

    module.exports = {
        getConfigurationAsync: getConfigurationAsync
    };
})();