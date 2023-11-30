const express = require('express');
const router = express.Router();

const teachersController = require('../controllers/teachers.js');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', teachersController.getAllTeachers);
router.get('/:id', teachersController.getSingleTeacher);
router.post('/', isAuthenticated, validation.saveTeacher, teachersController.createTeacher);
router.put('/:id', isAuthenticated, validation.saveTeacher, teachersController.updateTeacher);
router.delete('/:id', isAuthenticated, teachersController.deleteTeacher);

module.exports = router;
