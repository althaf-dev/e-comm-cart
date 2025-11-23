const express = require('express');
const router = require('./routes/routes');
require('dotenv').config();
const corsConfig = require('./config/corsConfig');
const { connectRedis } = require('../src/config/db');

const app = express();

app.use(corsConfig);
app.use(express.json());
connectRedis();
app.use((req, res, next) => {
  console.log('hit');
  next();
});
app.use('/api/v1/cart', router);

app.listen(8001, () => console.log('server is running', 8001));
