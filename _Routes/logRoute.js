// _Routes/logRoute.js
const express = require('express');
const router = express.Router();
const { listLogs, getLog, createLog } = require('../_Controllers/logController');

// router.get('/logs', listLogs);         // List all logs
router.get('/logs/:id', getLog);       // Get log by ID
router.post('/logs', createLog);       // Create new log

module.exports = router;