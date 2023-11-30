const express = require('express');
const router = express.Router();

const courseInstancesController = require('../controllers/course-instances');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', courseInstancesController.getAllCourseInstances);
router.get('/:id', courseInstancesController.getSingleCourseInstance);
router.post('/', isAuthenticated, validation.saveCourseInstance,  courseInstancesController.createCourseInstance);
router.put('/:id', isAuthenticated,  validation.saveCourseInstance, courseInstancesController.updateCourseInstance);
router.delete('/:id', isAuthenticated, courseInstancesController.deleteCourseInstance);

module.exports = router;
