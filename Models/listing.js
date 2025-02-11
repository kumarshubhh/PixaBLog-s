const mongoose = require("mongoose");
const Review = require("./Review");
const { ref } = require("joi");
const Schema = mongoose.Schema;
const User = require("./user")



const listingSchema = new Schema({
    title : {
        type:String,
        required: true
    },
    description : String,
    image : {
        type:String,
        default:"https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455_640.jpg",
        set: (v) =>v ==="" ? "https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455_640.jpg":v,

    } ,
    location:String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref:User,
    },

category:{
    type:String ,
    enum:["mountains", "Desert", "Farms", "Animal", "Trees" ,"water"]
}


})

listingSchema.post("findOneAndDelete", async (listing) =>{

if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}})
}

    
})


const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;