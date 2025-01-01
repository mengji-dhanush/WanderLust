const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listings=require("./models/listing.js");
const path=require("path");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./JoiSchema.js");

app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

main()
.then(()=>{console.log("connected to db")})
.catch(err => console.log(err));

app.get("/",wrapAsync((req,res)=>{
    res.send("ok working");
}));

app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings=await Listings.find({});
    res.render("listings/index.ejs",{allListings});
}));

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    // let {title,description,price,location,country}=req.body;
    let newListing=await new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/edit/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listings.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listings.findById(id);
    res.render("listings/show.ejs",{listing});
}));

app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,(req,res)=>{
    console.log("started listening on port 8080");
});