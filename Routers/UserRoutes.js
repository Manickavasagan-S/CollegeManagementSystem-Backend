const express = require("express");
const router = express.Router();
const { SignupUser, LoginUser, GetAllUsers } = require("../Controllers/UserController");

router.post("/signup", SignupUser);
router.get("/login", LoginUser);
router.get("/all", GetAllUsers);

module.exports = router;
