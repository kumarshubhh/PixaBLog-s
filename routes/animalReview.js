const express = require("express");
const { route } = require("./animal");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema,reviewSchema} = require("../schema.js")
const Review = require("../Models/Review.js");
const Listing = require("../Models/listing");
const Earth = require("../Models/Earth.js");
const Animal = require("../Models/animal");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


const validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next(); // Move to the next middleware or route
    }
};



// animal

router.post("/", validateReview, isLoggedIn, wrapAsync( async(req,res) =>{
    let listing = await Animal.findById(req.params.id)
   
    let newReview  = new Review(req.body.review)
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    

    await newReview.save();
    await listing.save();
    req.flash("success", "Your Review's are Created!")
   
    res.redirect(`/Animals/${listing._id}`)
 }));


 router.delete(
    "/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync( async(req, res) =>{
        let {id, reviewId} = req.params;

        await Animal.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId)
        req.flash("success", "Your Review's are Deleted!")
        res.redirect(`/Animals/${id}`)
    })
 )


 module.exports = router;