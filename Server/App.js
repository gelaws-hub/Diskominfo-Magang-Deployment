const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const accountRoute = require('./routes/Account');
const adminRoute = require('./routes/Admin');
const userRoute = require('./routes/User');
const imageRoute = require('./routes/Image');
const corsOptions = {
    credentials: true, // Mengizinkan pengiriman kredensial (kuki, header, dll.)
    origin: ['http://localhost:3004', 'http://localhost:3001', 'http://192.168.1.32:3001', 'https://diskominfo-smg-magang.cloud']
};

app.use(cors(corsOptions));
app.use("/account",accountRoute);
app.use("/admin",adminRoute);
app.use("/user",userRoute);
app.use("/images",imageRoute);
app.use("/uploads", express.static('uploads'));

module.exports = app;