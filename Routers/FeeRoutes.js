const express = require("express");
const router = express.Router();
const { AssignFees, PayFee, GetFee, GetAllFees } = require("../Controllers/FeeController");

router.post("/assign", AssignFees);   // Admin assigns fees
router.post("/pay", PayFee);           // User pays a fee
router.get("/", GetFee);               // Get single student fees
router.get("/all", GetAllFees);        // Admin: all fee records

module.exports = router;
