const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Fetch out token from req.header
  const token = req.header("x-auth-token");

  //Checking if token is not available.
  if (!token) {
    return res.status(401).json({ msg: "Access denied! No token!" });
  }

  try {
    //If token is there, proceed
    const tokenVerified = jwt.verify(token, process.env.jwtSecret);

    req.user = tokenVerified.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token!" });
  }
};