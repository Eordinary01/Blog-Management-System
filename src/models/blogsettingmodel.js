const mongoose = require("mongoose");

 const blogsettingSchema= mongoose.Schema({

    blog_Title:{
        type:String,
        required:true
    },
    blog_Logo:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model('BlogSetting',blogsettingSchema);