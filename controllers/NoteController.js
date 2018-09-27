const noteDataService = require('../services/NoteDataService');
const dueTimeLabelService = require('../services/DueTimeLabelService');

function index(_, response) {
    noteDataService.getAll()
        .then(notes => notes.map(note => {
            let finishedUntil = new Date(note.finishedUntil);
            note.dueTimeLabel = dueTimeLabelService.getDueTimeLabelByDate(finishedUntil);
            return note;
        }))
        .then(notes => response.render('index', { notes : notes }));
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

module.exports = {
    index: index,
    create: create
};