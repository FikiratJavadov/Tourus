const { asyncCatch } = require("./asyncCatch");
const GlobalError = require("../error/GlobalError");

const deleteOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;

    let deleted;

    if (req.user.role === "admin") {
      deleted = await Model.findOneAndDelete({
        _id: id,
      });
    } else {
      deleted = await Model.findOneAndDelete({
        _id: id,
        creator: req.user._id,
      });
    }

    if (!deleted) return next(new GlobalError("Invalid Id: DELETE", 404));
    res.status(200).json({
      success: true,
      message: "deleted",
    });
  });

module.exports = { deleteOne };


//https/localhots/5000/nextPage?page=1&limit=20
//10
//skip 10 => 10