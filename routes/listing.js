const express = require("express")
const router = express.Router();
const path = require('path');

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema,reviewSchema} = require("../schema.js")
const Listing = require("../Models/listing");
const {isLoggedIn, isOwner} = require("../middleware")




const validateListing = (req, res, next) =>{
    const { error } = listingSchema.validate(req.body, { abortEarly: false });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next(); // Move to the next middleware or route
    }
};






// Route to fetch listings based on category
router.get("/api/category/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const listings = await Listing.find({ category: category });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching listings", error });
    }
});




router.get("/category/:category", async (req, res) => {
    const category = req.params.category;
    const listings = await Listing.find({ category: category });
    res.render("./listings/category", { listings, category });
});









// Search route
// Search route
router.get("/search",wrapAsync( async (req, res) => {
    const query = req.query.query; // Get the query from the search form

    if (!query) {
        return res.redirect("/listings"); // If no query, redirect to the homepage
    }

    try {
        // Search for listings that match the query (case-insensitive search)
        const results = await Listing.find({
            title: { $regex: query, $options: "i" } // Regex search, case insensitive
        });

        // Render search.ejs with the results and the search query
        res.render("./listings/search.ejs", {
            results: results, 
            query: query
        });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));









// index route
router.get("/" ,wrapAsync( async(req, res) =>{
    const AllListings =  await Listing.find({});
    res.render("./listings/index.ejs", {AllListings})
   }));

   // new route

   router.get("/new", isLoggedIn, wrapAsync( (req, res) =>{
    
    res.render("./listings/new.ejs")
}));




// show rote
router.get("/:id",wrapAsync( async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Blog's you requested for does not Exist!")
        res.redirect("/listings")
    }
    res.render("./listings/show.ejs", {listing})
}));


// create route 
router.post("/",  isLoggedIn, validateListing,
    wrapAsync( async(req, res, next) =>{
 
    
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Your Blog's are Post!")
    res.redirect("/listings")
 
    
  }))
 
 
 // edit route
 
 router.get("/:id/edit" ,isOwner,  isLoggedIn, wrapAsync(async(req, res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Blog's you requested for does not Exist!")
        res.redirect("/listings")
    }
     res.render("./listings/edit.ejs", {listing})
 
 } ))
 
 // update route
 router.put("/:id",isLoggedIn,isOwner,
     validateListing,
     wrapAsync( async(req, res)=>{
     let {id} = req.params;



     await Listing.findByIdAndUpdate(id, {...req.body.listing})
     req.flash("success", "Your Blog's are Updated!")
     res.redirect(`/listings/${id}`)
 }));
 
 router.delete("/:id", isLoggedIn,isOwner, wrapAsync( async(req, res)=>{
     let {id} = req.params;
     await Listing.findByIdAndDelete(id )
     req.flash("success", "Your Blog's are Deleted!")
     res.redirect(`/listings`)
 }));


 module.exports = router;