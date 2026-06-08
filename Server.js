const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000,()=>{
    console.log("Port is running on 5000");

});

const UserRoutes = require("./Routers/UserRoutes")
app.use("/api/user", UserRoutes);

const MarkRoutes = require("./Routers/MarkRoutes")
app.use("/api/mark", MarkRoutes);

const FeeRoutes = require("./Routers/FeeRoutes")
app.use("/api/fee", FeeRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("MongoDB Connected Successfully")
    })
    .catch((err)=>{
        console.log("MongoDB Connection Error :" ,err)
    })