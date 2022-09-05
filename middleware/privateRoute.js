const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { asyncCatch } = require("../utils/asyncCatch");

const privateRoute = asyncCatch(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new GlobalError("Please provide a token!"));

  const verifiPromise = promisify(jwt.verify);

  const user = await verifiPromise(token, process.env.JWT_SIGNATURE);

  next();
});

module.exports = { privateRoute };
