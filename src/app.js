const express = require('express');
const router = require('./routes/routes');
const adminRouter = require('./routes/admin');
require('dotenv').config();
const corsConfig = require('./config/corsConfig');
const connectDB = require('../src/config/db');

const app = express();

app.use(corsConfig);
app.use(express.json());
connectDB();

app.use('/api/v1/products/customer', router);
app.use('/api/v1/products/admin', adminRouter);

app.listen(8001, () => console.log('server is running', 8001));
