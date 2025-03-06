const mongoose=require('mongoose');
const Review=require("./review.js");
const { ref } = require('joi');

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        min:0
    },
    location:String,
    country:String,
    review:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    }   
})

const Listings=new mongoose.model("Listings",listingSchema);
module.exports=Listings;
