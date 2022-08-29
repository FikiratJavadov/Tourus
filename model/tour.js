const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour nume must be defined!"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Tour price must be defined!"],
    },
    duration: {
      type: Number,
      required: [true, "Tour duration must be defined!"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour group size must be defined!"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour difficulty must be defined!"],
      enum: ["easy", "medium", "difficult"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      required: [true, "Tour summary must be defined!"],
    },

    slug: String,
    status: {
      type: Number,
      enum: [0, 1],
    },

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
//   return this.duration / 7
// });

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
tourSchema.pre(/^find/, function (next) {
  this.find({ status: 0 });
  next();
});

//Aggregation middleware
tourSchema.pre("aggregate", function (next) {
  const pipelines = this.pipeline();
  pipelines.unshift({$match:{status: {$exists: false}}})
  next();
});

const Tour = mongoose.model("tour", tourSchema);

module.exports = Tour;
