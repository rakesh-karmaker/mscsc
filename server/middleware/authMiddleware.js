const jwt = require("jsonwebtoken");

// Verify if user is admin
exports.isAuthorized = async (req, res, next) => {
  try {
    const prefix = "Bearer ";
    const token = req.header("Authorization").split(prefix)[1];
    if (!token) return res.status(401).send({ message: "Access Denied" });
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).send({ message: "Access Denied" });
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid Token" });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).send({ message: "Access Denied" });
  next();
};
