import {Job} from "../models/job.model.js";
//import redis from "../utils/redisClient.js";

// for admin to post job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
//FOR STUDENTS TO SEARCH
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";//This line extracts the keyword from the query parameters of the incoming request (e.g., ?keyword=developer).
        //If no keyword is provided, it defaults to an empty string ("").
        //GENERATING QUERY
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };//The query object is being created to filter job listings based on the keyword.
        //The $or operator allows the query to match either condition:
       // title: The job's title contains the keyword.
        ////description: The job's description contains the keyword.
        //$regex is used for pattern matching. It will search for the keyword as a substring, case-insensitively ($options: "i").
        //PENDING
        const jobs = await Job.find(query).populate({path: "company" }).sort({ createdAt: -1 });
        // Finds all job documents in the database that match the query criteria.
        // .populate({ path: "company" }): Retrieves additional details about the associated company for each job (assuming that "company" is a reference field).
        // .sort({ createdAt: -1 }): Sorts the results by the createdAt field in descending order, so the most recently created jobs appear first.
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// export const getAllJobs = async (req, res) => {
//     try {
//         const keyword = req.query.keyword || "";
//         const redisKey = `jobs:keyword:${keyword}`;

//         // 🔍 Check cache first
//         const cachedJobs = await redis.get(redisKey);
//         if (cachedJobs) {
//             return res.status(200).json({
//                 jobs: JSON.parse(cachedJobs),
//                 success: true,
//                 cached: true
//             });
//         }

//         //  Not in cache → Query MongoDB
//         const query = {
//             $or: [
//                 { title: { $regex: keyword, $options: "i" } },
//                 { description: { $regex: keyword, $options: "i" } },
//             ]
//         };

//         const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });

//         if (!jobs) {
//             return res.status(404).json({
//                 message: "Jobs not found.",
//                 success: false
//             });
//         }

//         // 💾 Store in Redis (cache for 60 seconds)
//         await redis.set(redisKey, JSON.stringify(jobs), 'EX', 60);

//         return res.status(200).json({
//             jobs,
//             success: true,
//             cached: false
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Server Error" });
//     }
// };
//  for student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        //pending
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).//pending
        populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
