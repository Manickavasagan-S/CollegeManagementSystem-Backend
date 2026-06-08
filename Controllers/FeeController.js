const Fee = require("../Models/FeeModel");

// Helper — recompute status for a fee item
function computeStatus(item) {
    if (item.amountPaid <= 0) return "pending";
    if (item.amountPaid >= item.totalAmount) return "paid";
    return "partial";
}

// POST /api/fee/assign — Admin assigns / updates fee list for a student
// Body: { email, fees: [{ feeName, totalAmount }] }
const AssignFees = async (req, res) => {
    try {
        const { email, fees } = req.body;

        if (!email || !Array.isArray(fees) || fees.length === 0) {
            return res.status(400).json({ message: "Email and at least one fee are required" });
        }

        for (const f of fees) {
            if (!f.feeName || f.feeName.trim() === "") {
                return res.status(400).json({ message: "Each fee must have a name" });
            }
            if (f.totalAmount === undefined || Number(f.totalAmount) < 0) {
                return res.status(400).json({ message: "Each fee must have a valid amount" });
            }
        }

        let record = await Fee.findOne({
            userEmail: { $regex: new RegExp(`^${email.trim()}$`, "i") },
        });

        if (record) {
            // Merge: keep existing payment history for fees that still exist
            const updatedFees = fees.map((newFee) => {
                const existing = record.fees.find(
                    (ef) => ef.feeName.toLowerCase() === newFee.feeName.trim().toLowerCase()
                );
                if (existing) {
                    // Update total amount but keep payment history
                    existing.totalAmount = Number(newFee.totalAmount);
                    // Re-cap amountPaid to new totalAmount
                    if (existing.amountPaid > existing.totalAmount) {
                        existing.amountPaid = existing.totalAmount;
                    }
                    existing.status = computeStatus(existing);
                    return existing;
                }
                // Brand new fee item
                return {
                    feeName: newFee.feeName.trim(),
                    totalAmount: Number(newFee.totalAmount),
                    amountPaid: 0,
                    status: "pending",
                    payments: [],
                };
            });
            record.fees = updatedFees;
            record.updatedAt = new Date();
            await record.save();
        } else {
            record = new Fee({
                userEmail: email.trim().toLowerCase(),
                fees: fees.map((f) => ({
                    feeName: f.feeName.trim(),
                    totalAmount: Number(f.totalAmount),
                    amountPaid: 0,
                    status: "pending",
                    payments: [],
                })),
            });
            await record.save();
        }

        res.status(200).json({ message: "Fees assigned successfully", data: record });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// POST /api/fee/pay — User pays towards a specific fee
// Body: { email, feeName, amount }
const PayFee = async (req, res) => {
    try {
        const { email, feeName, amount } = req.body;

        if (!email || !feeName || amount === undefined) {
            return res.status(400).json({ message: "Email, feeName and amount are required" });
        }

        const payAmount = Number(amount);
        if (isNaN(payAmount) || payAmount <= 0) {
            return res.status(400).json({ message: "Payment amount must be a positive number" });
        }

        const record = await Fee.findOne({
            userEmail: { $regex: new RegExp(`^${email.trim()}$`, "i") },
        });

        if (!record) {
            return res.status(404).json({ message: "No fee record found for this student" });
        }

        const feeItem = record.fees.find(
            (f) => f.feeName.toLowerCase() === feeName.trim().toLowerCase()
        );

        if (!feeItem) {
            return res.status(404).json({ message: `Fee "${feeName}" not found` });
        }

        if (feeItem.status === "paid") {
            return res.status(400).json({ message: `"${feeName}" is already fully paid` });
        }

        const remaining = feeItem.totalAmount - feeItem.amountPaid;
        if (payAmount > remaining) {
            return res.status(400).json({
                message: `Payment exceeds remaining balance. Remaining: $${remaining.toFixed(2)}`,
            });
        }

        feeItem.amountPaid += payAmount;
        feeItem.payments.push({ amount: payAmount, paidAt: new Date() });
        feeItem.status = computeStatus(feeItem);
        record.updatedAt = new Date();

        await record.save();

        res.status(200).json({ message: "Payment successful", data: record });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/fee?email= — Get fee record for a student
const GetFee = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const record = await Fee.findOne({
            userEmail: { $regex: new RegExp(`^${email.trim()}$`, "i") },
        });

        if (!record) {
            return res.status(200).json({ message: "No fee record found", data: null });
        }

        res.status(200).json({ message: "Fee fetched successfully", data: record });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/fee/all — Get all fee records (admin)
const GetAllFees = async (req, res) => {
    try {
        const fees = await Fee.find({});
        res.status(200).json({ message: "Fees fetched", data: fees });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { AssignFees, PayFee, GetFee, GetAllFees };
