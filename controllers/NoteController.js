const noteDataService = require('../services/NoteDataService');
const dueTimeLabelService = require('../services/DueTimeLabelService');
const url = require('url');

function index(_, response) {
    noteDataService.getAll()
        .then(notes => notes.map(note => {
            let finishedUntil = new Date(note.finishedUntil);
            note.dueTimeLabel = dueTimeLabelService.getDueTimeLabelByDate(finishedUntil);
            return note;
        }))
        .then(notes => notes.map(note => {
            note.priority = createRange(1, note.priority);
            return note;
        }))
        .then(notes => response.render('index', { notes : notes }));
}

function createRange(start, end) {
    let range = [];
    for (let index = start; index <= end; ++index) {
        range.push(index);
    }
    return range;
}

function create(request, response) {
    let data = request.body;
    let isFinished = 'isFinished' in data && data.isFinished === '1';
    noteDataService.create({
        title: data.title,
        description: data.description,
        priority: data.priority,
        finishedUntil: data.finishedUntil,
        isFinished: isFinished
    })
    .then(_ => response.redirect('/'));
}

function deleteNote(request, response) {
    const id = request.params.id;
    noteDataService.deleteById(id)
        .then(nofRemoved => response.redirect('/'));
}

module.exports = {
    index: index,
    create: create,
    delete: deleteNote
};