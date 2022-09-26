const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/reviewControler");
const { privateRoute, access } = require("../middleware/privateRoute");

router.get("/", privateRoute, reviewController.getReviewsByTourId);
router.post("/", privateRoute, access("user"), reviewController.createReview);
router.delete(
  "/:id",
  privateRoute,
  access("admin", "user"),
  reviewController.deleteReview
);

module.exports = router;
