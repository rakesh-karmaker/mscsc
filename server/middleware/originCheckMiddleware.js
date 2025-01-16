const allowedOrigins = [process.env.APP_URL];

const originCheckMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    next();
  } else {
    console.log("Origin not allowed -", new Date().toUTCString(), origin);
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = originCheckMiddleware;
