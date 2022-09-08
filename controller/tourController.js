const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");
const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");

exports.getAllTours = asyncCatch(async (req, res, next) => {
  let allTours = new GlobalFilter(Tour.find(), req.query);
  allTours.filter().sort().fields().paginate();

  const tours = await allTours.query;

  res.json({
    success: true,
    quantity: tours.length,
    data: {
      tours,
    },
  });
  // catch (error) {
  //   res.status(404).json({ success: false, message: error });
  // }
});

exports.getOneTour = asyncCatch(async (req, res, next) => {
  const id = req.params.id;

  const oneTour = await Tour.findById(id);

  if (!oneTour) return next(new GlobalError("Invalid Id: FINDONE", 404));

  res.status(200).json({
    success: true,
    data: {
      tour: oneTour,
    },
  });
});

exports.updateTour = asyncCatch(async (req, res, next) => {
  const id = req.params.id;

  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedTour) return next(new GlobalError("Invalid Id: UPDATE", 404));

  res.status(200).json({
    success: true,
    data: {
      updatedTour,
    },
  });
});

exports.deleteTour = asyncCatch(async (req, res, next) => {
  const id = req.params.id;

  const deleted = await Tour.findByIdAndRemove(id);

  if (!deleted) return next(new GlobalError("Invalid Id: DELETE", 404));

  res.status(200).json({
    success: true,
    message: "deleted",
  });
});

exports.createTour = asyncCatch(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      newTour,
    },
  });
});

exports.getStatistics = asyncCatch(async (req, res, next) => {
  const statistics = await Tour.aggregate([
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        avgRating: { $avg: "$ratingsAverage" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
        ratingSum: { $sum: "$ratingsAverage" },
        totalRatingCount: { $sum: 1 },
      },
    },

    {
      $sort: {
        avgRating: 1,
      },
    },
  ]);

  res.status(200).json({ success: true, data: { statistics } });
});

exports.getTourStats = asyncCatch(async (req, res) => {
  const year = parseInt(req.params.year);

  const data = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: "$startDates" },
        count: { $sum: 1 },
        groups: { $push: "$name" },
      },
    },

    {
      $addFields: { month: "$_id" },
    },

    { $project: { _id: 0 } },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({ success: true, data: { data } });
});


