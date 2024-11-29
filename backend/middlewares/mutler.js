import multer from "multer";
// import express from "express";//e
// import { singleUpload } from "./path-to-multer-file";//e
// import { register } from "./path-to-controller-file";//e
// const router = express.Router();//e

// router.post("/register", singleUpload, register);//e
const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");