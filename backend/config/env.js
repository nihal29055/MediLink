// filepath: c:\Users\pcc\Desktop\Projects\MedRepo\backend\config\env.js
require('dotenv').config();

const env = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 5000,
};

module.exports = env;