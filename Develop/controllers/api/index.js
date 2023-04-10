const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./userRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
