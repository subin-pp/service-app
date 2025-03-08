const Worker = require("../models/workerModel");

// Get all workers who are available and verified
exports.getAvailableAndVerifiedWorkers = async (req, res) => {
  try {
    // Fetch workers who are available and verified
    const workers = await Worker.find({ availability: true, isVerified: true,isBlocked:false });
    // console.log("worker",workers);
    

    // Check if any workers were found
    if (workers.length === 0) {
      return res.status(404).json({ message: "No available and verified workers found" });
    }

    // Return the list of workers
    res.status(200).json(workers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};