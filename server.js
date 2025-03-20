
const express = require("express")
const { readdirSync } = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Dynamically load routes
readdirSync('./_Routes').map((file) => {
  app.use('', require(`./_Routes/${file}`));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});