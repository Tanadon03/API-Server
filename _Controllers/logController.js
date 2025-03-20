// _Controllers/logController.js
const axios = require('axios');

const logUrl = process.env.LOG_URL;

// GET all logs
// exports.listLogs = async (req, res) => {
//   try {
//     const response = await axios.get(logUrl);
//     let data = response.data.items;


//     res.status(200)
//     res.send(data);
//   } catch (err) {
//     console.error('Error fetching logs:', err.message);
//     res.status(500).json({ error: 'Server Error: Failed to fetch logs' });
//   }
// };

// GET log by ID
exports.getLog = async (req, res) => {
  try {
    const id = parseInt(req.params.id); // แปลง drone_id เป็นตัวเลข
    console.log('Requested drone_id:', id); // Debug
    const response = await axios.get(logUrl);

    let logs = response.data.items; // ดึง logs

    if (!logs || logs.length === 0) {
      return res.status(404).json({ error: 'No logs found' });
    }

    // กรองเฉพาะ logs ของ drone_id ที่ร้องขอ
    let filteredLogs = logs
      .filter(log => log.drone_id == id) // ใช้ == เผื่อ drone_id เป็น string
      .sort((a, b) => new Date(b.created) - new Date(a.created)) // เรียงจาก created ล่าสุดก่อน
      .slice(0, 25) // จำกัด 25 รายการ
      .map(log => ({
        drone_id: log.drone_id,
        drone_name: log.drone_name,
        created: log.created,
        country: log.country,
        celsius: log.celsius
      })); // ส่งเฉพาะฟิลด์ที่ต้องการ

      if (!filteredLogs || filteredLogs.length === 0) {
        return res.status(404).json({ error: `No drones id or data from : ${id}` });
      }

    console.log('Filtered Logs:', filteredLogs); // Debug

    // ส่ง response เป็น filteredLogs ที่มีแค่ 5 ฟิลด์
    res.status(200).json(filteredLogs);

  } catch (err) {
    console.error('Error fetching logs:', err.message);
    res.status(500).json({ error: 'Server Error: Failed to fetch logs' });
  }
};

// POST new log
exports.createLog = async (req, res) => {
  const { celsius, drone_id, drone_name, country } = req.body;

  if (!celsius || !drone_id || !drone_name || !country) {
    return res
      .status(400)
      .send("Missing required fields: celsius, drone_id, drone_name, or country");
  }

  try {
    console.log("logUrl:", logUrl); // Verify the URL
    console.log("Payload:", { celsius, drone_id, drone_name, country }); // Verify the data
    const response = await axios.post(
      logUrl,
      { celsius, drone_id, drone_name, country },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Insert complete, response:", response.data); // Log server response
    res.status(200).send("Insert complete");
  } catch (error) {
    console.error("Error details:", error.response ? error.response.data : error.message);
    res.status(500).send("Error handling the data");
  }
};
  