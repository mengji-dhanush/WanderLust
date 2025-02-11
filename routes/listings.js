const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../JoiSchema.js");
const Review=require("../models/review.js");
const Listings=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middlewares.js");

router.get("/",wrapAsync(async (req,res)=>{
    let allListings=await Listings.find({});
    res.render("listings/index.ejs",{allListings});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    // let {title,description,price,location,country}=req.body;
    // console.log(req.body);
    let newListing=await new Listings(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","new listing added successfully");
    res.redirect("/listings");
}));

router.get("/edit/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listings.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listings.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","this listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listings edited successfully");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
}));

module.exports=router;