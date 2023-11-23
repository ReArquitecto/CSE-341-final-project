const express = require('express');
const router = express.Router();

const studentsController = require('../controllers/students.js');

// router.get('/', (req, res) => { res.send('Hello from the students.js routes file!'); });

router.get('/', studentsController.getAllStudents);

router.get('/:id', studentsController.getSingleStudent);

router.post('/', studentsController.createStudent);

router.put('/:id', studentsController.updateStudent);

router.delete('/:id', studentsController.deleteStudent);

module.exports = router;