const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''

    }, 

    comments:{
        type:Object,
        default:{}
    }

});

module.exports = mongoose.model('Post',postSchema);