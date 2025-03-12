// _Controllers/configController.js
const axios = require('axios');

exports.getConfigs = async (req, res) => {
  try {
    const configUrl = process.env.CONFIG_URL;
    const response = await axios.get(configUrl);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error fetching configs:', err.message);
    res.status(500).json({ error: 'Server Error: Failed to fetch configs' });
  }
};