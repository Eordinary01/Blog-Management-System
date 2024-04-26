const User = require('../models/Usermodel');

const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');

const adminController = require('../controllers/adminController');

const sendResetPasswordMail = async(name,email,token)=>{

    try {

       const transport =  nodemailer.createTransport({
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
            from:config.emailUser,
            to:email,
            subject:'Reset Password',
            html:'<p>Hii! '+name+', Please click here to <a href = "http://127.0.0.1:8800/reset-password?token='+token+'">Reset</a> your Password' 
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





const loadLogin = async(req,res)=>{

    try {

        res.render('login');
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const verifyLogin = async(req,res)=>{

    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if(userData){
            

            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){
                req.session.user_id = userData._id;
                req.session.is_admin = userData.is_admin;

                if (userData.is_admin ==1 ) {
                    res.redirect('/dashboard');
                    
                } else {
                    res.redirect('profile');
                    
                }

            }
            else{

                res.render('login', {message:"Email and Password is incorrect"});
            }
            
        }
        else{
            res.render('login', {message:"Email and Password is incorrect"});
        }


    } catch (error) {
        console.log(error.message);
        
    }
}

const profile = async(req,res)=>{
    try {
        res.send(' hii profile here !!');
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const logout = async(req,res)=>{
    try {

        req.session.destroy();
        res.redirect('logout');


        
    } catch (error) {
        console.log(error.message);
        
    }
}

const forgetLoad = async(req,res)=>{
    try {

        res.render('forget-password');
        
    } catch (error) {
        console.log(error.message);
        
    }

}

const forgetPasswordVerify = async(req,res)=>{
    try {

        const email = req.body.email;
        const userData =  await User.findOne({email:email})

        if(userData){

            const randomString = randomstring.generate();

            await User.updateOne({email:email}, {$set:{token:randomString} });
            sendResetPasswordMail(userData.name, userData.email, randomString);
            res.render('forget-password',{message:"Please check your mail to reset your Password! "});

        }
        else{
            res.render('forget-password',{message:"User email in incorrect!"});
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const resetPasswordLoad = async(req,res)=>{
    try {
        
        const token = req.query.token;
        const tokenData = await User.findOne({ token:token});
        
        if (tokenData) {

            res.render('reset-password', {user_id:tokenData._id});

            
        } else {
            res.render('404');
            
        }



    } catch (error) {
        console.log(erroe.message);
        
    }
}

const resetPassword = async(req,res)=>{
    try {

        const password = req.body.password;
        const user_id = req.body.user_id;


        const securePassword = await adminController.securepassword(password);
        await User.findByIdAndUpdate({_id:user_id}, {$set:{password:securePassword, token:'' } });

        res.redirect('/login');




        
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    profile,
    logout,
    forgetLoad,
    forgetPasswordVerify,
    resetPasswordLoad,
    resetPassword

}