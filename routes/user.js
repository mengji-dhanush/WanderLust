const express=require('express');
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport=require("passport");
const { isLoggedIn, saveRedirectUrl } = require('../middlewares.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","new user registered successfully");
    res.redirect("/listings");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
    req.flash("success","successfully logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    console.log(req.user);
    res.redirect(redirectUrl);
});

router.get("/logout",isLoggedIn,(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","successfully logged out");
        res.redirect("/listings");
    })
})

module.exports=router;