const Worker = require("../models/workerModel");

exports.uploadWorkerDetails = async (req, res) => {
  console.log("Inside uploadWorkerDetails");

  try {
      const workerId = req.user.id; // Get worker ID from JWT

      if (!workerId) {
          return res.status(400).json({ message: "Worker ID is required" });
      }

      const { place, district, age, experience, serviceType } = req.body;

      if (!req.files || !req.files.profilePic || !req.files.resume) {
          return res.status(400).json({ message: "Profile picture and resume are required." });
      }

      const profilePicPath = req.files.profilePic[0].path;
      const resumePath = req.files.resume[0].path;

      const updatedWorker = await Worker.findByIdAndUpdate(
          workerId,
          { 
              place,
              district,
              age,
              experience,
              serviceType,
              profilePic: profilePicPath,
              resume: resumePath,
              isVerified: false  // Mark worker as pending verification
          },
          { new: true }
      );

      if (!updatedWorker) {
          return res.status(404).json({ message: "Worker not found" });
      }

      res.status(200).json({ message: "Worker details submitted for verification!", worker: updatedWorker });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};


//togglw worker availavibity
exports.toggleWorkerAvailability = async (req, res) => {
    try {
      const { availability } = req.body;
      const workerId = req.WorkerId; // Use req.WorkerId from JWT middleware
      
      // Find and update worker availability
      const worker = await Worker.findByIdAndUpdate(workerId, { availability }, { new: true });
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }
  
      res.status(200).json({ 
        message: "Worker availability updated successfully", 
        availability: worker.availability 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

// Get worker details by ID
exports.getWorkerDetails = async (req, res) => {
  try {
      const workerId = req.user.id; // Access worker ID from the decoded JWT payload

      const worker = await Worker.findById(workerId);

      if (!worker) {
          return res.status(404).json({ message: "Worker not found" });
      }

      res.status(200).json(worker);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all workers pending verification
// exports.getPendingWorkers = async (req, res) => {
//   try {
//       const pendingWorkers = await Worker.find({ isVerified: false });
//       res.status(200).json(pendingWorkers);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//   }
// };







// Get all workers with availability: true
// exports.getAvailableWorkers = async (req, res) => {
//   try {
//     // Fetch workers with availability: true
//     const workers = await Worker.find({ availability: true });
    
    
//     // If no workers are found, return a 404 response
//     if (workers.length === 0) {
//       return res.status(404).json({ message: "No available workers found." });
//     }

//     // Return the list of available workers
//     res.status(200).json(workers);
//   } catch (error) {
//     console.error("Error fetching workers:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };





