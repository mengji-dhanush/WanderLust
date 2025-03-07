const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Listings = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const upload = multer({ storage });

router.get(
  "/search",
  wrapAsync(async (req, res) => {
    let { query } = req.query;
    let queryListings = await Listings.find({
      title: { $regex: query, $options: "i" },
    });
    res.render("listings/index.ejs", { allListings: queryListings });
  })
);

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.newListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
