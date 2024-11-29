import mongoose from "mongoose";
const companySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    description:{
        type:String,
        
    },
    location:{
        type:String,
        
    },
    logo:{
        type:String,
      
    },
    userId:{
        type:String,
        ref:'user',
        required:true
    },
    
},{timestamps:true})
export const Company=mongoose.model("Company",companySchema);