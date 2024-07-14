import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// This middleware will only continue if the token is inside the local storage
const authenticateToken = (req, res, next) => {
  // Get token from header
  const token = req.header("jwt_token");

  // Check if there's no token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    // It is going to give us the user id (user: { id: user.id })
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authenticateToken;