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

    if (query.darkStyle !== undefined)
        request.session.darkStyle = query.darkStyle === '1';

    request.session.sortBy = query.sortBy || request.session.sortBy || 'finishedUntil';
    request.session.direction = query.direction || request.session.direction || 1;
    request.session.darkStyle = request.session.darkStyle || false;

    noteDataService.getAllSorted(request.session.sortBy, request.session.direction)
        .then(notes => notes.map(mapNoteToDueLabelNote))
        .then(notes => notes.map(mapNoteToPriorityNote))
        .then(notes => renderIndex(request, response, notes));
}

function renderIndex(request, response, notes) {
    let sortBy = request.session.sortBy;
    let direction = request.session.direction;
    let darkStyle = request.session.darkStyle;

    let viewData = {
        finishedUntilActive: sortBy === 'finishedUntil',
        createdDateActive: sortBy === 'createdDate',
        priorityActive: sortBy === 'priority',
        notes: notes,
        darkStyle: darkStyle
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
    if (data.id) {
        noteDataService.update(data.id, {
            title: data.title,
            description: data.description,
            priority: data.priority,
            finishedUntil: data.finishedUntil,
            isFinished: isFinished
        }).then(_ => response.redirect('/'));
    } else {
        createEntry(data, isFinished, response);
    }
}

function createEntry(data, isFinished, response) {
    noteDataService.create({
        title: data.title,
        description: data.description,
        priority: data.priority,
        finishedUntil: data.finishedUntil,
        isFinished: isFinished
    }).then(_ => response.redirect('/'));
}

function deleteNote(request, response) {
    const id = request.params.id;
    noteDataService.deleteById(id)
        .then(_ => response.redirect('/'));
}


function newNote(request, response) {
    response.render('note', {darkStyle: request.session.darkStyle});
}

function editNote(request, response) {
    noteDataService.getById(request.params.id)
        .then(note => response.render('note', {...note, darkStyle: request.session.darkStyle}));
}

module.exports = {
    index: index,
    create: create,
    delete: deleteNote,
    newNote: newNote,
    edit: editNote
};