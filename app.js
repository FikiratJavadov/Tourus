const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const errorHandler = require("./error/errorHandler");
const GlobalError = require("./error/GlobalError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

var bodyParser = require("body-parser");

// Put these statements before you define any routes.

const toursRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRoute = require("./routes/reviewRoute");
const bookingRoute = require("./routes/bookingRoute");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Rate limit of 100 is finished",
});

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(helmet());

//!Set limit
app.use(limiter);

//!Routes
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

app.use((req, res, next) => {
  const message = new GlobalError(`The ${req.originalUrl} does not exist`);
  next(message);
});

console.log("run!!");

app.use(errorHandler);

//!MongoDB connection
const PORT = process.env.PORT || 5000;
const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
  if (err) return console.log(err);

  console.log("MongoDb connected");

  app.listen(PORT, () => console.log(`Server running in PORT: ${PORT}`));
});

//! Running the server
