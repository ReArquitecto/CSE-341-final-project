const express = require('express');
const router = express.Router();

const enrollmentsController = require('../controllers/enrollments.js');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', enrollmentsController.getAllEnrollments);
router.get('/:id', enrollmentsController.getSingleEnrollment);
router.post('/', isAuthenticated, validation.saveEnrollment, enrollmentsController.createEnrollment);
router.put('/:id', isAuthenticated, validation.saveEnrollment, enrollmentsController.updateEnrollment);
router.delete('/:id', isAuthenticated, enrollmentsController.deleteEnrollment);

module.exports = router;
