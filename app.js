const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const session=require('express-session');
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const sessionOptions={
    secret:"dandyroxwithanx",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        HttpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

main()
.then(()=>{console.log("connected to db")})
.catch(err => console.log(err));

app.get("/",wrapAsync((req,res)=>{
    res.send("ok working");
}));

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    console.log(err);
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,(req,res)=>{
    console.log("started listening on port 8080");
});