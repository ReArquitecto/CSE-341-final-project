const express = require('express');
const router = express.Router();

const enrollmentsController = require('../controllers/enrollments.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', enrollmentsController.getAllEnrollments);
router.get('/:id', enrollmentsController.getSingleEnrollment);
router.post('/', isAuthenticated, enrollmentsController.createEnrollment);
router.put('/:id', isAuthenticated, enrollmentsController.updateEnrollment);
router.delete('/:id', isAuthenticated, enrollmentsController.deleteEnrollment);

module.exports = router;
