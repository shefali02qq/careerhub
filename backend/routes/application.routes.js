import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);//job ki id to which job u want to apply
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);//job ki id to which applicants have applied to see kon kon applie kia
router.route("/status/:id/update").post(isAuthenticated, updateStatus);//application ki id from apply
 

export default router;
