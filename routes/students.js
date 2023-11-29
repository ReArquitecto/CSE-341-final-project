const express = require('express');
const router = express.Router();

const studentsController = require('../controllers/students.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', studentsController.getAllStudents);
router.get('/:id', studentsController.getSingleStudent);
router.post('/', isAuthenticated, studentsController.createStudent);
router.put('/:id', isAuthenticated, studentsController.updateStudent);
router.delete('/:id', isAuthenticated, studentsController.deleteStudent);

module.exports = router;
