const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    userName:  { type: String, required: true },
    title:     { type: String, required: true },
    description: { type: String, required: true },
    category:  { type: String, enum: ["academic", "fees", "facility", "staff", "other"], default: "other" },
    status:    { type: String, enum: ["pending", "in-progress", "resolved", "rejected"], default: "pending" },
    adminNote: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
