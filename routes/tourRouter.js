const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");
const { setHeaderQuery } = require("../middleware/top3tours");
const { privateRoute, access } = require("../middleware/privateRoute");

router.get("/", tourController.getAllTours);
router.get("/statistics", tourController.getStatistics);
router.get("/tour-stats/:year", tourController.getTourStats);
router.get("/top-3", setHeaderQuery, tourController.getAllTours);
router.get("/:id", tourController.getOneTour);
router.post("/", privateRoute, tourController.createTour);
router.patch(
  "/:id",
  privateRoute,
  access("admin", "guide"),
  tourController.updateTour
);
router.delete("/:id", privateRoute, access("admin"), tourController.deleteTour);

module.exports = router;
