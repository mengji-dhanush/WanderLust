const { listingSchema, reviewSchema } = require("../JoiSchema.js");
const Review = require("../models/review.js");
const Listings = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let allListings = await Listings.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.newListing = async (req, res, next) => {
  // let {title,description,price,location,country}=req.body;
  // console.log(req.body);
  const url = req.file.path;
  const filename = req.file.filename;
  let newListing = await new Listings(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new listing added successfully");
  res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  if (!listing) {
    req.flash("error", "this listing does not exist");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "upload",
    "upload/w_200,e_blur:100"
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "this listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listings edited successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listings.findByIdAndDelete(id);
  req.flash("success", "listing deleted successfully");
  res.redirect("/listings");
};
