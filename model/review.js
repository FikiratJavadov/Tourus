const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const Tour = require("./tour");

const reviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for review"],
    },

    content: {
      type: String,
      required: [true, "Please provide a content for review"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tour",
    },
  },

  { timestamps: true, toJSON: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate("creator");
  next();
});

reviewSchema.statics.calcRatingsAverage = async function (tourId) {
  const data = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },

    {
      $group: {
        _id: "$tour",
        numberOfRating: { $sum: 1 },
        aveRating: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: data[0].aveRating,
    ratingsQuantity: data[0].numberOfRating,
  });
};

reviewSchema.post("save", function (doc) {
  doc.constructor.calcRatingsAverage(this.tour);
});

// reviewSchema.pre(/^findOneAnd/, function (next) {
//   this.rat = this.find();
//   next();
// });

reviewSchema.post(/^findOneAnd/, async function (doc) {
  console.log(doc);
  doc.constructor.calcRatingsAverage(doc.tour);
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
