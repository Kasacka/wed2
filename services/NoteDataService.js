(async function() {
    const Datastore = require('nedb');
    const db = new Datastore({ filename: 'data.db', autoload: true });

    function handleAsyncResult(error, result, resolve, reject) {
        if (error)
            reject(error);
        else
            resolve(result);
    }

    async function create(note) {
        return new Promise((resolve, reject) => {
            db.insert(note, (error, newNote) => {
                handleAsyncResult(error, newNote, resolve, reject);
            });
        });
    }

    async function getById(id) {
        return new Promise((resolve, reject) => {
            db.findOne({ _id: id }, (error, note) => {
                handleAsyncResult(error, note, resolve, reject);
            });
        });
    }

    async function getAll() {
        return new Promise((resolve, reject) => {
            db.find({}, (error, notes) => {
                handleAsyncResult(error, notes, resolve, reject);
            });
        });
    }

    module.exports = {
        create: create,
        getById: getById,
        getAll: getAll
    }
})();