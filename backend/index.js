const dotenv=require('dotenv');
dotenv.config();
const express = require('express');
const cors = require("cors");
const rootRouter = require("./routes/index");
const PORT= process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin:"*"
}));

app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => console.log("Backend server is running on port 3000"));