const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({ success: false, message: error });
  }
};

exports.getOneTour = async (req, res) => {
  try {
    const id = req.params.id;

    const oneTour = await Tour.findById(id);

    if (!oneTour)
      return res.status(404).json({
        success: false,
        message: "Invalid ID",
      });

    res.status(200).json({
      success: true,
      data: {
        tour: oneTour,
      },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error });
  }
};

exports.getStatistics = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
