const mongoose = require("mongoose");
const initdata = require("./data")
const Listing = require("../Models/listing")


main().then(() =>{
    console.log(" connected to db ")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Shoping');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};;


const initdb = async () =>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({ ...obj, owner:"67a70e96c27047eca1adf426"}))
    await Listing.insertMany(initdata.data)
    console.log("data Was Initialized")
}

initdb();
