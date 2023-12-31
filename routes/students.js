const express = require('express');
const router = express.Router();

const studentsController = require('../controllers/students.js');
const { isAuthenticated } = require('../middleware/authenticate.js');
const validation = require('../middleware/validate');

router.get('/', studentsController.getAllStudents);
router.get('/:id', studentsController.getSingleStudent);
router.post('/', isAuthenticated, validation.saveStudent, studentsController.createStudent);
router.put('/:id', isAuthenticated, validation.saveStudent, studentsController.updateStudent);
router.delete('/:id', isAuthenticated, studentsController.deleteStudent);

module.exports = router;
