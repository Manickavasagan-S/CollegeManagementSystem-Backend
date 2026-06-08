const express = require("express");
const router = express.Router();
const { SaveMarks, GetMarks } = require("../Controllers/MarkController");

router.post("/", SaveMarks);
router.get("/", GetMarks);

module.exports = router;
