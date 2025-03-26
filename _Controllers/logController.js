// _Controllers/logController.js
const axios = require('axios');

const logUrl = process.env.LOG_URL;
const AuthorKey = process.env.API_KEY;

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
    const id = parseInt(req.params.id);
    console.log('Requested drone_id:', id);
    const response = await axios.get(logUrl);
    

    let logs = response.data.items;

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
      }));

      if (!filteredLogs || filteredLogs.length === 0) {
        return res.status(404).json({ error: `No drones id or data from : ${id}` });
      }

    console.log('Filtered Logs:', filteredLogs);

    // ส่ง response เป็น filteredLogs ที่มีแค่ 5 ฟิลด์
    res.status(200).json(filteredLogs);

  } catch (err) {
    console.error('Error fetching logs:', err.message);
    res.status(500).json({ error: 'Server Error: Failed to fetch logs' });
  }
};

// POST new log
// Controller สำหรับสร้าง Drone Log (รวม Middleware เข้ามา)
exports.createLog = async (req, res) => {
  try {
    // ตรวจสอบ Authorization Header (ส่วนของ Middleware เดิม)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No Bearer token provided" });
    }

    const AuthorKey = authHeader.split(" ")[1];
    if (!AuthorKey) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    // ดึงข้อมูลจาก request body
    const { celsius, drone_id, drone_name, country } = req.body;

    if (!celsius || !drone_id || !drone_name || !country) {
      return res.status(400).json({ error: "Missing required fields: celsius, drone_id, drone_name, or country" });
    }

    // เตรียม payload สำหรับส่งไปยัง PocketBase
    const payload = {
      celsius: Number(celsius),
      drone_id: Number(drone_id),
      drone_name: String(drone_name),
      country: String(country),
    };

    // ส่งคำขอ POST ไปยัง PocketBase
    const response = await axios.post(logUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AuthorKey}`,
      },
    });

    // ส่งผลลัพธ์กลับไปยัง client
    return res.status(200).json({
      message: "Drone log created successfully",
      data: response.data,
    });

  } catch (error) {
    // จัดการข้อผิดพลาด
    const errorMessage = error.response?.data?.message || error.message;
    const errorCode = error.response?.status || 500;

    console.error("Error creating drone log:", errorMessage);
    return res.status(errorCode).json({
      error: "Failed to create drone log",
      details: errorMessage,
    });
  }
};