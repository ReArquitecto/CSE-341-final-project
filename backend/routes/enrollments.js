const express = require('express');
const router = express.Router();

const enrollmentsController = require('../controllers/enrollments.js');

// router.get('/', (req, res) => { res.send('Hello from the enrollments.js routes file!'); });

router.get('/', enrollmentsController.getAllEnrollments);

router.get('/:id', enrollmentsController.getSingleEnrollment);

router.post('/', enrollmentsController.createEnrollment);

router.put('/:id', enrollmentsController.updateEnrollment);

router.delete('/:id', enrollmentsController.deleteEnrollment);

module.exports = router;
