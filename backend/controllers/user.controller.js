//buissness logic for when user register on site
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
export const register =async (req,res)=>{
    try{
        const{fullname,email,phoneNumber,password,role}=req.body;
        if(!fullname||!email||!phoneNumber||!password||!role){
            return res.status(400).json({
                message:"data is not filled",
                success:false
            });

        };
        const file=req.file;
        
       
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const user=await User.findOne({email});//finone provided by mongoose
        if(user){
            return res.status(400).json({
                message:'user already exist with this emial',
                success:false,
            })
        }
        const hashedPassword =await bcrypt.hash(password,10);//USE bcrypt library whoes module is hash passsword in nodejs
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
            profile:{profilePhoto:cloudResponse.secure_url,
                
            }
        });
        return res.status(201).json({
            message:"Acoount created successfully.",
            success:true
        });
    }
    catch(error){
console.log(error);
return res.status(500).json({
    message: "Internal server error",
    success: false,
    });
}
}
export const login=async(req,res)=>{
    try{
        const{email,password,role}=req.body;
        if(!email||!password||!role){
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        };
        let user=await User.findOne({email});//User me se wo wala model nikal lae jiski emial id wo ho jo req body se ari use user me dal dia 
        if(!user){
            return res.status(400).json({
                messgae:"incorrect email or password.",
                success:false,
            })
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);//matching passwords
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"incorrect email or password.",
                success:false,
            })
        };
        if(role!=user.role){
            return res.status(400).json({
                message:"Account doesnt exist with current role.",
                success:false,
            })
        };
        const tokenData={
            userId:user._id//In Mongoose (or any MongoDB schema), the _id field is automatically created for each document (i.e., each user) unless specified otherwise. This _id field is a unique identifier for the user and is assigned by MongoDB.
            //You don’t need to explicitly define a userId field in your schema; the _id field serves this purpose. When a new user is created, Mongoose generates this _id, which you can access as user._id.
        }
        const token =await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});
        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
            message:'welcome back ${user.fullname}',
            user,//user eddit kr ke user._id bhi dal di or responce me bhej dia
            success:true
        })

    }catch(error){
console.log(error);
    }
}
export const logout =async (req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"you have been logggedout",
            success:true
        })
    }// logout kia to res me sab bheja or cokkie me se token ko hata dia maxage bhi cokkie ki 0 kr di
    catch(error){
        console.log(error);
    }
}
export const updateProfile=async(req,res)=>{
    try{
        const{fullname,email,phoneNumber,bio,skills}=req.body;
        const file=req.file;
        const fileUri=getDataUri(file);//claudiary ka kam h also relateed to datauri in util read about it
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        
        let skillsArray;
        if(skills){
            skillsArray=skills.split(",");
        }
        
        
        const userId =req.id;//pending see why this middlewhere(Custom Middleware: The req.id property is not a default property of the Express req object. It is typically set by custom middleware in your application. This middleware might assign a unique identifier to the request for tracking or logging purposes)
        let user =await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"user not found",
                success: false
            })
        }
        if(fullname)  user.fullname=fullname;
        if(email) user.email=email;
        if(phoneNumber) user.phoneNumber=phoneNumber;
        if(bio) user.profile.bio=bio;
        if(skillsArray) user.profile.skills=skillsArray;     
        //for resume left
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }
        await user.save();
        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).json({
            message:"profile updated successfully.",
            user,
            success:true
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false
        });

    }
};
