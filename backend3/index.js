require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Import path module
const router = require('./routes/router');//basic functions
const bookingRouter=require('./routes/bookingRouter')

const serviceApp = express();
require('./database/dbConnection');

serviceApp.use(cors());
serviceApp.use(express.json());
serviceApp.use(router);
serviceApp.use(bookingRouter)// ✅ Serve static files correctly


serviceApp.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;

serviceApp.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});

serviceApp.get('/', (req, res) => {
    res.status(200).send("Server is running successfully");
});
