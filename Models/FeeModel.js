const mongoose = require("mongoose");

const FeeItemSchema = new mongoose.Schema({
    feeName: { type: String, required: true },       // e.g. "Tuition Fee", "Hostel Fee"
    totalAmount: { type: Number, required: true },   // amount admin assigned
    amountPaid: { type: Number, default: 0 },        // cumulative amount paid so far
    status: {
        type: String,
        enum: ["pending", "partial", "paid"],
        default: "pending",
    },
    payments: [
        {
            amount: { type: Number, required: true },
            paidAt: { type: Date, default: Date.now },
        },
    ],
});

const FeeSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    fees: [FeeItemSchema],
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Fee", FeeSchema);
