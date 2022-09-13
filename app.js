const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("ERROR!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({ title: "westminster", description: "nice camp" });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("port 3000");
});
