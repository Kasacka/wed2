const noteDataService = require('../services/NoteDataService');
const dueTimeLabelService = require('../services/DueTimeLabelService');
const url = require('url');

function mapNoteToDueLabelNote(note) {
    let finishedUntil = new Date(note.finishedUntil);
    note.dueTimeLabel = dueTimeLabelService.getDueTimeLabelByDate(finishedUntil);
    return note;
}

function mapNoteToPriorityNote(note) {
    note.priority = range(1, note.priority);
    return note;
}

function index(request, response) {
    let query = url.parse(request.url, true).query;
    let sortBy = query.sortBy || 'finishedUntil';
    let direction = query.direction || 1;

    noteDataService.getAllSorted(sortBy, direction)
        .then(notes => notes.map(mapNoteToDueLabelNote))
        .then(notes => notes.map(mapNoteToPriorityNote))
        .then(notes => renderIndex(response, notes, sortBy, direction));
}

function renderIndex(response, notes, sortBy, direction) {
    let viewData = {
        finishedUntilActive: sortBy === 'finishedUntil',
        createdDateActive: sortBy === 'createdDate',
        priorityActive: sortBy === 'priority',
        notes: notes
    };
    
    viewData.finishedUntilDirection = viewData.finishedUntilActive ? -direction : 1;
    viewData.createdDateDirection = viewData.createdDateActive ? -direction : 1;
    viewData.priorityDirection = viewData.priorityActive ? -direction : 1;

    return response.render('index', viewData);
}

function range(start, end) {
    if (start == end)
        return [start];
    return [start, ...range(start + 1, end)];
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
        .then(_ => response.redirect('/'));
}

module.exports = {
    index: index,
    create: create,
    delete: deleteNote
};