const express = require("express");
const router = new express.Router();
const authController = require("../controllers/authController");
const jwtMiddleware = require("../middlewares/jwtMiddlewares");
const uploads = require("../middlewares/multerMiddlewares");
const { uploadWorkerDetails } = require("../controllers/workerController");
const { getPendingWorkers, verifyWorker } = require("../controllers/adminController"); // Import admin functions
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')


router.post("/register", authController.registerController);
router.post("/login", authController.loginController);

// Upload worker details with authentication
router.post( "/uploads",jwtMiddleware, uploads.fields([{ name: "profilePic", maxCount: 1 }, { name: "resume", maxCount: 1 }]), uploadWorkerDetails
);

// Fetch all workers pending verification (Admin)
router.get("/pending-workers", jwtMiddleware, getPendingWorkers);

// Approve worker (Admin)
router.put("/verify-worker/:id", jwtMiddleware, verifyWorker);

// Get all available and verified workers for user pannel
router.get("/available-verified",jwtMiddleware,userController.getAvailableAndVerifiedWorkers );

// Get all verified workers for admin pannel
router.get("/verified-workers",jwtMiddleware,adminController.getVerifiedWorkers );

// Block a worker
router.put("/block-worker/:id", jwtMiddleware, adminController.blockWorker);

// Unblock a worker
router.put("/unblock-worker/:id", jwtMiddleware, adminController.unblockWorker);

// 
router.get("/get-users", jwtMiddleware, adminController.getAllUsers);


// Block a user
router.put("/block-user/:id", jwtMiddleware, adminController.blockUser);

// Unblock a user
router.put("/unblock-user/:id", jwtMiddleware, adminController.unblockUser);

module.exports = router;
