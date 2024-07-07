const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader); 
    if (!authHeader) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, "MERN-stack-developer", (error, decoded) => {
      if (error) {
        console.log("Token verification error:", error); 
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        console.log("Decoded token:", decoded); 
        req.user = decoded;
        next();
      }
    });
  } catch (err) {
    console.error("Middleware Error:", err.stack);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = authMiddleware;
