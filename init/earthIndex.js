const mongoose = require("mongoose");
const initdata = require("./earthData")
const Earth = require("../Models/Earth.js")


main().then(() =>{
    console.log(" connected to db ")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Shoping');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};;

const initdb = async () =>{
   
    await Earth.insertMany(initdata.data)
    console.log("data Was Initialized")
}

initdb();
