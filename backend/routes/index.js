const router = require('express').Router();

router.get(
  // #swagger.tags=['Home'];
  '/',
  (req, res) => {
    res.send('Hello from the index.js routes file!');
  }
);

router.use('/api-docs', require('./swagger.js'));

router.use('/students', require('./students.js'));

module.exports = router;
