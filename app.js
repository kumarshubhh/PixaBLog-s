
require('dotenv').config();
const MongoStore = require("connect-mongo")
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./Models/listing");
const Earth = require("./Models/Earth.js");
const Animal = require("./Models/animal")
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./Models/Review.js");

const listing = require("./routes/listing.js")
const earth = require("./routes/earth.js")
const animal = require("./routes/animal")
const review = require("./routes/review")
const animalreview = require("./routes/animalReview")
const earthReview = require("./routes/earthReview")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./Models/user.js")
const userRouter = require("./routes/user.js")



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


const dbUrl = process.env.ATLASDB_URL;

main().then(() =>{
    console.log(" connected to db ")
}).catch(err => console.log(err));

async function main() {
 // await mongoose.connect('mongodb://127.0.0.1:27017/Shoping');
 await mongoose.connect(dbUrl)

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use(express.urlencoded({extended:true}))




const validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next(); // Move to the next middleware or route
    }
};
    
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter : 24 *3600,
}
)



const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,


    }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) =>{
   
    res.locals.success= req.flash("success" )
    res.locals.error= req.flash("error")
    res.locals.currUser = req.user;
    next();
})









 

app.use("/listings", listing)
app.use("/earths", earth)
app.use("/Animals", animal)
app.use("/listings/:id/reviews", review)
app.use("/Animals/:id/reviews", animalreview)
app.use("/earths/:id/reviews", earthReview)
app.use("/", userRouter)




app.all("*", (req, res, next)=>{
    res.sendFile(path.join(__dirname, "/public/index.ejs"));
})



app.use((err, req, res, next) =>{
    let {statusCode=500, message="something went Wromg!"} =err;
    res.status(statusCode).render("./listings/error.ejs", {message})
   
   
}) 

app.listen(8080, () =>{
    console.log(" listining tthe port")
})