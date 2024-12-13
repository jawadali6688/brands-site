// middlewares/isAuthenticated.js

import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid token", success: false });
        } else if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token has expired", success: false });
        } else {
          return res.status(401).json({ message: "Authentication failed", success: false });
        }
      }

      req.id = decoded.userId;  // Attach userId from the token to the request
      next();
    });
  } catch (error) {
    console.error("Error in isAuthenticated middleware:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}

export default isAuthenticated;
