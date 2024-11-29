import{Company} from "../models/company.model.js";

import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"



export const registerCompany=async (req,res)=>{
try{
const {companyName} =req.body;
if(!companyName){
    return res.status(400).json({
        message:"company name is required ",
        success:false
    });
}
let company=await Company.findOne({name:companyName}); 
if(company){
    return res.status(400).json({
        message:"company already registered.",
        success:false
    })
};
company=await Company.create({
    name:companyName,
    userId:req.id

});
return res.status(201).json({
    message:"company registered successfully.",
    company,
    success:true
});


}
catch(error){
console.log(error);
}
}
export const getCompany=async(req,res)=>{
    try{
        const userId=req.id;
        const companies=await Company.find({userId});
        if(!companies){
            return res.status(404).json({
                message:"Companies not foud.",
                success:false
            })
        }
        return res.status(200).json({

            companies,
            success: true
        });

    }
    catch(error){
        console.log(error);

    }

};
//User Dashboard: When a user logs in, they might have a dashboard that lists all the companies they have registered or are associated with. This controller would be used to fetch and display that list.
//Company Management Page: A page where the user can manage (view, edit, or delete) the companies they have registered.
export const getCompanyById =async(req,res)=>{
    try{
        const companyId=req.params.id;//seewhat pending
        const company=await Company.findById(companyId);
        if(!company){
    
            return res.status(404).json({
                message:"company not found.",
                success:false
            })
        }
        return res.status(200).json({
           company,
           success:true
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
}
// Company Details Page: When a user clicks on a company from the list to view more details about it, this controller would fetch the detailed information about that company.
// Editing Company Information: If a user wants to update the company information, the existing data would be retrieved using this controller to pre-fill the form fields.
export const updateCompany=async(req,res)=>{
    try{
        const {name,description,website,location}=req.body;
        const file=req.file;
        //cloudiray work
        const fileUri=getDataUri(file);
        const cloudResponse=await cloudinary.uploader.upload(fileUri.content);
        const logo=cloudResponse.secure_url;
        
        const updateData={name,description,website,location};
        const company=await Company.findByIdAndUpdate(req.params.id, updateData,{new:true});
        if(!company){
            return res.status(404).json({
                message:"comapny not found.",
                success:false
            })
        }
        return res.status(200).json({
            message:"company iinformation update.",
            company,
            success:true
        })

    }
    catch(error){
        console.log(error);
    }
}

