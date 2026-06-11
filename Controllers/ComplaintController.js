const Complaint = require("../Models/ComplaintModel");
const mongoose = require("mongoose");

// POST /api/complaint — Student raises a complaint
const RaiseComplaint = async (req, res) => {
    try {
        const { userEmail, userName, title, description, category } = req.body;
        if (!userEmail || !userName || !title || !description)
            return res.status(400).json({ message: "All fields are required" });

        if (mongoose.connection.readyState !== 1)
            return res.status(503).json({ message: "Database not connected. Please try again later." });

        const complaint = new Complaint({ userEmail, userName, title, description, category });
        await complaint.save();
        res.status(200).json({ message: "Complaint submitted successfully", data: complaint });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/complaint?email= — Student views their complaints
const GetMyComplaints = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const complaints = await Complaint.find({
            userEmail: { $regex: new RegExp(`^${email.trim()}$`, "i") }
        }).sort({ createdAt: -1 });

        res.status(200).json({ message: "Complaints fetched", data: complaints });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/complaint/all — Admin views all complaints
const GetAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).sort({ createdAt: -1 });
        res.status(200).json({ message: "All complaints fetched", data: complaints });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// PUT /api/complaint/:id — Admin updates status and note
const UpdateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { status, adminNote, updatedAt: new Date() },
            { new: true }
        );

        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        res.status(200).json({ message: "Complaint updated", data: complaint });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { RaiseComplaint, GetMyComplaints, GetAllComplaints, UpdateComplaint };
