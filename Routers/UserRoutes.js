const express = require("express");
const router = express.Router();
const { SignupUser, LoginUser, GetAllUsers, SendOtp, ResetPassword } = require("../Controllers/UserController");

router.post("/signup", SignupUser);
router.get("/login", LoginUser);
router.get("/all", GetAllUsers);
router.post("/send-otp", SendOtp);
router.post("/reset-password", ResetPassword);

module.exports = router;
