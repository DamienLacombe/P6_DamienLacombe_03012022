const express = require("express");
const sauceCtrl = require("../controllers/sauce");
const auth = require("../midllewares/auth");
const multer = require("../midllewares/multer-config");
const sauce = require("../models/sauce");

const router = express.Router();

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce)
router.delete("/:id", auth, sauceCtrl.deleteSauce)
router.post("/:id/like", auth, sauceCtrl.like)

module.exports = router;
