const mongoose=require('mongoose');

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:{type:String},
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1647792855184-af42f1720b91?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set:(v)=>(!v||v.trim()==='')?'https://images.unsplash.com/photo-1647792855184-af42f1720b91?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D':v
        },
    },
    price:{
        type:Number,
        min:0
    },
    location:String,
    country:String
});

const Listings=new mongoose.model("Listings",listingSchema);
module.exports=Listings;
