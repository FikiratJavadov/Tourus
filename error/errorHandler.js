const GlobalError = require("../error/GlobalError");

function sendDevError(err, req, res, statusCode) {
  res.status(statusCode).json({
    message: err.message,
    error: err,
    code: statusCode,
    stack: err.stack,
  });
}
function sendProdError(err, req, res) {
  if (err.Operational) {
    res.json({
      success: false,
      message: err.message,
    });
  } else {
    res.json({
      success: false,
      message: "Ops! Something went wrong...",
    });
  }
}

const handlerDuplicateError = (err) => {
  return new GlobalError("This value must be unique!", 400);
};
const handlerCastError = (err) => {
  return new GlobalError("Id must be Object id type!", 400);
};

const handleValidationError = (err) => {
  let er = "";
  Object.values(err.errors).forEach((e) => {
    er += e.message;
  });

  return new GlobalError(er);

  // console.log(values);
};

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, req, res, statusCode);
  } else if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) {
      err = handlerDuplicateError(err);
    } else if (err.name === "CastError") {
      err = handlerCastError(err);
    } else if (err.name === "ValidationError") {
      err = handleValidationError(err);
    }
    sendProdError(err, req, res);
  }
};
