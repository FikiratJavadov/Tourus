const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");
const { setHeaderQuery } = require("../middleware/top3tours");

router.get("/", tourController.getAllTours);
router.get("/top-3", setHeaderQuery, tourController.getAllTours);
router.get("/:id", tourController.getOneTour);
router.post("/", tourController.createTour);

module.exports = router;
