// _Routes/configRoute.js
const express = require('express');
const router = express.Router();
const { getConfigs, getStatus } = require('../_Controllers/configController');

router.get('/configs/:id', getConfigs);
router.get('/status/:id', getStatus);

module.exports = router;