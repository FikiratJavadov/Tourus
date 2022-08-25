const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");

exports.getAllTours = async (req, res) => {
  try {
    let allTours = new GlobalFilter(Tour.find(), req.query);
    allTours
    .filter()
    .sort()
    .fields()
    .paginate();

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
