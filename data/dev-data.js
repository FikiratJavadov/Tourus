const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: `${__dirname}/../config.env` });
const fs = require("fs");
const Tour = require("../model/tour");

const app = express();

console.log()

//!MongoDB connection
const PORT = process.env.PORT || 5000;

const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
  if (err) return console.log(err);


  //! Error check it out!
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/../tours-data.json`));

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
