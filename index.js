const mongoose = require ("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/BMS");


const express = require("express");
const app = express();

const IsBlog = require("./middlewares/IsBlog");
app.use(IsBlog.IsBlog);

// for admin routes
const adminRoute = require("./routes/adminRoute");
app.use('/',adminRoute);

// for user routes
const userRoute = require("./routes/userRoute");
app.use('/',userRoute);

// for blog routes
const blogRoute = require("./routes/blogRoute");
app.use('/',blogRoute);




app.listen(8800, function(){
    console.log("Server is running");
})