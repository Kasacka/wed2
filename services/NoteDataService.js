(async function() {
    const Datastore = require('nedb');
    const db = new Datastore({ filename: 'database/data.db', autoload: true });

    function handleAsyncResult(error, result, resolve, reject) {
        if (error)
            reject(error);
        else
            resolve(result);
    }

    async function deleteById(noteId) {
        return new Promise((resolve, reject) => {
            db.remove({ _id : noteId }, {}, (error, nofRemoved) => {
                handleAsyncResult(error, nofRemoved, resolve, reject);
            });
        });
    }

    async function create(note) {
        return new Promise((resolve, reject) => {
            note.createdDate = Date.now();
            db.insert(note, (error, newNote) => {
                handleAsyncResult(error, newNote, resolve, reject);
            });
        });
    }

    async function update(id, note) {
        return new Promise((resolve, reject) => {
            db.update({ _id: id }, note, (error, number) => {
                handleAsyncResult(error, number, resolve, reject);
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

    async function getAllSorted(sortAttribute, direction, showFinished) {
        let sortSettings = {};
        sortSettings[sortAttribute] = direction;
        let query = {};
        if (!showFinished) {
            query.isFinished = false;
        }
        return new Promise((resolve, reject) => {
            db.find(query).sort(sortSettings).exec((error, notes) => {
                handleAsyncResult(error, notes, resolve, reject);
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
        update: update,
        getById: getById,
        getAll: getAll,
        getAllSorted: getAllSorted,
        deleteById: deleteById
    }
})();