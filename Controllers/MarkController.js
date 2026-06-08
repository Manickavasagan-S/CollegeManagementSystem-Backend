const Mark = require("../Models/MarkModel");

// POST /api/mark — Save or update marks for a student
const SaveMarks = async (req, res) => {
    try {
        const { email, subjects } = req.body;

        if (!email || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: "Email and subjects are required" });
        }

        for (const s of subjects) {
            if (s.score < 0 || s.score > 100) {
                return res.status(400).json({
                    message: `Score for ${s.subject} must be between 0 and 100`,
                });
            }
        }

        const subjectsWithStatus = subjects.map(s => ({
            subject: s.subject,
            score: Number(s.score),
            status: Number(s.score) >= 45 ? "pass" : "fail",
        }));

        let markRecord = await Mark.findOne({
            userEmail: { $regex: new RegExp(`^${email.trim()}$`, "i") }
        });

        if (markRecord) {
            subjectsWithStatus.forEach(ns => {
                const idx = markRecord.subjects.findIndex(s => s.subject === ns.subject);
                if (idx !== -1) {
                    markRecord.subjects[idx] = ns;
                } else {
                    markRecord.subjects.push(ns);
                }
            });
            markRecord.updatedAt = new Date();
            await markRecord.save();
        } else {
            markRecord = new Mark({
                userEmail: email.trim().toLowerCase(),
                subjects: subjectsWithStatus,
            });
            await markRecord.save();
        }

        res.status(200).json({
            message: "Marks saved successfully",
            data: markRecord.subjects,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/mark?email= — Get marks for a student
const GetMarks = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const markRecord = await Mark.findOne({
            userEmail: { $regex: new RegExp(`^${email.trim()}$`, "i") }
        });

        if (!markRecord) {
            return res.status(200).json({ message: "No marks found", data: [] });
        }

        res.status(200).json({
            message: "Marks fetched successfully",
            data: markRecord.subjects,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { SaveMarks, GetMarks };
