const Post = require("../models/postModel");
const { ObjectId } = require("mongodb");
const config = require('../config/config');
const nodemailer = require('nodemailer');

const sendCommentMail = async(name,email,post_id)=>{

  try {

    const transport = nodemailer.createTransport({
      host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }

    });

    const mailOptions = {
      from:'BMS',
      to:email,
      subject:'Reply to an blog comment',
      html:'<p> Hii! '+name+',has replied on your comment <a href ="http://127.0.0.1:8800/post/'+post_id+'"> Read your replies from here. <a/> </p>'   
    }
    transport.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sended:-", info.response);
            }

        });
    
  } catch (error) {
    console.log(error.message);
    
  }

}




const loadBlog = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("blog", { posts: posts });
  } catch (error) {
    console.log(error.message);
  }
};

const loadPost = async(req,res)=>{
  try {

   const post = await Post.findOne({ "_id":req.params.id });

   res.render('post',{post:post});
    
  } catch (error) {
    console.log(error.message);
    
  }
};

const addComment = async(req,res)=>{

  try {

    var post_id = req.body.post_id;
    var username = req.body.username;
    var email =  req.body.email;
    var comment = req.body.comment;


    var comment_id = new  ObjectId();
 
    
    await Post.findByIdAndUpdate({ _id:post_id},{
      $push:{
        "comments":{_id:comment_id, username:username,email:email, comment:comment }
        
      }
    });
    
    
    res.status(200).send({success:true,msg:'Comment Added Successfully!', _id:comment_id });

    
    



  } catch (error) {
    res.status(200).send({success:false,msg:error.message });
    
  }

  
  
}

const doReply = async(req,res)=>{

  try {

     const reply_id = new ObjectId();
    //  console.log(reply_id);
    
     await Post.updateOne({

      "_id": new ObjectId(req.body.post_id),
      "comments._id": new  ObjectId (req.body.comment_id)

     },
     {  

      $push:{
        "comments.$.replies":{ _id:reply_id, name:req.body.name, reply:req.body.reply }
      }

     });

     sendCommentMail(req.body.name, req.body.comment_email, req.body.post_id);

     res.status(200).send({success:true,msg:'Reply Added!',_id:reply_id  });

    
  } catch (error) {
    res.status(200).send({success:false,msg:error.message });
    
  }
}


module.exports = {
  loadBlog,
  loadPost,
  addComment,
  doReply
}
