const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createAlert, getMyAlerts, checkAlerts} = require("../controllers/alertController");

router.post("/", authMiddleware, createAlert);
router.get("/check", authMiddleware, checkAlerts);
router.get("/", authMiddleware, getMyAlerts);

module.exports = router;