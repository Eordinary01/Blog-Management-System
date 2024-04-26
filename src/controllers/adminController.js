const BLOGSETTING = require('../models/blogsettingmodel');
const USER = require('../models/Usermodel');
const Post = require('../models/postModel');
const Setting = require('../models/settingModel');
const bcrypt = require('bcrypt');

const securepassword = async (password) => {
    try {

        var passwordhash = await bcrypt.hash(password, 10);

        return passwordhash

    } catch (error) {
        console.log(error.message);

    }
}





const blogSetup = async (req, res) => {
    try {

        var blogsetting = await BLOGSETTING.find({});

        if (blogsetting.length > 0) {
            res.redirect('/login');

        } else {

            res.render('blogsetup');

        }

    } catch (error) {
        console.log(error.message);

    }
}


const blogSetupSave = async (req, res) => {

    try {
        const blog_title = req.body.blog_title;
        const blog_image = req.file.filename;
        const description = req.body.description;
        const email = req.body.email;
        const name = req.body.name;
        const password = await securepassword(req.body.password);

        const blogSetting = new BLOGSETTING({
            blog_Title: blog_title,
            blog_Logo: blog_image,
            description: description,

        });
        await blogSetting.save();

        const user = new USER({
            name: name,
            email: email,
            password: password,
            is_admin: 1,

        });

        const userData = await user.save();
        if (userData) {
            res.redirect('/login');
        }
        else {
            res.render('blogSetup', { message: 'Blog not setuped!' })
        }


    } catch (error) {
        console.log(error.message);

    }

}

const dashboard = async (req, res) => {
    try {

        const allPosts = await Post.find({});
        res.render('admin/dashboard', { posts: allPosts });
    } catch (error) {
        console.log(error.message);

    }

}

const loadPostDashboard = async (req, res) => {
    try {

        res.render('admin/postDashboard');

    } catch (error) {
        consol.log(error.message);

    }
}

const addPost = async (req, res) => {
    try {

        var image = '';
        if (req.body.image !== undefined) {
            image = req.body.image;

        }


        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            image: image

        });

        const postData = await post.save();

        res.send({ success: true, msg: 'Post Added Successfully!!', _id: postData._id });

        // res.render('admin/postDashboard',{message:'Post added Successfully!'});

    } catch (error) {
        res.send({ success: false, msg: error.message });
        // console.log(error.message);


    }
}

const uploadPostImage = async (req, res) => {

    try {

        var imagePath = '/images';
        imagePath = imagePath + '/' + req.file.filename;

        res.send({ success: true, msg: 'Image Uploaded Successfully!', path: imagePath });

    } catch (error) {
        res.send({ success: false, msg: error.message });


    }
}

const deletePost = async (req, res) => {
    try {

        await Post.deleteOne({ _id: req.body.id });
        res.status(200).send({ success: true, msg: "The post has been deleted!" });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });

    }
}

const LoadEditPost = async (req, res) => {
    try {

        var postData = await Post.findOne({ _id: req.params.id });

        res.render('admin/editPost', { post: postData });

    } catch (error) {
        console.log(error.message);

    }
}

const updatePost = async (req, res) => {

    try {

        await Post.findByIdAndUpdate({ _id: req.body.id }, {

            $set: {
                title: req.body.title,
                content: req.body.content,
                image: req.body.image
            }

        });


        res.status(200).send({ success: true, msg: "The post has been Updated!" });

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });

    }
}
const loadSettings = async (req, res) => {
    try {

        var setting = await Setting.findOne({});
        var postLimit = 0;
        if (setting != null) {
            postLimit = setting.post_limit

        }

        res.render('admin/setting', {limit:postLimit});



    } catch (error) {
        console.log(error.message);
    }
}

const saveSettings= async (req,res)=>{
    try {
        

        Setting.updateMany({}, {
            post_limit:req.body.limit
        },{upsert:true});
   
        res.status(200).send({success:true, msg: 'Settings Updated!'});
        

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
        
    }
}





module.exports = {
    blogSetup,
    dashboard,
    blogSetupSave,
    loadPostDashboard,
    addPost,
    securepassword,
    uploadPostImage,
    deletePost,
    LoadEditPost,
    updatePost,
    loadSettings,
    saveSettings
}