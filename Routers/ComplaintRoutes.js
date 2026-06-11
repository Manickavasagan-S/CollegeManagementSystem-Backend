const express = require("express");
const router = express.Router();
const { RaiseComplaint, GetMyComplaints, GetAllComplaints, UpdateComplaint } = require("../Controllers/ComplaintController");

router.post("/", RaiseComplaint);
router.get("/", GetMyComplaints);
router.get("/all", GetAllComplaints);
router.put("/:id", UpdateComplaint);

module.exports = router;
