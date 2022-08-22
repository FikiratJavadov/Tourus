const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../config.env" });
const fs = require("fs");
const Tour = require("../model/tour");

const app = express();

//!MongoDB connection
const PORT = process.env.PORT || 5000;

const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
  if (err) return console.log(err);

  const tours = JSON.parse(fs.readFileSync(`../tours-data.json`));

  async function importData() {
    try {
      await Tour.create(tours);
      console.log("Data impoted!");
    } catch (error) {
      console.log(error);
    }

    process.exit();
  }

  async function deleteData() {
    try {
      await Tour.deleteMany();
      console.log("Data deleted");
    } catch (error) {
      console.log(error);
    }

    process.exit();
  }

  if (process.argv[2] === "import") {
    importData();
  } else if (process.argv[2] === "delete") {
    deleteData();
  }
});
