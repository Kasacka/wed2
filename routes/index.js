const express = require('express');
const router = express.Router();
const noteController = require('../controllers/NoteController');

router.get('/', noteController.index.bind(noteController));
router.get('/?sortBy=:sort', noteController.index.bind(noteController));
router.put('/note', noteController.create.bind(noteController));
router.get('/deleteNote/:id', noteController.delete.bind(noteController));
router.get('/note', noteController.newNote.bind(noteController));
router.get('/editNote/:id', noteController.edit.bind(noteController));

module.exports = router;