const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { privateRoute } = require("../middleware/privateRoute");

router.post("/checkout/:tourId", privateRoute, bookingController.checkout);
router.post("/", privateRoute, bookingController.checkout);

module.exports = router;
