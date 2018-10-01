const noteDataService = require('../services/NoteDataService');
const dueTimeLabelService = require('../services/DueTimeLabelService');
const url = require('url');

function mapNoteToDueLabelNote(note) {
    let finishedUntil = new Date(note.finishedUntil);
    note.dueTimeLabel = dueTimeLabelService.getDueTimeLabelByDate(finishedUntil);
    return note;
}

function mapNoteToPriorityNote(note) {
    note.priority = createRange(1, note.priority);
    return note;
}

function index(request, response) {
    let query = url.parse(request.url, true).query;
    let sortAttribute = query.sortBy || 'finishedUntil';
    let direction = query.direction || 1;

    noteDataService.getAllSorted(sortAttribute, direction)
        .then(notes => notes.map(mapNoteToDueLabelNote))
        .then(notes => notes.map(mapNoteToPriorityNote))
        .then(notes => response.render('index', {
            notes : notes,
            finishedUntilActive: sortAttribute === 'finishedUntil',
            createdDateActive: sortAttribute === 'createdDate',
            priorityActive: sortAttribute === 'priority',
            finishedUntilDirection: sortAttribute === 'finishedUntil' ? -direction : 1,
            createdDateDirection: sortAttribute === 'createdDate' ? -direction : 1,
            priorityDirection: sortAttribute === 'priority' ? -direction : 1
        }));
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