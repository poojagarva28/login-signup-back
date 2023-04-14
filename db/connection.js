const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb://localhost:27017/users")
.then(res=>{
    console.log("connected successfully")
})
.catch(err=>{
    console.log(err,"not connected")
})






