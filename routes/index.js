const router = require('express').Router();
const passport = require('passport');

router.use('/api-docs', require('./swagger.js'));
router.use('/course-instances', require('./course-instances.js'));
router.use('/courses', require('./courses.js'));
router.use('/enrollments', require('./enrollments.js'));
router.use('/students', require('./students.js'));
router.use('/teachers', require('./teachers.js'));

router.get('/login', passport.authenticate('github'), (req, res) => {});
router.get('/logout', function (req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  }
)}
);

module.exports = router;
