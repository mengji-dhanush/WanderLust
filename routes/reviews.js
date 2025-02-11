const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listings=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middlewares.js");

router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listings.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.review.push(newReview);
    await listing.save()
    await newReview.save();
    req.flash("success","new review added successfully");
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`)
}));

module.exports=router;