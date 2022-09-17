const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const ejsMate = require("ejs-mate");
var methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("ERROR!");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/campgrounds", async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index", { camps });
});

//new camp route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const newCampground = new Campground(req.body.campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

//show detail route
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  res.render("campgrounds/show", { camp });
});

//edit route
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  res.render("campgrounds/edit", { camp });
});

//edit put route
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
  res.redirect(`/campgrounds/${id}`);
});

//delete route
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("port 3000");
});
