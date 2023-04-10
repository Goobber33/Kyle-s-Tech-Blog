const express = require('express');
const router = express.Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home');
const dashboardRoutes = require('./dashboard');

router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/', homeRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
