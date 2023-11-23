const express = require('express');
const router = express.Router();

const teachersController = require('../controllers/teachers.js');

// router.get('/', (req, res) => { res.send('Hello from the teachers.js routes file!'); });

router.get('/', teachersController.getAllTeachers);

router.get('/:id', teachersController.getSingleTeacher);

router.post('/', teachersController.createTeacher);

router.put('/:id', teachersController.updateTeacher);

router.delete('/:id', teachersController.deleteTeacher);

module.exports = router;
