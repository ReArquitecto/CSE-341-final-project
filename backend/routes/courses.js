const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/courses.js');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getSingleCourse);
router.post('/', isAuthenticated, validation.saveCourse, coursesController.createCourse);
router.put('/:id', isAuthenticated, validation.saveCourse, coursesController.updateCourse);
router.delete('/:id', isAuthenticated, coursesController.deleteCourse);

module.exports = router;
