const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "College Management Backend Server", 
        status: "Running",
        timestamp: new Date().toISOString()
    });
});

// Routes
const UserRoutes = require("./Routers/UserRoutes")
app.use("/api/user", UserRoutes);

const MarkRoutes = require("./Routers/MarkRoutes")
app.use("/api/mark", MarkRoutes);

const FeeRoutes = require("./Routers/FeeRoutes")
app.use("/api/fee", FeeRoutes);

const ComplaintRoutes = require("./Routers/ComplaintRoutes")
app.use("/api/complaint", ComplaintRoutes);

const AdmissionRoutes = require("./Routers/AdmissionRoutes")
app.use("/api/admission", AdmissionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Start server first
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// MongoDB connection (attempt but don't crash on failure)
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log(" MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log(" MongoDB Connection Error:", err.message);

    });

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(() => {
            console.log(' MongoDB connection closed');
            process.exit(0);
        });
    });
});