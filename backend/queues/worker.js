// const { Worker } = require("bullmq");
// const connection = { host: "127.0.0.1", port: 6379 };
// const JobApplication = require("../models/applicationModel");

// const worker = new Worker("applications", async (job) => {
//   const { jobId, userId } = job.data;
  
//   // Simulate delay / send email etc.
//   await JobApplication.create({ job: jobId, user: userId });

//   console.log(`Processed application: ${userId} for job: ${jobId}`);
// }, { connection });
