const BlogSetting = require("../models/blogsettingmodel");

const IsBlog = async(req,res,next)=>{
    try{
        const blogsetting = await BlogSetting.find({});
        

        if(blogsetting.length == 0 && req.originalUrl != "/blog-setup" ){
            res.redirect('/blog-setup');
        }
        else{
            next();
        }
    }catch(error){
        console.log(error.message);
    }
}
module.exports = {
    IsBlog
}