// _Routes/configRoute.js
const express = require('express');
const router = express.Router();
const { getConfigs } = require('../_Controllers/configController');

router.get('/configs', getConfigs);

module.exports = router;