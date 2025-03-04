const Worker = require("../models/workerModel");
const User = require('../models/userModel')

// Get all workers pending verification (only those who uploaded a resume)
exports.getPendingWorkers = async (req, res) => {
    try {
        const pendingWorkers = await Worker.find({ isVerified: false, resume: { $ne: "" } }); 
        console.log(pendingWorkers);
        
        res.status(200).json(pendingWorkers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Approve worker by admin
exports.verifyWorker = async (req, res) => {
    try {
        const workerId = req.params.id;

        const updatedWorker = await Worker.findByIdAndUpdate(
            workerId,
            { isVerified: true },
            { new: true }
        );

        if (!updatedWorker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.status(200).json({ message: "Worker verified successfully!", worker: updatedWorker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


//gets all the verified workers for admin pannel

exports.getVerifiedWorkers = async (req, res) => {
    try {
      // Fetch workers who are verified (regardless of availability)
      const workers = await Worker.find({ isVerified: true });
  
      // Check if any workers were found
      if (workers.length === 0) {
        return res.status(404).json({ message: "No verified workers found" });
      }
  
      // Return the list of verified workers
      res.status(200).json(workers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  // Block a worker
exports.blockWorker = async (req, res) => {
    try {
        const workerId = req.params.id;
        
        const updatedWorker = await Worker.findByIdAndUpdate(
            workerId,
            { isBlocked: true },
            { new: true }
        );

        if (!updatedWorker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.status(200).json({ message: "Worker blocked successfully!", worker: updatedWorker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Unblock a worker
exports.unblockWorker = async (req, res) => {
    try {
        const workerId = req.params.id;
        
        const updatedWorker = await Worker.findByIdAndUpdate(
            workerId,
            { isBlocked: false },
            { new: true }
        );

        if (!updatedWorker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.status(200).json({ message: "Worker unblocked successfully!", worker: updatedWorker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Block a user
exports.blockUser = async (req, res) => {
    console.log("inside of the block user");
    
    try {
        const userId = req.params.id;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User blocked successfully!", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Unblock a user
exports.unblockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isBlocked: false },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User unblocked successfully!", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};