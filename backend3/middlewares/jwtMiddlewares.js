const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    console.log("inside of the jwtMiddleware");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("no token");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    // console.log("token : ", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // console.log("decoded :", decoded);

        // Attach the userId and WorkerId to the request object
        req.user = decoded; // Attach the entire decoded payload
        req.userId = decoded.id; // Assuming the token payload contains `id` (userId)
        req.WorkerId = decoded.id; // Assuming the token payload contains `id` (WorkerId)

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = jwtMiddleware;