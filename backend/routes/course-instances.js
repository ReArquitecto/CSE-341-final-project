const express = require('express');
const router = express.Router();

const courseInstancesController = require('../controllers/course-instances');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', courseInstancesController.getAllCourseInstances);
router.get('/:id', courseInstancesController.getSingleCourseInstance);
router.post('/', isAuthenticated, courseInstancesController.createCourseInstance);
router.put('/:id', isAuthenticated, courseInstancesController.updateCourseInstance);
router.delete('/:id', isAuthenticated, courseInstancesController.deleteCourseInstance);

module.exports = router;
