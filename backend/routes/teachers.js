const express = require('express');
const router = express.Router();

const teachersController = require('../controllers/teachers.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', teachersController.getAllTeachers);
router.get('/:id', teachersController.getSingleTeacher);
router.post('/', isAuthenticated, teachersController.createTeacher);
router.put('/:id', isAuthenticated, teachersController.updateTeacher);
router.delete('/:id', isAuthenticated, teachersController.deleteTeacher);

module.exports = router;
