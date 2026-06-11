const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
    firstName:      { type: String, required: true },
    lastName:       { type: String, required: true },
    dob:            { type: String, required: true },
    gender:         { type: String, required: true },
    category:       { type: String, required: true },
    phone:          { type: String, required: true },
    email:          { type: String, required: true },
    address:        { type: String, required: true },
    city:           { type: String, required: true },
    state:          { type: String, required: true },
    pincode:        { type: String, required: true },
    tenthBoard:     { type: String, required: true },
    tenthYear:      { type: String, required: true },
    tenthPercent:   { type: String, required: true },
    twelfthBoard:   { type: String, required: true },
    twelfthYear:    { type: String, required: true },
    twelfthPercent: { type: String, required: true },
    twelfthStream:  { type: String, required: true },
    entranceExam:   { type: String, default: "" },
    entranceScore:  { type: String, default: "" },
    programme:      { type: String, required: true },
    preferredBatch: { type: String, required: true },
    howDidYouHear:  { type: String, default: "" },
    appNumber:      { type: String, required: true },
    status:         { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
    createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admission", AdmissionSchema);
