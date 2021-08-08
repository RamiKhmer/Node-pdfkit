const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.get("/",adminController.getIndex);
router.get("/report", adminController.getReport);

module.exports = router;