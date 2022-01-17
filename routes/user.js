const express = require("express"); 
const router = express.Router();

const userctrl = require("../controllers/user");

router.post("/signup", userctrl.signup)
router.post("/login", userctrl.login)

module.exports = router;
