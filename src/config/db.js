const mongoose = require('mongoose');
// const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://mongodb:27017/');
    await mongoose.connect('mongodb://127.0.0.1:27017/');
    // logger.info('connected to db ');
    console.log("connected to db")
  } catch (e) {
    console.log(e.message)
    // logger.error('connection failed', e.message);
  }
};

module.exports = connectDB;
