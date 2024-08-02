// Load environment variables
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
  // Determine the correct path to the .env file
  const envPath = path.resolve(__dirname, '../.env');
  
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found at:', envPath);
    return;
  }

  // Load .env file
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  // Set each environment variable
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
  
  console.log('Environment variables loaded successfully');
  console.log('MONGO_URI:', process.env.MONGO_URI);
}

module.exports = loadEnv;