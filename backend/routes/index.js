const router = require('express').Router();

router.get(
  // #swagger.tags=['Home'];
  '/',
  (req, res) => {
    res.send('Hello from the index.js routes file!');
  }
);

router.use('/api-docs', require('./swagger.js'));

router.use('/course-instances', require('./course-instances.js'));

router.use('/courses', require('./courses.js'));

router.use('/enrollments', require('./enrollments.js'));

router.use('/students', require('./students.js'));

router.use('/teachers', require('./teachers.js'));



module.exports = router;
