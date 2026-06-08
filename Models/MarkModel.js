const mongoose = require("mongoose");

const MarkSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    subjects: [
        {
            subject: { type: String, required: true },
            score: { type: Number, required: true, min: 0, max: 100 },
            status: { type: String, enum: ["pass", "fail"], required: true },
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Mark", MarkSchema);
