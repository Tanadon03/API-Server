// _Controllers/configController.js
const axios = require('axios');

const configUrl = process.env.CONFIG_URL;

exports.getConfigs = async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Convert to integer
    const response = await axios.get(configUrl);
    const drones = response.data.data;

    if (!drones || drones.length === 0) {
      return res.status(404).json({ error: 'No drones found' });
    }

    const drone = drones.find(d => d.drone_id === id);

    if (!drone) {
      return res.status(404).json({ error: `Drone with ID ${id} not found` });
    }

    const filteredDrone = {
      drone_id: drone.drone_id,
      drone_name: drone.drone_name,
      light: drone.light,
      country: drone.country,
      weight: drone.weight
    };

    res.status(200).json(filteredDrone);

  } catch (err) {
    console.error('Error fetching configs:', err.message);
    res.status(500).json({ error: 'Server Error: Failed to fetch configs' });
  }
};

// GET log by ID
exports.getStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Convert to integer
    const response = await axios.get(configUrl); // Get all data

    // Check if `data` exists in the response
    if (!response.data || !response.data.data) {
      return res.status(500).json({ error: 'Invalid API response format' });
    }

    // Find the specific drone by `drone_id`
    const drone = response.data.data.find(d => d.drone_id === id);

    if (drone) {
      res.status(200).json({ condition: drone.condition });
    } else {
      res.status(404).json({ error: 'Drone not found' });
    }
  } catch (err) {
    console.error('Error fetching log by ID:', err.message);
    res.status(500).json({ error: 'Server Error: Failed to fetch log' });
  }
};
