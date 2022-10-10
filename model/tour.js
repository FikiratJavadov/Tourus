const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour name must be defined!"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Tour price must be defined!"],
    },
    discount: {
      type: Number,

      validate: {
        validator: function (doc) {
          return this.price > doc;
        },
        message: `Discount of ({VALUE}) must not exceed the price`,
      },
    },
    duration: {
      type: Number,
      required: [true, "Tour duration must be defined!"],
    },

    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    maxGroupSize: {
      type: Number,
      required: [true, "Tour group size must be defined!"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour difficulty must be defined!"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty can only be: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Tour rating must be at least 1"],
      max: [5, "Tour rating must not exceed 5"],
    },

    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [],
        address: String,
        description: String,
        day: Number,
      },
    ],

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      required: [true, "Tour summary must be defined!"],
    },

    slug: String,
    description: {
      type: String,
    },

    imageCover: {
      type: String,
      required: [true, "Tour image cover must be defined!"],
    },

    images: {
      type: [String],
    },

    startDates: {
      type: [Date],
      required: [true, "Tour dates must be defined!"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//Virtual fields: Create
// tourSchema.virtual("weeks").get(function () {
//   return this.duration / 7;
// });

//Tour A

tourSchema.virtual("reviews", {
  ref: "review",
  foreignField: "tour",
  localField: "_id",
});



//Document base middleware - Before create/after create
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  next();
});

// tourSchema.post("save", function (doc, next) {
//   this.slug = slugify(this.name, "-");
//   next();
// });

//Query based middlware
// tourSchema.pre(/^find/, function (next) {
//   this.find({ status: 0 });
//   next();
// });

//Aggregation middleware
// tourSchema.pre("aggregate", function (next) {
//   const pipelines = this.pipeline();
//   pipelines.unshift({$match:{status: {$exists: false}}})
//   next();
// });

const Tour = mongoose.model("tour", tourSchema);

module.exports = Tour;
