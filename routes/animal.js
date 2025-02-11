const express = require("express")
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema,reviewSchema} = require("../schema.js")
const Animal = require("../Models/animal")


const validateListing = (req, res, next) =>{
    const { error } = listingSchema.validate(req.body, { abortEarly: false });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next(); // Move to the next middleware or route
    }
};



  // Animals index route 
  router.get("/" , wrapAsync(async(req, res) =>{
    const AllEarths =  await Animal.find({});
    res.render("./listings/Animal.ejs", {AllEarths})
   }));



// Show Routes animals

router.get("/:id",wrapAsync( async(req, res)=>{
    let {id} = req.params;
    const listing = await Animal.findById(id).populate({ path:"reviews", populate:{path:"author"}});;
    res.render("./listings/AnimalShow.ejs", {listing})
}));


module.exports= router;
