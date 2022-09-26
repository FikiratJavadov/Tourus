const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const Review = require("../model/review");
const { deleteOne } = require("../utils/factory");

exports.getAllReviews = asyncCatch(async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({ success: true, reviews });
});

exports.getReviewsByTourId = asyncCatch(async (req, res) => {
  const tourId = req.params.tourId;

  const review = await Review.find({ tour: tourId });

  res.status(200).json({ success: true, review });
});

exports.createReview = asyncCatch(async (req, res) => {
  const review = await Review.create({
    ...req.body,
    tour: req.params.tourId,
    creator: req.user._id,
  });

  res.status(200).json({ success: true, review });
});

exports.deleteReview = deleteOne(Review);
