const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");
const { setHeaderQuery } = require("../middleware/top3tours");
const { privateRoute } = require("../middleware/privateRoute");

router.get("/", privateRoute, tourController.getAllTours);
router.get("/statistics", tourController.getStatistics);
router.get("/tour-stats/:year", tourController.getTourStats);
router.get("/top-3", setHeaderQuery, tourController.getAllTours);
router.get("/:id", tourController.getOneTour);
router.post("/", tourController.createTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;
