const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Worker = require("../models/workerModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.registerController = async (req, res) => {
  console.log("inside of the register controller");

  const { fullName, email, password, phoneNumber, role } = req.body;
  console.log(fullName, email, password, phoneNumber, role);

  try {
    // Validate required fields
    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role
    if (!["worker", "user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if the phone number already exists
    let existingUser = await User.findOne({ phoneNumber });
    if (!existingUser) {
      existingUser = await Worker.findOne({ phoneNumber });
    }

    if (existingUser) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    // Check if email already exists
    let existingEmailUser = await User.findOne({ email });
    if (!existingEmailUser) {
      existingEmailUser = await Worker.findOne({ email });
    }

    if (existingEmailUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user based on role
    let newUser;
    if (role === "worker" || role === "admin") {
      newUser = new Worker({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber, // Ensure phoneNumber is included
        role,
      });
    } else {
      newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber, // Ensure phoneNumber is included
        role,
      });
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log("insdie of the login controller");
  

  try {
    console.log(process.env.ADMIN_EMAIL);
    console.log(email);
    console.log(password);
    console.log(process.env.ADMIN_PASSWORD);
    
    
    // Check if the user is trying to log in as admin
    if (email ==process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {
      console.log("condition successfull");
      
      // Create a JWT token for admin

      const token = jwt.sign(
        { id: "admin", email: email, role: "admin" }, // Payload
        JWT_SECRET, // Secret key
        { expiresIn: "1h" } // Token expiration time
      );

      // Send the token and admin details in the response
      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          id: "admin",
          fullName: "Admin",
          email: email,
          role: "admin",
        },
      });
    }else{
      console.log("condition failed");
      
    }

    // Check if the user exists in either the Worker or User collection
    let user = await Worker.findOne({ email });
    if (!user) {
      user = await User.findOne({ email });
    }

    // If no user is found
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Prevent admin from logging in as worker
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin cannot log in as worker" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "365d" } // Token expiration time
    );

    // Send the token and user details in the response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};