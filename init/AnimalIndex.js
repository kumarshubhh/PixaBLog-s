const mongoose = require("mongoose");
const initdata = require("./AnimalData.js")
const Animal = require("../Models/animal.js")


main().then(() =>{
    console.log(" connected to db ")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Shoping');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};;

const initdb = async () =>{
   
    await Animal.insertMany(initdata.data)
    console.log("data Was Initialized")
}

initdb();
