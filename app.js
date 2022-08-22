const express = require("express");
const fs = require("fs");
const cors = require("cors");

//! Initilizing the App:
const app = express();
app.use(express.json());

app.use(cors());

//!Get Dev data Tours:
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-data.json`));

//!Routes:

//! Get All tours
app.get("/api/v1/tours", (req, res) => {
  res.json({
    success: true,
    quantity: tours.length,
    data: {
      tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id;

  const oneTour = tours.find((t) => t.id == id);

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
});

app.post("/api/v1/tours", (req, res) => {
  const id = tours[tours.length - 1].id + 1;

  const newTour = { ...req.body, id: id };

  const newTours = [...tours, newTour];

  console.log(newTours);

  fs.writeFileSync("tours-data.json", JSON.stringify(newTours));

  res.status(201).json({
    success: true,
    data: {
      newTour,
    },
  });
});

//! Running the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running in PORT: ${PORT}`));
