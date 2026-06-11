const express = require("express");
const router = express.Router();
const { SubmitAdmission, GetAllAdmissions, UpdateAdmissionStatus } = require("../Controllers/AdmissionController");

router.post("/", SubmitAdmission);
router.get("/all", GetAllAdmissions);
router.put("/:id", UpdateAdmissionStatus);

module.exports = router;
