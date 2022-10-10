const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController");
const reviewController = require("../controller/reviewControler");
const { setHeaderQuery } = require("../middleware/top3tours");
const { privateRoute, access } = require("../middleware/privateRoute");
const reviewRoute = require("./reviewRoute");

router.use("/:tourId/reviews", reviewRoute);

router.get("/", tourController.getAllTours);
router.get("/statistics", tourController.getStatistics);
router.get(
  "/tour-stats/:year",
  privateRoute,
  access("lead-guide", "guide"),
  tourController.getTourStats
);
router.get("/top-3", setHeaderQuery, tourController.getAllTours);
router.get("/:id", tourController.getOneTour);

//!Here

router.use(privateRoute);
router.use(access("admin"));

router.post("/", tourController.createTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

// router.get(
//   "/:tourId/reviews",
//   privateRoute,
//   reviewController.getReviewsByTourId
// );

module.exports = router;
