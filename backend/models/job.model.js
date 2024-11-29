//schema for people who will give vacancy for job
import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
    type :String,
    required :true

    },
    requirements:[{
        type:String
    }],
    salary:{
        type:Number,
        required:true
    },
    experienceLevel:{
        type:Number,
        required:true

    },
    location:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        requied:true

    },
    position:{
        type:Number,
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    applications:[{//job me application ka ref dia taki yaha application wala model use kr pae to get the apllications info (same application me bhi job ka ref dia taki aplictaion me jan pae ki kon si job ke lie applie kia)
        type:mongoose.Schema.Types.ObjectId,
        ref:'Application',//requred true ni kia coz job dalte time it is not require jab koi apply krega tb it is require){ref:application mtlb application wala model
        
    }]
},{timestamps:true});
export const Job=mongoose.model("Job",jobSchema)

