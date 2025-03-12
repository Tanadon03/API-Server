// _Controllers/logController.js
const axios = require('axios');

const logUrl = process.env.LOG_URL;

// GET all logs
exports.listLogs = async (req, res) => {
  try {
    const response = await axios.get(logUrl);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error fetching logs:', err.message);
    res.status(500).json({ error: 'Server Error: Failed to fetch logs' });
  }
};

// GET log by ID
exports.getLog = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`${logUrl}/${id}`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error fetching log by ID:', err.message);
    res.status(500).json({ error: 'Server Error: Failed to fetch log' });
  }
};

// POST new log
exports.createLog = async (req, res) => {
    try {
      const logData = req.body;
      console.log('Request Body:', logData);
  
      // Basic validation
      if (!logData.drone_id || !logData.drone_name || !logData.country || !logData.celsius) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const response = await axios.post(logUrl, logData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('PocketBase Response:', response.data);
      res.status(201).json(response.data);
    } catch (err) {
      if (err.response) {
        console.error('Error creating log:', {
          message: err.message,
          status: err.response.status,
          data: err.response.data
        });
        return res.status(err.response.status).json({
          error: 'Failed to create log',
          details: err.response.data
        });
      }
      console.error('Error creating log:', err.message);
      res.status(500).json({ error: 'Server Error: Failed to create log' });
    }
  };
  