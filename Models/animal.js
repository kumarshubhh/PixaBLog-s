const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review");



const animalSchema = new Schema({
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
        ]
})

animalSchema.post("findOneAndDelete", async (listing) =>{

if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}})
}

    
})


const Animal = mongoose.model("Animal", animalSchema)
module.exports = Animal;