// installed express mongooose nodemon jsonwebtoken bcrypts cookies-parser dotenv.
import express, { application, response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import detenv from "dotenv";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.routes.js"
import connectDB from "./utils/db.js";//config ki jgh util lia h connection of database(atlas) to our server is made in it 
import path from "path";
detenv.config({});
 const app=express();
 app.get("/home",(req,response)=>{
   return response.status(200).json({
        message:"I am coming form backend",
      success:true
   }) 
});
const PORT =process.env.PORT || 3000;
const _dirname=path.resolve();
 //middlewares
 app.use(express.json());
 app.use(express.urlencoded({extended:true}));
 app.use(cookieParser());
 const corsOptions={
    origin:'https://careerhub-67o3.onrender.com',
    credentials:true
 } 
 app.use(cors(corsOptions));
 //all API here crested using routes
 app.use("/api/v1/user",userRoute);//mounting
 app.use("/api/v1/company",companyRoute);
 app.use("/api/v1/job",jobRoute);
 app.use("/api/v1/application",applicationRoute);
app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('*',(_,res)=>{
   res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
})

 connectDB();
 app.listen(PORT,()=>{
  // for connection of database first import cinnectDB from utils
    console.log(`server running at port ${PORT}`);
 })
