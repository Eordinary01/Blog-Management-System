const mongoose = require ("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/BMS");




const express = require("express");
const app = express();

var http = require('http').createServer(app);
var {Server} = require('socket.io');
var io = new Server(http,{});



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


io.on("connection",function(socket){
    // console.log("User Connected!!");

    socket.on("new_post", function(formData){
        // console.log(formData);
        socket.broadcast.emit("new_post",formData);

    });

    socket.on("new_comment",function(comment){
        io.emit("new_comment",comment);

    });

    socket.on("new_reply", function(reply){
        io.emit("new_reply",reply);
    });

    socket.on("delete_post", function(postId){
        socket.broadcast.emit("delete_post", postId);
    });

});



http.listen(8800, function(){
    console.log("Server is running");
});


// app.listen(8800, function(){
//     console.log("Server is running");
// });