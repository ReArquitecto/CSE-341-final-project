const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/courses.js');

// router.get('/', (req, res) => { res.send('Hello from the courses.js routes file!'); });

router.get('/', coursesController.getAllCourses);

router.get('/:id', coursesController.getSingleCourse);

router.post('/', coursesController.createCourse);

router.put('/:id', coursesController.updateCourse);

router.delete('/:id', coursesController.deleteCourse);

module.exports = router;