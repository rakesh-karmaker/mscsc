const jwt = require("jsonwebtoken");

// Verify if user is admin
exports.isAdmin = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ message: "Access Denied" });

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(_id);
    if (user.role !== "admin")
      return res.status(403).send({ message: "Access Denied" });
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid Token" });
  }
};
