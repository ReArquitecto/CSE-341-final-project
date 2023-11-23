const express = require('express');
const router = express.Router();

const courseInstancesController = require('../controllers/students.js');

// router.get('/', (req, res) => { res.send('Hello from the course-instances.js routes file!'); });

router.get('/', courseInstancesController.getAllCourseInstances);

router.get('/:id', courseInstancesController.getSingleCourseInstance);

router.post('/', courseInstancesController.createCourseInstance);

router.put('/:id', courseInstancesController.updateCourseInstance);

router.delete('/:id', courseInstancesController.deleteCourseInstance);

module.exports = router;