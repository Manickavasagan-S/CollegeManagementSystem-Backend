const Admission = require("../Models/AdmissionModel");

// POST /api/admission — Submit admission form
const SubmitAdmission = async (req, res) => {
    try {
        const appNumber = "IET" + Date.now().toString().slice(-8);
        const admission = new Admission({ ...req.body, appNumber });
        await admission.save();
        res.status(200).json({ message: "Application submitted successfully", data: { appNumber } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/admission/all — Admin views all applications
const GetAllAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find({}).sort({ createdAt: -1 });
        res.status(200).json({ message: "Applications fetched", data: admissions });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// PUT /api/admission/:id — Admin updates status
const UpdateAdmissionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const admission = await Admission.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!admission) return res.status(404).json({ message: "Application not found" });
        res.status(200).json({ message: "Status updated", data: admission });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { SubmitAdmission, GetAllAdmissions, UpdateAdmissionStatus };
